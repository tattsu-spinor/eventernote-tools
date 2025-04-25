import { ConvexHttpClient } from 'convex/browser';
import { ConvexError } from 'convex/values';
import { range } from 'remeda';
import { For, Match, Show, Switch } from 'solid-js';
import { api } from '../../../convex/_generated/api';
import { AREAS, PREFECTURES } from './const';
import { store } from './store';

export const Input = () => {
  const searchAppearanceStatistics = async () => {
    store.loading = true;
    store.errorMessage = '';
    new ConvexHttpClient(import.meta.env.PUBLIC_CONVEX_URL)
      .action(api.appearanceStatics.search, {
        searchUrl: store.searchUrl,
      })
      .then((result) => {
        store.result = result;
      })
      .catch((e) => {
        console.error(e);
        store.errorMessage =
          e instanceof ConvexError ? e.data : '予期せぬエラーが発生しました。';
      })
      .finally(() => {
        store.loading = false;
      });
  };

  return (
    <>
      <fieldset class="d-fieldset max-w-md">
        <label for="keyword" class="d-fieldset-label">
          キーワード
        </label>
        <input
          id="keyword"
          value={store.searchCondition.keyword}
          onInput={(e) => {
            store.searchCondition.keyword = e.target.value;
          }}
          type="text"
          placeholder="声優、アイドル、アーティスト名等"
          class="d-input w-full"
        />

        <label for="date" class="d-fieldset-label">
          開催日
        </label>
        <div id="date" class="d-join">
          <select
            value={store.searchCondition.year}
            onInput={(e) => {
              store.searchCondition.year = e.target.value;
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
            value={store.searchCondition.month}
            onInput={(e) => {
              store.searchCondition.month = e.target.value;
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
            value={store.searchCondition.day}
            onInput={(e) => {
              store.searchCondition.day = e.target.value;
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

        <label for="location" class="d-fieldset-label">
          開催地
        </label>
        <div id="location" class="d-join w-full">
          <label class="d-join-item d-swap d-input w-36">
            <input
              checked={store.searchCondition.isPrefectureMode}
              onInput={(e) => {
                store.searchCondition.isPrefectureMode = e.target.checked;
              }}
              type="checkbox"
            />
            <span class="d-swap-on">都道府県:</span>
            <span class="d-swap-off">地域:</span>
          </label>
          <Switch>
            <Match when={store.searchCondition.isPrefectureMode}>
              <select
                value={store.searchCondition.prefectureId}
                onInput={(e) => {
                  store.searchCondition.prefectureId = e.target.value;
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
                value={store.searchCondition.areaId}
                onInput={(e) => {
                  store.searchCondition.areaId = e.target.value;
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
            onClick={searchAppearanceStatistics}
            disabled={store.loading || store.canNotSearch}
            class="d-btn d-btn-primary"
          >
            検索
            <Show when={store.loading}>
              <span class="d-loading d-loading-spinner" />
            </Show>
          </button>
        </div>
      </fieldset>
      <Show when={store.errorMessage}>
        <div role="alert" class="d-alert d-alert-error my-3">
          <span>{store.errorMessage}</span>
        </div>
      </Show>
    </>
  );
};
