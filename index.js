const express = require('express')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

//middleware

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yftux.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/', (req, res) => res.send('Hello World!'))


async function run() {
    try {
        await client.connect();
        const database = client.db("cycleDatabase");
        const cycleCollection = database.collection("allCycles");
        const cycleBookings = database.collection("allBookings")
        const reviewCollection = database.collection("allReviews")
        const usersCollection = database.collection("allUsers")
        // GET API
        app.get('/allCycles', async (req, res) => {
            const cursor = cycleCollection.find({});
            const cycles = await cursor.toArray();
            res.send(cycles);
        })
        // Single user api
        app.get('/bookingDetail/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await cycleCollection.findOne(query);
            res.send(result);
        })
        //cycleBookings
        app.post('/cycleBookings', async (req, res) => {
            const newUser = req.body;
            const result = await cycleBookings.insertOne(newUser);
            console.log('got new user', req.body);
            console.log('added new user', result);
            res.send(result);

        })
        //get all cycle bookings admin
        app.get('/cycleBookings', async (req, res) => {
            const cursor = cycleBookings.find({});
            const allCyclesBookings = await cursor.toArray();
            res.send(allCyclesBookings);
        })
        //my orders
        app.get("/cycleBookings/:email", async (req, res) => {
            console.log(req.params.email);
            const result = await cycleBookings
                .find({ email: req.params.email })
                .toArray();
            res.send(result);
        });
        // post reviews
        app.post('/allReviews', async (req, res) => {
            const newUser = req.body;
            const result = await reviewCollection.insertOne(newUser);
            console.log('got new user', req.body);
            console.log('added new user', result);
            res.send(result);

        })
        //get reviews
        app.get('/allReviews', async (req, res) => {
            const cursor = reviewCollection.find({});
            const reviews = await cursor.toArray();
            res.send(reviews);
        })
        // all users post
        app.post("/addUserInfo", async (req, res) => {
            console.log("req.body");
            const result = await usersCollection.insertOne(req.body);
            res.send(result);
            console.log(result);
        });
        //all users get 
        app.get('/allUsers', async (req, res) => {
            const cursor = usersCollection.find({});
            const allUsers = await cursor.toArray();
            res.send(allUsers);
        })

        //  make admin

        app.put("/makeAdmin", async (req, res) => {
            const filter = { email: req.body.email };
            const result = await usersCollection.find(filter).toArray();
            if (result) {
                const documents = await usersCollection.updateOne(filter, {
                    $set: { role: "admin" },
                });
                console.log(documents);
            }
            res.send(result);
            // else {
            //   const role = "admin";
            //   const result3 = await usersCollection.insertOne(req.body.email, {
            //     role: role,
            //   });
            // }

            // console.log(result);
        });
        // check admin or not
        app.get("/checkAdmin/:email", async (req, res) => {
            const result = await usersCollection
                .find({ email: req.params.email })
                .toArray();
            console.log(result);
            res.send(result);
        });

        // add a booking post
        app.post('/allCycles', async (req, res) => {
            const newCycle = req.body;
            const result = await cycleCollection.insertOne(newCycle);
            console.log('got new cycle', req.body);
            console.log('added new cycle', result);
            res.send(result);

        })
        // delte product from manage products
        app.delete('/allCycles/:id', async (req, res) => {
            const product = req.params.id;
            const query = { _id: ObjectId(product) };
            const result = await cycleCollection.deleteOne(query);
            console.log('deleting product', product);
            res.json(result);
        })
        // delete user cycle bookings by admin
        app.delete('/cycleBookings/:id', async (req, res) => {
            const product = req.params.id;
            const query = { _id: ObjectId(product) };
            const result = await cycleBookings.deleteOne(query);
            console.log('deleting product', product);
            res.json(result);
        })
        // update order status by admin
        app.put("/cycleBookings/:id", async (req, res) => {
            const id = req.params.id;
            const updatedStatus = 'Shipped';
            console.log(updatedStatus);
            const filter = { _id: ObjectId(id) };
            const updateInfo = {
                $set: {
                    status: updatedStatus,
                },
            };
            const result = await cycleBookings.updateOne(filter, updateInfo);
            console.log(result);
            res.send(result);
        })
    } finally {
        // await client.close();
    }
}
run().catch(console.dir);



app.listen(port, () => console.log(`Example app listening on port ${port}!`))