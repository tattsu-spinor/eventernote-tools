import { Show } from 'solid-js';
import { search, setInputStore, useInputStore, useOutputStore } from './store';

export const Input = () => {
  const inputStore = useInputStore();
  const outputStore = useOutputStore();
  const canNotSearch = () => !inputStore.userId;

  return (
    <>
      <fieldset class="grid gap-4 max-w-xs sm:max-w-sm  md:max-w-md">
        <label class="d-floating-label">
          <span>ユーザーID</span>
          <input
            name="userId"
            type="text"
            placeholder="ユーザーID"
            value={inputStore.userId}
            onInput={(e) => {
              setInputStore('userId', e.target.value);
            }}
            class="d-input"
          />
        </label>

        <label class="d-floating-label">
          <span>出演者名</span>
          <input
            name="actorName"
            type="text"
            placeholder="出演者名（オプション）"
            value={inputStore.actorName}
            onInput={(e) => {
              setInputStore('actorName', e.target.value);
            }}
            class="d-input"
          />
        </label>

        <label class="d-floating-label">
          <span>会場名</span>
          <input
            name="placeName"
            type="text"
            placeholder="会場名（オプション）"
            value={inputStore.placeName}
            onInput={(e) => {
              setInputStore('placeName', e.target.value);
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
