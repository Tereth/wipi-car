
var http = require('http').createServer(handler); //require http server, and create server with function handler()
var fs = require('fs'); //require filesystem module
var path = require('path');
var io = require('socket.io')(http)
var Gpio = require('onoff').Gpio;
var rev_gpio = new Gpio(17,'high');//red - fwd
var fwd_gpio = new Gpio(4,'high');
var left_gpio = new Gpio(27,'high');
var right_gpio = new Gpio(22,'high');

var rev_sim_gpio = new Gpio(15,'in', 'both');
var fwd_sim_gpio = new Gpio(14,'in', 'both');
var left_sim_gpio = new Gpio(18,'in', 'both');
var right_sim_gpio = new Gpio(23,'in', 'both');

console.log("Starting WiPi Car!!!")
http.listen(8080); //listen to port 8080

function toggle_input(name, gpio, val) {
    var inv_val = val ^ 1;
    if(inv_val != gpio.readSync()) {
        console.log(name + ": " + (inv_val == 0 ? "on" : "off"));
        gpio.writeSync(inv_val);
    }
}

function handler (request, response) { //create server

    var filePath = request.url;
    if (filePath == '/')
        filePath = './public/index.html';
    else
        filePath = "./public/" + request.url;

    //console.log(filePath);
    var extname = path.extname(filePath);
    var contentType = 'text/html';
    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.png':
            contentType = 'image/png';
            break;      
        case '.jpg':
            contentType = 'image/jpg';
            break;
        case '.wav':
            contentType = 'audio/wav';
            break;
    }

    fs.readFile(filePath, function(error, content) {
        if (error) {
            if(error.code == 'ENOENT'){
                fs.readFile('./404.html', function(error, content) {
                    response.writeHead(200, { 'Content-Type': contentType });
                    response.end(content, 'utf-8');
                });
            }
            else {
                response.writeHead(500);
                response.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
                response.end(); 
            }
        }
        else {
            response.writeHead(200, { 'Content-Type': contentType });
            response.end(content, 'utf-8');
        }
    });
}

function send_sim_gpio(socket, socket_str, err, value) {
    if(err) {
        console.error('Error:', err);
        return;
    }
    console.log('Emiting: ' + socket_str + ': ' + value);
    socket.emit(socket_str, value);
}

io.sockets.on('connection', function (socket) {
    console.log("Socket connected!");
    socket.on('fwd', function(data) {
        toggle_input("fwd", fwd_gpio, data);
        send_sim_gpio(socket, 'fwd_sim', '', data);
    });
    socket.on('rev', function(data) {
        toggle_input("rev", rev_gpio, data);
        send_sim_gpio(socket, 'rev_sim', '', data);
    });
    socket.on('left', function(data) {
        toggle_input("left", left_gpio, data);
        send_sim_gpio(socket, 'left_sim', '', data);
    });
    socket.on('right', function(data) {
        toggle_input("right", right_gpio, data);
        send_sim_gpio(socket, 'right_sim', '', data);
    });


    rev_sim_gpio.watch(function (err, value) { send_sim_gpio(socket, 'rev_sim', err, value); });
    fwd_sim_gpio.watch(function (err, value) { send_sim_gpio(socket, 'fwd_sim', err, value); });
    left_sim_gpio.watch(function (err, value) { send_sim_gpio(socket, 'left_sim', err, value); });
    right_sim_gpio.watch(function (err, value) { send_sim_gpio(socket, 'right_sim', err, value); });
});

function unexportOnClose() { //function to run when exiting program
  rev_sim_gpio.unexport(); // Unexport Button GPIO to free resources
  fwd_sim_gpio.unexport(); // Unexport Button GPIO to free resources
  left_sim_gpio.unexport(); // Unexport Button GPIO to free resources
  right_sim_gpio.unexport(); // Unexport Button GPIO to free resources
};

function closeGpio(gpio) {
    gpio.writeSync(1);
    gpio.setDirection('in');
    gpio.unexport();
}

process.on('SIGINT', function() {
    //Close driving GPIOs
    closeGpio(rev_gpio);
    closeGpio(fwd_gpio);
    closeGpio(left_gpio);
    closeGpio(right_gpio);
    //Close sim GPIOs
    closeGpio(rev_sim_gpio);
    closeGpio(fwd_sim_gpio);
    closeGpio(left_sim_gpio);
    closeGpio(right_sim_gpio);
    process.exit();
});

