export default function createError(data = { message: 'Interval server error' }, statusCode = 500) {
    return { code: statusCode, data: {...data } }
}