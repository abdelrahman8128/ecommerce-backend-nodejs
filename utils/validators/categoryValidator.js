const { check,body } = require("express-validator");
const slugify=require("slugify");

const validatorMiddlewar = require("../../middlewares/validatorMiddlewar");

exports.getCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid caategory id format"),
  validatorMiddlewar,
];

exports.createCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("category required")
    .isLength({ min: 3 })
    .withMessage("Too short category name")
    .isLength({ max: 32 })
    .withMessage("Too long Category name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddlewar,
];

exports.UpdateCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid caategory id format"),
  
  body('name').custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  
  validatorMiddlewar,
];

exports.deleteCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid caategory id format"),
  validatorMiddlewar,
];
