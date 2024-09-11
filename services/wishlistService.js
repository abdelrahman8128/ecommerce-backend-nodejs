const User=require('../models/userModel');
const ApiError=require('../utils/apiError');




// @desc    Add product to wishlist
// @route   POST /api/v1/wishlist
// @access  user

exports.addProductToWishlist = async function(req, res, next) {
try {   const user= await User.findByIdAndUpdate(req.user._id,
        {
            $addToSet:{wishlist:req.body.productId},
        },
        {
            new:true,
        }
   
);
res.status(200).json({status: 'success',message:'product added successfully to your wish list',data:user.wishlist});
}
catch(err) {
    return next(new ApiError('Failed to add product to wishlist',500));
};
};

exports.removeProductFromWishlist = async function(req, res, next) {
try {   const user= await User.findByIdAndUpdate(req.user._id,
        {
            $pull:{wishlist:req.params.productId},
        },
        {
            new:true,
        }
   
);
res.status(200).json({status: 'success',message:'product removed successfully to your wish list',data:user.wishlist});
}
catch(err) {
    return next(new ApiError('Failed to remove product product wishlist',500));
};
};


exports.getLoggedUserWishlist = async function(req, res, next) {
    const user = await User.findById(req.user._id).populate('wishlist');
    res.status(200).json({status: 'success',results:user.wishlist.length, data:user.wishlist});
}