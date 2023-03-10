require('dotenv').config()
const { ObjectId } = require('mongodb')
const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000;  
const bodyParser = require('body-parser')
const { MongoClient, ServerApiVersion } = require('mongodb');


//nb3amjtQWhSN6ibH

const client = new MongoClient(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
app.use(bodyParser.urlencoded({ extended: true }))

app.set('view engine', 'ejs');

async function cxnDB(){

  try{
    client.connect; 
    const collection = client.db("testDB").collection("fruit_name");
    // const collection = client.db("papa").collection("dev-profiles");
    const result = await collection.find().toArray();
    //const result = await collection.findOne(); 
    console.log("cxnDB result: ", result);
    return result; 
  }
  catch(e){
      console.log(e)
  }
  finally{
    client.close; 
  }
}


app.get('/', async (req, res) => {

  let result = await cxnDB().catch(console.error); 

  // console.log("get/: ", result);

  res.render('index', {  fruitData : result })
})

//CREATE

app.get('/create', async (req, res) => {

  //get data from the form 

  console.log("in get to slash update:", req.query.ejsFormName); 
  fruit_input = req.query.ejsFormName; 

  //update in the database. 
  client.connect; 
  const collection = client.db("testDB").collection("fruit_name");
  await collection.insertOne({ 
    fruit: fruit_input
})
.then(result => {
  console.log(result); 
  res.redirect('/');
})

})

//READ

app.get('/mongo', async (req, res) => {

  // res.send("check your node console, bro");

  let result = await cxnDB().catch(console.error); 

  console.log('in get to slash mongo', result[1].fruit_name); 

  res.send(`here ya go, joe. ${ result[1].fruit_name }` ); 

})

//UPDATE

app.post('/updateFruit/:id', async (req, res) => {

  try {
    console.log("req.parms.id: ", req.params.id) 
    
    client.connect; 
    const collection = client.db("testDB").collection("fruit_name");
    let result = await collection.findOneAndUpdate(
      {"_id": new ObjectId(req.params.id)}, {$set:{fruit : "NewFruit"}})
    .then(result => {
      console.log(result); 
      res.redirect('/');
    })
    .catch(error => console.error(error))
  }
  finally{
    //client.close()
  }

})

// DELETE

app.post('/deleteFruit/:id', async (req, res) => {

  try {
    console.log("req.parms.id: ", req.params.id) 
    
    client.connect; 
    const collection = client.db("testDB").collection("fruit_name");
    let result = await collection.findOneAndDelete( 
      {"_id": new ObjectId(req.params.id)}, {$set:{fruit : ""}})
    
    .then(result => {
      console.log(result); 
      res.redirect('/');
    })
    .catch(error => console.error(error))
  }
  finally{
    //client.close()
  }

})


console.log('in the node console');

app.listen(PORT, () => {
  console.log(`Example app listening on port ${ PORT }`)
})