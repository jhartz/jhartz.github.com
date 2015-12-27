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


var DEFAULT_SIZE_ATTRIBUTES = {
    headRadius: 50,
    
    // Used if angleAttributes.mouthIsArc==true
    mouthArcRadius: 35,
    // Used if angleAttributes.mouthIsArc==false
    mouthLineOffsetTop: 25,
    mouthLineWidth: 40,
    
    eyeOffsetTop: 15,
    eyeOffsetLeft: 15,
    eyeRadius: 4,
    
    noseWidth: 5,
    noseHeight: 10,
    
    neckWidth: 15,
    neckHeight: 18,
    
    collarWidth: 40,
    collarHeight: 5,
    
    shirtWidth: 80,
    shirtHeight: 100,
    armWidth: 20,
    armHeight: 37,
    armOffsetTop: 15,
    
    pantsWidth: 80,
    pantsHeight: 100,
    crotchWidthTop: 10,
    crotchWidthBottom: 30,
    crotchOffsetTop: 20,
};

var DEFAULT_ANGLE_ATTRIBUTES = {
    eyeDirection: 0,
    leftArmDirection: Math.PI/21,
    rightArmDirection: -Math.PI/21,
    
    mouthArcSize: Math.PI*2/3,
    mouthLineDirection: -Math.PI/9
};

var DEFAULT_STYLE_ATTRIBUTES = {
    skinColor: "#f7f7f7",
    outlineColor: "#4f4f4f",
    
    eyeColor: "#0090ff",
    mouthColor: "#000000",
    mouthIsArc: false,
    
    shirtColor: "#0090ff",
    collarColor: "#0000ff",
    pantsColor: "#0000ff"
};

///////////////////////////////////////////////////////////////////////////////

/**
 * Hold information about a person.
 * @constructor
 * @param {object} [data={}] - Any data to store with the person.
 * @param {object} [sizeAttributes] - Values to use for the sizes of the body
 *        parts. If an attribute is not provided, the value in
 *        DEFAULT_SIZE_ATTRIBUTES is used.
 * @param {object} [angleAttributes] - Values to use for the angles of certain
 *        body parts. If an attribute is not provided, the value in
 *        DEFAULT_ANGLE_ATTRIBUTES is used.
 * @param {object} [styleAttributes] - Values to use for the styling of certain
 *        body parts. If an attribute is not provided, the value in
 *        DEFAULT_STYLE_ATTRIBUTES is used.
 * @param {number} [scale=1] - A coefficient for each default size measurement.
 */
function Person(data, sizeAttributes, angleAttributes, styleAttributes, scale) {
    this.data = data || {};
    this.sizeAttributes = sizeAttributes || {};
    this.angleAttributes = angleAttributes || {};
    this.styleAttributes = styleAttributes || {};
    this.scale = (!scale || scale < 0) ? 1 : scale;
    
    // Scaled sizes
    this.ss = {};
    
    // Fill in defaults and make getters for size attributes
    Object.keys(DEFAULT_SIZE_ATTRIBUTES).forEach(function (prop) {
        if (!this.sizeAttributes.hasOwnProperty(prop) ||
                typeof this.sizeAttributes[prop] != "number") {
            this.sizeAttributes[prop] = DEFAULT_SIZE_ATTRIBUTES[prop];
        }
        var that = this;
        Object.defineProperty(this.ss, prop, {
            get: function () {
                return that.sizeAttributes[prop] * that.scale;
            }
        });
    }, this);
    
    // Fill in defaults for angle attributes
    Object.keys(DEFAULT_ANGLE_ATTRIBUTES).forEach(function (prop) {
        if (!this.angleAttributes.hasOwnProperty(prop) ||
                typeof this.angleAttributes[prop] != "number") {
            this.angleAttributes[prop] = DEFAULT_ANGLE_ATTRIBUTES[prop];
        }
    }, this);
    
    // Fill in defaults for style attributes
    Object.keys(DEFAULT_STYLE_ATTRIBUTES).forEach(function (prop) {
        if (!this.styleAttributes.hasOwnProperty(prop) ||
                typeof this.styleAttributes[prop] == "undefined") {
            this.styleAttributes[prop] = DEFAULT_STYLE_ATTRIBUTES[prop];
        }
    }, this);
}


