const express = require('express');
const db = require('./data/db.js');
const server = express();

server.use(express.json());

// GET server response      >>      Working
server.get('/', (req, res) => {
    res.send({ api: 'API up and running' })
})

// Endpoints

// GET      >>      Working
server.get('/api/users', (req, res) => {
    db.find()
        .then(users => {
            res.status(200)
                .json(users)
        })
        .catch(err => {
            console.log('error with GET /users', err)
            res
                .status(500)
                .json({ errorMessage: 'The users information could not be retrieved' })
        });
});

// GET/:id      >>      Working
server.get('/api/users/:id', (req, res) => {
    const id = req.params.id;
    db.findById(id)
        .then(user => {
            if (user) {
                res.status(200)
                    .json(user)
            } else {
                res.status(404)
                    .json({ errorMessag: 'The user with the specified ID does not exist' })
            }
        })
        .catch(err => {
            console.log('error with GET /users/:id', err)
            res.status(500)
                .json({ errorMessage: 'The user information could not be retrieved'})
        })
})

// POST      >>      Working
server.post('/api/users', (req, res) => {
    const {name, bio} = req.body;
    if (!name || !bio) {
        res.status(400)
            .json({ errorMessage: 'Please provide name and bio for the user' })
    } else {
        db.insert(req.body)
            .then(user => {
                res.status(201)
                    .json(user)
            })
            .catch(err => {
                console.log('error with POST /users', err)
                res.status(500)
                    .json({ errorMessage: 'There was an error while saving the user to the database' })
            });
    }
});

// UPDATE      >>      Working
server.put('/api/users/:id', (req, res) => {
    const {name, bio} = req.body;
    if (!name || !bio) {
        res.status(400)
            .json({ errorMessage: 'Please provide name and bio for the user' })
    } else {
        db.update(req.params.id, req.body)
            .then(user => {
                if (user) {
                    res.status(200)
                        .json(req.body)
                } else {
                    res.status(404)
                        .json({ errorMessage: 'The user with the specified ID does not exist' })
                }
            })
            .catch(err => {
                console.log('error with UPDATE /users/:id', err)
                res.status(500)
                    .json({ errorMessage: 'The user information could not be modified' })
            })
    }
});

// DELETE      >>      Working
server.delete('/api/users/:id', (req, res) => {
    const id = req.params.id;
    db.remove(id)
        .then(removed => {
            if (removed) {
                res.status(200)
                    .json({ message: 'user successfully removed', removed })
            } else {
                res.status(404)
                    .json({ message: 'The user with the specified ID does not exist' })
            }
        })
        .catch(err => {
            console.log('error with DELETE /users/:id', err)
            res.status(500)
                .json({ errorMessage: 'The user could not be removed' })
        });
});


const port = 4000;
server.listen(port, () => 
    console.log(`\n API running on port ${port} \n`)
);