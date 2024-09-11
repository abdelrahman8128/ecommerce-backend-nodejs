const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "brand required"],
      unique: [true, "brand must be unique"],
      minLength: [3, "TooShort"],
      maxLength: [32, "Too long brand name"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  { timestamps: true }
);


//findOne, findAll, update , create

brandSchema.post(['init','save'], (doc) =>{
  doc.image=`${process.env.BASE_URL}/brands/${doc.image}`;
}
); 

const brandModel = mongoose.model("brand", brandSchema);

module.exports = brandModel;
