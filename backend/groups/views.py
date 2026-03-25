from django.shortcuts import get_object_or_404
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Group, Membership, JoinRequest, Cycle, Contribution
from .serializers import GroupSerializer, GroupDetailSerializer, CreateGroupSerializer, MemberSerializer, JoinRequestSerializer
from .cycle_utils import create_cycle, handle_defaulters, release_payout, get_next_due_date
from datetime import date

class GroupViewset(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request):
        memberships = Membership.objects.filter(user=request.user).values_list("group", flat=True)
        groups = Group.objects.filter(id__in=memberships)
        serializer = GroupSerializer(groups, many=True)
        return Response(serializer.data)
    
    def create(self, request):
        serializer = CreateGroupSerializer(
            data = request.data,
            context = {"request": request},
        )
        if serializer.is_valid():
            group = serializer.save()
            return Response(
                {
                    "message": "Group created successfully",
                    "group": GroupDetailSerializer(group).data,
                },
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

    def retrieve(self, request, pk=None):
        group = get_object_or_404(Group, pk=pk)

        is_member = Membership.objects.filter(
            group=group, user=request.user
        ).exists()

        if not is_member:
            return Response(
                {"error": "You are not a member of this group"},
                status=status.HTTP_403_FORBIDDEN
            )
        serializer = GroupDetailSerializer(group)
        return Response(serializer.data)
    
    def partial_update(self, request, pk=None):
        group = get_object_or_404(Group, pk=pk)

        is_admin = Membership.objects.filter(
            group=group, user=request.user, role="admin"
        ).exists()

        if not is_admin:
            return Response(
                {"error": "Only group admins can update group details"},
                status = status.HTTP_403_FORBIDDEN
            )
        
        serializer = CreateGroupSerializer(
            group, data=request.data, partial=True
        )
        if serializer.is_valid():
            serializer.save()
            return Response(
                {
                    "message": "Group updated successfully",
                    "group": GroupDetailSerializer(group).data,
                }
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def destroy(self, request, pk=None):
        group = get_object_or_404(Group, pk=pk)

        if group.creator != request.user:
            return Response(
                {"error": "Only the group creator can delete this group"},
                status=status.HTTP_403_FORBIDDEN
            )
            
        group.delete()
        return Response(
            {"message": "Group deleted successfully"},
            status=status.HTTP_204_NO_CONTENT
        )
    
    @action(detail=False, methods=["post"], url_path="join")
    def join(self, request):
        invite_code = request.data.get("invite_code")
        if not invite_code:
            return Response(
                {"error": "Invite code is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        group = get_object_or_404(Group, invite_code=invite_code)

        if not request.user.bvn_verified:
            return Response(
                {"error": "Please verify your BVN before joining a group"},
                status=status.HTTP_403_FORBIDDEN,
            )
        if request.user.is_blacklisted:
            return Response(
                {"error": "Your account has been blacklisted"},
                status=status.HTTP_403_FORBIDDEN
            )
        if request.user.credit_score is not None and request.user.credit_score < 40:
            return Response(
                {"error": "Your credit score is too low to join any group"},
                status=status.HTTP_403_FORBIDDEN
            )
        if group.is_public and request.user.credit_score is not None and request.user.credit_score < 60:
            return Response(
                {
                    "error": "Your credit score is too low to join public groups",
                    "credit_score": request.user.credit_score,
                    "required": 60,
                    "suggestion": "Join a private group with an invite code instead",
                },
                status=status.HTTP_403_FORBIDDEN
            )
        if Membership.objects.filter(group=group, user=request.user).exists():
            return Response(
                {"error": "You are already a member of this group"},
                status=status.HTTP_400_BAD_REQUEST
            )
        if group.is_full:
            return Response(
                {"error": "This group is already full"},
                status=status.HTTP_400_BAD_REQUEST
            )
        if group.status not in ["pending", "active"]:
            return Response(
                {"error": "This group is no longer accepting members"},
                status=status.HTTP_400_BAD_REQUEST
            )

        JoinRequest.objects.filter(group=group, user=request.user).delete()

        membership = Membership.objects.create(
            group        = group,
            user         = request.user,
            role         = "member",
            payout_order = group.member_count + 1,
        )
        return Response(
            {
                "message": f"Successfully joined {group.name}",
                "group":   GroupDetailSerializer(group).data,
            },
            status=status.HTTP_201_CREATED
        )

    @action(detail=True, methods=["post"], url_path="request-join")
    def request_join(self, request, pk=None):
        group = get_object_or_404(Group, pk=pk)

        if not request.user.bvn_verified:
            return Response(
                {"error": "Please verify your BVN before joining a group"},
                status=status.HTTP_403_FORBIDDEN,
            )

        if group.is_public and request.user.credit_score < 60:
            return Response(
                {
                    "error": "Your credit score is too low to join public groups",
                    "credit_score":  request.user.credit_score,
                    "required":      60,
                    "suggestion":    "Join a private group with an invite code instead",
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        if request.user.credit_score and request.user.credit_score < 40:
            return Response(
                {"error": "Your credit score is too low to join any group"},
                status=status.HTTP_403_FORBIDDEN,
            )

        if Membership.objects.filter(group=group, user=request.user).exists():
            return Response(
                {"error": "You are already a member of this group"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if group.is_full:
            return Response(
                {"error": "This group is already full"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if group.status not in ["pending", "active"]:
            return Response(
                {"error": "This group is no longer accepting members"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if JoinRequest.objects.filter(group=group, user=request.user, status="pending").exists():
            return Response(
                {"error": "You already have a pending request for this group"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        join_request = JoinRequest.objects.create(
            group   = group,
            user    = request.user,
            message = request.data.get("message", ""),
        )
        return Response(
            {
                "message": f"Join request sent to {group.name}",
                "request": JoinRequestSerializer(join_request).data,
            },
            status=status.HTTP_201_CREATED,
        )


    @action(detail=True, methods=["get"], url_path="requests")
    def list_requests(self, request, pk=None):
        group = get_object_or_404(Group, pk=pk)
        is_admin = Membership.objects.filter(
            group=group, user=request.user, role="admin"
        ).exists()
        if not is_admin:
            return Response(
                {"error": "Only admins can view join requests"},
                status=status.HTTP_403_FORBIDDEN,
            )
        requests = JoinRequest.objects.filter(group=group, status="pending")
        return Response(JoinRequestSerializer(requests, many=True).data)
    

    @action(detail=True, methods=["post"], url_path="requests/(?P<request_id>[^/.]+)/accept")
    def accept_request(self, request, pk=None, request_id=None):
        group = get_object_or_404(Group, pk=pk)
        is_admin = Membership.objects.filter(
            group=group, user=request.user, role="admin"
        ).exists()
        if not is_admin:
            return Response(
                {"error": "Only admins can accept join requests"},
                status=status.HTTP_403_FORBIDDEN,
            )
        join_request = get_object_or_404(
            JoinRequest, pk=request_id, group=group, status="pending"
        )
        if group.is_full:
            return Response(
                {"error": "The group is now full"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if join_request.user.is_blacklisted:
            return Response(
                {"error": "This user has been blacklisted from the platform"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if join_request.user.credit_score and join_request.user.credit_score < 40:
            return Response(
                {"error": "This user's credit score is too low to join groups"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        membership = Membership.objects.create(
            group        = group,
            user         = join_request.user,
            role         = "member",
            payout_order = group.member_count + 1,
        )
        join_request.status = "accepted"
        join_request.save()

        return Response({
            "message":    f"{join_request.user.full_name} has been added to {group.name}",
            "membership": MemberSerializer(membership).data,
            "request":    JoinRequestSerializer(join_request).data,
        })


    @action(detail=True, methods=["post"], url_path="requests/(?P<request_id>[^/.]+)/reject")
    def reject_request(self, request, pk=None, request_id=None):
        group = get_object_or_404(Group, pk=pk)
        is_admin = Membership.objects.filter(
            group=group, user=request.user, role="admin"
        ).exists()
        if not is_admin:
            return Response(
                {"error": "Only admins can reject join requests"},
                status=status.HTTP_403_FORBIDDEN,
            )

        join_request = get_object_or_404(JoinRequest, pk=request_id, group=group, status="pending")
        join_request.status = "rejected"
        join_request.save()

        return Response(
            {
                "message": f"Request from {join_request.user.full_name} has been rejected",
                "request": JoinRequestSerializer(join_request).data,
            }
        )
    
    @action(detail=True, methods=["delete"], url_path="request-join/cancel")
    def cancel_request(self, request, pk=None):
        group = get_object_or_404(Group, pk=pk)
        join_request = JoinRequest.objects.filter(
            group=group, user=request.user, status="pending"
        ).first()
        if not join_request:
            return Response(
                {"error": "You have no pending request for this group"},
                status=status.HTTP_404_NOT_FOUND,
            )
        join_request.delete()
        return Response({"message": "Join request cancelled"})
    
    @action(detail=False, methods=["get"], url_path="public", permission_classes=[permissions.IsAuthenticated])
    def public_groups(self, request):
        my_memberships = Membership.objects.filter(user=request.user).values_list("group", flat=True)
        groups = Group.objects.filter(
            is_public=True,
            status__in=["pending", "active"],
        ).exclude(id__in=my_memberships)
        serializer = GroupSerializer(groups, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=["post"], url_path="leave")
    def leave(self, request, pk=None):
        group = get_object_or_404(Group, pk=pk)
        membership = Membership.objects.filter(group=group, user=request.user).first()
        if not membership:
            return Response(
                {"error": "You are not a member of this group"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if group.creator == request.user:
            return Response(
                {"error": "Group creator cannot leave. Delete the group instead."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if group.status == "active":
            return Response(
                {"error": "You cannot leave a group while a cycle is active. Wait for the current cycle to complete."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        membership.delete()
        return Response({"message": f"You have left {group.name}"}, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=["get"], url_path="invite/(?P<code>[^/.]+)")
    def invite_preview(self, request, code=None):
        group = get_object_or_404(Group, invite_code=code)
        return Response(GroupSerializer(group).data)
    

    @action(detail=True, methods=["delete"], url_path="members/(?P<user_id>[^/.]+)")
    def remove_member(self, request, pk=None, user_id=None):
        group = get_object_or_404(Group, pk=pk)
        is_admin = Membership.objects.filter(
            group=group, user=request.user, role="admin"
        ).exists()
        if not is_admin:
            return Response(
                {"error": "Only admins can remove members"},
                status=status.HTTP_403_FORBIDDEN,
            )
        membership = get_object_or_404(Membership, group=group, user_id=user_id)
        if membership.user == group.creator:
            return Response(
                {"error": "Cannot remove the group creator"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        
        membership.delete()
        return Response({"message": "Member removed successfully"}, status=status.HTTP_200_OK)
    
    @action(detail=True, methods=["get"], url_path="my-deposit")
    def my_deposit(self, request, pk=None):
        group = get_object_or_404(Group, pk=pk)

        membership = Membership.objects.filter(
            group=group, user=request.user
        ).first()

        if not membership:
            return Response(
                {"error": "You are not a member of this group"},
                status=status.HTTP_403_FORBIDDEN,
            )

        deposit = getattr(membership, "deposit", None)

        return Response({
            "membership_id":  membership.id,
            "deposit_paid":   membership.deposit_paid,
            "deposit_amount": membership.group.contribution_amount,
            "deposit_status": deposit.status if deposit else "not_initiated",
            "is_suspended":   membership.is_suspended,
            "is_active":      membership.is_active_member,
        })
    
    @action(detail=True, methods=["post"], url_path="start")
    def start_group(self, request, pk=None):
        group = get_object_or_404(Group, pk=pk)

        if group.creator != request.user:
            return Response(
                {"error": "Only the group creator can start the group"},
                status=status.HTTP_403_FORBIDDEN,
            )
        if group.status != "pending":
            return Response(
                {"error": f"Group is already {group.status}"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        active_members = Membership.objects.filter(
            group=group, is_suspended=False
        )

        if active_members.count() < 2:
            return Response(
                {"error": "Need at least 2 active members to start"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        group.status = "active"
        group.save(update_fields=["status"])

        due_date = get_next_due_date(group.start_date, group.frequency)
        cycle    = create_cycle(group, cycle_number=1, due_date=due_date)

        return Response({
            "message":       "Group started successfully. Cycle 1 is now open.",
            "cycle_number":  cycle.cycle_number,
            "due_date":      cycle.due_date,
            "recipient":     cycle.recipient.user.full_name if cycle.recipient else None,
            "payout_amount": cycle.payout_amount,
            "members_count": active_members.count(),
        })


    @action(detail=True, methods=["get"], url_path="cycles")
    def list_cycles(self, request, pk=None):
        group = get_object_or_404(Group, pk=pk)

        is_member = Membership.objects.filter(
            group=group, user=request.user
        ).exists()

        if not is_member:
            return Response(
                {"error": "You are not a member of this group"},
                status=status.HTTP_403_FORBIDDEN,
            )

        is_admin = Membership.objects.filter(
            group=group, user=request.user, role="admin"
        ).exists()

        cycles = Cycle.objects.filter(group=group).prefetch_related(
            "contributions__member__user"
        )

        data = []
        for cycle in cycles:
            contributions = cycle.contributions.all()

            cycle_data = {
                "id":             cycle.id,
                "cycle_number":   cycle.cycle_number,
                "status":         cycle.status,
                "due_date":       cycle.due_date,
                "payout_amount":  cycle.payout_amount,
                "recipient_name": cycle.recipient.user.full_name if cycle.recipient else None,
                "payout_released_at": cycle.payout_released_at,
                "contributions_summary": {
                    "total":    contributions.count(),
                    "paid":     contributions.filter(status="paid").count(),
                    "pending":  contributions.filter(status="pending").count(),
                    "defaulted": contributions.filter(status__in=["defaulted", "covered_by_deposit"]).count(),
                },
            }

            if is_admin:
                cycle_data["blocking_members"] = [
                    {
                        "name":  c.member.user.full_name,
                        "email": c.member.user.email,
                    }
                    for c in contributions.filter(status="pending")
                ]

            data.append(cycle_data)

        return Response(data)


    @action(detail=True, methods=["post"], url_path="cycles/(?P<cycle_id>[^/.]+)/release")
    def release_cycle_payout(self, request, pk=None, cycle_id=None):
        group = get_object_or_404(Group, pk=pk)

        is_admin = Membership.objects.filter(
            group=group, user=request.user, role="admin"
        ).exists()

        if not is_admin:
            return Response(
                {"error": "Only admins can release payouts"},
                status=status.HTTP_403_FORBIDDEN,
            )

        cycle = get_object_or_404(Cycle, pk=cycle_id, group=group)

        success, message = release_payout(cycle, released_by=request.user)

        if not success:
            return Response(
                {"error": message},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response({
            "message":       message,
            "cycle_number":  cycle.cycle_number,
            "recipient":     cycle.recipient.user.full_name if cycle.recipient else None,
            "payout_amount": cycle.payout_amount,
            "released_at":   cycle.payout_released_at,
            "next_cycle":    group.current_cycle if group.status == "active" else None,
        })


    @action(detail=True, methods=["post"], url_path="cycles/(?P<cycle_id>[^/.]+)/process-defaulters")
    def process_defaulters(self, request, pk=None, cycle_id=None):
        group = get_object_or_404(Group, pk=pk)

        is_admin = Membership.objects.filter(
            group=group, user=request.user, role="admin"
        ).exists()

        if not is_admin:
            return Response(
                {"error": "Only admins can process defaulters"},
                status=status.HTTP_403_FORBIDDEN,
            )

        cycle = get_object_or_404(Cycle, pk=cycle_id, group=group)

        if date.today() < cycle.due_date:
            return Response(
                {"error": f"Due date hasn't passed yet. Due: {cycle.due_date}"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if cycle.status == "paid_out":
            return Response(
                {"error": "This cycle has already been paid out"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        defaulted = handle_defaulters(cycle)

        return Response({
            "message":          f"Defaulters processed. {len(defaulted)} member(s) affected.",
            "defaulted_members": defaulted,
            "cycle_status":      cycle.status,
            "ready_for_payout":  cycle.status == "contributions_complete",
        })


    @action(detail=True, methods=["get"], url_path="my-contributions")
    def my_contributions(self, request, pk=None):
        group = get_object_or_404(Group, pk=pk)

        membership = Membership.objects.filter(
            group=group, user=request.user
        ).first()

        if not membership:
            return Response(
                {"error": "You are not a member of this group"},
                status=status.HTTP_403_FORBIDDEN,
            )

        contributions = Contribution.objects.filter(
            member=membership
        ).select_related("cycle")

        data = [
            {
                "id":             c.id,
                "cycle_number":   c.cycle.cycle_number,
                "cycle_due_date": c.cycle.due_date,
                "amount":         c.amount,
                "status":         c.status,
                "paid_at":        c.paid_at,
            }
            for c in contributions
        ]

        return Response({
            "membership_id": membership.id,
            "contributions": data,
            "summary": {
                "total":     len(data),
                "paid":      sum(1 for c in data if c["status"] == "paid"),
                "pending":   sum(1 for c in data if c["status"] == "pending"),
                "defaulted": sum(1 for c in data if c["status"] in ["defaulted", "covered_by_deposit"]),
            }
        })
    

    @action(detail=True, methods=["post"], url_path="restart")
    def restart_group(self, request, pk=None):
        group = get_object_or_404(Group, pk=pk)

        if group.creator != request.user:
            return Response(
                {"error": "Only the group creator can restart the group"},
                status=status.HTTP_403_FORBIDDEN,
            )
        if group.status != "completed":
            return Response(
                {"error": "Only completed groups can be restarted"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        memberships = Membership.objects.filter(
            group=group,
            is_suspended=False,
        ).order_by("payout_order")

        if memberships.count() < 2:
            return Response(
                {"error": "Need at least 2 active members to restart"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        sorted_ids = [m.id for m in memberships]
        rotated_ids = [sorted_ids[-1]] + sorted_ids[:-1]

        for new_order, membership_id in enumerate(rotated_ids, start=1):
            Membership.objects.filter(id=membership_id).update(
                payout_order=new_order,
                has_received_payout=False,
            )

        from .models import Cycle, Contribution, MemberDebt
        Contribution.objects.filter(cycle__group=group).delete()
        MemberDebt.objects.filter(cycle__group=group).delete()
        Cycle.objects.filter(group=group).delete()

        group.status = "active"
        group.current_cycle = 0
        group.save(update_fields=["status", "current_cycle"])

        from .cycle_utils import create_cycle, get_next_due_date
        due_date = get_next_due_date(group.start_date, group.frequency)
        cycle    = create_cycle(group, cycle_number=1, due_date=due_date)

        return Response({
            "message":       f"{group.name} has been restarted. New cycle order applied.",
            "cycle_number":  cycle.cycle_number,
            "due_date":      cycle.due_date,
            "recipient":     cycle.recipient.user.full_name if cycle.recipient else None,
            "payout_amount": cycle.payout_amount,
            "members_count": memberships.count(),
        })