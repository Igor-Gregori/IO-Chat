import express, { NextFunction, Request, Response } from "express";
import { ValidationError } from "express-validation";

import { createServer } from "http";
import { Server, Socket } from "socket.io";

import "./database";
import { routes } from "./routes";

import path from "path";

const app = express();

//configurando parte visual do chat, para usar html nas rotas
app.use(express.static(path.join(__dirname, "..", "public")));
app.set("views", path.join(__dirname, "..", "public"));
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

app.get("/pages/client", (req, res) => {
  return res.render("html/client.html");
});

const http = createServer(app); // Criando protocolo http
const io = new Server(http); // Criando protocolo WS

io.on("connection", (socket: Socket) => {
  console.log(`O usuário ${socket.id} acaba de se conectar !`);
  socket.on("disconnect", () => {
    console.log(`O usuário ${socket.id} se desconectou !`);
  });
});

app.use(express.json());
app.use(routes);

app.use(
  (err: Error, request: Request, response: Response, _next: NextFunction) => {
    if (err instanceof ValidationError) {
      return response.status(err.statusCode).json(err);
    }

    return response.status(500).json({
      status: "Error",
      message: `Internal server error ${err.message}`,
    });
  }
);

export { http, io };
