<script lang="ts">
import OutputContent from './OutputContent.svelte';
import { store } from './store.svelte';
</script>

{#if store.data.length > 0}
  {#key store.data}
    <OutputContent outputs={store.data} />
  {/key}
{/if}
