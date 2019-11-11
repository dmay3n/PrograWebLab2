//const players = require('../routes/players.json');
var PrograWebDB = require('../db/PrograWebDB')
var requestedPlayer;

const getList = async (req, res, next) => {
    // return all players and code 200
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

const getOne = async (req, res, next) => {
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

const addOne = async (req, res, next) => {
    const { name, team, age, position, country } = req.body;
    var newPlayer, newId;
    if (name && team && age && position && country) {
        PrograWebDB.findOne({}).sort({ id: -1 }).limit(1).exec((err, player) => {
            if (err) {
                //500
                res.status(500)
                res.send('error')
            } else {
                newId = (player == null) ? 1 : (player.id + 1)
                newPlayer = PrograWebDB({
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
                        res.status(201)
                        res.send('Player added');
                    }
                })
            }
        })
    } else {
        res.status(400);
        res.send('Can\'t post');
    }
}

const updateOne = async (req, res, next) => {
    const { id } = req.params;
    const { name, team, age, position, country } = req.body;
    PrograWebDB.findOneAndUpdate({ id: Number(id) }, { name: name, team: team, age: Number(age), position: position, country: country }, function (err) {
        if (err) {
            res.status(404);
            res.send('There was no player with the id: ' + id);
        }
        else {
            res.status(204);
            res.send('Player with id: ' + id + ' was updated');
        }
    })
}

const deleteOne = async (req, res, next) => {
    const { id } = req.params;
    PrograWebDB.findOneAndRemove({ id: Number(id) }, function (err) {
        if (err) {
            res.status(404);
            res.send('There was no player with the id: ' + id);
        }
        else {
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