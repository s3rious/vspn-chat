import Application from "koa";
import bodyParser from "koa-bodyparser";
import Router from "koa-router";

import { getAll, getLast } from "./redis";

import { Message } from "./types/message";

const useApi = (
  app: Application,
  handleMessage: (message: Message) => void
) => {
  app.use(bodyParser());

  const router = new Router();

  router.get("/messages", async ctx => {
    if (Object.keys(ctx.query || {}).length < 1) {
      const messages = await getAll();
      ctx.body = messages;
      return;
    }

    if (ctx.query.count && !ctx.query.from) {
      const count = parseInt(ctx.query.count, 10);
      const messages = await getLast(count);
      ctx.body = messages;
      return;
    }

    if (ctx.query.count && ctx.query.from) {
      const count = parseInt(ctx.query.count, 10);
      const from = parseInt(ctx.query.from, 10);
      const messages = await getLast(count, from);
      ctx.body = messages;
      return;
    }

    ctx.status = 404;
  });

  router.post("/messages", async ctx => {
    const message: Partial<Message> = ctx.request.body;

    if (!message.userName) {
      throw new Error("Missing userName");
    }

    if (!message.text) {
      throw new Error("Missing text");
    }

    const body = await handleMessage(message as Message);

    ctx.body = body;
  });

  app.use(router.routes());
  app.use(router.allowedMethods());

  return app;
};

export default useApi;