/**
 * Draw the person on a canvas context.
 *
 * @param {CanvasRenderingContext2D} ctx - The canvas context to draw into.
 * @param {number} [x=0] - The x-coordinate of the center of the person's head
 *        (i.e. the top tip of the nose).
 * @param {number} [y=0] - The y-coordinate of the center of the person's head
 *        (i.e. the top tip of the nose).
 * @param {number} [angle=0] - The angle to rotate the person around.
 *
 * @return {Path2D} A path containing the entire body drawn.
 */
Person.prototype.drawInContext = function (ctx, x, y, angle) {
    // Set up transforms
    var svgMatrix = document.createElementNS("http://www.w3.org/2000/svg", "svg")
        .createSVGMatrix()
        .translate(x || 0, y || 0)
        .rotate((angle || 0)*180/Math.PI); // silly SVGMatrix requires degrees
    
    ctx.translate(x || 0, y || 0);
    ctx.rotate(angle || 0);
    
    var currentTop = 0;
    var parentPath = new Path2D();
    var path = new Path2D();
    
    /**
     * Stroke and fill the current path into the context and parent path, and
     * then reset the path.
     * @param {string} [strokeStyle] - The stroke style. If not provided,
     *                 ctx.stroke() is not called.
     * @param {string} [fillStyle] - The fill style. If not provided,
     *                 ctx.fill() is not called.
     */
    function strokeAndFill(strokeStyle, fillStyle) {
        parentPath.addPath(path, svgMatrix);
        if (fillStyle) {
            ctx.fillStyle = fillStyle;
            ctx.fill(path);
        }
        if (strokeStyle) {
            ctx.strokeStyle = strokeStyle;
            ctx.stroke(path);
        }
        path = new Path2D();
    }
    
    // Head - Outer circle
    path.arc(0, 0, this.ss.headRadius, 0, Math.PI*2, true);
    strokeAndFill(this.styleAttributes.outlineColor,
                  this.styleAttributes.skinColor);
    
    // Head - Mouth
    if (this.styleAttributes.mouthIsArc) {
        var mouthArcDiff = (Math.PI - this.angleAttributes.mouthArcSize) / 2;
        path.moveTo(this.ss.mouthArcRadius * Math.cos(mouthArcDiff),
                    this.ss.mouthArcRadius * Math.sin(mouthArcDiff));
        path.arc(0, 0, this.ss.mouthArcRadius,
                 mouthArcDiff, Math.PI - mouthArcDiff, false);
    } else {
        path.moveTo(-this.ss.mouthLineWidth/2*Math.cos(this.angleAttributes.mouthLineDirection),
                    this.ss.mouthLineOffsetTop - this.ss.mouthLineWidth/2*Math.sin(this.angleAttributes.mouthLineDirection));
        path.lineTo(this.ss.mouthLineWidth/2*Math.cos(this.angleAttributes.mouthLineDirection),
                    this.ss.mouthLineOffsetTop + this.ss.mouthLineWidth/2*Math.sin(this.angleAttributes.mouthLineDirection));
    }
    strokeAndFill(this.styleAttributes.mouthColor);
    
    // Head - Eyes
    [-1, 1].forEach(function (coeff) {
        path.moveTo(this.ss.eyeOffsetTop*coeff, -this.ss.eyeOffsetLeft);
        path.arc(this.ss.eyeOffsetTop*coeff, -this.ss.eyeOffsetLeft,
                 this.ss.eyeRadius, this.angleAttributes.eyeDirection,
                 this.angleAttributes.eyeDirection + Math.PI*2, false);
    }, this);
    strokeAndFill(this.styleAttributes.outlineColor,
                  this.styleAttributes.eyeColor);
    
    // Head - Nose
    path.moveTo(0, 0);
    var noseDirection = Math.cos(this.angleAttributes.eyeDirection) < -0.01 ? -1 : 1;
    path.lineTo(this.ss.noseWidth * noseDirection, this.ss.noseHeight);
    path.lineTo(-1 * noseDirection, this.ss.noseHeight);
    strokeAndFill(this.styleAttributes.outlineColor);
    
    // Done with head
    currentTop += this.ss.headRadius;
    
    // Neck
    path.moveTo(-this.ss.neckWidth/2, currentTop);
    path.lineTo(-this.ss.neckWidth/2, currentTop + this.ss.neckHeight);
    path.lineTo(this.ss.neckWidth/2, currentTop + this.ss.neckHeight);
    path.lineTo(this.ss.neckWidth/2, currentTop);
    strokeAndFill(this.styleAttributes.outlineColor,
                  this.styleAttributes.skinColor);
    
    // Done with neck
    currentTop += this.ss.neckHeight;
    
    // Collar
    path.moveTo(-this.ss.collarWidth/2, currentTop + this.ss.collarHeight);
    path.lineTo(-this.ss.collarWidth/2, currentTop);
    path.lineTo(this.ss.collarWidth/2, currentTop);
    path.lineTo(this.ss.collarWidth/2, currentTop + this.ss.collarHeight);
    strokeAndFill(this.styleAttributes.outlineColor,
                  this.styleAttributes.collarColor);
    
    // Done with collar
    currentTop += this.ss.collarHeight;
    
    // Shoulders
    path.moveTo(-this.ss.shirtWidth/2, currentTop + this.ss.collarWidth/2);
    path.quadraticCurveTo(-this.ss.shirtWidth/2, currentTop,
                          -this.ss.collarWidth/2, currentTop);
    path.lineTo(this.ss.collarWidth/2, currentTop);
    path.quadraticCurveTo(this.ss.shirtWidth/2, currentTop,
                          this.ss.shirtWidth/2, currentTop + this.ss.collarWidth/2);
    // Rest of the shirt
    path.lineTo(this.ss.shirtWidth/2, currentTop + this.ss.shirtHeight);
    path.lineTo(-this.ss.shirtWidth/2, currentTop + this.ss.shirtHeight);
    path.lineTo(-this.ss.shirtWidth/2, currentTop + this.ss.collarWidth/2);
    strokeAndFill(this.styleAttributes.outlineColor,
                  this.styleAttributes.shirtColor);
    
    // Arms
    ["leftArmDirection", "rightArmDirection"].forEach(function (armDirectionAttribute, index) {
        var coeff = index * 2 - 1,
            angle = this.angleAttributes[armDirectionAttribute],
            x = (this.ss.shirtWidth/2)*coeff,
            y = currentTop + this.ss.armOffsetTop;
        
        var a = this.ss.armWidth/2,
            b = this.ss.armHeight;
        
        // Shoulder
        path.moveTo(x + a*Math.cos(angle), y+a*Math.sin(angle));
        path.arc(x, y, a, angle, angle + Math.PI, true);
        
        // Arm
        // to left side of shoulder
        path.moveTo(x - a * Math.cos(angle), y - a * Math.sin(angle));
        // to hand
        path.lineTo(x + (a+b) * Math.cos(angle + Math.PI/2),
                    y + (a+b) * Math.sin(angle + Math.PI/2));
        // to right side of shoulder
        path.lineTo(x + a * Math.cos(angle), y + a * Math.sin(angle));
        
        strokeAndFill(this.styleAttributes.outlineColor,
                      this.styleAttributes.skinColor);
        
        // Hand
        path.moveTo(x + (a+b) * Math.cos(angle + Math.PI/2),
                    y + (a+b) * Math.sin(angle + Math.PI/2));
        path.arc(x + b * Math.cos(angle + Math.PI/2),
                 y + b * Math.sin(angle + Math.PI/2),
                 a, angle + Math.PI/2, angle - Math.PI*3/2, true);
        
        strokeAndFill(this.styleAttributes.outlineColor,
                      this.styleAttributes.skinColor);
    }, this);
    
    // Done with shirt
    currentTop += this.ss.shirtHeight;
    
    // Pants
    path.moveTo(-this.ss.pantsWidth/2, currentTop);
    path.lineTo(-this.ss.pantsWidth/2, currentTop + this.ss.pantsHeight);
    path.lineTo(-this.ss.crotchWidthBottom/2, currentTop + this.ss.pantsHeight);
    path.lineTo(-this.ss.crotchWidthTop/2, currentTop + this.ss.crotchOffsetTop);
    path.lineTo(this.ss.crotchWidthTop/2, currentTop + this.ss.crotchOffsetTop);
    path.lineTo(this.ss.crotchWidthBottom/2, currentTop + this.ss.pantsHeight);
    path.lineTo(this.ss.pantsWidth/2, currentTop + this.ss.pantsHeight);
    path.lineTo(this.ss.pantsWidth/2, currentTop);
    strokeAndFill(this.styleAttributes.outlineColor,
                  this.styleAttributes.pantsColor);
    
    
    // All done; reset transforms on the canvas
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    
    return parentPath;
}

