const Product = require("../models/Product");
const Brand = require("../models/Brand");
const Category = require("../models/Category");
const Department = require("../models/Department");
const Fighter = require("../models/Fighter");
const Event = require("../models/Event");
const generateSlug = require("../utils/generateSlug");

// @Nassar: Get all products
const getAllProducts = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit) || 10, 1);

    const skip = (page - 1) * limit;

    const totalProducts = await Product.countDocuments({
      active: true,
    });

    const products = await Product.find({
      active: true,
    })
      .populate("brandID", "name logo")
      .populate("categoryID", "name")
      .populate("departmentID", "name")
      .populate("fighterID", "firstName lastName nickname")
      .populate("eventID", "name eventDate")
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
      totalProducts,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
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

        const products = await Product.find({
            active: true,
            $text: {
                $search: q.trim()
            }
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

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });

    }
};
// @Nassar: Get featured products
const getFeaturedProducts = async (req, res) => {
    try {

        const products = await Product.find({
            active: true,
            "display.featured": true
        })
            .populate("brandID", "name logo")
            .populate("categoryID", "name")
            .populate("departmentID", "name")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: products.length,
            products
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });

    }
};
// @Nassar: Get related products
const getRelatedProducts = async (req, res) => {
    try {

        const { id } = req.params;

        const currentProduct = await Product.findOne({
            _id: id,
            active: true
        });

        if (!currentProduct) {
            return res.status(404).json({
                success: false,
                message: "Product not found."
            });
        }

        const relatedProducts = await Product.find({
            _id: { $ne: id },
            active: true,
            categoryID: currentProduct.categoryID
        })
            .populate("brandID", "name logo")
            .populate("categoryID", "name")
            .populate("departmentID", "name")
            .limit(4);

        return res.status(200).json({
            success: true,
            count: relatedProducts.length,
            products: relatedProducts
        });

    } catch (error) {

        console.error(error);

        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID."
            });
        }

        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });

    }
};
// @Nassar: Get product by ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findOne({
      _id: id,
      active: true,
    })
      .populate("brandID", "name logo")
      .populate("categoryID", "name")
      .populate("departmentID", "name")
      .populate("fighterID", "firstName lastName nickname")
      .populate("eventID", "name eventDate");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error(error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
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

    if (
      !productCode ||
      !name ||
      !brandID ||
      !description ||
      price === undefined ||
      !categoryID ||
      !departmentID ||
      !audience ||
      !images ||
      !inventory
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields.",
      });
    }

    const existingCode = await Product.findOne({ productCode });

    if (existingCode) {
      return res.status(409).json({
        success: false,
        message: "Product code already exists.",
      });
    }

    const trimmedName = name.trim();

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
      description: description.trim(),
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

    if (!product || !product.active) {
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

    if (name) {
      const trimmedName = name.trim();

      const existingName = await Product.findOne({
        name: {
          $regex: new RegExp(`^${trimmedName}$`, "i"),
        },
        _id: { $ne: id },
      });

      if (existingName) {
        return res.status(409).json({
          success: false,
          message: "Product already exists.",
        });
      }

      product.name = trimmedName;
      product.slug = generateSlug(trimmedName);
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

    if (description !== undefined) product.description = description.trim();

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

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID.",
      });
    }

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

    if (!product || !product.active) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    product.active = false;

    await product.save();

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully.",
    });
  } catch (error) {
    console.error(error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

module.exports = {
  getAllProducts,
  searchProducts,
  getFeaturedProducts,
  getRelatedProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
