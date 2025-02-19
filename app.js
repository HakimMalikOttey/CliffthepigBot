var http = require('http')
const tmi = require('tmi.js');
http.createServer(function(request,response){
    const client = new tmi.Client({
        channels: [ 'cliffthepig' ]
    });
    
    client.connect();
    let count = 0;
    let listeningForCount = false;
    const users = {}
    client.on('message', (channel, tags, message, self) => {
        const {username } = tags;
        if(self) return true;
        if(username === 'cliffthepig' && message === '!start-count'){
            listeningForCount = true;
        }
        else if(username === 'cliffthepig' && message === '!end-count'){
            listeningForCount = false;
        }
        else if(listeningForCount && message == '1'){
            users[tags.username] = true;
        }
    
    });
}).listen(process.env.PORT)