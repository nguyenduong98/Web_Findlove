const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const commentSchema = new Schema({
    idPost    : {
        type  : Schema.Types.ObjectId,
        ref   : 'post'
    },
    idUser    : {
        type  : Schema.Types.ObjectId,
        ref   : 'user'
    },
    commentContent : String
});

const Comment = mongoose.model('comment', commentSchema);
exports.COMMENT_MODEL = Comment;