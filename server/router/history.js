import express from 'express'
import Auth from '../auth/Auth.js'
import { addHistory, getHistory, deleteHistory } from '../controller/history.js'

const router = express.Router()

router.post('/history/:id', Auth.authenticate, addHistory)

router.get('/history', Auth.authenticate, getHistory)

router.delete('/history/:id', Auth.authenticate, deleteHistory)

export default router