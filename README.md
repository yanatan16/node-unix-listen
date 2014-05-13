node-unix-listen
================

Simple but comprehensive unix socket listening for connect servers. Beefier than `app.listen(path)` because it handles errors such as a socket descripter lying around from a bad shutdown by trying to connect through that socket. It can also change the mode of the socket after setting it up successfully.


```javascript
var app = express()
  , unixListen = require('unix-listen')

var server = unixListen(app, '/tmp/my-socket.sock', { mode: 0777 }, function (err) {
  if (err) {
    console.error('Error while listening to unix socket: ' + err)
    process.exit()
  }
})
```

The options object is optional and `mode` is the only parameter allowed. It returns the `net.Server` instance of the app.

## License

MIT. See [LICENSE](/yanatan16/node-unix-listen/blob/master/LICENSE).

