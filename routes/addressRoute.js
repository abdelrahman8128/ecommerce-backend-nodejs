const express=require('express');


const {
    addAddressToAddresses,
    removeAddressFromAddresses,
    getLoggedUserAddresses,
}   = require('../services/addressService'); 

const authService = require('../services/authService');

const router= express.Router();

router.use( authService.protect,authService.allowedTo('user'),);
router
.route('/')
.post(addAddressToAddresses).get(getLoggedUserAddresses);

router.delete('/:addressId',removeAddressFromAddresses,);
module.exports=router;