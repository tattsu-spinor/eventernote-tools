import { createSignal } from 'solid-js';
import type { Response } from '../../../convex/appearanceStatics';

export const [response, setResponse] = createSignal<Response>();
