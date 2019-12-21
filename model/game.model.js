const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const gameSchema = new Schema({
    img : String
});

const Game = mongoose.model('game', gameSchema);
exports.GAME_MODEL = Game;