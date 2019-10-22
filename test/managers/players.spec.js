require('mocha')
const sinon = require('sinon')
const { expect } = require('chai')
const { players, getList, getOne, addOne, updateOne, deleteOne, playerExist, getPlayer, generateId } = require('../../src/managers/players')

describe('Players manager', () => {
    let playersList;
    beforeEach(() => {
        playersList = [];
        players.splice(0, 5);
    })

    it('Will get all players', () => {
        const sandbox = sinon.createSandbox()
        const statusMock = sandbox.stub()
        const jsonMock = sandbox.stub()
        const reqMock = sandbox.stub()
        const nextMock = sandbox.stub()

        playersList.push({
            "id": "1",
            "name": "Messi",
            "team": "Barcelona",
            "age": "30",
            "position": "FW",
            "country": "Argentina"
        })
        playersList.push({
            "id": "2",
            "name": "Xavi",
            "team": "Al Sahad",
            "age": "37",
            "position": "MF",
            "country": "Spain"
        })
        players.push({
            "id": "1",
            "name": "Messi",
            "team": "Barcelona",
            "age": "30",
            "position": "FW",
            "country": "Argentina"
        })
        players.push({
            "id": "2",
            "name": "Xavi",
            "team": "Al Sahad",
            "age": "37",
            "position": "MF",
            "country": "Spain"
        })

        const res = {
            status: statusMock,
            json: jsonMock
        }

        getList(reqMock, res, nextMock)
        sinon.assert.calledWith(statusMock, 200)
        sinon.assert.calledWith(jsonMock, playersList)
    })

    it('Will get one player sucessfully', () => {
        const sandbox = sinon.createSandbox()
        const statusMock = sandbox.stub()
        const jsonMock = sandbox.stub()
        const nextMock = sandbox.stub()
        const reqMock = {
            params: {
                id: 1
            }
        }

        const response = {
            "id": "1",
            "name": "Messi",
            "team": "Barcelona",
            "age": "30",
            "position": "FW",
            "country": "Argentina"
        }

        players.push({
            "id": "1",
            "name": "Messi",
            "team": "Barcelona",
            "age": "30",
            "position": "FW",
            "country": "Argentina"
        })

        const resMock = {
            status: statusMock,
            json: jsonMock
        }

        getOne(reqMock, resMock, nextMock)
        sinon.assert.calledWith(statusMock, 200)
        sinon.assert.calledWith(jsonMock, response)
    })

    it('Won\'t get one player because id doesn\'t exist', () => {
        const sandbox = sinon.createSandbox()
        const statusMock = sandbox.stub()
        const nextMock = sandbox.stub()
        const sendMock = sandbox.stub()
        const reqMock = {
            params: {
                id: 2
            }
        }
        players.push({
            "id": "1",
            "name": "Messi",
            "team": "Barcelona",
            "age": "30",
            "position": "FW",
            "country": "Argentina"
        })
        const resMock = {
            status: statusMock,
            send: sendMock
        }
        getOne(reqMock, resMock, nextMock)
        sinon.assert.calledWith(statusMock, 404)
    })

    it('Will add one player', () => {
        const sandbox = sinon.createSandbox()
        const statusMock = sandbox.stub()
        const jsonMock = sandbox.stub()
        const nextMock = sandbox.stub()
        const sendMock = sandbox.stub()
        const reqMock = {
            body: {
                "name": "Aubameyang",
                "team": "Arsenal",
                "age": "24",
                "position": "FW",
                "country": "Gabon"
            }
        }
        
        const resMock = {
            status: statusMock,
            send: sendMock
        }
        addOne(reqMock, resMock, nextMock)
        sinon.assert.calledWith(statusMock, 201)
    })

    it('Won\'t add one player because not all params are sent', () => {
        const sandbox = sinon.createSandbox()
        const statusMock = sandbox.stub()
        const jsonMock = sandbox.stub()
        const nextMock = sandbox.stub()
        const sendMock = sandbox.stub()
        const reqMock = {
            body: {
                "team": "Arsenal",
                "age": "28",
                "position": "DF",
                "country": "Brazil"
            }
        }
        
        const resMock = {
            status: statusMock,
            send: sendMock
        }
        addOne(reqMock, resMock, nextMock)
        sinon.assert.calledWith(statusMock, 400)
    })

    it('Will update one player', () => {
        const sandbox = sinon.createSandbox()
        const statusMock = sandbox.stub()
        const jsonMock = sandbox.stub()
        const nextMock = sandbox.stub()
        const sendMock = sandbox.stub()
        const reqMock = {
            params: {
                id: 1
            },
            body: {
                "name": "Messi",
                "team": "Barcelona",
                "age": "30",
                "position": "FW",
                "country": "Argentina"
            }
        }

        players.push({
            "id": "1",
            "name": "Messi",
            "team": "Barcelona",
            "age": "30",
            "position": "FW",
            "country": "Argentina"
        })

        const resMock = {
            status: statusMock,
            send: sendMock
        }
        updateOne(reqMock, resMock, nextMock)
        sinon.assert.calledWith(statusMock, 204)
    })

    it('Won\'t update one player because id doesn\'t exist', () => {
        const sandbox = sinon.createSandbox()
        const statusMock = sandbox.stub()
        const jsonMock = sandbox.stub()
        const nextMock = sandbox.stub()
        const sendMock = sandbox.stub()
        const reqMock = {
            params: {
                id: 1
            },
            body: {
                "name": "Messi",
                "team": "Barcelona",
                "age": "30",
                "position": "FW",
                "country": "Argentina"
            }
        }
        players.push({
            "id": "2",
            "name": "Messi",
            "team": "Barcelona",
            "age": "30",
            "position": "FW",
            "country": "Argentina"
        })
        const resMock = {
            status: statusMock,
            send: sendMock
        }
        updateOne(reqMock, resMock, nextMock)
        sinon.assert.calledWith(statusMock, 404)
    })

    it('Will delete one player', () => {
        const sandbox = sinon.createSandbox()
        const statusMock = sandbox.stub()
        const jsonMock = sandbox.stub()
        const nextMock = sandbox.stub()
        const sendMock = sandbox.stub()
        const reqMock = {
            params: {
                id: 1
            }
        }

        players.push({
            "id": "1",
            "name": "Messi",
            "team": "Barcelona",
            "age": "30",
            "position": "FW",
            "country": "Argentina"
        })

        const resMock = {
            status: statusMock,
            send: sendMock
        }
        deleteOne(reqMock, resMock, nextMock)
        sinon.assert.calledWith(statusMock, 204)
    })

    it('Won\'t delete one player because id doesn\'t exist', () => {
        const sandbox = sinon.createSandbox()
        const statusMock = sandbox.stub()
        const jsonMock = sandbox.stub()
        const nextMock = sandbox.stub()
        const sendMock = sandbox.stub()
        const reqMock = {
            params: {
                id: 1
            }
        }
        players.push({
            "id": "2",
            "name": "Messi",
            "team": "Barcelona",
            "age": "30",
            "position": "FW",
            "country": "Argentina"
        })

        const resMock = {
            status: statusMock,
            send: sendMock
        }
        deleteOne(reqMock, resMock, nextMock)
        sinon.assert.calledWith(statusMock, 404)
    })

    it('Will return TRUE because a player exist', function() {
        var assert = require('assert');
        players.push({
            "id": "1",
            "name": "Messi",
            "team": "Barcelona",
            "age": "30",
            "position": "FW",
            "country": "Argentina"
        })
        assert.equal(playerExist(1), true);
    })

    it('Will return FALSE because the player doesn\'t exist', function() {
        var assert = require('assert');
        players.push({
            "id": "2",
            "name": "Messi",
            "team": "Barcelona",
            "age": "30",
            "position": "FW",
            "country": "Argentina"
        })
        assert.equal(playerExist(1), false);
    })

    it('Will return the selected player', function() {
        var assert = require('assert');
        playersList.push({
            "id": "1",
            "name": "Messi",
            "team": "Barcelona",
            "age": "30",
            "position": "FW",
            "country": "Argentina"
        })
        players.push({
            "id": "1",
            "name": "Messi",
            "team": "Barcelona",
            "age": "30",
            "position": "FW",
            "country": "Argentina"
        })
        assert.equal(getPlayer(1), getPlayer(1));
    })

    it('Will return a new Id', function() {
        var assert = require('assert');
        players.push({
            "id": "1",
            "name": "Messi",
            "team": "Barcelona",
            "age": "30",
            "position": "FW",
            "country": "Argentina"
        })
        assert.equal(generateId(), 2);
    })
})
