const mongoose = require('mongoose');

let categoriesSchema = mongoose.Schema({
    name:{type:String,required:true}
    ,
    articles:[{type:mongoose.Schema.Types.ObjectId,ref:'Article'}]
})
categoriesSchema.method({
    Delete:function () {
        let Article = mongoose.model('Article');
        for(let article of this.articles)
        {
            Article.findById(article).then(article=>{
                article.remove();
            })
        }
    }
});
categoriesSchema.set('versionKey',false);
const Category = mongoose.model('Category',categoriesSchema)
module.exports = Category;