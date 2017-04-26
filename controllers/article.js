const Article = require('mongoose').model('Article');
const Category = require('mongoose').model('Category');
module.exports = {
    createArticleGet:(req,res) =>
    {
        Category.find({}).then(categories => {
            res.render('article/create',{categories:categories});
        });
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
        /*Category.findById(this.category).then(category=>{
            if(category)
            {
                category.articles.push(this.id);
                category.save();
            }
        });*/

    },
    detailsGet:(req,res)=>
    {
        let id = req.params.id;

        Article.findById(id).populate('author').then(article=>{

            if(!req.user)
            {
                res.render('article/details',{article:article,isUserAuthenticated:false});
                return;
            }
            req.user.isinRole('Admin').then(isAdmin=>
            {
                if(!isAdmin && !req.user.isAuthor(article))
                {
                    res.redirect('/');
                    return;
                }
                res.render('article/details',{article:article,isUserAuthenticated:true});
            });

        });
    },
    editGet:(req,res) =>
    {
        let id = req.params.id;

        Article.findById(id).then(article=>{


            req.user.isinRole('Admin').then(isAdmin=>
            {
                if(!isAdmin && !req.user.isAuthor(article))
                {
                    res.redirect('/');
                    return;
                }
                res.render('article/edit',article);
            });

        });

    },
    editPost: (req,res) =>
    {
        let id = req.params.id;

        let args = req.body;

        let errorMsg = '';

        if(!args.title)
        {
            errorMsg = 'A post cannot be released without a title!';
        }
        else if(!args.content)
        {
            errorMsg = 'A post cannot be released without a content';
        }
        if(errorMsg)
        {
            res.render('article/edit',{error:errorMsg});
        }
        else {
            Article.update({_id:id},{$set:{title:args.title,content : args.content}})
                .then(update=>{
                    res.redirect(`/article/details/${id}`);
                })
        }
    },
    deleteGet:(req,res) =>
    {
        if(!req.isAuthenticated())
        {
            let ReturnUrl = `/article/delete/${id}`;
            req.session.returnUrl = ReturnUrl;
            res.redirect('/user/login');
            return;
        }
        Article.findById(id).then(article => {

            req.user.isinRole('Admin').then(isAdmin=>{
                if(!isAdmin || req.user.isAuthor(article))
                {
                    res.redirect('/');
                    return
                }
                res.render('article/delete',article);
            })
        })
    },
    deletePost:(req,res)=>
    {
      let id = req.params.id;

      Article.findOneAndRemove({_id:id}).populate('author').then(article => {
          let author = article.author;

          let index = author.articles.indexOf(article.id);

          if(index < 0)
          {
              let errorMsg = 'Article was not found';
              res.render('article/delete',{error:errorMsg});
          }
          else{
              let count = 1;
              author.articles.splice(index,count);
              article.save().then((user)=>{
                  res.redirect('/');
              });
          }
      })


    }

}