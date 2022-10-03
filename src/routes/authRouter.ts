import { Router } from "express";
import * as authController from "../controllers/authController";
import { validateSchemaMiddleware } from "../middlewares/validateSchemaMiddleware";
import { signInSchema, signUpSchema } from "../schemas/authSchemas";

const authRouter = Router();

authRouter.post("/sign-in", validateSchemaMiddleware(signInSchema));
authRouter.post("/sign-up", validateSchemaMiddleware(signUpSchema), authController.signUp);

export default authRouter;
