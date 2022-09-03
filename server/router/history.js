import express from 'express'
import Auth from '../auth/Auth.js'
import { addHistory, getHistory } from '../controller/history.js'

const router = express.Router()

router.post('/history/:id', Auth.authenticate, addHistory)

router.get('/history', Auth.authenticate, getHistory)

export default router