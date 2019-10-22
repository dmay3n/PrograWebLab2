const { Router } = require('express');
const { getList, getOne, addOne, updateOne, deleteOne } = require('../managers/players')
const router = Router();
const route = '/api';
const version = '/v1';
const theme = '/player';
const baseUrl = route + version + theme;

router.get(baseUrl, getList)
router.get(baseUrl  + '/:id', getOne)
router.post(baseUrl, addOne)
router.put(baseUrl + '/:id', updateOne)
router.delete(baseUrl + '/:id', deleteOne)

module.exports = router;