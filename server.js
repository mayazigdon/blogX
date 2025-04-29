import express from 'express';
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { render } from 'ejs';
var email = "maya@gmail.com"
var password = "maya";
const username = "kitty cat" ;
var isValid = false;
var myPosts = new Map();
console.log("my posts",myPosts);
var posts = {
    "Lucky": {
        "26/04/2025 16:29": "hello everyone!"}
    ,
    "Mickey Mouse": {
        "27/04/2025 07:08": "good morning", "27/04/2025 14:05": "i would like to get some cheese"
    }
};

var images = {"Lucky" : "/puppy-1207816_1280-560x360.webp", "kitty cat": "/Abby+kitten.png", "Mickey Mouse": "/images.png"}

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.render(__dirname+"/views/login.ejs",{posts:posts,myPosts:myPosts,username:username,images:images});
  });

  app.get("/post", (req,res) => {
    res.render(__dirname+"/views/post.ejs");
});

app.get("/contact", (req,res) => {
    res.render(__dirname+"/views/contact.ejs");
});

app.get("/about", (req,res) => {
    res.render(__dirname+"/views/about.ejs");
});

app.get("/home", (req,res) => {
    res.render(__dirname+"/views/index.ejs",{posts:posts,myPosts:myPosts,username:username,images:images});
});

app.get("/profile", (req,res) => {
    res.render(__dirname+"/views/profile.ejs",{myUsername:username, myPosts:myPosts});
});

app.post("/editPost",(req,res)=>{
    res.render(__dirname+"/views/editPost.ejs",{key:req.body.key, myPosts:myPosts});
});

app.post("/deletePost",(req,res)=>{
    myPosts.delete(req.body.key);
    res.render(__dirname+"/views/index.ejs",{posts:posts,myPosts:myPosts,username:username,images:images});
});

app.post("/saveNewText",(req,res)=>{
    myPosts.set(req.body.key, req.body.textPost);
    res.render(__dirname+"/views/index.ejs",{posts:posts,myPosts:myPosts,username:username,images:images})
});

app.get("/sign-up",(req,res)=>{
    res.render(__dirname+"/views/sign-up.ejs");
})

app.post("/get-in",(req,res)=>{
    if(req.body.password == req.body.verifyPassword){
        email = req.body.email;
        password = req.body.password;
        res.render(__dirname+"/views/index.ejs",{posts:posts,myPosts:myPosts,username:username,images:images});
    }
    else{
        res.render(__dirname+"/views/sign-up.ejs",{ error: "Passwords don't match" })
    }

});

function pad(n) {
    return n < 10 ? '0' + n : n;
  }
  

app.post("/post",(req,res)=>{
    let now = new Date();
    let formattedDate = now.toLocaleDateString('en-IL');
    let hour = pad(now.getHours());
    let minutes = pad(now.getMinutes());
    let time = formattedDate +" " + String(hour) + ":" + String(minutes);
    myPosts.set(time,req.body.textPost); 
    res.render(__dirname+"/views/index.ejs",{posts:posts,myPosts:myPosts,username:username,images:images});
});



function verifyPassword(req){
    if (req.body.password == password && req.body.email == email){
        isValid = true;
    }
}

app.post("/log-in", (req, res) => { 
    verifyPassword(req);

    if(isValid) {
        res.render(__dirname + "/views/index.ejs",{posts:posts,myPosts:myPosts,username:username,images:images});
        isValid = false;
    } 
    else{
        res.render(__dirname+"/views/login.ejs",{ error: "one of the details is wrong" });
    }
});


  app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });