import { createMutable } from 'solid-js/store';
import type { Event } from '../../../convex/coactingEvents';

type Store = {
  actorNames: string[];
  canNotSearch: boolean;
  loading: boolean;
  errorMessage: string;
  result?: {
    events: Event[];
  };
};

export const store = createMutable<Store>({
  actorNames: ['', ''] as string[],
  get canNotSearch() {
    return this.actorNames.some((v: string) => !v);
  },
  loading: false,
  errorMessage: '',
});
