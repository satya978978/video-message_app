import express from'express'
const router= express.Router()
import { registerUser, loginuser } from '../controllers/authcontrols.js'

router.post('/login',loginuser)
router.post('/signup',registerUser)

export default router