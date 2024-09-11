const mongoose = require('mongoose');
const { collection } = require('./userModel');

const cartSchema = new mongoose.Schema(

{
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    cartItems: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
            },
            quantity: {
                type:Number,
                default:1,
            },
            color:String,
            price:Number,
            
        },
    ],
    totalCartPrice: {
        type: Number,
        
        //required: true,
    },
    totalPriceAfterDiscount: {
        type: Number,
        default:undefined,
        //required: true,
    },
    totalCartItems: {
        type: Number,
       // required: true,
    },
  
}

);

module.exports = mongoose.model('Cart', cartSchema);