// Loader for Christmas decorations on jhartz.github.com
// Most actual script for snow and lights from:
// http://www.schillmania.com/projects/snowstorm/

if (!window.snowStorm) var snowStorm = {};
snowStorm.snowColor = "#E0F0FF";

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
                if (cookies[i].substring(0, cookies[i].indexOf("=")) == name) {
                    return cookies[i].substring(cookies[i].indexOf("=") + 1);
                }
            }
        }
    },
    
    snow: {
        stop: function () {
            christmas.cookie("snow", "no");
            document.getElementById("christmas_snow_stop").style.display = "none";
            if (window.snowStorm) {
                snowStorm.stop();
                document.getElementById("christmas_snow_start").style.display = "inline";
            } else {
                location.reload();
            }
        },
        
        start: function () {
            christmas.cookie("snow", "yes");
            document.getElementById("christmas_snow_start").style.display = "none";
            location.reload();
        }
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

if (christmas.cookie("snow") != "no") {
    document.write(unescape('%3Cscript type="text/javascript" src="http://www.schillmania.com/projects/snowstorm/snowstorm-min.js"%3E%3C/script%3E'));
    document.getElementById("christmas_snow_stop").style.display = "inline";
} else {
    document.getElementById("christmas_snow_start").style.display = "inline";
}

if (christmas.cookie("lights") == "yes") {
    document.getElementById("lights").style.display = "block";
    
    var sizeTable = {pico: "tiny", tiny: "small", small: "medium", medium: "large", large: "huge"};
    if (christmas.cookie("lightsize") in sizeTable) {
        window.lightsize = christmas.cookie("lightsize");
    } else {
        window.lightsize = "tiny";
    }
    
    document.write(unescape('%3Cscript src="http://mp4downloader.mozdev.org/images/christmas/soundmanager2-nodebug-jsmin.js"%3E%3C/script%3E%3Cscript src="http://yui.yahooapis.com/combo?2.6.0/build/yahoo-dom-event/yahoo-dom-event.js&2.6.0/build/animation/animation-min.js"%3E%3C/script%3E%3Cscript src="http://mp4downloader.mozdev.org/images/christmas/christmaslights.js"%3E%3C/script%3E'));
    
    var mysizes = ["pico", "tiny", "small", "medium", "large"];
    if (mysizes.indexOf && mysizes.splice && mysizes.indexOf(window.lightsize) != -1) {
        mysizes.splice(mysizes.indexOf(window.lightsize), 1);
    }
    for (var i = 0; i < mysizes.length; i++) {
        mysizes[i] = '<span class="fakelink" onclick="christmas.lights.sizer(\'' + mysizes[i] + '\'); return false;">' + sizeTable[mysizes[i]] + '</span>';
    }
    document.getElementById("christmas_lights_sizes_list").innerHTML = mysizes.join(" | ");
    document.getElementById("christmas_lights_sizes").style.display = "inline";
    
    document.getElementById("christmas_lights_stop").style.display = "inline";
} else {
    document.getElementById("christmas_lights_start").style.display = "inline";
}