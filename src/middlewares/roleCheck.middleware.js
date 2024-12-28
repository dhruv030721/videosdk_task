const roleCheckMiddleware = (roles) => {
    return (req, res, next) => {
        try{
    
            if(roles.includes(req.user.role)){
                return res.status(403).json({
                    success: false,
                    message: "You don't have permission to perform this action"
                })
            }

            next();
            
    
        } catch(error){
            console.log(error);
            return res.status(500).json({
                success: false,
                message: "Internal Server Error!"
            })
        }
    }
}

module.exports = roleCheckMiddleware;