import fs from 'fs'

function addFileToFolder(path, cb) {
    if (fs.existsSync(path)) {
        cb(null, `${path}/`)
    } else {
        fs.mkdirSync(`${path}/`)
        cb(null, `${path}/`)
    }
}

export default addFileToFolder