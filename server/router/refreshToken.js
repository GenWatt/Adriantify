import express from 'express'
import { refreshToken } from '../controller/refreshToken.js'

const router = express.Router()

router.post("/refreshToken", refreshToken)

export default router