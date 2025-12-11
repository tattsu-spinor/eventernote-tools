<script lang="ts">
import type { Event } from '../../types/event';
import Pagination from './Pagination.svelte';
import { usePagination } from './usePagination.svelte';

type Props = {
  events: ReadonlyArray<Event>;
};

const { events }: Props = $props();
const pagination = usePagination(() => events);
</script>

<div class="d-card p-2 gap-4">
  <p>{events.length}件のイベントが見つかりました。</p>
  <Pagination
    totalPages={pagination.totalPages}
    bind:currentPage={pagination.currentPage}
  />
  <ul class="d-list">
    {#each pagination.pagedItems as { item: event }}
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
    totalPages={pagination.totalPages}
    bind:currentPage={pagination.currentPage}
  />
</div>
