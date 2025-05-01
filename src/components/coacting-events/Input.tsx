import { ConvexHttpClient } from 'convex/browser';
import { ConvexError } from 'convex/values';
import { Index, Show } from 'solid-js';
import { createStore } from 'solid-js/store';
import { api } from '../../../convex/_generated/api';
import { store } from './store';

export const Input = () => {
  const [actorNames, setActorNames] = createStore(['', '']);
  const canNotSearch = () => actorNames.some((name) => !name);

  const searchCoactingEvents = () => {
    store.loading = true;
    store.errorMessage = '';
    new ConvexHttpClient(import.meta.env.PUBLIC_CONVEX_URL)
      .action(api.coactingEvents.search, {
        actorNames: actorNames,
      })
      .then((response) => {
        store.response = response;
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
        <Index each={actorNames}>
          {(actorName, index) => (
            <input
              type="text"
              value={actorName()}
              onInput={(e) => {
                setActorNames(index, e.target.value);
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
          onClick={searchCoactingEvents}
          disabled={store.loading || canNotSearch()}
          class="d-btn d-btn-primary"
        >
          検索
          <Show when={store.loading}>
            <span class="d-loading d-loading-spinner" />
          </Show>
        </button>
        <button
          type="button"
          onClick={() => {
            setActorNames((names) => [...names, '']);
          }}
          disabled={store.loading}
          class="d-btn d-btn-secondary ml-3"
        >
          追加
        </button>
        <button
          type="button"
          onClick={() => {
            setActorNames((names) => names.slice(0, -1));
          }}
          disabled={store.loading || actorNames.length <= 1}
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
