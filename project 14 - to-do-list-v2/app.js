//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require('mongoose');
const app = express();
const _ = require("lodash");

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}); //if todolistDB doesn't exist, it will be created.

const itemsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please check your data entry, no name specified!"] //L require field houwe validator. 3adatan bne2dar n7ott new ellement (new fruit bl collection) w ykoun fiya fields na2sin. bas bi ma enno 7attayna l required validator: sar ejbare ykoun la kell new fruit name wa ella byetla3elna l msg w ma bi fawet l new fruit aal collection of fruits...
  },
});
const Item = mongoose.model("Item", itemsSchema); //like that I created a new collection called items


const item1 = new Item({
  name: "Welcome to your todolist!",
});
const item2 = new Item({
  name: "Hit the + button to add a new item",
});
const item3 = new Item({
  name: "<-- Hit this to delete an item",
});
const defaultitems = [item1, item2, item3];

const listSchema = {
  name: String,
  items: [itemsSchema]
};
const List = mongoose.model("List", listSchema);


app.get("/", function(req, res) {

  Item.find({}, function(err, founditems) { //to read on the CLI //err is a bool

    if (founditems.length === 0) {
      Item.insertMany(defaultitems, function(errr) { //The callback functions are called with err (error) parameter
        if (errr) {
          console.log(errr);
        } else {
          console.log("Succesfully saved all the default items to the db");
        }
      });
      res.redirect("/");
    } else {
      console.log(founditems);
      res.render("list", {
        listTitle: "Today",
        newListItems: founditems
      });
    }
  });
});


app.post("/", function(req, res) {

  const itemName = req.body.newItem;
  const listName = req.body.list;
  const mynewitem = new Item({
    name: itemName,
  });

  if (listName === "Today") {
    mynewitem.save();
    res.redirect("/");
  } else {
    List.findOne({
      name: listName
    }, function(err, foundlist) {
      foundlist.items.push(mynewitem);
      foundlist.save();
      res.redirect("/" + listName);
    });
  }
});

app.post("/delete", function(req, res) {
  const checkeditemid = req.body.checkboxx;
  const listName = req.body.listName;

  if (listName === "Today") {
    Item.deleteOne({
      _id: checkeditemid
    }, function(err) {
      if (err) {
        console.log(err);
      } else {
        console.log("Successfully deleted an item of our document."); //one item will be deleted
        res.redirect("/");
      }
    });
  } else {
    List.findOneAndUpdate({
      name: listName
    }, {
      $pull: {
        items: {
          _id: checkeditemid
        }
      }
    }, function(err, foundlist) {
      if (!err) {
        res.redirect("/" + listName);
      }
    });
  }
});

app.get("/:customlistname", function(req, res) {
  const customlistname = _.capitalize(req.params.customlistname);

  List.findOne({
    name: customlistname
  }, function(err, foundlist) {
    console.log(foundlist);
    if (!err) {
      if (!foundlist) { //because we used .findone() method: foundList is an only element. in this if statement we are chacking if it exists
        // to create a new list
        const newList = new List({
          name: customlistname,
          items: defaultitems
        });
        newList.save();
        res.redirect("/" + customlistname);
      } else {
        //show the asked list
        res.render("list", {
          listTitle: foundlist.name,
          newListItems: foundlist.items
        });
      }
    }
  });
});

app.get("/about", function(req, res) {
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
