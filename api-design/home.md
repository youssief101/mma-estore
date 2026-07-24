# Home API

**Module:** Home
**Phase:** 2.12
**Depends on:** Products, Fighters, Events, Categories, Brands (optional), Hero Banners

## Overview

Unlike every other module so far, Home doesn't correspond to a single database collection — it's an **aggregation API**. The homepage doesn't own data; it collects data from products, events, categories, fighters, and banners and presents it as one composed response. This is the same pattern large e-commerce sites use: there's no `home` table, just a controller that reads from several collections and assembles a page.

### Why a Home API?

Without it, Angular would need six or more separate requests to render one page:

```
GET /products?featured=true
GET /products?trending=true
GET /products?onSale=true
GET /fighters?champion=true
GET /events?featured=true
GET /categories
```

Instead, Angular makes a single request:

```
GET /api/home
```

and the backend combines the data server-side.

## Responsibilities

- Homepage banners
- Featured products
- Trending products
- Champion gear
- Sale products
- Featured events
- Featured fighters
- New arrivals
- Home page sections

**Out of scope:** CRUD operations, orders, authentication, inventory, payments.

---

## Endpoint

### GET /api/home

Returns all homepage content in a single response.

**Auth:** Public

**Backend process:** reads Products, Fighters, Events, Categories, and (optionally) Brands, and combines them into one payload.

**Response — 200**
```json
{
    "success": true,
    "data": {
        "heroBanner": [
            {
                "title": "UFC 331",
                "image": "...",
                "link": "/events/..."
            }
        ],
        "featuredProducts": [],
        "trendingProducts": [],
        "championGear": [],
        "saleProducts": [],
        "newArrivals": [],
        "featuredEvents": [],
        "featuredFighters": [],
        "categories": []
    }
}
```

---

## Where Each Section Comes From

| Section | Source |
|---------|--------|
| Hero Banner | new `heroBanners` collection (not products or events) |
| Featured Products | `Product.find({ "display.featured": true })` |
| Trending Products | `Product.find({ "display.trending": true })` |
| Champion Gear | `Product.find({ "display.championGear": true })` |
| New Arrivals | `Product.find({ "display.newArrival": true })` |
| Sale Products | `Product.find({ onSale: true })` |
| Featured Fighters | `Fighter.find({ featured: true })` |
| Featured Events | `Event.find({ featured: true })` |
| Categories | `Category.find()` |

Hero banners are marketing content, not product or event data, so they get their own collection rather than being derived from an existing one.

---

## Why No CRUD

Home is not an entity — there's no `POST /api/home`, `PUT /api/home`, or `DELETE /api/home`. Admins edit Products, Events, Banners, and Categories individually through their own modules, and the Home page automatically reflects those changes on next read.

---

## Authorization Matrix

| Endpoint | Guest | Customer | Admin |
|----------|:-----:|:--------:|:-----:|
| GET /home | ✅ | ✅ | ✅ |

Only one endpoint exists in this module.

---

## Response Standard

**Success**
```json
{
    "success": true,
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

## Hero Banner Collection

Marketing content (a sale promo, free shipping banner, new collection announcement) doesn't always correspond to a single product or event, so it needs its own collection: `heroBanners`.

```javascript
{
    _id: ObjectId,
    title: String,
    subtitle: String,
    image: String,
    buttonText: String,
    buttonLink: String,
    displayOrder: Number,
    active: Boolean,
    startDate: Date,
    endDate: Date,
    createdAt: Date,
    updatedAt: Date
}
```

This gives the admin full control over homepage promotions — e.g. "UFC 331", "Summer Sale", "Free Shipping", "New Venum Collection" — independent of the product or event catalog.

---

## Suggested Home Page Layout

The API response is ordered to match how the page renders, so the frontend consumes each section without extra requests:

```
Home
 ├── Hero Banners
 ├── Featured Categories
 ├── Featured Events
 ├── Trending Products
 ├── Champion Gear
 ├── New Arrivals
 ├── Sale Products
 ├── Featured Fighters
 └── Footer (static Angular component)
```

---

## Performance Consideration

Since the homepage is hit on nearly every visit, cap each section rather than returning full collections:

```javascript
featuredProducts: 8
trendingProducts: 8
championGear: 8
saleProducts: 8
newArrivals: 8
featuredEvents: 4
featuredFighters: 8
categories: all
heroBanners: 3
```

This keeps the payload small and the page fast.

---

## Summary

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/api/home` | GET | Public | Retrieve all homepage content in a single request |

---

## Design Note

The `display` object on `products` (from `products.md`) is the single source of truth for homepage placement:

```javascript
display: {
    featured: Boolean,
    trending: Boolean,
    championGear: Boolean,
    newArrival: Boolean
}
```

The admin dashboard toggles these flags directly, and the Home API automatically reflects the change — no hardcoded product IDs, and the homepage stays fully data-driven.

---

This completes the public-facing storefront APIs. Remaining phases move into **Payment**, the **Admin Dashboard**, and supporting services like image upload, inventory management, and analytics, all built on top of the modules designed so far.
