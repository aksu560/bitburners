export const findPath = (ns, target, serverName, serverList, ignore, isFound) => {
	ignore.push(serverName);
	for (let server of ns.scan(serverName)) {
		if (ignore.includes(server)) {
			continue;
		}
		if (server === target) {
			serverList.push(server);
			return [serverList, true];
		}
		serverList.push(server);
		[serverList, isFound] = findPath(ns, target, server, serverList, ignore, isFound);
		if (isFound) {
			return [serverList, isFound];
		}
		serverList.pop();
	}
	return [serverList, false];
}