var express = require('express');
var router = express.Router();
const cerveceriasAPI = require('../controllers/cerveceriasAPI');

router.get('/cervecerias', cerveceriasAPI.getCervecerias);

module.exports = router;
