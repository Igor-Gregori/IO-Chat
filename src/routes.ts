import { Router } from "express";
import { validate } from "express-validation";

import { SettingsController } from "./controllers/SettingsController";
import { UsersController } from "./controllers/UsersCotroller";
import { MessagesControler } from "./controllers/MessagesController";

import { SettingsValidation } from "./validations/SettingsValidation";

const routes = Router();

const settingsController = new SettingsController();
const usersController = new UsersController();
const messagesController = new MessagesControler();

routes.post(
  "/settings",
  validate(SettingsValidation, {}, {}),
  settingsController.create
);
routes.get("/settings/:username", settingsController.findByUsername);
routes.put("/settings/:username", settingsController.update);

routes.post("/users", usersController.create);
routes.get("/users", usersController.findAll);

routes.post("/messages", messagesController.create);
routes.get("/messages/:id", messagesController.showByUser);

export { routes };
