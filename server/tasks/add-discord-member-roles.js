'use strict';

const sentry = require('../config/sentry');
const Discord = require('discord.js');
const discord = new Discord.Client();
const pino = require('../config/pino');
const db = require('../config/db');
const token = process.env.SCPNET_DISCORD_TOKEN || process.env.DISCORD_TOKEN;

const SCP_RU_GUILD_ID = '106464299056128000';

module.exports = function addDiscordMemberRoles() {
    discord.on('ready', () => {
        const guild = discord.guilds.find((data, key) => key === SCP_RU_GUILD_ID);
        const memberRole = guild.roles.find((role) => {
            return role.name === 'members';
        });

        db.map(`
            SELECT SUBSTRING(about FROM 'Discord<(.*)>') as discord_id
            FROM wikidot_users
            WHERE memberships ? 'scp-ru' AND about LIKE '%Discord<%>%';
        `, {}, result => result.discord_id)
            .then((memberDiscordIDs) => {
                return guild.members.filterArray((member) => {
                    const user = member.user;
                    const userID = `${user.username}#${user.discriminator}`;
                    return memberDiscordIDs.includes(userID);
                });
            })
            .map((userToUpdate) => {
                return userToUpdate.addRole(memberRole);
            })
            .catch((error) => {
                pino.error(error, 'Error setting discord member roles');
                sentry.captureException(error);
            });
    });

    discord.login(token);
};
