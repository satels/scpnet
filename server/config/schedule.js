'use strict';

require('./boot');
const queues = require('./queues');
const schedule = require('node-schedule');
const wk = require('./wikidot-kit');

const WIKI_LIST = [
    'scp-ru',
    'scp-wiki',
    'scpsandbox',
    'wanderers-library'
    // 'scp-int'
];

schedule.scheduleJob('0 3 * * *', () => {
    WIKI_LIST.forEach((wiki) => {
        queues.importQueue.add({
            action: 'full-import',
            wiki
        });
    });
});

schedule.scheduleJob('0 6 * * *', () => {
    queues.importQueue.add({
        action: 'members-import',
        wiki: wk.wiki.SCP_RU
    });
});

schedule.scheduleJob('0 8 * * *', () => {
    queues.commonQueue.add({
        action: 'extract-object-titles'
    });
});
