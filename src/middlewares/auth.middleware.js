const jwt = require('jsonwebtoken')

const authMiddleware = async (req, res, next) => {
    try {

        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(404).json({
                success: false,
                message: "Authentication Failed, Token not found!"
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        req.user = decoded;
        next();

    } catch (error) {
        console.log(error);
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Token expired!",
                expiredAt: error.expiredAt 
            });
        }

        res.status(500).json({
            success: false,
            message: "Internal Server Error!"
        });
    }
}

module.exports = authMiddleware;