const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");
mongoose.connect('mongodb+srv://emmanuel-admin:PaRrOtCaRrOt@cluster0.frparm7.mongodb.net/blogDB');

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";


const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
const writeSchema = mongoose.Schema({
  letters:String
});
const listSchema = mongoose.Schema({
  name:String,
  items:String
});
listSchema.virtual('truncated_text').get(function() {
  return this.items.substring(0, 150);
});
const List = mongoose.model("List", listSchema)
var list1 = new List({});
const Write = mongoose.model("Write", writeSchema);
const write1 = new Write({
  letters:homeStartingContent
})
const write2 = new Write({
  letters:aboutContent
})
const write3 = new Write({
  letters:contactContent
})

allWriteup = [write1,write2,write3]

app.get("/", function (request, respond) {
  Write.find({}, function (err, result) {
    
    if (result.length === 0) {
      Write.insertMany(allWriteup,function (err) {
        if (err) {
          console.log("error occured")
        }
      })
      respond.redirect("/")
    } else {
      List.find({}, function (err,results) {
        if (err) {
          console.log("error has occured")
        } else {
          respond.render("home", {welcome:result[0].letters, words:results});
        }
      })
    }
  })
  
  
})

app.get("/:this", function (req,res) {
  const title = req.params.this
  Write.find({}, function (err, result) {
    if (err) {
      console.log("error")
    } else {
      if (title === "about") {
        res.render("about", {content:result[1].letters})
      } else if (title === "contact") {
        res.render("contact", {more:result[2].letters})
      } else if (title === "compose") {
        res.render("compose")
      } else if (title === "home") {
        res.redirect("/")
      }
    }
  })
  
})
app.get("/posts/:this", function (request, respond) {
  
  const path = request.params.this;
  List.findOne({name:path}, function (err,result) {
    if (err) {
      console.log("error found")
    } else {
      respond.render("post", {head:result.name ,morewords: result.items});
    }
  })
  
})


app.post("/compose", function (request, respond) {
  const head = request.body.pbody;
  const texts = request.body.text;

  list1  = new List({
    name:texts,
    items:head
  })

  list1.save();
  respond.redirect("/")
})







app.listen(3000, function() {
  console.log("Server started on port 3000");
});
