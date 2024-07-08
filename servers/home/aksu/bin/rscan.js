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