<template>
  <p v-if="events">{{ events.length }}件のイベントが見つかりました。</p>
  <ul class="d-list">
    <li class="d-list-row" v-for="event in events">
      <div>
        <a
          :href="'https://www.eventernote.com' + event.href"
          target="_blank"
          rel="noopener noreferrer"
          >{{ event.name }}</a
        >
        <div class="text-xs">{{ event.date }}</div>
        <div class="text-xs">{{ event.place }}</div>
      </div>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { events } from './store';
</script>
