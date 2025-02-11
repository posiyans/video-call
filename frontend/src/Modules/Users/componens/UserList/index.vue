<template>
  <div class="flex justify-center q-pa-lg q">
    <div>
      <div v-for="item in recipientStore.recipient" :key="item.uid" class="q-pa-md">
        <VideoCallBtn :recipient-uid="item.uid" :label="'Call ' + item.user.name" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRecipientStore } from 'src/Modules/Users/stores/useRecipientStore.js'
import VideoCallBtn from 'src/Modules/VideoCall/components/VideoCallBtn/index.vue'

const recipientStore = useRecipientStore()

</script>
