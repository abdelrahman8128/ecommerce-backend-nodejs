const express = require("express");
const authService=require('../services/authService');
const reviewRoute=require('./reviewRoute');

const {
  getProductValidator,
  createProductValidator,
  updateProductValidator,
  deleteProductValidator,
} = require("../utils/validators/productValidator");

const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  resizeProductImages,
} = require("../services/productService");



const router = express.Router();

router.use('/:productId/reviews',reviewRoute);


router
  .route("/")
  .get(getProducts)
  .post( 
    authService.protect,
    authService.allowedTo("admin"),
    uploadProductImages,
    resizeProductImages,
    createProductValidator,
    createProduct
  );

router
  .route("/:id")
  .get(getProductValidator, getProduct)

  .put(
    authService.protect,
    authService.allowedTo("admin"),
    uploadProductImages,
    resizeProductImages,
    updateProductValidator,
    updateProduct
  )
  .delete(
    authService.protect,
    authService.allowedTo("admin"),
     deleteProductValidator,
     deleteProduct
  );

module.exports = router;
