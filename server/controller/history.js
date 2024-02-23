import mongoose from 'mongoose'
import History from '../models/History.js'
import createError from '../utils/createError.js'

export async function addHistory(req, res, next) {
    const { id } = req.params
    if (mongoose.Types.ObjectId.isValid(id)) {
        try {
            const updatedHistoryItem = await History.findOneAndUpdate({ song: id, user: req.user.id }, { date: Date.now() }).populate('song')

            if (!updatedHistoryItem) {
                const historyItem = await (await History.create({ song: id, user: req.user.id })).populate('song')
                return res.status(201).send({ item: historyItem, success: true, updated: false })
            }

            return res.status(201).send({ item: updatedHistoryItem, updated: true, success: true })
        } catch (error) {
            return next(createError({ data: { message: error.message } }))
        }
    } else next(createError({ data: { message: 'Wrong song id' } }, 401))
}

export async function getHistory(req, res, next) {
    const { skip, limit } = req.query

    if (!req.user) {
        next(createError({ data: { message: 'Unauthorized' } }, 401))
    }

    try {
        const history = await History.find({ user: req.user.id }).sort([
            ['date', -1]
        ]).skip(skip).limit(limit).populate('song')
        res.send({ message: `Sended history between ${skip}-${+skip + +limit}`, data: history, success: true })
    } catch (error) {
        next(createError({ data: { message: error.message } }))
    }
}

export async function deleteHistory(req, res, next) {
    const { id } = req.params

    if (mongoose.Types.ObjectId.isValid(id)) {
        try {
            await History.deleteOne({ _id: id, user: req.user.id })
            res.send({ message: 'History item deleted', success: true })
        } catch (error) {
            next(createError({ data: { message: error.message } }))
        }
    } else next(createError({ data: { message: 'Wrong history id' } }, 422))
}