import { categoriesRouter } from '@/modules/categories/server/procedure';
import { baseProcedure, createTRPCRouter, protectedProcedure } from '../init';
import { studioRouter } from '@/modules/studio/server/procedure';
import { videosRouter } from '@/modules/videos/server/procedure';
import { videoViewsRouter } from '@/modules/video-views/server/procedure';
import { videoReactions } from '@/db/schema';
import { videoReactionsRouter } from '@/modules/video-reactions/server/procedure';
import { subscriptionsRouter } from '@/modules/subscriptions/ui/server/procedure';
import { commentsRouter } from '@/modules/comments/server/procedure';
import { commentReactionsRouter } from '@/modules/comment-reactions/procedure';
import { suggestionsRouter } from '@/modules/suggestions/server/procedure';
import { searchRouter } from '@/modules/search/server/procedure';
import { playlistsRouter } from '@/modules/playlists/server/procedure';
import { usersRouter } from '@/modules/users/server/procedure';
export const appRouter = createTRPCRouter({
  studio: studioRouter,
  videos: videosRouter,
  categories: categoriesRouter,
  videoViews: videoViewsRouter,
  videoReactions: videoReactionsRouter,
  subscriptions: subscriptionsRouter,
  comments: commentsRouter,
  commentReactions: commentReactionsRouter,
  suggestions: suggestionsRouter,
  search: searchRouter,
  playlists: playlistsRouter,
  users: usersRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;