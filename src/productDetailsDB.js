const mongoose=require('mongoose')
const Schema=mongoose.Schema
const productSchema=new Schema({
    id:{
        type:String,
        required:true,
        allowNull:false
    },
    product_name:{
        type:String,
        required:true,
        allowNull:false
    },
    product_price:{
        type:String,
        required:true,
        allowNull:false
    },
    quantity:{
        type:Number,
        required:true,
        allowNull:false
    },
    url:{
        type:String,
        required:true,
        allowNull:false
    },
    city:{
        type:Array,
        required:true,
        allowNull:false
    }
})

const productDetails=mongoose.model('productDetails',productSchema)
module.exports=productDetails