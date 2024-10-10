const router = require('express').Router();
let Client = require('../models/client.model');
const express = require('express');

const app = express();

router.route('/count').get((req, res)=>{
  let search = Client.find().countDocuments().then(client => res.json(client)).catch(err => res.status(400).json('Error: ' + err));
})


router.route('/').get( paginatedResults(Client), (req, res) =>{
  res.json(res.paginatedResults)
})

function paginatedResults(model) {
  return async (req, res, next) => {
    const page = parseInt(req.query.page)
    let limit = parseInt(req.query.limit)
    
    if(!limit){
      limit = limit
    }
    
    const startIndex = (page - 1) * limit
    const endIndex = page * limit

    const results = {}

    if (endIndex < await model.countDocuments().exec()) {
      results.next = {
        page: page + 1,
        limit: limit
      }
    }
    
    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit: limit
      }
    }
    try {
      results.results = await model.find().limit(limit).skip(startIndex).exec()
      res.paginatedResults = results
      next()
    } catch (e) {
      res.status(500).json({ message: e.message })
    }
  }
}

router.route('/add').post((req, res) => {

    const name = req.body.name;
    const email = req.body.email;
    const contact = req.body.contact;
    
    const newClient = new Client({
        name,
        email,
        contact
    });

    
    newClient.save()
        .then(()=> res.json('Client added!'))
        .catch(err => res.status(400).json('Error: ' + err));
} );

router.route('/:id').get((req, res)=>{
    Client.findById(req.params.id)
        .then(client => res.json(client))
        .catch(err => res.status(400).json('Error: ' + err));
})

router.route('/:id').delete((req, res) => {
    Client.findByIdAndDelete(req.params.id)
        .then(()=> res.json('Client deleted.'))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/update/:id').patch((req, res) => {
  Client.findById(req.params.id)
    .then(client => {
        client.name = req.body.name;
        client.email = req.body.email;
        client.contact = req.body.contact;

        client.save()
            .then(()=> res.json('Client updated'))
            .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;

