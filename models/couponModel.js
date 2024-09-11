const mongoose=require('mongoose');

const couponSchema = new mongoose.Schema({
    code:{
        type: String,
        required: [true, 'Coupon code is required'],
        unique: [true, 'Coupon code must be unique'],
    },
    discountPercentage:{
        type: Number,
        required: [true, 'Coupon discount percentage is required'],
        min: [0, 'Discount percentage must be greater than or equal to 0'],
        max: [100, 'Discount percentage must be less than or equal to 100'],
    },
    isActive:{
        type: Boolean,
        default: true,
    },
    usageLimit:{
        type: Number,
        default: 0,
    },
    usageCount:{
        type: Number,
        default: 0,
    },
    expiresAt:{
        type: Date,
        required: [true, 'Coupon expiration date is required'],
    },

},
{
    timestamps: true,
}
);

module.exports = mongoose.model('Coupon', couponSchema);