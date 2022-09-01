import fs from 'fs'

function stream(res, filePath, range, chunksize, contentType) {
    if (!fs.existsSync(filePath)) return
    const size = fs.statSync(filePath).size
    const parts = range ? range.replace(/bytes=/, "").split("-") : [0]
    const partialStart = parts[0]
    const start = parseInt(partialStart, 10)
    const end = Math.min(start + chunksize, size - 1)
    const rstream = fs.createReadStream(filePath, { start, end })

    res.writeHead(206, {
        'Content-Range': 'bytes ' + start + '-' + end + '/' + size,
        'Accept-Ranges': 'bytes',
        'Content-Length': end - start + 1,
        'Content-Type': contentType
    })

    return { rstream, size }
}

export default stream