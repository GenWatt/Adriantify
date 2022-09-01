import mongoose from "mongoose"

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

export default mongoose.model("songs", Schema)