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
    },
    Address:{
        type:Array,
        required:false
    },
    // since if the user wants to remove some products from the current order alone and not from the cart 
    // then it will be easy if there is a seperate entry
    Order_products:{
        type:Array,
        required:false
    }

})
const userDetails = mongoose.model('userDetails', userSchema)
module.exports = userDetails;

