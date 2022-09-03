import express from 'express'
import { register, registerAdmin } from '../controller/register.js'

const router = express.Router()

router.post("/register", register)

router.post("/register/admin", registerAdmin)

export default router