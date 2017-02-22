'use strict';

const path = require('path');
// const webpack = require('webpack');

module.exports = {
    entry: './ui/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'server/public')
    }
};
