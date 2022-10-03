import cors from "cors";
import express from "express";
import "express-async-errors";
import router from "./routes/index";
import errorHandlerMiddleware from "./middlewares/errorHandlerMiddleware";

const app = express();

app.use(cors());
app.use(express.json());
app.use(router);
app.use(errorHandlerMiddleware);

export default app;
