const express = require('express')
const router = express.Router()
const User = require('../models/users')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

router.post('/login', (req, res, next) => {
    User.find({ email: req.body.email})
    .exec()
    .then(user => {
        // no users found hence failed login
        if(user.length < 1) {
            // email not found; authorization failed
            return res.status(401).json({
                message: 'Auth failed'
            })
        } else {
            // compare hashed passwords
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                // possible hashing error
                if(err) {
                    return res.status(401).json({
                        message: 'Auth failed'
                    })
                }
                // returns true or false statement store in: result
                if(result) {
                    // i used the JWT_KEY can be found in nodemon, need something better to be key
                    const token = jwt.sign(
                        {
                            email: user[0].email,
                            userId: user[0]._id,
                        }, 
                        process.env.JWT_KEY,
                        {
                            expiresIn: "8h"
                        }
                    );
                    return res.status(200).json({
                        message: 'Auth successful',
                        token: token
                    })
                }
            })
        }
    })
    .catch(err => {
        res.send('Error: ' + err)
        console.log('Error with login: ' + err)
    })
})

router.post('/register', async(req, res, next) =>{
    // check if email was used to create prev account
    User.find({email: req.body.email})
        .exec()
        .then(user =>{
            // returns an array, is empty if email does not exist so check
            // if length is 1 or more
            if(user.length >= 1) {
                // conflicting information, email taken
                res.send('mail exists')
                console.log('mail exists')
                // conflicting information code
                return res.status(409)
        } else{
            // hash password 
            bcrypt.hash(req.body.password, 10, (err, hash) =>{
                if(err){
                    // if error tell user
                    return res.status(500).json({
                        message: 'Error: ' + err
                    });
                } else{
                    // able to hash password, create user
                    const NewUser = new User({
                        password: hash,
                        username: req.body.username,
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        id: req.body.id,
                        email: req.body.email
                    })
                    try{
                        const u1 = NewUser.save()
                        console.log('user created')
                        res.send('user created')

                        // success code
                        return res.status(201)
                    }catch(err){
                        res.send('Error')
                    }
                }
            })
        }})
    })


router.delete('/:userId', (req, res, next) =>{
    User.remove({_id: req.params.id}
        .exec()
        .then(result => {
            // delete the user
            res.status(200).json({
                message: 'user deleted'
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
    )
}) 

router.post('/account', (req, res, next) => {
    
})

module.exports = router