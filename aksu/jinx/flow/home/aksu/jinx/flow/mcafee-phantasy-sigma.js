// servers/home/aksu/jinx/flow/mcafee-phantasy-sigma.js
var config = {
  "0": {
    "skip": false,
    "type": "plexer",
    "host": "home",
    "payload": "battering-ram",
    "payload-args": {},
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
    "payload-args": { "target": "sigma-cosmetics" },
    "threads": "auto",
    "delay": 100,
    "exclude": ["home"],
    "max-depth": -1
  }
};
export {
  config
};
