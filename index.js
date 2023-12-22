const express = require('express')
const app = express()
exports.app = app
require('dotenv').config()
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb')
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

// task-manager
// nR90Pml0DqBGGDm6

const client = new MongoClient(process.env.DB_URI, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  })
  async function run() {
    try {
  
      const tasksCollection = client.db('Task-management').collection('tasks')

      app.post('/tasks', async(req,res)=>{
        const tasks = req.body ;
        const result = await tasksCollection.insertOne(tasks)
        res.send(result)
      })
  
      // Send a ping to confirm a successful connection
      await client.db('admin').command({ ping: 1 })
      console.log(
        'Pinged your deployment. You successfully connected to MongoDB!'
      )
    } finally {
      // Ensures that the client will close when you finish/error
      // await client.close();
    }
  }
  run().catch(console.dir)


app.get('/', (req, res) => {
    res.send('Hello from task-manager Server..')
  })
  
  app.listen(port, () => {
    console.log(`Task-Manager is running on port ${port}`)
  })