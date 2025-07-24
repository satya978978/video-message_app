import express from 'express'
const router = express.Router()
import { RunCode } from '../controllers/CodeController.js'
router.post("/runcode", RunCode)

export default router