import { type ActionError, actions } from 'astro:actions';
import { createSignal, onMount } from 'solid-js';
import { createStore } from 'solid-js/store';
import type { InputData, OutputData } from '../../actions/attendedEvents';

const INPUT_STORE_KEY = 'attendedEvents.inputStore';
const [input, setInput] = createStore<InputData>({
  userId: '',
  actorName: '',
  placeName: '',
});
const [output, setOutput] = createSignal<OutputData>();
const [loading, setLoading] = createSignal(false);
const [error, setError] = createSignal<ActionError>();

export const useInputStore = () => {
  onMount(() => {
    const input = localStorage.getItem(INPUT_STORE_KEY);
    if (input) {
      setInput(JSON.parse(input));
    }
  });
  return input;
};

export const setInputStore = <K extends keyof InputData>(
  key: K,
  value: InputData[K],
) => {
  setInput(key, value);
  localStorage.setItem(INPUT_STORE_KEY, JSON.stringify(input));
};

export { output, loading, error };

export const search = async () => {
  setLoading(true);
  setError(undefined);
  const { data, error } = await actions.attendedEvents(input);
  setLoading(false);
  error ? setError(error) : setOutput(data);
};

export const searchFromStatistics = async (input: InputData) => {
  setInput(input);
  localStorage.setItem(INPUT_STORE_KEY, JSON.stringify(input));
  await search();
};
