const express = require('express')
const app = express()
exports.app = app
require('dotenv').config()
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())



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

    //add new task
    app.post('/tasks', async (req, res) => {
      const tasks = req.body;
      const result = await tasksCollection.insertOne(tasks)
      res.send(result)

      //get tasks
    })
    app.get('/tasks', async (req, res) => {
      const result = await tasksCollection.find().toArray()
      res.send(result)
    })

//get task by email
    app.get('/tasks/:email', async (req, res) => {
      const email = req.params.email;
      const query = { email: email }
      const result = await tasksCollection.find(query).toArray()
      res.send(result)
    })



    app.get('/tasks/ongoing/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) }
        const result = await tasksCollection.findOne(query);
        res.send(result);
      }
      catch (error) {
        console.log(error);
      }
    })



    app.patch('/task/ongoing/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedDoc = {
        $set: {
          status: 'ongoing'
        }
      }
      const result = await tasksCollection.updateOne(filter, updatedDoc)
      res.send(result)
    })
    app.patch('/task/complete/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedDoc = {
        $set: {
          status: 'complete'
        }
      }
      const result = await tasksCollection.updateOne(filter, updatedDoc)
      res.send(result)
    })
    app.patch('/task/todo/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedDoc = {
        $set: {
          status: 'todo'
        }
      }
      const result = await tasksCollection.updateOne(filter, updatedDoc)
      res.send(result)
    })



    app.patch('/tasks/:id', async (req, res) => {
      try {
          const task = req.body;
          const id = req.params.id;
          const filter = { _id: new ObjectId(id) }
          const updatedDoc = {
              $set: {
                  name: task.name,
                  email: task.email,
                  priority: task.priority,
                  title: task.title,
                  taskDescription: task.taskDescription
              }
          }
          const result = await tasksCollection.updateOne(filter, updatedDoc)
          res.send(result);
      } catch {
          error => console.log(error)
      }
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

