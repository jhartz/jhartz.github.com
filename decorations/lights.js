// Loader for Christmas lights decoration on jhartz.github.io

// The actual code for the snow and Christmas lights is from:
// http://www.schillmania.com/projects/snowstorm/

decorations.lights: {
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
};


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
