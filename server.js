/********************************************************************************
 * Requires
 ********************************************************************************/
var express     = require("/usr/local/lib/node_modules/express"),
    http        = require("http"),
    mongodb     = require("/usr/local/lib/node_modules/mongodb").MongoClient,
    redisClient = require("/usr/local/lib/node_modules/redis").createClient(6379, "localhost"),
    redisStore  = require("/usr/local/lib/node_modules/connect-redis")(express),
    io          = require("/usr/local/lib/node_modules/socket.io"),
    fs          = require("fs"),
    CM          = require("./lib/casino_manager.js"),
    cutils      = require("/usr/local/lib/node_modules/express/node_modules/connect").utils;


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
app.use(express.cookieParser("super secret pw"));
app.use(express.session({
    key:    "freerollpoker_sid",
    secret: "super secret pw",
    store:  new redisStore(
            {
                host:   "localhost",
                port:   6379,
                client: redisClient
            })
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
                res.cookie("loggedInAs", username, {signed: true});
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
    if(req.session.id === req.signedCookies["freerollpoker_sid"])
    {
        res.render("lobby", {tournamentList: casinoManager.tournaments});
    }
    else
    {
        res.redirect("/");
    }
    //res.render("lobby", {tournamentList: casinoManager.tournaments});
});

// Get static content - js, css, img
app.use(express.static(__dirname + "/"));


/********************************************************************************
 * HTTP Server
 ********************************************************************************/
var server = http.createServer(app).listen(PORT, HOST);


////////////////////////////////////////////////////////////////////////////////
// Socket IO
////////////////////////////////////////////////////////////////////////////////
var serverIO = io.listen(server);

serverIO.configure(function()
{
    serverIO.set("authorization", function(handshakeData, callback)
    {
        console.log("socket io authorization running");
        console.log(decodeURIComponent(handshakeData.headers.cookie));
        callback(null, true);
    });
});

serverIO.sockets.on("connection", function(socket)
{
    // Have clients connect on the lobby page
    console.log("received socket connection");
});


console.log("Server running at http://"+HOST+":"+PORT+"/");

var casinoManager = new CM();
casinoManager.checkSchedule();
