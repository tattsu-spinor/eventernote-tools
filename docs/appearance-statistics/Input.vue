<template>
  <div>
    <input
      v-model="store.searchCondition.keyword"
      type="text"
      placeholder="キーワード"
      class="input input-bordered w-full max-w-xs"
    />
  </div>
  <div class="join w-full max-w-xs mt-3">
    <select
      v-model="store.searchCondition.yaer"
      class="select select-bordered join-item"
    >
      <option selected value>&nbsp;-&nbsp;年</option>
      <option v-for="n in yearValues" :value="n">{{ n }}年</option>
    </select>
    <select
      v-model="store.searchCondition.month"
      class="select select-bordered join-item"
    >
      <option selected value>&nbsp;-&nbsp;月</option>
      <option v-for="n in 12" :value="n">{{ n }}月</option>
    </select>
    <select
      v-model="store.searchCondition.day"
      class="select select-bordered join-item"
    >
      <option selected value>&nbsp;-&nbsp;日</option>
      <option v-for="n in 31" :value="n">{{ n }}日</option>
    </select>
  </div>
  <div class="mt-3">
    <button
      @click="searchAppearanceStatistics"
      :disabled="store.loading"
      class="btn btn-primary"
    >
      検索
      <span v-show="store.loading" class="loading loading-spinner"></span>
    </button>
  </div>
  <div v-if="store.error" role="alert" class="alert alert-error my-3">
    <span>{{ store.error.message }}</span>
  </div>
</template>

<script setup lang="ts">
import { pipe, range, reverse, sort } from "remeda";
import { store } from "./store";

const yearValues = pipe(1980, range(new Date().getFullYear() + 1), reverse);

const searchAppearanceStatistics = async () => {
  store.loading = true;
  store.error = undefined;
  try {
    const { keyword, yaer, month, day, areaId, prefectureId } =
      store.searchCondition;
    const path = `/events/search?keyword=${keyword}&year=${yaer}&month=${month}&day=${day}&area_id=${areaId}&prefecture_id=${prefectureId}&limit=1000`;
    const res = await fetch(path);
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
    const eventCount = parseInt(
      eventCountString.substring(0, eventCountString.indexOf("件"))
    );
    const nodeList = document.querySelectorAll(
      "body > div.container > div > div.span8.page > div.gb_event_list.clearfix > ul > li > div.event > div.actor > ul > li > a"
    );
    const statistics = new Map<string, number>();
    nodeList.forEach((node) => {
      const actorName = node.textContent!;
      const count = statistics.get(actorName) ?? 0;
      statistics.set(actorName, count + 1);
    });

    store.searchUrl = `https://www.eventernote.com${path}`;
    store.statistics = pipe(
      Array.from(statistics),
      sort((a, b) => b[1] - a[1])
    );
    store.eventCount = Math.min(eventCount, 1000);
  } catch (e) {
    console.error(e);
    store.error = e;
  } finally {
    store.loading = false;
  }
};
</script>
