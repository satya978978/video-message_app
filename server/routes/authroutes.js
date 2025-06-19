const express = require('express')
const router= express.Router()
const {registerUser,loginuser}= require('../controllers/authcontrols')

router.post('/login',loginuser)
router.post('/signup',registerUser)

module.exports=router;