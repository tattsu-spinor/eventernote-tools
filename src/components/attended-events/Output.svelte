<script lang="ts">
import EventList from '../common/EventList.svelte';
import { actionManager } from './actionManager.svelte.js';
</script>

{#if actionManager.data}
  {@const {events} = actionManager.data}
  <EventList {events} />
{/if}
