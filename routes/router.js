
var express = require('express');
const async = require('async');
const IPFS = require('ipfs');
var mongo = require('mongodb').MongoClient;
var assert = require('assert');

var url = "mongodb://localhost:27017/test";
var collectionName = "test1";

const node = new IPFS();
var router = express.Router();
let fileMultihash


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'FINOJO' , css: ['index.css']});
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
router.post('/view', function(req, res, next){
  var userId = req.body.userId;
  let content = "";
  var resultArray = [];

  mongo.connect(url, function(err, db){
    assert.equal(null, err);
    const testDb = db.db('test');
      var cursor = testDb.collection(collectionName).find();
      cursor.forEach(function(doc, err){
        assert.equal(null,err);

        if(doc.userId == userId){
          resultArray.push(doc);
        }

      } , function(){

        res.render('view', { title: 'View' , items: resultArray, userId:userId , css: ['view.css']});

      });
  });

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

    /*let policyDataObject = {
          corporateId:req.body.id0,
          userId:req.body.id1,
          policyType:req.body.id2,
          amount:req.body.id3,
          otherDetails:req.body
    }*/


                         async.series([
                           (cb) => node.files.add({
                             path: 'sample.json',
                             content: Buffer.from(policyData)
                           }, (err, filesAdded) => {
                             if (err) { return cb(err) }

                             console.log('\nAdded file:', filesAdded[0].path, filesAdded[0].hash)
                             fileMultihash = filesAdded[0].hash

                             // Adding Ipfs multihash code to mongodb
                            let dbObject = {
                                  corporateId:req.body.id0,
                                  userId:req.body.id1,
                                  ipfsCode:fileMultihash
                                };

                                mongo.connect(url, function(err, db){
                                    assert.equal(null,err);
                                    const testDb = db.db('test');
                                    testDb.collection(collectionName).insertOne(dbObject, function(err, result) {
                                        assert.equal(null,err);
                                        console.log("Item Inserted");

                                    });
                                });

                             cb();

                             res.render('ipfsStore', {
                               title: 'Storing in IPFS',
                               data: policyData,
                               hash: fileMultihash,
                               css: []});

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
