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

export function howManyPortsCanOpen(ns) {
    let port_count = 0;
    const programs = [
        'BruteSSH.exe',
        'FTPCrack.exe',
        'relaySMTP.exe',
        'HTTPWorm.exe',
        'SQLInject.exe'
    ]

    for (const program of programs) {
        const res = ns.ls('home', program).filter(n => ! n.includes("%"))
        if (res.length > 0) {
            port_count ++;
        }
    }
    return port_count;
}

export function xsinx(ns) {
    return bfs(ns).servers
  .filter(n => !ns.getPurchasedServers().includes(n))
  .filter(x => ns.getServerRequiredHackingLevel(x) < ns.getHackingLevel() * 0.5 && ns.getServerNumPortsRequired(x) <= howManyPortsCanOpen(ns))
  .map(x => [calculate_xsinx(ns, x), x])
  .reduce((a, b) => a[0] > b[0] ? a : b)
  [1]
}

export function calculate_xsinx(ns, host) {
    // Divide by 10000 to make it a little less insane of a number for display purposes.
    return Math.floor(ns.getServerMaxMoney(host) / ns.getServerMinSecurityLevel(host) / 10000) 
    
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

export function getExtendedServerData(ns) {
    const scan = bfs(ns, 'home');
    return scan.servers.map((server, index) => {
        return {
            name: server,
            used_ram: ns.getServerUsedRam(server),
            max_ram: ns.getServerMaxRam(server),
            base_security: ns.getServerBaseSecurityLevel(server),
            min_security: ns.getServerMinSecurityLevel(server),
            curr_money: ns.getServerMoneyAvailable(server),
            max_money: ns.getServerMaxMoney(server),
            xsinx: calculate_xsinx(ns, server),
            req_ports: ns.getServerNumPortsRequired(server),
            hack_level: ns.getServerRequiredHackingLevel(server),
            ps: ns.ps(server),
            threads: ns.ps(server).reduce((a, b) => a + b.threads, 0),
            connections: ns.scan(server),
            route: scan.routes[server].split(";connect "),
            parent: scan.parentByIndex[index]
        }
    });
}

export const ansi = {
    r: "\x1b[31m", // red
    g: "\x1b[32m", // green
    b: "\x1b[34m", // blue
    c: "\x1b[36m", // cyan
    m: "\x1b[35m", // Magenta
    y: "\x1b[33m", // Yellow
    k: "\x1b[30m", // key(black)
    w: "\x1b[37m", // white
    d: "\x1b[0m",  // default
    bl: "\x1b[2m", // bold
}

export function centerString(str, size) {
    if (str.len < size) {
        throw new Error("Tried to center a string in a space too small!");
    }
    const empty = size - str.length
    const frt = Math.floor(empty / 2);
    const aft = empty - frt;
    
    return " ".repeat(frt) + str + " ".repeat(aft);
}

export function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}