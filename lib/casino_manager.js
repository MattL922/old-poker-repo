var bubble      = require("./bubble_event_emitter.js"),
    util        = require("util"),
    MongoClient = require("/usr/local/lib/node_modules/mongodb").MongoClient;

function CasinoManager()
{
    // parentBubble is null here since CasinoManager is the top of the chain
    bubble.call(this, null);
    this.tournaments = {};
}

util.inherits(CasinoManager, bubble);

CasinoManager.prototype.checkSchedule = function()
{
    var self = this;
    // Check the db for tournaments.  This should be done periodically using
    // setInterval().
    MongoClient.connect("mongodb://localhost:27017/freerollpoker", function(err, db)
    {
        if(err) throw err;
        db.collection("tournaments").find().toArray(function(err, docs)
        {
            if(err) throw err;
            for(var i = 0, l = docs.length; i < l; i++)
            {
                self.tournaments[docs[i]._id] = { title:         docs[i].title,
                                                  startTime:     docs[i].startTime,
                                                  numRegistered: 0 };
            }
            db.close();
        });
    });
};

module.exports = CasinoManager;
