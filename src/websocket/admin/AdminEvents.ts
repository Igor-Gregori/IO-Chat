import { Socket } from "socket.io";

import { Connection } from "../../entities/Connection";
import { Messages } from "../../entities/Messages";

import { ConnectionsService } from "../../services/ConnectionsService";
import { MessagesService } from "../../services/MessagesServices";

class AdminEvents {
  async allConnectionsWithoutAdmin(): Promise<Connection[]> {
    const connectionsService = new ConnectionsService();
    return await connectionsService.findAllWithoutAdmin();
  }

  async messagesByUser(user_id: string): Promise<Messages[]> {
    const messagesService = new MessagesService();
    return await messagesService.listByUser(user_id);
  }

  async adminSendMessageToUser(
    text: string,
    user_id: string,
    admin_id: string
  ): Promise<void> {
    const messagesService = new MessagesService();
    await messagesService.create({
      admin_id,
      text,
      user_id,
    });
  }

  async connectionByUser(user_id: string): Promise<Connection> {
    const connectionsService = new ConnectionsService();
    return connectionsService.findByUserId(user_id);
  }

  async closeChat(user_id: string, admin_id: string): Promise<void> {
    const connectionsService = new ConnectionsService();
    await connectionsService.updateAdminId(user_id, admin_id);
  }
}

export { AdminEvents };
