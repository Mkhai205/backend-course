import { readData, writeData } from "../utils/file.utils.js";

export const getUserById = async (req, res) => {
    const users = await readData();
    // Lấy ID từ URL param và ép kiểu về số nguyên
    const userId = parseInt(req.params.id);

    const user = users.find((u) => u.id === userId);
    if (!user) {
        return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    res.status(200).json(user);
};

export const getAllUsers = async (req, res) => {
    const users = await readData();
    res.status(200).json(users);
};

export const createUser = async (req, res) => {
    const users = await readData();
    const newUser = req.body; // Dữ liệu client gửi lên

    // Tạo ID tự động (ID của phần tử cuối cùng + 1)
    const newId = users.length > 0 ? users[users.length - 1].id + 1 : 1;

    newUser.id = newId;

    users.push(newUser); // Thêm vào mảng trên RAM
    await writeData(users); // Ghi mảng mới xuống file cứng

    res.status(201).json({ message: "Tạo thành công!", data: newUser });
};

export const updateUser = async (req, res) => {
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
};

export const deleteUser = async (req, res) => {
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
};
