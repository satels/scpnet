'use strict';

const PAGE_NAME_REGEXP = /^[\w-]+$/;

module.exports = (req, res) => {
    const name = req.params.name;

    if (!name || !PAGE_NAME_REGEXP.test(name)) {
        return res.status(400).send({error: 'Bad page name'});
    }

    return res.send(`
        <script>
            console.log('scpnet wikidot mobile redirect frame loaded, page name: ${name}');
        </script>
    `);
};
