const{check,body}=require('express-validator');
const slugify=require('slugify');

const validatorMiddlewar=require("../../middlewares/validatorMiddlewar")


exports.getSubCategoryValidator=[
    check('id').isMongoId().withMessage('Invalid subCaategory id format'), 
    validatorMiddlewar,
];

exports.createSubCategoryValidator=[
    check ('name')
    .notEmpty()
    .withMessage('Subcategory required')
    
    .isLength({min:2})
    .withMessage("Too short SubCategory name")
    .isLength({max:32})
    .withMessage('Too long SubCategory name')
    .custom((val, { req }) => {
        req.body.slug = slugify(val);
        return true;
      }),
    check('category').notEmpty().withMessage("subcategory must belong to a category")
    .isMongoId().withMessage('invalid category ID '),
    validatorMiddlewar,

];


exports.UpdateSubCategoryValidator=[
    check('id').isMongoId().withMessage('Invalid subCaategory id format'), 

    body('name').custom((val, { req }) => {
        req.body.slug = slugify(val);
        return true;
      }),

    validatorMiddlewar,
];



exports.deleteSubCategoryValidator=[
    check('id').isMongoId().withMessage('Invalid SubCaategory id format'), 
    validatorMiddlewar,
];
