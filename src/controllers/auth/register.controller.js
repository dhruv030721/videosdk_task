const bcrypt = require('bcrypt');
const User = require('../../models/user');

const register = async (req, res) => {
    try {
        const { username, password, email } = req.body;

        if (!username || !password || !email) {
            return res.status(403).json({
                success: false,
                message: "Validation Error! Kindly request to checkout details."
            });
        }

        const existingUser = await User.findOne({ $or: [{ username }, { email }] });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User with this username or email already exists."
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            username,
            password: hashedPassword,
            email
        });

        if (!newUser) {
            return res.status(400).json({
                success: false,
                message: "Something went wrong while creating the user, please try again later."
            });
        }

        return res.status(201).json({
            success: true,
            message: "New user created successfully!",
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error!"
        });
    }
};

module.exports = register;
