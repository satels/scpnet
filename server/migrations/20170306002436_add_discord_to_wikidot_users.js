'use strict';

/* eslint-disable max-len */

exports.up = (knex) => {
    return knex.raw('ALTER TABLE wikidot_users ADD COLUMN discord jsonb;');
};

exports.down = (knex) => {
    return knex.raw('ALTER TABLE wikidot_users DROP COLUMN discord;');
};
