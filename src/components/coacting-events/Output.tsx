import { For, Show } from 'solid-js';
import type { OutputData } from '../../actions/coactingEvents';
import { Pagination } from '../common/Pagination';
import { usePagination } from '../common/usePagination';
import { outputStore } from './outputStore';

export const Output = () => (
  <Show when={outputStore.data}>
    {(output) => <OutputContent {...output()} />}
  </Show>
);

const OutputContent = (output: OutputData) => {
  const { paginationProps, pagedItems } = usePagination(() => output.events);

  return (
    <>
      <p>{output.events.length}件のイベントが見つかりました。</p>
      <Pagination {...paginationProps()} />
      <ul class="d-list">
        <For each={pagedItems()}>
          {({ item: event }) => (
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
