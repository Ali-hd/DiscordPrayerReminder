const express = require("express");
const { Client } = require("discord.js");
const PrayTimes = require("./prayTimes");
const cities = require("cities.json");
require('dotenv').config();

const app = express();
app.use(express.json());

var datetime;
var currentdate;
var sent = false;

const client = new Client();

client.login(process.env.TOKEN);

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);

  setInterval(() => {
    var prayers = new PrayTimes("Makkah");
    // Jeddah Time
    var times = prayers.getTimes(new Date(), [21.588758, 39.145317], 3);

    setInterval(() => {
      currentdate = new Date();
      datetime = currentdate.getHours() + ":" + currentdate.getMinutes();

      for (const [key, value] of Object.entries(times)) {
        // console.log(`${value} == ${datetime.substring(0, 5)} and sent = ${sent}`)
        if (value == datetime && sent == false) {
          try {
            client.guilds.cache.map((server) => {
              server.channels.cache.map((channel) => {
                if (channel.name == "general") {
                  channel.send(`It's now ${key} prayer time. :)`);
                }
              });
              // console.log(server.channels)
            });
          } catch (err) {
            console.log(err);
          }
          sent = true;
          setTimeout(() => (sent = false), 1000 * 60);
        }
      }
    }, 2000);
  }, 1000 * 60 * 60 * 24);
});


app.get("/", async (req, res) => {
  console.log("Request recieved!");
  res.json("Real human bean");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`server is running on port ${PORT}`));

module.exports = app;
