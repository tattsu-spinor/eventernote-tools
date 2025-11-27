import { Index, Show } from 'solid-js';
import {
  addActorName,
  error,
  loading,
  removeActorName,
  search,
  setActorName,
  useInputStore,
} from './store';

export const Input = () => {
  const inputStore = useInputStore();
  const canNotSearch = () => inputStore.actorNames.some((v) => !v);

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        await search(new FormData(e.currentTarget));
      }}
      class="d-card p-2 gap-4"
    >
      <input type="hidden" name="useCache" value="true" />

      <Index each={inputStore.actorNames}>
        {(actorName, index) => (
          <label class="d-floating-label">
            <span>{`出演者名${index + 1}`}</span>
            <input
              type="text"
              name={`actorNames`}
              placeholder={`出演者名${index + 1}`}
              value={actorName()}
              onInput={(e) => {
                setActorName(index, e.target.value);
              }}
              class="d-input"
            />
          </label>
        )}
      </Index>

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
        <button
          type="button"
          onClick={addActorName}
          disabled={loading()}
          class="d-btn d-btn-secondary"
        >
          追加
        </button>
        <button
          type="button"
          onClick={removeActorName}
          disabled={loading() || inputStore.actorNames.length <= 1}
          class="d-btn d-btn-warning"
        >
          削除
        </button>
      </div>

      <Show when={error()} keyed>
        {(error) => (
          <div role="alert" class="d-alert d-alert-error w-fit">
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
