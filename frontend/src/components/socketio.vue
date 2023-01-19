<template>
    <div class="warpper">
        <h1>Chat</h1>

    </div>
</template>

<script lang="ts">
import SocketioService from '../services/SocketioService.js';

export default {
  name: 'App',
  components: {},

  created() {
      console.log('connecting to socket.io');
    SocketioService.setupSocketConnection();
  },

  beforeUnmount() {
    SocketioService.disconnect();
  }
}
</script>

<style>

</style>