// This is the jinx lib.js.

// When extending this file, keep in mind these functions shall lie here till eternity.
// I don't care if theyre broken, you are not removing it. You can add a print statement
// bitching about deprecation, but that function is staying there. If you refactor
// a function, make sure that no inputs or outputs change.

// Keep these things in mind when adding functions here. Your dogshit code is going to
// get deployed alongside EVERY. SINGLE. ONE of your exploits after you add it here.


// Now that being said, I will still put dogshit here :)
export function parsePayloadArgs(args) {
    return JSON.parse(args.join());
}

export function xsinx(ns) {
    const foreignServers = bfs(ns).servers
        .filter(n => !ns.getPurchasedServers().includes(n));
    
    let best_server = '';
    let best_score = -1;
    for (const server of foreignServers) {
        const score = calculate_xsinx(ns, server);

        if (ns.getServerRequiredHackingLevel(server) < ns.getHackingLevel() * 0.5
            && score > best_score) {
            
                best_score = score;
                best_server = server;
        }
    }
    return best_server;
}

export function calculate_xsinx(ns, host) {
    return ns.getServerMaxMoney(host) / ns.getServerMinSecurityLevel(host)
}

export function bfs(ns, start) {

    let servers = ["home"]
    let parentByIndex = [""]
    let routes = { home: "home" }

    for (let server of servers) {
        for (let oneScanResult of ns.scan(server).sort()) {
            if (!servers.includes(oneScanResult)) {
                servers.push(oneScanResult)
                parentByIndex.push(server)
                routes[oneScanResult] = routes[server] + ";connect " + oneScanResult
            }
        }
    }
    return {
        servers: servers,
        parentByIndex: parentByIndex,
        routes: routes
    };
}
