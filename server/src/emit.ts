import { Server } from "socket.io";

import cnsl from "./util/cnsl";

import { Message } from "./types/message";

const createEmit = (io: Server) =>
  (message: Partial<Message>): void => {
    cnsl.log(`Emitting message: ${JSON.stringify(message, null, 2)}`)
    io.emit("message", message)
  };

export default createEmit;
