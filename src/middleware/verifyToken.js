import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export const Role = {
    USER: "USER",
    ADMIN: "ADMIN",
    MANAGER: "MANAGER",
};

const getTokenFromHeader = (req) => {
    let accessToken = req.cookies?.["token123"];

    if (!accessToken) {
        const authHeader = req.headers["authorization"];
        accessToken = authHeader && authHeader.split(" ")[1];
    }

    return accessToken;
};

export const verifyToken = (req, res, next) => {
    const token = getTokenFromHeader(req);

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

export const verifyRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized: No user information" });
        }

        const roles = Array.isArray(allowedRoles) ? allowedRoles : [];

        const hasPermission = roles.includes(req.user.role);

        if (!hasPermission) {
            return res
                .status(403)
                .json({ message: "Forbidden: You don't have permission to access this resource" });
        }
        next();
    };
};
