const { check, body } = require("express-validator");
const Review = require("../../models/reviewModel");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

exports.getReviewValidator = [validatorMiddleware];

exports.createReviewValidator = [
  ((req,res,next)=>{
    req.body.product=req.params.productId;
    req.body.user=req.user._id;
    next();
  }),
  check("title").optional(),
  check("ratings")
    .notEmpty()
    .withMessage("rating value required")
    .isFloat({ min: 1, max: 5 })
    .withMessage("rating value must be between 1 and 5"),
 // check("user").isMongoId().withMessage("invalid review id format"),
  check("product")
    .isMongoId()
    .withMessage("invalid product")
    .custom((val, { req }) =>
      
      Review.findOne({
        user: req.user._id,
        product: req.body.product,
      }).then((review) => {
        if (review) {
          throw new Error("you already created a review before");
        }
      })

    ),
  validatorMiddleware,
];

exports.UpdateReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid review id")
    .custom((val, { req }) =>
      Review.findById(val).then((review) => {
        if (!review) {
          throw new Error("review not found");
        }
        if (review.user._id.toString() !== req.user._id.toString()) {
          throw new Error("you are not authorized to update this review");
        }
      })
    ),

  validatorMiddleware,
];

exports.deleteReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid review id")
    .custom((val, { req }) => 
        Review.findById(val).then((review) => {
          if (!review) {
            throw(new Error("review not found"));
         
          }
          if (req.user.role === "user"&&review.user.toString() !== req.user._id.toString()) {
            throw new Error("you are not authorized to update this review");
          }
          
        })
      
    ),

  
  validatorMiddleware,
];
