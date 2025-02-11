import { useVideoCallStore } from '../../stores/useVideoCallStore.js'

import { useSocketStore } from '../../stores/useSocketStore.js'
import { errorMessage } from 'src/utils/message.js'

const socketStore = useSocketStore()

const videoCallStore = useVideoCallStore()

const iceServers = window.appConfig?.iceServers ?? [
  { urls: 'stun:stun.stunprotocol.org:3478' },
  { urls: 'stun:stun.l.google.com:19302' }
]
const peerConnectionConfig = {
  iceServers
}

class WebrtcClass {
  constructor() {
    this.localVideo = null
    this.remoteVideo = null
    this.localStream = null
    this.peerConnection = null
  }

  async start(isCaller) {
    this.localVideo = document.getElementById('localVideo')
    this.remoteVideo = document.getElementById('remoteVideo')

    try {
      this.localStream = videoCallStore.stream
      this.localVideo.srcObject = this.localStream
      this.startCall(isCaller)
      socketStore.socket.on('ONLINE', this.changeUsersList.bind(this))
    } catch (error) {
      this.errorHandler(error)
    }
  }

  changeUsersList(data) {
    if (!videoCallStore.recipient.id || data.users.find(item => item.id === videoCallStore.recipient.id)) return
    errorMessage('Собеседик вышел из сети')
    videoCallStore.endCall()
    this.stop()
  }

  startCall(isCaller) {
    this.peerConnection = new RTCPeerConnection(peerConnectionConfig)
    this.peerConnection.onicecandidate = this.gotIceCandidate.bind(this)
    this.peerConnection.ontrack = this.gotRemoteStream.bind(this)
    this.peerConnection.onconnectionstatechange = this.connectionstatechange.bind(this)

    socketStore.socket.on('sdp', this.sdpMessage.bind(this))
    socketStore.socket.on('ice', this.iceMessage.bind(this))

    this.localStream.getTracks().forEach(track => this.peerConnection.addTrack(track, this.localStream))

    if (isCaller) {
      this.peerConnection.createOffer()
        .then(this.createdDescription.bind(this))
        .catch(this.errorHandler)
    }
  }

  connectionstatechange(data) {
    if (this.peerConnection.connectionState === 'disconnected') {
      errorMessage('Соединение потяряно')
      videoCallStore.setStatusOnline()
    }
  }

  iceMessage(message) {
    if (message.ice?.candidate) {
      this.peerConnection.addIceCandidate(new RTCIceCandidate(message.ice)).catch(this.errorHandler)
    }
  }

  sdpMessage(message) {
    this.peerConnection.setRemoteDescription(new RTCSessionDescription(message.sdp))
      .then(() => {
        if (message.sdp.type === 'offer') {
          return this.peerConnection.createAnswer()
        }
      })
      .then(answer => answer && this.createdDescription(answer))
      .catch(this.errorHandler)
  }

  gotIceCandidate(event) {
    if (event.candidate) {
      socketStore.socket.emit('ice', { ice: event.candidate, recipient: videoCallStore.recipient })
    }
  }

  gotRemoteStream(event) {
    if (this.remoteVideo) {
      this.remoteVideo.srcObject = event.streams[0]
    }
  }

  createdDescription(description) {
    this.peerConnection.setLocalDescription(description)
      .then(() => {
        socketStore.socket.emit('sdp', { sdp: this.peerConnection.localDescription, recipient: videoCallStore.recipient })
      })
      .catch(this.errorHandler)
  }

  stop() {
    socketStore.socket.off('ONLINE', this.changeUsersList)
    socketStore.socket.off('sdp', this.sdpMessage)
    socketStore.socket.off('ice', this.iceMessage)
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop())
    }

    if (this.localVideo) {
      this.localVideo.srcObject = null
    }

    if (this.remoteVideo) {
      this.remoteVideo.srcObject = null
    }

    if (this.peerConnection) {
      this.peerConnection.close()
      this.peerConnection = null
    }
  }

  errorHandler(error) {
    console.error('WebRTC Error:', error)
  }
}

export default WebrtcClass
