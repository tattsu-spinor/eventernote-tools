import { For, Show } from 'solid-js';
import type { Response } from '../../actions/coactingEvents';
import { store } from './store';

export const Output = () => (
  <Show when={store.response}>
    {(response) => <OutputContent {...response()} />}
  </Show>
);

const OutputContent = (response: Response) => (
  <>
    <p>{response.events.length}件のイベントが見つかりました。</p>
    <ul class="d-list">
      <For each={response.events}>
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
);
