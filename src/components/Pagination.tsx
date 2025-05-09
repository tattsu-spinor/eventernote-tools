import { range } from 'es-toolkit';
import { For, Show } from 'solid-js';

type PaginationProps = {
  totalPages: number;
  currentPage: number;
  updatePage: (page: number) => void;
};

export const Pagination = (props: PaginationProps) => (
  <Show when={props.totalPages >= 2}>
    <div class="flex justify-center items-centers my-2">
      <button
        type="button"
        onClick={() => props.updatePage(props.currentPage - 1)}
        disabled={props.currentPage === 1}
        class="d-btn d-btn-ghost"
      >
        &lt
      </button>
      <label class="d-select w-fit">
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
        type="button"
        onClick={() => props.updatePage(props.currentPage + 1)}
        disabled={props.currentPage === props.totalPages}
        class="d-btn d-btn-ghost"
      >
        &gt
      </button>
    </div>
  </Show>
);
