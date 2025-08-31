import { actions } from 'astro:actions';
import { batch } from 'solid-js';
import { createStore } from 'solid-js/store';
import type { InputData, OutputData } from '../../actions/coactingEvents';

const [outputStore, setOutputStore] = createStore({
  data: undefined as OutputData | undefined,
  loading: false,
  error: undefined as Error | undefined,
});
export { outputStore };

export const search = async (input: InputData) => {
  batch(() => {
    setOutputStore('loading', true);
    setOutputStore('error', undefined);
  });
  const { data, error } = await actions.coactingEvents(input);
  batch(() => {
    setOutputStore('loading', false);
    error ? setOutputStore('error', error) : setOutputStore('data', data);
  });
};
