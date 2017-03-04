'use strict';

const Discord = require('discord.js');
const hatbot = new Discord.Client();
const token = process.env.SCPNET_DISCORD_TOKEN || process.env.DISCORD_TOKEN;

hatbot.on('ready', () => {
    console.log('Hatbot is ready');
});

hatbot.on('message', (message) => {
    if (message.content === 'ping') {
        message.channel.sendMessage('pong');
    }
});

hatbot.login(token);
