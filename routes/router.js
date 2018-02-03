var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Finojo' , css: ['index.css']});
});

/* GET Generate page. */
router.get('/generate/:type', function(req, res, next){

  let type = req.params.type;
  let items = [];
  let generate = true;

  if(type == "policy"){
    items = ["Corporate Id", "User Id", "Policy Type", "Amount", "Other Details"];
  }else if(type == "medical"){
    items = ["Corporate Id", "User Id", "Patient type", "Days of stay", "Responsible Doctor", "Deseas", "Cause of Deases", "Medication" ,"Other Details"];
  }else if (type == "contract") {
    items = ["Corporate Id", "User Id", "Contract Type", "Validation period", "Content"];
  }else{
    generate = false;
  }

  res.render('generate', {
                title: type + ' Generator',
                type: req.params.type ,
                css :[],
                items : items,
                generate: generate
            });
});

/* GET View page. */
router.get('/view/:type', function(req, res, next){
  res.render('view', { title: 'View', type: req.params.type , css: []});
});

/* GET View page. */
router.post('/ipfs/store/:type', function(req, res, next){
  let type = req.params.type;

  if(type == "policy"){
    let cId = req.body.id0;
    let uId = req.body.id1;
    let pType = req.body.id2;
    let amount = req.body.id3;
    let other = req.body.id4;

      res.render('ipfsStore', {
        title: 'Storing in IPFS',
        cId: cId,
        uId: uId,
        pType: pType,
        amount: amount,
        other:other,
        css: []});
  }else{
      res.send('respond with a resource');
  }


});

module.exports = router;
