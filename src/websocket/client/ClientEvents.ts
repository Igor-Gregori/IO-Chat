import { Socket } from "socket.io";

import { ConnectionsService } from "../../services/ConnectionsService";
import { UsersService } from "../../services/UsersService";
import { MessagesService } from "../../services/MessagesServices";

import { User } from "../../entities/Users";
import { Connection } from "../../entities/Connection";
import { Messages } from "../../entities/Messages";

class ClientEvents {
  async clientFirstAccess(socket: Socket, text: string, email: string) {
    const usersService = new UsersService();
    const connectionsService = new ConnectionsService();
    const messagesService = new MessagesService();

    let user_id = null;

    const userExists = await usersService.findByEmail(email);

    if (!userExists) {
      const user = await usersService.create(email);
      await connectionsService.create({
        socket_id: socket.id,
        user_id: user.id,
      });

      user_id = user.id;
    } else {
      user_id = userExists.id;

      const connection = await connectionsService.findByUserId(userExists.id);

      if (!connection) {
        await connectionsService.create({
          socket_id: socket.id,
          user_id: userExists.id,
        });
      } else {
        connection.socket_id = socket.id;
        await connectionsService.create(connection);
      }
    }

    await messagesService.create({
      text,
      user_id,
    });

    const allMessages = await messagesService.listByUser(user_id);
    socket.emit("client_list_all_messages", allMessages);
  }

  async allUsersWithoutAdmin(): Promise<Connection[]> {
    const connectionsService = new ConnectionsService();
    const allUsers = await connectionsService.findAllWithoutAdmin();
    return allUsers;
  }

  async clientSendMessageToAdmin(
    socket: Socket,
    text: string
  ): Promise<Messages> {
    const connectionsService = new ConnectionsService();
    const messagesService = new MessagesService();

    const socket_id = socket.id;
    const { user_id } = await connectionsService.findBySocketId(socket_id);

    const message = await messagesService.create({
      text,
      user_id,
    });

    return message;
  }
}

export { ClientEvents };
