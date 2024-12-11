import * as Vue from 'vue';

export const actorNames = Vue.ref(['', '']);

export interface Event {
  name: string;
  href: string;
}

export const events = Vue.ref<Event[]>();

export const loading = Vue.ref(false);

export const errorMessage = Vue.ref<string>();
