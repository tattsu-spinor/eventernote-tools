import { ConvexHttpClient } from 'convex/browser';
import { ConvexError } from 'convex/values';
import {
  Index,
  Show,
  createEffect,
  createResource,
  createSignal,
} from 'solid-js';
import { createStore } from 'solid-js/store';
import { api } from '../../../convex/_generated/api';
import type { Request } from '../../../convex/coactingEvents';
import { setResponse } from './store';

export const Input = () => {
  const [actorNames, setActorNames] = createStore(['', '']);
  const canNotSearch = () => actorNames.some((name) => !name);

  const client = new ConvexHttpClient(import.meta.env.PUBLIC_CONVEX_URL);
  const [request, setRequest] = createSignal<Request>();
  const [responseResource] = createResource(request, (request) =>
    client.action(api.coactingEvents.search, request),
  );

  createEffect(() => {
    setResponse(responseResource.latest);
  });

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
          onClick={() => {
            setRequest({ actorNames });
          }}
          disabled={responseResource.loading || canNotSearch()}
          class="d-btn d-btn-primary"
        >
          検索
          <Show when={responseResource.loading}>
            <span class="d-loading d-loading-spinner" />
          </Show>
        </button>
        <button
          type="button"
          onClick={() => {
            setActorNames((names) => [...names, '']);
          }}
          disabled={responseResource.loading}
          class="d-btn d-btn-secondary ml-3"
        >
          追加
        </button>
        <button
          type="button"
          onClick={() => {
            setActorNames((names) => names.slice(0, -1));
          }}
          disabled={responseResource.loading || actorNames.length <= 1}
          class="d-btn d-btn-warning ml-3"
        >
          削除
        </button>
      </div>
      <Show when={responseResource.error} keyed>
        {(error) => (
          <div role="alert" class="d-alert d-alert-error mt-3">
            <span>
              {error instanceof ConvexError
                ? error.data
                : '予期せぬエラーが発生しました。'}
            </span>
          </div>
        )}
      </Show>
    </>
  );
};
