const express =require('express');
const authService=require('../services/authService');

// const {
//     getCartValidator,
//     createCartValidator,
//     UpdateCartValidator,
//     deleteCartValidator,
//     }=require("../utils/validators/CartValidator")

const {
    addProductToCart,  
    getLoggedUserCart,  
    deleteProductFromCart,
    clearCart,
    updateCartItemQuantity,
    applyCoupon,
    }=require('../services/cartService');

const router = express.Router();

router.route('/')
.post(
    authService.protect,
    authService.allowedTo("user"),
   
    addProductToCart,
)
.get(
    authService.protect,
    authService.allowedTo("user"),
    getLoggedUserCart,
 
)
.delete(
    authService.protect,
    authService.allowedTo("user"),
    clearCart,
)
;


router.route("/applyCoupon")
.put(
    authService.protect,
    authService.allowedTo("user"),
    applyCoupon,
)



router.route("/:cartItemId")
.delete(
    authService.protect,
    authService.allowedTo("user"),
    deleteProductFromCart,
).put(
    authService.protect,
    authService.allowedTo("user"),
    updateCartItemQuantity, 
)

module.exports=router;
