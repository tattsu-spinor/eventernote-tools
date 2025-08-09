import { actions } from 'astro:actions';
import { batch } from 'solid-js';
import { createStore } from 'solid-js/store';
import type { InputData, OutputData } from '../../actions/coactingEvents';

const [searchStore, setSearchStore] = createStore({
  output: undefined as OutputData | undefined,
  loading: false,
  error: undefined as Error | undefined,
});

const search = async (input: InputData) => {
  batch(() => {
    setSearchStore('loading', true);
    setSearchStore('error', undefined);
  });
  const { data, error } = await actions.coactingEvents(input);
  batch(() => {
    setSearchStore('loading', false);
    error ? setSearchStore('error', error) : setSearchStore('output', data);
  });
};

export { searchStore, search };
