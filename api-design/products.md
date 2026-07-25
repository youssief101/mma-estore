# Products API

**Module:** Products
**Phase:** 2.3
**Depends on:** Authentication module (Admin-gated write operations)

## Overview

If Authentication is the site's identity layer, Products is the business itself. Nearly every page in the Angular app — Home, Fighters, Events, T-Shirts, Hats, Equipment, Sale, Search, Related Products, Admin Inventory, Cart, and Order Creation — reads from this API in some form.

Rather than exposing one endpoint per page (`/sale-products`, `/featured-products`, `/fighter-products`, etc.), which doesn't scale, this module exposes **one flexible listing endpoint** driven by query parameters, plus a small set of detail, related-product, and admin management endpoints.

## Responsibilities

- Display products
- Product details
- Filtering, searching, sorting, pagination
- Featured products
- Sale products
- Champion gear
- Related products
- Admin CRUD
- Inventory management

**Out of scope:** cart logic, orders, authentication, categories CRUD, fighters CRUD (each is its own module).

---

## Endpoints

### GET /api/products

Returns products according to filters. Backs nearly every listing page in the store by combining query parameters rather than dedicated routes per page.

**Auth:** Public

**Query Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| page | Number | Current page |
| limit | Number | Products per page |
| search | String | Search by product name |
| categoryId | ObjectId | Filter by category |
| fighterId | ObjectId | Filter by fighter |
| eventId | ObjectId | Filter by event |
| departmentId | ObjectId | Filter by department |
| audience | String | Men / Women / Kids / Babies / Unisex |
| brandId | ObjectId | Filter by brand |
| onSale | Boolean | Sale items only |
| featured | Boolean | Featured only |
| championGear | Boolean | Champion gear only |
| trending | Boolean | Trending products |
| newArrival | Boolean | New arrivals |
| minPrice | Number | Minimum price |
| maxPrice | Number | Maximum price |
| size | String | S / M / L / XL |
| sort | String | price, newest, name, popularity |
| order | String | asc / desc |

**Example usage**

```
Home:            GET /api/products?featured=true&limit=8
Sale:            GET /api/products?onSale=true
Equipment:       GET /api/products?departmentId=...
Fighter page:    GET /api/products?fighterId=...
Event page:      GET /api/products?eventId=...
Champion gear:   GET /api/products?championGear=true
Search:          GET /api/products?search=Paddy
Price filter:    GET /api/products?minPrice=40&maxPrice=120
Combined:        GET /api/products?fighterId=...&departmentId=...&onSale=true&size=L
```

**Response — 200**
```json
{
    "success": true,
    "message": "Products retrieved successfully.",
    "data": {
        "products": [],
        "page": 1,
        "limit": 20,
        "totalItems": 120,
        "totalPages": 6
    }
}
```

**Errors**

| Status | Reason |
|--------|--------|
| 400 | Invalid query parameters |
| 500 | Server error |

---

### GET /api/products/:productId

Returns a single product for the product details page.

**Auth:** Public

**Response — 200**
```json
{
    "success": true,
    "data": {
        "product": {}
    }
}
```

**Errors:** 404, 500

---

### GET /api/products/:productId/related

Powers the "You may also like" section.

**Auth:** Public

**Matching priority:**
1. Same fighter
2. Same category
3. Same department
4. Same audience

**Response — 200**
```json
{
    "success": true,
    "data": {
        "products": []
    }
}
```

---

### GET /api/products/:productId/inventory

Returns stock and variant details for the Admin Dashboard.

**Auth:** Admin

**Response — 200**
```json
{
    "totalStock": 80,
    "variants": []
}
```

---

### POST /api/products

Creates a new product.

**Auth:** Admin

**Request:** full `products.json` shape excluding `_id`, `createdAt`, `updatedAt`.

**Response — 201**
```json
{
    "success": true,
    "message": "Product created successfully."
}
```

---

### PUT /api/products/:productId

