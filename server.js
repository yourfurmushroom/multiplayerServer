var uuid = require('uuid-random');
const WebSocket = require('ws')
const wss = new WebSocket.WebSocketServer({port:8080}, ()=> {
	console.log('server started')
})

var clientList={};
function SendMessage(client, obj){
	const json = JSON.stringify(obj);
	console.log(`SendMessage: ${json}`);
	client.send(json);
}
function InitClient(client){
	id = uuid();
	client.id = id;
	client.player = {
			"position":{
				"x":0,
				"y":0,
				"z":0
			},
			"rotation":{
				"x": 0,
				"y": 0,
				"z": 0,
				"w": 0
			}
		};
	clientList[id] = client;
}

function OnUpdatePlayerPosition(clientId, args){
	var client = clientList[clientId];
	client.player.position = args.position;
}
function OnUpdatePlayerRotation(clientId, args){
	var client = clientList[clientId];
	client.player.rotation = args.rotation;
}
wss.on('connection', function connection(client){

	InitClient(client);
	playerConnectedArgs = {
		"messageType": "PlayerConnected",
		"id": "" + client.id
	};
	SendMessage(client, playerConnectedArgs);
	client.on('message', (json) => {
		console.log(`client ${client.id} recive message: ${json}`);

		var args = JSON.parse(json);
		switch (json.messageType) {
			case "UpdatePlayerPosition":
				OnUpdatePlayerPosition(client.id, args)
				break;
			case "UpdatePlayerRotation":
				OnUpdatePlayerRotation(client.id, args)
				break;
			default:
				break;
		}

	})

	client.on('close', () => {
		console.log('This Connection Closed!')
		console.log("Removing Client: " + client.id)
	})

	console.log(`Client ${client.id} Connected!`)
})
wss.on('listening', () => {
	console.log('listening on 8080')
})