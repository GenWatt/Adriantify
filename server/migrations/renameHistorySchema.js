const History = require("../models/History")
const createError = require("../utils/createError")

const renameHistorySchema = async(req, res, next) => {
    try {
        await History.updateMany({}, { $rename: { songId: 'song' }, $unset: { songId: 1 } }, { multi: true })
    } catch (error) {
        next(createError({ data: { message: error.message } }))
    }
}

module.exports = renameHistorySchema