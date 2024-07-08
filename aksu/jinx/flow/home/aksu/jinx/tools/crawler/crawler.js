// servers/home/aksu/jinx/tools/needle/needle.js
async function needle(ns, target, main_file, payload_files, payload_args, threads, delay) {
  ns.disableLog("disableLog");
  ns.disableLog("scp");
  ns.disableLog("sleep");
  ns.scp(payload_files, target);
  ns.scp("aksu/jinx/lib.js", target);
  if (delay > 0) {
    await ns.sleep(delay);
  }
  return [ns.exec(main_file, target, threads, payload_args), target];
}

// servers/home/aksu/jinx/tools/crawler/crawler.js
async function main(ns) {
  const flags = ns.flags([
    ["payload", "ping"],
    ["payload-args", ""],
    ["max-depth", 0],
    ["exclude", ["home"]],
    ["delay", 100],
    ["threads", 1]
  ]);
  const payload_files = ns.ls(ns.getHostname(), flags["payload"]);
  const main_file = "aksu/jinx/payloads/" + flags["payload"] + "/" + flags["payload"] + ".js";
  const payload_args = flags["payload-args"];
  const max_dep = flags["max-depth"];
  const exclude = flags["exclude"];
  const delay = flags["delay"];
  const threads = flags["threads"];
  crawler(ns, main_file, payload_files, payload_args, max_dep, 0, ns.getHostname(), [], [], delay, exclude);
}
async function crawler(ns, main_file, payload_files, payload_args, threads, max_dep, dep, server_name, visited, execs, delay, exclude) {
  ns.disableLog("disableLog");
  ns.disableLog("scan");
  ns.disableLog("getServerMaxRam");
  visited.push(server_name);
  const unvisited = ns.scan(server_name).filter((n) => !visited.includes(n));
  if (!exclude.includes(server_name)) {
    let local_threads = threads;
    if (threads == "auto") {
      local_threads = Math.floor((ns.getServerMaxRam(server_name) - ns.getServerUsedRam(server_name)) / ns.getScriptRam(main_file));
    }
    if (local_threads > 0) {
      execs.push(await needle(ns, server_name, main_file, payload_files, payload_args, local_threads, delay));
    }
  }
  if (unvisited.length == 0 || max_dep == dep) {
    return execs;
  }
  for (const server in unvisited) {
    execs.concat(await crawler(ns, main_file, payload_files, payload_args, threads, max_dep, dep + 1, unvisited[server], visited, execs, delay, exclude));
  }
  return execs;
}
export {
  crawler,
  main
};
