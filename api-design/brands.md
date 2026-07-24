# Brands API

**Module:** Brands
**Phase:** 2.8
**Depends on:** Authentication module (Admin-gated write operations)

## Overview

Storing `brand: String` directly on a product works for a small project, but breaks down once you need a logo, a description, active/inactive status, or multiple brands (UFC, Venum, Fanatics, Reebok, ...) managed from an admin dashboard. Since this project already has an Admin Dashboard and Inventory Management UI, Brand is treated as its own collection, referenced from Products by `brandId` rather than duplicated as a string on every product. One brand update (e.g. a new logo) then applies automatically everywhere that brand is referenced, instead of requiring a bulk update across every matching product.

This follows the same normalization pattern already used for `categoryId`, `fighterId`, `departmentId`, and `eventId`.

## Responsibilities

- List brands
- Brand details
- Search brands
- Admin CRUD
- Archive/restore brands

**Out of scope:** products, inventory, orders, authentication.

## Brand Model

```javascript
{
    _id: ObjectId,
    name: String,
    logo: String,
    description: String,
    website: String,
    active: Boolean,
    createdAt: Date,
    updatedAt: Date
}
```

**Typical brands:** UFC, Venum, Fanatics, Mitchell & Ness

---

## Endpoints

### GET /api/brands

Returns every active brand.

**Auth:** Public

**Query Parameters**

| Parameter | Description |
|-----------|-------------|
| search | Search by name |
| active | Filter by active status |
| page | Pagination |
| limit | Pagination |
| sort | Name |

**Response — 200**
```json
{
    "success": true,
    "message": "Brands retrieved successfully.",
    "data": {
        "brands": []
    }
}
```

---

### GET /api/brands/:brandId

Returns a single brand.

**Auth:** Public

---

### POST /api/brands

Creates a new brand.

**Auth:** Admin

**Request**
```json
{
    "name": "UFC",
    "logo": "...",
    "description": "Official UFC merchandise",
    "website": "https://www.ufcstore.com"
}
```

**Response — 201**
```json
{
    "success": true,
    "message": "Brand created successfully."
}
```

---

### PUT /api/brands/:brandId

Replaces a brand entirely.

**Auth:** Admin

---

### PATCH /api/brands/:brandId

Partially updates a brand — e.g. `logo`, `description`, `website`.

**Auth:** Admin

---

### PATCH /api/brands/:brandId/archive

Soft-deletes a brand. Sets `active = false` instead of removing the record — products continue referencing the brand without breaking.

**Auth:** Admin

---

### PATCH /api/brands/:brandId/restore

Restores a previously archived brand.

**Auth:** Admin

---

## Validation Rules

**Name**
- Required
- Unique
- Maximum 100 characters

**Logo**
- Optional
- Must be a valid image URL

**Description**
- Optional
- Maximum 500 characters

**Website**
- Optional
- Must be a valid URL

**Active**
- Defaults to `true`

---

## Authorization Matrix

| Endpoint | Public | Customer | Admin |
|----------|:------:|:--------:|:-----:|
| GET /brands | ✅ | ✅ | ✅ |
| GET /brands/:brandId | ✅ | ✅ | ✅ |
| POST /brands | ❌ | ❌ | ✅ |
| PUT /brands/:brandId | ❌ | ❌ | ✅ |
| PATCH /brands/:brandId | ❌ | ❌ | ✅ |
| PATCH /brands/:brandId/archive | ❌ | ❌ | ✅ |
| PATCH /brands/:brandId/restore | ❌ | ❌ | ✅ |

---

## Relationship with Products

The Brands API never returns products. The frontend retrieves them in two steps:

```
GET /api/brands                       → list brands for filtering or administration
GET /api/products?brandId=<brandId>   → products belonging to a selected brand
```

This keeps the Products API as the single source of merchandise while Brands manages only brand information.

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

Extend the model with `displayOrder` and `banner`:

```javascript
{
    _id: ObjectId,
    name: String,
    logo: String,
    banner: String,
    description: String,
    website: String,
    displayOrder: Number,
    active: Boolean,
    createdAt: Date,
    updatedAt: Date
}
```

- `displayOrder` — lets the admin control the order brands appear in dropdowns and filter panels.
- `banner` — reserves the asset needed for a future "Shop by Brand" page or homepage brand feature, without a later schema change.

---

## Database Change Required

Update the `products` schema to reference brands the same way it already references categories, departments, fighters, and events:

```diff
- brand: String
+ brandId: ObjectId
```

| Relationship | Stored in Products |
|--------------|---------------------|
| Category | `categoryId` |
| Department | `departmentId` |
| Fighter | `fighterId` |
| Event | `eventId` |
| **Brand** | **`brandId`** ✅ |

This is a one-time migration that brings Brand in line with the rest of the normalized schema and avoids duplicating brand data across every product document.

---

## Summary

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/api/brands` | GET | Public | List brands |
| `/api/brands/:brandId` | GET | Public | Get brand details |
| `/api/brands` | POST | Admin | Create brand |
| `/api/brands/:brandId` | PUT | Admin | Replace brand |
| `/api/brands/:brandId` | PATCH | Admin | Partially update brand |
| `/api/brands/:brandId/archive` | PATCH | Admin | Archive (soft delete) brand |
| `/api/brands/:brandId/restore` | PATCH | Admin | Restore archived brand |

This completes the catalog-related modules — Products, Categories, Departments, Fighters, Events, and Brands — with a consistent RESTful design, soft-delete strategy, normalized relationships, and uniform response format. Next: **Cart API**, where these catalog entities start interacting with authenticated users during the shopping process.
