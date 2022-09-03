import express from "express"
import Auth from "../auth/Auth.js"
import { createSong, deleteSong, getSong, getSongAudio, getSongImage, getSongs, searchSong } from "../controller/songs.js"
const router = express.Router()

export const SONGS_FOLDER = 'songs'
export const IMAGE_FOLDER = 'songImage'

router.get("/songs", Auth.authenticate, getSongs)

router.get("/song/:id", Auth.authenticate, getSong)

router.delete("/songs/:id", Auth.authWithRole(['admin']), deleteSong)

router.get(`/${SONGS_FOLDER}/:filename/`, getSongAudio)

router.get(`/${IMAGE_FOLDER}/:filename`, getSongImage)

router.post("/songs", Auth.authWithRole(['admin']), createSong)

router.get('/search/songs', Auth.authenticate, searchSong)

export default router