///////////////////////////////////////////////////////////////////////////////

/**
 * A Person in a position.
 * @constructor
 * @param {Person} p - The Person.
 * @param {number} [x=0] - The x-coordinate of the center of the person's head.
 * @param {number} [y=0] - The y-coordinate of the center of the person's head.
 * @param {number} [angle=0] - The angle to rotate the person around.
 * @param {number} [direction=0] - The direction in which the person is going.
 * @param {number} [delta=0] - The amount to move the person by each iteration.
 * @param {number} [insertAfter=0] - Actually move and render the person only
 *        after this many calls.
 */
function PersonPosition(p, x, y, angle, direction, delta, insertAfter) {
    this.p = p;
    this.x = x || 0;
    this.y = y || 0;
    this.angle = angle || 0;
    this.direction = direction || 0;
    this.delta = delta || 0;
    this.insertAfter = Math.floor(Math.min(insertAfter || 0, 0));
    
    this.flailing = false;
    this.currentPath = null;
}

/**
 * Static method to create a "hanging" PersonPosition.
 * @param {object} [data] - data for Person constructor.
 * @param {object} [sizeAttributes] - sizeAttributes for Person constructor.
 * @param {object} [styleAttributes] - styleAttributes for Person constructor.
 * @param {number} [scale] - scale for Person constructor.
 * @param {number} [x] - x-coordinate for PersonPosition constructor.
 * @param {number} [y] - y-coordinate for PersonPosition constructor.
 * @param {number} [angle=0] - angle for PersonPosition constructor (also used
 *        for determining angle attributes for Person).
 * @param {number} [direction] - direction for PersonPosition constructor.
 * @param {number} [delta=0] - delta for PersonPosition constructor.
 * @param {boolean} [flailing=false] - Whether this person should have flailing
 *        arms.
 * @return {PersonPosition} An initialized PersonPosition.
 */
