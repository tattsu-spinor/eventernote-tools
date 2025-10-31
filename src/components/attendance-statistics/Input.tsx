import { Show } from 'solid-js';
import { search, setUserId, useInputStore, useOutputStore } from './store';

export const Input = () => {
  const inputStore = useInputStore();
  const outputStore = useOutputStore();
  const canNotSearch = () => !inputStore.userId;

  return (
    <form class="grid gap-4 p-2 max-w-xs sm:max-w-sm md:max-w-md">
      <label class="d-floating-label">
        <span>ユーザーID</span>
        <input
          type="text"
          name="userId"
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

      <Show when={outputStore.error} keyed>
        {(error) => (
          <div role="alert" class="d-alert d-alert-error">
            <span>
              {error.code !== 'INTERNAL_SERVER_ERROR' && error.message
                ? error.message
                : '予期せぬエラーが発生しました。'}
            </span>
          </div>
        )}
      </Show>
    </form>
  );
};
