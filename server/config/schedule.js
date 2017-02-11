import './boot';
import {importQueue} from './queues';
import schedule from 'node-schedule';

const WIKI_LIST = [
    'scp-ru',
    'scp-wiki',
    'scpsandbox',
    'wanderers-library',
    'scp-int'
];

schedule.scheduleJob('0 3 * * *', () => {
    WIKI_LIST.forEach((wiki) => {
        importQueue.add({
            action: 'full-import',
            wiki
        });
    });
});
