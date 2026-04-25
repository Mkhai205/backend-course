import express from "express";

import { requestLogger } from "./middleware/requestLogger.js";
import userRouter from "./router/user.js";

const app = express();

app.use(express.json()); // Middleware để parse JSON từ body của request

app.use(requestLogger);

app.get("/", async (req, res) => {
    const data = await readData();
    res.status(200).json(data);
});

app.use(userRouter);

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
