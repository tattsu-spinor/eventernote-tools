import { Index, Show } from 'solid-js';
import {
  addActorName,
  removeActorName,
  search,
  setActorName,
  useInputStore,
  useOutputStore,
} from './store';

export const Input = () => {
  const inputStore = useInputStore();
  const outputStore = useOutputStore();
  const canNotSearch = () => inputStore.actorNames.some((v) => !v);

  return (
    <>
      <div>
        <Index each={inputStore.actorNames}>
          {(actorName, index) => (
            <input
              name={`actorName${index + 1}`}
              type="text"
              value={actorName()}
              onInput={(e) => {
                setActorName(index, e.target.value);
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
          onClick={search}
          disabled={outputStore.loading || canNotSearch()}
          class="d-btn d-btn-primary"
        >
          検索
          <Show when={outputStore.loading}>
            <span class="d-loading d-loading-spinner" />
          </Show>
        </button>
        <button
          type="button"
          onClick={addActorName}
          disabled={outputStore.loading}
          class="d-btn d-btn-secondary ml-3"
        >
          追加
        </button>
        <button
          type="button"
          onClick={removeActorName}
          disabled={outputStore.loading || inputStore.actorNames.length <= 1}
          class="d-btn d-btn-warning ml-3"
        >
          削除
        </button>
      </div>

      <Show when={outputStore.error} keyed>
        {(error) => (
          <div role="alert" class="d-alert d-alert-error mt-3">
            <span>{error.message || '予期せぬエラーが発生しました。'}</span>
          </div>
        )}
      </Show>
    </>
  );
};
