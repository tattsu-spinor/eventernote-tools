import { Show } from 'solid-js';
import { error, loading, search, setUserId, useInputStore } from './store';

export const Input = () => {
  const inputStore = useInputStore();
  const canNotSearch = () => !inputStore.userId;

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        await search(new FormData(e.currentTarget));
      }}
      class="d-card p-2 gap-4"
    >
      <input type="hidden" name="useCache" value="true" />

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

      <div class="d-card-actions">
        <button
          type="submit"
          disabled={loading() || canNotSearch()}
          class="d-btn d-btn-primary"
        >
          検索
          <Show when={loading()}>
            <span class="d-loading d-loading-spinner" />
          </Show>
        </button>
      </div>

      <Show when={error()} keyed>
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
