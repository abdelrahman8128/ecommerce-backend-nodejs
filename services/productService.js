const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const factory = require("./handlersFactory");
const Product = require("../models/productModel");
const { uploadSingleImage , uploadMixOfImages } = require("../middlewares/uploadImageMiddleware");
const ApiError = require("../utils/apiError");



exports.uploadProductImages = uploadMixOfImages([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 5 },
]);



exports.resizeProductImages = async (req, res, next) => {
  if (req.files.imageCover) {
    const filename = `product-${uuidv4()}-${Date.now()}.jpeg`;

    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat("jpeg")
      .toFile(`uploads/products/${filename}`);

    req.body.imageCover = filename;
  }
  if (req.files.images) {
    req.body.images = [];
    await Promise.all(
      req.files.images.map(async (img, index) => {
        const filename = `product-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;
        await sharp(img.buffer)
          .resize(2000, 1333)
          .toFormat("jpeg")
          .toFile(`uploads/products/${filename}`);
        req.body.images.push(filename);
      })
    );
  }

  next();
};

// @desc    Get list of products
// @route   GET /api/v1/products
// @access  Public
exports.getProducts = factory.getAll(Product, "Products");

// @desc    Get specific product by id
// @route   GET /api/v1/products/:id
// @access  Public
exports.getProduct = factory.getOne(Product,'Reviews');

// @desc    Create product
// @route   POST  /api/v1/products
// @access  Private
exports.createProduct = factory.createOne(Product);
// @desc    Update specific product
// @route   PUT /api/v1/products/:id
// @access  Private
exports.updateProduct = factory.updateOne(Product);

// @desc    Delete specific product
// @route   DELETE /api/v1/products/:id
// @access  Private
exports.deleteProduct = factory.deleteOne(Product);
