/**
 *	Copyright (c) 2005, 2006 Rafael Robayna
 *
 *	Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 *	The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 *	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 *
 *	CanvasWidgit is a base class that handles all mouse event listening for a canvas element, 
 *	implements a widgit event listener than you can use to trigger events remotely on widgit 
 *	state changes and encapsulates a few useful helper functions.
 *
 *  To create widgit using CanvasWidgit all you need to do is the following:
 *
 *	var YourWidgit = CanvasWidgit.extend({
		widgit_value_1: null,
 *		constructor: function(canvasName, position) {
 *			this.inherit(canvasName, position);
 *		},
 *		checkWidgitMouseEvent: function(e) {
 *			var mousePos = this.getCanvasMousePos(e);
 *			//interpret the mouse position 
 *			this.drawWidgit();
 *		},
 *		drawWidgit: function() { 
 *			//your canvas drawing code
 *		}
 *	});
 *
 *	//initialize an instance of your widgit
 *	var yourWidgit = new YourWidgit("canvas_name", {x: canvasPosX, y: canvasPosY});
 *
 *	//initialize an instance of your widgit
 *  yourWidgit.addWidgitListener(function () {
 *		//assign your widgit value to something else
 *		something = this.widgit_value_1;
 *	});
 *
 *
 **/
var CanvasWidgit = Base.extend({
	canvas: null,
	context: null,
	position: null,
	widgitListeners: null,

	/**
	 * constuctor
	 * 
	 * @param {String} canvasName - the id of the corresponding canvas html element
	 * @param {Array} position - the absolute position of the canvas html elemnt, {x:#,y:#}
	 */
	constructor: function(canvasElementID, position) {
		this.canvas = document.getElementById(canvasElementID);
		this.context = this.canvas.getContext('2d');
		this.drawWidgit();
		this.initMouseListeners();
		this.position = position;
		this.widgitListeners = new Array();
	},

	/**
	 * Initializes all the mouse listeners for the widgit.
	 */
	initMouseListeners: function() {
		this.mouseMoveTrigger = new Function();
		if (document.all) {
			this.canvas.attachEvent("onmousedown", this.mouseDownActionPerformed.bindAsEventListener(this));
			this.canvas.attachEvent("onmousemove", this.mouseMoveActionPerformed.bindAsEventListener(this));
			this.canvas.attachEvent("onmouseup", this.mouseUpActionPerformed.bindAsEventListener(this));
			this.canvas.attachEvent("onmouseout", this.mouseUpActionPerformed.bindAsEventListener(this));
		} else {
			this.canvas.addEventListener("mousedown", this.mouseDownActionPerformed.bindAsEventListener(this), false);
			this.canvas.addEventListener("mousemove", this.mouseMoveActionPerformed.bindAsEventListener(this), false);
			this.canvas.addEventListener("mouseup", this.mouseUpActionPerformed.bindAsEventListener(this), false);
			this.canvas.addEventListener("mouseout", this.mouseUpActionPerformed.bindAsEventListener(this), false);
		}
	},

	/**
	 * Triggered by any mousedown event on the widgit. This function calls 
	 * checkWidgitMouseEvent() and links the mousemove listener to checkWidgitEvent().
	 *
	 * Override this function if you want direct access to mousedown events.
	 *
	 * @param {Event} e
	*/
	mouseDownActionPerformed: function(e) {
		this.mouseMoveTrigger = function(e) {
			this.checkWidgitEvent(e);
		}
		this.checkWidgitEvent(e);
	},
	
	/**
	 * Triggered by any mousemove event on the widgit. 
	 *
	 * Override this function if you want direct access to mousemove events.
	 *
	 * @param {Event} e
	*/
	mouseMoveActionPerformed: function(e) {
		this.mouseMoveTrigger(e);
	},
	
	/**
	 * Triggered by any mouseup or mouseout event on the widgit. 
	 *
	 * Override this function if you want direct access to mouseup events.
	 *
	 * @param {Event} e
	*/
	mouseUpActionPerformed: function(e) {
		this.mouseMoveTrigger = new Function();
	},

	/**
	 * Called by the mousedown and mousemove event listeners by default.
	 *
	 * This function must be implemented by any class extending CPWidgit.
	 *
	 * @param {Event} e
	*/
	checkWidgitMouseEvent: function(e) {},
	
	/**
	 * Draws the widgit.
	 *
	 * This function must be implemented by any class extending CPWidgit.
	 *
	*/
	drawWidgit: function() {},

	/**
	 * Used to add event listeners directly to the widgit.  Listeners registered 
	 * with this function are triggered every time the widgit's state changes.
	 *
	 * @param {Function} eventListener
	*/
	addWidgitListener: function(eventListener) {
		this.widgitListeners[this.widgitListeners.length] = eventListener;
	},
	
	/**
	 * Executs all functions registered as widgitListeners.  Should be called every time 
	 * the widgit's state changes.
	*/
	callWidgitListeners: function() {
		if(this.widgitListeners.length != 0) {
			for(var i=0; i < this.widgitListeners.length; i++) 
				this.widgitListeners[i]();
		}
	},
	
	/**
	 * Helper function to get the mouse position relative to the canvas position.
	 *
	 * @param {Event} e
	*/
	getCanvasMousePos: function(e) {
		return {x: e.clientX - this.position.x, y: e.clientY - this.position.y};
	}

});

var CanvasHelper = {
	canvasExists: function(canvasName) {
		var canvas = document.getElementById(canvasName);
		return canvas.getContext('2d');
	}
}