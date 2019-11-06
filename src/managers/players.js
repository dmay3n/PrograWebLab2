//const players = require('../routes/players.json');
var PrograWebDB = require('../db/PrograWebDB')
//var requestedPlayer;
var redis = require('redis');
var client = redis.createClient(); //creates a new client

client.on('connect', function () {
    console.log('Redis connected');
});

const getList = async (req, res, next) => {
    // return all players and code 200
    client.exists('players', function (err, reply) {
        if (reply === 1) {
            client.get('players', function (err, reply) {
                res.status(200)
                res.json(JSON.parse(reply))
            });
        } else {
            PrograWebDB.find({}, (err, players) => {
                if (err) {
                    res.status(404)
                    res.send('error')
                }
                else {
                    client.set('players', JSON.stringify(players));
                    client.expire('players', 300);
                    res.status(200)
                    res.json(players)
                }
            })
        }
    })
}

const getOne = (req, res, next) => {
    const { id } = req.params;
    PrograWebDB.findOne({ id: Number(req.params.id) }, (err, player) => {
        if (err) {
            res.status(404)
            res.send('error')
        }
        else {
            if (player == null) {
                res.status(404)
                res.send('error')
            }
            else {
                res.status(200)
                res.json(player)
            }
        }
    })
}

const addOne = (req, res, next) => {
    const { name, team, age, position, country } = req.body;
    //console.log(name + team + age + position + country);
    if (name && team && age && position && country) {
        PrograWebDB.find({}, (err, player) => {
            if (err) {
                res.status(500)
                res.send('error')
            } else if (player.length == 0) {
                var index = 1
                var newPlayer = PrograWebDB({
                    id: index,
                    name: name,
                    team: team,
                    age: Number(age),
                    position: position,
                    country: country
                })
                newPlayer.save((err) => {
                    if (err) {
                        res.status(404)
                        res.send('error')
                    }
                    else {
                        client.exists('players', function(err, reply) {
                            if (reply === 1) {
                                client.del('players', function(err, reply) {
                                    console.log('cache deleted')
                                });
                            }
                        });
                        res.status(201)
                        res.send('Player added');
                    }
                })
            } else {
                PrograWebDB.findOne({}).sort({ id: -1 }).limit(1).exec((err, player) => {
                    if (err) {
                        res.status(404)
                        res.send('error')
                    } else {
                        var index = player.id + 1
                        var newPlayer = PrograWebDB({
                            id: index,
                            name: name,
                            team: team,
                            age: Number(age),
                            position: position,
                            country: country
                        })
                        newPlayer.save((err) => {
                            if (err) {
                                res.status(404)
                                res.send('error')
                            }
                            else {
                                client.exists('players', function(err, reply) {
                                    if (reply === 1) {
                                        client.del('players', function(err, reply) {
                                            console.log('cache deleted')
                                        });
                                    }
                                });
                                res.status(201)
                                res.send('Player added');
                            }
                        })
                    }
                })
            }
        })
    } else {
        res.status(400);
        res.send('Can\'t post');
    }
}

const updateOne = (req, res, next) => {
    const { id } = req.params;
    const { name, team, age, position, country } = req.body;
    PrograWebDB.findOneAndUpdate({ id: Number(id) }, { name: name, team: team, age: Number(age), position: position, country: country }, function (err) {
        if (err) {
            res.status(404);
            res.send('There was no player with the id: ' + id);
        }
        else {
            client.exists('players', function(err, reply) {
                if (reply === 1) {
                    client.del('players', function(err, reply) {
                        console.log('cache deleted')
                    });
                }
            });
            res.status(204);
            res.send('Player with id: ' + id + ' was updated');
        }
    })
}

const deleteOne = (req, res, next) => {
    const { id } = req.params;
    PrograWebDB.findOneAndRemove({ id: Number(id) }, function (err) {
        if (err) {
            res.status(404);
            res.send('There was no player with the id: ' + id);
        }
        else {
            client.exists('players', function(err, reply) {
                if (reply === 1) {
                    client.del('players', function(err, reply) {
                        console.log('cache deleted')
                    });
                }
            });
            res.status(204);
            res.send('Player with id: ' + id + ' was deleted');
        }
    })
}

module.exports = {
    getList,
    getOne,
    addOne,
    updateOne,
    deleteOne
}