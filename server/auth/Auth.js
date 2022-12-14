import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { REFRESH_TOKEN_DURATION, ACCESS_TOKEN_DURATION } from '../config.js'

class Auth {
    static hash(password) {
        return bcrypt.hash(password, 10)
    }

    static unHash(password, hashPassword) {
        return bcrypt.compare(password, hashPassword)
    }

    static createToken(data, type = "access") {
        const secretKey = type === 'access' ? process.env.ACCESS_SECRET : process.env.REFRESH_SECRET

        if (!secretKey) throw new Error("Secret key is undefined")

        const expiresIn = type === 'refresh' ? REFRESH_TOKEN_DURATION : ACCESS_TOKEN_DURATION
        const token = jwt.sign({ user: data }, secretKey, { expiresIn })

        return token
    }

    static isAuth(req) {
        return req.user && req.correctRole
    }

    static authenticate(req, res, next) {
        const token = req.cookies.token

        if (token) {
            const secretKey = process.env.ACCESS_SECRET
            jwt.verify(token, secretKey, (err, data) => {
                if (err || !data) {
                    return next({ code: 403, data: { message: "Unauthorized user" } })
                }

                req.user = data.user
                req.correctRole = true
                return next()
            })
        } else {
            return next({ code: 403, data: { message: "Unauthorized user" } })
        }
    }

    static authWithRole(roles) {
        return (req, res, next) => {
            if (req.user) {
                if (roles.includes(req.user.role)) {
                    req.correctRole = true
                    return next()
                } else {
                    req.correctRole = true
                    return next({ code: 403, data: { message: "You can not access it with " + req.user.role + " role" } })
                }
            } else {
                return next({ code: 403, data: { message: "Unauthorized" } })
            }
        }
    }

    static isAuthWithRole(middleware) {
        return (req, res, next) => {
            if (req.user && req.correctRole) {
                middleware(req, res, next)
                    //next()
            } else
                next({ code: 403, message: 'Wrong role' })
        }
    }
}

export default Auth