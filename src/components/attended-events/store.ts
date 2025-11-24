import { type ActionError, actions } from 'astro:actions';
import { createMemo, createSignal, onMount } from 'solid-js';
import { createStore } from 'solid-js/store';
import type { InputData, OutputData } from '../../actions/attendedEvents';

const INPUT_STORE_KEY = 'attendedEvents.inputStore';
const [input, setInput] = createStore<InputData>({
  userId: '',
  actorName: '',
  placeName: '',
});
const [outputs, setOutputs] = createSignal<OutputData[]>([]);
const [selectedOutputIndex, setSelectedOutputIndex] = createSignal(0);
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

export { outputs, selectedOutputIndex, loading, error };

export const search = async (form: FormData) => {
  setLoading(true);
  setError(undefined);
  const { data, error } = await actions.attendedEvents(form);
  setLoading(false);
  if (error) {
    setError(error);
  } else {
    setOutputs((outputs) => [data, ...outputs]);
    setSelectedOutputIndex(0);
  }
};

export const searchFromStatistics = async (input: InputData) => {
  setInput(input);
  localStorage.setItem(INPUT_STORE_KEY, JSON.stringify(input));
  const form = new FormData();
  form.append('userId', input.userId);
  form.append('actorName', input.actorName ?? '');
  form.append('placeName', input.placeName ?? '');
  await search(form);
};

export const selectedOutput = createMemo(
  () => outputs()[selectedOutputIndex()],
);

export const selectOutput = (index: number) => {
  setSelectedOutputIndex(index);
};
