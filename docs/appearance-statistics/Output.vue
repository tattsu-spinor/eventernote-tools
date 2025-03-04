<template>
  <div v-if="eventCount && resultUrl">
    <span>{{ eventCount }}件のイベントを検索しました。</span>
    <a :href="resultUrl" target="_blank" rel="noopener noreferrer">検索結果</a>
  </div>
  <div class="overflow-x-auto">
    <table v-if="statistics" class="d-table! d-table-zebra! rounded-none!">
      <thead>
        <tr>
          <th></th>
          <th class="!text-center">出演者名</th>
          <th class="!text-right">出演数</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="([actorName, count], index) in statistics">
          <th class="!text-right">{{ index + 1 }}</th>
          <td class="!text-center">{{ actorName }}</td>
          <td class="!text-right">{{ count }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { eventCount, resultUrl, statistics } from './store';
</script>
