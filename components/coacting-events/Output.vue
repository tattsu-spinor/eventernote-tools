<template>
  <p v-if="store.result">
    {{ store.result.length }}件のイベントが見つかりました。
  </p>
  <ul>
    <li v-for="event in store.result">
      <a
        :href="'https://www.eventernote.com' + event.href"
        target="_blank"
        rel="noopener noreferrer"
        >{{ event.name }}</a
      >
    </li>
  </ul>
</template>

<script setup lang="ts">
import { store } from "../../store/coacting-events";
</script>
