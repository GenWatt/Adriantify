const corsConfig = {
    origin: 'http://localhost:3000'
}

const ACCESS_TOKEN_DURATION = '5s'
const REFRESH_TOKEN_DURATION = '20m'

module.exports = {
    corsConfig,
    ACCESS_TOKEN_DURATION,
    REFRESH_TOKEN_DURATION
}