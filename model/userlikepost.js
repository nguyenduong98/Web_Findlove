const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const userLikePostSchema = new Schema({
    idPost : {
        type: Schema.Types.ObjectId,
        ref : 'post'
    },
    listUserLike : [{
        type    : Schema.Types.ObjectId,
        ref     : 'user',
    }],
    listUserLove : [{
        type    : Schema.Types.ObjectId,
        ref     : 'user',
    }],
    listUserHaha : [{
        type    : Schema.Types.ObjectId,
        ref     : 'user',
    }],
    listUserSad : [{
        type    : Schema.Types.ObjectId,
        ref     : 'user',
    }],
    listUserWow : [{
        type    : Schema.Types.ObjectId,
        ref     : 'user',
    }],
    listUserAngry : [{
        type    : Schema.Types.ObjectId,
        ref     : 'user',
    }],
});

const userandpost = mongoose.model('userandpost', userLikePostSchema);
exports.USERANDPOST_MODEL = userandpost;