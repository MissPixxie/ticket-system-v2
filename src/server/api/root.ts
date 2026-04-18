import { postRouter } from "~/server/api/routers/post";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { ticketRouter } from "./routers/ticket";
import { userRouter } from "./routers/user";
import { messageRouter } from "./routers/message";
import { suggestionBoxRouter } from "./routers/suggestionBox";
import { notificationRouter } from "./routers/notification";
import { eventRouter } from "./routers/event";
import { subscriptionRouter } from "./routers/subscription";
import { auditLogRouter } from "./routers/auditLog";
import { newsRouter } from "./routers/news";
import { questionRouter } from "./routers/question";
import { resourceRouter } from "./routers/resource";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  ticket: ticketRouter,
  user: userRouter,
  message: messageRouter,
  suggestionBox: suggestionBoxRouter,
  notification: notificationRouter,
  event: eventRouter,
  subscription: subscriptionRouter,
  auditLog: auditLogRouter,
  news: newsRouter,
  question: questionRouter,
  resource: resourceRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
