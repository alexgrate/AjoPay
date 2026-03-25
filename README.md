# AjoPay 🪙

> **Built for the [ATJ x Tech Unfiltered Hackathon](https://x.com/afritechjournal?s=20)**  
> Submitted by [@team_grate2205](https://x.com/team_grate2205?s=20)

---

## What is AjoPay?

AjoPay is Nigeria's first fully automated rotating savings platform — digitizing the centuries-old tradition of **Ajo** and **Esusu**.

Millions of Nigerians participate in rotating savings circles every day. But defaults, distrust, and lack of accountability mean billions of naira are lost annually. AjoPay fixes that.

We took the community savings tradition Nigerians already trust and gave it:
- ✅ BVN verification
- ✅ Credit scoring
- ✅ Automated cycle management
- ✅ Paystack-powered secure payments
- ✅ A trust score system that rewards reliability

---

## Features

### 🔐 Identity & Trust
- BVN verification with credit score assessment on registration
- 4-tier trust system: **New Member → Building Trust → Trusted Member → Highly Trusted**
- Blacklist system for repeat defaulters
- Credit-gated group access based on risk level

### 👥 Group Management
- Create public or private savings groups
- Invite members via unique invite codes
- Admin join request approval system
- Payout order management (sequential — random & bidding coming soon)
- Group restart with automatic payout order rotation

### 💸 Payments
- Paystack-secured contribution payments
- ₦200 platform fee per transaction (covers processing)
- Automatic cycle progression after full contribution
- Payout release by group admin
- Bank account verification via Paystack resolve API
- Transfer recipient creation for automated payouts

### 📊 Cycle Lifecycle
```
Group Created (pending)
    ↓
Members Join + Admin Approves
    ↓
Admin Starts Group → Cycle 1 Opens
    ↓
All Members Contribute
    ↓
Admin Releases Payout to Recipient
    ↓
Next Cycle Auto-Created
    ↓
All Cycles Complete → Group Completed
    ↓
Admin Restarts → Last recipient goes first
```

### 🏦 Profile & Security
- Full profile management with bank details
- Real-time bank account name resolution
- Change password with token refresh
- Account deletion with password confirmation
- Notification preferences

---

## Tech Stack

| Layer       | Technology                        |
|-------------|-----------------------------------|
| Frontend    | React + Vite                      |
| Animations  | Framer Motion                     |
| Backend     | Django REST Framework             |
| Database    | PostgreSQL                        |
| Payments    | Paystack                          |
| Auth        | JWT (SimpleJWT)                   |
| Deployment  | Render (frontend) + Render (backend) |

---

## Live Demo

🌐 **Frontend:** [https://ajopay-1.onrender.com](https://ajopay-1.onrender.com)  
⚙️ **Backend API:** [https://ajopay-q1kp.onrender.com](https://ajopay-q1kp.onrender.com)

---

## Getting Started

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL

### Backend Setup

```bash
# Clone the repo
git clone https://github.com/alexgrate/AjoPay.git
cd ajopay/backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Fill in your values in .env

# Run migrations
python manage.py migrate

# Start server
python manage.py runserver
```

### Frontend Setup

```bash
cd ajopay/frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Set VITE_API_BASE_URL=http://localhost:8000

# Start dev server
npm run dev
```

### Environment Variables

**Backend `.env`**
```env
SECRET_KEY=your_django_secret_key
DEBUG=True
DATABASE_URL=postgresql://user:password@localhost:5432/ajopay
PAYSTACK_SECRET_KEY=sk_test_...
PAYSTACK_PUBLIC_KEY=pk_test_...
FRONTEND_URL=http://localhost:5173
ALLOWED_HOSTS=localhost,127.0.0.1
```

**Frontend `.env`**
```env
VITE_API_BASE_URL=http://localhost:8000
```

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/accounts/register/` | Register new user |
| POST | `/api/accounts/login/` | Login |
| POST | `/api/accounts/logout/` | Logout |
| GET/PATCH | `/api/accounts/profile/` | Get or update profile |
| POST | `/api/accounts/verify-bvn/` | Verify BVN + credit score |
| POST | `/api/accounts/change-password/` | Change password |
| DELETE | `/api/accounts/delete-account/` | Delete account |

### Groups
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET/POST | `/api/groups/` | List or create groups |
| GET/PATCH/DELETE | `/api/groups/:id/` | Group detail |
| POST | `/api/groups/:id/start/` | Start group |
| POST | `/api/groups/:id/restart/` | Restart completed group |
| POST | `/api/groups/:id/join/` | Join group |
| GET | `/api/groups/:id/cycles/` | Get group cycles |
| POST | `/api/groups/:id/cycles/:id/release/` | Release payout |
| GET | `/api/groups/invite/:code/` | Get group by invite code |

### Payments
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/payments/contribution/:id/initialize/` | Initialize payment |
| GET | `/api/payments/verify/:reference/` | Verify payment |
| POST | `/api/payments/webhook/paystack/` | Paystack webhook |
| GET | `/api/payments/banks/` | List banks |
| GET | `/api/payments/resolve-account/` | Resolve bank account name |

---

## Trust Score System

| Action | Points |
|--------|--------|
| Add phone number | +5 |
| Complete bank details | +10 |
| Pay contribution on time | +5 per cycle |
| Complete full cycle | +10 |
| First default | -20 + suspended |
| Second default | Score = 0 + blacklisted |

| Tier | Score Range | Color |
|------|-------------|-------|
| New Member | 0–20 | Gray |
| Building Trust | 21–50 | Gold |
| Trusted Member | 51–75 | Green |
| Highly Trusted | 76–100 | Purple |

---

## Known Limitations (Hackathon Scope)

- BVN verification is mocked — real Paystack BVN API requires CAC registration
- Paystack transfers are mocked (`MOCK_TRANSFER_xxx`) — real disbursements require completed Paystack compliance
- Random/bidding payout order hidden as "Coming Soon"
- No Celery Beat for automated defaulter processing yet
- Transaction ledger UI pending

---

## Roadmap

- [ ] Real Paystack BVN verification
- [ ] Live automated transfers post-CAC registration
- [ ] AI-powered smart group recommendations
- [ ] Random and bidding payout order
- [ ] Celery Beat for auto-defaulter processing
- [ ] Mobile app (React Native)
- [ ] Transaction ledger with export
- [ ] In-app notifications

---

## Team

Built solo for the **ATJ x Tech Unfiltered Hackathon** 🏆


**Team Page:** [@team_grate2205](https://x.com/team_grate2205?s=20)  
**GitHub:** [@TomiwaSowemimo](https://github.com/TomiwaSowemimo)

---

## Acknowledgements

Big shoutout to:
- 🎯 **[@__afritechjournal__](https://x.com/afritechjournal?s=20)** and **Tech Unfiltered** for hosting this hackathon
- 💚 **Paystack** for the incredible payments infrastructure
- 🇳🇬 Every Nigerian who has ever participated in Ajo or Esusu — this is for you

---

## License

MIT License — feel free to learn from it, build on it, and make Ajo digital everywhere.

---

<div align="center">
  <strong>Built with ❤️ in Nigeria 🇳🇬</strong><br/>
  <sub>AjoPay — Save Together. Grow Together.</sub>
</div>