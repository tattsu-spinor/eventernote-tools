<script lang="ts">
import { sum } from 'es-toolkit';
import Table from '../common/Table.svelte';
import { store } from './store.svelte';

const mergedActorCounts = $derived(
  merge(store.data.map(({ actorCounts }) => Object.fromEntries(actorCounts))),
);
$inspect(mergedActorCounts);

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

{#if store.data.length > 0}
  {#snippet header()}
    <th scope="col"></th>
    <th scope="col" class="text-center">
      出演者名
    </th>
    {#each store.data as { searchUrl }, index}
      <th scope="col" class="text-right">
        <div class="d-dropdown d-dropdown-hover w-full">
          出演数{index + 1}
          <ul
            class="d-dropdown-content d-menu text-base-content font-medium bg-base-200 rounded-box w-36 z-1 p-2 shadow-sm">
            <li>
              <a
                href={searchUrl}
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
  {/snippet}

  {#snippet row(item: MergedActorCount, index: number)}
    <th scope="row">{index + 1}</th>
    <td class="text-center">{item.actorName}</td>
    {#each item.counts as count}
      <td class="text-right">{count}</td>
    {/each}
    <td class="text-right">{item.totalCount}</td>
  {/snippet}

  <Table
    items={mergedActorCounts}
    {header}
    {row}
    copyText={() =>
      mergedActorCounts
        .map(({ actorName, counts, totalCount }) =>
          [actorName, ...counts, totalCount].join(','),
        )
        .join('\n')
    }
  />
{/if}
