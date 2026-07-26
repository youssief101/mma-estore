const bcrypt = require("bcrypt");
const User = require("../models/User");
const Address = require("../models/Address");
// const Address = require("../models/Address");
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

const getAddresses = async (req, res) => {
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
            count: user.addresses.length,
            addresses: user.addresses
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};

const addAddress = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        if (user.addresses.length === 0) {
            req.body.isDefault = true;
        }

        const {
            fullName,
            phone,
            country,
            city,
            street,
            building,
            governorate,
            apartment,
            postalCode,
            isDefault
        } = req.body;

        if (isDefault) {
            await Address.updateMany(
                {
                    _id: { $in: user.addresses }
                },
                {
                    isDefault: false
                }
            );
        }
        const address = await Address.create({
            userID: user._id,
            fullName,
            phone,
            country,
            city,
            street,
            building,
            governorate, 
            apartment,
            postalCode,
            isDefault
        });
        user.addresses.push(address._id);
        await user.save();
        return res.status(201).json({
            success: true,
            message: "Address added successfully.",
            address
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};

const updateAddress = async (req, res) => {
    try {

        const { addressId } = req.params;

        const address = await Address.findById(addressId);

        if (!address) {
            return res.status(404).json({
                success: false,
                message: "Address not found."
            });
        }

        if (address.userID.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to update this address."
            });
        }

        const {
            fullName,
            phone,
            country,
            governorate,
            city,
            street,
            building,
            apartment,
            postalCode,
            isDefault
        } = req.body;

        if (isDefault) {
            await Address.updateMany(
                {
                    userID: req.user._id,
                    _id: { $ne: addressId }
                },
                {
                    isDefault: false
                }
            );
        }

        address.fullName = fullName ?? address.fullName;
        address.phone = phone ?? address.phone;
        address.country = country ?? address.country;
        address.governorate = governorate ?? address.governorate;
        address.city = city ?? address.city;
        address.street = street ?? address.street;
        address.building = building ?? address.building;
        address.apartment = apartment ?? address.apartment;
        address.postalCode = postalCode ?? address.postalCode;

        if (typeof isDefault === "boolean") {
            address.isDefault = isDefault;
        }

        await address.save();

        return res.status(200).json({
            success: true,
            message: "Address updated successfully.",
            address
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
    changePassword,
    getAddresses,
    addAddress,
    updateAddress
};
