// servers/home/aksu/jinx/flow/var-test.js
var config = {
  "0": {
    "skip": false,
    "type": "set_var",
    "variables": [["foo", "bar"]]
  },
  "1": {
    "type": "toast",
    "message": "${foo}"
  }
};
export {
  config
};
