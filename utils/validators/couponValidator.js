const { check, body } = require("express-validator");

const validatorMiddleware = require("../../middlewares/validatorMiddleware");

const Coupon = require("../../models/couponModel");

exports.getCouponValidator = [
  check("id").isMongoId().withMessage("Invalid Coupon id format"),
  validatorMiddleware,
];

exports.createCouponValidator = [
  check("code")
    .notEmpty()
    .withMessage("Coupon code is required")
    .custom(async (val) => {
      await Coupon.findOne({ code: val }).then((coupon) => {
        if (coupon) {
          throw new Error("Coupon code already exists");
        } else {
          return true;
        }
      });
    }),

  check("expiresAt").notEmpty().withMessage("expire date is required"),
  check("discountPercentage")
    .notEmpty()
    .withMessage("discount percentage is required")
    .isLength({
      min: 1,
      max: 100,
    })
    .withMessage("discount percentage must be between 1 and 100"),
  validatorMiddleware,
];

exports.UpdateCouponValidator = [
  check("id").isMongoId().withMessage("Invalid coupon id format"),
  check("code")
    .optional()
    .custom((val, { req }) => {
      const coupon = Coupon.findOne({ code: val });
      if (coupon) {
        throw new Error("Coupon code already exists");
      } else {
        return true;
      }
    }),

  check("expiresAt").optional(),
  check("discountPercentage")
    .optional()
    .isLength({
      min: 1,
      max: 100,
    })
    .withMessage("discount percentage must be between 1 and 100"),

  validatorMiddleware,
];

exports.deleteCouponValidator = [
  check("id").isMongoId().withMessage("Invalid coupon id format"),
  validatorMiddleware,
];
