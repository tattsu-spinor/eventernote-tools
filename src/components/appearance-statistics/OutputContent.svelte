<script lang="ts">
import { sum } from 'es-toolkit';
import type { OutputData } from '../../actions/appearanceStatistics';
import ClipboardCopy from '../common/ClipboardCopy.svelte';
import Pagination from '../common/Pagination.svelte';
import { usePagination } from '../common/usePagination.svelte';
import { store } from './store.svelte';

type Props = {
  outputs: ReadonlyArray<OutputData>;
};
const { outputs }: Props = $props();
const mergedActorCounts = $derived(
  merge(outputs.map(({ actorCounts }) => Object.fromEntries(actorCounts))),
);
const pagination = usePagination(() => mergedActorCounts);

type MergedActorCount = {
  actorName: string;
  counts: number[];
  totalCount: number;
};

function merge(actorCounts: Record<string, number>[]) {
  const actorNames = actorCounts.reduce((actorNames, target) => {
    for (const actorName of Object.keys(target)) {
      actorNames.add(actorName);
    }
    return actorNames;
  }, new Set<string>());

  return [...actorNames]
    .map((actorName) => {
      const counts = actorCounts.map((count) => count[actorName] ?? 0);
      return {
        actorName,
        counts,
        totalCount: sum(counts),
      } as MergedActorCount;
    })
    .sort((a, b) => b.totalCount - a.totalCount);
}
</script>

<div class="d-card p-2 gap-4">
  <ClipboardCopy
    text={() =>
      mergedActorCounts
        .map(({ actorName, counts, totalCount }) =>
          [actorName, ...counts, totalCount].join(','),
        )
        .join('\n')
    }
  />
  <Pagination
    totalPages={pagination.totalPages}
    bind:currentPage={pagination.currentPage}
  />
  <div class="overflow-x-auto">
    <table class="d-table">
      <thead>
      <tr>
        <th scope="col"></th>
        <th scope="col" class="text-center">
          出演者名
        </th>
        {#each outputs as output, index}
          <th scope="col" class="text-right">
            <div class="d-dropdown d-dropdown-hover w-full">
              出演数{index + 1}
              <ul
                class="d-dropdown-content d-menu text-base-content font-medium bg-base-200 rounded-box w-36 z-1 p-2 shadow-sm">
                <li>
                  <a
                    href={output.searchUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    検索結果を開く
                  </a>
                </li>
                <li>
                  <button
                    type="button"
                    onclick={() => store.remove(index)}
                  >
                    削除
                  </button>
                </li>
              </ul>
            </div>
          </th>
        {/each}
        <th scope="col" class="text-right">
          総出演数
        </th>
      </tr>
      </thead>
      <tbody>
      {#each pagination.pagedItems as { item: { actorName, counts, totalCount }, index }}
        <tr>
          <th scope="row">{index + 1}</th>
          <td class="text-center">{actorName}</td>
          {#each counts as count}
            <td class="text-right">{count}</td>
          {/each}
          <td class="text-right">{totalCount}</td>
        </tr>
      {/each}
      </tbody>
    </table>
  </div>
  <Pagination
    totalPages={pagination.totalPages}
    bind:currentPage={pagination.currentPage}
  />
</div>
