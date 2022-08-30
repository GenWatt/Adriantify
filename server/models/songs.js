const mongoose = require("mongoose")

const Schema = mongoose.Schema({
    title: { type: String, reqiured: true },
    songPath: { type: String, requied: true, unique: true },
    creator: { type: String },
    release: { type: Date },
    album: { type: String },
    imagePath: { type: String },
    size: { type: Number, reqiured: true },
    duration: { type: Number, required: true }
})

module.exports = mongoose.model("songs", Schema)