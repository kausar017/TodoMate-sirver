const express = require('express')
const app = express()
require('dotenv').config()
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000;

// middleware
app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.quedl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    const userCollection = client.db('taskDB').collection('users')
    const taskCollection = client.db('taskDB').collection('tasks')

    // user related apis
    app.post('/users', async (req, res) => {
      const user = req.body;
      console.log(user);
      const isExist = await userCollection.findOne({ email: user?.email })
      if (isExist) {
        return res.status(409).send({ message: "User already exists." });
      }
      const result = await userCollection.insertOne(user);
      res.send(result)
    })

    // task related apis
app.get('/tasks',async(req,res)=>{
  const result  = await taskCollection.find().toArray();
  res.send(result);
})

    app.post('/tasks', async (req, res) => {
      const task = req.body;
      const result = await taskCollection.insertOne(task);
      res.send(result);
    })




    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('TodoMate Server running!')
})

app.listen(port, () => {
  console.log(`Task Server running on port ${port}`)
})