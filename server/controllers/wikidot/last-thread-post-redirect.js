'use strict';

const URL = require('url');
const axios = require('axios');
const cheerio = require('cheerio');
const wk = require('../../config/wikidot-kit');
const sentry = require('../../config/sentry');

module.exports = (req, res) => {
    const topicURL = req.query.topic_url;
    const parsedURL = URL.parse(topicURL);

    if (!wk.wikiDomains.includes(parsedURL.hostname)) {
        return res.status(400).send({error: 'This domain name is not allowed'});
    }

    const topicRegMatch = /\/t-(\d+)\//.exec(topicURL);

    if (!topicRegMatch) {
        return res.status(400).send({error: 'Incorrect thread URL'});
    }

    const topicID = parseInt(topicRegMatch[1], 10);
    const wikiURL = `${parsedURL.protocol}//${parsedURL.host}`;

    return axios.get(topicURL)
        .then((topicPage) => {
            const $ = cheerio.load(topicPage.data);
            const totalPages = $('.pager .target:nth-last-child(2)').first().text();
            return wk.fetchThreadPage({wikiURL, topicID, pageNumber: totalPages});
        })
        .then((lastThreadPage) => {
            const lastPostID = lastThreadPage('.post-container').last().attr('id').slice(4); // fpc-1495911
            const resultingURL = `${wikiURL}${parsedURL.path}#post-${lastPostID}`;
            res.redirect(resultingURL);
        })
        .catch((error) => {
            console.error(error);
            sentry.captureException(error, {
                tags: {location: 'wikidot/last-thread-post-redirect'},
                extra: {topicURL}
            });
            res.status(500).send({error: 'Internal error :-('});
        });
};
