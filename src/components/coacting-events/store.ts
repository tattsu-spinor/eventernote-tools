import { createSignal } from 'solid-js';
import type { Response } from '../../../convex/coactingEvents';

export const [response, setResponse] = createSignal<Response>();
