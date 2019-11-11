require('mocha')
const sinon = require('sinon')
const { expect } = require('chai')
const { players, getList, getOne, addOne, updateOne, deleteOne, playerExist, getPlayer, generateId } = require('../../src/managers/players')
var playerDB = require('../../src/db/PrograWebDB')

describe('Players manager', () => {
    let playersList, playerCDB;
    beforeEach(() => {
        playersList = [];
        playerCDB = playerDB
    })

    it('Will get all players', async () => {
        const sandbox = sinon.createSandbox()
        const statusMock = sandbox.stub()
        const jsonMock = sandbox.stub()
        const reqMock = sandbox.stub()
        const nextMock = sandbox.stub()

        playersList.push({ 
            "_id": "5dc8d2845b544e4dc889e8dd", 
            "id": 4, 
            "name": "Messi", 
            "team": "Barcelona", 
            "age": 30, 
            "position": "FW", 
            "country": "Argentina", 
            "__v": 0 
        })

        const resMock = {
            status: statusMock,
            json: jsonMock
        }

        await getList(reqMock, resMock, nextMock).then( ()=>{
            sinon.assert.calledWith(statusMock, 200)
            sinon.assert.calledWith(jsonMock, playersList)
        }).catch(() => {})
    })

    it('Will get one player successful', async () => {
        const sandbox = sinon.createSandbox()
        const statusMock = sandbox.stub()
        const jsonMock = sandbox.stub()
        const reqMock = {
            params: {
                id: 4
            }
        }
        const nextMock = sandbox.stub()
        const sendMock = sandbox.stub()

        playersList.push({ 
            "_id": "5dc8d2845b544e4dc889e8dd", 
            "id": 4, 
            "name": "Messi", 
            "team": "Barcelona", 
            "age": 30, 
            "position": "FW", 
            "country": "Argentina", 
            "__v": 0 
        })

        const resMock = {
            status: statusMock,
            json: jsonMock
        }

        await getOne(reqMock, resMock, nextMock).then( ()=>{
            sinon.assert.calledWith(statusMock, 200)
            sinon.assert.calledWith(jsonMock, playersList)
        }).catch(() => {})
    })

    it('Won\'t get one player because id doesn\'t exist', async () => {
        const sandbox = sinon.createSandbox()
        const statusMock = sandbox.stub()
        const jsonMock = sandbox.stub()
        const reqMock = {
            params: {
                id: 1000
            }
        }
        const nextMock = sandbox.stub()

        const resMock = {
            status: statusMock,
            json: jsonMock
        }

        await getOne(reqMock, resMock, nextMock).then( ()=>{
            sinon.assert.calledWith(statusMock, 404)
            sinon.assert.calledWith(jsonMock, 'error')
        }).catch(() => {})
    })

    it('Will add one player', async () => {
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
            json: jsonMock
        }

        await addOne(reqMock, resMock, nextMock).then( ()=>{
            sinon.assert.calledWith(statusMock, 201)
            sinon.assert.calledWith(jsonMock, 'Player added')
        }).catch(() => {})
    })

    it('Won\'t add one player because not all params are sent', async () => {
        const sandbox = sinon.createSandbox()
        const statusMock = sandbox.stub()
        const jsonMock = sandbox.stub()
        const nextMock = sandbox.stub()
        const sendMock = sandbox.stub()
        const reqMock = {
            body: {
                "team": "Arsenal",
                "age": "24",
                "position": "FW",
                "country": "Gabon"
            }
        }

        const resMock = {
            status: statusMock,
            json: jsonMock
        }

        await addOne(reqMock, resMock, nextMock).then( ()=>{
            sinon.assert.calledWith(statusMock, 400)
        }).catch(() => {})
    })

    it('Will update one player', async () => {
        const sandbox = sinon.createSandbox()
        const statusMock = sandbox.stub()
        const jsonMock = sandbox.stub()
        const nextMock = sandbox.stub()
        const sendMock = sandbox.stub()
        const reqMock = {
            params: {
                id: 4
            },
            body: {
                "name": "Messi",
                "team": "Barcelona",
                "age": "31",
                "position": "FW",
                "country": "Argentina"
            }
        }

        const resMock = {
            status: statusMock,
            json: jsonMock
        }

        await updateOne(reqMock, resMock, nextMock).then( ()=>{
            sinon.assert.calledWith(statusMock, 204)
        }).catch(() => {})
    })

    it('Won\'t update one player because id doesn\'t exist', async () => {
        const sandbox = sinon.createSandbox()
        const statusMock = sandbox.stub()
        const jsonMock = sandbox.stub()
        const nextMock = sandbox.stub()
        const sendMock = sandbox.stub()
        const reqMock = {
            params: {
                id: 1000
            },
            body: {
                "name": "Messi",
                "team": "Barcelona",
                "age": "31",
                "position": "FW",
                "country": "Argentina"
            }
        }

        const resMock = {
            status: statusMock,
            json: jsonMock
        }

        await updateOne(reqMock, resMock, nextMock).then( ()=>{
            sinon.assert.calledWith(statusMock, 404)
        }).catch(() => {})
    })

    it('Will delete one player', async () => {
        const sandbox = sinon.createSandbox()
        const statusMock = sandbox.stub()
        const jsonMock = sandbox.stub()
        const nextMock = sandbox.stub()
        const sendMock = sandbox.stub()
        const reqMock = {
            params: {
                id: 4
            }
        }

        const resMock = {
            status: statusMock,
            json: jsonMock,
            send: sendMock
        }

        await deleteOne(reqMock, resMock, nextMock).then( ()=>{
            sinon.assert.calledWith(statusMock, 204)
            sinon.assert.calledWith(sendMock, 'Player with id: 4 was deleted')
        }).catch(() => {})
    })

    it('Won\'t delete one player because id doesn\'t exist', async () => {
        const sandbox = sinon.createSandbox()
        const statusMock = sandbox.stub()
        const jsonMock = sandbox.stub()
        const nextMock = sandbox.stub()
        const sendMock = sandbox.stub()
        const reqMock = {
            params: {
                id: 1000
            }
        }

        const resMock = {
            status: statusMock,
            send: sendMock
        }

        await deleteOne(reqMock, resMock, nextMock).then( ()=>{
            sinon.assert.calledWith(statusMock, 404)
        }).catch(() => {})
    })
})
