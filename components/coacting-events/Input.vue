<template>
  <label class="input input-bordered flex items-center gap-2 my-3">
    出演者1
    <input v-model="actor1" type="text" class="grow" placeholder="13319" />
  </label>
  <label class="input input-bordered flex items-center gap-2 my-3">
    出演者2
    <input v-model="actor2" type="text" class="grow" placeholder="51274" />
  </label>
  <button @click="search" class="btn btn-primary">
    検索
    <span v-show="loading" class="loading loading-spinner"></span>
  </button>
</template>

<script setup lang="ts">
import { intersectionWith } from "remeda";
import { store, type Event } from "../../store/coacting-events";

const actor1 = defineModel<number>("actor1", { default: 13319 });
const actor2 = defineModel<number>("actor2", { default: 3684 });
const loading = defineModel<boolean>("loading");

const search = async () => {
  loading.value = true;
  const eventLists: Event[][] = await Promise.all(
    [actor1.value, actor2.value].map(async (id) => {
      const res = await fetch(`/actors/${id}/events?limit=10000`);
      const nodeList = new DOMParser()
        .parseFromString(await res.text(), "text/html")!
        .querySelectorAll(
          "body > div.container > div > div.span8.page > div.gb_event_list.clearfix > ul > li > div.event > h4 > a"
        );
      return [...nodeList].map((node) => ({
        name: node.textContent,
        href: node.getAttribute("href"),
      }));
    })
  );
  const result = eventLists.reduce((previous, current) =>
    intersectionWith(previous, current, (a, b) => a.href === b.href)
  );
  store.result = result;
  loading.value = false;
};
</script>
