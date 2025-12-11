<script lang="ts">
import { navigate } from 'astro:transitions/client';
import { ScanSearchIcon } from 'lucide-svelte';
import type { OutputData } from '../../actions/attendanceStatistics';
import { INPUT_DATA_KEY } from '../attended-events/Input.svelte';
import { store as attendedEventsStore } from '../attended-events/store.svelte';
import ClipboardCopy from '../common/ClipboardCopy.svelte';
import Pagination from '../common/Pagination.svelte';
import { usePagination } from '../common/usePagination.svelte';

type Props = {
  output: OutputData;
};
const { output }: Props = $props();
const actorPagination = usePagination(() => output.actorCounts);
const placePagination = usePagination(() => output.placeCounts);
</script>

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
    <div class="d-card p-2 gap-4">
      <ClipboardCopy
        text={() =>
          output.actorCounts.map((data) => data.join(',')).join('\n')
        }
      />
      <Pagination
        totalPages={actorPagination.totalPages}
        bind:currentPage={actorPagination.currentPage}
      />
      <div class="overflow-x-auto">
        <table class="d-table">
          <thead>
          <tr>
            <th></th>
            <th class="text-center">出演者名</th>
            <th class="text-right">参加数</th>
            <th class="text-center">検索</th>
          </tr>
          </thead>
          <tbody>
          {#each actorPagination.pagedItems as { item: [actorName, count], index }}
            <tr>
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
                        userId: output.userId,
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
            </tr>
          {/each}
          </tbody>
        </table>
      </div>
      <Pagination
        totalPages={actorPagination.totalPages}
        bind:currentPage={actorPagination.currentPage}
      />
    </div>
  </div>

  <input
    class="d-tab"
    type="radio"
    role="tab"
    name="tabs"
    aria-label="会場"
  />
  <div class="d-tab-content">
    <div class="d-card p-2 gap-4">
      <ClipboardCopy
        text={() =>
          output.placeCounts.map((data) => data.join(',')).join('\n')
        }
      />
      <Pagination
        totalPages={placePagination.totalPages}
        bind:currentPage={placePagination.currentPage}
      />
      <div class="overflow-x-auto">
        <table class="d-table">
          <thead>
          <tr>
            <th></th>
            <th class="text-center">会場名</th>
            <th class="text-right">参加数</th>
            <td class="text-center">検索</td>
          </tr>
          </thead>
          <tbody>
          {#each placePagination.pagedItems as { item: [placeName, count], index }}
            <tr>
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
                        userId: output.userId,
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
            </tr>
          {/each}
          </tbody>
        </table>
      </div>
      <Pagination
        totalPages={placePagination.totalPages}
        bind:currentPage={placePagination.currentPage}
      />
    </div>
  </div>
</div>
