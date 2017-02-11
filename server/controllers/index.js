export default function (req, res) {
    res.send(`
        <style>
            html {
                background: #222;
                color: #1dee44;
                text-align: center;
                line-height: 90vh;
                font-family: Menlo, Monaco, Consolas, "Courier New", monospace;
                text-transform: uppercase;
            }
        </style>
        All systems operational.
    `);
}
