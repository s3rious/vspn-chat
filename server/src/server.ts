import http from "http";
import Koa from "koa";
import socket from "socket.io";

import useApi from "./api";
import createBot from "./bot";
import createEmit from "./emit";
import createHandleMessage from "./handleMessage";
import createSendToTelegram from "./sendToTelegram";

const app = new Koa();
const io = socket();
const emit = createEmit(io);
const handleMessage = createHandleMessage(emit);
const { bot, telegram } = createBot(handleMessage);
const sendToTelegram = createSendToTelegram(telegram);
const api = useApi(app, async message => {
  const { date } = await sendToTelegram(message);
  message.date = date;
  await handleMessage(message);

  return date;
});

const server = http.createServer(api.callback());
io.attach(server);

bot.launch();
server.listen(process.env.PORT || 1337);
