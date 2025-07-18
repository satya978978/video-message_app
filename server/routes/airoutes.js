import express from "express";
const router  =express.Router()
import {AI_questions} from '../controllers/AiPanel_controllers.js'

router.post('/aichat',AI_questions)

export default router