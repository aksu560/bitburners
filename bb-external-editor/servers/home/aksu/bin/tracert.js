import { findPath } from "../lib/rscan";

/** @param {NS} ns **/
export async function main(ns) {
	let startServer = ns.getHostname();
	let target = ns.args[0];
	if (target === undefined) {
		ns.alert('Please provide target server');
		return;
	}
	let [results, isFound] = findPath(ns, target, startServer, [], [], false);
	if (!isFound) {
		ns.alert('Server not found!');
	} else {
		ns.tprint('\n' + results.join('\n'));
	}
}