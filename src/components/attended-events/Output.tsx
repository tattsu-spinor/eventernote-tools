import { Show } from 'solid-js';
import { EventList } from '../common/EventList';
import { output } from './store';

export const Output = () => (
  <Show when={output()}>{(output) => <EventList {...output()} />}</Show>
);
