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

// ==========================================
// CÁC ENDPOINT CRUD (CREATE - READ - UPDATE - DELETE)
// ==========================================

// 1. READ ALL (GET): Lấy danh sách tất cả user
app.get("/users", async (req, res) => {
    const users = await readData();
    res.status(200).json(users);
});

// 2. READ ONE (GET): Lấy thông tin 1 user dựa vào ID
app.get("/users/:id", async (req, res) => {
    const users = await readData();
    // Lấy ID từ URL param và ép kiểu về số nguyên
    const userId = parseInt(req.params.id);

    const user = users.find((u) => u.id === userId);
    if (!user) {
        return res.status(404).json({ message: "Không tìm thấy người dùng!" });
    }

    res.status(200).json(user);
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

// 4. UPDATE (PUT): Cập nhật thông tin user
app.put("/users/:id", async (req, res) => {
    const users = await readData();
    const userId = parseInt(req.params.id);
    const updateData = req.body;

    const userIndex = users.findIndex((u) => u.id === userId);

    if (userIndex === -1) {
        return res.status(404).json({ message: "Không tìm thấy người dùng để cập nhật!" });
    }

    // Ghi đè dữ liệu mới vào user tìm thấy, giữ nguyên id
    users[userIndex] = { ...users[userIndex], ...updateData, id: userId };

    await writeData(users);
    res.status(200).json({ message: "Cập nhật thành công!", data: users[userIndex] });
});

// 5. DELETE (DELETE): Xóa 1 user
app.delete("/users/:id", async (req, res) => {
    let users = await readData();
    const userId = parseInt(req.params.id);

    const userIndex = users.findIndex((u) => u.id === userId);

    if (userIndex === -1) {
        return res.status(404).json({ message: "Không tìm thấy người dùng để xóa!" });
    }

    // Lọc ra các user CÓ ID KHÁC với ID cần xóa (tức là xóa phần tử đó đi)
    users = users.filter((u) => u.id !== userId);

    await writeData(users);
    res.status(200).json({ message: "Xóa thành công!" });
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
