<template>
  <q-dialog
    v-model="videoCallStore.callRequestFormShow"
    persistent
    @show="start"
  >
    <q-card>
      <q-card-section class="row items-center">
        <q-avatar icon="phone" color="primary" text-color="white" />
        <span class="q-ml-sm">Входящий звонок от {{ videoCallStore.recipient?.name }}</span>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Отмена" color="primary" v-close-popup @click="rejectCall" no-caps />
        <q-btn flat label="Принять" color="primary" v-close-popup @click="takeCall" no-caps />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useVideoCallStore } from 'src/Modules/VideoCall/stores/useVideoCallStore.js'

const videoCallStore = useVideoCallStore()

const start = () => {
  setTimeout(() => {
    takeCall()
  }, 500)
}

const takeCall = () => videoCallStore.takeCall()
const rejectCall = () => videoCallStore.rejectCall('Собеседник отклонил вызов')
</script>
