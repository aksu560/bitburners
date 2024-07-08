// servers/home/aksu/jinx/lib.js
function parsePayloadArgs(args) {
  return JSON.parse(args.join());
}
function xsinx(ns) {
  const foreignServers = bfs(ns).servers.filter((n) => !ns.getPurchasedServers().includes(n));
  let best_server = "";
  let best_score = -1;
  for (const server of foreignServers) {
    const score = calculate_xsinx(ns, server);
    if (ns.getServerRequiredHackingLevel(server) < ns.getHackingLevel() * 0.5 && score > best_score) {
      best_score = score;
      best_server = server;
    }
  }
  return best_server;
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
export {
  bfs,
  calculate_xsinx,
  parsePayloadArgs,
  xsinx
};
