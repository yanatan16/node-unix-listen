var fs = require('fs')
  , net = require('net')

module.exports = function connectToUnixSocket(app, path, options, callback) {
  if (!callback) callback = options, options = null;

  var server = app.listen(path)

  server.on('error', function (e) {
    if (e.code == 'EADDRINUSE') {
      // If we get addrinuse for a unix socket, we can try and connect to the socket
      // If we can connect, another service has taken our socket!
      // Otherwise, we can delete and re-listen
      var clientSocket = new net.Socket();
      clientSocket.on('error', function(e) { // handle error trying to talk to server
        if (e.code == 'ECONNREFUSED') {  // No other server listening
          fs.unlink(path, function (err) {
            if (err) {
              return callback(new Error('couldnt remove existing but unused socket descriptor: ' + err.toString()))
            }
            server.listen(path);
          });
        }
      });
      clientSocket.connect({path: path}, function() {
        return callback(new Error('another server is running at unix socket location ' + path))
      });
    } else {
      return callback(new Error('couldnt listen on socket for unknown reason: ' + e.toString()))
    }
  });

  server.on('listening', function () {
    if (options && options.mode) {
      fs.chmod(path, options.mode, function (err) {
        if (err) {
          return callback(new Error('couldnt change socket mode to ' + options.mode + ': ' + err.toString()))
        } else {
          return callback()
        }
      })
    }
  })

  return server;
}