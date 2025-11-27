import { range } from 'es-toolkit';
import { For, Show } from 'solid-js';

export type PaginationProps = {
  totalPages: number;
  currentPage: number;
  updatePage: (page: number) => void;
};

export const Pagination = (props: PaginationProps) => (
  <Show when={props.totalPages >= 2}>
    <div class="d-card-actions justify-center">
      <div class="d-join">
        <button
          class="d-join-item d-btn d-btn-square d-btn-ghost"
          type="button"
          onClick={() => props.updatePage(props.currentPage - 1)}
          disabled={props.currentPage === 1}
        >
          &lt
        </button>
        <label class="d-join-item d-select w-fit">
          <span class="d-label">Page</span>
          <select
            value={props.currentPage}
            onInput={(e) => {
              props.updatePage(Number(e.target.value));
            }}
          >
            <For each={range(1, 1 + props.totalPages)}>
              {(n) => (
                <option value={n}>
                  {n} / {props.totalPages}
                </option>
              )}
            </For>
          </select>
        </label>
        <button
          class="d-join-item d-btn d-btn-square d-btn-ghost"
          type="button"
          onClick={() => props.updatePage(props.currentPage + 1)}
          disabled={props.currentPage === props.totalPages}
        >
          &gt
        </button>
      </div>
    </div>
  </Show>
);
