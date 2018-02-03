'use strict'

var express = require('express');
const series = require('async/series');
const IPFS = require('ipfs');

const node = new IPFS();
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
    let policyData = [ req.body.id0,
                       req.body.id1,
                       req.body.id2,
                       req.body.id3,
                       req.body.id4];

      // Calling ipfs to store
      (cb) => node.files.add({
          path: '',
          content: policyData
        }, (err, filesAdded) => {
          if (err) { return cb(err) }

          // Once the file is added, we get back an object containing the path, the
          // multihash and the sie of the file
          console.log('\nAdded file:', filesAdded[0].path, filesAdded[0].hash)
          fileMultihash = filesAdded[0].hash
          cb()
        })


      res.render('ipfsStore', {
        title: 'Storing in IPFS',
        data: policyData,
        css: []});


  }else{
      res.send('respond with a resource');
  }


});

module.exports = router;
