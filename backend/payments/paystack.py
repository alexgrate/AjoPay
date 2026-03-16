import requests
from django.conf import settings

PAYSTACK_BASE = "https://api.paystack.co"

HEADERS = {
    "Authorization": f"Bearer {settings.PAYSTACK_SECRET_KEY}",
    "Content-Type": "application/json",
}

def initialize_transaction(email, amount_naira, reference, metadata=None, callback_url=None):
    payload = {
        "email":     email,
        "amount":    int(amount_naira * 100),  # kobo
        "reference": reference,
        "metadata":  metadata or {},
    }
    if callback_url:
        payload["callback_url"] = callback_url

    res = requests.post(
        f"{PAYSTACK_BASE}/transaction/initialize",
        json=payload,
        headers=HEADERS,
    )
    return res.json()


def verify_transaction(reference):
    res = requests.get(
        f"{PAYSTACK_BASE}/transaction/verify/{reference}",
        headers=HEADERS,
    )
    return res.json()


def create_transfer_recipient(account_name, account_number, bank_code):
    payload = {
        "type":           "nuban",
        "name":           account_name,
        "account_number": account_number,
        "bank_code":      bank_code,
        "currency":       "NGN",
    }
    res = requests.post(
        f"{PAYSTACK_BASE}/transferrecipient",
        json=payload,
        headers=HEADERS,
    )
    return res.json()


def initiate_transfer(amount_naira, recipient_code, reason="Ajo Payout"):
    payload = {
        "source":    "balance",
        "amount":    int(amount_naira * 100),  # kobo
        "recipient": recipient_code,
        "reason":    reason,
    }
    res = requests.post(
        f"{PAYSTACK_BASE}/transfer",
        json=payload,
        headers=HEADERS,
    )
    return res.json()


def get_banks():
    res = requests.get(
        f"{PAYSTACK_BASE}/bank?currency=NGN",
        headers=HEADERS,
    )
    return res.json()