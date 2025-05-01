import { createMutable } from 'solid-js/store';
import type { Result } from '../../../convex/appearanceStatics';

interface Store {
  result?: Result;
  loading: boolean;
  errorMessage: string;
}

export const store = createMutable<Store>({
  loading: false,
  errorMessage: '',
});
