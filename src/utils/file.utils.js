import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_FILE = path.join(__dirname, "data.json");

export async function readData() {
    try {
        const data = await fs.readFile(DATA_FILE, "utf-8");
        return JSON.parse(data);
    } catch (error) {
        console.error("Lỗi đọc file:", error);
        return [];
    }
}

// Hàm ghi dữ liệu đè vào file JSON
export async function writeData(data) {
    try {
        // Chuyển Mảng/Object thành chuỗi JSON, tham số null, 2 giúp format code đẹp dễ nhìn
        await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), "utf8");
    } catch (error) {
        console.error("Lỗi ghi file:", error);
    }
}
