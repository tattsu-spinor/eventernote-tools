import { sum } from 'es-toolkit';
import { For, Show } from 'solid-js';
import type { OutputData } from '../../actions/appearanceStatistics';
import { Pagination } from '../common/Pagination';
import { usePagination } from '../common/usePagination';
import { useOutputStore } from './store';

export const Output = () => {
  const outputStore = useOutputStore();

  return (
    <Show when={outputStore.data.length > 0}>
      <OutputContent outputs={outputStore.data} />
    </Show>
  );
};

type OutputContentProps = {
  outputs: OutputData[];
};

const OutputContent = (props: OutputContentProps) => {
  const { paginationProps, pagedItems } = usePagination(() =>
    merge(
      props.outputs.map(({ statistics }) => Object.fromEntries(statistics)),
    ),
  );

  return (
    <>
      <Pagination {...paginationProps()} />
      <div class="overflow-x-auto">
        <table class="d-table d-table-zebra">
          <thead class="bg-base-200">
            <tr>
              <th rowspan="2" />
              <th rowspan="2" class="text-center">
                出演者名
              </th>
              <th colSpan={props.outputs.length} class="text-center">
                出演数
              </th>
              <th rowspan="2" class="text-center">
                総出演数
              </th>
            </tr>
            <tr>
              <For each={props.outputs}>
                {(output, index) => (
                  <th class="text-center">
                    <a href={output.searchUrl} target="_blank" rel="noreferrer">
                      検索条件{index() + 1}
                    </a>
                  </th>
                )}
              </For>
            </tr>
          </thead>
          <tbody>
            <For each={pagedItems()}>
              {({ item: { actorName, counts, totalCount }, index }) => (
                <tr>
                  <th class="text-right">{index + 1}</th>
                  <td class="text-center">{actorName}</td>
                  <For each={counts}>
                    {(count) => <td class="text-right">{count}</td>}
                  </For>
                  <td class="text-right">{totalCount}</td>
                </tr>
              )}
            </For>
          </tbody>
        </table>
      </div>
      <Pagination {...paginationProps()} />
    </>
  );
};

const merge = (actorCounts: Record<string, number>[]) => {
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
      };
    })
    .sort((a, b) => b.totalCount - a.totalCount);
};
