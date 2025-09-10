import express from 'express';
import {MongoClient, ReturnDocument, ServerApiVersion} from "mongodb";
import { version } from 'react';

let db;

async function connectToDB(){
  const uri = 'mongodb://127.0.0.1/27017';

  const client = new MongoClient(uri, {
    ServerApi:{
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true
    }
  });

  await client.connect();

  db = client.db("full-stack-react-db");
}

const articleInfo = [
  {name: 'learn-react',upvotes:0, comments:[]},
  {name: 'learn-nodejs',upvotes:0, comments:[]},
  {name: 'learn-mongodb',upvotes:0, comments:[]}
]

const app = express();
const PORT = 3000;
app.use(express.json());


app.get("/api/articles/:name", async (req,res)=>{
  const {name} = req.params;

  const article = await db.collection('articles').findOne({name});

  res.send(article);
});

app.post("/api/articles/:name/upvote",async (req,res)=>{
  const {name} = req.params;
  const updatedArticle = await db.collection("articles").findOneAndUpdate({name}, {
    $inc: {upvotes: 1}
  },{
    returnDocument: "after"
  })
  res.send(updatedArticle);
});

app.post("/api/articles/:name/comments",async (req,res)=>{
  const {name} = req.params;
  const {postedBy, text} = req.body;
  const newComments = {postedBy,text};


  const updatedArticle = await db.collection("articles").findOneAndUpdate({name},{
    $push: {comments: newComments}
  },{
    returnDocument: "after"
  });

  res.send(updatedArticle);
});

async function start(){
  await connectToDB();

  app.listen(PORT, ()=>{
    console.log(`Server listening on port ${PORT}...`);
  });
}

start();