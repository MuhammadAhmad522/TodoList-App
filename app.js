const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
// const date = require(__dirname + "/date.js");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

mongoose.connect(
    "mongodb+srv://ahmad:happy123@cluster0.cqo03de.mongodb.net/todolistDB?retryWrites=true&w=majority"
);
// mongoose schema
const itemsSchema = {
    name: String,
};

// mongdb collection
const Item = mongoose.model("Item", itemsSchema);

// mongob document
const toDoItem1 = new Item({
    name: "Welcome to your ToDoList",
});

const toDoItem2 = new Item({
    name: "Hit + to Add new Item",
});

const toDoItem3 = new Item({
    name: "<-- to delete an Item",
});

const defaultItemArray = [toDoItem1, toDoItem2, toDoItem3];

// new list schema
const listSchema = {
    name: String,
    items: [itemsSchema],
};

// mongoose model for list
const List = mongoose.model("List", listSchema);

app.get("/", function (req, res) {
    // code for checking if items is empty, and if so then add defaults 3 items
    Item.find({})
        .then((foundItems) => {
            if (foundItems.length === 0) {
                Item.insertMany(defaultItemArray)
                    .then(() => {
                        console.log("Items inserted successfully.");
                        res.redirect("/");
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            } else {
                res.render("list", { listTitle: "Today", newListItems: foundItems });
            }
        })
        .catch((error) => {
            console.error(error);
        });
});

// express route parameteres
app.get("/:customListName", function (req, res) {
    const customListName = _.capitalize(req.params.customListName);
    const query = { name: customListName };

    List.findOne(query)
        .then((foundList) => {
            if (!foundList) {
                // create new list
                const list = new List({
                    name: customListName,
                    items: defaultItemArray,
                });
                list.save();
                res.redirect("/" + customListName);
            } else {
                // show an existing list
                res.render("list", {
                    listTitle: foundList.name,
                    newListItems: foundList.items,
                });
            }
        })
        .catch((error) => {
            console.error(error);
        });
});

// root post req
app.post("/", (req, res) => {
    const itemName = req.body.newItem;
    const listName = req.body.list;

    const item = new Item({
        name: itemName,
    });

    if (listName === "Today") {
        item.save();
        console.log("Item inserted successfully");
        res.redirect("/");
    } else {
        List.findOne({ name: listName })
            .then((foundList) => {
                foundList.items.push(item);
                console.log("Item inserted successfully");
                foundList.save();
                res.redirect("/" + listName);
            })
            .catch((error) => {
                console.error(error);
            });
    }
});

app.post("/delete", function (req, res) {
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;

    if (listName === "Today") {
        Item.findByIdAndRemove(checkedItemId)
            .then((removedItem) => {
                if (removedItem) {
                    console.log("Item removed successfully:");
                } else {
                    console.log("Item not found.");
                }
                res.redirect("/");
            })
            .catch((error) => {
                console.error(error);
            });
    } else {
        List.findOneAndUpdate(
            { name: listName },
            { $pull: { items: { _id: checkedItemId } } }
        )
            .then((foundList) => {
                if (foundList) {
                    console.log("Item Removed.");
                    res.redirect("/" + listName);
                } else {
                    console.log("Item not found.");
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }
});

const port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log("Server spinning up on port 3000.");
});
