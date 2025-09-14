import { type ActionError, actions } from 'astro:actions';
import { batch, onMount } from 'solid-js';
import { createStore } from 'solid-js/store';
import type { InputData, OutputData } from '../../actions/attendedEvents';

const INPUT_STORE_KEY = 'attendedEvents.inputStore';
const [_inputStore, _setInputStore] = createStore<InputData>({
  userId: '',
  actorName: '',
});
const [_outputStore, _setOutputStore] = createStore({
  data: undefined as OutputData | undefined,
  loading: false,
  error: undefined as ActionError | undefined,
});

export const useInputStore = () => {
  onMount(() => {
    const input = localStorage.getItem(INPUT_STORE_KEY);
    if (input) {
      _setInputStore(JSON.parse(input));
    }
  });
  return _inputStore;
};

export const useOutputStore = () => _outputStore;

export const setInputStore = <K extends keyof InputData>(
  key: K,
  value: InputData[K],
) => {
  _setInputStore(key, value);
  localStorage.setItem(INPUT_STORE_KEY, JSON.stringify(_inputStore));
};

export const search = async () => {
  batch(() => {
    _setOutputStore('loading', true);
    _setOutputStore('error', undefined);
  });
  const { data, error } = await actions.attendedEvents(_inputStore);
  batch(() => {
    _setOutputStore('loading', false);
    error ? _setOutputStore('error', error) : _setOutputStore('data', data);
  });
};
