const express = require("express");

const {
  createCashOrder,
  findAllOrders,
  findOrderById,
  filterOrderForLoggedUser,
  updateOrderToPaid,
  updateOrderToDeliverd,
  getCheckoutSession,
} = require("../services/orderService");

const authService = require("../services/authService");

const router = express.Router();

router.use(authService.protect);


router.get('/checkout-session/:cartId',authService.allowedTo('user'),getCheckoutSession);


router.route("/:cartId").post(authService.allowedTo("user"), createCashOrder);

router
  .route("/")
  .get(
    authService.allowedTo("user", "admin", "manger"),
    filterOrderForLoggedUser,
    findAllOrders
  );

router.route("/:id")
.get(

  findOrderById

);

router.put(
  '/id:/pay',
  authService.allowedTo('admin','manager'),
  updateOrderToPaid,

);

router.put(
  '/id:/deliverd',
  authService.allowedTo('admin','manager'),
  updateOrderToDeliverd,

);

module.exports = router;
