import '../config/boot';
import WikidotKit from 'wikidot-kit';
import Page from '../models/page';

const token = process.env.WIKIDOT_TOKEN;
const wk = new WikidotKit({token});

const concurrency = 1;
const wiki = 'scp-ru';

const importPage = (name) => {
    return wk.fetchPage({wiki, name})
        .catch((error) => {
            console.error('Error fetching page from Wikidot', error);
        })
        .then((data) => {
            return Page
                .query()
                .insert({
                    name,
                    wiki,
                    data
                });
        })
        .then(() => {
            console.log(`[DONE] ${wiki}/${name}`);
        })
        .catch((error) => {
            console.error('Error saving page', error);
        });
};

// Fetch and print all page names in selected wiki
wk.fetchPagesList({wiki: 'scp-ru'})
    .map(importPage, {concurrency})
    .finally(() => process.exit(0));

