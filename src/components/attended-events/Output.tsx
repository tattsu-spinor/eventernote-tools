import { Show } from 'solid-js';
import { EventList } from '../common/EventList';
import { SelectHistory } from '../common/SelectHistory';
import {
  outputs,
  selectedOutput,
  selectedOutputIndex,
  selectOutput,
} from './store';

export const Output = () => (
  <Show when={selectedOutput()}>
    {(output) => (
      <>
        <SelectHistory
          list={outputs().map((output) => output.searchName)}
          selectedIndex={selectedOutputIndex()}
          select={selectOutput}
        />
        <EventList {...output()} />
      </>
    )}
  </Show>
);
