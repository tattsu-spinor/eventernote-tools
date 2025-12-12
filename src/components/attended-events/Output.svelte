<script lang="ts">
import EventList from '../common/EventList.svelte';
import { store } from './store.svelte';
</script>

{#if store.data}
  {@const {events} = store.data}
  <EventList {events} />
{/if}
