import { ActionError, defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { ConvexError } from 'convex/values';
import { api } from '../../convex/_generated/api';
import { defaultErrorData, httpClient } from './index';

export type InputData = {
  actorNames: string[];
};

export type OutputData = {
  events: Event[];
};

type Event = {
  name: string;
  href: string;
  date: string;
  place: string;
};

export const coactingEvents = defineAction({
  input: z.object({ actorNames: z.array(z.string()) }),
  handler: async ({ actorNames }: InputData) => {
    try {
      return await httpClient.action(api.coactingEvents.search, {
        actorNames,
      });
    } catch (error) {
      throw new ActionError(
        error instanceof ConvexError ? error.data : defaultErrorData,
      );
    }
  },
});
