function createUserData(data) {
    return { username: data.user.username, id: data.user.id, role: data.user.role }
}

export default createUserData