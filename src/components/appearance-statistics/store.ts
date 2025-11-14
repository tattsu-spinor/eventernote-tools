import { type ActionError, actions } from 'astro:actions';
import { createSignal, onMount } from 'solid-js';
import { createStore } from 'solid-js/store';
import type { InputData, OutputData } from '../../actions/appearanceStatistics';

const INPUT_STORE_KEY = 'appearanceStatistics.inputStore';
const [input, setInput] = createStore<InputData>({
  keyword: '',
  year: '',
  month: '',
  day: '',
  areaId: '',
  prefectureId: '',
  isPrefectureMode: false,
});
const [outputs, setOutputs] = createSignal<OutputData[]>([]);
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

export { outputs, loading, error };

export const search = async () => {
  setLoading(true);
  setError(undefined);
  const { data, error } = await actions.appearanceStatistics(input);
  setLoading(false);
  error ? setError(error) : setOutputs((outputs) => outputs.concat(data));
};

export const removeOutputs = (index: number) => {
  setOutputs((outputs) => outputs.filter((_, i) => i !== index));
};
