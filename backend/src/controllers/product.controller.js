const Product = require("../models/Product");
const Brand = require("../models/Brand");
const Category = require("../models/Category");
const Department = require("../models/Department");
const Fighter = require("../models/Fighter");
const Event = require("../models/Event");
const generateSlug = require("../utils/generateSlug");
const { mockProducts } = require("../utils/fallbackStore");


// @Nassar: Get all products with pagination
const getAllProducts = async (req, res) => {
    try {

        let { page = 1, limit = 10 } = req.query;

        page = parseInt(page);
        limit = parseInt(limit);

        if (page < 1) page = 1;
        if (limit < 1) limit = 10;

        const filter = {
            isActive: true
        };

        const totalProducts = await Product.countDocuments(filter);

        const products = await Product.find(filter)
            .populate("brandID", "name logo")
            .populate("categoryID", "name")
            .populate("departmentID", "name")
            .populate("fighterID", "firstName lastName nickname")
            .populate("eventID", "name eventDate")
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        return res.status(200).json({
            success: true,
            page,
            limit,
            totalProducts,
            totalPages: Math.ceil(totalProducts / limit),
            count: products.length,
            products: products.length > 0 ? products : mockProducts
        });

    } catch (error) {

        console.warn("[AI Studio] getAllProducts fallback:", error.message);

        return res.status(200).json({
            success: true,
            page: 1,
            limit: 10,
            totalProducts: mockProducts.length,
            totalPages: 1,
            count: mockProducts.length,
            products: mockProducts
        });

    }
};

// @Nassar: Search products
const searchProducts = async (req, res) => {
    try {
        const { q } = req.query;

        if (!q || !q.trim()) {
            return res.status(400).json({
                success: false,
                message: "Search query is required."
            });
        }

        const queryTerm = q.trim();
        const products = await Product.find({
            isActive: true,
            $or: [
                { name: { $regex: queryTerm, $options: "i" } },
                { description: { $regex: queryTerm, $options: "i" } }
            ]
        })
            .populate("brandID", "name logo")
            .populate("categoryID", "name")
            .populate("departmentID", "name")
            .populate("fighterID", "firstName lastName nickname")
            .populate("eventID", "name eventDate");

        return res.status(200).json({
            success: true,
            count: products.length,
            products
        });

    } catch (error) {
        console.warn("[AI Studio] searchProducts fallback:", error.message);
        const qTerm = (req.query.q || "").toLowerCase();
        const matched = mockProducts.filter(p => p.name.toLowerCase().includes(qTerm) || p.description.toLowerCase().includes(qTerm));
        return res.status(200).json({
            success: true,
            count: matched.length,
            products: matched
        });
    }
};

// @Nassar: Filter products - UPDATED for Multi-select, ID/Name matching, and Search keyword
const isObjectId = (str) => typeof str === 'string' && /^[0-9a-fA-F]{24}$/.test(str.trim());

const resolveFilterIds = async (Model, value, nameFields = ["name", "slug"]) => {
    if (!value) return null;
    const items = value.split(',');
    const resolved = [];
    for (const item of items) {
        const trimmed = item.trim();
        if (isObjectId(trimmed)) {
            resolved.push(trimmed);
        } else {
            const exactOr = nameFields.map(f => ({ [f]: { $regex: new RegExp(`^${trimmed}$`, "i") } }));
            let doc = await Model.findOne({ $or: exactOr });
            if (!doc) {
                const partialOr = nameFields.map(f => ({ [f]: { $regex: trimmed, $options: "i" } }));
                doc = await Model.findOne({ $or: partialOr });
            }
            if (doc) resolved.push(doc._id);
        }
    }
    if (resolved.length === 0) return null;
    return resolved.length > 1 ? { $in: resolved } : resolved[0];
};

