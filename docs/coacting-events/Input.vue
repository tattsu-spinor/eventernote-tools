<template>
  <div v-for="(_, index) in actorNames">
    <input
      v-model="actorNames[index]"
      type="text"
      class="input mt-3 w-full max-w-md"
      :placeholder="'出演者' + (index + 1)"
    />
  </div>
  <div class="mt-3">
    <button
      @click="searchCoactingEvents"
      :disabled="loading || canNotSearch"
      class="btn btn-primary"
    >
      検索
      <span v-show="loading" class="loading loading-spinner"></span>
    </button>
    <button
      @click="actorNames.push('')"
      :disabled="loading"
      class="btn btn-secondary ml-3"
    >
      追加
    </button>
    <button
      @click="actorNames.pop()"
      :disabled="loading || actorNames.length <= 1"
      class="btn btn-warning ml-3"
    >
      削除
    </button>
  </div>
  <div v-if="error" role="alert" class="alert alert-error mt-3">
    <span>{{ error.message }}</span>
  </div>
</template>

<script setup lang="ts">
import { intersectionWith } from "remeda";
import * as Vue from "vue";
import { actorNames, Event, events, loading, error } from "./store";

const canNotSearch = Vue.computed(() => actorNames.value.some((v) => !v));

const searchCoactingEvents = async () => {
  loading.value = true;
  error.value = undefined;
  try {
    const eventLists: Event[][] = await Promise.all(
      actorNames.value.map(async (actorName) => {
        const id = await searchActorId(actorName);
        const res = await fetch(`/actors/${id}/events?limit=1000`);
        if (res.status !== 200) {
          throw new Error(res.statusText);
        }
        const nodeList = new DOMParser()
          .parseFromString(await res.text(), "text/html")!
          .querySelectorAll(
            "body > div.container > div > div.span8.page > div.gb_event_list.clearfix > ul > li > div.event > h4 > a"
          );
        return [...nodeList].map((node) => ({
          name: node.textContent ?? "",
          href: node.getAttribute("href") ?? "",
        }));
      })
    );
    events.value = eventLists.reduce((previous, current) =>
      intersectionWith(previous, current, (a, b) => a.href === b.href)
    );
  } catch (e) {
    console.error(e);
    error.value = e;
  } finally {
    loading.value = false;
  }
};

const searchActorId = async (name: string) => {
  const res = await fetch(`/actors/search?keyword=${name}`);
  if (res.status !== 200) {
    throw new Error(res.statusText);
  }
  const nodeList = new DOMParser()
    .parseFromString(await res.text(), "text/html")
    .querySelectorAll(
      "body > div.container > div > div.span8.page > ul > li > a"
    );
  const href = [...nodeList]
    .find((node) => node.textContent === name)
    ?.getAttribute("href");
  if (!href) {
    throw new Error(`出演者が見つかりません: ${name}`);
  }
  return parseInt(href.substring(href.lastIndexOf("/") + 1));
};
</script>
