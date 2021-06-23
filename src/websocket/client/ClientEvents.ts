import { Socket } from "socket.io";

import { ConnectionsService } from "../../services/ConnectionsService";
import { UsersService } from "../../services/UsersService";
import { MessagesService } from "../../services/MessagesServices";

import { User } from "../../entities/Users";
import { Connection } from "../../entities/Connection";

class ClientEvents {
  private connectionsService = new ConnectionsService();
  private usersService = new UsersService();
  private messagesService = new MessagesService();

  async clientFirstAccess(socket: Socket, text: string, email: string) {
    let user_id = null;

    const userExists = await this.usersService.findByEmail(email);

    if (!userExists) {
      const user = await this.usersService.create(email);

      await this.connectionsService.create({
        socket_id: socket.id,
        user_id: user.id,
      });

      user_id = user.id;
    } else {
      user_id = userExists.id;

      const connection = await this.connectionsService.findByUserId(
        userExists.id
      );

      if (!connection) {
        await this.connectionsService.create({
          socket_id: socket.id,
          user_id: userExists.id,
        });
      } else {
        connection.socket_id = socket.id;
        await this.connectionsService.create(connection);
      }
    }

    await this.messagesService.create({
      text,
      user_id,
    });

    const allMessages = await this.messagesService.listByUser(user_id);
    socket.emit("client_list_all_messages", allMessages);
  }

  async all_users_without_admin(): Promise<Connection[]> {
    const allUsers = await this.connectionsService.findAllWithoutAdmin();
    return allUsers;
  }
}

export { ClientEvents };
