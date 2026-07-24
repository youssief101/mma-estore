# Events API

**Module:** Events
**Phase:** 2.7
**Depends on:** Authentication module (Admin-gated write operations)

## Overview

Like Fighters, the Events API manages event information only — it does not return products directly. Merchandise tied to an event is retrieved through the Products API via `eventId`, keeping the module normalized and consistent with the rest of the project.

```
GET /api/events                          → UFC 317, UFC 318, UFC Fight Night: Paris, Noche UFC, ...
GET /api/products?eventId=<eventId>      → all merchandise for a selected event
```

## Responsibilities

- List events
- Event details
- Search events
- Filter events
- Admin CRUD
- Event archive/restore

**Out of scope:** products, orders, inventory, authentication.

## Event Model Reminder

```javascript
{
    _id: ObjectId,
    name: String,
    eventDate: Date,
    location: String,
    image: String,
    description: String,
    eventType: String,
    active: Boolean,
    createdAt: Date,
    updatedAt: Date
}
```

---

## Endpoints

### GET /api/events

Returns all active UFC events.

**Auth:** Public

**Query Parameters**

| Parameter | Type    | Description                             |
|-----------|---------|-----------------------------------------|
| search    | String  | Search by event name                    |
| eventType | String  | PPV, Fight Night, Noche UFC             |
| year      | Number  | Filter by event year                    |
| upcoming  | Boolean | Upcoming events only                    |
| active    | Boolean | Active events only (Admin may override) |
| page      | Number  | Pagination                              |
| limit     | Number  | Pagination                              |
| sort      | String  | eventDate, name                         |

**Example usage**

```
Search:            GET /api/events?search=UFC 317
Fight Nights:       GET /api/events?eventType=Fight Night
Upcoming PPVs:      GET /api/events?eventType=PPV&upcoming=true
Events in 2026:     GET /api/events?year=2026
Sorted by newest:   GET /api/events?sort=eventDate
```

**Response — 200**
```json
{
    "success": true,
    "message": "Events retrieved successfully.",
    "data": {
        "events": [],
        "page": 1,
        "limit": 20,
        "totalItems": 25,
        "totalPages": 2
    }
}
```

---

### GET /api/events/:eventId

Returns complete information about one event.

**Auth:** Public

**Response — 200**
```json
{
    "success": true,
    "data": {
        "event": {
            "_id": "...",
            "name": "UFC 317",
            "eventDate": "2026-08-15",
            "location": "Las Vegas, Nevada",
            "eventType": "PPV",
            "description": "...",
            "image": "..."
        }
    }
}
```

**Errors**

| Status | Reason          |
|--------|-----------------|
| 404    | Event not found |
| 500    | Server error    |

---

### POST /api/events

Creates a new event.

**Auth:** Admin

**Request**
```json
{
    "name": "UFC 331",
    "eventDate": "2026-11-15",
    "location": "Las Vegas",
    "eventType": "PPV",
    "description": "...",
    "image": "..."
}
```

**Response — 201**
```json
{
    "success": true,
    "message": "Event created successfully."
}
```

---

### PUT /api/events/:eventId

Replaces an event entirely.

**Auth:** Admin

---

### PATCH /api/events/:eventId

Partially updates an event — e.g. `date`, `location`, `image`, `description`, `eventType`.

**Auth:** Admin

---

### PATCH /api/events/:eventId/archive

Soft-deletes an event. Hides it from the website without breaking product references — products linked to this event remain valid.

**Auth:** Admin

---

### PATCH /api/events/:eventId/restore

Restores a previously archived event.

**Auth:** Admin

---

## Validation Rules

**Name**
- Required
- Unique
- Maximum 100 characters

**Event date**
- Required
- Must be a valid date

**Location**
- Required
- Maximum 100 characters

**Description**
- Optional
- Maximum 2000 characters

**Image**
- Optional
- Must be a valid image URL

**Event type**
- Must come from `constants.json`:
```json
["PPV", "Fight Night", "Noche UFC"]
```

**Active**
- Defaults to `true`

---

## Authorization Matrix

| Endpoint                       | Public | Customer | Admin |
|--------------------------------|:------:|:--------:|:-----:|
| GET /events                    | YES    | YES      | YES   |
| GET /events/:eventId           | YES    | YES      | YES   |
| POST /events                   | NO     | NO       | YES   |
| PUT /events/:eventId           | NO     | NO       | YES   |
| PATCH /events/:eventId         | NO     | NO       | YES   |
| PATCH /events/:eventId/archive | NO     | NO       | YES   |
| PATCH /events/:eventId/restore | NO     | NO       | YES   |

---

## Relationship with Products

The Events API never returns merchandise. The frontend retrieves them in two steps:

```
GET /api/events/:eventId              → event information
GET /api/products?eventId=<eventId>   → that event's merchandise
```

This keeps the Events module focused on event management while the Products API remains the single source of product data.

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

Add a `featured: Boolean` field to the `events` schema. The Home page will likely include sections such as Upcoming Events, Featured PPVs, or Latest Event Collections — `featured` lets the admin control which events appear prominently without relying on hardcoded IDs or event date alone.

```javascript
{
    _id: ObjectId,
    name: String,
    eventDate: Date,
    location: String,
    image: String,
    description: String,
    eventType: String,
    featured: Boolean,
    active: Boolean,
    createdAt: Date,
    updatedAt: Date
}
```

`GET /api/events?featured=true` can then populate a "Featured Events" carousel on the homepage.

---

## Summary

| Endpoint                       | Method | Auth   | Purpose                                                 |
|--------------------------------|--------|--------|---------------------------------------------------------|
| `/api/events`                  | GET    | Public | List events with filtering, search, sorting, pagination |
| `/api/events/:eventId`         | GET    | Public | Get event details                                       |
| `/api/events`                  | POST   | Admin  | Create event                                            |
| `/api/events/:eventId`         | PUT    | Admin  | Replace event                                           |
| `/api/events/:eventId`         | PATCH  | Admin  | Partially update event                                  |
| `/api/events/:eventId/archive` | PATCH  | Admin  | Archive (soft delete) event                             |
| `/api/events/:eventId/restore` | PATCH  | Admin  | Restore archived event                                  |

---

## Naming Consistency Note

Applies across all modules going forward, so it's captured here as the reference point:

| Database field (frozen schema) | API route / query parameter |
|--------------------------------|-----------------------------|
| `eventID`                      | `eventId`                   |
| `fighterID`                    | `fighterId`                 |
| `categoryID`                   | `categoryId`                |
| `departmentID`                 | `departmentId`              |

The database schema keeps its existing field names — controllers simply map the camelCase API parameter (e.g. `eventId`) to the corresponding database field (`eventID`). This keeps the public API idiomatic for the JS/Node ecosystem without touching the frozen schema.