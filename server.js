var http = require("http");
var fs   = require("fs");

var HOST = "localhost";
var PORT = 1337;

var requestHandler = 
{
    "/":               {content:     fs.readFileSync("pages/home.html", {encoding: "utf8"}),
                        contentType: "text/html",
                        encoding:    "utf8"},
    "/css/styles.css": {content:     fs.readFileSync("css/styles.css", {encoding: "utf8"}),
                        contentType: "text/css",
                        encoding:    "utf8"},
    "/img/red_poker_chips_bg.png": {content:     fs.readFileSync("img/red_poker_chips_bg.png", {encoding: "binary"}),
                        contentType: "image/png",
                        encoding: "binary"}
};
var statusCode404 = {content:     fs.readFileSync("pages/404.html", {encoding: "utf8"}),
                     contentType: "text/html"};

http.createServer(function(req, res)
{
    var content = requestHandler[req.url] || false;
    if(content)
    {
        res.writeHead(200, content["contentType"]);
        res.write(content["content"], content["encoding"]);
    }
    else
    {
        res.writeHead(404, statusCode404["contentType"]);
        res.write(statusCode404["content"]);
    }
    res.end();
}).listen(PORT, HOST);

console.log("Server running at http://"+HOST+":"+PORT+"/");
