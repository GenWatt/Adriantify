const fs = require("fs")

function isFileExist(pathname) {
    if (fs.existsSync(pathname)) {
        return true
    }

    return false
}

module.exports = isFileExist