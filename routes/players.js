const { Router } = require('express');
const router = Router();
const _ = require('underscore');
const route = '/api';
const version = '/v1';
const theme = '/player';
const baseUrl = route + version + theme;

const players = require('../routes/players.json');

router.get(baseUrl, (req, res) => {
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
})

router.post(baseUrl, (req, res) => {
    const { name, team, age, position, country } = req.body;
    if(name && team && age && position && country){
        //add player
        var id = generateId();
        const newPlayer = {id, ...req.body};
        players.push(newPlayer);
        res.status(201).send('Player added');
    }else{
        res.status(400).send('Can\'t post');
    }
})

router.put(baseUrl + '/:id', (req, res) => {
    const { id } = req.params;
    const { name, team, age, position, country} = req.body;

    _.each(players, (player, i) => {
        if(player.id == id){
            player.name = name;
            player.team = team;
            player.age = age;
            player.position = position;
            player.country = country;
            console.log(players);
            res.status(204).send('Player with id: ' + id + ' was updated');
        }
    })
    res.status(404).send('There was no player with the id: ' + id);
})

router.delete(baseUrl + '/:id', (req, res) => {
    const { id } = req.params;
    _.each(players, (player, i) => {
        if(player.id == id){
            players.splice(i, 1);
            console.log(players);
            res.status(204).send('Player with id: ' + id + ' was deleted');
        }
    })
    res.status(404).send('There was no player with the id: ' + id);
})

function playerExist(id){
    return true;
}

function getPlayer(id){
    //change function to return just one player
    return players;
}

function generateId(){
    //change function to return an id
    return 1;
}

module.exports = router;