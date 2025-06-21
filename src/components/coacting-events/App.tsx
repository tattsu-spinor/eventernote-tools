import { actions } from 'astro:actions';
import { createMemo, createResource, createSignal, Show } from 'solid-js';
import type { Request, Response } from '../../actions/coactingEvents';
import { Input } from './Input';
import { Output } from './Output';

export const App = () => {
  const [request, setRequest] = createSignal<Request>();
  const [response] = createResource(request, (request: Request) =>
    actions.coactingEvents.search.orThrow(request),
  );
  const latestResponse = createMemo((prev: Response | undefined) =>
    response.state === 'ready' ? response() : prev,
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
        <Show when={latestResponse()}>
          {(response) => <Output {...response()} />}
        </Show>
      </div>
    </>
  );
};
