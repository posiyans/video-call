import { defineStore } from 'pinia';
import { useUserStore } from 'src/Modules/Users/stores/useUserStore.js'
import { computed, onMounted, ref } from 'vue'

export const useRecipientStore = defineStore('recipient', () => {
  const userStore = useUserStore()
  const users = ref([])
  const recipient = computed(() => users.value.filter(item => item.id !== userStore.user.id))
  return {
    recipient,
    users
  }
})
