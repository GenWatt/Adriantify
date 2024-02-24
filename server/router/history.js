import express from 'express'
import Auth from '../auth/Auth.js'
import { addHistory, getHistory, deleteHistory, deleteAllHistory } from '../controller/history.js'

const router = express.Router()

router.post('/history/:id', Auth.authenticate, addHistory)

router.get('/history', Auth.authenticate, getHistory)

router.delete('/history/:id', Auth.authenticate, deleteHistory)

router.delete('/history', Auth.authenticate, deleteAllHistory)

export default router