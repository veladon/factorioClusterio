var fs = require('fs');
var needle = require("needle")


// config
// name of executable
var headlessCommand = "factorio.exe"
var headlessFlags = [
	"--start-server-load-latest",
	"--rcon-port",
	"27015",
	"--rcon-password",
	"123",
	"--server-settings",
	"server-settings.json",
	"--no-auto-pause"
]
var headlessOptions = {
	// working directory
	cwd:"Factorio 0.13.9/bin/x64",
	shell:true
}

const spawn = require('child_process').spawn;
const factorio = spawn(headlessCommand, headlessFlags, headlessOptions);
factorio.stdin.setEncoding('utf-8');
factorio.stdout.pipe(process.stdout);
factorio.stdin.write("Node hook initialized!\n");
setInterval(function(){
	factorio.stdin.write('/c remote.call("clusterio", "import", "iron-plate", 10)\n')
}, 10000)
// connect us to the server with rcon
// IP, port, password
/*
var Rcon = require('simple-rcon');
var client = new Rcon({
  host: '81.167.2.56',
  port: '27015',
  password: '123',
  timeout: 0
}).connect();

client.on('authenticated', function() {
  console.log('Authenticated!');
}).on('connected', function() {
  console.log('Connected!');
}).on('disconnected', function() {
  console.log('Disconnected!');
  // now reconnect
  client.connect();
});
*/
// trigger when something happens to output.txt
fs.watch("Factorio 0.13.9/script-output/output.txt", "utf8", function(eventType, filename) {
	// get array of lines in file
	items = fs.readFileSync("Factorio 0.13.9/script-output/output.txt", "utf8").split("\n");
	// if you found anything, reset the file
	if(items[0]) {
		fs.writeFileSync("Factorio 0.13.9/script-output/output.txt", "")
	}
	for(i = 0;i < items.length; i++) {
		if(items[i]) {
			g = items[i].split(" ");
			g[0] = g[0].replace("\u0000", "");
			console.log(g);
			// send our entity and count to the master for him to keep track of
			needle.post('localhost:8080/place', {name:g[0], count:g[1]}, 
			function(err, resp, body){
				console.log(body);
			});
		}
	}
})

fs.watch("Factorio 0.13.9/script-output/orders.txt", "utf8", function(eventType, filename) {
	// get array of lines in file
	items = fs.readFileSync("Factorio 0.13.9/script-output/orders.txt", "utf8").split("\n");
	// if you found anything, reset the file
	if(items[0]) {
		fs.writeFileSync("Factorio 0.13.9/script-output/orders.txt", "")
		for(i = 0;i < items.length; i++) {
			if(items[i]) {
				g = items[i].split(" ");
				g[0] = g[0].replace("\u0000", "");
				console.log(g);
				// send our entity and count to the master for him to keep track of
				needle.post('localhost:8080/remove', {name:g[0], count:g[1]}, function(err, resp, body){
					console.log(body);
					//factorio.stdin.write("Node hook alive\n");
					//factorio.stdin.write('/c remote.call("clusterio", "import", "' + g[0] + '", ' + g[1] + ')\n');
					factorio.stdin.end('/c remote.call("clusterio", "import", "' + g[0] + '", ' + g[1] + ')\n')
					console.log('written!')
				});
			}
		}
	}
})