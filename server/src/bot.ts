import Telegraf, { ContextMessageUpdate, Telegram } from "telegraf";

import cnsl from "./util/cnsl";
import processFile from "./util/processFile";

import { Message } from "./types/message";

const { TG_BOT_TOKEN, TG_CHAT_NAME } = process.env;

const getMessageData = async (ctx: ContextMessageUpdate, telegram: Telegram): Promise<Message> => {
  const chatUsername = ctx.chat.username;

  cnsl.log(`Got a new message for chat: ${chatUsername}`);

  if (!chatUsername || chatUsername !== TG_CHAT_NAME) {
    cnsl.log(`Ignoring it since it's not for matching one from the env: ${TG_CHAT_NAME}`);
    return;
  }

  const { from: { first_name, last_name }, date } = ctx.message;
  const userName = `${first_name} ${last_name}`;
  const message: Message = { userName, date };

  if (ctx.message.text) {
    const { text } = ctx.message;
    cnsl.log(`It’s a text.\nUsername: ${userName};\nText: ${ctx.message.text}`);

    message.text = text;
    return message;
  }

  if (ctx.message.sticker) {
    const { file_id } = ctx.message.sticker;
    cnsl.log(`It’s a sticker.\nFileID: ${file_id}`);

    try {
      const sticker = await processFile(telegram, file_id, "stickers");

      message.sticker = sticker;
      return message;
    } catch (error) {
      cnsl.log(error);
    }
  }

  if (ctx.message.animation) {
    const { file_id } = ctx.message.animation;
    cnsl.log(`It’s a animation.\nFileID: ${file_id}`);

    try {
      const animation = await processFile(telegram, file_id, "animations");

      message.animation = animation;
      return message;
    } catch (error) {
      cnsl.log(error);
    }
  }

  if (ctx.message.photo) {
    const { file_id } = ctx.message.photo[ctx.message.photo.length - 1] || ctx.message.photo[0];
    cnsl.log(`It’s a photo.\nFileID: ${file_id}`);

    try {
      const photo = await processFile(telegram, file_id, "photos");

      message.animation = photo;
      return message;
    } catch (error) {
      cnsl.log(error);
    }
  }
};

const createBot = (onMessage: (message: Message) => void) => {
  const bot = new Telegraf(TG_BOT_TOKEN);
  const telegram = new Telegram(TG_BOT_TOKEN);

  bot.on("message", async ctx => {
    const message = await getMessageData(ctx, telegram);
    onMessage(message);
  });

  return {
    bot,
    telegram
  };
};

export default createBot;
