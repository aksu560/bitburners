export function main(ns) {
    const max_dep = ns.args[0];

    rscan_depth(ns, max_dep, 0, ns.getHostname(), []);
}

function rscan_depth(ns, max_dep, dep, server_name, visited) {
    visited.push(server_name);

    const unvisited = ns.scan(server_name).filter(n => !visited.includes(n));

    ns.tprint("-".repeat(dep, 0) + " " + server_name);

    if (unvisited.length == 0 || max_dep == dep) {
        return;
    }
    
    for (const server in unvisited) {
        rscan_depth(ns, max_dep, dep + 1, unvisited[server], visited);
    }
}
// Kinda fucked, dont use
function rscan_breadth(ns, max_dep) {
    let queue = [ns.getHostname()];

    let map = {};

    map[ns.getHostname()] = {
        dep: 0,
        parent: ""
    }

    while (queue.length > 0) {
        const current_host = queue.shift();

        if (map[current_host] == max_dep) {
            continue;
        }

        const scan_res = ns.scan(current_host);

        for (const i in scan_res) {
            const res = scan_res[i];

            if (!Object.keys(map).concat(queue).includes(res)) {
                queue.push(res);

                map[res] = {
                    dep: map[current_host].dep + 1,
                    parent: current_host
                }
            }
        }
    }
    ns.tprint(map);
}