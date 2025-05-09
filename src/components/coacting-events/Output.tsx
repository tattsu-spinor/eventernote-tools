import { For, createMemo, createSignal } from 'solid-js';
import type { Response } from '../../../convex/coactingEvents';
import { Pagination } from '../Pagination';

export const Output = (response: Response) => {
  const [currentPage, setCurrentPage] = createSignal(1);
  const totalPages = createMemo(() => Math.ceil(response.events.length / 20));
  const pagedEvents = createMemo(() =>
    response.events.slice(20 * (currentPage() - 1), 20 * currentPage()),
  );

  return (
    <>
      <p>{response.events.length}件のイベントが見つかりました。</p>
      <Pagination
        totalPages={totalPages()}
        currentPage={currentPage()}
        updatePage={setCurrentPage}
      />
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
      <Pagination
        currentPage={currentPage()}
        totalPages={totalPages()}
        updatePage={setCurrentPage}
      />
    </>
  );
};
