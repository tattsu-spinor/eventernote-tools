<script lang="ts">
import EventList from '../common/EventList.svelte';
import { store } from './store.svelte';
</script>

{#if store.data}
  {@const data = store.data}
  {#key data}
    <EventList {...data} />
  {/key}
{/if}
