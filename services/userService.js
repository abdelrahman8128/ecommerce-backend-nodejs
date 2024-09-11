const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');
const bcrypt = require('bcryptjs');

const factory = require('./handlersFactory');
const ApiError = require('../utils/apiError');
const { uploadSingleImage } = require('../middlewares/uploadImageMiddleware');
const User = require('../models/userModel');
const createToken=require("../utils/createToken");



exports.uploadUserImage = uploadSingleImage('profileImage');

exports.resizeImage = async (req, res,next) =>{

    const filename = `user-${uuidv4()}-${Date.now()}.jpeg`;
    if (req.file)
    {
        await sharp(req.file.buffer)
            .resize(600,600)
            .toFormat('jpeg')
            .toFile(`uploads/users/${filename}`);
        req.body.profileImage=filename;
    }
    next();

};




// @desc    Get list of User
// @route   GET /api/v1/User
// @access  Public
exports.getUsers = factory.getAll(User);

// @desc    Get specific User by id
// @route   GET /api/v1/User/:id
// @access  Public
exports.getUser = factory.getOne(User);

// @desc    Create User
// @route   POST  /api/v1/User
// @access  Private
exports.createUser = factory.createOne(User);

// @desc    Update specific User
// @route   PUT /api/v1/User/:id
// @access  Private
exports.updateUser = async (req, res, next) => {
    const document = await User.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        slug: req.body.slug,
        phone: req.body.phone,
        email: req.body.email,
        profileImg: req.body.profileImg,
        role: req.body.role,
      },
      {
        new: true,
      }
    );
  
    if (!document) {
      return next(new ApiError(`No document for this id ${req.params.id}`, 404));
    }
    res.status(200).json({ data: document });
  };


  exports.changeUserPassword = async (req, res, next) => {
    try { 
            const document = await User.findByIdAndUpdate(
            req.params.id,
        {
            password: await bcrypt.hash(String(req.body.password), 12),
            passwordChangedAt: Date.now(),
        },
        {
            new: true,
        }
        );
    
        if (!document) {
        return next(new ApiError(`No document for this id ${req.params.id}`, 404));
        }
        res.status(200).json({ data: document });
    }
    catch (error) {
      next(new ApiError(`Error updating password\n ${error}`, 500));
    }
  };

// @desc    Delete specific User
// @route   DELETE /api/v1/User/:id
// @access  Private
exports.deleteUser = factory.deleteOne(User);

// @desc    Get logged user data
// @route   GET /api/v1/User/getMe
// @access  Private/protect

exports.getLoggedUserData = async (req, res, next) => {
   
  req.params.id = req.user._id;
  next();
};

exports.updateLoggedUserPassword=async (req, res, next) => {
  const user= await User.findByIdAndUpdate(
    req.user._id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },

    {
      new: true,
    }
  );
  const token=createToken(user._id);
  res.status(200).json({data:user, token})

}

exports.updateLoggedUserData=async (req, res, next) => {
  const user= await User.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    },
    {
      new: true,
    }
  );
  res.status(200).json({data:user})
}

exports.deleteLoggedUserData=async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id,{active:false});
  res.status(204).json({status:'Success'});
}