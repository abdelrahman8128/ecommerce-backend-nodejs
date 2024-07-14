const express =require('express');

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
    }=require('../services/brandService');

const router = express.Router();

router.route('/').get(getBrands).post(createBrandValidator,createBrand);

router.route('/:id')
    .get(
        getBrandValidator,
        getBrand,
    )

    .put(UpdateBrandValidator,
        updateBrand
    )
    .delete(
        deleteBrandValidator,
        deleteBrand
    );




router.route('/test').get((req,res)=>{res.json({data:'a7aaa'})});


module.exports=router;
