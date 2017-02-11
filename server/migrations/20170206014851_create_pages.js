
exports.up = (knex) => {
    return knex.schema.createTable('pages', (table) => {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.string('wiki').notNullable();
        table.jsonb('data');
    });
};

exports.down = (knex) => {
    return knex.schema
        .dropTableIfExists('pages');
};
