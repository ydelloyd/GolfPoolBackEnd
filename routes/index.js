var express = require("express");
var router = express.Router();
const axios = require("axios");
const cheerio = require("cheerio");
router.get("/", function (req, res, next) {
  res.send("hello world");
});
/* GET home page. */
router.get("/teams", function (req, res, next) {
  axios
    .get(
      "https://raw.githubusercontent.com/ydelloyd/Datasets/master/teams.json"
    )
    .then((response) => {
      res.send(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
});

router.get("/leaderboard", function (req, res, next) {
  axios
    .get("https://www.espn.com/golf/leaderboard")
    .then((response) => {
      if (response) {
        const $ = cheerio.load(response.data);
        const $trs = $(".competitors tbody tr");
        const leaderboard = {};
        $trs.toArray().forEach((tr) => {
          const tds = $(tr).find("td").toArray();
          const playerPos = $(tds[0]).text();
          const playerName = $(tds[1]).text();
          const playerScore = $(tds[2]).text();
          leaderboard[playerName.replace(" (a)", "")] = {
            pos: playerPos,
            toPar: playerScore === "E" ? "0" : playerScore,
          };
        });
        res.send(leaderboard);
      } else {
        console.log("There was an error");
      }
    })
    .catch((error) => {
      console.log(error);
    });
});

module.exports = router;

//
