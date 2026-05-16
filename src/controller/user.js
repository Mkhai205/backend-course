import { AppDataSource } from "../database.js";
import { userRepository } from "../repository/userRepository.js";
import { readData, writeData } from "../utils/file.utils.js";

export const getUserById = async (req, res) => {
    const id = parseInt(req.params.id);

    const user = await userRepository.findOneBy({ id: id });

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
    const newUser = await userRepository.create(req.body);

    const savedUser = await userRepository.save(newUser);

    res.status(201).json({ message: "Tạo thành công!", data: newUser });
};

export const updateUser = async (req, res) => {
    const userId = parseInt(req.params.id);

    const user = await userRepository.findOneBy({ id: userId });

    if (!user) {
        return res.status(404).json({ message: "Không tìm thấy người dùng để cập nhật!" });
    }

    if (req.body.name) {
        user.name = req.body.name;
    }

    // Lưu lại thông tin đã cập nhật vào database
    const updatedUser = await userRepository.save(user);

    res.status(200).json({ message: "Cập nhật thành công!", data: updatedUser });
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
