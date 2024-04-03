<template>
  <label class="input input-bordered flex items-center gap-2 my-3">
    出演者1
    <input
      v-model="store.actorNames[0]"
      type="text"
      class="grow"
      placeholder="本渡楓"
    />
  </label>
  <label class="input input-bordered flex items-center gap-2 my-3">
    出演者2
    <input
      v-model="store.actorNames[1]"
      type="text"
      class="grow"
      placeholder="桑原由気"
    />
  </label>
  <button
    @click="searchCoactingEvents"
    :disabled="store.loading"
    class="btn btn-primary"
  >
    検索
    <span v-show="store.loading" class="loading loading-spinner"></span>
  </button>
  <div v-if="store.error" role="alert" class="alert alert-error my-3">
    <span>{{ store.error.message }}</span>
  </div>
</template>

<script setup lang="ts">
import { intersectionWith } from "remeda";
import { store, type Event } from "./store";

const searchCoactingEvents = async () => {
  store.loading = true;
  store.error = undefined;
  try {
    const eventLists: Event[][] = await Promise.all(
      store.actorNames.map(async (actorName) => {
        const id = await searchActorId(actorName);
        const res = await fetch(`/actors/${id}/events?limit=10000`);
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
    store.events = eventLists.reduce((previous, current) =>
      intersectionWith(previous, current, (a, b) => a.href === b.href)
    );
  } catch (e) {
    console.error(e);
    store.error = e;
  } finally {
    store.loading = false;
  }
};

const searchActorId = async (name: string) => {
  const res = await fetch(`/actors/search?keyword=${name}`);
  const nodeList = new DOMParser()
    .parseFromString(await res.text(), "text/html")
    .querySelectorAll(
      "body > div.container > div > div.span8.page > ul > li > a"
    );
  const href = [...nodeList]
    .find((node) => node.textContent === name)
    ?.getAttribute("href");
  if (!href) {
    throw new Error(`出演者が見つかりません [${name}]`);
  }
  return parseInt(href.substring(href.lastIndexOf("/") + 1));
};
</script>
