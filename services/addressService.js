const User=require('../models/userModel');
const ApiError=require('../utils/apiError');




// @desc    Add Address to addresses
// @route   POST /api/v1/addresses
// @access  user

exports.addAddressToAddresses = async function(req, res, next) {
try {   const user= await User.findByIdAndUpdate(req.user._id,
        {
            $addToSet:{addresses:req.body},
        },
        {
            new:true,
        }
   
);
res.status(200).json({status: 'success',message:'product added successfully to your wish list',data:user.addresses});
}
catch(err) {
    return next(new ApiError('Failed to add product to addresses',500));
};
};

exports.removeAddressFromAddresses = async function(req, res, next) {
try {   const user= await User.findByIdAndUpdate(req.user._id,
        {
            $pull:{addresses:{_id:req.params.addressId}},
        },
        {
            new:true,
        }
   
);
res.status(200).json({status: 'success',message:'address removed successfully from your addresses',data:user.addresses});
}
catch(err) {
    return next(new ApiError('Failed to remove product product addresses',500));
};
};


exports.getLoggedUserAddresses = async function(req, res, next) {
    const user = await User.findById(req.user._id).populate('addresses');
    res.status(200).json({status: 'success',results:user.addresses.length, data:user.addresses});
}