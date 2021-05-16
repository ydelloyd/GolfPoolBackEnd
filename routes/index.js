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
        const ind = {};
        const $ = cheerio.load(response.data);
        const $th = $(".competitors thead tr");
        const th = $($th.toArray()[0]).find("th").toArray();
        th.forEach((e,i)=>{
          ind[$(e).text()] = i
        });
        const $trs = $(".competitors tbody tr");
        const leaderboard = {};
        // console.log($trs.toArray()[0].find("td").toArray());
        $trs.toArray().forEach((tr) => {
          const tds = $(tr).find("td").toArray();
          const playerPos = $(tds[ind["POS"]]).text();
          const playerName = $(tds[ind["PLAYER"]]).text();
          const playerScore = $(tds[ind["TO PAR"]]).text();
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
