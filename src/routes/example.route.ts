import { Router } from "express";
import { ExampleController } from "../controllers/example.controller";
import { apiLimiter } from "../middlewares/rateLimiters/api.limiter";

const router = Router();

router.get("/", apiLimiter, ExampleController.getExample);

export default router;
