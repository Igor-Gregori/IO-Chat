import { Joi } from "express-validation";

const SettingsValidation = {
  body: Joi.object({
    chat: Joi.boolean().required(),
    username: Joi.string().min(4).required(),
  }),
};

export { SettingsValidation };