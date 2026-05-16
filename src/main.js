import express from "express";
import config from "dotenv/config";
import { requestLogger } from "./middleware/requestLogger.js";
import userRouter from "./router/user.js";
import authRouter from "./router/auth.js";
import { AppDataSource } from "./database.js";

const app = express();

AppDataSource.initialize()
    .then(() => {
        console.log("✅ Kết nối Database PostgreSQL thành công!");
    })
    .catch((error) => console.error("❌ Lỗi kết nối DB:", error));

app.use(express.json()); // Middleware để parse JSON từ body của request

app.use(requestLogger);

app.get("/", async (req, res) => {
    const data = await readData();
    res.status(200).json(data);
});

app.use("/users", userRouter);
app.use("/auth", authRouter);

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
