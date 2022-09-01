import express from 'express'
import Auth from '../auth/Auth.js'
import Validate from '../auth/Validate.js'
import Users from '../models/users.js'
import { tokenCookieOptions } from '../config.js'

const router = express.Router()

router.post("/login", async(req, res, next) => {
    const { username, password } = req.body
    const validate = new Validate()
    let user = null

    try {
        if (validate.isEmail(username)) {
            user = await Users.findOne({ email: username })
        } else {
            user = await Users.findOne({ username })
        }

        if (user) {
            const userData = { username: user.username, id: user.id, role: user.role }

            if (await Auth.unHash(password, user.password)) {
                req.user = userData
                req.user.token = Auth.createToken(userData)

                res.status(200)
                    .cookie('token', req.user.token, tokenCookieOptions)
                    .cookie('refreshToken', Auth.createToken(userData, 'refresh'), tokenCookieOptions)
                    .send({ success: true, user: req.user })
            } else {
                next({ code: 403, data: { message: "Wrong username/email or password" } })
            }
        } else {
            next({ code: 404, data: { message: "User not found" } })
        }
    } catch (error) {
        next({ code: 500, data: { message: error.message } })
    }
})

router.get('/auth', Auth.authenticate, (req, res, next) => {
    res.send({ isAuth: true, success: true, message: 'User is authorized' })
})

router.get('/logout', Auth.authenticate, async(req, res, next) => {
    try {
        await Users.updateOne({ _id: req.user.id }, { refreshToken: '' })
        res.cookie('token', '').send({ data: { message: `${req.user.username} logged out`, isAuth: false } })
    } catch (error) {
        next({ code: 500, data: { message: error.message } })
    }
})

export default router