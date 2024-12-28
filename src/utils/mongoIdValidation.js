const mongoose = require('mongoose')

const validMongodoId = (id) => {
    return  mongoose.Types.ObjectId.isValid(id);
}


module.exports = {validMongodoId}