PersonPosition.createHangingPersonPosition = function (data, sizeAttributes,
        styleAttributes, scale, x, y, angle, direction, delta, flailing) {
    if (!angle) angle = 0;
    var p = new Person(data, sizeAttributes, {
        eyeDirection: angle + Math.PI/2,
        leftArmDirection: angle || undefined,
        rightArmDirection: angle || undefined
    }, styleAttributes, scale);
    var pp = new PersonPosition(p, x, y, -angle, direction, delta);
    if (flailing) {
        pp.initFlail(Math.PI/3);
    }
    return pp;
};

/**
 * Initiate flailing.
 * @param {number} flailAngle - The angle that the person is allowed to flail.
 * @param {number} [flailDelta=flailAngle/4] - The amount by which to change
 *        the angle each iteration.
 */
PersonPosition.prototype.initFlail = function (flailAngle, flailDelta) {
    this.flailing = true;
    
    this.leftArmDirection = this.p.angleAttributes.leftArmDirection;
    this.rightArmDirection = this.p.angleAttributes.rightArmDirection;
    
    this.minFlailAngle = -flailAngle/2;
    this.maxFlailAngle = flailAngle/2;
    this.currentFlail = 0;
    this.currentFlailDelta = flailDelta || flailAngle/4;
    this.flail();
};

/**
 * Advance the flailing of the person.
 */
PersonPosition.prototype.flail = function () {
    if (this.flailing) {
        this.currentFlail += this.currentFlailDelta;
        if (this.currentFlail > this.maxFlailAngle) {
            this.currentFlail = this.maxFlailAngle;
            this.currentFlailDelta *= -1;
        } else if (this.currentFlail < this.minFlailAngle) {
            this.currentFlail = this.minFlailAngle;
            this.currentFlailDelta *= -1;
        }
        this.p.angleAttributes.leftArmDirection = this.leftArmDirection - this.currentFlail;
        this.p.angleAttributes.rightArmDirection = this.rightArmDirection + this.currentFlail;
    }
};

/**
 * Draw the person on a canvas context.
 * @param {CanvasRenderingContext2D} ctx - The canvas context to draw into.
 * @return {?Path2D} A path containing the entire body drawn, or null if no
 *         body was drawn.
 */
