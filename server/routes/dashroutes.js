 import express, { Router } from 'express'
 const router = express.Router()
 import {dashboardinfo} from '../controllers/dasboardcontros.js'

router.post('/dashboard',dashboardinfo)
 export default router