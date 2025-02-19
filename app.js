const tmi = require('tmi.js');


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
        console.log(`${tags['display-name']}: ${message}`);
    });