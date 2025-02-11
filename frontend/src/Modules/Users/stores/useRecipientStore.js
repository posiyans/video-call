import { defineStore } from 'pinia';
import { useUserStore } from '../../VideoCall/stores/useUserStore.js'
import { computed, ref } from 'vue'
import { useSocketStore } from '../../VideoCall/stores/useSocketStore.js'

export const useRecipientStore = defineStore('recipient', () => {
  const userStore = useUserStore()
  const socketStore = useSocketStore()
  const users = ref([])
  const recipient = computed(() => users.value.filter(item => item.uid !== userStore.user.uid))
  socketStore.socket.on('connect', () => {
    socketStore.socket.on('ONLINE', data => {
      users.value = data.users
    })
  })
  socketStore.socket.on('disconnect', () => {
    users.value.splice(0)
  })

  return {
    recipient,
    users
  }
})
