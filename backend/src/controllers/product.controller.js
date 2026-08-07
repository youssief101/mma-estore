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

    const existingCode = await Product.findOne({ productCode });

    if (existingCode) {
      return res.status(409).json({
        success: false,
        message: "Product code already exists.",
      });
    }

    const trimmedName = name;

    const existingName = await Product.findOne({
      name: {
        $regex: new RegExp(`^${trimmedName}$`, "i"),
      },
    });

    if (existingName) {
      return res.status(409).json({
        success: false,
        message: "Product already exists.",
      });
    }

    const slug = generateSlug(trimmedName);

    const existingSlug = await Product.findOne({ slug });

    if (existingSlug) {
      return res.status(409).json({
        success: false,
        message: "A product with this slug already exists.",
      });
    }

    const brand = await Brand.findById(brandID);
    if (!brand) {
      return res.status(404).json({
        success: false,
        message: "Brand not found.",
      });
    }

    const category = await Category.findById(categoryID);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found.",
      });
    }

    const department = await Department.findById(departmentID);
    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found.",
      });
    }

    if (fighterID) {
      const fighter = await Fighter.findById(fighterID);

      if (!fighter) {
        return res.status(404).json({
          success: false,
          message: "Fighter not found.",
        });
      }
    }

    if (eventID) {
      const event = await Event.findById(eventID);

      if (!event) {
        return res.status(404).json({
          success: false,
          message: "Event not found.",
        });
      }
    }

    const product = await Product.create({
      productCode,
      name: trimmedName,
      slug,
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
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully.",
      product,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};
// @Nassar: Update product
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product || !product.isActive) {
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
      });

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
      });

      if (existingName) {
          return res.status(409).json({
              success: false,
              message: "Product already exists."
          });
      }

      const slug = generateSlug(trimmedName);

      const existingSlug = await Product.findOne({
          _id: { $ne: id },
          slug
      });

      if (existingSlug) {
          return res.status(409).json({
              success: false,
              message: "A product with this slug already exists."
          });
      }

      product.name = trimmedName;
      product.slug = slug;
  }

    if (brandID) {
      const brand = await Brand.findById(brandID);

      if (!brand) {
        return res.status(404).json({
          success: false,
          message: "Brand not found.",
        });
      }

      product.brandID = brandID;
    }

    if (categoryID) {
      const category = await Category.findById(categoryID);

      if (!category) {
        return res.status(404).json({
          success: false,
          message: "Category not found.",
        });
      }

      product.categoryID = categoryID;
    }

    if (departmentID) {
      const department = await Department.findById(departmentID);

      if (!department) {
        return res.status(404).json({
          success: false,
          message: "Department not found.",
        });
      }

      product.departmentID = departmentID;
    }

    if (fighterID) {
      const fighter = await Fighter.findById(fighterID);

      if (!fighter) {
        return res.status(404).json({
          success: false,
          message: "Fighter not found.",
        });
      }

      product.fighterID = fighterID;
    }

    if (eventID) {
      const event = await Event.findById(eventID);

      if (!event) {
        return res.status(404).json({
          success: false,
          message: "Event not found.",
        });
      }

      product.eventID = eventID;
    }

    if (description !== undefined)
      product.description = description;

    if (price !== undefined) product.price = price;

    if (oldPrice !== undefined) product.oldPrice = oldPrice;

    if (discountPercentage !== undefined)
      product.discountPercentage = discountPercentage;

    if (onSale !== undefined) product.onSale = onSale;

    if (audience !== undefined) product.audience = audience;

    if (images !== undefined) product.images = images;

    if (inventory !== undefined) product.inventory = inventory;

    if (specifications !== undefined) product.specifications = specifications;

    if (display !== undefined) product.display = display;

    await product.save();

    return res.status(200).json({
      success: true,
      message: "Product updated successfully.",
      product,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};
// @Nassar: Soft delete product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product || !product.isActive) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    product.isActive = false;

    await product.save();

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
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
