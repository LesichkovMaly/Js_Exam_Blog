const Article = require('mongoose').model('Article');
const Category = require('mongoose').model('Category');
const User =require('mongoose').model('User');
module.exports = {
    createArticleGet:(req,res) =>
    {
        Category.find({}).then(categories => {
            res.render('article/create',{categories:categories});
        });
    },
    createArticlePost:(req,res)=> {
        let articleArgs = req.body;
        let currCategory = articleArgs.category;
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

            Category.findById(currCategory).then(category=> {
                category.articles.push(article.id);
                category.save();
           });
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
                Category.find({}).then(category => {
                    article.categories=category;
                    res.render('article/edit',article);
                })

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
        else
        {
            Article.findById(id).populate('category').then(article=> {
                article.category.articles.remove(article.id);
                article.category.save();


                article.category=args.category;
                article.title=args.title;
                article.content=args.content;
                article.save((err)=> {
                    Category.findById(article.category).then(category=>{
                        if(category.articles.indexOf(article.id) === -1)
                        {
                            category.articles.push(article.id);
                            category.save();
                        }
                        res.redirect(`/article/details/${id}`);
                    })
                })
            })
        }
    },
    deleteGet:(req,res) =>
    {
        let id = req.params.id;
        if(!req.isAuthenticated())
        {
            let ReturnUrl = `/article/delete/${id}`;
            req.session.returnUrl = ReturnUrl;
            res.redirect('/user/login');
            return;
        }
        Article.findById(id).then(article => {

            req.user.isinRole('Admin').then(isAdmin=>{
                if(!isAdmin && !req.user.isAuthor(article))
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

      Article.findOneAndRemove({_id:id}).then(article => {
          Category.findById(this.category).then(category=> {
              category.articles.remove(article.id);
              category.save();

          });
          User.findById(this.user).then(user=>
          {
              user.articles.remove(article.id);
              user.save();
              res.redirect('/');

          });
      });


    }

}