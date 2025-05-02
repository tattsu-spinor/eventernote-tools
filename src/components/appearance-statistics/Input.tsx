import { ConvexHttpClient } from 'convex/browser';
import { ConvexError } from 'convex/values';
import { range } from 'remeda';
import {
  For,
  Match,
  Show,
  Switch,
  createEffect,
  createResource,
  createSignal,
} from 'solid-js';
import { createStore } from 'solid-js/store';
import { api } from '../../../convex/_generated/api';
import type { Request } from '../../../convex/appearanceStatics';
import { AREAS, PREFECTURES } from './const';
import { setResponse } from './store';

export const Input = () => {
  const [searchCondition, setSearchCondition] = createStore({
    keyword: '',
    year: '',
    month: '',
    day: '',
    areaId: '',
    prefectureId: '',
    isPrefectureMode: false,
  });
  const searchUrl = () => {
    const { keyword, year, month, day, areaId, prefectureId } = searchCondition;
    return `https://www.eventernote.com/events/search?keyword=${keyword}&year=${year}&month=${month}&day=${day}&area_id=${areaId}&prefecture_id=${prefectureId}`;
  };
  const canNotSearch = () => {
    const { keyword, year, month, day, areaId, prefectureId } = searchCondition;
    return [keyword, year, month, day, areaId, prefectureId].every((v) => !v);
  };

  const client = new ConvexHttpClient(import.meta.env.PUBLIC_CONVEX_URL);
  const [request, setRequest] = createSignal<Request>();
  const [responseResource] = createResource(request, (request) =>
    client.action(api.appearanceStatics.search, request),
  );

  createEffect(() => {
    if (searchCondition.isPrefectureMode) {
      setSearchCondition('areaId', '');
    } else {
      setSearchCondition('prefectureId', '');
    }
    setResponse(responseResource.latest);
  });

  return (
    <>
      <fieldset class="d-fieldset max-w-md">
        <div class="d-fieldset-label">キーワード</div>
        <input
          name="keyword"
          type="text"
          value={searchCondition.keyword}
          onInput={(e) => {
            setSearchCondition('keyword', e.target.value);
          }}
          placeholder="声優、アイドル、アーティスト名等"
          class="d-input w-full"
        />

        <div class="d-fieldset-label">開催日</div>
        <div class="d-join">
          <select
            name="year"
            value={searchCondition.year}
            onInput={(e) => {
              setSearchCondition('year', e.target.value);
            }}
            class="d-join-item d-select w-full"
          >
            <option selected value="">
              {' - '}年
            </option>
            <For each={range(1980, new Date().getFullYear() + 2).reverse()}>
              {(n) => <option value={n}>{n}年</option>}
            </For>
          </select>
          <select
            name="month"
            value={searchCondition.month}
            onInput={(e) => {
              setSearchCondition('month', e.target.value);
            }}
            class="d-join-item d-select w-full"
          >
            <option selected value="">
              {' - '}月
            </option>
            <For each={range(1, 12)}>
              {(n) => <option value={n}>{n}月</option>}
            </For>
          </select>
          <select
            name="day"
            value={searchCondition.day}
            onInput={(e) => {
              setSearchCondition('day', e.target.value);
            }}
            class="d-join-item d-select w-full"
          >
            <option selected value="">
              {' - '}日
            </option>
            <For each={range(1, 31)}>
              {(n) => <option value={n}>{n}日</option>}
            </For>
          </select>
        </div>

        <div class="d-fieldset-label">開催地</div>
        <div class="d-join w-full">
          <label class="d-join-item d-swap d-input w-36">
            <input
              name="isPrefectureMode"
              type="checkbox"
              checked={searchCondition.isPrefectureMode}
              onInput={(e) => {
                setSearchCondition('isPrefectureMode', e.target.checked);
              }}
            />
            <span class="d-swap-on">都道府県:</span>
            <span class="d-swap-off">地域:</span>
          </label>
          <Switch>
            <Match when={searchCondition.isPrefectureMode}>
              <select
                name="prefectureId"
                value={searchCondition.prefectureId}
                onInput={(e) => {
                  setSearchCondition('prefectureId', e.target.value);
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
                value={searchCondition.areaId}
                onInput={(e) => {
                  setSearchCondition('areaId', e.target.value);
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
            onClick={() => setRequest({ searchUrl: searchUrl() })}
            disabled={responseResource.loading || canNotSearch()}
            class="d-btn d-btn-primary"
          >
            検索
            <Show when={responseResource.loading}>
              <span class="d-loading d-loading-spinner" />
            </Show>
          </button>
        </div>
      </fieldset>
      <Show when={responseResource.error} keyed>
        {(error) => (
          <div role="alert" class="d-alert d-alert-error my-3">
            <span>
              {error instanceof ConvexError
                ? error.data
                : '予期せぬエラーが発生しました。'}
            </span>
          </div>
        )}
      </Show>
    </>
  );
};
