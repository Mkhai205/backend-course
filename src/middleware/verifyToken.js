import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        req.user = decoded; // Lưu thông tin người dùng đã giải mã vào req.user

        next();
    } catch (error) {
        return res.status(403).json({ message: "Forbidden: Invalid token" });
    }
};

export const verifyAdmin = (req, res, next) => {
    if (req.user.role !== "ADMIN") {
        return res.status(403).json({ message: "Forbidden: Admins only" });
    }
    next();
};
