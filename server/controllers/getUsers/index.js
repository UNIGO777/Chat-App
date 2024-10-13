const User = require('../../models/user'); // Assuming you have a User model defined

const getAllUsers = async (req, res) => {
    try {
        const Users = await User.find({});
        const UsersWithoutSensitiveInfo = Users.map((user) => {
            const { password, token,phone, ...userWithoutSensitiveInfo } = user.toObject();
            return userWithoutSensitiveInfo;
        });
        res.status(200).json(UsersWithoutSensitiveInfo);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving users', error });
    }
};

module.exports = { getAllUsers };
