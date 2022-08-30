const fs = require('fs')

module.exports = function existsAndRemove(path) {
    if (fs.existsSync(path) && fs.lstatSync(path).isFile()) {
        fs.rmSync(path)
    }
}