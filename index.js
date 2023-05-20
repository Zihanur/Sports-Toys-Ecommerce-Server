const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());
//sportsToy
//N2ztIyVgSSMqsT42

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0eicqxw.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    //collections
    const sportsToyoysCollection = client
      .db("sportsToysDB")
      .collection("sportsToys");
    const allToysCollection = client.db("sportsToysDB").collection("allToys");
    const myToysCollection = client.db("sportsToysDB").collection("myToys");

    //home page toys category
    app.get("/toys", async (req, res) => {
      const result = await sportsToyoysCollection.find().toArray();
      res.send(result);
    });

    //all toys
    app.get("/alltoys", async (req, res) => {
      const result = await allToysCollection.find().toArray();
      res.send(result);
    });

    app.get("/alltoys/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await allToysCollection.findOne(query);
      res.send(result);
    });

    //my toys
    app.post("/mytoys", async (req, res) => {
      const mytoys = req.body;
      console.log(mytoys);
      const result = await myToysCollection.insertOne(mytoys);
      res.send(result);
    });

    app.get("/mytoys", async (req, res) => {
      const result = await myToysCollection.find().toArray();
      res.send(result);
    });

    app.delete("/mytoys/:id", async (req, res) => {
      const id = req.params.id;
      const insert = {_id: new ObjectId(id)}
      const result = await myToysCollection.deleteOne(insert);
      res.send(result)
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Toy server is running");
});

app.listen(port, () => {
  console.log(`app listening port: ${port}`);
});
