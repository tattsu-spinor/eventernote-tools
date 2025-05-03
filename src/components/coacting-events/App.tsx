import { ConvexHttpClient } from 'convex/browser';
import { Show, createResource, createSignal } from 'solid-js';
import { api } from '../../../convex/_generated/api';
import type { Request } from '../../../convex/coactingEvents';
import { Input } from './Input';
import { Output } from './Output';

export const App = () => {
  const client = new ConvexHttpClient(import.meta.env.PUBLIC_CONVEX_URL);
  const [request, setRequest] = createSignal<Request>();
  const [response] = createResource(request, (request: Request) =>
    client.action(api.coactingEvents.search, request),
  );

  return (
    <>
      <h2>検索条件</h2>
      <div class="not-content">
        <Input
          search={setRequest}
          loading={response.loading}
          error={response.error}
        />
      </div>
      <h2>検索結果</h2>
      <div class="not-content">
        <Show when={response.state === 'pending' ? false : response()} keyed>
          {(response) => <Output {...response} />}
        </Show>
      </div>
    </>
  );
};
