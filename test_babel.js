const Babel = require('@babel/standalone');
const code = `<div className="test">Hello</div>`;
try {
  console.log(Babel.transform(code, { presets: ['react'] }).code);
} catch (e) {
  console.error(e);
}
