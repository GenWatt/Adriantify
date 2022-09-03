import Songs from "../models/Songs.js"
import multer from "multer"
import addFileToFolder from "../utils/addFileToFolder.js"
import path from "path"
import { getAudioDurationInSeconds } from 'get-audio-duration'
import stream from "../utils/stream.js"
import existsAndRemove from "../utils/existsAndRemove.js"
import createError from "../utils/createError.js"
import Playlist from "../models/Playlist.js"
import mongoose from "mongoose"
import { IMAGE_FOLDER, SONGS_FOLDER } from "../router/songs.js"

const ObjectId = mongoose.Types.ObjectId
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
const songFields = [{ name: 'song', maxCount: 1 }, { name: 'songImage', maxCount: 1 }]
const uploadSongs = multer({ storage: songsStorage })

export async function getSongs(req, res, next) {
    const { skip, limit } = req.query
    Songs.find().skip(skip).limit(limit)
        .then((songs) => res.send({ message: `Sended songs between ${skip}-${+skip + +limit}`, data: songs, success: true }))
        .catch((err) => next({ code: 500, data: { message: err.message } }))
}

export async function getSong(req, res, next) {
    if (!ObjectId.isValid(req.params.id)) next({ code: 401, data: { message: 'Song dosent exist' }, success: false })
    Songs.findById(req.params.id)
        .then((song) => res.send(song))
        .catch((err) => next({ code: 500, data: { message: err.message } }))
}

export async function deleteSong(req, res, next) {
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
}

export function getSongAudio(req, res) {
    const { filename } = req.params
    const filePath = path.join('public', SONGS_FOLDER, filename)
    const { range } = req.headers
    const chunksize = 1 * 1e+6
    const { rstream } = stream(res, filePath, range, chunksize, 'audio/mpeg')

    rstream.pipe(res)
}

export function getSongImage(req, res, next) {
    res.sendFile(path.resolve(`public/${IMAGE_FOLDER}/${req.params.filename}`), (err) => {
        if (err) next({ code: 500, data: { message: err.message } })
    })
}

function songHandler(req, res, next) {
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
            .then((addedSong) => res.send({ message: 'Song' + currentSong.originalname + ' added', success: true, song: addedSong }))
            .catch((err) => {
                existsAndRemove(path.join(__dirname, 'public', SONGS_FOLDER, currentSong.filename))
                currentImage && existsAndRemove(path.join(__dirname, 'public', IMAGE_FOLDER, currentSong.filename))
                next({ code: 500, data: { message: 'Song ' + currentSong.originalname + ' not added ' + err.message } })
            })
    }
}

export function createSong(req, res, next) {
    uploadSongs.fields(songFields)(req, res, songHandler(req, res, next))
}

export async function searchSong(req, res, next) {
    const { text, playlist } = req.query
    if (text) {
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

}