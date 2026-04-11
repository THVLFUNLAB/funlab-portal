const { transform } = require('sucrase');
const code = `<div className="test">Hello</div>`;
console.log(transform(code, { transforms: ['jsx'], production: true }).code);
