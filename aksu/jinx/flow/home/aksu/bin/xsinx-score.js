// servers/home/aksu/jinx/lib.js
function calculate_xsinx(ns, host) {
  return ns.getServerMaxMoney(host) / ns.getServerMinSecurityLevel(host);
}

// servers/home/aksu/bin/xsinx-score.js
async function main(ns) {
  ns.tprintf(calculate_xsinx(ns, ns.args[0]));
  return 0;
}
export {
  main
};
