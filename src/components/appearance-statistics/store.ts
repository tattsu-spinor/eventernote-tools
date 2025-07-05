import { actions } from 'astro:actions';
import { createStore } from 'solid-js/store';
import type { Request, Response } from '../../actions/appearanceStatistics';

const [store, setStore] = createStore({
  response: undefined as Response | undefined,
  loading: false,
  error: undefined as Error | undefined,
});

const search = async (request: Request) => {
  setStore('loading', true);
  setStore('error', undefined);
  const { data, error } = await actions.appearanceStatistics(request);
  setStore('loading', false);
  error ? setStore('error', error) : setStore('response', data);
};

export { store, search };
