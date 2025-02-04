import { defineStore } from 'pinia'
import { io } from 'socket.io-client'
import { ref } from 'vue'
import { useVideoCallStore } from 'src/Modules/VideoCall/stores/useVideoCallStore.js'
import { useRecipientStore } from 'src/Modules/Users/stores/useRecipientStore.js'

const webSocketServerUrl = window.appConfig.socketserver ?? 'https://' + window.location.hostname + ':8443'

export const useSocketStore = defineStore('socket', () => {
  const socket = ref(null)
  socket.value = io(webSocketServerUrl)
  const videoCallStore = useVideoCallStore()
  const recipientStore = useRecipientStore()
  socket.value.on('connect', () => {
    videoCallStore.setStatusOnline()
    socket.value.on('ONLINE', data => {
      recipientStore.users = data.users
    })
  })

  socket.value.on('connect_error', (err) => {
    console.log('Connection failed: ' + err.message)
  })

  socket.value.on('disconnect', () => {
    videoCallStore.setStatusOffline()
    recipientStore.users.splice(0)
  })


  return {
    socket
  }
})