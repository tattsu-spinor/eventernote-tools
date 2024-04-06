<template>
  <div class="max-w-md">
    <input
      v-model="searchCondition.keyword"
      type="text"
      placeholder="キーワード"
      class="join-item input input-bordered w-full rounded-b-none"
    />
    <div class="join w-full">
      <select
        v-model="searchCondition.yaer"
        class="join-item select select-bordered w-full rounded-t-none rounded-b-none"
      >
        <option selected :value="undefined">{{ " - " }}年</option>
        <option v-for="n in yearValues" :value="n">{{ n }}年</option>
      </select>
      <select
        v-model="searchCondition.month"
        class="join-item select select-bordered w-full rounded-t-none rounded-b-none"
      >
        <option selected :value="undefined">{{ " - " }}月</option>
        <option v-for="n in 12" :value="n">{{ n }}月</option>
      </select>
      <select
        v-model="searchCondition.day"
        class="join-item select select-bordered w-full rounded-t-none rounded-b-none"
      >
        <option selected :value="undefined">{{ " - " }}日</option>
        <option v-for="n in 31" :value="n">{{ n }}日</option>
      </select>
    </div>
    <div class="join w-full">
      <label class="join-item swap input w-36 rounded-t-none">
        <input v-model="searchCondition.isPrefectureMode" type="checkbox" />
        <div class="swap-on">都道府県:</div>
        <div class="swap-off">地域:</div>
      </label>
      <select
        v-if="searchCondition.isPrefectureMode"
        v-model="searchCondition.prefectureId"
        class="join-item select w-full rounded-t-none"
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
        class="join-item select w-full rounded-t-none"
      >
        <option selected :value="undefined">-</option>
        <option v-for="area in AREAS" selected :value="area.id.toString()">
          {{ area.name }}
        </option>
      </select>
    </div>
  </div>
  <div class="mt-3">
    <button
      @click="searchAppearanceStatistics"
      :disabled="loading || canNotSearch"
      class="btn btn-primary"
    >
      検索
      <span v-show="loading" class="loading loading-spinner"></span>
    </button>
  </div>
  <div v-if="error" role="alert" class="alert alert-error my-3">
    <span>{{ error.message }}</span>
  </div>
</template>

<script setup lang="ts">
import { range } from "remeda";
import * as Vue from "vue";
import { AREAS, PREFECTURES } from "./const";
import {
  searchCondition,
  resultUrl,
  eventCount,
  statistics,
  loading,
  error,
} from "./store";

const yearValues = range(1980, new Date().getFullYear() + 1).toReversed();
const searchUrl = Vue.computed(() => {
  const { keyword, yaer, month, day, areaId, prefectureId } =
    searchCondition.value;
  return `/events/search
    ?keyword=${keyword}
    &year=${yaer ?? ""}
    &month=${month ?? ""}
    &day=${day ?? ""}
    &area_id=${areaId ?? ""}
    &prefecture_id=${prefectureId ?? ""}`.replace(/\s+/g, "");
});
const canNotSearch = Vue.computed(() => {
  const { keyword, yaer, month, day, areaId, prefectureId } =
    searchCondition.value;
  return [keyword, yaer, month, day, areaId, prefectureId].every((v) => !v);
});

const searchAppearanceStatistics = async () => {
  loading.value = true;
  error.value = undefined;
  try {
    const res = await fetch(searchUrl.value);
    if (!res.ok) {
      throw new Error(res.statusText);
    }
    const document = new DOMParser().parseFromString(
      await res.text(),
      "text/html"
    );
    const eventCountString = document.querySelector(
      "body > div.container > div > div.span8.page > p:nth-child(4)"
    )!.textContent!;
    const count = parseInt(
      eventCountString.substring(0, eventCountString.indexOf("件"))
    );
    if (count > 10000) {
      throw new Error(`イベント数が1万件を超えています: ${count}件`);
    }

    const actorList = await Promise.all(
      range(1, 1 + count / 100).map(async (page) => {
        const res = await fetch(searchUrl.value + `&limit=100&page=${page}`);
        if (!res.ok) {
          throw new Error(res.statusText);
        }
        const document = new DOMParser().parseFromString(
          await res.text(),
          "text/html"
        );
        const nodeList = document.querySelectorAll(
          "body > div.container > div > div.span8.page > div.gb_event_list.clearfix > ul > li > div.event > div.actor > ul > li > a"
        );
        return [...nodeList].map((node) => node.textContent!);
      })
    );
    const map = new Map<string, number>();
    actorList.flat().forEach((actorName) => {
      const count = map.get(actorName) ?? 0;
      map.set(actorName, count + 1);
    });

    resultUrl.value = `https://www.eventernote.com${searchUrl.value}`;
    eventCount.value = count;
    statistics.value = Array.from(map)
      .toSorted((a, b) => b[1] - a[1])
      .slice(0, 1000);
  } catch (e) {
    console.error(e);
    error.value = e;
  } finally {
    loading.value = false;
  }
};
</script>
