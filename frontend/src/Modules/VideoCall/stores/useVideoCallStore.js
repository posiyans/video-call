import { defineStore } from 'pinia';
import { useUserStore } from './useUserStore.js';
import { errorMessage } from 'src/utils/message.js';
import { useSocketStore } from './useSocketStore.js';
import { computed, ref } from 'vue'
import { uid } from 'quasar'

const StatusLabel = {
  0: 'Offline',
  1: 'Online',
  2: 'Start Call',
  3: 'Incoming Call',
  10: 'Call'
}

export const useVideoCallStore = defineStore('videoCall', () => {
  const userStore = useUserStore()
  const socketStore = useSocketStore()


  const statusId = ref(0)
  const callUid = ref(null)
  const recipient = ref({})
  const callRequestFormShow = ref(false)
  const callDialogShow = ref(false)
  const isCaller = ref(false)
  const stream = ref(null)


  const myStatus = computed(() => StatusLabel[statusId.value])

  function setRecipient(data) {
    recipient.value = data
  }

  // Запрос звонка
  function startCall(recipientUid, newCallUid) {
    if (statusId.value === 1) {
      callUid.value = newCallUid ?? uid()
      socketStore.socket.emit('startCall', {
        recipientUid,
        callUid: callUid.value,
        data: userStore.user
      })
      recipient.value = { uid: recipientUid }
      isCaller.value = true
      statusId.value = 2
    }
  }


  // принять входящий звонок
  async function takeCall() {
    try {
      stream.value = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      socketStore.socket.emit('takeCall', {
        callUid: callUid.value,
        recipient: {
          socketId: recipient.value.socketId
        },
        user: userStore.user
      });
      statusId.value = 10
      callDialogShow.value = true
    } catch (e) {
      rejectCall('У собеседника нет доступа к камере или микрофону');
      errorMessage('У вас нет доступа к камере или микрофону');
    }
  }

  function lineIsBusy(recipient) {
    socketStore.socket.emit('rejectCall', {
      recipient: {
        socketId: recipient.socketId
      },
      user: {
        id: userStore.user.id
      },
      message: 'Собеседник разговаривает'
    });
    errorMessage('Вам завонил ' + recipient.name)
  }

  // отклонить входящий звонок
  function rejectCall(message) {
    socketStore.socket.emit('rejectCall', {
      callUid: callUid.value,
      recipient: {
        socketId: recipient.value.socketId
      },
      user: {
        uid: userStore.getUid()
      },
      message
    })
    setStatusOnline()
  }

  function endCall() {
    socketStore.socket.emit('endCall', {
      callUid: callUid.value,
      recipient: {
        socketId: recipient.value.socketId,
        user: {
          uid: userStore.getUid()
        }
      }
    });
    setStatusOnline();
  }

  function stopCall() {
    socketStore.socket.emit('stopCall', {
      callUid: callUid.value,
      recipient: {
        uid: recipient.value.uid,
      },
      user: {
        uid: userStore.getUid()
      }
    });
    setStatusOnline();
  }

  function setStatusOnline() {
    callUid.value = null
    callDialogShow.value = false
    callRequestFormShow.value = false
    recipient.value = {}
    statusId.value = 1
    isCaller.value = false
    stream.value?.getTracks().forEach(track => track.stop())
  }

  function setStatusOffline() {
    setStatusOnline()
    statusId.value = 0;
  }

  return {
    statusId,
    recipient,
    callRequestFormShow,
    callDialogShow,
    isCaller,
    stream,
    myStatus,
    startCall,
    takeCall,
    lineIsBusy,
    rejectCall,
    endCall,
    stopCall,
    setStatusOnline,
    setStatusOffline,
    setRecipient,
    callUid

  }
})