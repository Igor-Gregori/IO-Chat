import { io } from "../../http";
import { AdminEvents } from "./AdminEvents";

const adminEvents = new AdminEvents();

io.on("connect", async (socket) => {
  const allConnectionsWithoutAdmin =
    await adminEvents.allConnectionsWithoutAdmin();

  io.emit("admin_list_all_users", allConnectionsWithoutAdmin);

  socket.on("admin_list_messages_by_user", async (params, callback) => {
    const { user_id } = params;
    const allMessages = await adminEvents.messagesByUser(user_id);

    callback(allMessages);
  });

  socket.on("admin_send_message", async (params) => {
    const { text, user_id } = params;
    await adminEvents.adminSendMessageToUser(text, user_id, socket.id);

    const connection = await adminEvents.connectionByUser(user_id);

    io.to(connection.socket_id).emit("admin_send_to_client", {
      text,
      socket_id: socket.id,
    });
  });

  socket.on("admin_in_call_to_user", async (params) => {
    const { user_id } = params;
    await adminEvents.closeChat(user_id, socket.id);

    const allConnectionsWithoutAdmin =
      await adminEvents.allConnectionsWithoutAdmin();
    io.emit("admin_list_all_users", allConnectionsWithoutAdmin);
  });
});
