'use strict'

var express = require('express');
const async = require('async');
const IPFS = require('ipfs');
var mongo = require('mongodb');
var assert = require('assert');

var url = "mongodb://localhost:27017/test";

const node = new IPFS();
var router = express.Router();
let fileMultihash


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
    let policyData = req.body.id0 + "," +
                       req.body.id1 + "," +
                       req.body.id2 + "," +
                       req.body.id3 + "," +
                       req.body.id4;


                         async.series([
                           (cb) => node.files.add({
                             path: 'sample.json',
                             content: Buffer.from(policyData)
                           }, (err, filesAdded) => {
                             if (err) { return cb(err) }

                             console.log('\nAdded file:', filesAdded[0].path, filesAdded[0].hash)
                             fileMultihash = filesAdded[0].hash
                             cb()

                             // Adding Ipfs multihash code to mongodb
                            let dbObject = {
                                  user_id:req.body.id0,
                                  ipfsCode:fileMultihash
                                }

                              


                           }),
                           (cb) => node.files.cat(fileMultihash, (err, data) => {
                             if (err) { return cb(err) }

                             console.log('\nFile content:')
                             process.stdout.write(data)
                           })
                         ])







  }else{
      res.send('Area under construction');
  }


});

module.exports = router;
