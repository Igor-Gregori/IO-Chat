import { Socket } from "socket.io";
import { io } from "../../http";

import { ClientEvents } from "./ClientEvents";

const clientEvents = new ClientEvents();

io.on("connect", (socket: Socket) => {
  socket.on("client_first_access", async (params) => {
    const { text, email } = params;
    await clientEvents.clientFirstAccess(socket, text, email);

    const users = await clientEvents.allUsersWithoutAdmin();
    io.emit("admin_list_all_users", users);
  });

  socket.on("client_send_to_admin", async (params) => {
    const { text, socket_admin_id } = params;
    const message = await clientEvents.clientSendMessageToAdmin(socket, text);

    io.to(socket_admin_id).emit("admin_receive_message", {
      message,
      socket_id: socket.id,
    });
  });
});
