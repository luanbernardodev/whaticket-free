import "./bootstrap";
import "reflect-metadata";
import "express-async-errors";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import * as Sentry from "@sentry/node";
import { messageQueue, sendScheduledMessages } from "./queues";
import "./database";
import uploadConfig from "./config/upload";
import AppError from "./errors/AppError";
import routes from "./routes";
import { logger } from "./utils/logger";

// Configuração do CORS
const corsOptions = {
<<<<<<< HEAD
  origin: 'http://fenix.ticket:3000', // Origem permitida
  methods: ['GET', 'POST'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization'], // Cabeçalhos permitidos
  credentials: true // Permite cookies e outras credenciais
=======
  origin: '*', // Adicione outras origens se necessário
  methods: '*',
  allowedHeaders:'*',
credentials: true
>>>>>>> 973e29b1c (Resolvendo sockets)
};

const app = express();

// Middleware para CORS
app.use(cors(corsOptions));

app.use(express.json({ limit: '50mb' }));
app.use(cookieParser());
app.use(express.urlencoded({ limit: "250mb", parameterLimit: 200000, extended: true }));

app.set("queues", { messageQueue, sendScheduledMessages });

<<<<<<< HEAD
app.use(Sentry.Handlers.requestHandler());
=======
//app.use(Sentry.Handlers.requestHandler());
>>>>>>> 973e29b1c (Resolvendo sockets)
app.use("/public", express.static(uploadConfig.directory));
app.use(routes);

//app.use(Sentry.Handlers.errorHandler());

app.use(async (err: Error, req: Request, res: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    logger.warn(err);
    return res.status(err.statusCode).json({ error: err.message });
  }

  logger.error(err);
  return res.status(500).json({ error: "Internal server error" });
});

export default app;
