const crypto = require("crypto");
const jwt=require("jsonwebtoken");

const bcrypt = require("bcryptjs");
const ApiError = require("../utils/apiError");
const User = require("../models/userModel");
const sendEmail = require("../utils/sendEmail");
const createToken=require("../utils/createToken");

exports.signup = async (req, res, next) => {
  //create a new user
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  //generate token
  const token = createToken(user._id);

  res.status(201).json({ data: user, token: token });
};

exports.login = async (req, res, next) => {
  //check if user exists
  const user = await User.findOne({ email: req.body.email });

  if (!user ||!(await bcrypt.compare( req.body.password,user.password))) {
    return next(new ApiError("Invalid credentials", 401));
  }
  console.log("login");

  //generate token
  const token = createToken(user._id);

  res.status(200).json({ data: user, token });
};

exports.protect = async (req, res, next) => {
  //1) check if token exists, if exists, get

  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(
      new ApiError(
        "your are not logged in , plase login to get access this route"
      ),
      401
    );
  }

  //2) verify token (no change happens, expired token)

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  console.log(decoded);

  //3) check if user exists

  const currentUser = await User.findById(decoded.userId);
  if (!currentUser) {
    return next(
      new ApiError(
        "The user that belong to this token does no longer exist",
        401
      )
    );
  }

  //4) check if user change his password after token created

  if (currentUser.passwordChangedAt) {
    const passChangedTimestamp = parseInt(
      currentUser.passwordChangedAt.getTime() / 1000,
      10
    );
    // Password changed after token created (Error)
    if (passChangedTimestamp > decoded.iat) {
      return next(
        new ApiError(
          "User recently changed his password. please login again..",
          401
        )
      );
    }
  }

  req.user = currentUser;
  next();
};

exports.allowedTo =
  (...roles) =>
  async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError("you are not allowed to perform this action", 403)
      );
    }
    next();
  };

exports.forgotPassword = async (req, res, next) => {
  //1)get user by email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new ApiError(`thier is no user with that email${req.body.email}`)
    );
  }

  //2)if user exist genrate reset random 6 digits and save it in db
  
   const resetCode =Math.floor(100000+Math.random()*900000).toString();
//console.log(resetCode);
   const hashedResetCode=crypto
   .createHash("sha256")
   .update(resetCode)
   .digest("hex");

   user.passwordResetCode=hashedResetCode;
   user.passwordResetExpires=Date.now() + 10*60*1000; //10 minuts later
    user.passwordResetVerified=false;
  await user.save();
  //3) send the reset code via email`
try
{
  await sendEmail({
    email:user.email,
    subject:"your password reset code (valid for 10 minutes) ",
    message:`your reset code is :${resetCode}`,
  })
}
  catch(error){

    console.error(error);


    // user.passwordResetCode=undefined;
    // user.passwordResetExpires=undefined; //10 minuts later
    // user.passwordResetVerified=undefined;
   
    // await user.save();

    // return next(new ApiError(`error sending email${error.message}`,error.status));
    

}
  res.status(200).json({ message: "Reset code sent to your email" });



};

exports.verifyPassResetCode= async (req,res,next) => {
  const hashedResetCode = crypto
  .createHash('sha256')
  .update(req.body.resetCode)
  .digest('hex');

  const user = await User.findOne({
    _id: req.params.id,
  });

  if(user.passwordResetCode===hashedResetCode&&user.passwordResetExpires>Date.now()&&user.passwordResetVerified===false)
  {
    user.passwordResetVerified=true;
    await user.save();
    res.status(200).json({ message: "code verified successfully" });
  }
  else 
  {
    return next(new ApiError("Reset code invalid ro expired"));

  }


};


exports.resetPassword = async (req, res,next) =>{
try{
  const user = await User.findOne({
    _id: req.params.id,

  }).catch((err) =>new ApiError(`thier is no user${err.message} `,404))
  //console.log(req.body.newPassword);

  // if(!user.passwordResetVerified)
  // {
  //   return next(new ApiError("reset code not verified",400));
  // }

  user.password = req.body.newPassword;
  user.passwordResetCode=undefined;
  user.passwordResetExpires=undefined; 
  user.passwordResetVerified=undefined;


  await user.save();
  const token=createToken(user._id);
  
  res.status(200).json({ message: "password updated successfully",token });
  }catch (error) {
    next(new ApiError(`An error occurred: ${error.message}`, 500));
  }

};