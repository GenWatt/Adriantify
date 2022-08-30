const express = require("express")
const ObjectId = require('mongoose').Types.ObjectId
const router = express.Router()
const Auth = require("../auth/Auth")
const Playlist = require("../models/Playlist")
const createError = require("../utils/createError")
const mongoose = require("mongoose")

router.post("/playlist", Auth.authenticate, async(req, res, next) => {
    const { title } = req.body

    if (title) {
        try {
            const addedPlatlist = await (await Playlist.create({ title, user: req.user.id })).populate('user', 'username')
            res.send({ success: true, message: 'Playlist created', playlist: addedPlatlist })
        } catch (error) {
            next(createError({ message: error.message }))
        }
    } else next(createError({ message: 'Provide title' }, 401))
})

router.put("/playlist/addSong/:id", Auth.authenticate, async(req, res, next) => {
    const { id } = req.params
    const { songId } = req.body

    if (!ObjectId.isValid(id) && !ObjectId.isValid(songId)) return next(createError({ message: 'Wrong playlist or song id' }, 401))

    try {
        const isSongInPlaylist = await Playlist.findOne({ _id: id, songs: { '$in': [mongoose.Types.ObjectId(songId)] } })
        if (isSongInPlaylist) return next(createError({ message: 'Song already exist in this playlist' }, 401))
    } catch (error) {
        next(createError({ message: error.message }))
    }

    try {
        await Playlist.updateOne({ _id: id }, { '$push': { songs: songId } }, { new: true })
        res.send({ success: true, message: 'Playlist updated' })
    } catch (error) {
        next(createError({ message: error.message }))
    }
})

router.get("/playlist/my", Auth.authenticate, async(req, res, next) => {
    try {
        const playlist = await Playlist.find({ user: req.user.id }).populate('songs').populate('user', 'username')
        res.send(playlist)
    } catch (error) {
        next(createError({ message: error.message }))
    }
})

router.get("/playlists", Auth.authenticate, async(req, res, next) => {
    const { limit, skip } = req.query

    try {
        const playlists = await Playlist.find().skip(skip).limit(limit).populate('songs').populate('user', 'username')
        res.send({ message: `Sended playlists between ${skip}-${+skip + +limit}`, data: playlists, success: true })
    } catch (error) {
        next(createError({ message: error.message }))
    }
})

router.get('/playlist/:id', Auth.authenticate, async(req, res, next) => {
    const { id } = req.params
    try {
        if (!ObjectId.isValid(id)) next(createError({ data: { message: 'Wrong playlist id' } }, 401))
        const playlist = await Playlist.findById(id).populate('songs').populate('user', 'username')

        if (playlist) {
            return res.send({ message: 'Playlist found', data: playlist, success: true })
        }
        return next(createError({ data: { message: 'Not found' } }, 404))
    } catch (error) {
        next(createError({ data: { message: error.message } }))
    }
})

router.delete("/playlist/:id", Auth.authenticate, async(req, res, next) => {
    const { songId } = req.body
    const { id } = req.params

    if (!ObjectId.isValid(id) && !ObjectId.isValid(songId)) return next(createError({ message: 'Wrong playlist or song id' }, 401))

    try {
        await Playlist.updateOne({ user: req.user.id, _id: id }, { $pullAll: { songs: [mongoose.Types.ObjectId(songId)] } })
        res.send({ message: 'Song deleted from playlist', success: true })
    } catch (error) {
        next(createError({ message: error.message }))
    }
})

router.delete("/playlist/my/:id", Auth.authenticate, async(req, res, next) => {
    const { id } = req.params

    if (!ObjectId.isValid(id)) return next(createError({ message: 'Wrong playlist id' }, 401))

    try {
        await Playlist.deleteOne({ user: req.user.id, _id: id })
        res.send({ message: 'Playlist deleted', success: true })
    } catch (error) {
        next(createError({ message: error.message }))
    }
})

module.exports = router