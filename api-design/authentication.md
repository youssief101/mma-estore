# Authentication API — MMA Merch E-Commerce Platform

**Module:** Authentication
**Phase:** 2.1
**Status:** Draft for team review

---

## 1. Module Scope

### Responsibilities

The authentication module is responsible for:

- Register a new user
- Login
- Logout
- Verify JWT
- Protect private routes
- Check user roles (Customer / Admin)
- Change password
- Forgot password *(optional — not implemented)*
- Reset password *(optional — not implemented)*
- Refresh JWT *(optional — not implemented)*

### Explicitly Excluded (Out of Scope)

To keep the module focused on demonstrable MEAN stack concepts, the following are **not** implemented:

- Google Login
- Facebook Login
- Two-Factor Authentication
- Email verification
- Forgot / Reset password (unless required by tutor)

These add complexity without demonstrating new concepts relevant to the bootcamp's evaluation criteria.

---

## 2. Response Standard

All authentication endpoints follow a consistent response envelope.

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

## 3. Endpoints

### 3.1 Register

```
POST /api/auth/register
```

**Authorization:** Public

**Request Body**
```json
{
    "firstName": "Youssef",
    "lastName": "Mohamed",
    "username": "youssef101",
    "email": "user@email.com",
    "password": "Password123!",
    "confirmPassword": "Password123!"
}
```

> `confirmPassword` is used for validation only and is never persisted to MongoDB.

**Validation Rules**
- First name required
- Last name required
- Username must be unique
- Email must be unique
- Valid email format
- Password minimum length (e.g., 8 characters)
- Password must contain uppercase, lowercase, number, and special character
- `password` and `confirmPassword` must match

**Success Response — 201 Created**
```json
{
    "success": true,
    "message": "Account created successfully."
}
```

**Possible Errors**

| Status | Reason                   |
|--------|---------------------------|
| 400    | Invalid input             |
| 409    | Email already exists      |
| 409    | Username already exists   |
| 500    | Server error              |

---

### 3.2 Login

```
POST /api/auth/login
```

**Authorization:** Public

**Request Body**
```json
{
    "email": "user@email.com",
    "password": "Password123!"
}
```

**Success Response**
```json
{
    "success": true,
    "message": "Login successful.",
    "data": {
        "token": "JWT_TOKEN",
        "user": {
            "id": "...",
            "firstName": "...",
            "lastName": "...",
            "role": "Customer"
        }
    }
}
```

Angular stores the returned JWT immediately upon success.

**Possible Errors**

| Status | Reason                     |
|--------|------------------------------|
| 400    | Validation failed            |
| 401    | Invalid email or password    |
| 500    | Server error                 |

---

### 3.3 Logout

```
POST /api/auth/logout
```

**Authorization:** Authenticated

**Request Body:** None

**Success Response**
```json
{
    "success": true,
    "message": "Logged out successfully."
}
```

> Since authentication is JWT-based (stateless), logout is primarily handled client-side by deleting the stored token. This endpoint exists as a placeholder and can be extended later if token blacklisting or refresh tokens are introduced.

---

### 3.4 Change Password

```
PATCH /api/auth/change-password
```

**Authorization:** Authenticated

**Request Body**
```json
{
    "currentPassword": "...",
    "newPassword": "...",
    "confirmPassword": "..."
}
```

**Validation Rules**
- Current password must be correct
- New password must meet the password policy
- New password must differ from the current password
- New password and confirmation must match

**Success Response**
```json
{
    "success": true,
    "message": "Password updated successfully."
}
```

---

### 3.5 Verify Token *(Optional)*

```
GET /api/auth/verify
```

**Authorization:** Authenticated

**Purpose:** Checks whether a JWT is still valid.

**Success Response**
```json
{
    "success": true
}
```

> Optional — protected endpoints already verify the token via middleware. Included here for convenience where the frontend wants an explicit validity check (e.g., on app boot, before restoring a session).

---

## 4. Endpoint Summary

| Endpoint                        | Method | Auth Required | Description                    |
|----------------------------------|--------|----------------|---------------------------------|
| `/api/auth/register`             | POST   | No             | Register a new account          |
| `/api/auth/login`                | POST   | No             | Login and receive JWT           |
| `/api/auth/logout`               | POST   | Yes            | Logout (client removes token)   |
| `/api/auth/change-password`      | PATCH  | Yes            | Change password                 |
| `/api/auth/verify` *(optional)*  | GET    | Yes            | Verify JWT validity             |

> `GET /api/auth/me` has moved to `GET /api/users/me` — see `users.md`. Authentication is scoped to issuing and validating tokens only; profile retrieval belongs to the Users module.

---

## 5. Related Document

See **`AUTHENTICATION_FLOW.md`** for the authentication lifecycle diagram, JWT payload specification, password policy, and middleware design (`authenticate` / `authorize`).

---

*Phase 2.1 — to be marked complete once reviewed and approved by the full team (Mokha, Ali Motamed, Mohamed Nassar).*
