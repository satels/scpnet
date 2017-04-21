'use strict';

const sentry = require('../config/sentry');
const pino = require('../config/pino');
const db = require('../config/db');
const cheerio = require('cheerio');

const OBJECT_TITLE_REGEXP = /^SCP/;

module.exports = function extractObjectTitles() {
    const wikiName = 'scp-wiki';
    const pageNames = ['scp-series', 'scp-series-2', 'scp-series-3', 'joke-scps', 'archived-scps', 'scp-ex'];

    return db.map(`
        SELECT data -> 'html' AS html
        FROM pages
        WHERE
          wiki = $(wikiName) AND name IN ($(pageNames:csv))
    `, {wikiName, pageNames}, page => page.html)

        .reduce((result, pageHtml) => result + pageHtml, '')

        .then((html) => {
            const $ = cheerio.load(html);
            return Array.from($('li')).reduce((objects, line) => {
                const text = $(line).text();
                if (OBJECT_TITLE_REGEXP.test(text)) {
                    objects.push({
                        name: text.split(' - ')[0].toLowerCase(),
                        title: text
                    });
                }
                return objects;
            }, []);
        })

        .map((object) => {
            return db.none(`
                UPDATE pages
                SET data = jsonb_set(data, '{extracted_title}', to_jsonb($(title)::text), TRUE)
                WHERE wiki = 'scp-wiki' AND name = $(name);
            `, object);
        }, {concurrency: 4})

        .catch((error) => {
            pino.error(error, 'Error extracting object titles');
            sentry.captureException(error);
        });
};
