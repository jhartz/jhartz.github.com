// Loader for decorations on jhartz.github.io

// The actual code for the snow and Christmas lights is from:
// http://www.schillmania.com/projects/snowstorm/

if (typeof String.prototype.trim != "function") {
    String.prototype.trim = function () {
        var str = this.replace(/^\s+/, "");
        for (var i = str.length - 1; i >= 0; i -= 1) {
            if (/\S/.test(str.charAt(i))) {
                str = str.substring(0, i + 1);
                break;
            }
        }
        return str;
    };
}

var decorations = {
    cookie: function (name, value, dontSendEvent) {
        name = "decorations_" + name;
        if (value) {
            if (!dontSendEvent && typeof ga == "function") {
                ga("send", "event", "decorations", name, value);
            }
            var max_age = (60*60*24*365) / 2; // 1/2 year (in seconds)
            var expires = (new Date()).getTime() + max_age * 1000; // 1/2 year later (in milliseconds)
            expires = new Date(expires);
            document.cookie = name + "=" + value + ";path=/;max-age=" + max_age + ";expires=" + (expires.toGMTString ? expires.toGMTString() : expires.toUTCString());
        } else {
            var cookies = document.cookie.split(";");
            for (var i = 0; i < cookies.length; i++) {
                if (cookies[i].substring(0, cookies[i].indexOf("=")).trim() == name) {
                    return cookies[i].substring(cookies[i].indexOf("=") + 1).trim();
                }
            }
        }
    },
    
    snow: function (isOnLoad) {
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
    },
    
    lights: {
        start: function () {
            decorations.cookie("lights", "yes");
            
            document.getElementById("decorations_lights_start").style.display = "none";
            
            try {
                if (typeof window.scrollTo == "function") window.scrollTo(0, 0);
            } catch (err) {}
            setTimeout(function () {
                location.reload();
            }, 10);
        },
        
        stop: function () {
            decorations.cookie("lights", "no");
            
            document.getElementById("decorations_lights_stop").style.display = "none";
            document.getElementById("decorations_lights_sizes").style.display = "none";
            
            try {
                if (typeof window.scrollTo == "function") window.scrollTo(0, 0);
            } catch (err) {}
            if (window.xlsf) {
                window.lightsBreakOverFunc = function () {
                    // TODO: We have the entire YAHOO.Anim library available - why not use it?
                    document.getElementById("lights").style.display = "none";
                };
                xlsf.destroyLights();
                document.getElementById("decorations_lights_start").style.display = "inline";
            } else {
                setTimeout(function () {
                    location.reload();
                }, 10);
            }
        },
        
        sizer: function (size) {
            decorations.cookie("lightsize", size);
            
            try {
                if (typeof window.scrollTo == "function") window.scrollTo(0, 0);
            } catch (err) {}
            setTimeout(function () {
                location.reload();
            }, 10);
        }
    }
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


if ((decorations_defaults.lights ? (decorations.cookie("lights") != "no") : (decorations.cookie("lights") == "yes"))) {
    document.getElementById("lights").style.display = "block";
    
    if (sizeTable.hasOwnProperty(decorations.cookie("lightsize"))) {
        window.lightsize = decorations.cookie("lightsize");
    } else {
        window.lightsize = "pico";
    }
    
    (function () {
        // TODO: We need bigger heights when responsibe design kicks in for smaller devices!
        var height;
        switch (window.lightsize) {
            case "pico":
                height = 32;
                break;
            case "tiny":
                height = 50;
                break;
            case "small":
                height = 64;
                break;
            case "medium":
                height = 72;
                break;
            case "large":
                height = 96;
                break;
        }
        document.getElementById("lights").style.height = height + "px";
    })();
    
    document.write(unescape('%3Cscript src="/decorations/lights/soundmanager2-nodebug-jsmin.js"%3E%3C/script%3E%3Cscript src="https://yui-s.yahooapis.com/combo?2.6.0/build/yahoo-dom-event/yahoo-dom-event.js&2.6.0/build/animation/animation-min.js"%3E%3C/script%3E%3Cscript src="/decorations/lights/christmaslights.js"%3E%3C/script%3E'));
    
    (function () {
        var mysizes = ["pico", "tiny", "small", "medium", "large"];
        if (mysizes.indexOf && mysizes.splice && mysizes.indexOf(window.lightsize) != -1) {
            mysizes.splice(mysizes.indexOf(window.lightsize), 1);
        }
        for (var i = 0; i < mysizes.length; i++) {
            mysizes[i] = '<span class="fakelink" onclick="decorations.lights.sizer(\'' + mysizes[i] + '\'); return false;">' + sizeTable[mysizes[i]] + '</span>';
        }
        document.getElementById("decorations_lights_sizes_list").innerHTML = mysizes.join(" | ");
        document.getElementById("decorations_lights_sizes").style.display = "inline";
    })();
    
    document.getElementById("decorations_lights_stop").style.display = "inline";
} else {
    document.getElementById("decorations_lights_start").style.display = "inline";
}