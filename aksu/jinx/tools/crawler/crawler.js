import { needle } from "../needle/needle";

export async function main(ns) {
   const flags = ns.flags([
        ['payload', 'ping'],
        ['payload-args', ''],
        ['max-depth', 0],
        ['exclude', ["home"]],
        ['delay', 100]
    ]);

    const payload_files = ns.ls(ns.getHostname(), flags['payload']);
    const main_file = 'aksu/jinx/payloads/' + flags['payload'] + '/' + flags['payload'] + '.js';
    const payload_args = flags['payload-args'];
    const max_dep = flags['max-depth'];
    const exclude = flags['exclude'];
    const delay = flags['delay'];

    crawler(ns, main_file, payload_files, payload_args, max_dep, 0, ns.getHostname(), [], exclude)
}


export async function crawler(ns, main_file, payload_files, payload_args, max_dep, dep, server_name, visited, delay, exclude) {
    visited.push(server_name);

    const unvisited = ns.scan(server_name).filter(n => !visited.includes(n));

    if (!exclude.includes(server_name)) {
        await needle(ns, server_name, main_file, payload_files, payload_args, 1, delay);
    }

    if (unvisited.length == 0 || max_dep == dep) {
        return;
    }
    
    for (const server in unvisited) {
        await crawler(ns, main_file, payload_files, payload_args, max_dep, dep + 1, unvisited[server], visited, delay, exclude);
    }
}