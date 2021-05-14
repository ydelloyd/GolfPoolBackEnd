var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    port: 465,               // true for 465, false for other ports
    host: "smtp.gmail.com",
    auth: {
        user: 'dyingduckoboeplayer@gmail.com',
        //ADD PASSWORD HERE
        pass: '',
    },
    secure: true,
});

const knex = require('../db')

router.get('/all', function (req, res, next) {
    knex.select("*").from("team").then((e) => {
        if (e.length === 0) {
            res.status(404).send("Could not find teams");
        } else {
            res.send(e);
        }
    }).catch((error) => {
        res.status(500).send(error);
    })
});

router.get('/eventId/:id', function (req, res, next) {
    knex.select("*").from("team").where("eventId", req.params.id).then((e) => {
        if (e.length === 0) {
            res.send([])
        } else {
            res.send(e);
        }
    }).catch((error) => {
        res.status(500).send(error);
    })
});

router.post('/', function (req, res, next) {
    const mailData = {
        from: 'dyingduckoboeplayer@gmail.com',  // sender address
        to: 'ydelloyd@gmail.com',   // list of receivers
        subject: 'New team was created',
        text: `A team ${req.body.name} was created by ${req.body.owner} with player 1 as ${req.body.player1}, player 2 as ${req.body.player2}, player 3 as ${req.body.player3}, player 3 as ${req.body.player3}, player 4 as ${req.body.player4}, player 5 as ${req.body.player5} at ${new Date()}.
          Data Dump: ${JSON.stringify(req.body)}`,
    };
    transporter.sendMail(mailData, function (err, info) {
        if (err)
            console.log(err)
        else
            console.log(info);
    });
    knex("team")
        .insert(req.body)
        .then((e) => {
            res.send(e);
        })
        .catch((error) => {
            console.log(error);
            res.status(500).send(error);
        })
})

module.exports = router;
