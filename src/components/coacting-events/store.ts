import { type ActionError, actions } from 'astro:actions';
import { batch, onMount } from 'solid-js';
import { createStore } from 'solid-js/store';
import type { InputData, OutputData } from '../../actions/coactingEvents';

const INPUT_STORE_KEY = 'coactingEvents.inputStore';
const [_inputStore, _setInputStore] = createStore<InputData>({
  actorNames: ['', ''],
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
      _setInputStore('actorNames', JSON.parse(input));
    }
  });
  return _inputStore;
};

export const useOutputStore = () => _outputStore;

export const setActorName = (index: number, name: string) => {
  _setInputStore('actorNames', (actorNames) => actorNames.with(index, name));
  localStorage.setItem(INPUT_STORE_KEY, JSON.stringify(_inputStore.actorNames));
};

export const addActorName = () => {
  _setInputStore('actorNames', (actorNames) => actorNames.concat(''));
  localStorage.setItem(INPUT_STORE_KEY, JSON.stringify(_inputStore.actorNames));
};

export const removeActorName = () => {
  _setInputStore('actorNames', (actorNames) => actorNames.slice(0, -1));
  localStorage.setItem(INPUT_STORE_KEY, JSON.stringify(_inputStore.actorNames));
};

export const search = async () => {
  batch(() => {
    _setOutputStore('loading', true);
    _setOutputStore('error', undefined);
  });
  const { data, error } = await actions.coactingEvents(_inputStore);
  batch(() => {
    _setOutputStore('loading', false);
    error ? _setOutputStore('error', error) : _setOutputStore('data', data);
  });
};
