var PrograWebDB = require('../db/PrograWebDB')
var redis = require('redis');
var client = redis.createClient({ host: "redismayen.westus.azurecontainer.io", port: 6379 }); //creates a new client
var redisON

client.on('connect', function () {
    console.log('Redis connected');
    redisON = true
});

client.on('error', function (err) {
    console.log('Redis error');
    redisON = false
});

const getList = async (req, res, next) => {
    try {
        if (redisON) {
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
        } else {
            PrograWebDB.find({}, (err, players) => {
                if (err) {
                    res.status(404)
                    res.send('error')
                }
                else {
                    res.status(200)
                    res.json(players)
                }
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500)
        res.send('error')
    }
}

const getOne = (req, res, next) => {
    try {
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
    } catch (error) {
        console.log(error)
        res.status(500)
        res.send('error')
    }
}

const addOne = (req, res, next) => {
    try {
        const { name, team, age, position, country } = req.body;
        if (name && team && age && position && country) {
            PrograWebDB.findOne({}).sort({ id: -1 }).limit(1).exec((err, player) => {
                if (err) {
                    res.status(500)
                    res.send('error')
                }
                var newId = (player == null) ? 1 : player.id + 1
                var newPlayer = PrograWebDB({
                    id: newId,
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
                        if (redisON) {
                            client.exists('players', function (err, reply) {
                                if (reply === 1) {
                                    client.del('players', function (err, reply) {
                                        console.log('cache deleted')
                                    });
                                }
                            });
                        }
                        res.status(201)
                        res.send('Player added');
                    }
                })
            })
        } else {
            res.status(400);
            res.send('Can\'t post');
        }
    } catch (error) {
        console.log(error)
        res.status(500)
        res.send('error')
    }
}

const updateOne = (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, team, age, position, country } = req.body;
        PrograWebDB.findOneAndUpdate({ id: Number(id) }, { name: name, team: team, age: Number(age), position: position, country: country }, function (err) {
            if (err) {
                res.status(404);
                res.send('There was no player with the id: ' + id);
            }
            else {
                if (redisON) {
                    client.exists('players', function (err, reply) {
                        if (reply === 1) {
                            client.del('players', function (err, reply) {
                                console.log('cache deleted')
                            });
                        }
                    });
                }
                res.status(204);
                res.send('Player with id: ' + id + ' was updated');
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500)
        res.send('error')
    }
}

const deleteOne = (req, res, next) => {
    try {
        const { id } = req.params;
        PrograWebDB.findOneAndRemove({ id: Number(id) }, function (err) {
            if (err) {
                res.status(404);
                res.send('There was no player with the id: ' + id);
            }
            else {
                if (redisON) {
                    client.exists('players', function (err, reply) {
                        if (reply === 1) {
                            client.del('players', function (err, reply) {
                                console.log('cache deleted')
                            })
                        }
                    })
                }
                res.status(204);
                res.send('Player with id: ' + id + ' was deleted');
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500)
        res.send('error')
    }
}

module.exports = {
    getList,
    getOne,
    addOne,
    updateOne,
    deleteOne
}