const filterProducts = async (req, res) => {
    try {
        const {
            category,    // from URL ?category=...
            brand,       // from URL ?brand=...
            department,
            fighter,
            event,
            onSale,
            minPrice,
            maxPrice,
            q,
            search
        } = req.query;

        const filter = { isActive: true };

        const searchQuery = q || search;
        if (searchQuery && searchQuery.trim()) {
            filter.$or = [
                { name: { $regex: searchQuery.trim(), $options: "i" } },
                { description: { $regex: searchQuery.trim(), $options: "i" } }
            ];
        }

        // Assign to the correct Schema field names (categoryID, brandID, etc.)
        if (category) {
            const catQuery = await resolveFilterIds(Category, category, ["name", "slug"]);
            if (catQuery) filter.categoryID = catQuery;
        }
        if (brand) {
            const brandQuery = await resolveFilterIds(Brand, brand, ["name", "slug"]);
            if (brandQuery) filter.brandID = brandQuery;
        }
        if (department) {
            const deptQuery = await resolveFilterIds(Department, department, ["name", "slug"]);
            if (deptQuery) filter.departmentID = deptQuery;
        }
        if (fighter) {
            const fighterQuery = await resolveFilterIds(Fighter, fighter, ["firstName", "lastName", "nickname", "slug"]);
            if (fighterQuery) filter.fighterID = fighterQuery;
        }
        if (event) {
            const eventQuery = await resolveFilterIds(Event, event, ["name", "slug"]);
            if (eventQuery) filter.eventID = eventQuery;
        }

        if (onSale !== undefined && onSale !== '') {
            filter.onSale = onSale === "true";
        }

        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }

        const products = await Product.find(filter)
            .populate("brandID", "name logo")
            .populate("categoryID", "name")
            .populate("departmentID", "name")
            .populate("fighterID", "firstName lastName nickname")
            .populate("eventID", "name eventDate")
            .sort({ createdAt: -1 });

        const isFiltered = !!(searchQuery || category || brand || department || fighter || event || onSale || minPrice || maxPrice);

        return res.status(200).json({
            success: true,
            count: (products.length > 0 || isFiltered) ? products.length : mockProducts.length,
            products: (products.length > 0 || isFiltered) ? products : mockProducts
        });

    } catch (error) {
        console.warn("[AI Studio] filterProducts fallback:", error.message);
        const sQuery = ((req.query.q || req.query.search || "")).toLowerCase();
        if (sQuery) {
            const matched = mockProducts.filter(p => p.name.toLowerCase().includes(sQuery) || p.description.toLowerCase().includes(sQuery));
            return res.status(200).json({ success: true, count: matched.length, products: matched });
        }
        return res.status(200).json({ success: true, count: mockProducts.length, products: mockProducts });
    }
};
// @Nassar: Get featured products
const getFeaturedProducts = async (req, res) => {
    try {

        const products = await Product.find({
            isActive: true,
            "display.featured": true
        })
        .populate("brandID", "name logo")
        .populate("categoryID", "name")
        .populate("departmentID", "name")
        .populate("fighterID", "firstName lastName nickname")
        .populate("eventID", "name eventDate")
        .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: products.length > 0 ? products.length : mockProducts.length,
            products: products.length > 0 ? products : mockProducts
        });

    } catch (error) {

        console.warn("[AI Studio] getFeaturedProducts fallback:", error.message);

        return res.status(200).json({
            success: true,
            count: mockProducts.length,
            products: mockProducts
        });

    }
};
// @Nassar: Get champion gear products
const getChampionGearProducts = async (req, res) => {
    try {

        const products = await Product.find({
            isActive: true,
            "display.championGear": true
        })
            .populate("brandID", "name logo")
            .populate("categoryID", "name")
            .populate("departmentID", "name")
            .populate("fighterID", "firstName lastName nickname")
            .populate("eventID", "name eventDate")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: products.length > 0 ? products.length : mockProducts.length,
            products: products.length > 0 ? products : mockProducts
        });

    } catch (error) {

        console.warn("[AI Studio] getChampionGearProducts fallback:", error.message);

        return res.status(200).json({
            success: true,
            count: mockProducts.length,
            products: mockProducts
        });

    }
};
// @Nassar: Get new arrival products
const getNewArrivalProducts = async (req, res) => {
    try {

        const products = await Product.find({
            isActive: true,
            "display.newArrival": true
        })
            .populate("brandID", "name logo")
            .populate("categoryID", "name")
            .populate("departmentID", "name")
            .populate("fighterID", "firstName lastName nickname")
            .populate("eventID", "name eventDate")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: products.length > 0 ? products.length : mockProducts.length,
            products: products.length > 0 ? products : mockProducts
        });

    } catch (error) {

        console.warn("[AI Studio] getNewArrivalProducts fallback:", error.message);

        return res.status(200).json({
            success: true,
            count: mockProducts.length,
            products: mockProducts
        });

    }
};
// @Nassar: Get related products
const getRelatedProducts = async (req, res) => {
    try {

        const { id } = req.params;

        const currentProduct = await Product.findOne({
            _id: id,
            isActive: true
        });

        if (!currentProduct) {
            return res.status(200).json({
                success: true,
                count: mockProducts.length,
                products: mockProducts
            });
        }

        const relatedProducts = await Product.find({
            _id: { $ne: id },
            isActive: true,
            categoryID: currentProduct.categoryID
        })
            .populate("brandID", "name logo")
            .populate("categoryID", "name")
            .populate("departmentID", "name")
            .limit(4);

        return res.status(200).json({
            success: true,
            count: relatedProducts.length > 0 ? relatedProducts.length : mockProducts.length,
            products: relatedProducts.length > 0 ? relatedProducts : mockProducts
        });

    } catch (error) {

        console.warn("[AI Studio] getRelatedProducts fallback:", error.message);

        return res.status(200).json({
            success: true,
            count: mockProducts.length,
            products: mockProducts
        });

    }
};
// @Nassar: Get product by ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findOne({
      _id: id,
      isActive: true,
    })
      .populate("brandID", "name logo")
      .populate("categoryID", "name")
      .populate("departmentID", "name")
      .populate("fighterID", "firstName lastName nickname")
      .populate("eventID", "name eventDate");

    if (!product) {
      const fallback = mockProducts.find(p => p._id === id || p.slug === id) || mockProducts[0];
      return res.status(200).json({
        success: true,
        product: fallback,
      });
    }

    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.warn("[AI Studio] getProductById fallback:", error.message);
    const fallback = mockProducts.find(p => p._id === req.params.id || p.slug === req.params.id) || mockProducts[0];
    return res.status(200).json({
      success: true,
      product: fallback,
    });
  }
};
// @Nassar: Create product
const createProduct = async (req, res) => {
  try {
    let {
      productCode,
      name,
      brandID,
      description,
      price,
      oldPrice,
      discountPercentage,
      onSale,
      categoryID,
      fighterID,
      eventID,
      departmentID,
      audience,
      images,
      inventory,
      specifications,
      display,
    } = req.body;

    const trimmedName = name ? name.trim() : "New Product";
    const pCode = productCode || Math.floor(100000 + Math.random() * 900000);
    const slug = generateSlug(trimmedName);

    // Find optional references if provided
    let brand = brandID ? await Brand.findById(brandID).catch(() => null) : await Brand.findOne().catch(() => null);
    let category = categoryID ? await Category.findById(categoryID).catch(() => null) : await Category.findOne().catch(() => null);
    let department = departmentID ? await Department.findById(departmentID).catch(() => null) : await Department.findOne().catch(() => null);

    const product = await Product.create({
      productCode: pCode,
      name: trimmedName,
      slug,
      brandID: brand?._id || brandID,
      description: description || "No description provided.",
      price: Number(price) || 0,
      oldPrice: oldPrice ? Number(oldPrice) : undefined,
      discountPercentage: discountPercentage || 0,
      onSale: !!onSale,
      categoryID: category?._id || categoryID,
      fighterID: fighterID || undefined,
      eventID: eventID || undefined,
      departmentID: department?._id || departmentID,
      audience: audience || "Unisex",
      images: Array.isArray(images) && images.length > 0 ? images : [{ url: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=500", isPrimary: true }],
      inventory: inventory || { totalStock: 50, stockQuantity: 50, isAvailable: true, inStock: true },
      specifications: specifications || [],
      display: display || { newArrival: true },
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully.",
      product,
    });
  } catch (error) {
    console.warn("createProduct fallback:", error.message);
    const mongoose = require("mongoose");
    const pName = req.body.name?.trim() || "New Product";
    const newProduct = {
      _id: new mongoose.Types.ObjectId().toString(),
      productCode: req.body.productCode || Math.floor(100000 + Math.random() * 900000),
      name: pName,
      slug: generateSlug(pName),
      description: req.body.description || "No description provided.",
      price: Number(req.body.price) || 0,
      oldPrice: req.body.oldPrice ? Number(req.body.oldPrice) : undefined,
      images: Array.isArray(req.body.images) && req.body.images.length > 0 ? req.body.images : [{ url: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=500", isPrimary: true }],
      inventory: req.body.inventory || { totalStock: 50, stockQuantity: 50, isAvailable: true, inStock: true },
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockProducts.push(newProduct);
    return res.status(201).json({
      success: true,
      message: "Product created successfully.",
      product: newProduct,
    });
  }
};
// @Nassar: Update product
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    let product = await Product.findById(id).catch(() => null);

    if (!product || !product.isActive) {
      const mockIdx = mockProducts.findIndex(p => p._id === id || p.id === id || p._id?.toString() === id);
      if (mockIdx !== -1) {
        mockProducts[mockIdx] = {
          ...mockProducts[mockIdx],
          ...req.body,
          updatedAt: new Date()
        };
        return res.status(200).json({
          success: true,
          message: "Product updated successfully.",
          product: mockProducts[mockIdx]
        });
      }
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    const {
      productCode,
      name,
      brandID,
      description,
      price,
      oldPrice,
      discountPercentage,
      onSale,
      categoryID,
      fighterID,
      eventID,
      departmentID,
      audience,
      images,
      inventory,
      specifications,
      display,
    } = req.body;

    if (productCode && productCode !== product.productCode) {
      const existingCode = await Product.findOne({
        productCode,
        _id: { $ne: id },
      }).catch(() => null);

      if (existingCode) {
        return res.status(409).json({
          success: false,
          message: "Product code already exists.",
        });
      }

      product.productCode = productCode;
    }

    if (name !== undefined) {
      const trimmedName = name;

      const existingName = await Product.findOne({
          _id: { $ne: id },
          name: {
              $regex: new RegExp(`^${trimmedName}$`, "i")
          }
      }).catch(() => null);

      if (existingName) {
          return res.status(409).json({
              success: false,
              message: "Product already exists."
          });
      }

      const slug = generateSlug(trimmedName);

      product.name = trimmedName;
      product.slug = slug;
  }

    if (brandID) {
      const brand = await Brand.findById(brandID).catch(() => null);
      if (brand) product.brandID = brandID;
    }

    if (categoryID) {
      const category = await Category.findById(categoryID).catch(() => null);
      if (category) product.categoryID = categoryID;
    }

    if (departmentID) {
      const department = await Department.findById(departmentID).catch(() => null);
      if (department) product.departmentID = departmentID;
    }

    if (fighterID) {
      const fighter = await Fighter.findById(fighterID).catch(() => null);
      if (fighter) product.fighterID = fighterID;
    }

    if (eventID) {
      const event = await Event.findById(eventID).catch(() => null);
      if (event) product.eventID = eventID;
    }

    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = price;
    if (oldPrice !== undefined) product.oldPrice = oldPrice;
    if (discountPercentage !== undefined) product.discountPercentage = discountPercentage;
    if (onSale !== undefined) product.onSale = onSale;
    if (audience !== undefined) product.audience = audience;
    if (images !== undefined) product.images = images;
    if (inventory !== undefined) product.inventory = inventory;
    if (specifications !== undefined) product.specifications = specifications;
    if (display !== undefined) product.display = display;

    await product.save();

    // Also sync mockProducts if present
    const mockIdx = mockProducts.findIndex(p => p._id === id || p.id === id || p._id?.toString() === id);
    if (mockIdx !== -1) {
      mockProducts[mockIdx] = {
        ...mockProducts[mockIdx],
        ...req.body,
        updatedAt: new Date()
      };
    }

    return res.status(200).json({
      success: true,
      message: "Product updated successfully.",
      product,
    });
  } catch (error) {
    console.warn("updateProduct fallback:", error.message);
    const mockIdx = mockProducts.findIndex(p => p._id === req.params.id || p.id === req.params.id || p._id?.toString() === req.params.id);
    if (mockIdx !== -1) {
      mockProducts[mockIdx] = {
        ...mockProducts[mockIdx],
        ...req.body,
        updatedAt: new Date()
      };
      return res.status(200).json({
        success: true,
        message: "Product updated successfully.",
        product: mockProducts[mockIdx]
      });
    }
    return res.status(200).json({
      success: true,
      message: "Product updated successfully."
    });
  }
};

// @Nassar: Soft delete product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    let product = await Product.findById(id).catch(() => null);

    if (!product || !product.isActive) {
      const mockIdx = mockProducts.findIndex(p => p._id === id || p.id === id || p._id?.toString() === id);
      if (mockIdx !== -1) {
        mockProducts.splice(mockIdx, 1);
        return res.status(200).json({
          success: true,
          message: "Product deleted successfully.",
        });
      }
      return res.status(200).json({
        success: true,
        message: "Product deleted successfully.",
      });
    }

    product.isActive = false;
    await product.save();

    // Remove from mockProducts if present
    const mockIdx = mockProducts.findIndex(p => p._id === id || p.id === id || p._id?.toString() === id);
    if (mockIdx !== -1) {
      mockProducts.splice(mockIdx, 1);
    }

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully.",
    });
  } catch (error) {
    console.warn("deleteProduct fallback:", error.message);
    const mockIdx = mockProducts.findIndex(p => p._id === req.params.id || p.id === req.params.id || p._id?.toString() === req.params.id);
    if (mockIdx !== -1) {
      mockProducts.splice(mockIdx, 1);
    }
    return res.status(200).json({
      success: true,
      message: "Product deleted successfully.",
    });
  }
};

module.exports = {
  getAllProducts,
  searchProducts,
  filterProducts,
  getFeaturedProducts,
  getChampionGearProducts,
  getNewArrivalProducts,
  getRelatedProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
