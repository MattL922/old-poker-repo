var bubble = require("./bubble_event_emitter.js"),
    util   = require("util");

function TournamentDirector(parentBubble,
                            id,
                            title,
                            numRegistered,
                            playersLeft,
                            startTime,
                            prizes,
                            startingChips,
                            largestStack,
                            averageStack,
                            smallestStack,
                            blindStructure,
                            curLevel,
                            levelDuration,
                            nextBreak)
{
    bubble.call(this, parentBubble);
    
    this.id             = id;
    this.title          = title;
    this.numRegistered  = numRegistered;
    this.playersLeft    = playersLeft;
    this.startTime      = startTime;
    this.prizes         = prizes;
    this.startingChips  = startingChips;
    this.largestStack   = largestStack;
    this.averageStack   = averageStack;
    this.smallestStack  = smallestStack;
    this.blindStructure = blindStructure;
    this.curLevel       = curLevel;
    this.levelDuration  = levelDuration;
    this.nextBreak      = nextBreak;
}

util.inherits(TournamentDirector, bubble);

/* prototype functions */

module.exports = TournamentDirector;
