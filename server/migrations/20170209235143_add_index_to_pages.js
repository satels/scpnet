'use strict';

exports.up = (knex) => {
    return knex.schema.alterTable('pages', (t) => {
        t.unique(['name', 'wiki']);
    });
};

exports.down = (knex) => {
    return knex.schema.alterTable('pages', (t) => {
        t.dropUnique(['name', 'wiki']);
    });
};
