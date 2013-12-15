var configs = {
  port: 8082,
  socketSrv: "http://192.168.1.12",
  socketPort: 8082,
  arduino: {
    device: 'ttyACM'
  },
  initialLeds: [
    {"name": "led1", "pin": 7, "value": true},
    {"name": "led2", "pin": 6, "value": true},
    {"name": "led3", "pin": 5, "value": true},
    {"name": "led4", "pin": 4, "value": true}
  ],
  ledInt: {
    "toClient": "switch",
    "toServer": "update"
  }
};
if (module === undefined) { module = {}; }
module.exports = configs;
