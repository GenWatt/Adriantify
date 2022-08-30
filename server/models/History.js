const mongoose = require('mongoose')

const Schema = mongoose.Schema({
    song: { type: mongoose.Types.ObjectId, ref: 'songs', required: true, unique: true },
    date: { type: Date, default: Date.now() }
})

module.exports = mongoose.model('history', Schema)