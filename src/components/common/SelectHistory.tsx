import { Index } from 'solid-js';

export type SelectHistoryProps = {
  list: ReadonlyArray<string>;
  selectedIndex: number;
  select: (index: number) => void;
};

export const SelectHistory = (props: SelectHistoryProps) => (
  <div class="p-2">
    <label class="d-select w-full">
      <span class="d-label">結果履歴</span>
      <select
        value={props.selectedIndex}
        onInput={(e) => props.select(e.target.selectedIndex)}
      >
        <Index each={props.list}>
          {(item, index) => <option value={index}>{item()}</option>}
        </Index>
      </select>
    </label>
  </div>
);
