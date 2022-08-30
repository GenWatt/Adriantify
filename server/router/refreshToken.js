const express = require("express")
const Auth = require("../auth/Auth")
const ObjectId = require('mongoose').Types.ObjectId
const router = express.Router()
const Users = require("../models/users")
const jwt = require("jsonwebtoken")
const fs = require('fs')
const createUserData = require("../utils/createUserData")

router.post("/refreshToken/:id", async(req, res, next) => {
    const userId = req.params.id

    if (ObjectId.isValid(userId)) {
        const user = await Users.findOne({ _id: userId }, { refreshToken: 1 })
        if (user && user.refreshToken) {
            const key = fs.readFileSync('refreshSecret.txt')

            jwt.verify(user.refreshToken, key, (err, data) => {
                if (err || !data || !data.user) return next({ code: 403, data: { message: 'Refresh token expired or is not valid' } })

                const userData = createUserData(data)

                res.send({ newToken: Auth.createToken(userData), user: userData })
            })
        } else {
            next({ code: 403, data: { message: "Refesh Token not found" } })
        }
    } else {
        next({ code: 403, data: { message: 'Unauthorized user' } })
    }
})

module.exports = router