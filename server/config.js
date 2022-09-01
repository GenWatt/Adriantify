export const corsConfig = {
    origin: 'http://localhost:3000',
    credentials: true,
}

export const ACCESS_TOKEN_DURATION = '5s'
export const REFRESH_TOKEN_DURATION = '20m'
export const tokenCookieOptions = {
    httpOnly: true,
    secure: true,
}