import { type ActionError, actions } from 'astro:actions';
import { createMemo, createSignal, onMount } from 'solid-js';
import { createStore } from 'solid-js/store';
import type { InputData, OutputData } from '../../actions/coactingEvents';

const INPUT_STORE_KEY = 'coactingEvents.inputStore';
const [input, setInput] = createStore<InputData>({
  actorNames: ['', ''],
});
const [outputs, setOutputs] = createSignal<OutputData[]>([]);
const [selectedOutputIndex, setSelectedOutputIndex] = createSignal(0);
const [loading, setLoading] = createSignal(false);
const [error, setError] = createSignal<ActionError>();

export const useInputStore = () => {
  onMount(() => {
    const input = localStorage.getItem(INPUT_STORE_KEY);
    if (input) {
      setInput('actorNames', JSON.parse(input));
    }
  });
  return input;
};

export const setActorName = (index: number, name: string) => {
  setInput('actorNames', (actorNames) => actorNames.with(index, name));
  localStorage.setItem(INPUT_STORE_KEY, JSON.stringify(input.actorNames));
};

export const addActorName = () => {
  setInput('actorNames', (actorNames) => actorNames.concat(''));
  localStorage.setItem(INPUT_STORE_KEY, JSON.stringify(input.actorNames));
};

export const removeActorName = () => {
  setInput('actorNames', (actorNames) => actorNames.slice(0, -1));
  localStorage.setItem(INPUT_STORE_KEY, JSON.stringify(input.actorNames));
};

export { outputs, selectedOutputIndex, loading, error };

export const search = async (form: FormData) => {
  setLoading(true);
  setError(undefined);
  const { data, error } = await actions.coactingEvents(form);
  setLoading(false);
  if (error) {
    setError(error);
  } else {
    setOutputs((outputs) => [data, ...outputs]);
    setSelectedOutputIndex(0);
  }
};

export const selectedOutput = createMemo(
  () => outputs()[selectedOutputIndex()],
);

export const selectOutput = (index: number) => {
  setSelectedOutputIndex(index);
};
