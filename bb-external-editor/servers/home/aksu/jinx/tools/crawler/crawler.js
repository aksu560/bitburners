import { needle } from "../needle/needle";

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

    crawler(ns, main_file, payload_files, payload_args, max_dep, 0, ns.getHostname(), [], delay, exclude)
}


export async function crawler(ns, main_file, payload_files, payload_args, threads, max_dep, dep, server_name, visited, delay, exclude) {
    ns.disableLog('disableLog');
    ns.disableLog('scan');
    ns.disableLog('getServerMaxRam');
    visited.push(server_name);

    const unvisited = ns.scan(server_name).filter(n => !visited.includes(n));

    if (!exclude.includes(server_name)) {

        let local_threads = threads;

        if (threads == 'auto') {
            
            local_threads = Math.floor(ns.getServerMaxRam(server_name) / ns.getScriptRam(main_file));
            ns.print(server_name)
            ns.print('- ' + ns.getServerMaxRam(server_name) + 'GB')
            ns.printf('%d times %d threads = %dGB', ns.getScriptRam(main_file), local_threads, ns.getScriptRam(main_file) * local_threads)
        }

        if (local_threads > 0) {
            await needle(ns, server_name, main_file, payload_files, payload_args, local_threads, delay);
        }
    }

    if (unvisited.length == 0 || max_dep == dep) {
        return;
    }
    
    for (const server in unvisited) {
        await crawler(ns, main_file, payload_files, payload_args, threads, max_dep, dep + 1, unvisited[server], visited, delay, exclude);
    }
}