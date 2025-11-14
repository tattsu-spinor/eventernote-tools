import { sum } from 'es-toolkit';
import { createMemo, For, Show } from 'solid-js';
import type { OutputData } from '../../actions/appearanceStatistics';
import { ClipboardCopy } from '../common/ClipboardCopy';
import { Pagination } from '../common/Pagination';
import { usePagination } from '../common/usePagination';
import { outputs, removeOutputs } from './store';

export const Output = () => {
  return (
    <Show when={outputs().length > 0}>
      <OutputContent outputs={outputs()} />
    </Show>
  );
};

type OutputContentProps = {
  outputs: OutputData[];
};

const OutputContent = (props: OutputContentProps) => {
  const mergedActorCounts = createMemo(() =>
    merge(
      props.outputs.map(({ actorCounts }) => Object.fromEntries(actorCounts)),
    ),
  );
  const { paginationProps, pagedItems } = usePagination(mergedActorCounts);
  return (
    <>
      <div class="flex justify-end">
        <ClipboardCopy
          getText={() =>
            mergedActorCounts()
              .map(({ actorName, counts, totalCount }) =>
                [actorName, ...counts, totalCount].join(','),
              )
              .join('\n')
          }
        />
      </div>
      <Pagination {...paginationProps()} />
      <div class="overflow-x-auto">
        <table class="d-table">
          <thead>
            <tr>
              <th scope="col" />
              <th scope="col" class="text-center">
                出演者名
              </th>
              <For each={props.outputs}>
                {(output, index) => (
                  <th scope="col" class="text-right">
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
                            onClick={() => removeOutputs(index())}
                          >
                            削除
                          </button>
                        </li>
                      </ul>
                    </div>
                  </th>
                )}
              </For>
              <th scope="col" class="text-right">
                総出演数
              </th>
            </tr>
          </thead>
          <tbody>
            <For each={pagedItems()}>
              {({ item: { actorName, counts, totalCount }, index }) => (
                <tr>
                  <th scope="row">{index + 1}</th>
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

type MergedActorCount = {
  actorName: string;
  counts: number[];
  totalCount: number;
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
      } as MergedActorCount;
    })
    .sort((a, b) => b.totalCount - a.totalCount);
};
