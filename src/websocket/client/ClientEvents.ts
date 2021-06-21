import { ConnectionsService } from "../../services/ConnectionsService";
import { UsersService } from "../../services/UsersService";
import { MessagesService } from "../../services/MessagesServices";

class ClientEvents {
  private connectionsService = new ConnectionsService();
  private usersService = new UsersService();
  private messagesService = new MessagesService();

  async clientFirstAccess(socket_id: string, text: string, email: string) {
    let user_id = null;

    const userExists = await this.usersService.findByEmail(email);

    if (!userExists) {
      const user = await this.usersService.create(email);

      await this.connectionsService.create({
        socket_id,
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
          socket_id,
          user_id: userExists.id,
        });
      } else {
        connection.socket_id = socket_id;
        await this.connectionsService.create(connection);
      }
    }

    //Montar estrutura para enviar imagem
  }
}

export { ClientEvents };
