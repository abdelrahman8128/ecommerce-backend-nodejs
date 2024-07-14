const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Product title is required"],
    trim: true,
    minLength: [3, "Too short product title"],
    maxLength: [128, "Too long product title"],
  },
  slug: {
    type: String,
    required: true,
    lowercase: true,
  },
  description: {
    type: String,
    required: [true, "Product description is required"],
    minLength: [20, "Too short product description"],
    maxLength: [500, "Too long product description"],
  },

  quantity: {
    type: Number,
    required: [true, "Product quantity is required"],
    min: [1, "Product must have at least one item"],
  },

  sold: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: [true, "Product price is required"],

    min: [1, "Product price must be greater than zero"],
  },
  priceAfterDiscount: {
    type: Number,
  },
  colors: [String],

  imageCover: {
    type: String,
    required: [true, "Product image cover is required"],
  },
  images: [String],

  category: {
    type: mongoose.Schema.ObjectId,
    ref: "Category",
    required: [true, "Product must belong to a category"],
  },
  brand: {
    type: mongoose.Schema.ObjectId,
    ref: "Brand",
  },
  subcategory: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "SubCategory",
    },
  ],

  ratingsAverage: {
    type: Number,
    min: [1, "Rating must be above or equal 1.0"],
    max: [5, "Rating must be below or equal 5.0"],
    default: 0,
  },
});

productSchema.pre(/^find/, function (next) {
  this.populate({
    path: "category",
    select: "name",
  });
  next();
});

module.exports = mongoose.model("Product", productSchema);
