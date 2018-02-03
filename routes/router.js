var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Finojo' , css: ['index.css']});
});

/* GET Generate page. */
router.get('/generate/:type', function(req, res, next){
  res.render('generate', { type: req.params.type});
});

/* GET View page. */
router.get('/view/:type', function(req, res, next){
  res.render('view', { type: req.params.type});
});

module.exports = router;
