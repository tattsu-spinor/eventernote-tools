import { Show } from 'solid-js';
import { setSearchCondition, useInputStore } from './inputStore';
import { outputStore, search } from './outputStore';

export const Input = () => {
  const inputStore = useInputStore();
  const canNotSearch = () => Object.values(inputStore()).some((v) => !v);

  return (
    <>
      <fieldset class="d-fieldset max-w-md">
        <div class="d-fieldset-label">ユーザーID</div>
        <input
          name="userId"
          type="text"
          value={inputStore().userId}
          onInput={(e) => {
            setSearchCondition('userId', e.target.value);
          }}
          class="d-input w-full"
        />

        <div class="d-fieldset-label">出演者名</div>
        <input
          name="actorName"
          type="text"
          value={inputStore().actorName}
          onInput={(e) => {
            setSearchCondition('actorName', e.target.value);
          }}
          class="d-input w-full"
        />

        <div class="mt-3">
          <button
            type="button"
            onClick={() => search(inputStore())}
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
