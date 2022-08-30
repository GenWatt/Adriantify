function errorHandler(err, req, res, next) {
    console.log(err)
    if (err.data && err.code) {
        res.status(err.code).send(err.data)
    } else {
        res.status(500).send(err)
    }
}

module.exports = errorHandler