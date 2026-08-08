const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Authentication required."
            });
        }

        const token = authHeader.split(" ")[1];
        const secret = process.env.JWT_SECRET || "default_mma_jwt_secret_key";

        let decoded;
        try {
            decoded = jwt.verify(token, secret);
        } catch (jwtError) {
            if (jwtError.name === "TokenExpiredError") {
                return res.status(401).json({
                    success: false,
                    message: "Token has expired."
                });
            }
            if (jwtError.name === "JsonWebTokenError") {
                return res.status(401).json({
                    success: false,
                    message: "Invalid authentication token."
                });
            }
            return res.status(401).json({
                success: false,
                message: "Authentication failed."
            });
        }

        let user = null;
        try {
            user = await User.findById(decoded.id);
        } catch (dbErr) {
            console.warn("[AI Studio] auth middleware DB lookup warning:", dbErr.message);
        }

        if (!user) {
            const { getFallbackUser } = require("../utils/fallbackStore");
            user = getFallbackUser(decoded.email);
        }

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User account no longer exists."
            });
        }

        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: "Your account is disabled."
            });
        }

        req.user = user;
        next();

    } catch (error) {
        console.error("Auth middleware error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};

module.exports = authenticate;

