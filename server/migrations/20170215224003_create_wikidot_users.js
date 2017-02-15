'use strict';

exports.up = (knex) => {
    return knex.schema.createTable('wikidot_users', (table) => {
        table.integer('uid').primary();
        table.string('username').notNullable();
        table.index('username');
        table.datetime('registration_date');
        table.text('about');
        table.jsonb('memberships');
        table.jsonb('data');
    });
};

exports.down = (knex) => {
    return knex.schema
        .dropTableIfExists('wikidot_users');
};
