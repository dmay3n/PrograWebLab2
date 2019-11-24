var PrograWebDB = require('../db/PrograWebDB')
var redis = require('redis');
//var client = redis.createClient({ host: "redis-server", port: 6379 }); //creates a new client
var client = redis.createClient();

client.on('connect', function () {
    console.log('Redis connected');
});

const getList = async (req, res, next) => {
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
                    client.exists('players', function (err, reply) {
                        if (reply === 1) {
                            client.del('players', function (err, reply) {
                                console.log('cache deleted')
                            });
                        }
                    });
                    res.status(201)
                    res.send('Player added');
                }
            })
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
            client.exists('players', function (err, reply) {
                if (reply === 1) {
                    client.del('players', function (err, reply) {
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
            client.exists('players', function (err, reply) {
                if (reply === 1) {
                    client.del('players', function (err, reply) {
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