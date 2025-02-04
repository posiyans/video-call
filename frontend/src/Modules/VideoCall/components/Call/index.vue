<template>
  <div>
    <IncomingCall />
    <VideoDialog />
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import IncomingCall from 'src/Modules/VideoCall/components/IncomingCall/Index.vue'
import VideoDialog from 'src/Modules/VideoCall/components/VideoDialog/index.vue'
import { useVideoCallStore } from 'src/Modules/VideoCall/stores/useVideoCallStore.js'
import { errorMessage } from 'src/utils/message.js'
import { useSocketStore } from 'src/Modules/Socket/stores/useSocketStore.js'

const socketStore = useSocketStore()

const videoCallStore = useVideoCallStore()

const socketEvents = {
  callRequest,
  rejectCall,
  takeCall,
  endCall,
  stopCall
}

function insertScriptSrcInHtmlDom(scriptSrc) {
  var script = document.createElement('script');
  script.src = scriptSrc;
  var ref = document.querySelector('script');
  ref.parentNode.insertBefore(script, ref);
}

onMounted(() => {
  insertScriptSrcInHtmlDom('./js/adapter-latest.js')
  Object.entries(socketEvents).forEach(([event, handler]) => {
    socketStore.socket.on(event, handler)
  })
})

onUnmounted(() => {
  Object.entries(socketEvents).forEach(([event, handler]) => {
    socketStore.socket.off(event, handler)
  })
})

function endCall(data) {
  if (videoCallStore.recipient?.id === data.recipient.id && videoCallStore.statusId > 1) {
    errorMessage('Собеседник завершил разговор');
    videoCallStore.setStatusOnline();
  }
}

function stopCall(data) {
  if (videoCallStore.recipient?.id === data.recipient.id && videoCallStore.statusId >= 1) {
    videoCallStore.callRequestFormShow = false;
    videoCallStore.statusId = 1
  }
}

function rejectCall(data) {
  if (data.message) errorMessage(data.message);
  if (videoCallStore.recipient?.id === data.recipient.id && videoCallStore.statusId > 0) {
    videoCallStore.setStatusOnline();
  }
}

async function takeCall(data) {
  videoCallStore.recipient.socketId = data.recipient.socketId;
  videoCallStore.recipient.name = data.recipient.name;
  videoCallStore.callDialogShow = true;
  videoCallStore.statusId = 10;
}

async function callRequest(data) {
  if (videoCallStore.statusId === 1) {
    videoCallStore.statusId = 3;
    videoCallStore.setRecipient(data.recipient);
    videoCallStore.callRequestFormShow = true;
  } else {
    videoCallStore.lineIsBusy(data.recipient)
  }
}

</script>
