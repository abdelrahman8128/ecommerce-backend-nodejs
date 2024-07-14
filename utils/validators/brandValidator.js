const { check,body } = require("express-validator");
const slugify=require("slugify");

const validatorMiddlewar = require("../../middlewares/validatorMiddlewar");


exports.getBrandValidator = [
  check("id").isMongoId().withMessage("Invalid caategory id format"),
  validatorMiddlewar,
];

exports.createBrandValidator = [
  check("name")
    .notEmpty()
    .withMessage("Brand required")
    .isLength({ min: 3 })
    .withMessage("Too short Brand name")
    .isLength({ max: 32 })
    .withMessage("Too long Brand name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddlewar,
];

exports.UpdateBrandValidator = [
  check("id").isMongoId().withMessage("Invalid brrand id format"),
  body('name').custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),

  validatorMiddlewar,
];

exports.deleteBrandValidator = [
  check("id").isMongoId().withMessage("Invalid brrand id format"),
  validatorMiddlewar,
];
