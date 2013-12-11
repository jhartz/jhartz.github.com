// Loader for Christmas decorations on jhartz.github.io
// Most actual script for snow and lights from:
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

var christmas = {
    cookie: function (name, value) {
        name = "christmas_" + name;
        if (value) {
            var max_age = (60*60*24*365) / 2; // 1/2 year (in seconds)
            var expires = (new Date()).getTime() + max_age * 1000; // 1/2 year (in milliseconds)
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
    
    snow: function () {
        if (snowStorm.active) {
            christmas.cookie("snow", "no");
            document.getElementById("christmas_snow_toggle").innerHTML = "Start Snowstorm";
        } else {
            christmas.cookie("snow", "yes");
            document.getElementById("christmas_snow_toggle").innerHTML = "Stop Snowstorm";
        }
        snowStorm.toggleSnow();
    },
    
    lights: {
        start: function () {
            christmas.cookie("lights", "yes");
            document.getElementById("christmas_lights_start").style.display = "none";
            try {
                if (typeof window.scrollTo == "function") window.scrollTo(0, 0);
            } catch (err) {}
            location.reload();
        },
        
        stop: function () {
            christmas.cookie("lights", "no");
            document.getElementById("christmas_lights_stop").style.display = "none";
            document.getElementById("christmas_lights_sizes").style.display = "none";
            if (window.xlsf) {
                try {
                    if (typeof window.scrollTo == "function") window.scrollTo(0, 0);
                } catch (err) {}
                window.lightsBreakOverFunc = function () {
                    // TODO: We have the entire YAHOO.Anim library available - why not use it?
                    document.getElementById("lights").style.display = "none";
                };
                xlsf.destroyLights();
                document.getElementById("christmas_lights_start").style.display = "inline";
            } else {
                location.reload();
            }
        },
        
        sizer: function (size) {
            christmas.cookie("lightsize", size);
            try {
                if (typeof window.scrollTo == "function") window.scrollTo(0, 0);
            } catch (err) {}
            location.reload();
        }
    }
};


snowStorm.excludeMobile = false; // since we do it ourselves
snowStorm.snowColor = "#99ccff"; // blue-ish snow (since we have a white background)

if (christmas.cookie("snow")) {
    snowStorm.autoStart = christmas.cookie("snow") != "no";
} else {
    // Same logic used in snowstorm.js
    snowStorm.autoStart = !(navigator.userAgent.match(/mobile|opera m(ob|in)/i));
}
if (!snowStorm.autoStart) document.getElementById("christmas_snow_toggle").innerHTML = "Start Snowstorm";


if (christmas.cookie("lights") == "yes") {
    document.getElementById("lights").style.display = "block";
    
    var sizeTable = {pico: "tiny", tiny: "small", small: "medium", medium: "large", large: "huge"};
    if (christmas.cookie("lightsize") in sizeTable) {
        window.lightsize = christmas.cookie("lightsize");
    } else {
        window.lightsize = "pico";
    }
    
    (function () {
        // TODO: integrate into lights.js (because we are just using the heights from that script anyway)
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
        document.getElementById("lights").style.height = (height - 10) + "px";
        if (document.querySelector && document.querySelector("body > table")) {
            var old = (document.querySelector("body > table").style.cssText || "").trim();
            if (old && old.substring(old.length - 1) != ";") old += ";";
            document.querySelector("body > table").style.cssText = old + "top: " + height + "px; height: -moz-calc(100% - " + height + "px); height: -webkit-calc(100% - " + height + "px); height: calc(100% - " + height + "px)";
        }
    })();
    
    document.write(unescape('%3Cscript src="/christmas/lights/soundmanager2-nodebug-jsmin.js"%3E%3C/script%3E%3Cscript src="http://yui.yahooapis.com/combo?2.6.0/build/yahoo-dom-event/yahoo-dom-event.js&2.6.0/build/animation/animation-min.js"%3E%3C/script%3E%3Cscript src="/christmas/lights/christmaslights.js"%3E%3C/script%3E'));
    
    (function () {
        var mysizes = ["pico", "tiny", "small", "medium", "large"];
        if (mysizes.indexOf && mysizes.splice && mysizes.indexOf(window.lightsize) != -1) {
            mysizes.splice(mysizes.indexOf(window.lightsize), 1);
        }
        for (var i = 0; i < mysizes.length; i++) {
            mysizes[i] = '<span class="fakelink" onclick="christmas.lights.sizer(\'' + mysizes[i] + '\'); return false;">' + sizeTable[mysizes[i]] + '</span>';
        }
        document.getElementById("christmas_lights_sizes_list").innerHTML = mysizes.join(" | ");
        document.getElementById("christmas_lights_sizes").style.display = "inline";
    })();
    
    document.getElementById("christmas_lights_stop").style.display = "inline";
} else {
    document.getElementById("christmas_lights_start").style.display = "inline";
}