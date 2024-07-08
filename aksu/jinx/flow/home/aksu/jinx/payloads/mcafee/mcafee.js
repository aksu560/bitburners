// servers/home/aksu/jinx/lib.js
function parsePayloadArgs(args) {
  return JSON.parse(args.join());
}

// servers/home/aksu/jinx/payloads/mcafee/mcafee.js
async function main(ns) {
  let args = "";
  if (ns.args.length > 0) {
    args = ns.args;
  }
  let data = parsePayloadArgs(args);
  const target = data.target;
  const moneyThresh = ns.getServerMaxMoney(target) * 0.75;
  const securityThresh = ns.getServerMinSecurityLevel(target) + 5;
  ns.toast("Starting McAfee against " + target);
  while (true) {
    if (ns.getServerSecurityLevel(target) > securityThresh) {
      await ns.weaken(target);
    } else if (ns.getServerMoneyAvailable(target) < moneyThresh) {
      await ns.grow(target);
    } else {
      await ns.hack(target);
    }
  }
}
export {
  main
};
