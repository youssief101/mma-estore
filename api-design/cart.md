# Cart API

**Module:** Cart
**Phase:** 2.9
**Depends on:** Authentication module (all endpoints require an authenticated customer), Products module (stock and price validation)

## Overview

This is the first of the Shopping Experience modules — where catalog data starts interacting with authenticated users. The Cart API is the bridge between browsing products and placing an order: it holds a user's selected items, quantities, and prices until checkout begins.

## Responsibilities

- Create a user's shopping cart
- Add products to the cart
- Update cart item quantities
- Remove items from the cart
- View current cart
- Empty the cart
- Calculate totals

**Out of scope:** payment, orders, inventory deduction (happens after a successful order), product management.

## Cart Model Reminder

```javascript
{
    _id: ObjectId,
    userID: ObjectId,

    items: [
        {
            productID: ObjectId,
            size: String,
            quantity: Number,
            unitPrice: Number
        }
    ],

    totalItems: Number,
    subtotal: Number,

    createdAt: Date,
    updatedAt: Date
}
```

### Why store `unitPrice` on the item?

If a T-shirt is $30 when added to the cart and the admin later raises the price to $40, the cart should not silently jump to $40 — it preserves the price at the moment the item was added. Checkout can optionally revalidate prices against the current catalog before payment.

---

## Endpoints

### GET /api/cart

Returns the authenticated user's cart.

**Auth:** Authenticated Customer

**Response — 200**
```json
{
    "success": true,
    "data": {
        "cart": {
            "_id": "...",
            "items": [
                {
                    "product": {
                        "_id": "...",
                        "name": "Paddy Pimblett T-Shirt",
                        "images": [
                            {
                                "url": "...",
                                "isPrimary": true
                            }
                        ]
                    },
                    "size": "L",
                    "quantity": 2,
                    "unitPrice": 34.99
                }
            ],
            "totalItems": 2,
            "subtotal": 69.98
        }
    }
}
```

The database stores `productID` only; the API populates it (via Mongoose's `populate()`) so the response includes the product details the frontend needs to render the cart.

---

### POST /api/cart/items

Adds an item to the cart.

**Auth:** Authenticated Customer

**Request**
```json
{
    "productId": "...",
    "size": "XL",
    "quantity": 2
}
```

**Behavior:** if the product already exists in the cart with the same size, quantity is increased on the existing line item; otherwise a new item is created.

**Response — 200**
```json
{
    "success": true,
    "message": "Item added to cart."
}
```

**Errors**

| Status | Reason |
|--------|--------|
| 400 | Invalid quantity |
| 404 | Product not found |
| 409 | Requested quantity exceeds available stock |
| 401 | Not authenticated |

---

### PATCH /api/cart/items/:productId

Updates the quantity (and optionally the size) of an existing cart item.

**Auth:** Authenticated Customer

**Request**
```json
{
    "size": "XL",
    "quantity": 4
}
```

---

### DELETE /api/cart/items/:productId

Removes a single item from the cart.

**Auth:** Authenticated Customer

**Response — 200**
```json
{
    "success": true,
    "message": "Item removed from cart."
}
```

---

### DELETE /api/cart

Clears every item from the cart.

**Auth:** Authenticated Customer

**Response — 200**
```json
{
    "success": true,
    "message": "Cart cleared successfully."
}
```

---

## Validation Rules

**Quantity**
- Required
- Integer
- Minimum 1

**Size**
- Must exist in `Product.inventory.variants` for the target product (e.g. S/M/L/XL are valid only if the product actually offers them)

**Stock validation**
- Before adding or updating an item, the backend checks `Product.inventory.variants.stock`
- If requested quantity exceeds available stock, respond `409 Conflict`

---

## Authorization Matrix

| Endpoint | Guest | Customer | Admin |
|----------|:-----:|:--------:|:-----:|
| GET /cart | ❌ | ✅ | ✅ |
| POST /cart/items | ❌ | ✅ | ✅ |
| PATCH /cart/items/:productId | ❌ | ✅ | ✅ |
| DELETE /cart/items/:productId | ❌ | ✅ | ✅ |
| DELETE /cart | ❌ | ✅ | ✅ |

There is no separate admin cart — admins may use these endpoints only when testing or impersonating a customer in development.

---

## Relationship with Products

The cart stores only `productID`, `size`, `quantity`, and `unitPrice`. When the cart is returned, `productID` is populated to include product name and primary image, avoiding data duplication while giving the frontend everything it needs to render the cart.

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

## Design Notes Considered and Deferred

**Variant identifiers instead of `size` string** — reasonable if colors are added later (e.g. Black XL vs. White XL), but out of scope for now since apparel currently varies by size only. `size: String` stays.

**Product snapshot per cart item** (storing `productName` / `primaryImage` directly on the item) — would protect against product renames or image changes after an item is added to the cart, but adds redundant data. For this project, keeping only `productID` and using `populate()` is simpler, demonstrates proper normalization, and avoids duplicated data.

---

## Schema Note

Keep `totalItems` and `subtotal` on the cart document itself (already reflected in the model above) rather than recalculating them on every request. Update both fields whenever the cart changes, so the frontend can read them directly instead of summing line items client-side.

---

## Summary

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/api/cart` | GET | Customer | Get current user's cart |
| `/api/cart/items` | POST | Customer | Add an item to the cart |
| `/api/cart/items/:productId` | PATCH | Customer | Update quantity or size |
| `/api/cart/items/:productId` | DELETE | Customer | Remove one item |
| `/api/cart` | DELETE | Customer | Clear the entire cart |

Next: **Orders API** (Phase 2.10), where the cart is converted into a completed purchase.
