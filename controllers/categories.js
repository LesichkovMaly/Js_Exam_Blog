const Category = require('mongoose').model('Category');
module.exports ={
    createGet:(req,res)=>{
        res.render('categories/create');

    },
    createPost:(req,res) => {
        let args = req.body;
        let errMsg = '';
        if(!args.name ){
            errMsg = 'Invalid category';
        }
        if(errMsg)
        {
            res.render('categories/create',errMsg);
        }
        else {
            Category.create(args).then(category => {
                res.redirect('/');
            })
        }

    }
}