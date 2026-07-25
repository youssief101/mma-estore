// @youssef: implementing register, login, getCurrentUser
const bcrypt = require("bcrypt");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const formatUserResponse = require("../utils/formatUserResponse");

// @youssef: register controller
const register = async (req, res) => {
    try {
        const {
            username,
            firstName,
            lastName,
            email,
            password,
            phone
        } = req.body;

        // @youssef: Check username, and email uniqueness
        // updated, and implemented to reduce round database round trips
        const existingUser = await User.findOne({
            $or: [
                { username },
                { email }
            ]
        });

        if (existingUser) {
            if (existingUser.username === username) {
                return res.status(409).json({
                    success: false,
                    message: "Username is already taken."
                });
            }

            if (existingUser.email === email) {
                return res.status(409).json({
                    success: false,
                    message: "Email is already registered."
                });
            }
        }

        // @youssef: Hash password
        const passwordHash = await bcrypt.hash(password, 12);

        // @youssef: Create user
        const user = await User.create({
            username,
            firstName,
            lastName,
            email,
            passwordHash,
            phone
        });

        // @youssef: Generate JWT
        const token = generateToken(user);

        return res.status(201).json({
            success: true,
            message: "User registered successfully.",
            token,
            user: formatUserResponse(user)
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });

    }
};

// @youssef: login controller
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // @youssef: Find user and include passwordHash
        const user = await User.findOne({ email }).select("+passwordHash");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        // @youssef: Compare passwords
        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.passwordHash
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        // @youssef: Prevent inactive users from logging in
        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: "Your account has been deactivated."
            });
        }

        // @youssef: Update last login
        user.lastLogin = new Date();

        await user.save();

        // @youssef: Generate JWT
        const token = generateToken(user);

        return res.status(200).json({
            success: true,
            message: "Login successful.",
            token,
            user: formatUserResponse(user)
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });

    }
};

const getCurrentUser = async (req, res) => {
    try {

        return res.status(200).json({
            success: true,
            user: formatUserResponse(req.user)
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });

    }
};

module.exports = {
    register,
    login,
    getCurrentUser
};