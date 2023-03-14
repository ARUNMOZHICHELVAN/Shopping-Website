const express = require('express')
const RazorPay = require('razorpay')
const shortid = require('shortid')
const cors = require('cors');
const ngrok = require('ngrok')
const mongoose = require('mongoose')
const bodyparser = require('body-parser')
const fs = require('fs')
const filePath = './src/data.json';
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const jwt_decode = require('jwt-decode');
// const productData=require('./src/data.json')
const session = require('cookie-session')
const userDetails = require('./dbformat')
var productDetails=require('./src/productDetailsDB')
const orderDetails = require('./Ordersformat')



require("dotenv").config();



const app = express()
const { Server } = require('socket.io')
const http = require('http');
const { json } = require('body-parser');
const process = require('process');
const PORT = process.env.PORT_NO || 5000
const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000'
    }
})
io.on('connection', (socket) => {
    console.log('client-connnecteed', socket.id);
})


// app.use(passp

app.use(cors({
    origin: 'https://shopping-amc.vercel.app'
}));

// MongoDB Connection   



mongoose.connect(
    process.env.MONGODB_URI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
);

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())




var instance = new RazorPay({
    key_id: 'rzp_test_LbxCLSZLFeb3gR',
    key_secret: 'W08GhAaJwA4WkLc37LsRFgrh'
})

server.listen(PORT, (req, res) => {
    console.log("Backend");
})

app.get('/', (req, res) => {

    res.send('ok');
})

app.post('/data', (req, res) => {
    const d = payment.collection.find().sort({ _id: -1 }).limit(1)
    console.log("Data in database ", d)
    res.json(d)
})
app.get('/verification', (req, res) => {
    res.send('  ??')
})

//Creating a web hook data to store all the payments done(both captured and failed)



