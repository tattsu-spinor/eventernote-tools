import { navigate } from 'astro:transitions/client';
import { ScanSearchIcon } from 'lucide-solid';
import { createSignal, For, Match, Show, Switch } from 'solid-js';
import type { OutputData } from '../../actions/attendanceStatistics';
import { searchFromStatistics } from '../attended-events/store';
import { ClipboardCopy } from '../common/ClipboardCopy';
import { Pagination } from '../common/Pagination';
import { usePagination } from '../common/usePagination';
import { useOutputStore } from './store';

export const Output = () => {
  const outputStore = useOutputStore();

  return (
    <Show when={outputStore.data}>
      {(output) => <OutputContent {...output()} />}
    </Show>
  );
};

const OutputContent = (output: OutputData) => {
  const [tab, setTab] = createSignal<'actor' | 'place'>('actor');
  const {
    paginationProps: actorPaginationProps,
    pagedItems: pagedActorCounts,
  } = usePagination(() => output.actorCounts);
  const {
    paginationProps: placePaginationProps,
    pagedItems: pagedPlaceCounts,
  } = usePagination(() => output.placeCounts);

  return (
    <>
      <div role="tablist" class="d-tabs d-tabs-border">
        <button
          type="button"
          role="tab"
          classList={{ 'd-tab': true, 'd-tab-active': tab() === 'actor' }}
          onClick={() => {
            setTab('actor');
          }}
        >
          出演者
        </button>
        <button
          type="button"
          role="tab"
          classList={{ 'd-tab': true, 'd-tab-active': tab() === 'place' }}
          onClick={() => {
            setTab('place');
          }}
        >
          会場
        </button>
      </div>
      <div class="flex justify-end">
        <ClipboardCopy
          getText={() =>
            (tab() === 'actor' ? output.actorCounts : output.placeCounts)
              .map((data) => data.join(','))
              .join('\n')
          }
        />
      </div>
      <Switch>
        <Match when={tab() === 'actor'}>
          <Pagination {...actorPaginationProps()} />
          <div class="overflow-x-auto">
            <table class="d-table">
              <thead>
                <tr>
                  <th />
                  <th class="text-center">出演者名</th>
                  <th class="text-right">参加数</th>
                  <th class="text-center">検索</th>
                </tr>
              </thead>
              <tbody>
                <For each={pagedActorCounts()}>
                  {({ item: [actorName, count], index }) => (
                    <tr>
                      <th>{index + 1}</th>
                      <td class="text-center">{actorName}</td>
                      <td class="text-right">{count}</td>
                      <td class="text-center w-16">
                        <button
                          type="button"
                          class="d-btn d-btn-ghost d-btn-sm d-btn-square"
                        >
                          <ScanSearchIcon
                            size={20}
                            onClick={async () => {
                              await navigate('/attended-events/');
                              await searchFromStatistics({
                                userId: output.userId,
                                actorName,
                                placeName: '',
                              });
                            }}
                          />
                        </button>
                      </td>
                    </tr>
                  )}
                </For>
              </tbody>
            </table>
          </div>
          <Pagination {...actorPaginationProps()} />
        </Match>
        <Match when={tab() === 'place'}>
          <Pagination {...placePaginationProps()} />
          <div class="overflow-x-auto">
            <table class="d-table">
              <thead>
                <tr>
                  <th />
                  <th class="text-center">会場名</th>
                  <th class="text-right">参加数</th>
                  <td class="text-center">検索</td>
                </tr>
              </thead>
              <tbody>
                <For each={pagedPlaceCounts()}>
                  {({ item: [placeName, count], index }) => (
                    <tr>
                      <th scope="row">{index + 1}</th>
                      <td class="text-center">{placeName}</td>
                      <td class="text-right">{count}</td>
                      <td class="text-center w-16">
                        <button
                          type="button"
                          class="d-btn d-btn-ghost d-btn-sm d-btn-square"
                        >
                          <ScanSearchIcon
                            size={20}
                            onClick={async () => {
                              await navigate('/attended-events/');
                              await searchFromStatistics({
                                userId: output.userId,
                                actorName: '',
                                placeName,
                              });
                            }}
                          />
                        </button>
                      </td>
                    </tr>
                  )}
                </For>
              </tbody>
            </table>
          </div>
          <Pagination {...placePaginationProps()} />
        </Match>
      </Switch>
    </>
  );
};
