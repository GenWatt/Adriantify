import Auth from '../auth/Auth.js'
import jwt from 'jsonwebtoken'
import createUserData from '../utils/createUserData.js'
import { tokenCookieOptions } from '../config.js'
import createError from '../utils/createError.js'

export async function refreshToken(req, res, next) {
    const refreshToken = req.cookies.refreshToken
    if (refreshToken) {
        const key = process.env.REFRESH_SECRET

        jwt.verify(refreshToken, key, (err, data) => {
            if (err || !data || !data.user) return next({ code: 403, data: { message: 'Refresh token expired or is not valid' } })

            const userData = createUserData(data)
            const newToken = Auth.createToken(userData)

            res.cookie('token', newToken, tokenCookieOptions)
            res.send({ newToken, user: userData })
        })
    } else {
        next(createError({ data: { message: "Unauthorized user(wrong refresh token)" } }, 403))
    }
}