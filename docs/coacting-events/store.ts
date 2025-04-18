import * as Vue from 'vue';
import type { Event } from '../../convex/coactingEvents';

export const actorNames = Vue.ref(['', '']);

export const events = Vue.ref<Event[]>();

export const loading = Vue.ref(false);

export const errorMessage = Vue.ref<string>();
