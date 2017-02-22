'use strict';

const WikidotKit = require('../lib/wikidot-kit');

const token = process.env.SCPNET_WIKIDOT_TOKEN || process.env.WIKIDOT_TOKEN;
const wk = new WikidotKit({token});

const WIKIS = {
    SCP_RU: {
        name: 'scp-ru',
        url: 'http://scpfoundation.ru',
        title: 'SCP Foundation Russia',
        description: 'Russian branch main wiki'
    },

    SCP_WIKI: {
        name: 'scp-wiki',
        url: 'http://www.scp-wiki.net',
        title: 'SCP Foundation',
        description: 'Original English wiki'
    },

    SCPSANDBOX: {
        name: 'scpsandbox',
        url: 'http://sandbox.scpfoundation.ru',
        title: 'SCP Foundation Russia Sandbox',
        description: 'Russian branch sandbox wiki'
    },

    WANDERERS_LIBRARY: {
        name: 'wanderers-library',
        url: 'http://wanderers-library.wikidot.com',
        title: 'The Wanderers\' Library',
        description: 'Collaborative fiction exercise'
    }
};

wk.wiki = WIKIS;
wk.wikiList = Object.keys(WIKIS).reduce((acc, name) => acc.concat(WIKIS[name]), []);

module.exports = wk;
