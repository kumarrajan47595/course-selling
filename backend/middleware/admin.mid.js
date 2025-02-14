import jwt from "jsonwebtoken";
import config from "../config.js";

function adminMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "No token provided" });
    }
    const token = authHeader.split(" ")[1];
    try {
        if (!config.JWT_ADMIN_PASSWORD) {
            throw new Error("JWT Secret Key is missing");
        }
        const decode = jwt.verify(token, config.JWT_ADMIN_PASSWORD);
        req.adminId = decode.id
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({ error: "Invalid token or expired" });
    }
}

export default adminMiddleware;