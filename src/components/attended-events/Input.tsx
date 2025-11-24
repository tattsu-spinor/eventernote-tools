import { Show } from 'solid-js';
import { error, loading, search, setInputStore, useInputStore } from './store';

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
      <label class="d-floating-label">
        <span>ユーザーID</span>
        <input
          type="text"
          name="userId"
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
          type="text"
          name="actorName"
          placeholder="出演者名（オプション）"
          value={inputStore.actorName ?? ''}
          onInput={(e) => {
            setInputStore('actorName', e.target.value);
          }}
          class="d-input"
        />
      </label>

      <label class="d-floating-label">
        <span>会場名</span>
        <input
          type="text"
          name="placeName"
          placeholder="会場名（オプション）"
          value={inputStore.placeName ?? ''}
          onInput={(e) => {
            setInputStore('placeName', e.target.value);
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
