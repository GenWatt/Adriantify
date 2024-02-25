import express from 'express'
import registerRoute from "./router/register.js"
import loginRoute from "./router/login.js"
import songsRoute from "./router/songs.js"
import playlistRoute from "./router/playlist.js"
import refreshToken from "./router/refreshToken.js"
import cors from 'cors'
import { config } from 'dotenv'
import { connect } from './db/mongodb.js'
import errorHandler from './utils/ErrorHandler.js'
import { corsConfig } from './config.js'
import historyRoute from './router/history.js'
import cookieParser from 'cookie-parser'
import migration from './migrations/renameHistorySchema.js'

async function init() {
    const app = express()
    config()
    await connect()
    
    // middlewares
    migration()
    app.use(express.json())
    app.use(cookieParser())
    app.use(cors(corsConfig))
    
    //routes
    app.use("/api", registerRoute)
    app.use("/api", loginRoute)
    app.use("/api", refreshToken)
    app.use("/api", playlistRoute)
    app.use('/api', historyRoute)
    app.use("/api", songsRoute)
    
    //Errors handling
    app.use(errorHandler)
    
    app.listen(process.env.PORT, () => console.log("Server is running on port: " + process.env.PORT))
}

init()

