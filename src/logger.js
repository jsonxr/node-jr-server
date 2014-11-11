
// Default logger if none is passed in
function log(json, msg) {
  if (msg === undefined) {
    msg = json;
    json = undefined;
  }
  if (json) {
    console.log(msg + '\n  ' + JSON.stringify(json));
  } else {
    console.log(msg);
  }
}
var logger = {
  info: log,
  error: log
}

module.exports = logger;