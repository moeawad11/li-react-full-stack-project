import express from 'express';

const articleInfo = [
  {name: 'learn-react',upvotes:0, comments:[]},
  {name: 'learn-nodejs',upvotes:0, comments:[]},
  {name: 'learn-mongodb',upvotes:0, comments:[]}
]

const app = express();
const PORT = 3000;
app.use(express.json());

app.post("/api/articles/:name/upvote",(req,res)=>{
  const article = articleInfo.find(a=>a.name===req.params.name);
  article.upvotes++; 
  res.send({article});
});

app.post("/api/articles/:name/comments",(req,res)=>{
  const {name} = req.params;
  const {postedBy, text} = req.body;

  const article = articleInfo.find(a=>a.name===req.params.name);

  article.comments.push({
    postedBy,
    text,
  });

  res.send({article});
});

app.listen(PORT, ()=>{
  console.log(`Server listening on port ${PORT}...`);
});