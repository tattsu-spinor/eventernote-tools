import { ConvexHttpClient } from 'convex/browser';
import { appearanceStatistics } from './appearanceStatistics';
import { coactingEvents } from './coactingEvents';

export const server = {
  appearanceStatistics,
  coactingEvents,
};

export const httpClient = new ConvexHttpClient(
  process.env.CONVEX_URL as string,
);
export const defaultErrorData = {
  code: 'INTERNAL_SERVER_ERROR',
  message: '予期せぬエラーが発生しました',
};
