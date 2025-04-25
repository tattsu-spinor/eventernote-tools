import { ConvexHttpClient } from 'convex/browser';
import { ConvexError } from 'convex/values';
import { Index, Show } from 'solid-js';
import { api } from '../../../convex/_generated/api';
import { store } from './store';

export const Input = () => {
  const searchCoactingEvents = () => {
    store.loading = true;
    store.errorMessage = '';
    new ConvexHttpClient(import.meta.env.PUBLIC_CONVEX_URL)
      .action(api.coactingEvents.search, {
        actorNames: store.actorNames,
      })
      .then((result) => {
        store.result = result;
      })
      .catch((e) => {
        console.error(e);
        store.errorMessage =
          e instanceof ConvexError ? e.data : '予期せぬエラーが発生しました。';
      })
      .finally(() => {
        store.loading = false;
      });
  };

  return (
    <>
      <div>
        <Index each={store.actorNames}>
          {(actorName, index) => (
            <input
              value={actorName()}
              onInput={(e) => {
                store.actorNames[index] = e.currentTarget.value;
              }}
              type="text"
              class="d-input mt-3 w-full max-w-md"
              placeholder={`出演者${index + 1}`}
            />
          )}
        </Index>
      </div>
      <div class="mt-3">
        <button
          type="button"
          onClick={searchCoactingEvents}
          disabled={store.loading || store.canNotSearch}
          class="d-btn d-btn-primary"
        >
          検索
          <Show when={store.loading}>
            <span class="d-loading d-loading-spinner" />
          </Show>
        </button>
        <button
          type="button"
          onClick={() => store.actorNames.push('')}
          disabled={store.loading}
          class="d-btn d-btn-secondary ml-3"
        >
          追加
        </button>
        <button
          type="button"
          onClick={() => store.actorNames.pop()}
          disabled={store.loading || store.actorNames.length <= 1}
          class="d-btn d-btn-warning ml-3"
        >
          削除
        </button>
      </div>
      <Show when={store.errorMessage}>
        <div role="alert" class="d-alert d-alert-error mt-3">
          <span>{store.errorMessage}</span>
        </div>
      </Show>
    </>
  );
};
