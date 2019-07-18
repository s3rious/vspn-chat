import { store } from "./redis";
import cnsl from "./util/cnsl";

import { Message } from "./types/message";

const handleMessage = async (message: Partial<Message>): Promise<Message> => {
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

  cnsl.log(`Handle message: ${JSON.stringify(message, null, 2)}`);

  store(message as Message);
  return message as Message;
};

export default handleMessage;
