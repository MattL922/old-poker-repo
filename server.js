/********************************************************************************
 * Requires
 ********************************************************************************/
var express = require("/usr/local/lib/node_modules/express"),
    http    = require("http"),
    mongodb = require("/usr/local/lib/node_modules/mongodb").MongoClient,
    io      = require("/usr/local/lib/node_modules/socket.io"),
    fs      = require("fs"),
    CM      = require("./lib/casino_manager.js");


/********************************************************************************
 * Host info
 ********************************************************************************/
var HOST = "localhost",
    PORT = 1337;


/********************************************************************************
 * App
 ********************************************************************************/
var app = express();
app.set("views", __dirname + "/views");
app.set("view engine", "jade");

// Middleware

app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.cookieSession({
    key:    "freerollpoker",
    secret: "super secret pw"
}));

// Routes

app.get("/", function(req, res)
{
    res.sendfile("pages/home.html");
});

app.post("/login", function(req, res)
{
    mongodb.connect("mongodb://localhost:27017/freerollpoker", function(err, db)
    {
        if(err) throw err;
        var username = req.body.username,
            password = req.body.password;
        db.collection("users").findOne({username: username}, {fields: {pw: 1}}, function(err, doc)
        {
            if(err) throw err;
            if(doc.pw == password)
            {
                req.session.loggedInAs = username;
                res.redirect(303, "/lobby.html");
            }
            else
            {
                res.redirect(303, "/");
            }
            db.close();
        });
    });
});

app.get("/lobby.html", function(req, res)
{
    /*if(req.session.loggedInAs)
    {
        res.sendfile("pages/lobby.html");
    }
    else
    {
        res.redirect("/");
    }*/
    res.render("lobby", {tournamentList: casinoManager.tournaments});
});

// Get static content - js, css, img
app.use(express.static(__dirname + "/"));


/********************************************************************************
 * HTTP Server
 ********************************************************************************/
var server = http.createServer(app).listen(PORT, HOST);


/********************************************************************************
 * Socket IO
 ********************************************************************************/
var serverIO = io.listen(server);

serverIO.sockets.on("connection", function(socket)
{
    // Have clients connect on the lobby page
});


console.log("Server running at http://"+HOST+":"+PORT+"/");

var casinoManager = new CM();
casinoManager.checkSchedule();
