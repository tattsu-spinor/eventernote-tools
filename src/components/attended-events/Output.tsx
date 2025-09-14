import { Show } from 'solid-js';
import { EventList } from '../common/EventList';
import { useOutputStore } from './store';

export const Output = () => {
  const outputStore = useOutputStore();

  return (
    <Show when={outputStore.data}>
      {(output) => <EventList {...output()} />}
    </Show>
  );
};
