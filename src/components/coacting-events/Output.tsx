import { For, Show } from 'solid-js';
import { store } from './store';

export const Output = () => {
  return (
    <Show when={store.result}>
      {(result) => (
        <>
          <p>{result().events.length}件のイベントが見つかりました。</p>
          <ul class="d-list">
            <For each={result().events}>
              {(event) => (
                <li class="d-list-row">
                  <div>
                    <a
                      href={`https://www.eventernote.com${event.href}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {event.name}
                    </a>
                    <div class="text-xs">{event.date}</div>
                    <div class="text-xs">{event.place}</div>
                  </div>
                </li>
              )}
            </For>
          </ul>
        </>
      )}
    </Show>
  );
};
