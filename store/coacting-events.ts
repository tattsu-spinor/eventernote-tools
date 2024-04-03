import { reactive } from "vue";

export const store = reactive({
  result: undefined as Event[] | undefined,
});

export interface Event {
  name: string | null;
  href: string | null;
}
