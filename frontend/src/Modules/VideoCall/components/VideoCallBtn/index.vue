<template>
  <div>
    <div @click="call">
      <slot name="default" :calling="calling">
        <q-btn color="secondary" :label="label" no-caps :loading="calling" />
      </slot>
    </div>
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
import { useVideoCallStore } from '../../stores/useVideoCallStore.js'
import { errorMessage } from 'src/utils/message.js'
import { computed } from 'vue'
import { uid } from 'quasar'

const props = defineProps({
  recipientUid: {
    type: [String, Number],
    required: true
  },
  label: {
    type: String,
    default: 'Call'
  }
})

const videoCallStore = useVideoCallStore()

const calling = computed(() => {
  return videoCallStore.recipient.uid === props.recipientUid && videoCallStore.statusId === 2
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
    const newUid = uid()
    videoCallStore.startCall(props.recipientUid, newUid)
  } catch (er) {
    errorMessage('У вас нет доступа к камере или микрофону')
  }
}
</script>
