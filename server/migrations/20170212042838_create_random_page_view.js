'use strict';

/* eslint-disable max-len */

exports.up = (knex) => {
    return knex.raw(`
        CREATE OR REPLACE VIEW random_page AS
          SELECT wp.name AS name
          FROM
            (SELECT
               id,
               array_agg(lower(tag)) AS all_tags
             FROM (
                    SELECT
                      id,
                      jsonb_array_elements_text(data -> 'tags') AS tag
                    FROM pages
                    WHERE wiki = 'scp-ru') inner_tags
             GROUP BY id
             HAVING
               string_to_array(lower('безопасный евклид кетер таумиэль нейтрализованный не_назначен ru шуточный архив рассказ'),
                               ' ') && array_agg(lower(tag))
            ) taglist
            INNER JOIN pages wp ON wp.id = taglist.id
          ORDER BY random()
          LIMIT 1;
    `);
};

exports.down = (knex) => {
    return knex.raw('DROP VIEW random_page;');
};
