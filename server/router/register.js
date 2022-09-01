import express from 'express'
import Auth from '../auth/Auth.js'
import Validate from '../auth/Validate.js'
import Users from '../models/users.js'
const router = express.Router()

const rules = [
    { name: "username", rule: { min: 3, max: 6, unique: Users, require: true } },
    { name: "password", rule: { min: 3, max: 12, require: true } },
    { name: "email", rule: { min: 3, max: 32, unique: Users, require: true, email: true } }
]

router.post("/register", async(req, res, next) => {
    const { username, password, email } = req.body

    try {
        const user = {
            username,
            password,
            email,
            refreshToken: null,
            role: 'user'
        }
        const validate = new Validate(user, rules)

        if (await validate.isValid()) {
            user.password = await Auth.hash(user.password)
            await Users.create(user)
            res.send({ validateErrors: [] })
        } else {
            next({ code: 403, data: { validateErrors: validate.getErrors() } })
        }
    } catch (error) {
        next({ code: 500, data: { message: error.message } })
    }
})

router.post("/register/admin", async(req, res, next) => {
    const admin = { username: 'admin', password: await Auth.hash('admin'), role: 'admin', email: 'admin@gmail.com', refreshToken: null }

    try {
        await Users.create(admin)
        console.log('admin created!')
        res.send({ message: 'success' })
    } catch (error) {
        next({ code: 500, message: error.message })
    }
})

export default router