import { For } from 'solid-js';
import type { Response } from '../../actions/appearanceStatistics';

export const Output = (response: Response) => (
  <>
    <div>
      <span>{response.eventCount}件のイベントを検索しました。</span>
      <a href={response.searchUrl} target="_blank" rel="noopener noreferrer">
        検索結果
      </a>
    </div>
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
          <For each={response.statistics}>
            {([actorName, count], index) => (
              <tr>
                <th class="text-right">{index() + 1}</th>
                <td class="text-center">{actorName}</td>
                <td class="text-right">{count}</td>
              </tr>
            )}
          </For>
        </tbody>
      </table>
    </div>
  </>
);
