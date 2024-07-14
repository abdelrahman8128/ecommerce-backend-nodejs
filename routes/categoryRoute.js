const express =require('express');

const subCategoryiesRoute=require('./subCategoryRoute');
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
    }=require('../services/categoryService');

const router = express.Router();
router.use('/:categoryId/subcategories',subCategoryiesRoute);

router.route('/').get(getCategories).post(createCategoryValidator,createCategory);

router.route('/:id')
    .get(
        getCategoryValidator,
        getCategory,
    )

    .put(UpdateCategoryValidator,
        updateCategory
    )
    .delete(
        deleteCategoryValidator,
        deleteCategory
    );




router.route('/test').get((req,res)=>{res.json({data:'a7aaa'})});


module.exports=router;
