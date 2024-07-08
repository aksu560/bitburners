// servers/home/aksu/lib/rscan.js
var findPath = (ns, target, serverName, serverList, ignore, isFound) => {
  ignore.push(serverName);
  for (let server of ns.scan(serverName)) {
    if (ignore.includes(server)) {
      continue;
    }
    if (server === target) {
      serverList.push(server);
      return [serverList, true];
    }
    serverList.push(server);
    [serverList, isFound] = findPath(ns, target, server, serverList, ignore, isFound);
    if (isFound) {
      return [serverList, isFound];
    }
    serverList.pop();
  }
  return [serverList, false];
};

// servers/home/aksu/bin/tracert.js
async function main(ns) {
  let startServer = ns.getHostname();
  let target = ns.args[0];
  if (target === void 0) {
    ns.alert("Please provide target server");
    return;
  }
  let [results, isFound] = findPath(ns, target, startServer, [], [], false);
  if (!isFound) {
    ns.alert("Server not found!");
  } else {
    ns.tprint("\n" + results.join("\n"));
  }
}
export {
  main
};
