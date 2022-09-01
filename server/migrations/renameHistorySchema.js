import History from "../models/History.js"
import createError from "../utils/createError.js"

const renameHistorySchema = async(req, res, next) => {
    try {
        await History.updateMany({}, { $rename: { songId: 'song' }, $unset: { songId: 1 } }, { multi: true })
    } catch (error) {
        next(createError({ data: { message: error.message } }))
    }
}

export default renameHistorySchema