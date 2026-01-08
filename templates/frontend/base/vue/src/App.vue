<script setup{{#if typescript}} lang="ts"{{/if}}>
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <div class="container">
    <h1>Welcome to {{projectName}}</h1>
    <p>Built with Vue{{#if typescript}} + TypeScript{{/if}}{{#if styling}} + {{styling}}{{/if}}</p>
    
    <div class="card">
      <button @click="count++">count is {{ count}}</button>
      <p>
        Edit
        <code>src/App.vue</code> to test HMR
      </p>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  text-align: center;
}

.card {
  padding: 2em;
}
</style>
