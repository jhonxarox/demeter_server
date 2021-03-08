const express = require('express')
const bodyParser = require('body-parser')
const md5 = require('md5')
const jwt = require('jsonwebtoken')

const db = require('../models/user')

const router = express.Router()

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.get('/', (req, res) => {
    res.send("From API Router")
});

router.get('/listUsers', (req, res) => {
    var sql = "select * from user"
    var params = []
    db.all(sql, params, (err, data) => {
        if(err) {
            res.status(400).send({ "error": err.message });
            return;
        }
        res.status(200).send({
            "message": "success",
            "data": data
        });
    });
});

router.post('/register', (req, res) => {
    var errors = []
    if (!req.body.password){
        errors.push("No password specified");
    }
    if (!req.body.email){
        errors.push("No email specified");
    }
    if (errors.length){
        res.status(400).send({"error":errors.join(",")});
        return;
    }
    var data = {
        email: req.body.email,
        password : md5(req.body.password)
    }
    var sql ='INSERT INTO user (email, password) VALUES (?,?)'
    var params =[data.email, data.password]
    db.run(sql, params, (err, result) => {
        if (err) {
            res.status(400).send({"error": err.message})
            return;
        }
        let payload = { subject: data.id }
        let token = jwt.sign(payload, 'secretKey')
        res.status(200).send({token})
    });
});

router.post('/login', (req, res) => {
    var sql = "select * from user where email like ? and password like ?"
    var data = {
        email: req.body.email,
        password : md5(req.body.password)
    }
    var params = [data.email, data.password]
    db.all(sql, params, (err, data) => {
        if (err || data.length == 0) {
          res.status(400).send({"error": "No user find"});
          return;
        }
        else {
            let payload = { subject: data.id }
            let token = jwt.sign(payload, 'secretKey')
            res.status(200).send({token})
        }
    });
});

router.post('/allTables', verifyToken, (req, res) => {
    var sql = "SELECT name FROM sqlite_master WHERE type='table'"
    db.all(sql, (err, rows) => {
        if (err) {
          res.status(400).send({"error": err});
          return;
        }
        else {
            res.status(200).send({
                "message": "success",
                "data": rows
            })
        }
    });
});

function verifyToken(req, res, next) {
    if(!req.headers.authorization) {
        return res.status(401).send('Unauthorization request')
    }
    let token = req.headers.authorization.split(' ')[1]
    if (token === 'null') {
        return res.status(401).send('Unauthorization request')
    }
    let payload = jwt.verify(token, 'secretKey')
    if(!paylod) {
        return res.status(401).send('Unauthorization request')
    }
    req.id = payload.subject
    next()
}

module.exports = router