<script lang="ts">
import { navigate } from 'astro:transitions/client';
import { ScanSearchIcon } from 'lucide-svelte';
import { actionManager as attendedEventsStore } from '../attended-events/actionManager.svelte.js';
import { INPUT_DATA_KEY } from '../attended-events/Input.svelte';
import Table from '../common/Table.svelte';
import { actionManager } from './actionManager.svelte.js';

type ItemCount = readonly [string, number];
</script>

{#if actionManager.data}
  {@const {userId, actorCounts, placeCounts} = actionManager.data}
  <div role="tablist" class="d-tabs d-tabs-border">
    <input
      class="d-tab"
      type="radio"
      role="tab"
      name="tabs"
      aria-label="出演者"
      checked
    />
    <div class="d-tab-content">
      {#snippet actorHeader()}
        <th></th>
        <th class="text-center">出演者名</th>
        <th class="text-right">参加数</th>
        <th class="text-center">検索</th>
      {/snippet}

      {#snippet actorRow([actorName, count]: ItemCount, index: number)}
        <th>{index + 1}</th>
        <td class="text-center">{actorName}</td>
        <td class="text-right">{count}</td>
        <td class="text-center w-16">
          <button
            class="d-btn d-btn-ghost d-btn-xs d-btn-square"
            type="button"
            disabled={attendedEventsStore.loading}
            onclick={async () => {
            sessionStorage.setItem(
              INPUT_DATA_KEY,
              JSON.stringify({
                userId,
                actorName,
                placeName: '',
              }),
            );
            await navigate('/attended-events/');
          }}
          >
            <ScanSearchIcon size={20} />
          </button>
        </td>
      {/snippet}

      <Table
        items={actorCounts}
        header={actorHeader}
        row={actorRow}
        copyText={() => actorCounts.map((data) => data.join(',')).join('\n')}
      />
    </div>

    <input
      class="d-tab"
      type="radio"
      role="tab"
      name="tabs"
      aria-label="会場"
    />
    <div class="d-tab-content">
      {#snippet placeHeader()}
        <th></th>
        <th class="text-center">会場名</th>
        <th class="text-right">参加数</th>
        <td class="text-center">検索</td>
      {/snippet}

      {#snippet placeRow([placeName, count]: ItemCount, index: number)}
        <th scope="row">{index + 1}</th>
        <td class="text-center">{placeName}</td>
        <td class="text-right">{count}</td>
        <td class="text-center w-16">
          <button
            class="d-btn d-btn-ghost d-btn-xs d-btn-square"
            type="button"
            disabled={attendedEventsStore.loading}
            onclick={async () => {
            sessionStorage.setItem(
              INPUT_DATA_KEY,
              JSON.stringify({
                userId,
                actorName: '',
                placeName,
              }),
            );
            await navigate('/attended-events/');
          }}
          >
            <ScanSearchIcon size={20} />
          </button>
        </td>
      {/snippet}

      <Table
        items={placeCounts}
        header={placeHeader}
        row={placeRow}
        copyText={() => placeCounts.map((data) => data.join(',')).join('\n')}
      />
    </div>
  </div>
{/if}
