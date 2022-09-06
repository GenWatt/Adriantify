export function createUser(data, role = 'user') {
    return { username: data.username, password: data.password, email: data.email, role }
}

export function createPlaylistObj(title, userId, imagePath) {
    return { title, user: userId, path: imagePath }
}

export function createSongObj(data, duration, songPath, size, imagePath = '') {
    return { title: data.title || '', creator: data.creator || '', realease: data.release || '', album: data.album || '', duration, size, songPath, imagePath }
}