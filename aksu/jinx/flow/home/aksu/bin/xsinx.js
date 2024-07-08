// servers/home/aksu/jinx/lib.js
function xsinx(ns) {
  return bfs(ns).servers.filter((n) => !ns.getPurchasedServers().includes(n)).filter((x) => ns.getServerRequiredHackingLevel(x) < ns.getHackingLevel() * 0.5).map((x) => [calculate_xsinx(ns, x), x]).reduce((a, b) => a[0] > b[0] ? a : b)[1];
}
function calculate_xsinx(ns, host) {
  return ns.getServerMaxMoney(host) / ns.getServerMinSecurityLevel(host);
}
function bfs(ns, start) {
  let servers = ["home"];
  let parentByIndex = [""];
  let routes = { home: "home" };
  for (let server of servers) {
    for (let oneScanResult of ns.scan(server).sort()) {
      if (!servers.includes(oneScanResult)) {
        servers.push(oneScanResult);
        parentByIndex.push(server);
        routes[oneScanResult] = routes[server] + ";connect " + oneScanResult;
      }
    }
  }
  return {
    servers,
    parentByIndex,
    routes
  };
}

// servers/home/aksu/bin/xsinx.js
async function main(ns) {
  ns.tprintf(xsinx(ns));
  return 0;
}
export {
  main
};
