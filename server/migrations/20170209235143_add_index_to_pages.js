
exports.up = function(knex) {
    return knex.schema.alterTable('pages', (t) => {
        t.unique(['name', 'wiki']);
    });
};

exports.down = function(knex) {
    return knex.schema.alterTable('pages', (t) => {
        t.dropUnique(['name', 'wiki']);
    });
};
