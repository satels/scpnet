import {Model} from 'objection';
import {WikidotWikiList} from '../config/wikidot-wiki-list';

export default class Page extends Model {
    static tableName = 'pages';

    static jsonSchema = {
        type: 'object',
        required: ['name', 'wiki', 'data'],

        properties: {
            name: {type: 'string'},
            wiki: {enum: WikidotWikiList},
            data: {type: 'object'}
        }
    };
}
