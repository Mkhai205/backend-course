import express from "express";
import {
    createUser,
    deleteUser,
    getAllUsers,
    getUserById,
    updateUser,
} from "../controller/user.js";
import { readData } from "../utils/file.utils.js";
import { checkApikey } from "../middleware/checkApikey.js";
import { validateUserData } from "../middleware/validateDataUser.js";
import { verifyAdmin, verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// 1. READ ALL (GET): Lấy danh sách tất cả user
router.get("/", verifyToken, verifyAdmin, getAllUsers);

// 2. READ ONE (GET): Lấy thông tin 1 user dựa vào ID
router.get("/:id", checkApikey, getUserById);

// 3. CREATE (POST): Thêm 1 user mới
router.post("/", checkApikey, createUser);

// 4. UPDATE (PUT): Cập nhật thông tin user
router.put("/:id", updateUser);

// 5. DELETE (DELETE): Xóa 1 user
router.delete("/:id", deleteUser);

export default router;
