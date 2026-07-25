const bcrypt = require("bcrypt");
const User = require("../models/User");
const formatProfileResponse = require("../utils/formatProfileResponse");

const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .populate("addresses");
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }
        return res.status(200).json({
            success: true,
            user: formatProfileResponse(user)
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};

const updateProfile = async (req, res) => {
    try {
        const {
            username,
            firstName,
            lastName,
            email,
            phone
        } = req.body;
        console.log("req.user:", req.user);
        console.log("req.user._id:", req.user?._id);
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }
        // Check username and email uniqueness in one query
        if (
            (username && username !== user.username) ||
            (email && email !== user.email)
        ) {
            const duplicateUser = await User.findOne({
                _id: { $ne: req.user._id },
                $or: [
                    { username },
                    { email }
                ]
            });
            if (duplicateUser) {

                if (
                    username &&
                    duplicateUser.username === username
                ) {
                    return res.status(409).json({
                        success: false,
                        message: "Username is already taken."
                    });
                }

                if (
                    email &&
                    duplicateUser.email === email
                ) {
                    return res.status(409).json({
                        success: false,
                        message: "Email is already registered."
                    });
                }
            }
        }
        if (username !== undefined)
            user.username = username;
        if (firstName !== undefined)
            user.firstName = firstName;
        if (lastName !== undefined)
            user.lastName = lastName;
        if (email !== undefined)
            user.email = email;
        if (phone !== undefined)
            user.phone = phone;

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully.",
            user: formatProfileResponse(user)
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });

    }
};

const changePassword = async (req, res) => {
    try {
        const {
            currentPassword,
            newPassword
        } = req.body;
        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Current password and new password are required."
            });
        }
        const user = await User.findById(req.user._id)
            .select("+passwordHash");
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }
        const isCurrentPasswordCorrect = await bcrypt.compare(
            currentPassword,
            user.passwordHash
        );
        if (!isCurrentPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: "Current password is incorrect."
            });
        }
        const isSamePassword = await bcrypt.compare(
            newPassword,
            user.passwordHash
        );
        if (isSamePassword) {
            return res.status(400).json({
                success: false,
                message: "New password must be different from the current password."
            });
        }
        user.passwordHash = await bcrypt.hash(newPassword, 12);
        await user.save();
        return res.status(200).json({
            success: true,
            message: "Password changed successfully."
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
    getProfile,
    updateProfile,
    changePassword
};