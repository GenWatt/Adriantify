const express = require("express")
const Auth = require("../auth/Auth")
const router = express.Router()
const Songs = require("../models/songs")
const multer = require("multer")
const addFileToFolder = require("../utils/addFileToFolder")
const path = require('path')
const { getAudioDurationInSeconds } = require('get-audio-duration')
const stream = require("../utils/stream")
const existsAndRemove = require("../utils/existsAndRemove")
const createError = require("../utils/createError")
const Playlist = require("../models/Playlist")
const ObjectId = require('mongoose').Types.ObjectId

const SONGS_FOLDER = 'songs'
const IMAGE_FOLDER = 'songImage'

const songsStorage = multer.diskStorage({
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + '-' + file.originalname)
    },
    destination: (req, file, cb) => {
        if (file.fieldname === 'songImage' && file.mimetype.startsWith('image')) {
            file.staticPath = `/${IMAGE_FOLDER}/${file.filename}`
            addFileToFolder(path.join('public', IMAGE_FOLDER), cb)
        } else if (file.fieldname === 'song' && file.mimetype.startsWith('audio')) {
            file.staticPath = `/${SONGS_FOLDER}/${file.filename}`
            addFileToFolder(path.join('public', SONGS_FOLDER), cb)
        } else cb('Wrong file fieldname or mimetype')
    },
})

const uploadSongs = multer({ storage: songsStorage })

router.get("/songs", Auth.authenticate, async(req, res, next) => {
    const { skip, limit } = req.query
    Songs.find().skip(skip).limit(limit)
        .then((songs) => res.send({ message: `Sended songs between ${skip}-${+skip + +limit}`, data: songs, success: true }))
        .catch((err) => next({ code: 500, data: { message: err.message } }))
})

router.get("/song/:id", Auth.authenticate, async(req, res, next) => {
    if (!ObjectId.isValid(req.params.id)) next({ code: 401, data: { message: 'Song dosent exist' }, success: false })
    Songs.findById(req.params.id)
        .then((song) => res.send(song))
        .catch((err) => next({ code: 500, data: { message: err.message } }))
})

router.delete("/songs/:id", Auth.authenticate, Auth.authWithRole(['admin']), async(req, res, next) => {
    const { id } = req.params

    if (ObjectId.isValid(id)) {
        Songs.findOne({ _id: id }).then((song) => {
            if (!song) return next({ code: 400, data: { message: 'Song dosent exist' }, success: false })
            Songs.deleteOne({ _id: id })
                .then(() => {
                    typeof song.songPath === 'string' && existsAndRemove(path.join('public', song.songPath))
                    typeof song.imagePath === 'string' && existsAndRemove(path.join('public', song.imagePath))
                    res.send({ message: 'Song ' + song.title + ' Succesfully deleted', success: true })
                })
                .catch((err) => next({ code: 500, data: { message: err.message } }))
        }).catch((err) => next({ code: 500, data: { message: err.message } }))
    } else {
        next({ code: 400, data: { message: 'Wrong id', is } })
    }
})

router.get(`/${SONGS_FOLDER}/:filename/`, (req, res) => {
    const { filename } = req.params
    const filePath = path.join('public', SONGS_FOLDER, filename)
    const { range } = req.headers
    const chunksize = 1 * 1e+6
    const { rstream } = stream(res, filePath, range, chunksize, 'audio/mpeg')

    rstream.pipe(res)
})

router.get(`/${IMAGE_FOLDER}/:filename`, (req, res, next) => {
    res.sendFile(path.resolve(`public/${IMAGE_FOLDER}/${req.params.filename}`), (err) => {
        if (err) next({ code: 500, data: { message: err.message } })
    })
})

const songFields = [{ name: 'song', maxCount: 1 }, { name: 'songImage', maxCount: 1 }]
const songHandler = (req, res, next) => {
    return async(err) => {
        if (err) return next({ code: 500, data: { message: err || 'Server problem' } })

        const currentSong = req.files.song && req.files.song.length ? req.files.song[0] : null
        if (!currentSong) return next({ code: 400, data: { message: 'Please select song' } })

        const currentImage = req.files.songImage && req.files.songImage.length ? req.files.songImage[0] : ''
        const songDuration = await getAudioDurationInSeconds(currentSong.path)
        const songData = {
            songPath: `/${SONGS_FOLDER}/${currentSong.filename}`,
            size: currentSong.size,
            imagePath: currentImage ? `/${IMAGE_FOLDER}/${currentImage.filename}` : currentImage,
            title: req.body.title,
            album: req.body.album || '',
            release: req.body.release || '',
            creator: req.body.creator || '',
            duration: songDuration
        }

        Songs.create(songData)
            .then((addedSong) => res.send({ message: 'Song' + currentSong.originalname + 'added', success: true, song: addedSong }))
            .catch((err) => {
                existsAndRemove(path.join(__dirname, 'public', SONGS_FOLDER, currentSong.filename))
                currentImage && existsAndRemove(path.join(__dirname, 'public', IMAGE_FOLDER, currentSong.filename))
                next({ code: 500, data: { message: 'Song ' + currentSong.originalname + ' not added ' + err.message } })
            })
    }
}

router.post("/songs", Auth.authenticate, Auth.authWithRole(['admin']), (req, res, next) => {
    uploadSongs.fields(songFields)(req, res, songHandler(req, res, next))
})

router.get('/search/songs', Auth.authenticate, async(req, res, next) => {
    const { text, playlist } = req.query
    if (text && typeof text === 'string') {
        const searchParams = { $regex: text, $options: "i" }
        try {
            const songs = await Songs.find({ title: searchParams }).limit(10).select(['title', 'imagePath', 'songPath', 'creator'])
            let playlists = []

            if (playlist === '1') {
                try {
                    playlists = await Playlist.find({ title: searchParams }).limit(10).select(['title']).populate('user', 'username')
                } catch (error) {
                    return next(createError({ message: error.message }))
                }
            }
            res.send({ songs, playlists, success: true })
        } catch (error) {
            return next(createError({ message: error.message }))
        }
    }
})

module.exports = router