const express =require('express');
const authService=require('../services/authService');

const {
    getReviewValidator,
    createReviewValidator,
    UpdateReviewValidator,
    deleteReviewValidator,
    }=require("../utils/validators/reviewValidator")

const {
    getReview,
    createReview,
    getReviews,
    updateReview,
    deleteReview,    
   
    }=require('../services/reviewService');

const router = express.Router({ mergeParams: true });

router.route('/')
.get(
    getReviews
)
.post(
    authService.protect,
    authService.allowedTo("user"),
    createReviewValidator,
    createReview,
);

router.route('/:id')
    .get(
        getReviewValidator,
        getReview,
    )

    .put(
        authService.protect,
        authService.allowedTo("user"),
        UpdateReviewValidator,
        updateReview,
    )
    .delete(
        authService.protect,
        authService.allowedTo("admin", "user","manager"),
        deleteReviewValidator,
        deleteReview,
    );






module.exports=router;
