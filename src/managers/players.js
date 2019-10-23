const players = require('../routes/players.json');
var requestedPlayer;

const getList = (req, res, next) => {
    // return all players and code 200
    //console.log('all players request');
    res.status(200);
    res.json(players);
}

const getOne = (req, res, next) => {
    const { id } = req.params;
    //console.log('player with id: ' + id + ' request');
    if(playerExist(id)){
        // return specific player and code 200
        res.status(200);
        res.json(getPlayer(id));
    }else{
        // return error 404
        res.status(404)
        res.send()
    }
}

const addOne = (req, res, next) => {
    const { name, team, age, position, country } = req.body;
    //console.log(name + team + age + position + country);
    if (name && team && age && position && country) {
        //add player
        var id = generateId();
        const newPlayer = { id, ...req.body };
        players.push(newPlayer);
        res.status(201);
        res.send('Player with id: ' + id + ' added');
    } else {
        res.status(400);
        res.send('Can\'t post');
    }
}

const updateOne = (req, res, next) => {
    const { id } = req.params;
    const { name, team, age, position, country } = req.body;
    for (var player of players) {
        if (player.id == id) {
            player.name = name;
            player.team = team;
            player.age = age;
            player.position = position;
            player.country = country;
            //console.log(players);
            res.status(204);
            res.send('Player with id: ' + id + ' was updated');
            return;
        }
    }
    res.status(404);
    res.send('There was no player with the id: ' + id);
}

const deleteOne = (req, res, next) => {
    const { id } = req.params;
    var i = -1;
    for (var player of players) {
        i++;
        if (player.id == id) {
            players.splice(i, 1);
            //console.log(players);
            res.status(204);
            res.send('Player with id: ' + id + ' was deleted');
            return;
        }
    }
    res.status(404);
    res.send('There was no player with the id: ' + id);
}

function playerExist(id) {
    for (var player of players) {
        if (player.id == id) {
            requestedPlayer = player;
            return true;
        }
    }
    return false;
}

function getPlayer(id) {
    for (var player of players) {
        if (player.id == id) {
            requestedPlayer = player;
            return requestedPlayer;
        }
    }
    return null;
}

function generateId() {
    let highestId = Math.max.apply(Math, players.map(function(item) {return item.id;}));

    highestId++;
    return highestId;
}

module.exports = {
    getList,
    getOne,
    addOne,
    updateOne,
    deleteOne,
    playerExist,
    getPlayer,
    generateId,
    players
}