const express = require("express")
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || "5000"
const cors = require("cors");
app.use(cors())
app.use(express.json())
const jwt = require("jsonwebtoken")
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// const verifyToken = (req,res)=>{


// }    


const run = async () => {
    try {
        await client.connect()
        const templateCollection = client.db("templates").collection('template')
        const userCollection = client.db("userInfo").collection('user')
        const orderCollection = client.db("order").collection('orders info')

        app.get('/alltemplates', async (req, res) => {

            const templates = await templateCollection.find().toArray()

            res.send(templates)
        })

        app.get('/template/:id', async (req, res) => {

            const id = req.params.id;
            const query = { _id: ObjectId(id) }

            const result = await templateCollection.findOne(query)
            res.send(result)

        })

        // //post cart collection

        // app.post('/cart', async (req, res) => {
        //     const cartInfo = req.body;
        //     const result = await cartCollection.insertOne(cart);
        //     res.send(result)

        // })

        // //getcart cart 
        // app.get('/cart', async (req, res) => {
        //     const query = {}
        //     const result = await cartCollection.find(query).toArray()
        //     res.send(result)
        // })


        //post seller info
        app.put('/user/:email', async (req, res) => {
            const user = req.body;
            const email = req.params.email;

            const filter = { email: email }
            const options = { upsert: true }
            const updateDoc = {
                $set: user
            }
            const result = await userCollection.updateOne(filter, updateDoc, options);
            const token = jwt.sign({ user }, process.env.JWT_SECRET_TOKEN, {
                expiresIn: "7d"
            })

            res.send({ result, token: token })


        })
        //post seller info set
        app.put('/makecustomer/:email', async (req, res) => {
            const role = 'customer'

            const email = req.params.email;
            const filter = { email: email }
            const options = { upsert: true }
            const updateDoc = {
                $set: { role }
            }
            const result = await userCollection.updateOne(filter, updateDoc, options);
            res.send({ result })

        })

        //order 

        app.put('/order', async (req, res) => {
            const orderInfo = req.body;

            // const newOrderInfo = orderInfo.forEach(product => {
            //     const productId = product._id;
            //     product.orderId = productId;
            //     return product
            // });

            // console.log(newOrderInfo);

            const newOrderInfo = orderInfo.filter(order => {
                return delete order._id
            })

            const result = await orderCollection.insertMany(newOrderInfo)
            res.send(result)
        })

        //get order
        app.get('/order', async (req, res) => {
            const query = {}
            const result = await orderCollection.find(query).toArray()
            res.send(result)
        })

        //delte order
        app.delete('/order/:id', async (req, res) => {
            const id = req.params.id;

            const query = { _id: ObjectId(id) }
            const remainingItems = await orderCollection.deleteOne(query);

            res.send(remainingItems)

        })



    }

    finally {
        // client.close()
    }

}

run().catch(console.dir)
app.get('/', (req, res) => {
    res.send("Welcome to Markite Digital")
})


app.listen(port, () => {
    console.log("markite digital is running");
})



// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zo2yn.mongodb.net/?retryWrites=true&w=majority`;
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
