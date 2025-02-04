<template>
  <div v-if="userStore.user.id">
    <q-btn color="secondary" :label="label" @click="call" no-caps :loading="calling" />
    <q-dialog v-model="stopDialogShow" seamless position="bottom">
      <q-card>
        <q-card-section class="row items-center no-wrap">
          <div>
            <q-btn label="Отменить звонок" color="negative" no-caps @click="stopCall" />
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { useVideoCallStore } from 'src/Modules/VideoCall/stores/useVideoCallStore.js'
import { useUserStore } from 'src/Modules/Users/stores/useUserStore.js'
import { errorMessage } from 'src/utils/message.js'
import { computed } from 'vue'


const props = defineProps({
  recipientId: {
    type: [String, Number],
    required: true
  },
  label: {
    type: String,
    default: 'Call'
  }
})

const userStore = useUserStore()
const videoCallStore = useVideoCallStore()

const calling = computed(() => {
  return videoCallStore.recipient.id === props.recipientId && videoCallStore.statusId === 2
})
const stopDialogShow = computed(() => {
  return videoCallStore.statusId === 2
})
const stopCall = () => {
  videoCallStore.stopCall()
}
const call = async () => {

  try {
    videoCallStore.stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    })
    videoCallStore.startCall(props.recipientId)
  } catch (er) {
    errorMessage('У вас нет доступа к камере или микрофону')
  }
}
</script>
