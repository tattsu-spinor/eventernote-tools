<script lang="ts">
import OutputContent from './OutputContent.svelte';
import { store } from './store.svelte';
</script>

{#if store.data}
  {#key store.data}
    <OutputContent output={store.data} />
  {/key}
{/if}