app.post('/verification', async (req, res) => {
    console.log("Web hook triggered and request body is  " + JSON.stringify(req.body))
    const secret = process.env.RAZORPAY_SECRET
    const crypto = require('crypto')
    const shasum = crypto.createHmac("sha256", secret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex");

    console.log(digest, req.headers["x-razorpay-signature"]);

    if (digest === req.headers["x-razorpay-signature"]) {
        console.log("POSTMAN ", req.body)
        // console.log("request is legit");
        const email = req.body.payload.payment.entity.email
        //The incoming email is the email that we used for payments 
        //This is differet from the email that we used to login in to our account
        const webhookData = await orderDetails.create({
            //normally --> ""soumyadey@example.com"" there will be 2 double quotes
            //Therefore slice them to bring --> "soumyadey@example.com"
            email: JSON.stringify(email).slice(1, -1),
            account_id: JSON.stringify(req.body.account_id).slice(1, -1),
            order_id: JSON.stringify(req.body.payload.payment.entity.order_id).slice(1, -1),
            amount: JSON.stringify(req.body.payload.payment.entity.amount),
            currency: JSON.stringify(req.body.payload.payment.entity.currency).slice(1, -1),
            cart_products: [],
            time_stamp: JSON.stringify(req.body.payload.payment.entity.created_at)
        })

        console.log(webhookData)
        const data_to_sent = { ...webhookData, captured: req.body.event === "payment.captured" ? true : false }
        console.log("data_to_be_sent", data_to_sent)

        io.emit('payment-details', JSON.stringify(data_to_sent))

    } else {

    }

    res.json({
        status: 'ok',
        details: req.body
    })
})

app.get('/getProductData',async(req,res) => {
    const user= await productDetails.find({});
    console.log(user);
    res.json(user)
})



app.post('/addOneToCart', async (req, res) => {
    console.log(req.body)


    userDetails.findOne({ email: req.body.email }, async (err, user) => {
        if (err) {
            console.log(err)
            res.json('User not found  1')
        }
        else {
            const cartProducts = user.Cart_products.find(product => product.id === req.body.item_id)
            console.log("CART PRODUCTS FOUND", cartProducts)
            if (cartProducts) {
                const { email, item_id, item_count } = req.body;
                const a = await userDetails.findOneAndUpdate({ email, "Cart_products.id": item_id }, {
                    $inc: { 'Cart_products.$.count': item_count }
                })
                res.json({ hello: a })
            }
            else {
                user.Cart_products.push({ id: req.body.item_id, count: req.body.item_count })
                user.save((err, updateUser) => {
                    if (err) {
                        console.log(err)
                        res.json('error in updating the database')
                    }
                    else {
                        console.log("updated User", updateUser)
                        res.json('Successfully update the database')
                    }
                })
            }
        }
    })



})



app.post('/getCartDB', (req, res) => {
    userDetails.findOne({ email: req.body.email })
  .then(user => {
    // after getting the products from the cart check if the count of each of the product
    // is less than the quantity in the json file coz it might have been updated while
    // making the payment
    return user.Cart_products; // Return the cart products array
  })
  .then(async(cartProducts) => {
    const productData= await productDetails.find({});
    console.log("Hey ARUN --> "+JSON.stringify(cartProducts))
    var newCartProducts = []
    cartProducts.forEach(element => {
        var quantity=productData.find(p => p.id === element.id).quantity
        console.log("quantity --> ",quantity)
        console.log("element.count --> ",element.count)
      if (element.count >quantity) {
        newCartProducts.push({ "id": element.id, "count": quantity }) // Use element.count instead of quantity
      } else {
        if(quantity-element.count!==0){
        newCartProducts.push({ "id": element.id, "count": element.count })

        }
      }
    });
  })
  .catch(err => res.json("unable to find"));

})

app.post('/deleteFromCart', async (req, res) => {
    console.log("req.body.item_id ", req.body.item_id)
    const data = await userDetails.updateOne(
        { email: req.body.email },
        { $pull: { Cart_products: { id: req.body.item_id } } }
    )
    console.log("data ", data)
    res.json('sucess ')
})


app.post('/getCart', (req, res) => {
    
    userDetails.findOne({ email: req.body.email }).then((user) => {
        res.json( user.Cart_products)
    })
        .catch((err) => {
            console.log("There is a error in getting the previously Stored Cart Items of the logged in user")
        })
})



app.post('/razorpay', async (req, res) => {
    console.log(" cart products ", JSON.stringify(req.body.cart_products))

    console.log("Request body " + req.body.amount_to_be_paid);
    try {
        const response = await instance.orders.create(
            {
                amount: (req.body.amount_to_be_paid * 100).toString(),
                currency: "INR",
                receipt: shortid.generate()//THIS IS JUST A RANDOM STRING returned when we console log the response
            })
        console.log("response23" + JSON.stringify(response))
        res.json({
            id: response.id,
            currency: response.currency,
            amount: response.amount,
        })
    } catch (e) {
        res.json({ e })
    }
})



app.post('/addCartProduct', async(req, res) => {
    //Explanation : First whenever a user makes payment Before redirecting to the Success page First an order is created
    //Then after redirecting to the Success page we just update the cart_products section of the freshly created order
    //Now as we have made payment and confirmed our order we should reduce the quantity section of the Final JSON file
    //But I think this logic fails if we need to add cancellig order feature for the placed order

    console.log("Cart products in server ", req.body)
    //Getting the current cart products of the user directly from the user
    const {Cart_products} = await userDetails.findOne({email:req.body.email})
    console.log("toUpdate is ", Cart_products)



    orderDetails.findOneAndUpdate(
        { email: req.body.email },
        { $set: { cart_products: Cart_products } },
        { sort: { time_stamp: -1 }, new: true }
    )
        .exec()
        .then(payment => {
            // console.log(payment)
        }
        )
        .catch(error => console.error(error));


    //Also update the quantity section of the json data so that the other user gets the live quantity details of the page
    Cart_products.forEach(async(element) => {
            
        const updatedProduct = await productDetails.findOneAndUpdate(
            { id: element.id },
            { $inc: { quantity: -element.count } },
            { new: true }
          );
          //Also update the cart products i.e if there are 10 products in the cart if an order of 6 is placed then only 
          //4 should be there in the cart now
        console.log("product updated successfully ", updatedProduct)
        if(updatedProduct.quantity<element.count){
            const updatedCartProduct=await userDetails.findOneAndUpdate({email:req.body.email , "Cart_products.id":element.id},
        {$set:{"Cart_products.$.count" :updatedProduct.quantity }})
        console.log("Cart updated Successfully  ",updatedCartProduct)
        } 


    });
    
    
    res.json({
        status: 'ok'
    })

})

//POST request to send all the Successfull orders that has been placed
app.post('/Orders', (req, res) => {
    orderDetails.find({ email: req.body.email }).sort({ _id: -1 })
        .then(result => {
            console.log("RESULT ", result)
            res.json(result)
        })
        .catch(err => {
            console.log("Error in getting the data from db in /Orders SERVER ", err)
        })

})

app.post('/Password-change', async (req, res) => {
    console.log(JSON.stringify(req.body))
    const { email, password, cpassword } = req.body
    console.log("email ", email)
    const x = await     ls.findOne({ email: email })
    if (!x) {
        res.json({ status: "Invalid Email" })
    }
    if (password !== cpassword) {
        res.json({ status: 'Passwords does not match' })
    }

    else {
        const newHash = bcrypt.hashSync(password, 10)
        const x = await userDetails.updateOne({ email: email }, { $set: { password: newHash } })
        console.log("x ", x)
        res.json({ status: "Password Changed Successfully" })
    }
})


app.post('/register', async (req, res) => {
    try {
        var emailExist = await userDetails.findOne({
            email: req.body.email
        })
        if (emailExist) {
            return res.status(400).json("Email already exist")
        }
        var hash = await bcrypt.hash(req.body.password, 10)
        const dataInDatabase = await userDetails.create({
            //Note --> store the hashed password
            name: req.body.email,
            email: req.body.email,
            password: hash,
            Cart_products: []
        })
        //sending the saved data 
        res.json(dataInDatabase)

    }
    catch (err) {
        res.json({ msg: "Error Occured in Server" })
    }

})


function validateUser(req, res, next) {
    console.log("req.headers", req.headers)
    var token = req.headers.auth
    if (!token) {
        return res.status(401).send({ auth: false, message: "No token" })
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        console.log("reques arun ", req)
        console.log("decoded ", decoded)
        if (err) {
            //always use send and return in middlewares
            return res.status(500).send({ auth: false, message: "Failed to authenticate" })
        }
        req.email = decoded.email
        next()
    })
}



