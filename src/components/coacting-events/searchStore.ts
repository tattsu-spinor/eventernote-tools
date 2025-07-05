import { actions } from 'astro:actions';
import { batch } from 'solid-js';
import { createStore } from 'solid-js/store';
import type { Request, Response } from '../../actions/coactingEvents';

const [searchStore, setSearchStore] = createStore({
  response: undefined as Response | undefined,
  loading: false,
  error: undefined as Error | undefined,
});

const search = async (request: Request) => {
  batch(() => {
    setSearchStore('loading', true);
    setSearchStore('error', undefined);
  });
  const { data, error } = await actions.coactingEvents(request);
  batch(() => {
    setSearchStore('loading', false);
    error ? setSearchStore('error', error) : setSearchStore('response', data);
  });
};

export { searchStore, search };