PersonPosition.prototype.drawInContext = function (ctx) {
    if (this.insertAfter) return (this.currentPath = null);
    return (this.currentPath = this.p.drawInContext(ctx, this.x, this.y, this.angle));
};

/**
 * Move the person's position relative to where it currently is.
 * @param {number} delta_x - The change in the x position.
 * @param {number} delta_y - The change in the y position.
 */
PersonPosition.prototype.moveTo = function (delta_x, delta_y) {
    this.x += delta_x;
    this.y += delta_y;
};

/**
 * Move the person in its specific direction.
 * @param {number} [distance=this.delta] - The amount to move the person.
 */
PersonPosition.prototype.move = function (distance) {
    if (typeof distance != "number") {
        distance = this.delta;
    }
    if (!this.insertAfter || !(--this.insertAfter)) {
        this.moveTo(distance * Math.cos(this.direction),
                    distance * Math.sin(this.direction));
    }
};

/**
 * Whether the person is currently covering a certain point.
 * @param {CanvasRenderingContext2D} ctx - The context in which the person was
 *        rendered.
 * @param {number} x - The x-coordinate of the point to check.
 * @param {number} y - The y-coordinate of the point to check.
 * @return {boolean} Whether the person is covering the point.
 */
PersonPosition.prototype.isPersonAtPoint = function (ctx, x, y) {
    if (!this.currentPath) return false;
    return ctx.isPointInPath(this.currentPath, x, y) ||
           ctx.isPointInStroke(this.currentPath, x, y);
};

///////////////////////////////////////////////////////////////////////////////

/**
 * A level with people inside.
 * @constructor
 * @param {Object} levelParameters - An object with parameters for this Level.
 *
 * @param {CanvasRenderingContext2D} levelParameters.ctx - The context in which
 *        to render the level.
 * @param {Array.<PersonPosition>} levelParameters.pps - The PersonPositions to
 *        render in this Level.
 * @param {Array.<number>} levelParameters.ppsPoints - The point value for each
 *        corresponding person in `pps`.
 * @param {Function} [levelParameters.onStatusChange] - A function called with
 *        new status messages.
 * @param {Function} [levelParameters.onPersonClick] - A function called with a
 *        Person's data and corresponding point value whenever a person is
 *        clicked on. Thisshould return `true` to keep the person on the canvas
 *        or `false` to stop drawing them.
 */
function Level(levelParameters) {
    this.ctx = levelParameters.ctx;
    this.pps = levelParameters.pps;
    this.ppsPoints = levelParameters.ppsPoints;
    
    // Shortcuts for `onStatusChange` and `onPersonClick`
    this._changeStatus = function (status) {
        if (typeof levelParameters.onStatusChange == "function") {
            levelParameters.onStatusChange(status);
        }
    };
    this._personClick = function (personData, points) {
        var retval = true;
        if (typeof levelParameters.onPersonClick == "function") {
            retval = levelParameters.onPersonClick(personData, points);
        }
        return retval;
    };
    
    // If timeout==0, then requestAnimationFrame is used instead of setTimeout
    this.timeout = 0;
    // This determines whether calls to advance() automatically spawn more
    // (controlled by start()/stop())
    this.running = false;
    
    // The background is used when the user clicks but not on anything
    this.backgroundColor = [200, 0, 0]; // [r, g, b]
    this.backgroundLevel = 0;
}

/**
 * Create a level with randomly selected values for the created people.
 *
 * @param {Object} levelParameters - An object with parameters for this Level
 *        (passed to the Level constructor). Must not include `pps` and
 *        `ppsPoints` (since these are generated dynamically).
 *
 * @param {CanvasRenderingContext2D} levelParameters.ctx - The context in which
 *        to render the level.
 * @param {Function} [levelParameters.onStatusChange] - A function called with
 *        new status messages.
 * @param {Function} [levelParameters.onPersonClick] - A function called with a
 *        Person's data and corresponding point value whenever a person is
 *        clicked on. Thisshould return `true` to keep the person on the canvas
 *        or `false` to stop drawing them.
 *
 * @param {Array} personData - An array of objects representing data about the
 *        people to create for this level. If an array item is falsy, no data
 *        is stored with the person created. This is what determines how many
 *        people are created.
 *
 * @param {Object} [ranges] - An object with different ranges for the creation
 *        of the Persons and PersonPositions. Each range can be represented
 *        as an array [min, max], or a function that is called with an object
 *        with all the values of the already-calculated ranges (i.e. the ones
 *        that were specified as an array instead of a function) and should
 *        return the value for that item.
 * @param {Array.<number>} [ranges.x] - The range for the x-coordinates of each
 *        PersonPosition.
 * @param {Array.<number>} [ranges.y] - The range for the y-coordinates of each
 *        PersonPosition.
 * @param {Array.<number>} [ranges.delta] - The range for the amount by which
 *        each PersonPosition should move each iteration.
 * @param {Array.<number>} [ranges.scale] - The range for the scale value of
 *        each Person.
 *
 * @param {Function} [calculateScore] - A function to calculate the score of a
 *        dynamically created person. The Person is passed in as the first
 *        argument. If not provided, then the score is based on the scale (size)
 *        of the dunamically created person.
 */
