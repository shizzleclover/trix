<script{{#if typescript}} lang="ts"{{/if}}>
  let count = 0
  const increment = () => {
    count += 1
  }
</script>

<main>
  <div class="card">
    <h1>Welcome to {{projectName}}</h1>
    <p>Built with Svelte{{#if typescript}} + TypeScript{{/if}}{{#if styling}} + {{styling}}{{/if}}</p>
    
    <button on:click={increment}>
      count is {count}
    </button>
    
    <p>
      Check out <a href="https://github.com/sveltejs/kit#readme" target="_blank" rel="noreferrer">SvelteKit</a>, the official Svelte app framework powered by Vite!
    </p>
    
    <p class="read-the-docs">
      Click on the Vite and Svelte logos to learn more
    </p>
  </div>
</main>

<style>
  .read-the-docs {
    color: #888;
  }
</style>
