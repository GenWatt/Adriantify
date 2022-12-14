import Auth from '../auth/Auth.js'
import Validate from '../auth/Validate.js'
import Users from '../models/User.js'
import { createUser } from '../utils/creators.js'

const rules = [
    { name: "username", rule: { min: 3, max: 15, unique: Users, require: true } },
    { name: "password", rule: { min: 3, max: 32, require: true } },
    { name: "email", rule: { min: 3, max: 32, unique: Users, require: true, email: true } }
]

export async function register(req, res, next) {
    try {
        const user = createUser(req.body)
        const validate = new Validate(user, rules)

        if (await validate.isValid()) {
            user.password = await Auth.hash(user.password)
            await Users.create(user)
            res.status(201).send({ validateErrors: [] })
        } else {
            next({ code: 403, data: { validateErrors: validate.getErrors() } })
        }
    } catch (error) {
        next({ code: 500, data: { message: error.message } })
    }
}

export async function registerAdmin(req, res, next) {
    const admin = { username: 'admin', password: await Auth.hash('admin'), role: 'admin', email: 'admin@gmail.com' }

    try {
        await Users.create(admin)
        console.log('admin created!')
        res.send({ message: 'success' })
    } catch (error) {
        next({ code: 500, message: error.message })
    }
}