Level.createDynamicLevel = function (levelParameters, personData, ranges,
                                     calculateScore) {
    var RANGE_ITEMS = {
        x: {
            defaultMin: 50,
            defaultMax: 100
        },
        y: {
            defaultMin: 50,
            defaultMax: 100
        },
        delta: {
            defaultMin: 2,
            defaultMax: 10
        },
        scale: {
            defaultMin: 2,
            defaultMax: 6
        }
    };
    
    if (!ranges) ranges = {};
    
    if (typeof calculateScore != "function") {
        calculateScore = function (p) {
            return p.scale;
        };
    }
    
    var randomCreate = function (data) {
        // Get values for everything that we are given ranges for
        var values = {};
        
        // Start with all the ranges not specified as a function
        Object.keys(RANGE_ITEMS).forEach(function (item) {
            if (typeof ranges[item] != "function") {
                var min, max;
                if (ranges[item] && ranges[item].length && ranges[item].length >= 2) {
                    min = ranges[item][0];
                    max = ranges[item][1];
                } else {
                    // Use the defaults
                    min = RANGE_ITEMS[item].defaultMin;
                    max = RANGE_ITEMS[item].defaultMax;
                }
                // Set the random value
                values[item] = min + Math.floor(Math.random() * (max - min));
            }
        });
        
        // Next, fill in all the ranges that are a function of the others
        Object.keys(RANGE_ITEMS).forEach(function (item) {
            if (typeof ranges[item] == "function") {
                values[item] = ranges[item](values);
            }
        });
        
        // Filled in below
        var sizeAttributes = {},
            styleAttributes = {};
        
        // Filled in now
        var angle = Math.random() * Math.PI * 2,
            direction = Math.random() * Math.PI * 2,
            flailing = !!Math.floor(Math.random() * 2);
        
        // Randomly create sizeAttributes based on the defaults
        Object.keys(DEFAULT_SIZE_ATTRIBUTES).forEach(function (prop) {
            var proportion = (Math.random() * 2) - 1; // [-1, 1]
            // We want to increase or decrease it by an interval of 20%
            sizeAttributes[prop] = DEFAULT_SIZE_ATTRIBUTES[prop] +
                (DEFAULT_SIZE_ATTRIBUTES[prop] * 0.2 * proportion);
        });
        
        // Randomly create styleAttributes based on the defaults
        Object.keys(DEFAULT_STYLE_ATTRIBUTES).forEach(function (prop) {
            // Is this a boolean value?
            if (typeof DEFAULT_STYLE_ATTRIBUTES[prop] == "boolean") {
                styleAttributes[prop] = !!Math.floor(Math.random() * 2);
            } else if (DEFAULT_STYLE_ATTRIBUTES[prop][0] == "#") {
                // It's a color
                /*
                var origColor = DEFAULT_STYLE_ATTRIBUTES[prop].substring(1);
                var r = parseInt(origColor.substring(0, 2), 16),
                    g = parseInt(origColor.substring(2, 4), 16),
                    b = parseInt(origColor.substring(4, 6), 16);
                */
                // Just generate a random color
                styleAttributes[prop] = "#" + utils.hslToRgb(Math.random());
            }
        });
        
        return PersonPosition.createHangingPersonPosition(data, sizeAttributes,
            styleAttributes, values.scale, values.x, values.y, angle, direction,
            values.delta, flailing);
    };
    
    // Dynamically create Persons and PersonPositions
    var pps = [];
    // Unfortunately, this has to be an old-timey for loop to account for the
    // possibility that the array isn't actually initialized
    for (var i = 0; i < personData.length; i++) {
        pps.push(randomCreate(personData[i]));
    }
    
    // Create a score for each PersonPosition
    var ppsPoints = pps.map(calculateScore);
    
    // Create a Level
    levelParameters.pps = pps;
    levelParameters.ppsPoints = ppsPoints;
    return new Level(levelParameters);
}

