const express = require("express"); //similar to importing libraries
const app = express();
const body_parser = require('body-parser');
const urlencoded_parser = body_parser.urlencoded({extended:false});
const mongoclient = require("mongodb")
const db = mongoclient.MongoClient;
const url = "mongodb+srv://sumit:sumit@cluster0-nevqf.mongodb.net/test?retryWrites=true";
app.set('view engine','ejs');

console.log("Server Running on http://localhost:8002");

//HomePage
app.get("/",(req,res)=>{
    res.sendFile(__dirname + '/index.html');
});

app.get("/getcategorylist",(req,res)=>{
    mongoclient.connect(url, { useNewUrlParser: true }, function(err, db) {
        if (err) throw err;
        var dbo = db.db("test")
        dbo.collection("aggrdemo").distinct("Category", function(err, result) {
            if (err) throw err;
            //console.log(result);
            res.send(result);
            });
        });
    });

app.get("/getyears",(req,res)=>{
    mongoclient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
        var dbo = db.db("test")
        dbo.collection("aggrdemo").distinct("Year", function(err, result) {
            if (err) throw err;
            //console.log(result);
            res.send(result);
            });
        });
    });

app.get('/searchresults',urlencoded_parser,(req,res)=>{
    var category = req.query.category;
    var year = parseInt(req.query.year);
        //querry = {$and:[{"Quantity":{$gte:l}},{"Quantity":{$lt:u}}]};
        if (year!=0){
            mongoclient.connect(url, { useNewUrlParser: true }, function(err, db) {
                if (err) throw err;
                var dbo = db.db("test")
                dbo.collection("aggrdemo").aggregate([{$match:{$and:[{"Year":year,"Category":category}]}},
                    {$group:{_id:"$Product", Total_Quantity:{$sum:"$Quantity"}}}
                    ]).sort({_id:1}).toArray(function(err, result) {
                        if (err) throw err;
                        //console.log(result);
                        res.send(result);
                        });
                    });
        }
        else{
            mongoclient.connect(url, { useNewUrlParser: true }, function(err, db) {
                if (err) throw err;
                var dbo = db.db("test")
                dbo.collection("aggrdemo").aggregate([{$match:{"Category":category}},
                    {$group:{_id:"$Product", Total_Quantity:{$sum:"$Quantity"}}}
                    ]).sort({_id:1}).toArray(function(err, result) {
                        if (err) throw err;
                        //console.log(result);
                        res.send(result);
                        });
                    });
        }
    });

    app.get('/searchallresults',urlencoded_parser,(req,res)=>{
        var year = parseInt(req.query.year);
            //querry = {$and:[{"Quantity":{$gte:l}},{"Quantity":{$lt:u}}]};
            if (year!=0){
                mongoclient.connect(url, { useNewUrlParser: true }, function(err, db) {
                    if (err) throw err;
                    var dbo = db.db("test")
                    dbo.collection("aggrdemo").aggregate([{$match:{"Year":year}},
                        {$group:{_id:"$Product", Total_Quantity:{$sum:"$Quantity"}}}
                        ]).sort({_id:1}).toArray(function(err, result) {
                            if (err) throw err;
                            //console.log(result);
                            res.send(result);
                            });
                        });
            }
            else{
                mongoclient.connect(url, { useNewUrlParser: true }, function(err, db) {
                    if (err) throw err;
                    var dbo = db.db("test")
                    dbo.collection("aggrdemo").aggregate([
                        {$group:{_id:"$Product", Total_Quantity:{$sum:"$Quantity"}}}
                        ]).sort({_id:1}).toArray(function(err, result) {
                            if (err) throw err;
                            //console.log(result);
                            res.send(result);
                            });
                        });
            }
        });

app.listen(8002);
