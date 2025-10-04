import { sum } from 'es-toolkit';
import { For, Show } from 'solid-js';
import type { OutputData } from '../../actions/appearanceStatistics';
import { Pagination } from '../common/Pagination';
import { usePagination } from '../common/usePagination';
import { removeOutputData, useOutputStore } from './store';

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
        <table class="d-table">
          <thead>
            <tr>
              <th />
              <th class="text-center">出演者名</th>
              <For each={props.outputs}>
                {(output, index) => (
                  <th class="text-right">
                    <div class="d-dropdown d-dropdown-hover w-full">
                      出演数{index() + 1}
                      <ul class="d-dropdown-content d-menu text-base-content font-medium bg-base-200 rounded-box w-36 z-1 p-2 shadow-sm">
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
                            onClick={() => removeOutputData(index())}
                          >
                            削除
                          </button>
                        </li>
                      </ul>
                    </div>
                  </th>
                )}
              </For>
              <th class="text-right">総出演数</th>
            </tr>
          </thead>
          <tbody>
            <For each={pagedItems()}>
              {({ item: { actorName, counts, totalCount }, index }) => (
                <tr>
                  <th>{index + 1}</th>
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
