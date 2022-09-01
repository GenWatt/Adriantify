import fs from 'fs'

function isFileExist(pathname) {
    if (fs.existsSync(pathname)) {
        return true
    }

    return false
}

export default isFileExist