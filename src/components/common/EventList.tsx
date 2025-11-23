import { type Component, For } from 'solid-js';
import type { Event } from '../../types/event';
import { Pagination } from './Pagination';
import { usePagination } from './usePagination';

type EventListProps = {
  events: ReadonlyArray<Event>;
};

export const EventList: Component<EventListProps> = (props) => {
  const { paginationProps, pagedItems } = usePagination(() => props.events);

  return (
    <div class="d-card p-2 gap-4">
      <p>{props.events.length}件のイベントが見つかりました。</p>
      <Pagination {...paginationProps()} />
      <ul class="d-list">
        <For each={pagedItems()}>
          {({ item: event }) => (
            <li class="d-list-row">
              <div>
                <h4>
                  <a
                    href={`https://www.eventernote.com${event.href}`}
                    target="_blank"
                    rel="noreferrer"
                    class="d-link d-link-hover"
                  >
                    {event.name}
                  </a>
                </h4>
                <div class="text-xs">{event.date}</div>
                <div class="text-xs">{event.place}</div>
              </div>
            </li>
          )}
        </For>
      </ul>
      <div class="d-card-actions justify-center">
        <Pagination {...paginationProps()} />
      </div>
    </div>
  );
};
