import createBot from "./bot";
import cnsl from "./util/cnsl";

export type Message = {
  id: number;
  userName: string;
  date: number;

  text?: string;
  sticker?: string;
  animation?: string;
  photo?: string;
}

const handleMessage = (message: Message) => {
  cnsl.log(message)
}

createBot(handleMessage).launch()
