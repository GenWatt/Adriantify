const mongoose = require("mongoose")
const ObjectId = require('mongoose').Types.ObjectId

const Schema = mongoose.Schema({
    title: { type: String, reqiured: true },
    songs: [{ type: ObjectId, ref: 'songs', default: [] }],
    user: { type: ObjectId, ref: 'users', required: true }
})

module.exports = mongoose.model("playlist", Schema)