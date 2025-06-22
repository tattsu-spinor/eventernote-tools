import { actions } from 'astro:actions';
import { Show } from 'solid-js';
import { createStore } from 'solid-js/store';
import type { Request, Response } from '../../actions/appearanceStatistics';
import { Input } from './Input';
import { Output } from './Output';

export const App = () => (
  <>
    <h2>統計条件</h2>
    <div class="not-content">
      <Input search={search} loading={store.loading} error={store.error} />
    </div>
    <h2>統計結果</h2>
    <div class="not-content">
      <Show when={store.response}>
        {(response) => <Output {...response()} />}
      </Show>
    </div>
  </>
);

const [store, setStore] = createStore({
  response: undefined as Response | undefined,
  loading: false,
  error: undefined as Error | undefined,
});

const search = async (request: Request) => {
  setStore('loading', true);
  setStore('error', undefined);
  const { data, error } = await actions.appearanceStatistics.search(request);
  setStore('loading', false);
  error ? setStore('error', error) : setStore('response', data);
};
