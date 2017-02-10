import {query} from '../config/db';

export default function (req, res) {
    throw new Error('beep');
    query('select 2 + 2 as result')
        .then((resp) => {
            res.send({result: resp.rows[0].result});
        });
}
