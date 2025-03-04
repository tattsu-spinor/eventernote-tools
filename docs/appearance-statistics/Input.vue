<template>
  <fieldset class="d-fieldset max-w-md">
    <label class="d-fieldset-label">キーワード</label>
    <input
      v-model="searchCondition.keyword"
      type="text"
      placeholder="声優、アイドル、アーティスト名等"
      class="d-input! w-full!"
    />

    <label class="d-fieldset-label">開催日</label>
    <div class="d-join">
      <select v-model="searchCondition.year" class="d-join-item d-select! w-full!">
        <option selected :value="undefined">{{ " - " }}年</option>
        <option v-for="n in yearValues" :value="n">{{ n }}年</option>
      </select>
      <select v-model="searchCondition.month" class="d-join-item d-select! w-full!">
        <option selected :value="undefined">{{ " - " }}月</option>
        <option v-for="n in 12" :value="n">{{ n }}月</option>
      </select>
      <select v-model="searchCondition.day" class="d-join-item d-select! w-full!">
        <option selected :value="undefined">{{ " - " }}日</option>
        <option v-for="n in 31" :value="n">{{ n }}日</option>
      </select>
    </div>

    <label class="d-fieldset-label">開催地</label>
    <div class="d-join w-full">
      <label class="d-join-item d-swap! d-input w-36">
        <input v-model="searchCondition.isPrefectureMode" type="checkbox" />
        <span class="d-swap-on">都道府県:</span>
        <span class="d-swap-off">地域:</span>
      </label>
      <select
        v-if="searchCondition.isPrefectureMode"
        v-model="searchCondition.prefectureId"
        class="d-join-item d-select! w-full!"
      >
        <option selected :value="undefined">-</option>
        <option
          v-for="prefecture in PREFECTURES"
          selected
          :value="prefecture.id.toString()"
        >
          {{ prefecture.name }}
        </option>
      </select>
      <select
        v-else
        v-model="searchCondition.areaId"
        class="d-join-item d-select! w-full!"
      >
        <option selected :value="undefined">-</option>
        <option v-for="area in AREAS" selected :value="area.id.toString()">
          {{ area.name }}
        </option>
      </select>
    </div>
  </fieldset>
  <div class="mt-3">
    <button
      @click="searchAppearanceStatistics"
      :disabled="loading || canNotSearch"
      class="d-btn! d-btn-primary"
    >
      検索
      <span v-if="loading" class="d-loading d-loading-spinner"></span>
    </button>
  </div>
  <div v-if="errorMessage" role="alert" class="d-alert d-alert-error my-3">
    <span>{{ errorMessage }}</span>
  </div>
</template>

<script setup lang="ts">
import { ConvexClient } from "convex/browser";
import { ConvexError } from "convex/values";
import { range } from "remeda";
import * as Vue from "vue";
import { api } from "../../convex/_generated/api";
import { AREAS, PREFECTURES } from "./const";
import {
  errorMessage,
  eventCount,
  loading,
  resultUrl,
  searchCondition,
  statistics,
} from "./store";

const yearValues = range(1980, new Date().getFullYear() + 2).reverse();
const searchUrl = Vue.computed(() => {
  const { keyword, year, month, day, areaId, prefectureId } =
    searchCondition.value;
  return `https://www.eventernote.com/events/search?keyword=${keyword}&year=${year ?? ""}&month=${month ?? ""}&day=${day ?? ""}&area_id=${areaId ?? ""}&prefecture_id=${prefectureId ?? ""}`;
});
const canNotSearch = Vue.computed(() => {
  const { keyword, year, month, day, areaId, prefectureId } =
    searchCondition.value;
  return [keyword, year, month, day, areaId, prefectureId].every((v) => !v);
});

const searchAppearanceStatistics = async () => {
  loading.value = true;
  errorMessage.value = undefined;
  new ConvexClient(import.meta.env.VITE_CONVEX_URL)
    .action(api.appearanceStatics.search, {
      searchUrl: searchUrl.value,
    })
    .then((result) => {
      resultUrl.value = result.searchUrl;
      eventCount.value = result.eventCount;
      statistics.value = result.statistics;
    })
    .catch((e) => {
      console.error(e);
      errorMessage.value =
        e instanceof ConvexError ? e.data : "予期せぬエラーが発生しました。";
    })
    .finally(() => {
      loading.value = false;
    });
};
</script>
