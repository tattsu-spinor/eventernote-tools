<template>
  <p v-if="events">{{ events.length }}件のイベントが見つかりました。</p>
  <ul>
    <li v-for="event in events">
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
import { events } from './store';
</script>
