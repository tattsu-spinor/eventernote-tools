import { persistentMap } from '@nanostores/persistent';
import { useStore } from '@nanostores/solid';
import { readonlyType } from 'nanostores';
import { createMemo, createSignal, onMount } from 'solid-js';

type SearchCondition = {
  keyword: string;
  year: string;
  month: string;
  day: string;
  areaId: string;
  prefectureId: string;
  isPrefectureMode: boolean;
};

const initialSearchCondition: SearchCondition = {
  keyword: '',
  year: '',
  month: '',
  day: '',
  areaId: '',
  prefectureId: '',
  isPrefectureMode: false,
};
const $searchCondition = persistentMap(
  'appearanceStatistics.searchCondition',
  initialSearchCondition,
  {
    encode: JSON.stringify,
    decode: JSON.parse,
    listen: false,
  },
);

export const useSearchCondition = () => {
  const searchCondition = useStore(readonlyType($searchCondition));
  const [isMounted, setIsMounted] = createSignal(false);
  onMount(() => {
    setIsMounted(true);
  });
  return createMemo(() =>
    isMounted() ? searchCondition() : initialSearchCondition,
  );
};

export const setSearchCondition = <K extends keyof SearchCondition>(
  key: K,
  value: SearchCondition[K],
) => $searchCondition.setKey(key, value);
