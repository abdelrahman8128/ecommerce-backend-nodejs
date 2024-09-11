const { check,body } = require("express-validator");
const slugify=require("slugify");
const bcrypt = require('bcryptjs');

const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const User=require('../../models/userModel');

exports.getUserValidator = [
  check("id").isMongoId().withMessage("Invalid user id format"),
  validatorMiddleware,
];

exports.createUserValidator = [
  check("name")
    .notEmpty()
    .withMessage("User required")
    .isLength({ min: 3 })
    .withMessage("Too short User name")
    .isLength({ max: 32 })
    .withMessage("Too long User name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
    check('email').
    notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email')
    .custom((val)=>User.findOne({email:val}).then((user)=>{
        if(user){
            return Promise.reject('Email already exists');
        }
    })),

    check('password').
    notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
    .custom((val,{req})=>{
        if (val !== req.body.passwordConfirm){
            throw new Error('passwork confirmation Incorrect');
        }
        else{
            return true;
        }
    })

    //.matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 'i').withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'),
,



    check('profileImage').optional(),

    check('role').optional(),
    check('phone').optional().isMobilePhone(['ar-EG','ar-SA']).withMessage('Invalid phone number, we only accept phone EG and SA'),

  validatorMiddleware,
];

exports.UpdateUserValidator = [
 
check('id').isMongoId().withMessage('Invalid User id format'),
  body('name')
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check('email')
    .optional()
    .isEmail()
    .withMessage('Invalid email address')
    .custom((val) =>
      User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error('E-mail already in user'));
        }
      })
    ),
  check('phone')
    .optional()
    .isMobilePhone(['ar-EG', 'ar-SA'])
    .withMessage('Invalid phone number only accepted Egy and SA Phone numbers'),

  check('profileImg').optional(),
  check('role').optional(),

  validatorMiddleware,
  
];

exports.changeUserPasswordValidator =[
    check('id').isMongoId().withMessage('Invalid user Id format'),
    body('currentPassword').notEmpty().withMessage('you must enter the current password'),
    body('password').notEmpty().withMessage('you must enter the new password')
    .custom(async(val,{req})=>{
        const user=await User.findById(req.params.id);
        if (!user){
           return new Error('there is no user fo this id');
        }
        const isCorrectPassword = await bcrypt.compare(
            req.body.currentPassword,
            user.password,
        );

        //console.log(isCorrectPassword);
        if(!isCorrectPassword){
            throw new Error('incorrect current password');
        }
        
    }),
    validatorMiddleware,
]

exports.deleteUserValidator = [
  check("id").isMongoId().withMessage("Invalid brrand id format"),
  validatorMiddleware,
];



exports.UpdateLoggedUserValidator = [
 
    body('name')
      .optional()
      .custom((val, { req }) => {
        req.body.slug = slugify(val);
        return true;
      }),
    check('email')
      .optional()
      .isEmail()
      .withMessage('Invalid email address')
      .custom((val) =>
        User.findOne({ email: val }).then((user) => {
          if (user) {
            return Promise.reject(new Error('E-mail already in user'));
          }
        })
      ),
    check('phone')
      .optional()
      .isMobilePhone(['ar-EG', 'ar-SA'])
      .withMessage('Invalid phone number only accepted Egy and SA Phone numbers'),
  
    // check('profileImg').optional(),
    // check('role').optional(),
  
    validatorMiddleware,
    
  ];