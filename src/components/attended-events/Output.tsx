import { Show } from 'solid-js';
import { EventList } from '../common/EventList';
import { outputStore } from './outputStore';

export const Output = () => (
  <Show when={outputStore.data}>{(output) => <EventList {...output()} />}</Show>
);
