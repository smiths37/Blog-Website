//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

//const posts = []; //array to store all blog posts

//Create a MongoDB Atlas database, schema, and model
mongoose.connect("mongodb+srv://admin-sarah:Test123@cluster0.0ncxs.mongodb.net/blogDB");
const postsSchema = new mongoose.Schema({
  title: String,
  body: String
});
const Post = new mongoose.model("Post", postsSchema);

//home/root route
app.get("/", function(req, res) {
  Post.find({}, function(err, posts){
    if (err){
      console.log(err);
    } else {
      res.render("home", {homeStartingContent: homeStartingContent, posts: posts});
    }
  });

  // res.render("home", {
  //   homeStartingContent: homeStartingContent,
  //   posts: posts
  // });
});

//compose route
app.get("/compose", function(req, res) {
  res.render("compose");
});
app.post("/compose", function(req, res) {
  //store title and post body in a new object
  // const post = {
  //   title: req.body.postTitle,
  //   content: req.body.postBody,
  //   slug: _.kebabCase(req.body.postTitle)     //use lodash to replace spaces in title with dashes, use this for the post's url
  // };
  // //add the new post object to the posts array
  // posts.push(post);

  const post = new Post({
    title: req.body.postTitle,
    body: req.body.postBody
  });

  post.save(function(err){
    if (!err){
      //return to homepage
      res.redirect("/");
    }
  });

});

//posts with parameters routes - dynamic URLs
//check if route matches a title of a post
//use lodash to ignore case and dashes
app.get("/posts/:id", function(req, res) {
  // posts.forEach(function(post) {
  //   if (_.lowerCase(req.params.postName) === _.lowerCase(post.title)) {
  //     res.render("post", {postTitle: post.title, postBody: post.content});
  //   } else {
  //     console.log("No match found :(");
  //   }
  // });
  Post.findById(req.params.id, function(err, post){
    if (err){
      console.log(err);
    } else {
      res.render("post", {postTitle: post.title, postBody: post.body});
    }
  });
});

//about route
app.get("/about", function(req, res) {
  res.render("about", {
    aboutContent: aboutContent
  });
});

//contact route
app.get("/contact", function(req, res) {
  res.render("contact", {
    contactContent: contactContent
  });
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
