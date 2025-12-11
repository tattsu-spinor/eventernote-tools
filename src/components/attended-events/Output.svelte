<script lang="ts">
import EventList from '../common/EventList.svelte';
import { store } from './store.svelte';
</script>

{#if store.data}
  {#key store.data}
    <EventList {...store.data} />
  {/key}
{/if}
