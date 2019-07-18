import createBot from "./bot";
import { store } from "./redis";
import cnsl from "./util/cnsl";

export type Message = {
  id?: number;
  userName: string;
  date: number;
  text?: string;
  sticker?: string;
  animation?: string;
  photo?: string;
};

const handleMessage = async (message: Message): Promise<void> => {
  cnsl.log(message);

  store(message);
};

createBot(handleMessage).launch();
