// servers/home/aksu/jinx/lib.js
function parsePayloadArgs(args) {
  return JSON.parse(args.join());
}

// servers/home/aksu/jinx/payloads/ping/ping.js
async function main(ns) {
  let data = parsePayloadArgs(ns.args);
  if (!data) {
    data = {};
  }
  let greeting = "Hello from ";
  if (Object.keys(data).includes("greeting")) {
    greeting = data.greeting;
  }
  await ns.toast(greeting + " " + ns.getHostname());
  return true;
}
export {
  main
};
