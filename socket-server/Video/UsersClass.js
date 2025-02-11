class UsersClass {
  constructor(io) {
    this.Users = {}
    io.on('connection', (socket) => {
      console.log('New connection:', socket.id);
      this.addUser(socket)

      // Регистрация пользователя
      socket.on('register', (data) => {
        this.handleRegistration(socket, data)
      })

      // Обработка отключения пользователя
      socket.on('disconnecting', () => {
        this.handleDisconnection(socket.id);
      })
    })
  }

  // Обработка регистрации пользователя
  handleRegistration(socket, data) {
    console.log('User registered:', socket.id, data.uid);
    this.setUserUidForSocket(socket.id, data.uid);
    this.setUserDataForSocket(socket.id, { name: data.name });
  }

  // Обработка отключения пользователя
  handleDisconnection(socketId) {
    this.deleteUser(socketId);
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

  getAllRegUsers() {
    const result = {}
    Object.values(this.Users)
      .filter(user => user.uid)
      .forEach(item => {
        const tmp = {
          uid: item.uid,
          user: item.user
        }
        return result[item.uid] = tmp
      })
    return Object.values(result)
  }
}

module.exports = UsersClass
