var jrServer = require('../src/jr-server');
var app = require('./app');

jrServer(app, {
  port: 3000,
  master: function () {
    console.log("this is master");
  }
});
