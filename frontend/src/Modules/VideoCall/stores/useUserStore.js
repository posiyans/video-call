import { defineStore } from 'pinia';
import { useSocketStore } from './useSocketStore.js'
import { ref } from 'vue'
import { LocalStorage, uid } from 'quasar'

const storage = LocalStorage
export const useUserStore = defineStore('user', () => {
  const socketStore = useSocketStore()
  const cacheName = 'myName'
  const myUid = storage.has(cacheName + '_uid') ? storage.getItem(cacheName + '_uid') : uid()
  const name = storage.has(cacheName) ? storage.getItem(cacheName) : 'User ' + myUid.substring(0, 7)
  const user = ref({
    uid: myUid,
    name
  })
  const login = () => {
    socketStore.socket.emit('register', user.value)
    storage.set(cacheName, user.value.name)
    storage.set(cacheName + '_uid', myUid)
  }

  function getUid() {
    return user.value.uid
  }

  return {
    user,
    login,
    getUid
  }
})
