const stripe = require("stripe")(process.env.STRIPE_SECRET);

const factory = require("./handlersFactory");
const ApiError = require("../utils/apiError");

const Product = require("../models/productModel");
const Cart = require("../models/cartModel");
const Order = require("../models/orderModel");
const User = require("../models/userModel");

exports.createCashOrder = async (req, res, next) => {
  const taxPrice = 0;
  const shipingPrice = 0;
  const cart = await Cart.findById(req.params.cartId);
  if (!cart) {
    return next(new ApiError("Cart not found", 404));
  }

  const cartPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalCartPrice;

  const totalOrderPrice = cartPrice + taxPrice + shipingPrice;

  const order = await Order.create({
    user: req.user._id,
    cartItems: cart.cartItems,
    totalOrderPrice,
    shippingAddress: req.body.shippingAddress,
  });
  if (order) {
    const bulkOption = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));
    await Product.bulkWrite(bulkOption, {});
    await Cart.findByIdAndDelete(req.params.cartId);
  } else {
    return next(new ApiError("Failed to create order", 500));
  }
  res.status(201).json({
    status: "success",
    message: "Order created successfully",
    data: order,
  });
};

exports.filterOrderForLoggedUser = async (req, res, next) => {
  if (req.user.role === "user") req.filterObj = { user: req.user._id };

  next();
};

exports.findAllOrders = factory.getAll(Order);

exports.findOrderById = factory.getOne(Order);

exports.updateOrderToPaid = async function (req, res, next) {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new ApiError("Order not found", 404));
  }

  order.isPaid = true;
  order.paidAt = Date.now();
  const updatedOrder = await order.save();

  res.status(200).json({
    status: "success",
    message: "Order paid successfully",
    data: updatedOrder,
  });
};

exports.updateOrderToDeliverd = async function (req, res, next) {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new ApiError("Order not found", 404));
  }

  order.isDeliverd = true;
  const updatedOrder = await order.save();

  res.status(200).json({
    status: "success",
    message: "Order deliverd successfully",
    data: updatedOrder,
  });
};



//@desc Get checkout session form stripe and send it as a response
//@route  GET/api/v1/checkout-session/cartId
//@access Protected/User


exports.getCheckoutSession = async (req, res, next) => {

try{  //1)get cart depend on cartId
  

  const cart = await Cart.findById(req.params.cartId);
  if (!cart) {
    return next(new ApiError("Cart not found", 404));
  }

//2) order price depend on cart price 'check if coupon apply'

  const cartPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalCartPrice;











//3) Create stripe checkout session
  const session = await stripe.checkout.sessions.create(
    


    {

    line_items: [

      {
        quantity: 1,
        price_data: {
          currency: 'egp',
          unit_amount: cartPrice*1000,
          product_data: {
            name: 'T-shirt',
            description: 'Comfortable cotton t-shirt',
          },
        },
       
      }

    ],
    mode:'payment',

    success_url: `${req.protocol}://${req.get("host")}/orders/`,
    cancel_url: `${req.protocol}://${req.get("host")}/cart`,
    customer_email:req.user.email,
    client_reference_id:req.params.cartId,
    metadata:req.body.shippingAddress,


    

  
  });

  res.status(200).json({
    status: "success",
    message: "Checkout session created successfully",
    session,
  });}
  catch(err){
    return next(new ApiError(err.message,500));
  }
};




exports.webhookCheckout =async(req,res,next)=>{
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      // TODO: Handle the checkout.session.completed event

      console.log('create order here');
    } 
  
  }
  catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  

};

