// servers/home/aksu/jinx/lib.js
function parsePayloadArgs(args) {
  return JSON.parse(args.join());
}

// servers/home/aksu/jinx/payloads/vanish/vanish.js
async function main(ns) {
  let args = "";
  if (ns.args.length > 0) {
    args = ns.args;
  }
  const target = parsePayloadArgs(args).target;
  ns.killall(target);
  const files = ns.ls(target, "aksu");
  for (const i in files) {
    const file = files[i];
    ns.rm(file, target);
  }
  return true;
}
export {
  main
};
