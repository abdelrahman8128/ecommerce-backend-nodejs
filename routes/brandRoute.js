const express =require('express');
const authService=require('../services/authService');

const {
    getBrandValidator,
    createBrandValidator,
    UpdateBrandValidator,
    deleteBrandValidator,
    }=require("../utils/validators/brandValidator")

const {
    getBrand,
    createBrand,
    getBrands,
    updateBrand,
    deleteBrand,    
    uploadBrandImage,
    resizeImage,
    }=require('../services/brandService');

const router = express.Router();

router.route('/')
.get(
    getBrands
)
.post(
    authService.protect,
    authService.allowedTo("admin"),
    uploadBrandImage,
    resizeImage,
    createBrandValidator,
    createBrand,
);

router.route('/:id')
    .get(
        getBrandValidator,
        getBrand,
    )

    .put(
        authService.protect,
        authService.allowedTo("admin"),
        uploadBrandImage,
        resizeImage,
        UpdateBrandValidator,
        updateBrand
    )
    .delete(
        authService.protect,
        authService.allowedTo("admin"),
        deleteBrandValidator,
        deleteBrand
    );






module.exports=router;
