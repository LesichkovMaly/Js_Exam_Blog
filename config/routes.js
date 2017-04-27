const userController = require('./../controllers/user');
const homeController = require('./../controllers/home');
const articleController = require('./../controllers/article');
const catController = require('./../controllers/categories');

module.exports = (app) => {
    app.get('/', homeController.index);
    app.get('/categories/:id',homeController.ListThemArticles);

    app.get('/user/register', userController.registerGet);
    app.post('/user/register', userController.registerPost);

    app.get('/user/login', userController.loginGet);
    app.post('/user/login', userController.loginPost);

    app.get('/user/logout', userController.logout);

    app.get('/user/details',userController.userDetailsGet);

    app.get('/article/create',articleController.createArticleGet);
    app.post('/article/create',articleController.createArticlePost);

    app.get('/article/details/:id',articleController.detailsGet);

    app.get('/article/edit/:id',articleController.editGet);
    app.post('/article/edit/:id',articleController.editPost);

    app.get('/article/delete/:id',articleController.deleteGet);
    app.post('/article/delete/:id',articleController.deletePost);

    app.get('/categories/create',catController.createGet);
    app.post('/categories/create',catController.createPost);
};

