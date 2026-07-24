# Gift Cards API

**Module:** Gift Cards
**Phase:** 2.11
**Depends on:** Authentication, Orders (created on purchase), Payment

## Overview

Gift Cards get their own module rather than being folded into Products because they have a lifecycle Products doesn't — purchase → activation → redemption → expiration — and represent stored value rather than physical inventory. A gift card is essentially a prepaid balance tied to a unique code, not a stocked item.

## Responsibilities

- List available gift card designs
- Purchase gift cards
- Redeem gift cards
- Check gift card balance
- Admin CRUD
- Activate/deactivate gift cards

**Out of scope:** orders (except creating a gift card after purchase), payment processing, product inventory.

## Gift Card Model Reminder

```javascript
{
    _id: ObjectId,
    code: String,
    amount: Number,
    remainingBalance: Number,
    purchaserID: ObjectId,
    recipientEmail: String,
    message: String,
    status: String,
    expirationDate: Date,
    createdAt: Date,
    updatedAt: Date
}
```

### Why both `amount` and `remainingBalance`?

A $100 gift card that's had $40 spent on it needs `amount = 100` and `remainingBalance = 60` tracked separately — without a running balance field, partial redemption across multiple orders isn't possible.

### Gift Card Status

Add to `constants.json`:
```json
{
    "GiftCardStatus": ["Active", "Redeemed", "Expired", "Cancelled"]
}
```

---

## Endpoints

### GET /api/gift-cards

Returns available gift card **templates** — not purchased/issued cards.

**Auth:** Public

**Response — 200**
```json
{
    "success": true,
    "data": {
        "giftCards": [
            { "amount": 50, "image": "..." },
            { "amount": 100, "image": "..." }
        ]
    }
}
```

---

### POST /api/gift-cards

Purchases a gift card.

**Auth:** Authenticated Customer

**Request**
```json
{
    "amount": 100,
    "recipientEmail": "friend@example.com",
    "message": "Happy Birthday!"
}
```

**Backend process:** generate unique code → create gift card → process payment → persist.

**Response — 201**
```json
{
    "success": true,
    "message": "Gift card purchased successfully."
}
```

---

### GET /api/gift-cards/my

Returns every gift card purchased by the authenticated user.

**Auth:** Customer

---

### GET /api/gift-cards/:giftCardId

Returns code, balance, expiration, and recipient for one gift card.

**Auth:** Owner or Admin

---

### POST /api/gift-cards/redeem

Redeems a gift card during checkout.

**Auth:** Authenticated Customer

**Request**
```json
{
    "code": "UFC-7HF82-JSKD2"
}
```

**Backend checks:** exists, active, not expired, `remainingBalance > 0`. If valid, the balance is applied during checkout.

---

### GET /api/gift-cards/balance

Checks a gift card's remaining balance.

**Auth:** Customer

**Example**
```
GET /api/gift-cards/balance?code=UFC-7HF82-JSKD2
```

**Response — 200**
```json
{
    "remainingBalance": 65
}
```

---

### PATCH /api/gift-cards/:giftCardId/cancel

Sets `status = Cancelled`.

**Auth:** Admin

---

### PATCH /api/gift-cards/:giftCardId/status

Updates a gift card's status directly.

**Auth:** Admin

**Request**
```json
{
    "status": "Expired"
}
```

---

## Validation Rules

**Amount**
- Restricted to fixed denominations from `constants.json`: `25`, `50`, `100`, `250`, `500`

**Code**
- Unique, backend-generated — the customer never chooses it
- Example: `UFC-7HF82-JSKD2`

**Remaining balance**
- Must satisfy `0 ≤ remainingBalance ≤ amount`

**Expiration**
- Example policy: 2 years after purchase

---

## Authorization Matrix

| Endpoint | Guest | Customer | Admin |
|----------|:-----:|:--------:|:-----:|
| GET /gift-cards | ✅ | ✅ | ✅ |
| POST /gift-cards | ❌ | ✅ | ✅ |
| GET /gift-cards/my | ❌ | ✅ | ✅ |
| GET /gift-cards/:id | ❌ | Owner | ✅ |
| POST /gift-cards/redeem | ❌ | ✅ | ✅ |
| GET /gift-cards/balance | ❌ | ✅ | ✅ |
| PATCH /gift-cards/:id/cancel | ❌ | ❌ | ✅ |
| PATCH /gift-cards/:id/status | ❌ | ❌ | ✅ |

---

## Relationship with Orders

**Purchase flow**
```
Gift Card Purchase
        ↓
Payment succeeds
        ↓
Create Order
        ↓
Create Gift Card
        ↓
Return generated code
```

**Redemption flow**
```
Checkout
   ↓
Validate Gift Card
   ↓
Deduct Balance
   ↓
Update remainingBalance
   ↓
Complete Order
```

The Order records that a gift card was used as a payment method; the Gift Cards collection owns the balance and lifecycle of the card itself.

---

## Response Standard

**Success**
```json
{
    "success": true,
    "message": "...",
    "data": {}
}
```

**Failure**
```json
{
    "success": false,
    "message": "..."
}
```

---

## Schema Notes

**Gift card number** — generate a human-readable identifier (e.g. `GC-2026-000001`) instead of exposing MongoDB's `_id`, for easier administration and customer support.

**Redemption history** — a gift card may be used across multiple orders, so track that history:
```javascript
redemptionHistory: [
    {
        orderID: ObjectId,
        amountUsed: Number,
        redeemedAt: Date
    }
]
```
This supports admin auditing and lets customers see how their balance changed over time.

**Separate templates from issued cards (recommended)** — distinguish between:
- **Gift Card Templates** — the designs shown on the Gift Cards page (e.g. "$50 Birthday", "$100 Championship")
- **Issued Gift Cards** — the unique cards generated after purchase

Introduce a `giftCardTemplates` collection:
```javascript
{
    _id: ObjectId,
    name: String,
    image: String,
    amount: Number,
    active: Boolean,
    createdAt: Date,
    updatedAt: Date
}
```

Each document in `giftCards` then references a template via `templateID: ObjectId`, avoiding duplicated design data across thousands of issued cards — the same normalized pattern already used for Products, Brands, Categories, Fighters, and Events.

---

## Summary

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/api/gift-cards` | GET | Public | List available gift card templates |
| `/api/gift-cards` | POST | Customer | Purchase a gift card |
| `/api/gift-cards/my` | GET | Customer | View purchased gift cards |
| `/api/gift-cards/:giftCardId` | GET | Owner/Admin | View gift card details |
| `/api/gift-cards/redeem` | POST | Customer | Redeem a gift card during checkout |
| `/api/gift-cards/balance` | GET | Customer | Check remaining balance |
| `/api/gift-cards/:giftCardId/cancel` | PATCH | Admin | Cancel a gift card |
| `/api/gift-cards/:giftCardId/status` | PATCH | Admin | Update gift card status |

Consistent with the rest of the architecture: normalized data, RESTful endpoints, clear separation of responsibilities, and support for both the Admin Dashboard and the customer shopping flow.
