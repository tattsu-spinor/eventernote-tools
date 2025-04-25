import { createMutable } from 'solid-js/store';
import type { Result } from '../../../convex/coactingEvents';

type Store = {
  actorNames: string[];
  canNotSearch: boolean;
  loading: boolean;
  errorMessage: string;
  result?: Result;
};

export const store = createMutable<Store>({
  actorNames: ['', ''] as string[],
  get canNotSearch() {
    return this.actorNames.some((v: string) => !v);
  },
  loading: false,
  errorMessage: '',
});
