// THREEx.KeyboardState.js keep the current state of the keyboard.
// It is possible to query it at any time. No need of an event.
// This is particularly convenient in loop driven case, like in
// 3D demos or games.
//
// # Usage
//
// **Step 1**: Create the object
//
// ```var keyboard	= new THREEx.KeyboardState();```
//
// **Step 2**: Query the keyboard state
//
// This will return true if shift and A are pressed, false otherwise
//
// ```keyboard.pressed("shift+A")```
//
// **Step 3**: Stop listening to the keyboard
//
// ```keyboard.destroy()```
//
// NOTE: this library may be nice as standaline. independant from three.js
// - rename it keyboardForGame
//
// # Code
//

/** @namespace */
var THREEx	= THREEx 		|| {};

/**
 * - NOTE: it would be quite easy to push event-driven too
 *   - microevent.js for events handling
 *   - in this._onkeyChange, generate a string from the DOM event
 *   - use this as event name
*/
THREEx.KeyboardState	= function()
{
	// to store the current state
	this.keyCodes	= {};
	this.modifiers	= {};

	// create callback to bind/unbind keyboard events
	var self	= this;
	this._onKeyDown	= function(event){ self._onKeyChange(event, true); };
	this._onKeyUp	= function(event){ self._onKeyChange(event, false);};

	// bind keyEvents
	document.addEventListener("keydown", this._onKeyDown, false);
	document.addEventListener("keyup", this._onKeyUp, false);
}

/**
 * To stop listening of the keyboard events
*/
THREEx.KeyboardState.prototype.destroy	= function()
{
	// unbind keyEvents
	document.removeEventListener("keydown", this._onKeyDown, false);
	document.removeEventListener("keyup", this._onKeyUp, false);
}

THREEx.KeyboardState.MODIFIERS	= ['shift', 'ctrl', 'alt', 'meta'];
THREEx.KeyboardState.ALIAS	= {
	'left'		: 37,
	'up'		: 38,
	'right'		: 39,
	'down'		: 40,
	'space'		: 32,
	'pageup'	: 33,
	'pagedown'	: 34,
	'tab'		: 9
};

/**
 * to process the keyboard dom event
*/
THREEx.KeyboardState.prototype._onKeyChange	= function(event, pressed)
{
	// log to debug
	//console.log("onKeyChange", event, pressed, event.keyCode, event.shiftKey, event.ctrlKey, event.altKey, event.metaKey)

	// update this.keyCodes
	var keyCode		= event.keyCode;
	this.keyCodes[keyCode]	= pressed;

	// update this.modifiers
	this.modifiers['shift']= event.shiftKey;
	this.modifiers['ctrl']	= event.ctrlKey;
	this.modifiers['alt']	= event.altKey;
	this.modifiers['meta']	= event.metaKey;
}

/**
 * query keyboard state to know if a key is pressed of not
 *
 * @param {String} keyDesc the description of the key. format : modifiers+key e.g shift+A
 * @returns {Boolean} true if the key is pressed, false otherwise
*/
THREEx.KeyboardState.prototype.pressed	= function(keyDesc)
{
	var keys	= keyDesc.split("+");
	for(var i = 0; i < keys.length; i++){
		var key		= keys[i];
		var pressed;
		if( THREEx.KeyboardState.MODIFIERS.indexOf( key ) !== -1 ){
			pressed	= this.modifiers[key];
		}else if( Object.keys(THREEx.KeyboardState.ALIAS).indexOf( key ) != -1 ){
			pressed	= this.keyCodes[ THREEx.KeyboardState.ALIAS[key] ];
		}else {
			pressed	= this.keyCodes[key.toUpperCase().charCodeAt(0)]
		}
		if( !pressed)	return false;
	};
	return true;
}


// THREEx.MouseState extension
//var THREEx = THREEx || {}; // TODO: uncomment it after placing in separated module file
THREEx.MouseState = function()
{
        // to store the current state
        this.buttonDowns = {};
        this.buttonDownCount = 0;
        this.modifiers = {};
        this.mouse_pos = {x:0, y:0};

        // create callback to bind/unbind mouse events
        var self = this;
        this._onMouseDown = function(event){ self._onMouseButonChange(event, true); };
        this._onMouseUp = function(event){ self._onMouseButonChange(event, false); };
        this._onDocumentMouseMove = function(event){ self._onMouseMove(event); };

        // bind mouseEvents
        document.addEventListener('mousedown', this._onMouseDown, false);
        document.addEventListener('mouseup', this._onMouseUp, false);
        document.addEventListener('mousemove', this._onDocumentMouseMove, false);
}

THREEx.MouseState.prototype.destroy     = function()
{
        // unbind mouseEvents
        document.removeEventListener('mousedown', this._onMouseDown, false);
        document.removeEventListener('mouseup', this._onMouseUp, false);
        document.removeEventListener('mousemove', this._onDocumentMouseMove, false);
}

THREEx.MouseState.MODIFIERS     = ['shift', 'ctrl', 'alt', 'meta'];
THREEx.MouseState.ALIAS = {
        'lmb'           : 0,
        'mmb'           : 1,
        'rmb'           : 2
};

THREEx.MouseState.prototype._onMouseButonChange = function(event, pressed)
{
        // log to debug
        //console.log("onMouseButonChange", event, pressed, event.button, event.shiftKey, event.ctrlKey, event.altKey, event.metaKey)

        // init this.buttonsDown for current button
        if (Object.keys(this.buttonDowns).indexOf(event.button) == -1)
        {
                this.buttonDowns[event.button] = 0;
        }

        // update this.buttonsDown
        if (pressed)
        {
                ++this.buttonDowns[event.button];
                ++this.buttonDownCount;
        }
        else
        {
                --this.buttonDowns[event.button];
                --this.buttonDownCount;
        }

        // update this.modifiers
        this.modifiers['shift'] = event.shiftKey;
        this.modifiers['ctrl'] = event.ctrlKey;
        this.modifiers['alt'] = event.altKey;
        this.modifiers['meta'] = event.metaKey;
}

THREEx.MouseState.prototype.pressed = function(buttonDesc)
{
        if (this.buttonDownCount == 0)
                return false;
        var buttons = buttonDesc.split("+");
        for(var i = 0; i < buttons.length; i++)
        {
                var button = buttons[i];
                var pressed;
                if (THREEx.MouseState.MODIFIERS.indexOf(button) !== -1)
                {
                        pressed = this.modifiers[button];
                }
                else if (Object.keys(THREEx.MouseState.ALIAS).indexOf(button) != -1)
                {
                        pressed = this.buttonDowns[THREEx.MouseState.ALIAS[button]] > 0;
                }
                else
                {
                        pressed = this.buttonDowns[button]
                }
                if (!pressed)
                        return false;
        };
        return true;
}

THREEx.MouseState.prototype.position = function()
{
	return this.mouse_pos;
}

THREEx.MouseState.prototype._onMouseMove = function(event) {
	this.mouse_pos.x = event.clientX;
	this.mouse_pos.y = event.clientY;
}