import { reactive } from "vue";

export const store = reactive({
  actorNames: ["", ""],
  events: undefined as Event[] | undefined,
  loading: false,
});

export interface Event {
  name: string | null;
  href: string | null;
}
