var express = require('express');
var router = express.Router();
const cerveceriasAPI = require('../controllers/cerveceriasAPI');
const ratingAPI = require('../controllers/ratingAPI');
const styleAPI = require('../controllers/styleAPI');

router.get('/cervecerias', cerveceriasAPI.getCervecerias);

router.post('/rate', ratingAPI.rate);

router.post('/unrate', ratingAPI.unrate);

router.post('/style', styleAPI.changeStyle);

module.exports = router;
