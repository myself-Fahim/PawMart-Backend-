const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = 4000

app.use(cors())
app.use(express.json())



const uri = "mongodb+srv://PawMart:ndeHZ1RbcDi5RS4u@cluster0.konzx.mongodb.net/?appName=Cluster0";
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
    
    await client.connect();
    
    // Database create
     const database = client.db('PawMart')
     const dataCollection = database.collection('AddList');
     const dataCollection2 = database.collection('Order')
    
    // Data post to database
    app.post('/addlist',async (req,res)=>{
      const data = req.body
     const result = await dataCollection.insertOne(data)
      res.send(result)
    })

    // Get list item from database
    app.get('/addlist', async (req,res)=>{
         const result = await dataCollection.find().toArray()
         res.send(result)
    })

    app.get('/listdetails/:id', async(req,res)=>{
      const id = req.params.id
      const query = {_id: new ObjectId(id)}
      const result = await dataCollection.findOne(query)
      res.send(result)
    })

    app.post('/order', async (req,res) =>{
      const data = req.body;
      const result = await dataCollection2.insertOne(data)
      res.send(result)
    })



    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } 
  
  finally {
   
    // await client.close();
  }
}
run().catch(console.dir);








app.get('/',(req,res)=>{
    res.send('Server is running')
})

app.listen(port,()=>{
    console.log(`Server Running from port:${port}`);
    
})