import { Socket } from "socket.io";
import { io } from "../../http";

import { ClientEvents } from "./ClientEvents";

const clientEvents = new ClientEvents();

io.on("connect", (socket: Socket) => {
  socket.on("client_first_access", async (text: string, email: string) => {
    await clientEvents.clientFirstAccess(socket.id, text, email);
  });
});
