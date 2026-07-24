# Fighters API

**Module:** Fighters
**Phase:** 2.6
**Depends on:** Authentication module (Admin-gated write operations)

## Overview

Fighters are a first-class entity in this store, not just another filter — this is what differentiates an MMA merch site from a generic e-commerce template. A Fighter is not a Product: this module manages fighter information only (name, nickname, ranking, weight class, etc.). Merchandise tied to a fighter is still retrieved through the Products API via `fighterId`, keeping the two collections normalized and independent.

```
GET /api/fighters                        → Islam Makhachev, Alex Pereira, Ilia Topuria, Paddy Pimblett, ...
GET /api/products?fighterId=<PaddyId>     → all of Paddy Pimblett's merchandise
```

## Responsibilities

- List fighters
- Fighter profile/details
- Rankings
- Search fighters
- Filter fighters
- Admin CRUD

**Out of scope:** products, orders, inventory, authentication.

## Fighter Model Reminder

```javascript
{
    _id: ObjectId,
    firstName: String,
    lastName: String,
    nickname: String,
    gender: String,
    weightClass: String,
    ranking: Number,
    country: String,
    image: String,
    champion: Boolean,
    active: Boolean,
    createdAt: Date,
    updatedAt: Date
}
```

---

## Endpoints

### GET /api/fighters

Returns all active fighters.

**Auth:** Public

**Query Parameters**

| Parameter   | Type    | Description                                  |
|-------------|---------|----------------------------------------------|
| search      | String  | Search by first name, last name, or nickname |
| gender      | String  | Men / Women                                  |
| weightClass | String  | Lightweight, Featherweight, etc.             |
| champion    | Boolean | Champions only                               |
| active      | Boolean | Active fighters                              |
| page        | Number  | Pagination                                   |
| limit       | Number  | Pagination                                   |
| sort        | String  | ranking, firstName                           |

**Example usage**

```
Champions only:      GET /api/fighters?champion=true
Women's division:    GET /api/fighters?gender=Women
Search:              GET /api/fighters?search=Paddy
Sorted by ranking:   GET /api/fighters?sort=ranking
```

**Response — 200**
```json
{
    "success": true,
    "message": "Fighters retrieved successfully.",
    "data": {
        "fighters": [],
        "page": 1,
        "limit": 20,
        "totalItems": 35,
        "totalPages": 2
    }
}
```

---

### GET /api/fighters/:fighterId

Returns a single fighter.

**Auth:** Public

**Response — 200**
```json
{
    "success": true,
    "data": {
        "fighter": {
            "_id": "...",
            "firstName": "Paddy",
            "lastName": "Pimblett",
            "nickname": "The Baddy",
            "weightClass": "Lightweight",
            "ranking": 8,
            "country": "England",
            "champion": false,
            "image": "..."
        }
    }
}
```

**Errors**

| Status | Reason            |
|--------|-------------------|
| 404    | Fighter not found |
| 500    | Server error      |

---

### POST /api/fighters

Creates a new fighter.

**Auth:** Admin

**Request**
```json
{
    "firstName": "Alex",
    "lastName": "Pereira",
    "nickname": "Poatan",
    "gender": "Men",
    "weightClass": "Light Heavyweight",
    "ranking": 1,
    "country": "Brazil",
    "champion": true,
    "image": "..."
}
```

**Response — 201**
```json
{
    "success": true,
    "message": "Fighter created successfully."
}
```

---

### PUT /api/fighters/:fighterId

Replaces a fighter entirely.

**Auth:** Admin

---

### PATCH /api/fighters/:fighterId

Partially updates a fighter — e.g. `ranking`, `champion`, `image`, `nickname`, `country`.

**Auth:** Admin

---

### PATCH /api/fighters/:fighterId/archive

Soft-deletes a fighter. Hides a retired or inactive fighter from the storefront without breaking references from existing products.

**Auth:** Admin

---

### PATCH /api/fighters/:fighterId/restore

Restores a previously archived fighter.

**Auth:** Admin

---

## Validation Rules

**First name**
- Required
- Maximum 50 characters

**Last name**
- Required
- Maximum 50 characters

**Nickname**
- Optional
- Maximum 50 characters

**Ranking**
- Must be `>= 1`

**Champion**
- Boolean

**Active**
- Defaults to `true`

**Gender**
- Must come from `constants.json`
- Limited to `Men` / `Women` — fighters are never Kids or Babies

**Weight class**
- Must come from `constants.json`, e.g.:
```json
"WeightClasses": [
  "Flyweight",
  "Bantamweight",
  "Featherweight",
  "Lightweight",
  "Welterweight",
  "Middleweight",
  "Light Heavyweight",
  "Heavyweight",
  "Women's Strawweight",
  "Women's Flyweight",
  "Women's Bantamweight"
]
```

---

## Authorization Matrix

| Endpoint                           | Public | Customer | Admin |
|------------------------------------|:------:|:--------:|:-----:|
| GET /fighters                      | YES    | YES      | YES   |
| GET /fighters/:fighterId           | YES    | YES      | YES   |
| POST /fighters                     | NO     | NO       | YES   |
| PUT /fighters/:fighterId           | NO     | NO       | YES   |
| PATCH /fighters/:fighterId         | NO     | NO       | YES   |
| PATCH /fighters/:fighterId/archive | NO     | NO       | YES   |
| PATCH /fighters/:fighterId/restore | NO     | NO       | YES   |

---

## Relationship with Products

The Fighters API never returns merchandise. The frontend retrieves them in two steps:

```
GET /api/fighters/:fighterId              → fighter profile and information
GET /api/products?fighterId=<fighterId>   → that fighter's merchandise
```

This keeps responsibilities separated and lets the Products API remain the single source of product data.

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

Add a `displayOrder: Number` field to the `fighters` schema. `ranking` reflects the official UFC pound-for-pound ranking, but `displayOrder` gives the admin flexibility to feature fighters in a different order on the Fighters page and navigation menu — e.g. promoting a popular fighter or highlighting a champion — without altering the official ranking data.

```javascript
{
    _id: ObjectId,
    firstName: String,
    lastName: String,
    nickname: String,
    gender: String,
    weightClass: String,
    ranking: Number,
    displayOrder: Number,
    country: String,
    image: String,
    champion: Boolean,
    active: Boolean,
    createdAt: Date,
    updatedAt: Date
}
```

---

## Summary

| Endpoint                           | Method | Auth   | Purpose                                                   |
|------------------------------------|--------|--------|-----------------------------------------------------------|
| `/api/fighters`                    | GET    | Public | List fighters with filtering, search, sorting, pagination |
| `/api/fighters/:fighterId`         | GET    | Public | Get fighter details                                       |
| `/api/fighters`                    | POST   | Admin  | Create fighter                                            |
| `/api/fighters/:fighterId`         | PUT    | Admin  | Replace fighter                                           |
| `/api/fighters/:fighterId`         | PATCH  | Admin  | Partially update fighter                                  |
| `/api/fighters/:fighterId/archive` | PATCH  | Admin  | Archive (soft delete) fighter                             |
| `/api/fighters/:fighterId/restore` | PATCH  | Admin  | Restore archived fighter                                  |

Fully normalized and integrated with the Products API through `fighterId`, this module supports the Fighters page, fighter merchandise listings, champion gear sections, and search — all without duplicating data or business logic.