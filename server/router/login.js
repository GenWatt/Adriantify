const express = require("express")
const Auth = require("../auth/Auth")
const Validate = require("../auth/Validate")
const router = express.Router()
const Users = require("../models/users")

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

                await Users.updateOne({ username: user.username }, { $set: { refreshToken: Auth.createToken(userData, 'refresh') } })

                res.status(200).send({ success: true, user: req.user })
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
    res.send({ isAuth: true })
})

router.get('/logout', Auth.authenticate, async(req, res, next) => {
    try {
        await Users.updateOne({ _id: req.user.id }, { refreshToken: '' })
        res.send({ data: { message: `${req.user.username} loged out`, isAuth: false } })
    } catch (error) {
        next({ code: 500, data: { message: error.message } })
    }
})

module.exports = router