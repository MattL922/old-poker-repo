var ee   = require("events").EventEmitter,
    util = require("util");

/**
 * Creates an instance of BubbleEventEmitter.
 * BubbleEventEmitter inherits from EventEmitter and allows for the bubbling of
 * events to parent Bubbleeventemitters.
 *
 * @author Matt Loppatto
 * @constructor
 * @this {BubbleEventemitter}
 */
function BubbleEventEmitter(parentBubble)
{
    ee.call(this);
    this.parentBubble = parentBubble;
}

util.inherits(BubbleEventEmitter, ee);

/**
 * Handles the event with the current object, then bubbles the event up for it
 * to be handled by each parent until the top level parent is reached.
 *
 * @param  {string}  name The name of the event to bubble.
 * @return {boolean} True if the event was handled by the current object,
 *                   false otherwise.
 */
BubbleEventEmitter.prototype.bubble = function(name)
{
    if(!this._events)
    {
        this.bubbleUp.apply(this, arguments);
        return false;
    }
    
    var handler = this._events[name];
    
    if(!handler)
    {
        this.bubbleUp.apply(this, arguments);
        return false;
    }
    
    var args = Array.prototype.slice.call(arguments, 1);
    
    if(typeof handler == "function")
    {
        handler.apply(this, args);
    }
    else if(util.isArray(handler))
    {
        var listeners = handler.slice();
        
        for(var i = 0, l = listeners.length; i < l; i++)
        {
            listeners[i].apply(this, args);
        }
    }
    else
    {
        this.bubbleUp.apply(this, arguments);
        return false;
    }
    
    this.bubbleUp.apply(this, arguments);
    
    return true;
};

/**
 * Pass the event to the parentBubble if it exists.
 *
 * @param {string} name The name of the event to bubble.
 */
BubbleEventEmitter.prototype.bubbleUp = function(name)
{
    if(this.parentBubble)
    {
        // Pass the event to the parentBubble
        this.parentBubble.bubble.apply(this.parentBubble, arguments);
    }
};

module.exports = BubbleEventEmitter;

