var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create schema
var playerSchema = new Schema({
    id: Number,
    name: String,
    team: String,
    age: Number,
    position: String,
    country: String
})

playerSchema.methods.lastIndex = function(){
    this.id = this.id+1
    return this.id
}

var player = mongoose.model('player', playerSchema)

module.exports = player