import {FOO} from './foo';

function greeter({name}) {
    console.log(`Hi, ${name}!`);
}

greeter({name: FOO});
