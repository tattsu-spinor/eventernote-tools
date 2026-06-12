import { type ActionError, actions } from 'astro:actions';
import { createSignal, onMount } from 'solid-js';
import { createStore } from 'solid-js/store';
import type { InputData, OutputData } from '../../actions/attendanceStatistics';

const INPUT_STORE_KEY = 'attendanceStatistics.inputStore';
const [input, setInput] = createStore<InputData>({
  userId: '',
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

export const setUserId = (userId: string) => {
  setInput('userId', userId);
  localStorage.setItem(INPUT_STORE_KEY, JSON.stringify(input));
};

export { output, loading, error };

export const search = async (form: FormData) => {
  setLoading(true);
  setError(undefined);
  const { data, error } = await actions.attendanceStatistics(form);
  setLoading(false);
  error ? setError(error) : setOutput(data);
};
