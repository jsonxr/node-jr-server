'use strict';
// core
var cluster = require('cluster');
var http = require('http');
var os = require('os');
// 3rd party
var yargs = require('yargs');
// application
var checkPort = require('./checkport');
var logger = require('./logger');

function server(app, options) {
  options = options || {};
  options.port = options.port || 3000;
  var log = options.log || logger;
  options.maxCpus = options.maxCpus || 2;
  var master = options.master || null;

  // Use at most the number of CPUs in the system up to MAX_CPUS.
  // So if the system is single threaded, then it will only fork one process
  var cpuCount = os.cpus().length;
  cpuCount = Math.min(cpuCount, options.maxCpus);

  if (cluster.isMaster) {
    // This is not being run from a cluster.fork command...
    
    // Call master callback if there is one
    master && master();
    
    checkPort(options.port, function (err, used) {
      if (used) {
        log.error('Port is already in use');
        process.exit(1);
      } else {
        // Create a worker for each CPU
        for (var i = 0; i < cpuCount; i += 1) {
          cluster.fork();
        }

        // Code to run if we're in the master process
        cluster.on('exit', function (worker) {
          // Replace the dead worker
          log.info(worker, 'Worker died :(');
          cluster.fork();
        });
      }
    });

  // Code to run if we're in a worker process
  } else {
    // Bind to a port
    http.createServer(app).listen(options.port, function () {
      log.info('Listening on http://localhost:' + options.port);
    });
    
    // Let's log every error before we move on...
    process.on('uncaughtException', function(err) {
      // handle the error safely
      log.error({error: err}, 'server.uncaughtException');
    });

  }

}

module.exports = server;


