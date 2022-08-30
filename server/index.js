const express = require('express')
const registerRoute = require("./router/register")
const loginRoute = require("./router/login")
const songsRoute = require("./router/songs")
const playlistRoute = require("./router/playlist")
const refreshToken = require("./router/refreshToken")
const cors = require('cors')
require("dotenv").config()
const app = express()
const mongoose = require("mongoose")
const errorHandler = require('./utils/ErrorHandler')
const { corsConfig } = require('./config')
const historyRoute = require('./router/history')

mongoose.connect(process.env.DATABASE_URI)
require('./migrations/renameHistorySchema')()
app.use(cors(corsConfig))
app.use(express.json())
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