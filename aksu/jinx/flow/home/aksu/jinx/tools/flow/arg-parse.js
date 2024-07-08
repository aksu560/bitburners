// servers/home/aksu/jinx/tools/flow/arg-parse.js
function parseArguments(arg, variables) {
  const templateLiteralRegex = /\$\{([^}]+)\}/g;
  return arg.replace(templateLiteralRegex, (_, key) => variables[key] !== void 0 ? variables[key] : `\${${key}}`);
}
export {
  parseArguments
};
