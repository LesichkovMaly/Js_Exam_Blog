const Article = require('mongoose').model('Article');

module.exports = {
    createArticleGet:(req,res) =>
    {
        res.render('article/create');
    },
    createArticlePost:(req,res)=> {
        let articleArgs = req.body;
        let errorMsg = '';
        if(!req.isAuthenticated())
        {
            errorMsg = "You must login first!";
        }
        else if(!articleArgs.title)
        {
            errorMsg = "Give your article a title!";
        }
        if (errorMsg)
        {
            res.render('article/create',{error : errorMsg});
            return;
        }
        articleArgs.author = req.user.id;
        Article.create(articleArgs).then(article =>
        {
            req.user.articles.push(article.id);
            req.user.save(err =>
            {
                if(err){
                    res.redirect('/',{error:err.message});
                }
                else{res.redirect('/');}
            })
        });
    },
    detailsGet:(req,res)=>
    {
        let id = req.params.id;
        Article.findById(id).populate('author').then(article=>{
            res.render('article/details',article);
        });
    }
}