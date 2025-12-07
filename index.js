const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express()
const port = 4000

app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.konzx.mongodb.net/?appName=Cluster0`;
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

    app.get('/mylistings/:email', async(req,res) =>{
      const myEmail = req.params.email
      const query = {email:myEmail}
      const result = await dataCollection.find(query).toArray()
      res.send(result)
    })

    app.get('/myorders/:email', async(req,res)=>{
      const myEmail = req.params.email
      const query = {email:myEmail}
      const result = await dataCollection2.find(query).toArray()
      res.send(result)
    })

    app.delete('/delete/:id', async (req,res)=>{
      const myId = req.params.id;
      const query = {_id: new ObjectId(myId) }
      const result = await dataCollection.deleteOne(query)
      res.send(result)
    })
    app.put('/update/:id', async (req,res)=>{
      const data = req.body
      const myId = req.params.id
      const query = {_id:new ObjectId(myId)}
      const updatedData = {
        $set:data
      }
      const result = await dataCollection.updateOne(query,updatedData)
    })

    app.get('/categories/:categoryName',async (req,res)=>{
      const myCategory = req.params.categoryName
      const query = {category:myCategory}
      const result = await dataCollection.find(query).toArray()
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