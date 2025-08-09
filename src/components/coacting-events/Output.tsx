import { For, Show } from 'solid-js';
import type { Response } from '../../actions/coactingEvents';
import { Pagination } from '../common/Pagination';
import { usePagination } from '../common/usePagination';
import { searchStore } from './searchStore';

export const Output = () => (
  <Show when={searchStore.response}>
    {(response) => <OutputContent {...response()} />}
  </Show>
);

const OutputContent = (response: Response) => {
  const { paginationProps, pagedItems } = usePagination(() => response.events);

  return (
    <>
      <p>{response.events.length}件のイベントが見つかりました。</p>
      <Pagination {...paginationProps()} />
      <ul class="d-list">
        <For each={pagedItems()}>
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
      <Pagination {...paginationProps()} />
    </>
  );
};
