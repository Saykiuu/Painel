<template>
  <router-view></router-view>
</template>

<script>
import socket from './socket';

export default {
  name: 'App',
  created (){
    socket.setupSocketConnection();
  },
  beforeUnmount (){
    socket.disconnect()
  }
}
</script>

<style>

</style>
