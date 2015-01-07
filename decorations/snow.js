// Loader for snow decoration on jhartz.github.io

// The actual code for the snow and Christmas lights is from:
// http://www.schillmania.com/projects/snowstorm/

decorations.snow = function (isOnLoad) {
    if (snowStorm.active) {
        decorations.cookie("snow", "no", isOnLoad);
        
        document.getElementById("decorations_snow_toggle_start").style.display = "inline";
        document.getElementById("decorations_snow_toggle_stop").style.display = "none";
    } else {
        decorations.cookie("snow", "yes", isOnLoad);
        
        document.getElementById("decorations_snow_toggle_start").style.display = "none";
        document.getElementById("decorations_snow_toggle_stop").style.display = "inline";
    }
    snowStorm.toggleSnow();
};


snowStorm.snowColor = "#99ccff"; // blue-ish snow (since we have a whiteish background)
snowStorm.className = "noprint"; // hide the snow when printing
// NOTE: excludeMobile and autoStart need to be set to false in snowstorm.js (or snowstorm-min.js)!!!

// This is almost exactly like the very end of snowstorm.js
snowStorm.events.add(window, "load", function doStart() {
    snowStorm.events.remove(window, "load", doStart);
    
    var doSnow = false;
    if (decorations_defaults.snow) {
        if (decorations.cookie("snow")) {
            doSnow = decorations.cookie("snow") != "no";
        } else {
            // Same logic used in snowstorm.js
            doSnow = !(navigator.userAgent.match(/mobile|opera m(ob|in)/i));
        }
    } else {
        doSnow = decorations.cookie("snow") == "yes";
        if (!decorations.cookie("snow")) {
            // Show the "festive" message! (but only for the first 5 visits while the snow cookie is still unset)
            var numtimes = Number(decorations.cookie("festive"));
            if (isNaN(numtimes)) numtimes = 0;
            decorations.cookie("festive", ++numtimes, true);
            if (numtimes <= 5) {
                document.getElementById("decorations_snow_festive_mood").style.display = "block";
            }
        }
    }
    
    if (doSnow) {
        decorations.snow(true);
    } else {
        document.getElementById("decorations_snow_toggle_start").style.display = "inline";
    }
}, false);
