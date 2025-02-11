<template>
  <q-dialog
    v-model="videoCallStore.callRequestFormShow"
    persistent
  >
    <q-card>
      <q-card-section class="row items-center">
        <q-avatar icon="phone" color="primary" text-color="white" />
        <span class="q-ml-sm">Входящий звонок от {{ videoCallStore.recipient?.data.name }}</span>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Отмена" color="primary" no-caps @click="rejectCall" />
        <q-btn flat label="Принять" color="primary" no-caps @click="takeCall" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useVideoCallStore } from '../../stores/useVideoCallStore.js'

const videoCallStore = useVideoCallStore()

const takeCall = () => videoCallStore.takeCall()
const rejectCall = () => videoCallStore.rejectCall('Собеседник отклонил вызов')
</script>
