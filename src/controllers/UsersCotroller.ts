import { Request, Response } from "express";
import { UserService } from "../services/UsersService";

class UsersController {
  async create(request: Request, response: Response): Promise<Response> {
    const { email } = request.body;
    const userService = new UserService();

    try {
      const user = await userService.create({ email });

      return response.status(200).json(user);
    } catch (err) {
      return response.status(400).json({
        message: err.message,
      });
    }
  }
}

export { UsersController };
