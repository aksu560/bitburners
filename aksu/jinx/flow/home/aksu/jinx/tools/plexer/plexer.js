// servers/home/aksu/jinx/lib.js
function parsePayloadArgs(args) {
  return JSON.parse(args.join());
}

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

// servers/home/aksu/jinx/tools/plexer/plexer.js
async function main(ns) {
  const flags = ns.flags([
    ["payload", "ping"],
    ["payload-args", ""],
    ["max-depth", 0],
    ["delay", 50],
    ["exclude", ["home"]],
    ["host", "home"]
  ]);
  const payload_files = ns.ls(ns.getHostname(), flags["payload"]);
  const main_file = "aksu/jinx/payloads/" + flags["payload"] + "/" + flags["payload"] + ".js";
  const payload_args = flags["payload-args"];
  const max_dep = flags["max-depth"];
  const delay = flags["delay"];
  const exclude = flags["exclude"];
  const host = flags["host"];
  await plexer(ns, host, main_file, payload_files, payload_args, delay, max_dep, 0, ns.getHostname(), [], [], exclude);
}
async function plexer(ns, host, main_file, payload_files, payload_args, delay, max_dep, dep, server_name, visited, execs, exclude) {
  visited.push(server_name);
  const unvisited = ns.scan(server_name).filter((n) => !visited.includes(n));
  const args = parsePayloadArgs([payload_args]);
  args["target"] = server_name;
  if (!exclude.includes(server_name)) {
    execs.push(await needle(ns, host, main_file, payload_files, JSON.stringify(args), 1, delay));
  }
  if (unvisited.length == 0 || max_dep == dep) {
    return execs;
  }
  for (const server in unvisited) {
    execs.concat(await plexer(ns, host, main_file, payload_files, payload_args, delay, max_dep, dep + 1, unvisited[server], visited, execs, exclude));
  }
  return execs;
}
export {
  main,
  plexer
};
