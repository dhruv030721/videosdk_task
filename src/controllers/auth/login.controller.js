const User = require('../../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(403).json({
                success: false,
                message: "Validation Error! Kindly check the details."
            });
        }

        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found!"
            });
        }

        const passwordComparison = await bcrypt.compare(password, user.password);

        user.password = undefined;

        if (passwordComparison) {
            const token = jwt.sign(
                { userId: user._id, username: user.username, role: user.role }, 
                process.env.JWT_SECRET,
                { expiresIn: '1h' } 
            );

            if (!token) {
                return res.status(400).json({
                    success: false,
                    message: "Something went wrong while creating the token, try again later!"
                });
            }

            return res.cookie('invoice_generator_user_token', token, {
                httpOnly: true,
            }).status(200).json({
                success: true,
                message: "User logged in successfully!"
            });
        }

        // Incorrect password handling
        return res.status(401).json({
            success: false,
            message: "Incorrect password!"
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error!"
        });
    }
};

module.exports = login;
