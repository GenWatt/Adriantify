const mongoose = require("mongoose")

const Schema = mongoose.Schema({
    username: { type: String, unique: true, min: 3, max: 16, required: true },
    password: { type: String, required: true },
    email: { type: String, min: 3, max: 24, unique: true, required: true },
    role: { type: String, required: true },
    refreshToken: { type: String }
})

module.exports = mongoose.model("users", Schema)