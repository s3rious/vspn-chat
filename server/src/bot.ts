import Telegraf, { ContextMessageUpdate } from "telegraf";

import cnsl from "./util/cnsl";
import processFile from "./util/processFile";

const { TG_BOT_TOKEN, TG_CHAT_NAME } = process.env;

const bot = new Telegraf(TG_BOT_TOKEN);

type Message = {
  id: number;
  userName: string;
  date: number;

  text?: string;
  sticker?: string;
  animation?: string;
  photo?: string;
}


const getMessageData = async (ctx: ContextMessageUpdate): Promise<Message> => {
  console.log(TG_CHAT_NAME)
  console.log(ctx)


  const chatUsername = ctx.chat.username;

  cnsl.log(`Got a new message for chat: ${chatUsername}`);

  if (!chatUsername || chatUsername !== TG_CHAT_NAME) {
    cnsl.log(
      `Ignoring it since it's not for matching one from the env: ${TG_CHAT_NAME}`
    );
    return;
  }

  const { message_id: id, from: { first_name, last_name }, date, } = ctx.message;
  const userName = `${first_name} ${last_name}`;

  const message: Message = {
    id,
    userName,
    date
  }

  if (ctx.message.text) {
    const { text } = ctx.message;
    cnsl.log(`It’s a text.\nUsername: ${userName};\nText: ${ctx.message.text}`);

    message.text = text
    return message
  }

  if (ctx.message.sticker) {
    const { file_id } = ctx.message.sticker;
    cnsl.log(`It’s a sticker.\nFileID: ${file_id}`);

    try {
      const sticker = await processFile(file_id, "stickers");

      message.sticker = sticker;
      return message
    } catch (error) {
      cnsl.log(error);
    }
  }

  if (ctx.message.animation) {
    const { file_id } = ctx.message.animation;
    cnsl.log(`It’s a animation.\nFileID: ${file_id}`);

    try {
      const animation = await processFile(file_id, "animations");

      message.animation = animation;
      return message
    } catch (error) {
      cnsl.log(error);
    }
  }

  if (ctx.message.photo) {
    const { file_id } =
      ctx.message.photo[ctx.message.photo.length - 1] || ctx.message.photo[0];
    cnsl.log(`It’s a photo.\nFileID: ${file_id}`);

    try {
      const photo = await processFile(file_id, "photos");

      message.animation = photo;
      return message
    } catch (error) {
      cnsl.log(error);
    }
  }
}

bot.on("message", async ctx => {
  const message = await getMessageData(ctx)
  cnsl.log(message)
});

export default bot;
