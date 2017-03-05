'use strict';

const Promise = require('bluebird');
const queues = require('./../config/queues');
const wk = require('./../config/wikidot-kit');

const exit = () => process.nextTick(() => process.exit());
const task = process.argv[2];

switch (task) {
    case 'full-import':
        Promise.map(wk.wikiList, (wiki) => {
            return queues.importQueue.add({
                action: 'full-import',
                wiki
            });
        }).then(exit);
        break;

    case 'members-import':
        queues.importQueue.add({
            action: 'members-import',
            wiki: wk.wiki.SCP_RU
        }).then(exit);
        break;

    case 'extract-object-titles':
        queues.commonQueue.add({
            action: 'extract-object-titles'
        }).then(exit);
        break;

    case 'add-discord-member-roles':
        queues.commonQueue.add({
            action: 'add-discord-member-roles'
        }).then(exit);
        break;

    default:
        console.warn('Unknown task, exiting');
        exit();
}
