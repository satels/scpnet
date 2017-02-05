import initKnex from 'knex';
import {Model} from 'objection';

export const knex = initKnex({
    client: 'pg',
    connection: process.env.POSTGRES_DSN
});
Model.knex(knex);
const query = knex.raw.bind(knex);

export {query};
export {Page} from '../models/page';
