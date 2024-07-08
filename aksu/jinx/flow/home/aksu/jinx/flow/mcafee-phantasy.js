// servers/home/aksu/jinx/flow/mcafee-phantasy.js
var config = {
  "0": {
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
  "1": {
    "skip": false,
    "type": "crawler",
    "host": "home",
    "payload": "mcafee",
    "args": { "target": "phantasy" },
    "threads": "auto",
    "delay": 100,
    "exclude": [],
    "max-depth": -1
  }
};
export {
  config
};
