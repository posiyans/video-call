<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>
          Video Call
        </q-toolbar-title>
        <Call class="q-mr-md" />
        <LoginUserBtn />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <UserList />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import LoginUserBtn from 'src/Modules/Users/componens/LoginUserBtn/index.vue'
import UserList from 'src/Modules/Users/componens/UserList/index.vue'
import Call from 'src/Modules/VideoCall/components/Call/index.vue'</script>
