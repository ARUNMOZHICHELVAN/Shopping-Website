const mongoose = require('mongoose')
const Schema = mongoose.Schema


const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        allowNull: false
    },
    email: {
        type: String,
        required: true,
        allowNull: false
    },
    password: {
        type: String,
        required: true,
        allowNull: false
    },
    Cart_products: {
        type: Array,
        required: true
    }

})
const userDetails = mongoose.model('userDetails', userSchema)
module.exports = userDetails;