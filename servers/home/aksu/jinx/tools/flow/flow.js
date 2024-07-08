import { xsinx } from "../../lib";
import { crawler } from "../crawler/crawler";
import { needle } from "../needle/needle";
import { plexer } from "../plexer/plexer";
import { parseArguments } from "./arg-parse";
import { parseConfig } from "./config-parse";

export async function main(ns) {
    return flow(ns);
}

export async function flow(ns) {
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
        // Yeah, I know just how cursed this is, but give me a break, its fucking sick.
        phase = JSON.parse(parseArguments(JSON.stringify(phase), variables));

        const type = phase.type;

        if (type == "needle") {
            const payload = phase.payload;
            const args =JSON.stringify(phase.args);
            const host = phase.host;
            const payload_files = ns.ls(ns.getHostname(), "aksu/jinx/payloads/" + payload);
            const main_file = 'aksu/jinx/payloads/' + payload + '/' + payload + '.js';
            const delay = phase.delay;
            let threads = phase.threads;

            if (threads == "auto") {
                const remaining_ram = ns.getServerMaxRam(host) - ns.getServerUsedRam(host);
                threads = Math.floor(remaining_ram / ns.getScriptRam(main_file));
            }
            if (threads > 0) {
                last_exit = await needle(ns, host, main_file, payload_files, args, threads, delay);
            } else {
                last_exit = false
            }
        }

        if (type == "plexer") {
            const payload = phase.payload;
            const args =JSON.stringify(phase.args);
            const host = phase.host;
            const payload_files = ns.ls(ns.getHostname(), "aksu/jinx/payloads/" + payload);
            const main_file = 'aksu/jinx/payloads/' + payload + '/' + payload + '.js';
            const delay = phase.delay;
            const exclude = phase.exclude;

            last_exit = await plexer(ns, host, main_file, payload_files, args, delay, exclude)
        }

        if (type == "crawler") {
            const payload = phase.payload;
            const args =JSON.stringify(phase.args);
            const host = phase.host;
            const payload_files = ns.ls(ns.getHostname(), "aksu/jinx/payloads/" + payload);
            const main_file = 'aksu/jinx/payloads/' + payload + '/' + payload + '.js';
            const delay = phase.delay;
            let threads = phase.threads;
            const max_dep = phase.max_depth;
            const exclude = phase.exclude;

            last_exit = await crawler(ns, main_file, payload_files, args, threads, max_dep, 0, host, [], [], delay, exclude)
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

            last_exit = await flow(new_ns);
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

        if (type == "xsinx") {
            last_exit = xsinx(ns);
        }
    }

    return variables;
}