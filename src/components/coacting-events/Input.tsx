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
      <fieldset class="grid gap-4 max-w-xs sm:max-w-sm md:max-w-md">
        <Index each={inputStore.actorNames}>
          {(actorName, index) => (
            <label class="d-floating-label">
              <span>出演者名{index + 1}</span>
              <input
                name={`actorName${index + 1}`}
                type="text"
                value={actorName()}
                placeholder={`出演者名${index + 1}`}
                onInput={(e) => {
                  setActorName(index, e.target.value);
                }}
                class="d-input"
              />
            </label>
          )}
        </Index>

        <div>
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
      </fieldset>

      <Show when={outputStore.error} keyed>
        {(error) => (
          <div role="alert" class="d-alert d-alert-error mt-3">
            <span>
              {error.code !== 'INTERNAL_SERVER_ERROR' && error.message
                ? error.message
                : '予期せぬエラーが発生しました。'}
            </span>
          </div>
        )}
      </Show>
    </>
  );
};
