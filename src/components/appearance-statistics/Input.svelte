<script lang="ts">
import { onMount } from 'svelte';
import { AREAS, DAYS, MONTHS, PREFECTURES, YEARS } from './const';
import { store } from './store.svelte';

const INPUT_DATA_KEY = 'appearanceStatistics.inputData';
let inputData = $state({
  keyword: '',
  year: '',
  month: '',
  day: '',
  areaId: '',
  prefectureId: '',
  isPrefectureMode: false,
});
const canNotSearch = $derived(
  Object.values(inputData)
    .filter((v) => typeof v === 'string')
    .every((v) => !v),
);

const saveInputData = () => {
  localStorage.setItem(INPUT_DATA_KEY, JSON.stringify(inputData));
};

onMount(() => {
  const storedInput = localStorage.getItem(INPUT_DATA_KEY);
  if (storedInput) {
    inputData = JSON.parse(storedInput);
  }
});
</script>

<form
  class="d-card p-2 gap-4"
  onsubmit={async (e) => {
    e.preventDefault();
    await store.search(new FormData(e.currentTarget));
  }}
>
  <input type="hidden" name="useCache" value="true" />

  <div class="max-w-lg">
    <fieldset class="d-fieldset">
      <legend class="d-fieldset-label">キーワード</legend>
      <input
        class="d-input w-full"
        type="text"
        name="keyword"
        aria-label="キーワード"
        placeholder="声優、アイドル、アーティスト名等"
        bind:value={inputData.keyword}
        onblur={() => {
          inputData.keyword = inputData.keyword.trim();
          saveInputData();
        }}
      />
    </fieldset>

    <fieldset class="d-fieldset">
      <legend class="d-fieldset-label">開催日</legend>
      <div class="d-join">
        <select
          class="d-join-item d-select"
          name="year"
          aria-label="年"
          bind:value={inputData.year}
          onblur={() => {
            saveInputData();
          }}
        >
          <option selected value="">
            {' - '}年
          </option>
          {#each YEARS as year}
            <option value={year}>{year}年</option>
          {/each}
        </select>
        <select
          class="d-join-item d-select"
          name="month"
          aria-label="月"
          bind:value={inputData.month}
          onblur={() => {
            saveInputData();
          }}
        >
          <option selected value="">
            {' - '}月
          </option>
          {#each MONTHS as month}
            <option value={month}>{month}月</option>
          {/each}
        </select>
        <select
          class="d-join-item d-select"
          name="day"
          aria-label="日"
          bind:value={inputData.day}
          onblur={() => {
            saveInputData();
          }}
        >
          <option selected value="">
            {' - '}日
          </option>
          {#each DAYS as day}
            <option value={day}>{day}日</option>
          {/each}
        </select>
      </div>
    </fieldset>

    <fieldset class="d-fieldset">
      <legend class="d-fieldset-label">開催地</legend>
      <div class="d-join">
        <label class="d-join-item d-swap d-input w-36">
          <input
            type="checkbox"
            name="isPrefectureMode"
            aria-label="都道府県モード"
            bind:checked={inputData.isPrefectureMode}
            onchange={() => {
              if (inputData.isPrefectureMode) {
                inputData.areaId = '';
              } else {
                inputData.prefectureId = '';
              }
              saveInputData();
            }}
          />
          <span class="d-swap-on">都道府県:</span>
          <span class="d-swap-off">地域:</span>
        </label>
        {#if inputData.isPrefectureMode}
          <select
            class="d-join-item d-select w-full"
            name="prefectureId"
            aria-label="都道府県"
            bind:value={inputData.prefectureId}
            onblur={() => {
              saveInputData();
            }}
          >
            <option selected value="">
              -
            </option>
            {#each PREFECTURES as prefecture}
              <option value={prefecture.id}>{prefecture.name}</option>
            {/each}
          </select>
        {:else}
          <select
            class="d-join-item d-select"
            name="areaId"
            aria-label="地域"
            bind:value={inputData.areaId}
            onblur={() => {
              saveInputData();
            }}
          >
            <option selected value="">
              -
            </option>
            {#each AREAS as area}
              <option value={area.id}>{area.name}</option>
            {/each}
          </select>
        {/if}
      </div>
    </fieldset>
  </div>

  <div class="d-card-actions">
    <button
      class="d-btn d-btn-primary"
      type="submit"
      disabled={store.loading || canNotSearch}
    >
      検索
      {#if store.loading}
        <span class="d-loading d-loading-spinner"></span>
      {/if}
    </button>
  </div>

  {#if store.error}
    {@const error = store.error}
    <div class="d-alert d-alert-error" role="alert">
      <span>
        {error.code !== 'INTERNAL_SERVER_ERROR' && error.message
          ? error.message
          : '予期せぬエラーが発生しました。'}
      </span>
    </div>
  {/if}
</form>
