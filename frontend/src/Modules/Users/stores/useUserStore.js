import { defineStore } from 'pinia';
import { useSocketStore } from 'src/Modules/Socket/stores/useSocketStore.js'
import { ref } from 'vue'
import { SessionStorage } from 'quasar'

export const useUserStore = defineStore('user', () => {
  const socketStore = useSocketStore()
  const id = Math.floor(Math.random() * 10000)
  const cacheName = 'myName'
  const name = SessionStorage.has(cacheName) ? SessionStorage.getItem(cacheName) : 'User ' + id
  const user = ref({
    id,
    name
  })
  const login = () => {
    socketStore.socket.emit('register', user.value)
    SessionStorage.set(cacheName, user.value.name)
  }
  return {
    user,
    login
  }
})
