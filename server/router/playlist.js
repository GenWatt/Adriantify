import express from 'express'
import mongoose from 'mongoose'
import Auth from '../auth/Auth.js'
import Playlist from '../models/Playlist.js'
import createError from '../utils/createError.js'
import multer from 'multer'
import addFileToFolder from '../utils/addFileToFolder.js'
import path from 'path'
import existsAndRemove from '../utils/existsAndRemove.js'

const router = express.Router()
const ObjectId = mongoose.Types.ObjectId
const PLAYLIST_IMAGE_FOLDER = 'playlistImages'

const playlistStorage = multer.diskStorage({
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + '-' + file.originalname)
    },
    destination: (req, file, cb) => {
        if (file.fieldname === 'playlistImage' && file.mimetype.startsWith('image')) {
            file.staticPath = `/${PLAYLIST_IMAGE_FOLDER}/${file.filename}`
            addFileToFolder(path.join('public', PLAYLIST_IMAGE_FOLDER), cb)
        } else cb('Wrong file fieldname or mimetype')
    },
})
const uploadPlaylist = multer({ storage: playlistStorage })

const playlistHandler = async(req, res, next) => {
    if (!req.user) return next(createError({ data: { message: 'User not authorized' } }), 403)
    const { title } = req.body
    const currentImage = req.file ? req.file : ''

    if (title) {
        const playlist = {
            title,
            user: req.user.id,
            path: currentImage ? `/${PLAYLIST_IMAGE_FOLDER}/${currentImage.filename}` : currentImage
        }
        try {
            const addedPlatlist = await (await Playlist.create(playlist)).populate('user', 'username')
            res.send({ success: true, message: `Playlist "${addedPlatlist.title}" created`, playlist: addedPlatlist })
        } catch (error) {
            currentImage && existsAndRemove(path.join(__dirname, 'public', PLAYLIST_IMAGE_FOLDER, currentImage.filename))
            next(createError({ message: err.message }))
        }
    } else {
        currentImage && existsAndRemove(path.join(__dirname, 'public', PLAYLIST_IMAGE_FOLDER, currentImage.filename))
        next(createError({ message: 'Provide title' }, 401))
    }
}

router.post("/playlist", Auth.authenticate, uploadPlaylist.single('playlistImage'), (req, res, next) => {
    playlistHandler(req, res, next)
})

router.get(`/${PLAYLIST_IMAGE_FOLDER}/:filename`, (req, res, next) => {
    res.sendFile(path.resolve(`public/${PLAYLIST_IMAGE_FOLDER}/${req.params.filename}`), (err) => {
        if (err) next({ code: 500, data: { message: err.message } })
    })
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
        res.send({ message: 'Playlist  deleted', success: true })
    } catch (error) {
        next(createError({ message: error.message }))
    }
})

export default router