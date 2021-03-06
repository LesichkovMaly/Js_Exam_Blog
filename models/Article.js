const mongoose = require("mongoose");


let ObjectID = mongoose.Schema.Types.ObjectId;
let articleSchema = mongoose.Schema({
    title : {type:String , required:true },
    content : {type:String , required:true },
    author : {type:ObjectID , required:true,ref : 'User'},
    category : {type:ObjectID ,ref:'Category'},
    date:{type:Date, default:Date.now()}
});


const Article = mongoose.model('Article',articleSchema);
module.exports = Article;
