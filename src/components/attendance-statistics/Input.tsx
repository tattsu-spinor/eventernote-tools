import { Show } from 'solid-js';
import { search, setUserId, useInputStore, useOutputStore } from './store';

export const Input = () => {
  const inputStore = useInputStore();
  const outputStore = useOutputStore();
  const canNotSearch = () => Object.values(inputStore).some((v) => !v);

  return (
    <>
      <fieldset class="grid gap-4 max-w-xs sm:max-w-sm md:max-w-md">
        <label class="d-floating-label">
          <span>ユーザーID</span>
          <input
            name="userId"
            type="text"
            placeholder="ユーザーID"
            value={inputStore.userId}
            onInput={(e) => {
              setUserId(e.target.value);
            }}
            class="d-input"
          />
        </label>

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
        </div>
      </fieldset>

      <Show when={outputStore.error} keyed>
        {(error) => (
          <div role="alert" class="d-alert d-alert-error my-3">
            <span>{error.message || '予期せぬエラーが発生しました。'}</span>
          </div>
        )}
      </Show>
    </>
  );
};
