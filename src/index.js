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
//let bruh = []
//bruh.push(cron.schedule("* * * * *", () =>{
//    console.log('running every minute')
//}))
//let Tasklist = []
for (let index = 0; index < eventsData.length; index++) {
  cron.schedule(eventsData[index].cronTime,(() => {
    return () =>{  
      body = {
        "bot_id": config.BOT_ID,
        "text": eventsData[index].eventMessage
      }
      bot.postMsg(body);
      console.log(eventsData[index].eventName);
    };
  })());
};

server.listen(port);

function ping() {
  this.res.writeHead(200);
  this.res.end("Bot running.");
}
