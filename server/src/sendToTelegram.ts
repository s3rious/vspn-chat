import { Telegram } from "telegraf";

import { Message } from "./types/message";

const { TG_CHAT_NAME } = process.env;

const createSendToTelegram = (telegram: Telegram) => (
  message: Message
) => {
  const telegramMessage = `*${message.userName}*\n${message.text}`;

  return telegram.sendMessage(
    `@${TG_CHAT_NAME}`,
    telegramMessage,
    {
      parse_mode: "Markdown"
    }
  );
};

export default createSendToTelegram;
