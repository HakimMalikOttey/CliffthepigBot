require('dotenv').config()
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const tmi = require('tmi.js');
const {Server} = require('socket.io');
const cors = require('cors');
const PORT = process.env.PORT || 3000;
const regexpCommand = new RegExp(/^!([a-zA-Z0-9]+)(?:\W+)?(.*)?/);
const commands = {
    website:{
        response:"https://google.com"
    },
    upvote:{
        response:(user)=>`User ${user} was just upvoted`
    }
};
const io = new Server(server);
    const client = new tmi.Client({
        connection:{
            reconnect:true
        },
        identity: {
            username: process.env.TWITCH_BOT_USERNAME,
            password: process.env.TWITCH_OAUTH_TOKEN
        },
        channels: [ 'cliffthepig' ]
    });
    app.get('/',(req,res)=>{
        res.write(`<h1>Socket IO has started at port: ${PORT} </h1>`);
        res.end();
    });
    
    client.connect();
    var isNotBot = "";
    var username = "";
    io.on("connection",(socket)=>{
    client.on('message', (channel, tags, message, self) => {
        isNotBot = tags.username.toLowerCase() !== process.env.TWITCH_BOT_USERNAME;
        username = tags.username;
        if(!isNotBot) return;
        const [raw,command,argument] = message.match(regexpCommand);
        const {response} =  commands[command] || {}
        if(typeof response === 'function'){
            client.say(channel,response(username));
            socket.emit('updatePNGTuber',"Wrestling");
        }
        else if(typeof response === 'string'){
            client.say(channel,response);
            socket.emit('updatePNGTuber',"Wrestling");
        }
    });
});
server.listen(PORT);