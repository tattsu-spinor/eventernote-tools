import { reactive } from "vue";

export const store = reactive({
  actorNames: ["", ""],
  events: undefined as Event[] | undefined,
  loading: false,
  error: undefined as Error | undefined,
});

export interface Event {
  name: string;
  href: string;
}
