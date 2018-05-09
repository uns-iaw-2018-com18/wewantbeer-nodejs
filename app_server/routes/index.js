var express = require('express');
var router = express.Router();
const ctrlMain = require('../controllers/main');

/* GET index */
router.get('/', ctrlMain.index);

/* GET bar */
router.get('/bar/:id', ctrlMain.bar);
router.get('/bar', function(req, res) {
  res.redirect('/');
});

module.exports = router;
