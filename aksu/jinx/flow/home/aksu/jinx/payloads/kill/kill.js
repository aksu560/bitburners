// servers/home/aksu/jinx/lib.js
function parsePayloadArgs(args) {
  return JSON.parse(args.join());
}

// servers/home/aksu/jinx/payloads/kill/kill.js
async function main(ns) {
  let args = "";
  if (ns.args.length > 0) {
    args = ns.args;
  }
  const target = parsePayloadArgs(args).target;
  ns.killall(target);
  return true;
}
export {
  main
};
