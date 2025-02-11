import { defineStore } from 'pinia';
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  let user = {}
  let uid = ref(null)

  function setUid(value) {
    uid.value = value
  }

  function getUid() {
    return uid.value
  }

  function setUser(value) {
    user = value
  }

  function getUser() {
    return user
  }

  return {
    getUid,
    setUid,
    getUser,
    setUser,
    uid
  }
})
