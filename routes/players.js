const { Router } = require('express');
const router = Router();
const _ = require('underscore');
const route = '/api';
const version = '/v1';
const theme = '/player';
const baseUrl = route + version + theme;

const players = require('../routes/players.json');

var requestedPlayer;

/*router.get(baseUrl, (req, res) => {
    const { id } = req.body;
    if (!id) {
        // return all players and code 200
        res.status(200).json(players);
        console.log('all players request');
    }else if(playerExist(id)){
        // return specific player and code 200
        res.status(200).json(getPlayer(id));
        console.log('player with id: ' + id + ' request');
    }else{
        // return error 404
        res.status(404).send('Not found');
    }
})*/

router.get(baseUrl, (req, res) => {
    // return all players and code 200
    console.log('all players request');
    res.status(200).json(players);
})

router.get(baseUrl  + '/:id', (req, res) => {
    const { id } = req.params;
    console.log('player with id: ' + id + ' request');
    if(playerExist(id)){
        // return specific player and code 200
        res.status(200).json(getPlayer(id));
    }else{
        // return error 404
        res.status(404).send('Not found');
    }
})

router.post(baseUrl, (req, res) => {
    const { name, team, age, position, country } = req.body;
    console.log(name + team + age + position + country);
    if(name && team && age && position && country){
        //add player
        var id = generateId();
        const newPlayer = {id, ...req.body};
        players.push(newPlayer);
        res.status(201).send('Player with id: ' + id + ' added');
    }else{
        res.status(400).send('Can\'t post');
    }
})

router.put(baseUrl + '/:id', (req, res) => {
    const { id } = req.params;
    const { name, team, age, position, country} = req.body;
    for(var player of players){
        if(player.id == id){
            player.name = name;
            player.team = team;
            player.age = age;
            player.position = position;
            player.country = country;
            console.log(players);
            res.status(204).send('Player with id: ' + id + ' was updated');
            return;
        }
    }
    res.status(404).send('There was no player with the id: ' + id);
})

router.delete(baseUrl + '/:id', (req, res) => {
    const { id } = req.params;
    var i = 0;
    for(var player of players){
        if(player.id == id){
            players.splice(i, 1);
            console.log(players);
            res.status(204).send('Player with id: ' + id + ' was deleted');
            return;
        }
        i++;
    }
    res.status(404).send('There was no player with the id: ' + id);
})

function playerExist(id){
    for(var player of players){
        if(player.id == id){
            requestedPlayer = player;
            return true;
        }
    }
    return false;
}

function getPlayer(id){
    //change function to return just one player
    if(id = requestedPlayer.id){
        return requestedPlayer;
    }else{
        for(var player of players){
            if(player.id == id){
                requestedPlayer = player;
                return requestedPlayer;
            }
        }
    }
}

function generateId(){
    let highestId = 0;
    for(var player of players){
        if(player.id > highestId){
            highestId = player.id;
        }
    }
    highestId++;
    return highestId;
}

module.exports = router;