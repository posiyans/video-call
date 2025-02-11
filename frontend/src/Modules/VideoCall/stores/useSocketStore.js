import { defineStore } from 'pinia'
import { io } from 'socket.io-client'
import { ref } from 'vue'
import { useVideoCallStore } from './useVideoCallStore.js'

const webSocketServerUrl = window.appConfig.socketserver ?? 'https://' + window.location.hostname + ':8443'

export const useSocketStore = defineStore('socket', () => {
  const socket = ref(null)
  socket.value = io(webSocketServerUrl)
  const videoCallStore = useVideoCallStore()

  socket.value.on('connect', () => {
    videoCallStore.setStatusOnline()
  })

  socket.value.on('connect_error', (err) => {
    console.log('Connection failed: ' + err.message)
  })

  socket.value.on('disconnect', () => {
    videoCallStore.setStatusOffline()
  })

  return {
    socket
  }
})