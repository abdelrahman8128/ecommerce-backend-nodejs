const express = require("express");
const authService=require('../services/authService');

const {
  createSubCategory,
  getSubCategories,
  getSubCategory,
  updateSubCategory,
  deleteSubCategory,
  setCategoryIdToBody,
  createFilterObj,
} = require("../services/subCategoryService");

const {
  createSubCategoryValidator,
  getSubCategoryValidator,
  deleteSubCategoryValidator,
  UpdateSubCategoryValidator,
} = require("../utils/validators/subCategoryValidator");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(
    authService.protect,
    authService.allowedTo("admin"),
    setCategoryIdToBody,
    createSubCategoryValidator,
    createSubCategory
  );
router.route("/")
.get(
    createFilterObj,
    getSubCategories
  );
router
  .route("/:id")
  .get(
    getSubCategoryValidator,
     getSubCategory
    )
  .delete(
      authService.protect,
      authService.allowedTo("admin"),
      deleteSubCategoryValidator,
      deleteSubCategory
    )
  .put(
      authService.protect,
      authService.allowedTo("admin"),
      UpdateSubCategoryValidator,
      updateSubCategory
    );

module.exports = router;
