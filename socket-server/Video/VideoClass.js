class VideoClass {
  constructor(io) {
    this.io = io
    this.Users = {}
    io.on('connection', (socket) => {
      console.log('connection')
      console.log(socket.id)
      this.Users[socket.id] = {
        socket: socket,
        name: null,
        id: null
      }
      socket.on('register', (data) => {
        console.log('register')
        console.log(socket.id)
        this.Users[socket.id].name = data.name
        this.Users[socket.id].id = data.id
        this.sendUserOnline()
      })
      this.subscribe(socket)
      socket.on('disconnecting', () => {
        delete this.Users[socket.id]
        this.sendUserOnline()
      })
    })
  }

  subscribe(socket) {
    this.subscribeStartCall(socket)
    this.subscribeRejectCall(socket)
    this.subscribeTakeCall(socket)
    this.subscribeEndCall(socket)
    this.subscribeSdp(socket)
    this.subscribeIce(socket)
    this.subscribeStopCall(socket)
  }

  subscribeSdp(socket) {
    socket.on('sdp', data => {
      if (this.Users[data.recipient.socketId]) {
        this.Users[data.recipient.socketId].socket.emit('sdp', { sdp: data.sdp, recipient: { id: this.Users[data.recipient.socketId].id } })
      }
    })
  }

  subscribeIce(socket) {
    socket.on('ice', data => {
      if (this.Users[data.recipient.socketId]) {
        this.Users[data.recipient.socketId].socket.emit('ice', { ice: data.ice, recipient: { id: this.Users[data.recipient.socketId].id } })
      }
    })
  }

  subscribeRejectCall(socket) {
    socket.on('rejectCall', data => {
      this.Users[data.recipient.socketId].socket.emit('rejectCall',
        {
          recipient:
            {
              id: data.user.id
            },
          message: data.message ?? ''
        })
    })
  }

  subscribeStopCall(socket) {
    socket.on('stopCall', data => {
      console.log('stop call')
      console.log(data)
      const recipient = Object.values(this.Users).find(item => {
        return item.id === data.recipient.id
      })
      if (recipient) {
        recipient.socket.emit('stopCall', {
          recipient: {
            id: data.user.id,
            name: data.user.name,
            socketId: socket.id
          }
        })
      }
    })
  }

  subscribeEndCall(socket) {
    socket.on('endCall', data => {
      console.log('end call')
      console.log(data)
      if (this.Users[data.recipient.socketId]) {
        this.Users[data.recipient.socketId].socket.emit('endCall', { recipient: { id: data.recipient.user.id } })
      }
    })
  }

  subscribeTakeCall(socket) {
    socket.on('takeCall', data => {
      if (this.Users[data.recipient.socketId]) {
        this.Users[data.recipient.socketId].socket.emit('takeCall', { recipient: { id: data.user.id, name: data.user.name, socketId: socket.id } })
      }
    })
  }

  subscribeStartCall(socket) {
    socket.on('startCall', data => {
      console.log('startCall')
      console.log(data.recipientId)
      const recipient = Object.values(this.Users).find(item => {
        return item.id === data.recipientId
      })
      if (recipient) {
        console.log('callRequest')
        recipient.socket.emit('callRequest', {
            recipient: {
              id: data.user.id,
              name: data.user.name,
              socketId: socket.id
            }
          }
        )
      }
      // console.log(data)
    })
  }

  sendUserOnline() {
    const uidOnline = Object.values(this.Users)
      .filter(user => user.id)
      .map(item => {
        return {
          id: item.id,
          name: item.name
        }
      })
    this.io.emit('ONLINE', { 'users': uidOnline })
  }
}

module.exports = VideoClass
