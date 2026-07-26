// utils/formatUserResponse.js

const formatUserResponse = (user) => ({
    id: user._id,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role
});

module.exports = formatUserResponse;