import { For, Show } from 'solid-js';
import { store } from './store';

export const Output = () => {
  return (
    <Show when={store.result}>
      <div>
        <span>{store.result?.eventCount}件のイベントを検索しました。</span>
        <a
          href={store.result?.searchUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
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
            <For each={store.result?.statistics}>
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
    </Show>
  );
};
