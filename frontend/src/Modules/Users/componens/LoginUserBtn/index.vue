<template>
  <div>
    <div v-if="edit" class="flex">
      <q-input v-model="user.name" outlined dense bg-color="white" />
      <q-btn color="secondary" label="Change name" no-caps dense @click="login" />
    </div>
    <div
      v-else
      class="flex q-col-gutter-sm items-center"
    >
      <div>
        <q-btn icon="settings" flat @click="edit = !edit" />
      </div>
      <div>
        {{ user?.name }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useUserStore } from '../../../VideoCall/stores/useUserStore.js'
import { useSocketStore } from 'src/Modules/VideoCall/stores/useSocketStore.js'
import { LocalStorage, uid } from 'quasar'

const socketStore = useSocketStore()
const storage = LocalStorage

const userStore = useUserStore()
const edit = ref(false)


const cacheName = 'myName'
const myUid = storage.has(cacheName + '_uid') ? storage.getItem(cacheName + '_uid') : uid()
const name = storage.has(cacheName) ? storage.getItem(cacheName) : 'User ' + myUid.substring(0, 7)
const user = ref({
  uid: myUid,
  name
})

const login = () => {
  userStore.setUid(user.value.uid)
  userStore.setUser(user.value)
  socketStore.socket.emit('register', { name: user.value.name, uid: user.value.uid })
  storage.set(cacheName, user.value.name)
  storage.set(cacheName + '_uid', myUid)
  edit.value = false
}

onMounted(() => {
  setTimeout(() => {
    login()
  }, 1500)
})

</script>
