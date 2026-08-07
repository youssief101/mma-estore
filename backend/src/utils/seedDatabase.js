const Category = require("../models/Category");
const Department = require("../models/Department");
const Brand = require("../models/Brand");
const Fighter = require("../models/Fighter");
const Event = require("../models/Event");
const Product = require("../models/Product");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

const {
  mockBrands,
  mockDepartments,
  mockCategories,
  mockFighters,
  mockEvents,
  mockProducts,
} = require("./fallbackStore");

async function seedDatabase() {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log("[AI Studio] Seeding default test users...");
      const customerPasswordHash = await bcrypt.hash("password123", 12);
      const adminPasswordHash = await bcrypt.hash("admin123", 12);

      await User.create([
        {
          username: "ufcfan",
          firstName: "UFC",
          lastName: "Fan",
          email: "customer@mma.com",
          passwordHash: customerPasswordHash,
          phone: "+1 555-0199",
          role: "Customer",
          isActive: true
        },
        {
          username: "adminuser",
          firstName: "Admin",
          lastName: "User",
          email: "admin@mma.com",
          passwordHash: adminPasswordHash,
          phone: "+1 555-0188",
          role: "Admin",
          isActive: true
        }
      ]);
    }

    const categoryCount = await Category.countDocuments();

    if (categoryCount === 0) {
      console.log("[AI Studio] Seeding initial categories, brands, departments, fighters & products...");

      // Seed Brands
      for (const b of mockBrands) {
        await Brand.updateOne({ slug: b.slug }, { $setOnInsert: b }, { upsert: true });
      }
      // Seed Departments
      for (const d of mockDepartments) {
        await Department.updateOne({ slug: d.slug }, { $setOnInsert: d }, { upsert: true });
      }
      // Seed Categories
      for (const c of mockCategories) {
        await Category.updateOne({ slug: c.slug }, { $setOnInsert: c }, { upsert: true });
      }
      // Seed Fighters
      for (const f of mockFighters) {
        await Fighter.updateOne({ slug: f.slug }, { $setOnInsert: f }, { upsert: true });
      }
      // Seed Events
      for (const e of mockEvents) {
        await Event.updateOne({ slug: e.slug }, { $setOnInsert: e }, { upsert: true });
      }

      // Lookup seeded IDs for products
      const dbUfc = await Brand.findOne({ slug: "ufc" });
      const dbCategoryGloves = await Category.findOne({ slug: "gloves" });
      const dbCategoryTshirts = await Category.findOne({ slug: "t-shirts" });
      const dbCategoryBelts = await Category.findOne({ slug: "belts" });
      const dbDeptGear = await Department.findOne({ slug: "gear" });
      const dbDeptMen = await Department.findOne({ slug: "men" });
      const dbIslam = await Fighter.findOne({ slug: "islam-makhachev" });
      const dbGaethje = await Fighter.findOne({ slug: "justin-gaethje" });
      const dbEvent = await Event.findOne({ slug: "ufc-300" });

      if (dbUfc && dbCategoryGloves && dbDeptGear) {
        const productsToSeed = [
          {
            productCode: 1001,
            name: "UFC Official Fight Gloves 4oz",
            slug: "ufc-official-fight-gloves-4oz",
            brandID: dbUfc._id,
            categoryID: dbCategoryGloves._id,
            departmentID: dbDeptGear._id,
            fighterID: dbIslam ? dbIslam._id : null,
            eventID: dbEvent ? dbEvent._id : null,
            description: "Official 4oz competition fight gloves used in championship bouts.",
            price: 129.99,
            oldPrice: 149.99,
            discountPercentage: 13,
            onSale: true,
            audience: "MEN",
            images: [{ url: "/images/gloves-category.jpg", isPrimary: true }],
            inventory: { totalStock: 50, variants: [{ size: "M", stock: 25 }, { size: "L", stock: 25 }] },
            specifications: [{ key: "Material", value: "Genuine Leather" }, { key: "Weight", value: "4oz" }],
            display: { featured: true, trending: true, championGear: true, newArrival: true },
            isActive: true,
          },
          {
            productCode: 1002,
            name: "UFC Makhachev Champion Walkout Tee",
            slug: "ufc-makhachev-champion-walkout-tee",
            brandID: dbUfc._id,
            categoryID: dbCategoryTshirts._id,
            departmentID: dbDeptMen._id,
            fighterID: dbIslam ? dbIslam._id : null,
            eventID: dbEvent ? dbEvent._id : null,
            description: "Official Walkout T-Shirt for Lightweight Champion Islam Makhachev.",
            price: 39.99,
            oldPrice: 49.99,
            discountPercentage: 20,
            onSale: true,
            audience: "MEN",
            images: [{ url: "/products/t-shirts/t-shirt1.png", isPrimary: true }],
            inventory: { totalStock: 100, variants: [{ size: "M", stock: 50 }, { size: "L", stock: 50 }] },
            specifications: [{ key: "Material", value: "100% Cotton" }],
            display: { featured: true, trending: true, championGear: true, newArrival: true },
            isActive: true,
          },
          {
            productCode: 1003,
            name: "UFC Legacy Championship Belt Replica",
            slug: "ufc-legacy-championship-belt-replica",
            brandID: dbUfc._id,
            categoryID: dbCategoryBelts._id,
            departmentID: dbDeptGear._id,
            fighterID: dbIslam ? dbIslam._id : null,
            eventID: dbEvent ? dbEvent._id : null,
            description: "Full-size authentic replica of the official UFC Championship Belt.",
            price: 649.99,
            oldPrice: 699.99,
            discountPercentage: 7,
            onSale: false,
            audience: "UNISEX",
            images: [{ url: "/images/belts-category.jpg", isPrimary: true }],
            inventory: { totalStock: 10, variants: [{ size: "L", stock: 10 }] },
            specifications: [{ key: "Plating", value: "Zinc Alloy & Gold" }],
            display: { featured: true, trending: true, championGear: true, newArrival: false },
            isActive: true,
          },
          {
            productCode: 1004,
            name: "Gaethje Highlight Graphic Tee",
            slug: "gaethje-highlight-graphic-tee",
            brandID: dbUfc._id,
            categoryID: dbCategoryTshirts._id,
            departmentID: dbDeptMen._id,
            fighterID: dbGaethje ? dbGaethje._id : null,
            eventID: dbEvent ? dbEvent._id : null,
            description: "Custom graphic T-shirt honoring 'The Highlight' Justin Gaethje.",
            price: 34.99,
            oldPrice: null,
            discountPercentage: 0,
            onSale: false,
            audience: "MEN",
            images: [{ url: "/products/t-shirts/t-shirt2.png", isPrimary: true }],
            inventory: { totalStock: 80, variants: [{ size: "L", stock: 80 }] },
            specifications: [{ key: "Material", value: "Cotton Blend" }],
            display: { featured: true, trending: true, championGear: false, newArrival: true },
            isActive: true,
          },
        ];

        for (const p of productsToSeed) {
          await Product.updateOne({ slug: p.slug }, { $setOnInsert: p }, { upsert: true });
        }
      }

      console.log("[AI Studio] Database seeded successfully.");
    }
  } catch (err) {
    console.warn("[AI Studio] Seeding warning:", err.message);
  }
}

module.exports = seedDatabase;
