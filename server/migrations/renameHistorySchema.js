import History from "../models/History.js"
import Playlist from "../models/Playlist.js"
import createError from "../utils/createError.js"

const renameHistorySchema = async(req, res, next) => {
    try {
        await History.updateMany({}, { $rename: { songId: 'song' }, $unset: { songId: 1 } }, { multi: true })
        addPlaylistField(req, res, next)
    } catch (error) {
        next(createError({ data: { message: error.message } }))
    }
}

const addPlaylistField = async(req, res, next) => {
    try {
        await Playlist.schema.add({ path: String })
    } catch (error) {
        next(createError({ data: { message: error.message } }))
    }
}

export default renameHistorySchema