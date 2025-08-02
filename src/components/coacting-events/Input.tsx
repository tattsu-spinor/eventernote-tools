import { Index, Show } from 'solid-js';
import { createStore, produce } from 'solid-js/store';
import { search, searchStore } from './searchStore';

export const Input = () => (
  <>
    <div>
      <Index each={actorNames}>
        {(actorName, index) => (
          <input
            name={`actorName${index + 1}`}
            type="text"
            value={actorName()}
            onInput={(e) => {
              setActorNames(index, e.target.value);
            }}
            placeholder={`出演者${index + 1}`}
            class="d-input mt-3 w-full max-w-md"
          />
        )}
      </Index>
    </div>
    <div class="mt-3">
      <button
        type="button"
        onClick={() => search({ actorNames })}
        disabled={searchStore.loading || canNotSearch()}
        class="d-btn d-btn-primary"
      >
        検索
        <Show when={searchStore.loading}>
          <span class="d-loading d-loading-spinner" />
        </Show>
      </button>
      <button
        type="button"
        onClick={() => setActorNames(produce((names) => names.push('')))}
        disabled={searchStore.loading}
        class="d-btn d-btn-secondary ml-3"
      >
        追加
      </button>
      <button
        type="button"
        onClick={() => setActorNames(produce((names) => names.pop()))}
        disabled={searchStore.loading || actorNames.length <= 1}
        class="d-btn d-btn-warning ml-3"
      >
        削除
      </button>
    </div>

    <Show when={searchStore.error} keyed>
      {(error) => (
        <div role="alert" class="d-alert d-alert-error mt-3">
          <span>{error.message || '予期せぬエラーが発生しました。'}</span>
        </div>
      )}
    </Show>
  </>
);

const [actorNames, setActorNames] = createStore(['', '']);
const canNotSearch = () => actorNames.some((name) => !name);
