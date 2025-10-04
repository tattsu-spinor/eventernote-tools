import { For, Show } from 'solid-js';
import type { OutputData } from '../../actions/appearanceStatistics';
import { Pagination } from '../common/Pagination';
import { usePagination } from '../common/usePagination';
import { useOutputStore } from './store';

export const Output = () => {
  const outputStore = useOutputStore();

  return (
    <Show when={outputStore.data}>
      {(output) => <OutputContent {...output()} />}
    </Show>
  );
};

const OutputContent = (output: OutputData) => {
  const { paginationProps, pagedItems } = usePagination(
    () => output.statistics,
  );

  return (
    <>
      <div>
        <span>{output.eventCount}件のイベントを検索しました。</span>
        <a href={output.searchUrl} target="_blank" rel="noopener noreferrer">
          検索結果
        </a>
      </div>
      <Pagination {...paginationProps()} />
      <div class="overflow-x-auto">
        <table class="d-table">
          <thead>
            <tr>
              <th />
              <th class="text-center">出演者名</th>
              <th class="text-right">出演数</th>
            </tr>
          </thead>
          <tbody>
            <For each={pagedItems()}>
              {({ item: [actorName, count], index }) => (
                <tr>
                  <th>{index + 1}</th>
                  <td class="text-center">{actorName}</td>
                  <td class="text-right">{count}</td>
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
