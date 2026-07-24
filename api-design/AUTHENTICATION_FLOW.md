# Authentication Flow — System Design

**Module:** Authentication
**Phase:** 2.1
**Purpose:** Describe how authentication works as a *system*, not just which endpoints exist — so every team member shares the same mental model before implementation begins.

---

## 1. Authentication Lifecycle

```text
Visitor
    │
    ▼
Register
    │
    ▼
User document created
(password hashed)
    │
    ▼
Login
    │
    ▼
JWT generated
    │
    ▼
Angular stores JWT
    │
    ▼
Every authenticated request
Authorization: Bearer <token>
    │
    ▼
JWT Middleware
    │
    ▼
Request continues
```

**Walkthrough:**

1. A visitor registers an account. The backend hashes the password and stores the user document — the raw password is never persisted.
2. The user logs in with email + password. On success, the backend issues a signed JWT.
3. Angular stores the JWT (e.g., in memory / a service, with consideration for secure storage — to be finalized by the team).
4. For every subsequent request to a protected route, Angular attaches the token via the `Authorization: Bearer <token>` header.
5. The `authenticate` middleware verifies the token on the backend before allowing the request to proceed.

---

## 2. JWT Payload Specification

Keep the payload **minimal** — it should only carry what's needed to identify and authorize the user.

```json
{
    "userId": "...",
    "role": "Customer"
}
```

**Do NOT include in the JWT:**

- email
- phone
- address
- password hash
- cart
- orders

Anything beyond identity/role should be fetched from the database using `userId` when needed. This keeps the token small and avoids leaking or stale-caching sensitive/mutable data.

---

## 3. Password Security Policy

- Store only `passwordHash` in the database — never the raw password.
- Hash passwords using **bcrypt**.
- Never log passwords, in any environment.
- Never return passwords (or hashes) in API responses.
- Never include passwords in JWTs.

---

## 4. Middleware Responsibilities

These are internal middleware functions, not API endpoints — but they are a core part of the authentication design.

### `authenticate`

- Reads the `Authorization` header from the incoming request.
- Verifies the JWT signature and expiration.
- Attaches the decoded user (`userId`, `role`) to the request object.
- Rejects the request (401) if the token is missing, invalid, or expired.

**Used by:**
- Cart
- Orders
- Profile
- Checkout
- Admin operations

### `authorize`

- Checks the authenticated user's role against the roles allowed for a given route.
- Example usage:

```javascript
authorize("Admin")
```

- Allows only users with the matching role(s) to continue; otherwise responds with 403 Forbidden.

**Used for:**
- Product CRUD
- Category CRUD
- Department CRUD
- Event CRUD
- Fighter CRUD
- User management
- Inventory management

---

## 5. Token Storage Strategy

- Angular is responsible for storing the JWT after a successful login/register flow.
- The token is attached to every authenticated request as:

```
Authorization: Bearer <token>
```

- Logout is handled client-side by deleting the stored token (see `authentication.md` §3.3). No server-side session state is maintained under the current JWT-only design.
- If refresh tokens or token blacklisting are added later, this section should be updated to describe:
  - where the refresh token is stored,
  - how token rotation works,
  - how logout invalidates tokens server-side.

---

## 6. Sign-off Checklist

Before Phase 2.1 is considered complete, the team should confirm agreement on:

- [ ] Lifecycle diagram (Section 1)
- [ ] JWT payload contents (Section 2)
- [ ] Password policy (Section 3)
- [ ] `authenticate` / `authorize` middleware responsibilities (Section 4)
- [ ] Token storage strategy on the Angular side (Section 5)

Once reviewed and approved by Mokha, Ali Motamed, and Mohamed Nassar, Phase 2.1 is complete and the team can proceed to **Phase 2.2 — Users API**.
