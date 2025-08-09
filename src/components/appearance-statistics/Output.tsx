import { For, Show } from 'solid-js';
import type { Response } from '../../actions/appearanceStatistics';
import { Pagination } from '../common/Pagination';
import { usePagination } from '../common/usePagination';
import { searchStore } from './searchStore';

export const Output = () => (
  <Show when={searchStore.response}>
    {(response) => <OutputContent {...response()} />}
  </Show>
);

const OutputContent = (response: Response) => {
  const { paginationProps, pagedItems } = usePagination(
    () => response.statistics,
  );

  return (
    <>
      <div>
        <span>{response.eventCount}件のイベントを検索しました。</span>
        <a href={response.searchUrl} target="_blank" rel="noopener noreferrer">
          検索結果
        </a>
      </div>
      <Pagination {...paginationProps()} />
      <div class="overflow-x-auto">
        <table class="d-table d-table-zebra">
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
                  <th class="text-right">{index + 1}</th>
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
