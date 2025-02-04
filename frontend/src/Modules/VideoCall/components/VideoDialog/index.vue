<template>
  <q-dialog
    v-model="videoCallStore.callDialogShow"
    persistent
    :transition-duration="250"
    maximized
    @hide="onHideDialog"
    @show="start"
    @before-show="beforeStart"
  >
    <q-card>
      <q-bar>
        <div class="row no-wrap ellipsis q-col-gutter-sm">
          <div>
            {{ videoCallStore.recipient.name }}
          </div>
          <div class="text-negative">{{ formattedTime }}</div>
          <div class="text-secondary  ">
            {{ statsText }}
          </div>
        </div>

        <q-space />

        <q-btn dense flat icon="close" @click="endCall">
          <q-tooltip>Close</q-tooltip>
        </q-btn>
      </q-bar>

      <q-card-section class="q-pa-none">
        <div class="video-call-container">
          <div class="video-wrapper">
            <video id="remoteVideo" class="video" autoplay playsinline />

            <!-- Входящее видео -->
            <div class="incoming-video">
              <video id="localVideo" class="video" autoplay playsinline />
            </div>
          </div>
          <div class="controls">
            <q-btn label="Отмена" color="negative" no-caps @click="endCall" />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useVideoCallStore } from 'src/Modules/VideoCall/stores/useVideoCallStore.js'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import WebrtcClass from 'src/Modules/VideoCall/components/VideoDialog/webrtc.js'

const videoCallStore = useVideoCallStore()
let webrtc = null
let timeStart = 0
const timeIntervalId = ref(null)
const time = ref(0)

const formattedTime = computed(() => {
  const tmp = new Date(time.value);
  return new Intl.DateTimeFormat('ru-RU', {
    timeZone: 'Etc/GMT',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(tmp);
})

const endCall = () => {
  webrtc?.stop()
  videoCallStore.endCall()
}

const clearTimer = () => {
  if (timeIntervalId.value) {
    clearInterval(timeIntervalId.value);
    timeIntervalId.value = null;
  }
};


onMounted(() => {
  webrtc = new WebrtcClass()
})
onUnmounted(() => {
  clearTimer()
})

const onHideDialog = () => {
  clearTimer()
  time.value = 0
  webrtc?.stop()
}
const beforeStart = () => {
  timeStart = Date.now()
}

const start = () => {
  if (!videoCallStore.callDialogShow) return;

  timeStart = Date.now()
  timeIntervalId.value = setInterval(() => {
    time.value = Date.now() - timeStart;
    if (webrtc?.peerConnection) {
      webrtc
        .peerConnection
        .getStats(null)
        .then(data => {
          showRemoteStats(data)
        })
    }
  }, 1000)
  webrtc.start(videoCallStore.isCaller)

}

const bt = {
  bytesPrev: 0,
  timestampPrev: 0,
}
const statsValue = ref({
  bitrate: null,
  fps: null
})
const statsText = computed(() => {
  return [
    statsValue.value.bitrate ? `Bitrate: ${statsValue.value.bitrate} kbits/sec` : '',
    statsValue.value.fps ? `${statsValue.value.fps} fps` : '',
  ].filter(Boolean).join(' ');
});


function showRemoteStats(results) {
  results.forEach(report => {
    if (report.type === 'inbound-rtp' && report.mediaType === 'video') {
      const now = report.timestamp;
      if (bt.timestampPrev) {
        statsValue.value.bitrate = Math.floor(
          (8 * (report.bytesReceived - bt.bytesPrev)) / (now - bt.timestampPrev)
        );
      }
      bt.bytesPrev = report.bytesReceived;
      bt.timestampPrev = now;
      statsValue.value.fps = report.framesPerSecond;
    }
  });
}
</script>

<style scoped>

.video-call-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #1a1a1a;
  color: white;
}

.video-wrapper {
  position: relative;
  width: 95%;
  max-width: 800px;
  height: 60vh;
  background: black;
  border-radius: 10px;
  overflow: hidden;
}

.video {
  width: 100%;
  height: 100%;
  /*object-fit: scale-down;*/
}

.incoming-video {
  position: absolute;
  bottom: 10px;
  right: 10px;
  width: 100px;
  height: 80px;
  background: #666;
  border-radius: 5px;
  overflow: hidden;
}

.controls {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

</style>
