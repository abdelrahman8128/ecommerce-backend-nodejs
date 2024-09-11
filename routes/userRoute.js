const express = require("express");
const authService=require("../services/authService");
const {
  getUserValidator,
  createUserValidator,
  UpdateUserValidator,
  deleteUserValidator,
  changeUserPasswordValidator,
  UpdateLoggedUserValidator,
} = require("../utils/validators/userValidator");

const {
  getUser,
  createUser,
  getUsers,
  updateUser,
  deleteUser,
  uploadUserImage,
  resizeImage,
  changeUserPassword,
  getLoggedUserData,
  updateLoggedUserPassword,
  
  updateLoggedUserData,
  deleteLoggedUserData,

} = require("../services/userService");

const router = express.Router();

router.get("/getMe",authService.protect,getLoggedUserData,getUser);
router.put("/changeMyPassword",authService.protect,getLoggedUserData,updateLoggedUserPassword);
router.put("/updateMyData",authService.protect,UpdateLoggedUserValidator,updateLoggedUserData);
router.put("/deleteMyAccount",authService.protect,deleteLoggedUserData);

router.route("/")
.get(
   authService.protect,
    authService.allowedTo("admin"),
  getUsers,
).post(
  authService.protect,
  authService.allowedTo("admin"),
  uploadUserImage, 
  resizeImage,
  createUserValidator, 
  createUser,
);

router.route("/changePassword/:id").put(changeUserPasswordValidator,changeUserPassword);

router
  .route("/:id")
  .get(getUserValidator,getUser)

  .put(uploadUserImage, resizeImage,UpdateUserValidator ,updateUser)
  .delete(deleteUserValidator,deleteUser);

module.exports = router;
