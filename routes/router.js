var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Finojo' , css: ['index.css']});
});

/* GET Generate page. */
router.get('/generate/:type', function(req, res, next){
  res.render('generate', { title: 'Generate', type: req.params.type , css :[]});
});

/* GET View page. */
router.get('/view/:type', function(req, res, next){
  res.render('view', { title: 'View', type: req.params.type , css: []});
});

module.exports = router;
