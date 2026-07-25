# Orders API

**Module:** Orders
**Phase:** 2.10
**Depends on:** Authentication, Users, Products (inventory), Cart, Addresses, Payment

## Overview

This is arguably the most important module in the backend — it ties together nearly every other module. An order is a **snapshot** of a purchase at a specific point in time, and must not depend on live product data after it's created. If a product's name or image changes after purchase, the customer's past order should still show what they actually bought. For that reason, Orders intentionally denormalize `productName`, `productImage`, and `unitPrice` at the time of purchase, rather than referencing live product data. This is correct design for a transactional record, not a modeling shortcut.

## Responsibilities

- Creating orders from the cart
- Viewing order history
- Viewing order details
- Updating order status (Admin)
- Cancelling orders
- Finding orders
- Inventory deduction
- Order confirmation

**Out of scope:** product management, authentication, cart management, payment processing (handled by the Payment API).

## Order Model Reminder

```javascript
{
    _id: ObjectId,
    orderNumber: String,
    userID: ObjectId,

    shippingAddress: {
        fullName: String,
        phone: String,
        street: String,
        city: String,
        governorate: String,
        postalCode: String,
        country: String
    },

    items: [
        {
            productID: ObjectId,
            productName: String,
            productImage: String,
            size: String,
            quantity: Number,
            unitPrice: Number,
            totalPrice: Number
        }
    ],

    subtotal: Number,
    shippingCost: Number,
    discount: Number,
    totalAmount: Number,

    paymentMethod: String,
    paymentStatus: String,
    orderStatus: String,

    createdAt: Date,
    updatedAt: Date
}
```

## Order Lifecycle

```
Cart
  ↓
Checkout
  ↓
Validate Inventory
  ↓
Validate Payment
  ↓
Create Order
  ↓
Reduce Inventory
  ↓
Clear Cart
  ↓
Return Order Confirmation
```

---

## Endpoints

### POST /api/orders

Creates an order from the current user's cart.

**Auth:** Authenticated Customer

**Request**
```json
{
    "addressId": "...",
    "paymentMethod": "Visa"
}
```

**Backend process:** verify user → retrieve cart → verify inventory → validate payment → create order → deduct inventory → empty cart → return confirmation.

**Response — 201**
```json
{
    "success": true,
    "message": "Order placed successfully.",
    "data": {
        "orderId": "...",
        "orderNumber": "ORD-202600001"
    }
}
```

**Errors**

| Status | Reason |
|--------|--------|
| 400 | Cart is empty |
| 400 | Invalid address |
| 400 | Invalid payment method |
| 409 | Insufficient inventory |
| 401 | Unauthorized |

---

### GET /api/orders

Returns the current user's order history.

**Auth:** Customer

**Query Parameters**

| Parameter | Description |
|-----------|-------------|
| status | Pending, Paid, Delivered, ... |
| page | Pagination |
| limit | Pagination |
| sort | createdAt |

**Example**
```
GET /api/orders?status=Delivered
```

---

### GET /api/orders/:orderId

Returns full order details — shipping address, products, payment, totals, and status.

**Auth:** Customer (owner) or Admin

---

### GET /api/orders/find

Backs the "Find Your Order" page, letting a customer locate an order without necessarily being logged in (subject to the security policy adopted).

**Auth:** Public*

**Example**
```
GET /api/orders/find?orderNumber=ORD-202600021
GET /api/orders/find?email=user@email.com&orderNumber=ORD-202600021
```

---

### PATCH /api/orders/:orderId/cancel

Cancels an eligible order and restores inventory.

**Auth:** Customer (owner) or Admin

**Rules:** cancellable while `Pending` or `Paid`. Not cancellable once `Delivered`.

---

### PATCH /api/orders/:orderId/status

Updates the order status.

**Auth:** Admin

**Request**
```json
{
    "orderStatus": "Shipped"
}
```

**Possible statuses:** `Pending`, `Paid`, `Shipped`, `Delivered`, `Cancelled`

---

## Validation Rules

**Payment method** — from `constants.json`: `Visa`, `Mastercard`, `Gift Card`

**Payment status** — enum: `Pending`, `Paid`, `Failed`, `Refunded`

**Order status** — enum: `Pending`, `Paid`, `Shipped`, `Delivered`, `Cancelled`

---

## Authorization Matrix

| Endpoint | Guest | Customer | Admin |
|----------|:-----:|:--------:|:-----:|
| POST /orders | ❌ | ✅ | ✅ |
| GET /orders | ❌ | ✅ | ✅ |
| GET /orders/:orderId | ❌ | Owner | ✅ |
| GET /orders/find | ✅* | ✅ | ✅ |
| PATCH /orders/:orderId/cancel | ❌ | Owner | ✅ |
| PATCH /orders/:orderId/status | ❌ | ❌ | ✅ |

\* If guest order lookup by order number + email is supported.

---

## Relationship with Other Modules

**Cart** — `POST /orders` reads the cart, then deletes it once the order is created.

**Products** — inventory is decreased when the order is created.

**Users** — every order belongs to a `userID`.

**Addresses** — the selected address is copied into the order as a snapshot, so future address edits never affect past orders.

**Payment** — payment is validated before the order is created.

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

**Order number** — never expose MongoDB's `_id` to customers. Generate a human-readable identifier (e.g. `ORD-202600001`) for use on the Find Your Order page and in customer-facing communication.

**Payment reference** — add `paymentReference: String` (e.g. `VISA_923847923`, `SIM_000123`) to support later integration with a real payment provider such as Stripe.

**Status history** — in addition to the current `orderStatus`, keep a timeline:

```javascript
statusHistory: [
    {
        status: String,
        changedAt: Date,
        changedBy: ObjectId
    }
]
```

This lets the admin dashboard show the full progression (`Pending → Paid → Shipped → Delivered`) instead of only the current state.

---

## Summary

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/api/orders` | POST | Customer | Create an order from the current cart |
| `/api/orders` | GET | Customer | View current user's order history |
| `/api/orders/:orderId` | GET | Owner/Admin | View order details |
| `/api/orders/find` | GET | Public* | Find an order by order number (and email if applicable) |
| `/api/orders/:orderId/cancel` | PATCH | Owner/Admin | Cancel an eligible order |
| `/api/orders/:orderId/status` | PATCH | Admin | Update the order status |

---

## Looking Ahead: Payment

`paymentMethod` and `paymentStatus` stay on the Order since they describe the order's state, but a separate `payments` collection is worth introducing alongside the Payment API to track individual payment attempts, transaction references, failures, and refunds — keeping payment processing concerns separate from order management while Orders remains the authoritative record of what was purchased.
