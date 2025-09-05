import { persistentMap } from '@nanostores/persistent';
import { useStore } from '@nanostores/solid';
import { readonlyType } from 'nanostores';
import { createMemo, createSignal, onMount } from 'solid-js';
import type { InputData } from '../../actions/appearanceStatistics';

const initialInput: InputData = {
  keyword: '',
  year: '',
  month: '',
  day: '',
  areaId: '',
  prefectureId: '',
};
const $inputStore = persistentMap(
  'appearanceStatistics.searchCondition',
  initialInput,
  {
    encode: JSON.stringify,
    decode: JSON.parse,
    listen: false,
  },
);

export const useInputStore = () => {
  const searchCondition = useStore(readonlyType($inputStore));
  const [isMounted, setIsMounted] = createSignal(false);
  onMount(() => {
    setIsMounted(true);
  });
  return createMemo(() => (isMounted() ? searchCondition() : initialInput));
};

export const setInputStore = <K extends keyof InputData>(
  key: K,
  value: InputData[K],
) => $inputStore.setKey(key, value);
