// servers/home/aksu/jinx/lib.js
function bfs(ns2, start) {
  let servers = ["home"];
  let parentByIndex = [""];
  let routes = { home: "home" };
  for (let server of servers) {
    for (let oneScanResult of ns2.scan(server).sort()) {
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

// servers/home/aksu/bin/goto.js
function main(ns) {
  let route = bfs(ns, ns.getHostname()).routes[ns.args[0]];
  try {
    const terminalInput = eval("document").getElementById("terminal-input");
    terminalInput.value = route;
    const handler = Object.keys(terminalInput)[1];
    terminalInput[handler].onChange({ target: terminalInput });
    terminalInput[handler].onKeyDown({ key: "Enter", preventDefault: () => null });
  } catch {
  }
  return 0;
}
export {
  main
};
