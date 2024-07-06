export async function main(ns) {
   const flags = ns.flags([
        ['payload', 'ping'],
        ['payload-args', ''],
        ['max-depth', 0]
    ]);

    const payload_files = ns.ls(ns.getHostname(), flags['payload']);
    const main_file = 'aksu/jinx/payloads/' + flags['payload'] + '/' + flags['payload'] + '.js';
    const payload_args = flags['payload-args'];
    const max_dep = flags['max-depth']

    crawler(ns, main_file, payload_files, payload_args, max_dep, 0, ns.getHostname(), [])
}




function crawler(ns, main_file, payload_files, payload_args, max_dep, dep, server_name, visited) {
    visited.push(server_name);

    const unvisited = ns.scan(server_name).filter(n => !visited.includes(n));

    ns.scp(payload_files, server_name);
    ns.scp('aksu/jinx/lib.js', server_name);

    ns.exec(main_file, server_name, 1, payload_args);

    if (unvisited.length == 0 || max_dep == dep) {
        return;
    }
    
    for (const server in unvisited) {
        crawler(ns, main_file, payload_files, payload_args, max_dep, dep + 1, unvisited[server], visited);
    }
}