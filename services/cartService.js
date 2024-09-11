const ApiError = require("../utils/apiError");

const Cart = require("../models/cartModel");

const Product = require("../models/productModel");

const Coupon = require("../models/couponModel");

function calculateCartTotalPrice( cart){
    let totalPrice = 0;
    cart.cartItems.forEach((item) => {
      totalPrice += item.price * item.quantity;
    });

    cart.totalCartPrice = totalPrice;
}


// @desc    Add product to cart
// @route   POST /api/v1/cart
// @access  user



exports.addProductToCart = async function (req, res, next) {
  try {
    const { productId, color } = req.body;

    const product = await Product.findById(productId);

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        cartItems: [
          {
            product: productId,
            color: color,
            price: product.price,
          },
        ],
      });
    } else {
      //product exist in cart, update product quantity
      const productIndex = cart.cartItems.findIndex(
        (item) => item.product.toString() === productId && item.color === color
      );
      if (productIndex > -1) {
        const CartItem = cart.cartItems[productIndex];
        CartItem.quantity += 1;
        cart.cartItems[productIndex] = CartItem;
      } else {
        //push product to cart
        cart.cartItems.push({
          product: productId,
          color: color,
          price: product.price,
        });
      }
    }
    //calculate total price
    calculateCartTotalPrice(cart);

    await cart.save();
    
    res.status(200).json({ status: "success", data: cart });
  
} catch (err) {
    next(new ApiError(err.message, 500));
  }
};


exports.getLoggedUserCart=async function (req, res, next) {

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
        return next(new ApiError(`there is no cart for this user id :${req.user._id}`,404));
    }
    res.status(200).json({numberOfCartItems:cart.cartItems.length,data:cart});
};

exports.deleteProductFromCart=async function (req, res, next) {
    try {
        const cart = await Cart.findOneAndUpdate(
            { user: req.user._id },
            { $pull: { cartItems: { _id: req.params.cartItemId, } } },
            { new: true }
        );
        calculateCartTotalPrice(cart);
        await cart.save();
        res.status(200).json({ status: "success", message: "product deleted successfully from cart", data: cart });
    }
    catch (err) {
        next(new ApiError(err.message, 500));
      }

}

exports.clearCart=async function(req, res, next) {
    try {
        const cart = await Cart.findOneAndDelete({ user: req.user._id });
        res.status(200).json({ status: "success", message: "cart cleared successfully", data: null });
    }
    catch (err) {
        next(new ApiError(err.message, 500));
    }
};

exports.updateCartItemQuantity=async function (req, res, next) {
    try {
        const cart = await Cart.findOneAndUpdate(
            { user: req.user._id,},
        );
        if (!cart){
            return next(new ApiError(`there is no cart for this user id :${req.user._id}`,404));
        }
       
        console.log(req.params.cartItemId);
            const cartItemIndex = cart.cartItems.findIndex(
                (item) => item._id.toString() === req.params.cartItemId
            );
            if (cartItemIndex > -1) {
                cart.cartItems[cartItemIndex].quantity= req.body.quantity;
            }
            else{
                return next(new ApiError(`cart item with id :${req.params.cartItemId} not found`,404));
            }
            calculateCartTotalPrice(cart);

            await cart.save();
        
        res.status(200).json({ status: "success", message: "cart item quantity updated successfully", data: cart });
    }
    catch (err) {
        next(new ApiError(err.message, 500));
    }
};

exports.applyCoupon=async function (req, res, next) {

    try {

        const coupon = await Coupon.findOne({
             code: req.body.coupon ,
             expiresAt:{$gt:Date.now(),}

            });
            
        if (!coupon) {
            console.log("No coupon");
            return next(new ApiError(`there is no coupon with code :${req.body.coupon}`,404));
        }

        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart){
            return next(new ApiError(`there is no cart for this user id :${req.user._id}`,404));
        }


        
        cart.totalPriceAfterDiscount=totalPriceAfterDiscount;
        await cart.save();
        res.status(200).json({ status: "success", message: "coupon applied successfully", data: cart });
    }
    catch (err) {
         return next(new ApiError(err.message, 500));
    }

};
