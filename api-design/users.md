# Users API

**Module:** Users
**Phase:** 2.2
**Depends on:** Authentication module (JWT issuance/validation)

## Overview

Authentication answers *who are you*. Users answers *what can you do with your account*. This module owns profile data, address management, and admin-level account/role management. It does not own login, registration, logout, or password changes — those stay in Authentication.

`GET /api/auth/me` from Phase 2.1 is moved here as `GET /api/users/me`. Auth should be limited to issuing and validating tokens; anything that reads or writes user data belongs in this module.

## Responsibilities

- View profile
- Update profile
- Manage addresses
- Admin user management
- Role management (Admin only)

**Out of scope:** login, register, logout, password changes (Authentication), cart, orders.

## Access Levels

| Action                   | Customer| Admin  |
|--------------------------|:-------:|:------:|
| View own profile         | YES     |    YES |
| Update own profile       | YES     |    YES |
| Manage own addresses     | YES     |    YES |
| View all users           | NO      |    YES |
| View any user            | NO      |    YES |
| Change user role         | NO      |    YES |
| Deactivate/activate user | NO      |    YES |

---

## Endpoints

### GET /api/users/me

Returns the authenticated user's profile.

**Auth:** Authenticated

**Response — 200**
```json
{
    "success": true,
    "data": {
        "_id": "...",
        "firstName": "Youssef",
        "lastName": "Mohamed",
        "username": "youssef101",
        "email": "user@email.com",
        "phone": "01012345678",
        "role": "Customer",
        "addresses": ["...", "..."],
        "createdAt": "...",
        "updatedAt": "..."
    }
}
```

**Errors**

| Status |  Reason      |
|--------|--------------|
| 401    | Unauthorized |
| 500    | Server error |

---

### PATCH /api/users/me

Updates the authenticated user's profile.

**Auth:** Authenticated

**Editable:** `firstName`, `lastName`, `username`, `phone`
**Immutable:** `email`, `role`, `passwordHash`, `createdAt`

Email is kept immutable for this project since changing it would normally require re-verification, which is out of scope.

**Request**
```json
{
    "firstName": "Youssef",
    "lastName": "Mohamed",
    "username": "youssef101",
    "phone": "01012345678"
}
```

**Response — 200**
```json
{
    "success": true,
    "message": "Profile updated successfully.",
    "data": {}
}
```

---

### GET /api/users/me/addresses

Returns all addresses for the authenticated user.

**Auth:** Authenticated

---

### POST /api/users/me/addresses

Adds an address for the authenticated user.

**Auth:** Authenticated

**Request**
```json
{
    "label": "Home",
    "country": "Egypt",
    "city": "10th of Ramadan",
    "street": "...",
    "postalCode": "...",
    "isDefault": true
}
```

**Response — 201**
```json
{
    "success": true,
    "message": "Address added successfully."
}
```

---

### PATCH /api/users/me/addresses/:addressId

Updates a single address belonging to the authenticated user.

**Auth:** Authenticated

---

### DELETE /api/users/me/addresses/:addressId

Deletes a single address belonging to the authenticated user.

**Auth:** Authenticated

---

### PATCH /api/users/me/addresses/:addressId/default

Sets the given address as the user's default shipping address, rather than requiring the client to re-submit the full address object.

**Auth:** Authenticated

---

## Admin Endpoints

All endpoints below require `role = Admin`.

### GET /api/users

Lists all users. Supports pagination and filtering.

**Query params:** `page`, `limit`, `search`, `role`, `sort`

**Response — 200**
```json
{
    "success": true,
    "data": {
        "users": [],
        "page": 1,
        "totalPages": 5,
        "totalItems": 97
    }
}
```

---

### GET /api/users/:userId

Returns a single user by ID.

---

### PATCH /api/users/:userId/role

Changes a user's role.

**Request**
```json
{
    "role": "Admin"
}
```

**Validation:** `role` must be one of `Customer`, `Admin`.

---

### PATCH /api/users/:userId/deactivate

Deactivates a user instead of deleting them. Hard-deleting a user would break references from existing orders and purchase history, so we flip a status flag instead. This is standard practice for e-commerce systems and keeps historical data intact.

Sets `active = false`.

---

### PATCH /api/users/:userId/activate

Reactivates a previously deactivated user. Sets `active = true`.

---

## Validation Rules

**Username**
- Required, unique
- 3–30 characters
- Letters, numbers, underscore only

**Phone**
- Optional
- Must match Egyptian phone format

**Addresses**
- Exactly one address may have `isDefault = true` at a time
- Setting a new default automatically unsets the previous one

---

## Authorization Matrix

| Endpoint                              | Customer  | Admin |
|---------------------------------------|:---------:|:-----:|
| GET /users/me                         | YES       |   YES |
| PATCH /users/me                       | YES       |   YES |
| GET /users/me/addresses               | YES       |   YES |
| POST /users/me/addresses              | YES       |   YES |
| PATCH /users/me/addresses/:id         | YES       |   YES |
| DELETE /users/me/addresses/:id        | YES       |   YES |
| PATCH /users/me/addresses/:id/default | YES       |   YES |
| GET /users                            | NO        |   YES |
| GET /users/:id                        | NO        |   YES |
| PATCH /users/:id/role                 | NO        |   YES |
| PATCH /users/:id/deactivate           | NO        |   YES |
| PATCH /users/:id/activate             | NO        |   YES |

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

Add an `active: Boolean` field (default `true`) to the `users` schema if not already present. Supports account suspension/reactivation and prevents dangling references from deleted-user IDs in orders. Pairs directly with the `activate`/`deactivate` endpoints above.

---

## Summary

| Endpoint                                    | Method | Auth  | Description         |
|---------------------------------------------|--------|-------|---------------------|
| `/api/users/me`                             | GET    | User  | Get current profile |
| `/api/users/me`                             | PATCH  | User  | Update profile      |
| `/api/users/me/addresses`                   | GET    | User  | List addresses      |
| `/api/users/me/addresses`                   | POST   | User  | Add address         |
| `/api/users/me/addresses/:addressId`        | PATCH  | User  | Update address      |
| `/api/users/me/addresses/:addressId`        | DELETE | User  | Delete address      |
| `/api/users/me/addresses/:addressId/default`| PATCH  | User  | Set default address |
| `/api/users`                                | GET    | Admin | List all users      | 
| `/api/users/:userId`                        | GET    |  Admin| Get a specific user |
| `/api/users/:userId/role`                   | PATCH  | Admin | Change user role    |
| `/api/users/:userId/deactivate`             | PATCH  | Admin | Deactivate user     |
| `/api/users/:userId/activate`               | PATCH  | Admin | Reactivate user     |

Next: **Products API** — the largest module in the project, since most storefront pages depend on it.
