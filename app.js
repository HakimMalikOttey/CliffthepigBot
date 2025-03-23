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
    bearhug:{
        response: `Terrence isn't going to let go that easily!`,
        type: 'tuberChange',
        action:'terrencechokecliff'
    },
    bearchoke:{
        response: `Gonna get put in the sling!`,
        type: 'tuberchange',
        action:'terrencechokecliffjock'
    },
    pigpen:{
        response: `You're my appetizer~!`,
        type: 'tuberchange',
        action: 'cliffchoketerrence'
    },
    saltlick:{
        response: `Mmmm...blueberry!`,
        type: 'tuberchange',
        action: 'cliffchoketerrencejock'
    },
    side:{
        response: 'Getting pumped for the big fight!',
        type: 'tuberchange',
        action: 'cliffside'
    },
    boots:{
        response: 'Here to fix your pipes (:',
        type: 'tuberchange',
        action:'terrencejock'
    },
    back:{
        response: 'Chained and collared.',
        type: 'tuberchange',
        action: 'dominickliffthong'
    },
    hair:{
        response: 'Dominic decided to let his hair grow!',
        type: 'tuberchange',
        action:'dominicfrontflex'
    },
    lost:{
        response: `Caught a nice piece of meat today!`,
        type:'tuberchange',
        action:'dominickliffcarry'
    },
    
    // pigpen:{
    //     response:(user)=>`User ${user} was just upvoted`
    // }
};
const io = new Server(server,{
        cors: {
          origin: '*',
        }
});
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
});
client.on('message', (channel, tags, message, self) => {
    isNotBot = tags.username.toLowerCase() !== process.env.TWITCH_BOT_USERNAME.toLowerCase();
    username = tags.username;
    if(!isNotBot) return;
    const [raw,command,argument] = message.match(regexpCommand);
    const {response} =  commands[command] || {}
    if(response){
    if(typeof response === 'function'){
        client.say(channel,response(username));
        io.emit('updatePNGTuber',"Wrestling");
    }
    else if(typeof response === 'string'){
        client.say(channel,response);
        io.emit('updatePNGTuber',"Wrestling");
    }
}
});
server.listen(PORT);