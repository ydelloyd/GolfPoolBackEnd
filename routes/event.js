var express = require('express');
var router = express.Router();

const knex = require('../db')

router.get('/all', function(req, res, next) {
  knex
    .select("*")
    .from("event")
    .orderBy('id', 'desc')
    .then((e)=>{
      if(e.length === 0){
        res.status(404).send({"message": "Could not find event"});
      } else {
        res.send(e);
      }
    })
    .catch((error)=>{
      res.status(500).send(error);
    })
});

router.get('/:id', function(req, res, next) {
  console.log(req.params.id);
  knex
    .select("*")
    .from("event")
    .where("id", req.params.id)
    .then((e)=>{
      if(e.length === 0){
        res.status(404).send({"message": "Could not find event with id " + req.params.id});
      } else {
        res.send(e[0]);
      }
      
    })
    .catch((error)=>{
      res.status(500).send(error);
    })
});

router.post('/', function(req, res, next) {
  console.log(req.body);
  knex("event")
    .insert(req.body)
    .then((e)=>{
        res.send(e);
    })
    .catch((error)=>{
      res.status(500).send(error);
    })
});

module.exports = router;
