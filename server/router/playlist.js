import express from 'express'
import multer from 'multer'
import Auth from '../auth/Auth.js'
import addFileToFolder from '../utils/addFileToFolder.js'
import path from 'path'
import { addSongToPlaylist, createPlaylist, getMyPlaylist, getPlaylists, getPlaylistImage, getPlaylist, deletePlaylist, deleteSongPlaylist } from '../controller/playlist.js'

const router = express.Router()
export const PLAYLIST_IMAGE_FOLDER = 'playlistImages'
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

router.post("/playlist", Auth.authenticate, uploadPlaylist.single('playlistImage'), createPlaylist)

router.get(`/${PLAYLIST_IMAGE_FOLDER}/:filename`, getPlaylistImage)

router.put("/playlist/addSong/:id", Auth.authenticate, addSongToPlaylist)

router.get("/playlist/my", Auth.authenticate, getMyPlaylist)

router.get("/playlists", Auth.authenticate, getPlaylists)

router.get('/playlist/:id', Auth.authenticate, getPlaylist)

router.delete("/playlist/:id", Auth.authenticate, deleteSongPlaylist)

router.delete("/playlist/my/:id", Auth.authenticate, deletePlaylist)

export default router