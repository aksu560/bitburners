// servers/home/aksu/jinx/flow/mcafee-harakiri.js
var config = {
  "0": {
    "type": "flow",
    "file": "kill-all"
  },
  "1": {
    "skip": false,
    "type": "plexer",
    "host": "home",
    "payload": "battering-ram",
    "args": {},
    "threads": 1,
    "delay": 100,
    "max-depth": -1,
    "exclude": ["home"]
  },
  "2": {
    "skip": false,
    "type": "crawler",
    "host": "home",
    "payload": "mcafee",
    "args": { "target": "harakiri-sushi" },
    "threads": "auto",
    "delay": 100,
    "exclude": ["home"],
    "max-depth": -1
  },
  "3": {
    "type": "toast",
    "message": "Finished starting up McAfee cluster"
  }
};
export {
  config
};
