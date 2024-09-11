const express = require("express");

const {
    signupValidator,
    loginValidator,
}=require('../utils/validators/authValidator')


const {
 signup,
 login,
 forgotPassword,
 verifyPassResetCode,
 resetPassword,
} = require("../services/authService");

const router = express.Router();


router.route("/signup").post(signupValidator,signup);
router.route("/login").post(loginValidator,login);
router.route("/forgotPassword").post(forgotPassword);
router.route("/verifyPassResetCode/:id").post(verifyPassResetCode);
router.route("/resetPassword/:id").put(resetPassword);

// router.route("/").get(getUsers).post(uploadUserImage, resizeImage,createUserValidator, createUser);

// router.route("/changePassword/:id").put(changeUserPasswordValidator,changeUserPassword);

// router
//   .route("/:id")
//   .get(getUserValidator,getUser)

//   .put(uploadUserImage, resizeImage,UpdateUserValidator ,updateUser)
//   .delete(deleteUserValidator,deleteUser);

module.exports = router;
