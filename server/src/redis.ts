import redis from "redis";
import util from "util";

import { Message } from "./server";

const { MEDIA_BASE_URL, TG_CHAT_NAME } = process.env;
const client = redis.createClient();

const Add = util.promisify(client.zadd).bind(client);
const Range = util.promisify(client.zrange).bind(client);

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
  const { id, ...restMessage } = message;
  const messageJson = JSON.stringify(restMessage);

  await Add(TG_CHAT_NAME, id, messageJson);
};

const getAll = async (): Promise<Message[]> => {
  const messages = await Range(TG_CHAT_NAME, 0, -1);
  const parsedMessages = messages.map(parse);

  return parsedMessages;
};

const getLast = async (count: number, from: number = 0): Promise<Message[]> => {
  const begin = -1 * from - count;
  const end = -1 * from + -1;

  const messages = await Range(TG_CHAT_NAME, begin, end);
  const parsedMessages = messages.map(parse);

  return parsedMessages;
};

export { store, getAll, getLast };
