class VideoClass {
  constructor(io, users) {
    this.io = io
    this.Users = users
    io.on('connection', (socket) => {
      console.log('New connection:', socket.id);
      this.Users.addUser(socket)

      // Регистрация пользователя
      socket.on('register', (data) => {
        this.handleRegistration(socket, data)
      })

      // Подписка на события
      this.subscribeEvents(socket);

      // Обработка отключения пользователя
      socket.on('disconnecting', () => {
        this.handleDisconnection(socket.id);
      })
    })
  }


  // Обработка регистрации пользователя
  handleRegistration(socket, data) {
    console.log('User registered:', socket.id, data.uid);
    this.Users.setUserUidForSocket(socket.id, data.uid);
    this.Users.setUserDataForSocket(socket.id, { name: data.name });
    this.sendUserOnline();
  }

  // Подписка на все события
  subscribeEvents(socket) {
    const events = {
      sdp: this.handleSdp.bind(this),
      ice: this.handleIce.bind(this),
      rejectCall: this.handleRejectCall.bind(this),
      stopCall: this.handleStopCall.bind(this, socket),
      endCall: this.handleEndCall.bind(this),
      takeCall: this.handleTakeCall.bind(this, socket),
      startCall: this.handleStartCall.bind(this, socket),
    };

    Object.entries(events).forEach(([event, handler]) => {
      socket.on(event, handler);
    });

  }

  // Обработка отклонения звонка
  handleRejectCall(data) {
    const recipientUser = this.Users.getUserBySocketId(data.recipient.socketId);
    if (recipientUser) {
      recipientUser.socket.emit('rejectCall', {
        callUid: data.callUid,
        recipient: { uid: data.user.uid },
        message: data.message ?? '',
      });
    }
    // Уведомление всех вкладок пользователя
    this.Users.getUsersByUid(data.user.uid).forEach(user => {
      user.socket.emit('rejectCall', {
        callUid: data.callUid,
        recipient: { id: data.user.uid },
      })
    })
  }

  // Обработка остановки звонка
  handleStopCall(socket, data) {
    this.Users.getUsersByUid(data.recipient.uid).forEach(user => {
      user.socket.emit('stopCall', {
        callUid: data.callUid,
        recipient: { uid: data.user.uid },
        socketId: socket.id
      })
    })
  }

  // Обработка принятия звонка
  handleTakeCall(socket, data) {
    const recipientUser = this.Users.getUserBySocketId(data.recipient.socketId);
    if (recipientUser) {
      recipientUser.socket.emit('takeCall', {
        recipient: { uid: data.user.uid, data: data.user, socketId: socket.id },
      });
    }

    // Уведомление всех вкладок пользователя
    this.Users.getUsersByUid(data.user.uid).forEach(user => {
      if (user.socket.id !== socket.id) {
        user.socket.emit('rejectCall', { callUid: data.callUid });
      }
    })
  }


  // Обработка завершения звонка
  handleEndCall(data) {
    const user = this.Users.getUserBySocketId(data.recipient.socketId);
    if (user) {
      user.socket.emit('endCall', {
        callUid: data.callUid,
        recipient: { uid: data.recipient.user.uid }
      })
    }
  }

  // Обработка начала звонка
  handleStartCall(socket, data) {
    const recipients = this.Users.getUsersByUid(data.recipientUid);
    recipients.forEach(recipient => {
      recipient.socket.emit('callRequest', {
        callUid: data.callUid,
        recipient: { data: data.data, socketId: socket.id },
      });
    });
  }

  // Обработка SDP
  handleSdp(data) {
    const user = this.Users.getUserBySocketId(data.recipient.socketId);
    if (user) {
      user.socket.emit('sdp', { sdp: data.sdp, recipient: { uid: user.uid } });
    } else {
      console.error('User not found for socket ID:', data.recipient.socketId);
    }
  }

  // Обработка ICE
  handleIce(data) {
    const user = this.Users.getUserBySocketId(data.recipient.socketId);
    if (user) {
      user.socket.emit('ice', { ice: data.ice, recipient: { uid: user.uid } });
    } else {
      console.error('User not found for socket ID:', data.recipient.socketId);
    }
  }

  // Обработка отключения пользователя
  handleDisconnection(socketId) {
    this.Users.deleteUser(socketId);
    this.sendUserOnline();
  }

  // Отправка списка онлайн-пользователей
  sendUserOnline() {
    const users = this.Users.getAllRegUsers()
    this.io.emit('ONLINE', { users })
  }
}

module.exports = VideoClass
