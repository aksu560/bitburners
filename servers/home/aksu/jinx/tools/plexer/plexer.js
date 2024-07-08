import { parsePayloadArgs } from "../../lib";
import { needle } from "../needle/needle";

export async function main(ns) {
    const flags = ns.flags([
        ['payload', 'ping'],
        ['payload-args', ''],
        ['max-depth', 0],
        ['delay', 50],
        ['exclude', ['home']],
        ['host', 'home']
    ]);

    const payload_files = ns.ls(ns.getHostname(), flags['payload']);
    const main_file = 'aksu/jinx/payloads/' + flags['payload'] + '/' + flags['payload'] + '.js';
    const payload_args = flags['payload-args'];
    const max_dep = flags['max-depth'];
    const delay = flags['delay'];
    const exclude = flags['exclude'];
    const host = flags['host'];

    await plexer(ns, host, main_file, payload_files, payload_args, delay, max_dep, 0, ns.getHostname(), [], [], exclude)
}

export async function plexer(ns, host, main_file, payload_files, payload_args, delay, max_dep, dep, server_name, visited, execs, exclude) {
    visited.push(server_name);
    const unvisited = ns.scan(server_name).filter(n => !visited.includes(n));
    const args = parsePayloadArgs([payload_args]);
    args['target'] = server_name;

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