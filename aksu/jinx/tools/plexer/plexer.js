import { parsePayloadArgs } from "../../lib";

export async function main(ns) {
    const flags = ns.flags([
        ['payload', 'ping'],
        ['payload-args', ''],
        ['max-depth', 0],
        ['delay', 50],
        ['exclude', ['home']]
     ]);
 
     const payload_files = ns.ls(ns.getHostname(), flags['payload']);
     const main_file = 'aksu/jinx/payloads/' + flags['payload'] + '/' + flags['payload'] + '.js';
     const payload_args = flags['payload-args'];
     const max_dep = flags['max-depth'];
     const delay = flags['delay'];
     const exclude = flags['exclude'];
 
     await plexer(ns, main_file, payload_files, payload_args, delay, max_dep, 0, ns.getHostname(), [], exclude)
 }
 
 
 
 
 async function plexer(ns, main_file, payload_files, payload_args, delay, max_dep, dep, server_name, visited, exclude) {
    visited.push(server_name);

    const unvisited = ns.scan(server_name).filter(n => !visited.includes(n));
    const args = parsePayloadArgs([payload_args]);
    args.target = server_name;

    if (! exclude.includes(server_name)) {
        await ns.run(main_file, 1, JSON.stringify(args));
    }

    if (unvisited.length == 0 || max_dep == dep) {
        return;
    }

    for (const server in unvisited) {
        await ns.sleep(delay);
        await plexer(ns, main_file, payload_files, payload_args, delay, max_dep, dep + 1, unvisited[server], visited, exclude);
}
 }