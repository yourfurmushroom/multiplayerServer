var uuid = require('uuid-random');
const WebSocket = require('ws')

const wss = new WebSocket.WebSocketServer({port:8080}, ()=> {
	console.log('server started')
})

var playerList=[];
var bulletList=[];
 
var playersData = {
	"type" : "playerData"
}

wss.on('connection', function connection(client){

	client.id = uuid();	

	console.log(`Client ${client.id} Connected!`)
	
	var currentClient = playersData[""+client.id]
	playerList.push(currentClient);

	client.send(`{"id": "${client.id}"}`)

	client.on('message', (data) => {
		var dataJSON = JSON.parse(data)
		console.log(playerList.length)
		console.log(playersData)
		playerList.forEach(player => {
			console.log("Player Message")
			//console.log(dataJSON)
			console.log(client.id)
		});
		
	})

	client.on('close', () => {
		console.log('This Connection Closed!')
		console.log("Removing Client: " + client.id)
		
	})

})

wss.on('listening', () => {
	console.log('listening on 8080')
})