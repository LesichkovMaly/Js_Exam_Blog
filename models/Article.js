const mongoose = require("mongoose");
const dateFormat = require('mongoose-schema-formatdate');

let ObjectID = mongoose.Schema.Types.ObjectId;
let articleSchema = mongoose.Schema({
    title : {type:String , required:true },
    content : {type:String , required:true },
    author : {type:ObjectID , required:true,ref : "User"},
    date:{type:dateFormat,format:('YYYY-MM-DD') , default:Date.now()}
});

const Article = mongoose.model('Article',articleSchema);
module.exports = Article;
