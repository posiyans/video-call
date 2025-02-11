class UsersClass {
  constructor() {
    this.Users = {}
  }


  addUser(socket, uid = null, user = {}) {
    this.Users[socket.id] = {
      uid: uid,
      socket,
      user
    }
  }

  setUserUidForSocket(socketId, uid) {
    this.Users[socketId].uid = uid
  }

  setUserDataForSocket(socketId, data) {
    this.Users[socketId].user = data
  }

  deleteUser(socketId) {
    delete this.Users[socketId]
  }

  getUserBySocketId(socketId) {
    return this.Users[socketId] ?? null
  }

  getUsersByUid(uid) {
    return Object.values(this.Users).filter(item => item.uid && item.uid === uid)
  }

  getAllRegUsers(addSocket = false) {
    const result = {}
    Object.values(this.Users)
      .filter(user => user.uid)
      .forEach(item => {
        const tmp = {
          uid: item.uid,
          user: item.user
        }
        if (addSocket) {
          tmp.socket = item.socket
        }
        return result[item.uid] = tmp
      })
    return Object.values(result)
  }


}

module.exports = UsersClass
