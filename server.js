var express = require('express'),
    app = express(),
    http = require('http').createServer(app),
    io = require('socket.io').listen(http);

http.listen(3000);

//server connections and routing
app.use(express.static(__dirname + '/public'), function(request, response){
    if(request.url !== '/public') {
        response.sendFile( __dirname +'/error/index.html');
        console.log('Error 404 request, User tried accessing: ' + __dirname + request.url);
    }
});

var players = [];

//Lets create a function which will help us to create multiple players
function newPlayer() {
    this.name;
    this.id = 1;
    this.x = Math.random() * 500;
    this.y =  Math.random() * 500;
    //Random colors
    var r = Math.random()*255>>0;
    var g = Math.random()*255>>0;
    var b = Math.random()*255>>0;
    this.color = "rgba(" + r + ", " + g + ", " + b + ", 0.5)";

    //Random size
    this.radius = Math.random()*20+20;
    this.speed =  2;

    return {'name' : this.name,"x" : this.x,"y" : this.y,"color" : this.color, "radius" : this.radius,"speed" : this.speed}
}


//calls to the server and tracking connection of each new user
io.sockets.on('connection', function(socket){
    var currentPlayer = new newPlayer(); //new player made
    players.push(currentPlayer); //push player object into array

    //create the players Array
    socket.broadcast.emit('currentUsers', players);
    socket.emit('welcome', currentPlayer, players);

        //disconnected
    socket.on('disconnect', function(){
        players.splice(players.indexOf(currentPlayer), 1);
        console.log(players);
        socket.broadcast.emit('playerLeft', players);
    });

    socket.on('pressed', function(key){
        if(key === 38){
            currentPlayer.y -= currentPlayer.speed;
            socket.emit('PlayersMoving', players);
            socket.broadcast.emit('PlayersMoving', players);
        } 
        if(key === 40){
            currentPlayer.y += currentPlayer.speed;
            socket.emit('PlayersMoving', players);
            socket.broadcast.emit('PlayersMoving', players);
        } 
        if(key === 37){
            currentPlayer.x -= currentPlayer.speed;
            socket.emit('PlayersMoving', players);
            socket.broadcast.emit('PlayersMoving', players);
        } 
        if(key === 39){
            currentPlayer.x += currentPlayer.speed;
            socket.emit('PlayersMoving', players);
            socket.broadcast.emit('PlayersMoving', players);
        }
    });
});

console.log('NodeJS Server started on port 3000...');