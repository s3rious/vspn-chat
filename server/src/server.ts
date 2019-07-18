import Koa from "koa";

import useApi from "./api";
import createBot from "./bot";
import handleMessage from "./handleMessage";

const app = new Koa();

const { bot, telegram } = createBot(handleMessage);
const api = useApi(app, telegram, handleMessage);

bot.launch();
api.listen(3000);
