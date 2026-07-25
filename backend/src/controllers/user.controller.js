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

module.exports = {
    getProfile
};