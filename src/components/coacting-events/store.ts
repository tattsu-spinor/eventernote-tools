import { createMutable } from 'solid-js/store';
import type { Result } from '../../../convex/coactingEvents';

type Store = {
  result?: Result;
  loading: boolean;
  errorMessage: string;
};

export const store = createMutable<Store>({
  loading: false,
  errorMessage: '',
});
