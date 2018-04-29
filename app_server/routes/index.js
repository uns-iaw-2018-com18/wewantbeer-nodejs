var express = require('express');
var router = express.Router();
const ctrlMain = require('../controllers/main');

/* GET index */
router.get('/', ctrlMain.index);

/* GET bar */
router.get('/bar/', ctrlMain.bar);

/* GET login */
router.get('/login/', ctrlMain.login);

/* GET signup */
router.get('/signup/', ctrlMain.signup);

module.exports = router;
