<template>
  <div>
    <div v-if="edit" class="flex">
      <q-input v-model="userStore.user.name" outlined dense bg-color="white" />
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
        {{ userStore.user?.name }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useUserStore } from '../../../VideoCall/stores/useUserStore.js'


const userStore = useUserStore()
const edit = ref(false)
const login = () => {
  userStore.login()
  edit.value = false
}
onMounted(() => {
  setTimeout(() => {
    login()
  }, 1500)
})
</script>
