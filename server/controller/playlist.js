import mongoose from 'mongoose'
import Playlist from '../models/Playlist.js'
import createError from '../utils/createError.js'
import path from 'path'
import existsAndRemove from '../utils/existsAndRemove.js'
import { PLAYLIST_IMAGE_FOLDER } from '../router/playlist.js'
import { createPlaylistObj } from '../utils/creators.js'

const ObjectId = mongoose.Types.ObjectId

async function playlistHandler(req, res, next) {
    if (!req.user) return next(createError({ data: { message: 'User not authorized' } }), 403)
    const { title } = req.body
    const currentImage = req.file ? `/${PLAYLIST_IMAGE_FOLDER}/${req.file.filename}` : ''

    if (title) {
        const playlist = createPlaylistObj(title, req.user.id, currentImage)

        try {
            const addedPlatlist = await (await Playlist.create(playlist)).populate('user', 'username')
            res.status(201).send({ success: true, message: `Playlist "${addedPlatlist.title}" created`, playlist: addedPlatlist })
        } catch (error) {
            currentImage && existsAndRemove(path.join(__dirname, 'public', PLAYLIST_IMAGE_FOLDER, currentImage.filename))
            next(createError({ message: err.message }))
        }
    } else {
        currentImage && existsAndRemove(path.join(__dirname, 'public', PLAYLIST_IMAGE_FOLDER, currentImage.filename))
        next(createError({ message: 'Provide title' }, 401))
    }
}

export async function createPlaylist(req, res, next) {
    playlistHandler(req, res, next)
}

export async function getPlaylistImage(req, res, next) {
    res.sendFile(path.resolve(`public/${PLAYLIST_IMAGE_FOLDER}/${req.params.filename}`), (err) => {
        if (err) next({ code: 500, data: { message: err.message } })
    })
}

export async function addSongToPlaylist(req, res, next) {
    const { id } = req.params
    const { songId } = req.body

    if (!ObjectId.isValid(id) && !ObjectId.isValid(songId)) return next(createError({ message: 'Wrong playlist or song id' }, 401))

    try {
        const isSongInPlaylist = await Playlist.findOne({ _id: id, songs: { '$in': [mongoose.Types.ObjectId(songId)] } })
        const playlist = await Playlist.findById(id)

        if (isSongInPlaylist) return next(createError({ message: 'Song already exist in this playlist' }, 422))
        console.log(new ObjectId(req.user.id), playlist.user)
        if (!playlist.user.equals(new ObjectId(req.user.id))) return next(createError({ message: 'You are not authorized to do this' }, 401))
    } catch (error) {
        next(createError({ message: error.message }))
    }

    try {
        await Playlist.updateOne({ _id: id }, { '$push': { songs: songId } }, { new: true })
        res.send({ success: true, message: 'Playlist updated' })
    } catch (error) {
        next(createError({ message: error.message }))
    }
}

export async function getMyPlaylist(req, res, next) {
    try {
        const playlist = await Playlist.find({ user: req.user.id }).populate('songs').populate('user', 'username')
        res.send(playlist)
    } catch (error) {
        next(createError({ message: error.message }))
    }
}

export async function getPlaylists(req, res, next) {
    const { limit, skip } = req.query

    try {
        const playlists = await Playlist.find().skip(skip).limit(limit).populate('songs').populate('user', 'username')
        res.send({ message: `Sended playlists between ${skip}-${+skip + +limit}`, data: playlists, success: true })
    } catch (error) {
        next(createError({ message: error.message }))
    }
}

export async function getPlaylist(req, res, next) {
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
}

export async function deleteSongPlaylist(req, res, next) {
    const { songId } = req.body
    const { id } = req.params

    if (!ObjectId.isValid(id) && !ObjectId.isValid(songId)) return next(createError({ message: 'Wrong playlist or song id' }, 401))

    try {
        await Playlist.updateOne({ user: req.user.id, _id: id }, { $pullAll: { songs: [mongoose.Types.ObjectId(songId)] } })
        res.send({ message: 'Song deleted from playlist', success: true })
    } catch (error) {
        next(createError({ message: error.message }))
    }
}

export async function deletePlaylist(req, res, next) {
    const { id } = req.params

    if (!ObjectId.isValid(id)) return next(createError({ message: 'Wrong playlist id' }, 401))

    try {
        await Playlist.deleteOne({ user: req.user.id, _id: id })
        res.send({ message: 'Playlist  deleted', success: true })
    } catch (error) {
        next(createError({ message: error.message }))
    }
}