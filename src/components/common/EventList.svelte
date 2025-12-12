<script lang="ts">
import type { Event } from '../../types/event';
import { PageManager } from './PageManager.svelte.js';
import Pagination from './Pagination.svelte';

type Props = {
  events: ReadonlyArray<Event>;
};

const { events }: Props = $props();
const pageManager = new PageManager(() => events);
</script>

<div class="d-card p-2 gap-4">
  <p>{events.length}件のイベントが見つかりました。</p>
  <Pagination
    totalPages={pageManager.totalPages}
    bind:currentPage={pageManager.currentPage}
  />
  <ul class="d-list">
    {#each pageManager.pagedItems as { item: event }}
      <li class="d-list-row">
        <div>
          <h4>
            <a
              class="d-link d-link-hover"
              href={`https://www.eventernote.com${event.href}`}
              target="_blank"
              rel="noreferrer"
            >
              {event.name}
            </a>
          </h4>
          <div class="text-xs">{event.date}</div>
          <div class="text-xs">{event.place}</div>
        </div>
      </li>
    {/each}
  </ul>
  <Pagination
    totalPages={pageManager.totalPages}
    bind:currentPage={pageManager.currentPage}
  />
</div>
