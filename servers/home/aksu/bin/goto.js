import { bfs } from "../jinx/lib";
export function main(ns) {
    let route= bfs(ns, ns.getHostname()).routes[ns.args[0]];

    // Exploit to enter and run the command on the terminal, must be on the terminal tab to work
    // I don't care if this is illegal, its too handy.
    try {
        const terminalInput = eval('document').getElementById("terminal-input");
        terminalInput.value = route;
        const handler = Object.keys(terminalInput)[1];
        terminalInput[handler].onChange({ target: terminalInput });
        terminalInput[handler].onKeyDown({ key: 'Enter', preventDefault: () => null });
    }
    catch { }
    return 0;

}