<template>
  <p v-if="store.events">
    {{ store.events.length }}件のイベントが見つかりました。
  </p>
  <ul>
    <li v-for="event in store.events">
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
