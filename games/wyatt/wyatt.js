/*
"Where's Wyatt"

Copyright (c) 2015 Jake Hartz.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/


///////////////////////////////////////////////////////////////////////////////

// http://stackoverflow.com/questions/27960722/sort-array-with-rgb-color-on-javascript

// http://code.tutsplus.com/tutorials/html5-canvas-optimization-a-practical-example--active-11893

/*
Make new static method of Person to create a person in a range (Person.createInRange),
where we pass in ranges for things like scale, hue, saturation, lightness, etc.
(And a ratio for the size attributes instead of defaulting to 20%).
This would then be called by createDynamicLevel
*/

///////////////////////////////////////////////////////////////////////////////

/** The factor by which the canvas width should be scaled. */
var canvasWidthScale = 4;

/** The factor by which the canvas height should be scaled. */
var canvasHeightScale = 4;

/**
 * Update the message in the status box.
 * @param {string} status - The message to show.
 * @param {boolean} [isHTML=false] - Whether the message is HTML or text.
 */
function status(status, isHTML) {
    document.getElementById("status")[isHTML ? "innerHTML" : "textContent"] = status;
    // Make sure it's visible
    document.getElementById("status").style.display = "block";
}

/** The timeout for hiding the message box */
var messageTimeout = null;

/**
 * Show a temporary message in the message box.
 * @param {string} msg - The message to show.
 * @param {boolean} [isHTML=false] - Whether the message is HTML or text.
 * @param {number} [time=3000] - The number of milliseconds to show message.
 */
function message(msg, isHTML, time) {
    document.getElementById("message")[isHTML ? "innerHTML" : "textContent"] = msg;
    
    document.getElementById("message-container").classList.remove("hidden");
    
    if (messageTimeout) {
        clearTimeout(messageTimeout);
    }
    messageTimeout = setTimeout(function () {
        document.getElementById("message-container").classList.add("hidden");
    }, time || 3000);
}


//(function () {

    // The current Level
    var currentLevel;

    // The canvas context
    var ctx;

    /** Shortcut for document.querySelector */
    function $() {
        return document.querySelector.apply(document, arguments);
    }

    /**
     * Get the dimensions that the canvas should be.
     */
    function getDimensions() {
        var html = $("html");
        return {
            width: html.clientWidth * canvasWidthScale,
            height: html.clientHeight * canvasHeightScale
        };
    }

    /**
     * Scale the canvas with regard to the body width/height.
     */
    function scale() {
        var dimensions = getDimensions(),
            bigboy = $("#bigboy");
        bigboy.setAttribute("width", dimensions.width);
        bigboy.setAttribute("height", dimensions.height);
        if (currentLevel) currentLevel.drawPersonPositions();
    }

    window.addEventListener("load", function (event) {
        if (typeof Path2D != "function" ||
                typeof (new Path2D()).addPath != "function") {
            alert("Advanced canvas features are unsupported.\n" +
                  "If you're using Chrome, go to about:flags and enable " + 
                  "\"experimental canvas features\".");
            return;
        }
        
        ctx = document.getElementById("bigboy").getContext("2d");
        window.addEventListener("resize", scale, false);
        scale();
        
        document.getElementById("bigboy").addEventListener("click", function (event) {
            var x = event.clientX * canvasWidthScale,
                y = event.clientY * canvasHeightScale;
            console.log("Click on canvas at " + x + "," + y);
            if (currentLevel) currentLevel.handleClick(x, y);
        }, false);
        
        // Test...
        
        //currentLevel = getStaticLevels(ctx)[0];
        
        var dimensions = getDimensions();
        currentLevel = getDynamicLevels(ctx, dimensions.width, dimensions.height)[0];
        
        currentLevel.onStatusChange = status;
        currentLevel.start();
    }, false);


//})();
