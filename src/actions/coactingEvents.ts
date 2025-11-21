import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { intersectionBy, omit } from 'es-toolkit';
import type { Event } from '../types/event';
import { searchActorEventList } from './utils/searchUtil';

export type InputData = {
  actorNames: ReadonlyArray<string>;
};

export type OutputData = {
  readonly searchName: string;
  readonly events: ReadonlyArray<Event>;
};

export const coactingEvents = defineAction({
  input: z.object({
    actorNames: z.array(z.string().trim()).readonly(),
  }),
  handler: async ({ actorNames }: InputData, context) => {
    const session = context.session;
    const eventLists = await Promise.all(
      actorNames
        .values()
        .map((actorName) => searchActorEventList(actorName, session)),
    );
    return {
      searchName: JSON.stringify(actorNames, null, 1),
      events: eventLists
        .reduce((previous, current) =>
          intersectionBy(previous, current, (event) => event.href),
        )
        .map((event) => omit(event, ['actors']) as Event),
    } as OutputData;
  },
});
