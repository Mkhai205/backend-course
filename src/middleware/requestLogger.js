export const requestLogger = (req, res, next) => {
    const timestamp = new Date().toISOString();
    const method = req.method;
    const url = req.originalUrl;
    const userAgent = req.headers["user-agent"] || "Unknown";
    const ip = req.ip || req.connection.remoteAddress || "Unknown";

    console.log(`[${timestamp}] ${method} ${url} - User Agent: ${userAgent} - IP: ${ip}`);

    next();
};
