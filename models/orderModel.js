const mongoose = require('mongoose');

const orderSchema=mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    cartItems:[{
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
    }],
    totalOrderPrice:{
        type:Number,
        default:0,
    },
    taxPrice:{
        type:Number,
        default:0
    },
    shippedPrice:{
        type:Number,
        default:0
    },
    isPaid:{
        type:Boolean,
        default:false
    },
    paidAt:{
        type:Date
    },
    deliveredAt:{
        type:Date
    },
    cancelledAt:{
        type:Date
    },
    paymentMethodType:{
        type:String,
        enum:['cash','card'],
        default:'cash',

    },

    shippingAddress:{
        details:String,
        phone:String, 
        city:String,
        postalCode:String,
    },
    isDelivered:{
        type:Boolean,
        default:false,
    }
},
{
    timestamps: true,
},

);


orderSchema.pre(/^find/, function (next) {
    this.populate({
        path:'user',
        select:'name profileImg email phone',

    })
    .populate({
        path:'cartItems.product',
        select:'title price',
    });

    next();

});

module.exports=mongoose.model('Order',orderSchema);