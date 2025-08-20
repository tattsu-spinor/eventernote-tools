import { ActionError, defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { ConvexError } from 'convex/values';
import { api } from '../../convex/_generated/api';
import { defaultErrorData, httpClient } from './index';

export type InputData = {
  searchUrl: string;
};

export type OutputData = {
  searchUrl: string;
  eventCount: number;
  statistics: [string, number][];
};

export const appearanceStatistics = defineAction({
  input: z.object({ searchUrl: z.string().url() }),
  handler: async ({ searchUrl }: InputData) => {
    try {
      return await httpClient.action(api.appearanceStatistics.search, {
        searchUrl,
      });
    } catch (error) {
      throw new ActionError(
        error instanceof ConvexError ? error.data : defaultErrorData,
      );
    }
  },
});
