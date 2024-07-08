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

// servers/home/aksu/jinx/lib.js
function parsePayloadArgs(args) {
  return JSON.parse(args.join());
}

// servers/home/aksu/jinx/tools/plexer/plexer.js
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

// servers/home/aksu/jinx/tools/flow/arg-parse.js
function parseArguments(arg, variables) {
  const templateLiteralRegex = /\$\{([^}]+)\}/g;
  return arg.replace(templateLiteralRegex, (_, key) => variables[key] !== void 0 ? variables[key] : `\${${key}}`);
}

// servers/home/aksu/jinx/tools/flow/config-parse.js
function parseConfig(ns) {
  const flags = ns.flags([
    ["file", ""]
  ]);
  let file = "";
  if (ns.args.length == 1) {
    file = ns.args[0];
  } else {
    ns.tprint("Please provide a flow file");
    return false;
  }
  const config_file_location = "aksu/jinx/flow/" + file + ".js";
  const config_file = ns.read(config_file_location).split("=")[1].split(";")[0];
  const config = JSON.parse(config_file);
  return config;
}

// servers/home/aksu/jinx/tools/flow/flow.js
async function main(ns) {
  const config = parseConfig(ns);
  if (!config) {
    return;
  }
  let last_exit;
  let variables = {};
  for (const index in config) {
    if (config[index].skip) {
      ns.print("Skipping step " + index);
      continue;
    }
    ns.print("Step " + index);
    let phase = config[index];
    phase = JSON.parse(parseArguments(JSON.stringify(phase), variables));
    const type = phase.type;
    if (type == "needle") {
      const payload = phase.payload;
      const args = JSON.stringify(phase.args);
      const host = phase.host;
      const payload_files = ns.ls(ns.getHostname(), "aksu/jinx/payloads/" + payload);
      const main_file = "aksu/jinx/payloads/" + payload + "/" + payload + ".js";
      const delay = phase.delay;
      let threads = phase.threads;
      if (threads == "auto") {
        const remaining_ram = ns.getServerMaxRam(host) - ns.getServerUsedRam(host);
        threads = Math.floor(remaining_ram / ns.getScriptRam(main_file));
      }
      if (threads > 0) {
        last_exit = await needle(ns, host, main_file, payload_files, args, threads, delay);
      } else {
        last_exit = false;
      }
    }
    if (type == "plexer") {
      const payload = phase.payload;
      const args = JSON.stringify(phase.args);
      const host = phase.host;
      const payload_files = ns.ls(ns.getHostname(), "aksu/jinx/payloads/" + payload);
      const main_file = "aksu/jinx/payloads/" + payload + "/" + payload + ".js";
      const delay = phase.delay;
      const max_dep = phase.max_depth;
      const exclude = phase.exclude;
      last_exit = await plexer(ns, host, main_file, payload_files, args, delay, max_dep, 0, host, [], [], exclude);
    }
    if (type == "crawler") {
      const payload = phase.payload;
      const args = JSON.stringify(phase.args);
      const host = phase.host;
      const payload_files = ns.ls(ns.getHostname(), "aksu/jinx/payloads/" + payload);
      const main_file = "aksu/jinx/payloads/" + payload + "/" + payload + ".js";
      const delay = phase.delay;
      let threads = phase.threads;
      const max_dep = phase.max_depth;
      const exclude = phase.exclude;
      last_exit = await crawler(ns, main_file, payload_files, args, threads, max_dep, 0, host, [], [], delay, exclude);
    }
    if (type == "save_exit") {
      const variable = phase.variable;
      last_exit = variables[variable] = last_exit;
    }
    if (type == "print") {
      const variable = phase.variable;
      last_exit = ns.tprint(variables[variable]);
    }
    if (type == "flow") {
      const file = phase.file;
      let new_ns = ns;
      new_ns.args[0] = file;
      last_exit = await main(new_ns);
    }
    if (type == "toast") {
      const message = phase.message;
      ns.toast(message);
      last_exit = message;
    }
    if (type == "set_var") {
      for (let variable of phase.variables) {
        variables[variable[0]] = variable[1];
      }
      last_exit = phase.variables;
    }
  }
  return variables;
}
export {
  main
};
