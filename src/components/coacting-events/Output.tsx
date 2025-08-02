import { createMemo, createSignal, For, Show } from 'solid-js';
import type { Response } from '../../actions/coactingEvents';
import { Pagination } from '../Pagination';
import { searchStore } from './searchStore';

export const Output = () => (
  <Show when={searchStore.response}>
    {(response) => <OutputContent {...response()} />}
  </Show>
);

const OutputContent = (response: Response) => {
  const [currentPage, setCurrentPage] = createSignal(1);
  const totalPages = createMemo(() =>
    Math.ceil(response.events.length / PAGE_LIMIT),
  );

  return (
    <>
      <p>{response.events.length}件のイベントが見つかりました。</p>
      <Pagination
        totalPages={totalPages()}
        currentPage={currentPage()}
        updatePage={setCurrentPage}
      />
      <EventList events={response.events} currentPage={currentPage()} />
      <Pagination
        totalPages={totalPages()}
        currentPage={currentPage()}
        updatePage={setCurrentPage}
      />
    </>
  );
};

type EventListProps = {
  events: Response['events'];
  currentPage: number;
};

const EventList = (props: EventListProps) => {
  const pagedEvents = createMemo(() =>
    props.events.slice(
      PAGE_LIMIT * (props.currentPage - 1),
      PAGE_LIMIT * props.currentPage,
    ),
  );

  return (
    <ul class="d-list">
      <For each={pagedEvents()}>
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
  );
};

const PAGE_LIMIT = 20;
