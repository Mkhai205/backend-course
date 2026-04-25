export const checkApikey = (req, res, next) => {
    const apikey = req.headers["x-api-key"];
    const API_KEY = "123";

    if (apikey !== API_KEY) {
        return res.status(401).json({ message: "Unauthorized: Invalid API Key" });
    }

    next();
};
