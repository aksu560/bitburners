import { needle } from "../needle/needle";

// How much free ram to keep on each server.
const FREE_RAM = {'home': 10 };

export async function main(ns) {
   const flags = ns.flags([
        ['payload', 'ping'],
        ['payload-args', ''],
        ['max-depth', 0],
        ['exclude', ["home"]],
        ['delay', 100],
        ['threads', 1]
    ]);

    const payload_files = ns.ls(ns.getHostname(), flags['payload']);
    const main_file = 'aksu/jinx/payloads/' + flags['payload'] + '/' + flags['payload'] + '.js';
    const payload_args = flags['payload-args'];
    const max_dep = flags['max-depth'];
    const exclude = flags['exclude'];
    const delay = flags['delay'];
    const threads = flags['threads']

    crawler(ns, main_file, payload_files, payload_args, max_dep, 0, ns.getHostname(), [], [], delay, exclude)
}


export async function crawler(ns, main_file, payload_files, payload_args, threads, max_dep, dep, server_name, visited, execs, delay, exclude) {
    ns.disableLog('disableLog');
    ns.disableLog('scan');
    ns.disableLog('getServerMaxRam');
    visited.push(server_name);

    const unvisited = ns.scan(server_name).filter(n => !visited.includes(n));

    if (!exclude.includes(server_name)) {

        let local_threads = threads;

        if (threads == 'auto') {
            let ram_offset = 0;

            if (Object.keys(FREE_RAM).includes(server_name)){
                ram_offset = FREE_RAM[server_name]
            }

            local_threads = Math.floor((ns.getServerMaxRam(server_name) - ns.getServerUsedRam(server_name) - ram_offset) / ns.getScriptRam(main_file));
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