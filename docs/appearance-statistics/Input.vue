<template>
  <div>
    <input
      v-model="searchCondition.keyword"
      type="text"
      placeholder="キーワード"
      class="input input-bordered w-full max-w-xs"
    />
  </div>
  <div class="join w-full max-w-xs mt-3">
    <select
      v-model="searchCondition.yaer"
      class="select select-bordered join-item"
    >
      <option selected value>&nbsp;-&nbsp;年</option>
      <option v-for="n in yearValues" :value="n">{{ n }}年</option>
    </select>
    <select
      v-model="searchCondition.month"
      class="select select-bordered join-item"
    >
      <option selected value>&nbsp;-&nbsp;月</option>
      <option v-for="n in 12" :value="n">{{ n }}月</option>
    </select>
    <select
      v-model="searchCondition.day"
      class="select select-bordered join-item"
    >
      <option selected value>&nbsp;-&nbsp;日</option>
      <option v-for="n in 31" :value="n">{{ n }}日</option>
    </select>
  </div>
  <div class="mt-3">
    <button
      @click="searchAppearanceStatistics"
      :disabled="loading"
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
import { pipe, range, reverse, sort } from "remeda";
import {
  searchCondition,
  searchUrl,
  resultUrl,
  eventCount,
  statistics,
  loading,
  error,
} from "./store";

const yearValues = pipe(1980, range(new Date().getFullYear() + 1), reverse);

const searchAppearanceStatistics = async () => {
  loading.value = true;
  error.value = undefined;
  try {
    const res = await fetch(searchUrl.value);
    if (res.status !== 200) {
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
    const nodeList = document.querySelectorAll(
      "body > div.container > div > div.span8.page > div.gb_event_list.clearfix > ul > li > div.event > div.actor > ul > li > a"
    );
    const map = new Map<string, number>();
    nodeList.forEach((node) => {
      const actorName = node.textContent!;
      const count = map.get(actorName) ?? 0;
      map.set(actorName, count + 1);
    });

    resultUrl.value = `https://www.eventernote.com${searchUrl.value}`;
    statistics.value = pipe(
      Array.from(map),
      sort((a, b) => b[1] - a[1])
    );
    eventCount.value = Math.min(count, 1000);
  } catch (e) {
    console.error(e);
    error.value = e;
  } finally {
    loading.value = false;
  }
};
</script>
