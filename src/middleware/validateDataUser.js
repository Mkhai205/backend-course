export const validateUserData = (req, res, next) => {
    const { name, email } = req.body;

    if (!name || !email) {
        return res
            .status(400)
            .json({ message: "Bad Request: Missing required fields (name, email)" });
    }

    next();
};
