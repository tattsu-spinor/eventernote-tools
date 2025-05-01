import { For, Show } from 'solid-js';
import { response } from './store';

export const Output = () => {
  return (
    <Show when={response()}>
      {(response) => (
        <>
          <p>{response().events.length}件のイベントが見つかりました。</p>
          <ul class="d-list">
            <For each={response().events}>
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
