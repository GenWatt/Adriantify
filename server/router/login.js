import express from 'express'
import Auth from '../auth/Auth.js'
import { isAuth, login, logout } from '../controller/login.js'

const router = express.Router()

router.post("/login", login)

router.get('/auth', Auth.authenticate, isAuth)

router.get('/logout', Auth.authenticate, logout)

export default router