import Auth from '../auth/Auth.js'
import mongoose from 'mongoose'
import History from '../models/History.js'
import createError from '../utils/createError.js'

export async function addHistory(req, res, next) {
    const { id } = req.params
    if (mongoose.Types.ObjectId.isValid(id)) {
        try {
            const updatedHistoryItem = await History.findOneAndUpdate({ song: id }, { date: Date.now() }).populate('song')

            if (!updatedHistoryItem) {
                const historyItem = await (await History.create({ song: id })).populate('song')
                return res.send({ item: historyItem, success: true, updated: false })
            }

            return res.send({ item: updatedHistoryItem, updated: true, success: true })
        } catch (error) {
            return next(createError({ data: { message: error.message } }))
        }
    } else next(createError({ data: { message: 'Wrong song id' } }, 401))
}

export async function getHistory(req, res, next) {
    const { skip, limit } = req.query

    try {
        const history = await History.find().sort([
            ['date', -1]
        ]).skip(skip).limit(limit).populate('song')
        res.send({ message: `Sended history between ${skip}-${+skip + +limit}`, data: history, success: true })
    } catch (error) {
        next(createError({ data: { message: error.message } }))
    }
}