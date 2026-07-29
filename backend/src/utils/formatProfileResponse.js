const formatProfileResponse = (user) => ({
    id: user._id,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    role: user.role,
    addresses: user.addresses,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
});

module.exports = formatProfileResponse;