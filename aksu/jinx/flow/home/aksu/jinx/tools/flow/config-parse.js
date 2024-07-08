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
export {
  parseConfig
};
