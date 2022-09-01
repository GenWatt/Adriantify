import fs from 'fs'

export default function existsAndRemove(path) {
    if (fs.existsSync(path) && fs.lstatSync(path).isFile()) {
        fs.rmSync(path)
    }
}