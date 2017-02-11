import WikidotKit from 'wikidot-kit';

const token = process.env.WIKIDOT_TOKEN;
const wk = new WikidotKit({token});

export default wk;
