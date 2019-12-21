const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const userSchema = new Schema({
    username    : String,
    password    : String,
    email       : String,
    gender      : String,
    avatar      : {
        type    : String,
        default : 'avata.jpg'
    },
    imgCover    : {
        type    : String,
        default : 'imgcover.jpg'
    },
    degree      : {
        type    : Number,
        default : 0
    },
    friend      : [{
        type    : Schema.Types.ObjectId,
        ref     : 'user',
    }],
    receivedAddFriend: [{
        type         : Schema.Types.ObjectId,
        ref          : 'user',
    }],
    waitingAddFriend: [{
        type         : Schema.Types.ObjectId,
        ref          : 'user'
    }]
});

const User = mongoose.model('user', userSchema);
exports.USER_MODEL = User;