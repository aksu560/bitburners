export const config = {
    "0": {
      "skip": false,
      "type": "plexer",
      "host": "home",
      "payload": "kill",
      "args": {},
      "threads": 1,
      "delay": 0,
      'max-depth': -1,
      'exclude': []
    },
    "1": {
      "type": "toast",
      "message": "Killed all scripts on all servers"
    },
    "": {
      "type": "needle",
      "host": "home",
      "payload": "kill",
      "args": {"target": "home"},
      "threads": 1
    }
}