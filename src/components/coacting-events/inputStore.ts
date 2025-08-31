import { persistentAtom } from '@nanostores/persistent';
import { useStore } from '@nanostores/solid';
import { readonlyType } from 'nanostores';
import { createMemo, createSignal, onMount } from 'solid-js';

const initialActorNames = ['', ''];
const $actorNames = persistentAtom<string[]>(
  'coactingEvents.actorNames',
  initialActorNames,
  {
    encode: JSON.stringify,
    decode: JSON.parse,
    listen: false,
  },
);

export const useActorNames = () => {
  const actorNames = useStore(readonlyType($actorNames));
  const [isMounted, setIsMounted] = createSignal(false);
  onMount(() => {
    setIsMounted(true);
  });
  return createMemo(() => (isMounted() ? actorNames() : initialActorNames));
};

export const setActorName = (index: number, name: string) =>
  $actorNames.set($actorNames.get().with(index, name));

export const addActorName = () => $actorNames.set($actorNames.get().concat(''));

export const removeActorName = () =>
  $actorNames.set($actorNames.get().slice(0, -1));
