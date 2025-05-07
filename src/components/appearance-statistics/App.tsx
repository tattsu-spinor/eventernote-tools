import { ConvexHttpClient } from 'convex/browser';
import { Show, createMemo, createResource, createSignal } from 'solid-js';
import { api } from '../../../convex/_generated/api';
import type { Request, Response } from '../../../convex/appearanceStatics';
import { Input } from './Input';
import { Output } from './Output';

export const App = () => {
  const client = new ConvexHttpClient(import.meta.env.PUBLIC_CONVEX_URL);
  const [request, setRequest] = createSignal<Request>();
  const [response] = createResource(request, (request: Request) =>
    client.action(api.appearanceStatics.search, request),
  );
  const latestResponse = createMemo((prev: Response | undefined) =>
    response.state === 'ready' ? response() : prev,
  );

  return (
    <>
      <h2>統計条件</h2>
      <div class="not-content">
        <Input
          search={setRequest}
          loading={response.loading}
          error={response.error}
        />
      </div>
      <h2>統計結果</h2>
      <div class="not-content">
        <Show when={latestResponse()}>
          {(response) => <Output {...response()} />}
        </Show>
      </div>
    </>
  );
};
