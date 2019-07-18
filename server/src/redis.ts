import redis from "redis";
import util from "util";

import { Message } from "./types/message";

const { MEDIA_BASE_URL, TG_CHAT_NAME } = process.env;
const client = redis.createClient();

const Push = util.promisify(client.rpush).bind(client);
const Range = util.promisify(client.lrange).bind(client);

const parse = (json: string): Message => {
  const message: Message = JSON.parse(json);

  if (message.sticker) {
    message.sticker = MEDIA_BASE_URL + message.sticker;
  }

  if (message.animation) {
    message.animation = MEDIA_BASE_URL + message.animation;
  }
  if (message.photo) {
    message.photo = MEDIA_BASE_URL + message.photo;
  }

  return message;
};

const store = async (message: Message): Promise<void> => {
  try {
    const messageJson = JSON.stringify(message);
    await Push(TG_CHAT_NAME, messageJson);
  } catch (error) {
    throw error;
  }
};

const getAll = async (): Promise<Message[]> => {
  try {
    const messages = await Range(TG_CHAT_NAME, 0, -1);
    const parsedMessages = messages.map(parse);

    return parsedMessages;
  } catch (error) {
    throw error;
  }
};

const getLast = async (count: number, from: number = 0): Promise<Message[]> => {
  const begin = -1 * from - count;
  const end = -1 * from + -1;

  try {
    const messages = await Range(TG_CHAT_NAME, begin, end);
    const parsedMessages = messages.map(parse);

    return parsedMessages;
  } catch (error) {
    throw error;
  }
};

export { store, getAll, getLast };
