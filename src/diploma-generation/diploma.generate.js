const Handlebars = require('handlebars');
const fs = require('fs');

const templateSource = fs.readFileSync('../diploma.html', 'utf8');
const template = Handlebars.compile(templateSource);

const data = {
    title: 'Handlebars Demo',
    greeting: 'Hello',
    name: 'John',
    items: ['Apple', 'Banana', 'Orange'],
};
const output = template(data);
console.log(output);
