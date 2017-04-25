const mongoose = require('mongoose');
const Role = require('mongoose').model('Role');
const encryption = require('./../utilities/encryption');
let ObjectID = mongoose.Schema.Types.ObjectId;

let userSchema = mongoose.Schema(
    {
        email: {type: String, required: true, unique: true},
        passwordHash: {type: String, required: true},
        articles: [{type:ObjectID,ref:'Article'}],
        fullName: {type: String, required: true},
        roles: [{type:ObjectID,ref:'User'}],
        salt: {type: String, required: true}
    }
);

userSchema.method ({
   authenticate: function (password) {
       let inputPasswordHash = encryption.hashPassword(password, this.salt);
       let isSamePasswordHash = inputPasswordHash === this.passwordHash;

       return isSamePasswordHash;
   },
    isAuthor: function (article) {
        if(!article)
        {
            return false;
        }
        else {
            let AuthorArticle = article.author.equals(this.id);
            return AuthorArticle;
        }
    },
    isinRole:function (roleName) {
        return Role.findOne({name:roleName}).then(role=>
        {
            if(!role)
            {
                return false;
            }
            let isinRole =this.roles.indexOf(role.id) !== -1;
            return isinRole;
        })
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
module.exports.seedAdmin=()=>
{
    let email = 'lasi@abv.bg';
    User.findOne({email:email}).then(admin => {
        if(!admin)
        {
            Role.findOne({name:'Admin'}).then(role=>
            {
                let salt = encryption.generateSalt();
                let passwordHash = encryption.hashPassword('admin',salt);
                let roles = [];
                roles.push(role.id);

                let currUser = {
                    email:email,
                    passwordHash:passwordHash,
                    articles:[],
                    fullName:'Admin',
                    roles:roles,
                    salt:salt

                }
                User.create(currUser).then(user =>
                {
                    role.name.push(role.id);
                    role.save();
                })
            })
        }
    })
}



