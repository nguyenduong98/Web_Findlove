const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const postSchema = new Schema({
    status    : String,
    img       : String,
    idUser    : {
        type  : Schema.Types.ObjectId,
        ref   : 'user'
    },
    ObjectPostShare: Object,
    ObjectComment  : [
        {
            username: String,
            avatar: String,
            idUserCmt: {
                type : Schema.Types.ObjectId,
                ref  : 'user'
            },
            comment : String
        }
    ]
});

const Post = mongoose.model('post', postSchema);
exports.POST_MODEL = Post;