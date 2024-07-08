export function parseArguments(arg, variables) {
    const templateLiteralRegex = /\$\{([^}]+)\}/g;
    return arg.replace(templateLiteralRegex, (_, key) => variables[key] !== undefined ? variables[key] : `\${${key}}`);
}