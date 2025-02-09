<template>
  <div v-for="(_, index) in actorNames">
    <input
      v-model="actorNames[index]"
      type="text"
      class="input! mt-3 w-full! max-w-md"
      :placeholder="'出演者' + (index + 1)"
    />
  </div>
  <div class="mt-3">
    <button
      @click="searchCoactingEvents"
      :disabled="loading || canNotSearch"
      class="btn! btn-primary"
    >
      検索
      <span v-if="loading" class="loading loading-spinner"></span>
    </button>
    <button
      @click="actorNames.push('')"
      :disabled="loading"
      class="btn! btn-secondary ml-3"
    >
      追加
    </button>
    <button
      @click="actorNames.pop()"
      :disabled="loading || actorNames.length <= 1"
      class="btn! btn-warning ml-3"
    >
      削除
    </button>
  </div>
  <div v-show="errorMessage" role="alert" class="alert alert-error mt-3">
    <span>{{ errorMessage }}</span>
  </div>
</template>

<script setup lang="ts">
import { ConvexClient } from "convex/browser";
import { ConvexError } from "convex/values";
import * as Vue from "vue";
import { api } from "../../convex/_generated/api";
import { events, actorNames, errorMessage, loading } from "./store";

const canNotSearch = Vue.computed(() => actorNames.value.some((v) => !v));
const searchCoactingEvents = () => {
  loading.value = true;
  errorMessage.value = undefined;
  new ConvexClient(import.meta.env.VITE_CONVEX_URL)
    .action(api.coactingEvents.search, {
      actorNames: actorNames.value,
    })
    .then((result) => {
      events.value = result;
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
