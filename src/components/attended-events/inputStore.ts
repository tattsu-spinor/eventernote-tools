import { persistentMap } from '@nanostores/persistent';
import { useStore } from '@nanostores/solid';
import { readonlyType } from 'nanostores';
import { createMemo, createSignal, onMount } from 'solid-js';
import type { InputData } from '../../actions/attendedEvents';

const initialInput: InputData = {
  userId: '',
  actorName: '',
};
const $inputStore = persistentMap('attendedEvents.inputStore', initialInput, {
  encode: JSON.stringify,
  decode: JSON.parse,
  listen: false,
});

export const useInputStore = () => {
  const inputStore = useStore(readonlyType($inputStore));
  const [isMounted, setIsMounted] = createSignal(false);
  onMount(() => {
    setIsMounted(true);
  });
  return createMemo(() => (isMounted() ? inputStore() : initialInput));
};

export const setSearchCondition = <K extends keyof InputData>(
  key: K,
  value: InputData[K],
) => $inputStore.setKey(key, value);
