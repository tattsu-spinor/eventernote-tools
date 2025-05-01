import { createMutable } from 'solid-js/store';
import type { Response } from '../../../convex/coactingEvents';

type Store = {
  response?: Response;
  loading: boolean;
  errorMessage: string;
};

export const store = createMutable<Store>({
  loading: false,
  errorMessage: '',
});
