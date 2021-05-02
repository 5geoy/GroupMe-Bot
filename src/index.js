const http = require('http');
const director = require('director');
const bot = require('./bot');
const config = require('./config')
const cron = require('node-cron')
const path = require('path')
const fs = require('fs');
console.log(__dirname)
let rawdata = fs.readFileSync(path.resolve(__dirname, './events.json'));
let eventsData = JSON.parse(rawdata);
const router = new director.http.Router({
    '/' : {
      post: bot.respond,
      get: ping
    }
  });

const server = http.createServer((req, res) => {
    req.chunks = [];
    req.on('data', chunk => {
      req.chunks.push(chunk.toString());
    });

    router.dispatch(req, res, err => {
      res.writeHead(err.status, {"Content-Type": "text/plain"});
      res.end(err.message);
    });
  });

const port = Number(process.env.PORT || 5000);
for (let index = 0; index < eventsData.length; index++) {
  console.log(eventsData[index]);
  cron.schedule(eventsData[index].cronTime,((indexy) => {
    return () =>{  
      body = {
        "bot_id": config.BOT_ID,
        "text": eventsData[indexy].eventMessage,
        "attachments" : [
            {
                "type" : "image",
                "url" : eventsData[indexy].imageURL
            }
        ]
      }
      bot.postMsg(body);
      console.log(body);
      console.log(eventsData[indexy].eventName);
    };
  })(index),
                {
      timezone: "America/New_York"
  });
};

server.listen(port);

function ping() {
  this.res.writeHead(200);
  this.res.end("Bot running.");
}