Replaces a product entirely.

**Auth:** Admin

---

### PATCH /api/products/:productId

Partially updates a product — e.g. price only, inventory only, description only, images only.

**Auth:** Admin

---

### PATCH /api/products/:productId/archive

Soft-deletes a product instead of removing it. Hard-deleting a product that already has orders against it would break order history and analytics, so this sets `active = false` and removes it from storefront listings while preserving the record.

**Auth:** Admin

---

### PATCH /api/products/:productId/restore

Restores a previously archived product. Sets `active = true`.

**Auth:** Admin

---

### PATCH /api/products/:productId/inventory

Updates stock without touching any other product fields.

**Auth:** Admin

**Request**
```json
{
    "variants": [
        {
            "size": "L",
            "stock": 15
        }
    ]
}
```

---

### POST /api/products/:productId/images *(optional)*

Uploads or manages product images.

**Auth:** Admin

---

## Authorization Matrix

| Endpoint | Public | Customer | Admin |
|----------|:------:|:--------:|:-----:|
| GET /products | ✅ | ✅ | ✅ |
| GET /products/:id | ✅ | ✅ | ✅ |
| GET /products/:id/related | ✅ | ✅ | ✅ |
| GET /products/:id/inventory | ❌ | ❌ | ✅ |
| POST /products | ❌ | ❌ | ✅ |
| PUT /products/:id | ❌ | ❌ | ✅ |
| PATCH /products/:id | ❌ | ❌ | ✅ |
| PATCH /products/:id/inventory | ❌ | ❌ | ✅ |
| PATCH /products/:id/archive | ❌ | ❌ | ✅ |
| PATCH /products/:id/restore | ❌ | ❌ | ✅ |

---

## Validation Rules

**Product name**
- Required
- Maximum length enforced
- Not required to be unique — real products can share a name across editions or colors

**Price**
- Required
- Must be `>= 0`

**Inventory**
- Stock values can never go negative

**Images**
- At least one image required
- Exactly one image must have `isPrimary = true`

**Audience**
- Must be one of the values defined in `constants.json`

**Sizes**
- Must be one of the values defined in `constants.json`

**References**
- `categoryId`, `departmentId` — must reference existing documents
- `fighterId`, `eventId` — nullable, but must reference existing documents when present

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

## Schema Note

Per `brands.md` (Phase 2.8), the `brand: String` field on this schema is replaced with `brandId: ObjectId`, referencing the new `brands` collection — bringing Brand in line with the existing `categoryId` / `departmentId` / `fighterId` / `eventId` references.

Also add an `active: Boolean` field (default `true`) to the `products` schema if not already present. This is what `archive`/`restore` toggle. It keeps products referenced by past orders valid, lets admins hide out-of-stock or discontinued items without deleting them, and supports restoring a product without recreating it. Same soft-delete pattern used for `users` in Phase 2.2.

---

## Summary

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/api/products` | GET | Public | List products with filtering, sorting, searching, pagination |
| `/api/products/:productId` | GET | Public | Get product details |
| `/api/products/:productId/related` | GET | Public | Get related products |
| `/api/products/:productId/inventory` | GET | Admin | View inventory details |
| `/api/products` | POST | Admin | Create product |
| `/api/products/:productId` | PUT | Admin | Replace product |
| `/api/products/:productId` | PATCH | Admin | Partially update product |
| `/api/products/:productId/inventory` | PATCH | Admin | Update inventory only |
| `/api/products/:productId/archive` | PATCH | Admin | Archive (soft delete) product |
| `/api/products/:productId/restore` | PATCH | Admin | Restore archived product |
| `/api/products/:productId/images` *(optional)* | POST | Admin | Upload/manage product images |

Every product-related page in the store runs off this single, consistent set of endpoints, with the Admin Dashboard getting dedicated inventory and lifecycle management without duplicating API logic. This is the implementation contract for the Express backend going forward.
