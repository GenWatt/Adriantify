import express from 'express'
import registerRoute from "./router/register.js"
import loginRoute from "./router/login.js"
import songsRoute from "./router/songs.js"
import playlistRoute from "./router/playlist.js"
import refreshToken from "./router/refreshToken.js"
import cors from 'cors'
import { config } from 'dotenv'
import mongoose from "mongoose"
import errorHandler from './utils/ErrorHandler.js'
import { corsConfig } from './config.js'
import historyRoute from './router/history.js'
import cookieParser from 'cookie-parser'
import migration from './migrations/renameHistorySchema.js'

const app = express()
config()

mongoose.connect(process.env.DATABASE_URI).then(() => console.log('Connected to db succesfully')).catch((err) => console.error(err))

migration()
app.use(express.json())
app.use(cookieParser())
app.use(cors(corsConfig))

//app.use('/static', express.static(path.join(__dirname, 'public')))

//routes
app.use("/api", refreshToken)
app.use("/api", registerRoute)
app.use("/api", loginRoute)
app.use("/api", playlistRoute)
app.use('/api', historyRoute)
app.use("/api", songsRoute)

//Errors handling
app.use(errorHandler)

app.listen(process.env.PORT, () => console.log("Server is running on port: " + process.env.PORT))