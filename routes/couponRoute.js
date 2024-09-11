const express =require('express');
const authService=require('../services/authService');

const {
    getCouponValidator,
    createCouponValidator,
    UpdateCouponValidator,
    deleteCouponValidator,
    }=require("../utils/validators/couponValidator")

const {
    getCoupon,
    createCoupon,
    getCoupons,
    updateCoupon,
    deleteCoupon,    
    }=require('../services/couponService');

const router = express.Router();

router.route('/')
.get(
    authService.protect,
    authService.allowedTo("admin",'manger'),
    getCoupons
)
.post(
    authService.protect,
    authService.allowedTo("admin",'manger'),
    createCouponValidator,
    createCoupon,
);

router.route('/:id')
    .get(
        getCouponValidator,
        getCoupon,
    )

    .put(
        authService.protect,
        authService.allowedTo("admin","manger"),
        UpdateCouponValidator,
        updateCoupon
    )
    .delete(
        authService.protect,
        authService.allowedTo("admin",'manger'),
        deleteCouponValidator,
        deleteCoupon
    );






module.exports=router;
