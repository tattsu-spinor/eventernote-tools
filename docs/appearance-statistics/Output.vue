<template>
  <div v-if="store.eventCount">
    <span>{{ store.eventCount }}件のイベントを検索しました。</span>
    <a :href="store.searchUrl" target="_blank" rel="noopener noreferrer">
      検索結果
    </a>
  </div>
  <div class="overflow-x-auto">
    <table v-if="store.statistics" class="table table-md table-pin-rows">
      <thead>
        <tr>
          <th></th>
          <th>出演者名</th>
          <th>出演数</th>
        </tr>
      </thead>
      <tbody v-for="([actorName, count], index) in store.statistics">
        <tr>
          <th>{{ index + 1 }}</th>
          <td>{{ actorName }}</td>
          <td>{{ count }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { store } from "./store";

const { keyword, yaer, month, day, areaId, prefectureId } =
  store.searchCondition;
</script>
