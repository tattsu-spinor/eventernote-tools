import { For, Match, Show, Switch } from 'solid-js';
import { AREAS, DAYS, MONTHS, PREFECTURES, YEARS } from './const';
import { search, setInputStore, useInputStore, useOutputStore } from './store';

export const Input = () => {
  const inputStore = useInputStore();
  const outputStore = useOutputStore();
  const canNotSearch = () =>
    Object.values(inputStore)
      .filter((v) => typeof v === 'string')
      .every((v) => !v);

  return (
    <>
      <fieldset class="d-fieldset max-w-xs sm:max-w-sm md:max-w-md">
        <span class="d-fieldset-label">キーワード</span>
        <input
          name="keyword"
          type="text"
          value={inputStore.keyword}
          onInput={(e) => {
            setInputStore('keyword', e.target.value);
          }}
          placeholder="声優、アイドル、アーティスト名等"
          class="d-input w-full"
        />

        <span class="d-fieldset-label">開催日</span>
        <div class="d-join w-full">
          <select
            name="year"
            value={inputStore.year}
            onInput={(e) => {
              setInputStore('year', e.target.value);
            }}
            class="d-join-item d-select"
          >
            <option selected value="">
              {' - '}年
            </option>
            <For each={YEARS}>{(n) => <option value={n}>{n}年</option>}</For>
          </select>
          <select
            name="month"
            value={inputStore.month}
            onInput={(e) => {
              setInputStore('month', e.target.value);
            }}
            class="d-join-item d-select"
          >
            <option selected value="">
              {' - '}月
            </option>
            <For each={MONTHS}>{(n) => <option value={n}>{n}月</option>}</For>
          </select>
          <select
            name="day"
            value={inputStore.day}
            onInput={(e) => {
              setInputStore('day', e.target.value);
            }}
            class="d-join-item d-select"
          >
            <option selected value="">
              {' - '}日
            </option>
            <For each={DAYS}>{(n) => <option value={n}>{n}日</option>}</For>
          </select>
        </div>

        <span class="d-fieldset-label">開催地</span>
        <div class="d-join">
          <label class="d-join-item d-swap d-input w-36">
            <input
              name="isPrefectureMode"
              type="checkbox"
              checked={inputStore.isPrefectureMode}
              onInput={(e) => {
                const isPrefectureMode = e.target.checked;
                setInputStore('isPrefectureMode', isPrefectureMode);
                isPrefectureMode
                  ? setInputStore('areaId', '')
                  : setInputStore('prefectureId', '');
              }}
            />
            <span class="d-swap-on">都道府県:</span>
            <span class="d-swap-off">地域:</span>
          </label>
          <Switch>
            <Match when={inputStore.isPrefectureMode}>
              <select
                name="prefectureId"
                value={inputStore.prefectureId}
                onInput={(e) => {
                  setInputStore('prefectureId', e.target.value);
                }}
                class="d-join-item d-select w-full"
              >
                <option selected value="">
                  -
                </option>
                <For each={PREFECTURES}>
                  {(prefecture) => (
                    <option value={prefecture.id}>{prefecture.name}</option>
                  )}
                </For>
              </select>
            </Match>
            <Match when={true}>
              <select
                name="areaId"
                value={inputStore.areaId}
                onInput={(e) => {
                  setInputStore('areaId', e.target.value);
                }}
                class="d-join-item d-select w-full"
              >
                <option selected value="">
                  -
                </option>
                <For each={AREAS}>
                  {(area) => <option value={area.id}>{area.name}</option>}
                </For>
              </select>
            </Match>
          </Switch>
        </div>

        <div class="mt-3">
          <button
            type="button"
            onClick={search}
            disabled={outputStore.loading || canNotSearch()}
            class="d-btn d-btn-primary"
          >
            検索
            <Show when={outputStore.loading}>
              <span class="d-loading d-loading-spinner" />
            </Show>
          </button>
        </div>
      </fieldset>

      <Show when={outputStore.error} keyed>
        {(error) => (
          <div role="alert" class="d-alert d-alert-error my-3">
            <span>{error.message || '予期せぬエラーが発生しました。'}</span>
          </div>
        )}
      </Show>
    </>
  );
};
