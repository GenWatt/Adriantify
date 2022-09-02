import mongoose from "mongoose"
const ObjectId = mongoose.Types.ObjectId

const Schema = mongoose.Schema({
    title: { type: String, reqiured: true },
    songs: [{ type: ObjectId, ref: 'songs', default: [] }],
    user: { type: ObjectId, ref: 'users', required: true },
    path: { type: String }
})

export default mongoose.model("playlist", Schema)