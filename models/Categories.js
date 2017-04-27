const mongoose = require('mongoose');
let ObjectID = mongoose.Schema.Types.ObjectId;

let categoriesSchema = mongoose.Schema({
    name:{type:String,required:true},
    articles: [{ type:ObjectID , ref:'Article' }]
});

const Category = mongoose.model('Category',categoriesSchema);
module.exports = Category;
