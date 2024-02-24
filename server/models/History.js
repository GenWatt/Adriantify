import mongoose from "mongoose"

const Schema = mongoose.Schema({
    song: { type: mongoose.Types.ObjectId, ref: 'songs', required: true },
    date: { type: Date, default: Date.now() },
    user: { type: mongoose.Types.ObjectId, ref: 'users', required: true }
})

export default mongoose.model('history', Schema)