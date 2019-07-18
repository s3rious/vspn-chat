import Application from "koa";
import bodyParser from "koa-bodyparser";
import Router from "koa-router";
import { Telegram } from "telegraf";

import { getAll, getLast } from "./redis";

import { Message } from "./types/message";

const { TG_CHAT_NAME } = process.env;

const useApi = (
  app: Application,
  telegram: Telegram,
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
    const message: Message = ctx.request.body;

    if (!message.userName) {
      throw new Error("Missing userName");
    }

    if (!message.text) {
      throw new Error("Missing text");
    }

    const telegramMessage = `*${message.userName}*\n${message.text}`;

    const { date } = await telegram.sendMessage(
      `@${TG_CHAT_NAME}`,
      telegramMessage,
      {
        parse_mode: "Markdown"
      }
    );
    message.date = date;

    await handleMessage(message);

    ctx.body = telegramMessage;
  });

  app.use(router.routes());
  app.use(router.allowedMethods());

  return app;
};

export default useApi;
