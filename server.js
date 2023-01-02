/*
>npm install ws
WebSocket server example
The 'public' directory contains a p5.js sketch and HTML page that will connect to this server and put the sensor data in the HTML page.
created 11 Nov 2017
by Tom Igoe
*/
var WebSocketServer = require('ws').Server;   // webSocket library

// configure the webSocket server:
//hdf const wssPort = process.env.PORT || 8080;             // port number for the webSocket server
const wssPort = 9998;             // port number for the webSocket server
const wss = new WebSocketServer({port: wssPort}); // the webSocket server
var clients = new Array;         // list of client connections

function getUniqueID(){
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    var idConnexion=new Date();
    return idConnexion.getTime()+'-'+s4() +'-'+ s4() + '-' + s4();
};

// ------------------------ webSocket Server functions
function handleConnection(client, request) {
//	console.log("New Connection" , client);        // you have a new client
 idConnexion=getUniqueID();
 client.idConnexion=idConnexion;
	clients.push(client);    // add this client to the clients array
// console.log('clients=',clients);
	for(var c in clients){
//  console.log('c=',c,'clients[c]=',clients[c],'client=',client);
  if(clients[c].idConnexion===idConnexion){
   clients[c].send(JSON.stringify({'type':'etablissement de la connexion','idConnexion':clients[c].idConnexion}));
  }
 }
	 
 
 
 function endClient(code,data){
  try{
   var message0=JSON.parse(data);
   console.log('message0=',message0,message0.type);
   if(message0.hasOwnProperty('type') && message0.type==='finConnexion'){
    console.log('message0.message=',message0.message);
   }
  }catch(e){
  }
  var position = clients.indexOf(client);
  clients.splice(position, 1);
  console.log("connection closed "+JSON.stringify(code) );
 }



	// if a client sends a message, print it out:
	function traiterMessageClient(data){
//  console.log('brut=',data);
  console.log('parsé=',JSON.parse(data));
  var recu=JSON.parse(data);
		console.log('request.connection.remoteAddress='+request.connection.remoteAddress,'\n' + 'recu=' , recu);
  if(recu.type==='echo'){
		 envoyerMessageAuClient(JSON.stringify(recu),client);
  }else if(recu.type==='broadcast'){
   for(c in clients){
//    console.log('c=',c,'clients[c]=',clients[c],'client=',client);
    clients[c].send(
     JSON.stringify(
      {
       type:'broadcast',
       data:JSON.parse(data),
  //     client:client,
       c:c
      }
     )
    );
   }
   
  }
	}

	// set up client event listeners:
	client.on('message', traiterMessageClient);
	client.on('close', endClient);
}

function	envoyerMessageAuClient(data,client){
	for(c in clients){
  if(clients[c].idConnexion==client.idConnexion){
   var toto=JSON.stringify({'type':'echo',data:data});
 	 clients[c].send(toto);
  }
 }
}

// listen for clients and handle them:
wss.on('connection', handleConnection);