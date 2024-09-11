const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const sharp = require('sharp');
const ApiError = require("../utils/apiError");
const factory = require("./handlersFactory");
const Category = require("../models/categoryModel");
const {uploadSingleImage}=require("../middlewares/uploadImageMiddleware");


// const multerStorage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/categories");
//   },
//   filename: function (req, file, cb) {
//     const ext = file.mimetype.split("/")[1];
//     const filename = `category-${uuidv4()}-${Date.now()}.${ext}`;
//     cb(null, filename);
//   },
// });

// const multerStorage = multer.memoryStorage();
// const multerFilter = function (req, file, cb) {
//   if (file.mimetype.startsWith("image/")) {
//     cb(null, true);
//   } else {
//     cb(new ApiError("Only image files are allowed!"), false);
//   }
// };

// const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

// exports.uploadCategoryImage = upload.single("image");


exports.uploadCategoryImage = uploadSingleImage('image');

exports.resizeImage = async (req, res,next) =>{
if (req.file){
    const filename = `category-${uuidv4()}-${Date.now()}.jpeg`;
    
   await sharp(req.file.buffer)
    .resize(600,600)
    .toFormat('jpeg')
    .toFile(`uploads/categories/${filename}`);


    req.body.image=filename;
    next();
}

};



// @desc    Get list of categories
// @route   GET /api/v1/categories
// @access  Public

// Build query
exports.getCategories = factory.getAll(Category);

// @desc    Get specific category by id
// @route   GET /api/v1/categories/:id
// @access  Public
exports.getCategory = factory.getOne(Category);

// @desc    Create category
// @route   POST  /api/v1/categories
// @access  Private
exports.createCategory = factory.createOne(Category);

// @desc    Update specific category
// @route   PUT /api/v1/categories/:id
// @access  Private
exports.updateCategory = factory.updateOne(Category);

// @desc    Delete specific category
// @route   DELETE /api/v1/categories/:id
// @access  Private
exports.deleteCategory = factory.deleteOne(Category);
