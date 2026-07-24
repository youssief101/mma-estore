# Departments API

**Module:** Departments
**Phase:** 2.5
**Depends on:** Authentication module (Admin-gated write operations)

## Overview

Categories and Departments look similar but serve different purposes in this project. Categories map to the pages of the site (Fighters, Events, T-Shirts, Hats, Equipment, Sale). Departments map to the merchandising filter used across the storefront (Boxers, Collectibles, Equipment, Footwear, Headwear, Home & Office, Hoodies & Sweatshirts, Jerseys, Rompers, Shorts, T-Shirts, Tank Tops, Sale Items). Keeping them as separate collections is intentional — they answer different questions and are filtered on independently.

## Responsibilities

- List all departments
- Get department information
- Admin CRUD operations
- Allow the Products API to filter by department

**Out of scope:** returning products, inventory, orders, authentication.

## Department Model Reminder

```javascript
{
    _id: ObjectId,
    name: String,
    description: String,
    image: String,
    active: Boolean,
    createdAt: Date,
    updatedAt: Date
}
```

---

## Endpoints

### GET /api/departments

Returns every department available in the store.

**Auth:** Public

**Response — 200**
```json
{
    "success": true,
    "message": "Departments retrieved successfully.",
    "data": {
        "departments": [
            {
                "_id": "...",
                "name": "T-Shirts",
                "description": "Official UFC T-Shirts",
                "image": "..."
            },
            {
                "_id": "...",
                "name": "Equipment",
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

### GET /api/departments/:departmentId

Returns a single department.

**Auth:** Public

**Response — 200**
```json
{
    "success": true,
    "data": {
        "department": {
            "_id": "...",
            "name": "Collectibles",
            "description": "...",
            "image": "..."
        }
    }
}
```

**Errors**

| Status | Reason               |
|--------|----------------------|
| 404    | Department not found |
| 500    | Server error         |

---

### POST /api/departments

Creates a new department.

**Auth:** Admin

**Request**
```json
{
    "name": "Footwear",
    "description": "Official UFC Footwear",
    "image": "..."
}
```

**Response — 201**
```json
{
    "success": true,
    "message": "Department created successfully."
}
```

**Errors**

| Status | Reason                    |
|--------|---------------------------|
| 400    | Validation error          |
| 409    | Department already exists |
| 500    | Server error              |

---

### PUT /api/departments/:departmentId

Replaces a department entirely.

**Auth:** Admin

---

### PATCH /api/departments/:departmentId

Partially updates a department — only the fields provided are changed.

**Auth:** Admin

**Request**
```json
{
    "description": "Updated description"
}
```

---

### PATCH /api/departments/:departmentId/archive

Soft-deletes a department. Products referencing this department remain valid; the department is simply hidden from storefront filters and admin selection lists.

**Auth:** Admin

---

### PATCH /api/departments/:departmentId/restore

Restores a previously archived department, making it available again.

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

**Active**
- Defaults to `true`

---

## Authorization Matrix

| Endpoint                       | Public | Customer | Admin |
|--------------------------------|:------:|:--------:|:-----:|
| GET /departments               | YES    | YES      | YES   |
| GET /departments/:id           | YES    | YES      | YES   |
| POST /departments              | NO     | NO       | YES   |
| PUT /departments/:id           | NO     | NO       | YES   |
| PATCH /departments/:id         | NO     | NO       | YES   |
| PATCH /departments/:id/archive | NO     | NO       | YES   |
| PATCH /departments/:id/restore | NO     | NO       | YES   |

---

## Relationship with Products

Departments do not contain products. The frontend retrieves them in two steps:

```
GET /api/departments                            → list available departments
GET /api/products?departmentId=<departmentId>    → list products within a selected department
```

This keeps the API RESTful and avoids returning large nested objects.

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

Since departments are displayed in a specific order on the storefront (e.g., T-Shirts before Tank Tops), add a `displayOrder: Number` field to the schema:

```javascript
{
    _id: ObjectId,
    name: String,
    description: String,
    image: String,
    displayOrder: Number,
    active: Boolean,
    createdAt: Date,
    updatedAt: Date
}
```

This lets an admin control display order without hardcoding it in Angular — the frontend calls `GET /api/departments` and renders the results sorted by `displayOrder`.

---

## Summary

| Endpoint                                 | Method | Auth   | Purpose                          |
|------------------------------------------|--------|--------|----------------------------------|
| `/api/departments`                       | GET    | Public | List all departments             |
| `/api/departments/:departmentId`         | GET    | Public | Get department details           |
| `/api/departments`                       | POST   | Admin  | Create department                |
| `/api/departments/:departmentId`         | PUT    | Admin  | Replace department               |
| `/api/departments/:departmentId`         | PATCH  | Admin  | Partially update department      |
| `/api/departments/:departmentId/archive` | PATCH  | Admin  | Archive (soft delete) department |
| `/api/departments/:departmentId/restore` | PATCH  | Admin  | Restore archived department      |

Consistent with Users, Products, and Categories: same REST conventions, soft-delete strategy, response format, and admin management model — keeping the API predictable across all three team members' implementation work.