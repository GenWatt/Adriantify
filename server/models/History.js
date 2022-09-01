import mongoose from "mongoose"

const Schema = mongoose.Schema({
    song: { type: mongoose.Types.ObjectId, ref: 'songs', required: true, unique: true },
    date: { type: Date, default: Date.now() }
})

export default mongoose.model('history', Schema)