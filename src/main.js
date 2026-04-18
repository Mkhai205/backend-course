import express from "express";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_FILE = path.join(__dirname, "data.json");

console.log("Reading data from file:", DATA_FILE);

app.use(express.json()); // Middleware để parse JSON từ body của request

async function readData() {
    try {
        const data = await fs.readFile(DATA_FILE, "utf-8");
        return JSON.parse(data);
    } catch (error) {
        console.error("Lỗi đọc file:", error);
        return [];
    }
}

// Hàm ghi dữ liệu đè vào file JSON
async function writeData(data) {
    try {
        // Chuyển Mảng/Object thành chuỗi JSON, tham số null, 2 giúp format code đẹp dễ nhìn
        await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), "utf8");
    } catch (error) {
        console.error("Lỗi ghi file:", error);
    }
}

app.get("/", async (req, res) => {
    const data = await readData();
    res.status(200).json(data);
});

// 3. CREATE (POST): Thêm 1 user mới
app.post("/users", async (req, res) => {
    const users = await readData();
    const newUser = req.body; // Dữ liệu client gửi lên

    // Tạo ID tự động (ID của phần tử cuối cùng + 1)
    const newId = users.length > 0 ? users[users.length - 1].id + 1 : 1;

    newUser.id = newId;

    users.push(newUser); // Thêm vào mảng trên RAM
    await writeData(users); // Ghi mảng mới xuống file cứng

    res.status(201).json({ message: "Tạo thành công!", data: newUser });
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
