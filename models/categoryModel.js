const mongoose =require ('mongoose');

const categorySchema = new mongoose.Schema({
    name : {
        type: String,
        required:[true,'Category required'],
        unique:[true,'Category must be unique'],
        minLength:[3,'TooShort'],
        maxLength:[32,'Too long category name'],

    },
    slug:{
        type:String,
        lowercase:true,
    },
    image:String,
    
},
{ timestamps: true }
);

const categoryModel = mongoose.model('Category', categorySchema);

module.exports=categoryModel;