import db from '../config/db';

export default function (req, res) {
    db.one('select 2 + 2 as result')
        .then((result) => res.send(result));
}
