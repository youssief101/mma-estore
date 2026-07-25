# Categories API

**Module:** Categories
**Phase:** 2.4
**Depends on:** Authentication module (Admin-gated write operations)

## Overview

Compared to Products, this module is intentionally small. It does not return products — that's the Products API's job. Categories only manages category metadata (e.g. T-Shirts, Hats, Equipment). Products belonging to a category are retrieved separately through `/api/products?categoryId=...`, which keeps the two modules from duplicating logic.

## Responsibilities

- List categories
- Get category details
- Admin CRUD operations

**Out of scope:** returning products, filtering, searching, inventory.

## Category Model Reminder

```javascript
{
    _id: ObjectId,
    name: String,
    description: String,
    image: String,
    createdAt: Date,
    updatedAt: Date
}
```

---

## Endpoints

### GET /api/categories

Returns every available category.

**Auth:** Public

**Response — 200**
```json
{
    "success": true,
    "message": "Categories retrieved successfully.",
    "data": {
        "categories": [
            {
                "_id": "...",
                "name": "T-Shirts",
                "description": "Official UFC T-Shirts",
                "image": "..."
            },
            {
                "_id": "...",
                "name": "Hats",
                "description": "...",
                "image": "..."
            }
        ]
    }
}
```

**Errors**

| Status | Reason       |
|--------|--------------|
| 500    | Server error |

---

### GET /api/categories/:categoryId

Returns a single category.

**Auth:** Public

**Response — 200**
```json
{
    "success": true,
    "data": {
        "category": {
            "_id": "...",
            "name": "Equipment",
            "description": "...",
            "image": "..."
        }
    }
}
```

**Errors**

| Status | Reason             |
|--------|--------------------|
| 404    | Category not found |
| 500    | Server error       |

---

### POST /api/categories

Creates a new category.

**Auth:** Admin

**Request**
```json
{
    "name": "Accessories",
    "description": "Official UFC accessories",
    "image": "..."
}
```

**Response — 201**
```json
{
    "success": true,
    "message": "Category created successfully."
}
```

**Errors**

| Status | Reason                  |
|--------|-------------------------|
| 400    | Validation failed       |
| 409    | Category already exists |
| 500    | Server error            |

---

### PUT /api/categories/:categoryId

Replaces a category entirely.

**Auth:** Admin

---

### PATCH /api/categories/:categoryId

Partially updates a category — only the fields provided are changed.

**Auth:** Admin

**Request**
```json
{
    "description": "Updated description"
}
```

---

### PATCH /api/categories/:categoryId/archive

Soft-deletes a category. Categories can still be referenced by existing products, so this hides the category from the storefront and admin selection lists instead of removing the record.

**Auth:** Admin

---

### PATCH /api/categories/:categoryId/restore

Restores a previously archived category, making it visible again.

**Auth:** Admin

---

## Validation Rules

**Name**
- Required
- Unique
- Maximum 100 characters

**Description**
- Optional
- Maximum 500 characters

**Image**
- Optional
- Must be a valid image URL

---

## Authorization Matrix

| Endpoint                      | Public | Customer | Admin |
|-------------------------------|:------:|:--------:|:-----:|
| GET /categories               | YES    | YES      | YES   |
| GET /categories/:id           | YES    | YES      | YES   |
| POST /categories              | NO     | NO       | YES   |
| PUT /categories/:id           | NO     | NO       | YES   |
| PATCH /categories/:id         | NO     | NO       | YES   |
| PATCH /categories/:id/archive | NO     | NO       | YES   |
| PATCH /categories/:id/restore | NO     | NO       | YES   |

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

## Relationship with Products

A category does not contain products. The frontend retrieves them in two steps:

```
GET /api/categories                          → list available categories
GET /api/products?categoryId=<categoryId>     → list products within a selected category
```

This keeps the API modular and avoids returning large nested responses.

---

## Schema Note

Add an `active: Boolean` field (default `true`) to the `categories` schema if not already present. This is what `archive`/`restore` toggle, and it prevents deleting categories still referenced by products — archived categories are simply hidden from the storefront and admin lists. Same soft-delete pattern used for `users` and `products`.

---

## Summary

| Endpoint                              | Method | Auth   | Purpose                         |
|---------------------------------------|--------|--------|---------------------------------|
| `/api/categories`                     | GET    | Public | List all categories             |
| `/api/categories/:categoryId`         | GET    | Public | Get category details            |
| `/api/categories`                     | POST   | Admin  | Create category                 |
| `/api/categories/:categoryId`         | PUT    | Admin  | Replace category                |
| `/api/categories/:categoryId`         | PATCH  | Admin  | Partially update category       |
| `/api/categories/:categoryId/archive` | PATCH  | Admin  | Archive (soft delete) category  |
| `/api/categories/:categoryId/restore` | PATCH  | Admin  | Restore archived category       |

Consistent with the rest of the project: RESTful endpoints, soft deletion, uniform response format, and clear separation of responsibilities. Next up: **Departments API**, which follows the same pattern for broader merchandising groupings (T-Shirts, Hoodies & Sweatshirts, Footwear, Collectibles) that users can filter by across the store.