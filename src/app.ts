import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/error.middleware";
import { notFound } from "./middlewares/notFound.middleware";
import { apiLimiter } from "./middlewares/rateLimiters";
import { ENV } from "./config/env";
import exampleRoutes from "./routes/example.route";

const app: Application = express();

app.use(cors({
  origin: ENV.clientUrl,
  credentials: true,
}));
app.use(helmet());
app.use(compression());
app.use(cookieParser());
app.use(express.json({ limit: "10mb" })); 
app.use(express.urlencoded({ extended: true }));
app.use(apiLimiter);

app.get("/api/health", (_req: Request, res: Response) => {
  res.status(200).json({ status: "ok", uptime: process.uptime() });
});

app.use(`${ENV.apiPrefix}/examples`, exampleRoutes);

app.use(notFound);

app.use(errorHandler);

export default app;
