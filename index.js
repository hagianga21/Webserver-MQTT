var mosca = require('mosca');
var express = require("express");
var app = express();
var mqtt  = require('mqtt')

var settings = {
  port: 8080,
};
var server = new mosca.Server(settings);

// fired when a message is received
server.on('published', function(packet, client) {
  console.log('Published', packet.payload.toString('utf8'));
});

server.on('clientDisconnected', function(client){
  console.log(client.id + " disconnected ");
})

server.on('ready', setup);
// fired when the mqtt server is ready
function setup() {
    console.log('Broker is running');
    //server.authenticate = authenticate;
}

//CLIENT
//http://localhost:9000/smartplug/Hello?value=off
app.get('/smartplug/:deviceID', (req, res) => {
  var client = mqtt.connect({
    host: '127.0.0.1',
    port: 8080,
  })

  client.on('connect', function (){
    console.log(client.connected);
    if(client.connected){
      client.publish(req.params.deviceID, req.query.value)
      if(req.query.value) {
        console.log(req.query.value)
      }
      res.setHeader('Content-Type', 'application/json')
      res.send(JSON.stringify({status: 'OK'}));     
    } else {
      res.setHeader('Content-Type', 'application/json')
      res.send(JSON.stringify({status: 'FAILED'}));
    }
    client.end()
  })

});

app.listen(3000, () => console.log('API server is running'))