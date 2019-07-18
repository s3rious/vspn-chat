import { store } from "./redis";
import cnsl from "./util/cnsl";

import { Message } from "./types/message";

const createHandleMessage = (afterStore: (message: Message) => void) => {
  return async (message: Partial<Message>): Promise<Message> => {
    if (!message.userName) {
      throw new Error("No userMame field in message");
    }
    if (!message.date) {
      throw new Error("No date field in message");
    }
    if (
      !message.text &&
      !message.sticker &&
      !message.photo &&
      !message.animation
    ) {
      throw new Error("No content in message");
    }
    const msg = message as Message;

    cnsl.log(`Handle message: ${JSON.stringify(msg, null, 2)}`);

    await store(msg);
    if (afterStore && typeof afterStore === "function") {
      await afterStore(msg);
    }

    return msg;
  };
};

export default createHandleMessage;
