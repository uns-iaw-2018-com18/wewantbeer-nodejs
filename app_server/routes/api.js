var express = require('express');
var router = express.Router();
const cerveceriasAPI = require('../controllers/cerveceriasAPI');
const ratingAPI = require('../controllers/ratingAPI');

router.get('/cervecerias', cerveceriasAPI.getCervecerias);

router.post('/rate', ratingAPI.rate);

router.post('/unrate', ratingAPI.unrate);

module.exports = router;
