const mongoose = require('mongoose')
const Schema = mongoose.Schema

const paymentSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    account_id: {
        type: String,
        required: true
    },
    order_id: {
        type: String,
        required: true
    },
    amount: {
        type: String,
        required: true
    },
    currency: {
        type: String,
        required: true
    },
    cart_products: {
        type: Array,
        required: true
    },

    time_stamp: {
        type: String,
        required: true
    }

})

const orderDetails = mongoose.model('user', paymentSchema)
module.exports = orderDetails;