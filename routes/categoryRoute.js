const express =require('express');

const subCategoryiesRoute=require('./subCategoryRoute');
const authService=require('../services/authService');
const {
    getCategoryValidator,
    createCategoryValidator,
    UpdateCategoryValidator,
    deleteCategoryValidator,
    }=require("../utils/validators/categoryValidator")

const {
    getCategories,
    createCategory,
    getCategory,
    updateCategory,
    deleteCategory,   
    uploadCategoryImage,
    resizeImage,
    }=require('../services/categoryService');

    const router = express.Router();
router.use('/:categoryId/subcategories',subCategoryiesRoute);

router.route('/')
.get(
    getCategories
)

.post(
    authService.protect,
    authService.allowedTo("admin"),
    uploadCategoryImage,
    resizeImage,
    createCategoryValidator,
    createCategory,
);

router.route('/:id')
    .get(
        getCategoryValidator,
        getCategory,
    )

    .put(
        authService.protect,
        authService.allowedTo("admin"),
        uploadCategoryImage,
        resizeImage,
        UpdateCategoryValidator,
        updateCategory
    )
    .delete(
        
        authService.protect,
        authService.allowedTo("admin"),
        deleteCategoryValidator,
        deleteCategory
    );




router.route('/test').get((req,res)=>{res.json({data:'a7aaa'})});


module.exports=router;