app.post('/login', async (req, res) => {
    try {
        const userData = await userDetails.findOne({ email: req.body.email })
        if (!userData) {
            return res.status(400).json({ auth: false, msg: 'Email not Exists' })
        }
        var validPassword = await bcrypt.compareSync(req.body.password, userData.password)
        if (!validPassword) {
            return res.status(400).json({ auth: false, msg: 'Password not valid' })
        }
        //Now both the username and password are valid so we shoudl assign a token to the user
        //First generate the token using a payload in our case the payload is email
        var userToken = jwt.sign({ email: userData.email }, process.env.JWT_SECRET, {
            expiresIn: "2h",
        }
        )
        //keeping the generated token in the request header
        //REASON:When a client makes a request to the server, it can include the JWT in the header, 
        //which the server can then use to verify the authenticity of the request and determine the 
        //identity of the client. By setting the JWT in the header, it ensures that the authentication 
        // information is transmitted with each request, so the server can easily validate it 
        // without having to store session information on the server. This helps to maintain a secure and stateless architecture,
        //  as the server does not have to persist any client-specific data. 
        // console.log("req.headers", req.headers)
        // req.headers {
        //     'content-type': 'application/json',
        //     'user-agent': 'PostmanRuntime/7.30.0',
        //     accept: '*/*',
        //     'postman-token': 'c13fcfc2-0a94-4cf6-a774-511aee5a2190',
        //     host: 'localhost:5000',
        //     'accept-encoding': 'gzip, deflate, br',
        //     connection: 'keep-alive',
        //     'content-length': '73',
        //     cookie: 'connect.sid=s%3AQwEOmAbkmtR3YW1aRqoXAOhWgeEruXoF.ABVyRQ%2BcztiWJXV53rPQCRIs2RTV7Sd9XmpUjlz96go'
        //   }
        // console.log("response ", res)
        //Response :
        //         [Symbol(kCapture)]: false,
        //         [Symbol(kNeedDrain)]: false,
        //         [Symbol(corked)]: 0,
        //         [Symbol(kOutHeaders)]: [Object: null prototype] {
        //         'x-powered-by': [ 'X-Powered-By', 'Express' ],
        //         'access-control-allow-origin': [ 'Access-Control-Allow-Origin', 'http://localhost:3000' ],
        //         vary: [ 'Vary', 'Origin' ],
        //         auth: [
        //          'auth',
        //          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFydW5tb3poaWNoZWx2YW5zMUBnbWFpbC5jb20iLCJpYXQiOjE2NzU2OTg0NDMsImV4cCI6MTY3NTcwNTY0M30.NfCMY7bVSY6LI3QnqqDZ4VN112Sv6bUhbSfw3VlxKyU' 
        //     ]
        //   },
        //   [Symbol(kUniqueHeaders)]: null


        res.status(200).send({ auth: true, token: userToken })
        //Sending tokens to the client so it saves it and uses it for every request to the server
    }
    catch (err) {
        console.log("Error occured in assigning a token ", err)
    }


})

// app.post('/getall', validateUser, async (req, res, next) => {
//     //Never include passwords in the response
//     console.log("request comming into get all POST REQUEST", req)
//     //do not include passwords while returning
//     const user = await userDetails.findOne({ email: req.email }, { password: 0 })
//     if (!user) {
//         res.send("No user found")
//     }
//     //send the user which contains everything except the passwords
//     res.status(200).send(user)
// })