/**
 * Clear the canvas and draw the background (if necessary).
 * @param {boolean} [backgroundDecrementDelta=0.2] The amount to decrement the
 *        background level (if it's greater then zero).
 */
Level.prototype.clear = function (backgroundDecrementDelta) {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    if (this.backgroundLevel) {
        if (!backgroundDecrementDelta) backgroundDecrementDelta = 0.5;
        
        this.ctx.fillStyle = "rgba(" + this.backgroundColor[0] + "," +
            this.backgroundColor[1] + "," + this.backgroundColor[2] + "," +
            this.backgroundLevel + ")";
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        
        this.backgroundLevel -= backgroundDecrementDelta;
        if (this.backgroundLevel < 0) this.backgroundLevel = 0;
    }
};

/**
 * Draw all the PersonPosition objects and figure out which people are where
 * (without actually moving them).
 */
Level.prototype.drawPersonPositions = function () {
    this.clear(0);
    this.pps.forEach(function (pp) {
        pp.drawInContext(this.ctx);
    }, this);
};

/**
 * Move all the PersonPosition objects in their directions and draw them. Also
 * figures out which are on-canvas and off-canvas.
 */
Level.prototype.moveAndDrawPersonPositions = function () {
    this.clear();
    this.pps.forEach(function (pp) {
        pp.flail();
        pp.move();
        // TODO: See if this one is off-canvas
        pp.drawInContext(this.ctx);
    }, this);
    // TODO: If all are off-canvas, call stop() and then this.onLeaveCanvas()
};

/**
 * Advance the game (if we are running).
 * @param {boolean} [dontContinue=false] Whether to not automatically
 *        continue advancing.
 */
Level.prototype.advance = function (dontContinue) {
    if (this.running) {
        this.moveAndDrawPersonPositions();
        if (!dontContinue) {
            var that = this;
            if (this.timeout && this.timeout > 0) {
                this.advanceTimeout = window.setTimeout(function () {
                    that.advance();
                }, this.timeout);
            } else {
                window.requestAnimationFrame(function () {
                    that.advance();
                });
            }
        }
    }
};

/**
 * Start running (advancing) the game.
 * @param {Function} [onLeaveCanvas] - An optional function to call when all
 *        the PersonPositions have left the canvas. Overrides any previous
 *        value, and is reset whenever stop() is called.
 */
Level.prototype.start = function (onLeaveCanvas) {
    // TODO: Make sure that there's at least one pp that's still on the canvas
    this.running = true;
    this.onLeaveCanvas = onLeaveCanvas;
    this.advance();
    this._changeStatus("Running");
};

/**
 * Stop running (advancing) the game.
 */
Level.prototype.stop = function () {
    this.running = false;
    this.onLeaveCanvas = null;
    if (this.advanceTimeout) clearTimeout(this.advanceTimeout);
    this._changeStatus("Stopped");
};

/**
 * Handle a click on the canvas on which this level has been drawn.
 * @param {number} x - The x-coordinate on the canvas.
 * @param {number} y - The y-coordinate on the canvas.
 */
Level.prototype.handleClick = function (x, y) {
    // See if we clicked on anything
    var ppClickedOn = null;
    // Start at end (i.e. top, in case anything is overlapping)
    for (var i = this.pps.length - 1; i >= 0; i--) {
        if (this.pps[i].isPersonAtPoint(this.ctx, x, y)) {
            ppClickedOn = this.pps[i];
            break;
        }
    }
    // Did we click on anything?
    if (ppClickedOn !== null) {
        // Get the corresponding point value
        var points = this.ppsPoints[i];
        //alert("Clicked on " + ppClickedOn.p.data.name);
        if (!this._personClick(ppClickedOn.p.data, points)) {
            // TODO: Remove them from the canvas
            alert("Removing " + JSON.stringify(ppClickedOn.p.data));
        }
    } else {
        // Flash background
        this.backgroundLevel = 1;
    }
};


