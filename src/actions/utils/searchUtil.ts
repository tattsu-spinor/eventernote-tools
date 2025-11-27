import { ActionError } from 'astro:actions';
import type { AstroSession } from 'astro';
import { mapAsync, range } from 'es-toolkit';
import { parseHTML } from 'linkedom';
import type { EventWithActors } from '../../types/event';

/**
 * 指定された出演者のイベント一覧を検索します。
 */
export const searchActorEventList = async (
  actorName: string,
  useCache: boolean,
  session?: AstroSession,
) => {
  const cacheKey = `${searchActorEventList.name}:${actorName}`;
  const cachedEventList = useCache
    ? await session?.get<EventWithActors[]>(cacheKey)
    : undefined;
  if (cachedEventList) {
    console.log(`cache hit:`, cacheKey);
    return cachedEventList;
  }
  const actorId = await searchActorId(actorName);
  const eventList = await searchEventListCore(
    `https://www.eventernote.com/actors/${actorId}/events?limit=10000`,
    `出演者が見つかりません: "${actorName}"`,
  );
  session?.set(cacheKey, eventList);
  return eventList;
};

/**
 * 指定されたユーザーのイベント一覧を検索します。
 */
export const searchUserEventList = async (
  userId: string,
  useCache: boolean,
  session?: AstroSession,
) => {
  const cacheKey = `${searchUserEventList.name}:${userId}`;
  const cachedEventList = useCache
    ? await session?.get<EventWithActors[]>(cacheKey)
    : undefined;
  if (cachedEventList) {
    console.log(`cache hit:`, cacheKey);
    return cachedEventList;
  }
  const eventList = await searchEventListCore(
    `https://www.eventernote.com/users/${userId}/events?limit=10000`,
    `ユーザーが見つかりません: "${userId}"`,
  );
  session?.set(cacheKey, eventList);
  return eventList;
};

/**
 * 指定された検索条件でイベント一覧を検索します。
 */
export const searchSpecificEventList = async (
  searchUrl: string,
  useCache: boolean,
  session?: AstroSession,
) => {
  const cacheKey = `${searchSpecificEventList.name}:${searchUrl}`;
  const cachedEventList = useCache
    ? await session?.get<EventWithActors[]>(cacheKey)
    : undefined;
  if (cachedEventList) {
    console.log(`cache hit:`, cacheKey);
    return cachedEventList;
  }
  const eventCount = await searchSpecificEventCount(searchUrl);
  if (eventCount > 10000) {
    throw new ActionError({
      code: 'BAD_REQUEST',
      message: `イベント数が1万件を超えています: ${eventCount}件`,
    });
  }
  const limit = 100;
  const eventLists = await mapAsync(range(eventCount / limit), (page) =>
    searchEventListCore(`${searchUrl}&limit=${limit}&page=${page + 1}`),
  );
  const eventList = eventLists.flat();
  session?.set(cacheKey, eventList);
  return eventList;
};

const searchEventListCore = async (
  url: string,
  notFoundErrorMessage?: string,
) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw notFoundErrorMessage && response.status === 404
      ? new ActionError({
          code: 'BAD_REQUEST',
          message: notFoundErrorMessage,
        })
      : new ActionError({
          code: 'BAD_GATEWAY',
          message: `{res.status} ${response.statusText}: ${response.url}`,
        });
  }
  return parseHTML(await response.text())
    .document.querySelectorAll(
      'body > div.container > div > div.span8.page > div.gb_event_list.clearfix > ul > li',
    )
    .values()
    .map((element) => {
      const eventElement = element.querySelector('div.event > h4 > a');
      return {
        name: eventElement?.textContent ?? '',
        href: eventElement?.getAttribute('href') ?? '',
        date: element.querySelector('div.date > p')?.textContent ?? '',
        place: element.querySelector('div.place > a')?.textContent ?? '',
        actors: element
          .querySelectorAll('div.actor > ul > li > a')
          .values()
          .map((actorElement) => actorElement.textContent ?? '')
          .toArray(),
      } as EventWithActors;
    })
    .toArray();
};

const searchActorId = async (actorName: string): Promise<number> => {
  const res = await fetch(
    `https://www.eventernote.com/actors/search?keyword=${actorName}`,
  );
  if (!res.ok) {
    throw new ActionError({
      code: 'BAD_GATEWAY',
      message: `${res.status} ${res.statusText}: ${res.url}`,
    });
  }
  const href = parseHTML(await res.text())
    .document.querySelectorAll(
      'body > div.container > div > div.span8.page > ul > li > a',
    )
    .values()
    .find((el) => el.textContent === actorName)
    ?.getAttribute('href');
  if (!href) {
    throw new ActionError({
      code: 'BAD_REQUEST',
      message: `出演者が見つかりません: "${actorName}"`,
    });
  }
  return parseInt(href.substring(href.lastIndexOf('/') + 1), 10);
};

const searchSpecificEventCount = async (searchUrl: string) => {
  const res = await fetch(searchUrl);
  if (!res.ok) {
    throw new ActionError({
      code: 'BAD_GATEWAY',
      message: `${res.status} ${res.statusText}: ${res.url}`,
    });
  }
  const eventCountText =
    parseHTML(await res.text()).document.querySelector(
      'body > div.container > div > div.span8.page > p:nth-child(4)',
    )?.textContent ?? '';
  const count = parseInt(eventCountText, 10);
  if (!count) {
    throw new ActionError({
      code: 'BAD_REQUEST',
      message: '指定された条件での検索結果が見つかりませんでした。',
    });
  }
  return count;
};
