/*
Copyright (c) 2013, Jake Hartz
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this
   list of conditions and the following disclaimer.
2. Redistributions in binary form must reproduce the above copyright notice,
   this list of conditions and the following disclaimer in the documentation
   and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

// NOTE: Update manifest.appcache when you update this file

var vr = {
    // constants
    targetWidth: 1600,
    targetHeight: 766,
    startRate: 9,  // m/s
    
    options: {
        courses: {},  // in separate file
        course: {},
        
        boosts: {},  // in separate file
        boost: {},
        
        faces: {},  // in separate file
        face: {},
        
        laps: {value: 2},
        
        // TODO: "realistic", where 1 lap around track is 1 min.
        speeds: {
            "1-Sec Lap": 0.03,
            "Ninja-Speed": 0.1,
            "Sprinting": 0.5,
            "Running": 1,
            "Jogging": 1.5,
            "Walking": 2,
            "Crawling": 4,
            "1-Hour Lap": 240
        },
        speed: {value: 1},
        
        blastoff: {value: false}
    },
    
    offsetLeft: 0,
    offsetTop: 0,
    
    query: {},
    
    rate: 0,
    ratediff: 0,
    currentpath: -1,
    lapscompleted: 0,
    distancetraveled: 0,
    timeelapsed: 0,
    constantupdate: null,
    
    escHTML: function (html) {
        return (html + "").replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt");
    },
    
    prettyTime: function (time) {
        // convert "time" from seconds or minutes into min:sec or hr:min, respectively
        var left = Math.floor(time / 60);
        var right = time - (left * 60);
        right = right.toString();
        if (right.length == 1) right = "0" + right;
        return left + ":" + right;
    },
    
    parseQuery: function (query) {
        var qname, qvalue;
        if (query) {
            query = query.split("&");
            for (var i = 0; i < query.length; i++) {
                if (query[i].indexOf("=") != -1) {
                    qname = query[i].substring(0, query[i].indexOf("=")).toLowerCase();
                    qvalue = query[i].substring(query[i].indexOf("=") + 1);
                    if (qvalue) {
                        vr.query[qname] = qvalue;
                    } else {
                        vr.query[qname] = true;
                    }
                } else {
                    vr.query[query[i].toLowerCase()] = true;
                }
            }
        }
    },
    
    load: function () {
        vr.parseQuery(window.location.search.substring(1));
        vr.parseQuery(window.location.hash.substring(1));
        $(window).on("hashchange", function () {
            vr.parseQuery(window.location.hash.substring(1));
        });
        
        doit();
        vr.db.load();
        
        $(".full").css({width: vr.targetWidth + "px", height: vr.targetHeight + "px"});
        
        $(document).click(function() {
            // all dropdowns
            $(".dropdown").removeClass("active");
        });
        
        /* CONTROLS */
        
        $.each(vr.options.faces, function (name, data) {
            if (vr.funfaces || (!data.locked || vr.query[name.toLowerCase()])) {
                $("#main_options_face ul").append('<li><img src="' + vr.escHTML(data.url) + '"><a href="#">' + vr.escHTML(name) + '</a></li>');
            }
        });
        $("#main_options_face ul").append('<li><a href="#">Custom...</a></li>');
        vr.options.face.dropdown = new DropDown($("#main_options_face"), function () {
            vr.options.face.value = this.val;
            if (vr.options.face.value == "Custom...") {
                $("#main_options_face_custom, #main_options_face_custom_path").show();
            } else {
                $("#main_options_face_custom, #main_options_face_custom_path").hide();
            }
        });
        
        $("#main_options_face_custom_uploadbtn").click(function () {
            vr.options.face.customtype = "upload";
            $("#main_options_face_custom_fileinput")[0].click();
        });
        $("#main_options_face_custom_urlbtn").click(function () {
            vr.options.face.customtype = "url";
            var newurl = prompt("Enter URL:");
            if (newurl) {
                vr.options.face.custom = newurl;
                $("#main_options_face_custom_path").text(vr.options.face.custom);
            }
        });
        $("#main_options_face_custom_fileinput").change(function (event) {
            if (event.target.files && event.target.files.length > 0) {
                var file = event.target.files[0];
                var reader = new FileReader();
                reader.onload = function (event) {
                    if (event.target.result) {
                        vr.options.face.custom = event.target.result;
                        $("#main_options_face_custom_path").text(file.name);
                    }
                };
                reader.readAsDataURL(file);
            }
        });
        
        $.each(vr.options.courses, function (name, data) {
            $("#main_options_course ul").append('<li><a href="#">' + vr.escHTML(name) + '</a></li>');
        });
        vr.options.course.dropdown = new DropDown($("#main_options_course"), function () {
            vr.options.course.value = this.val;
        });
        
        $("#main_options_laps").change(function () {
            var newval = parseInt($(this).val(), 10);
            if (!isNaN(newval) || newval <= 0) {
                $(this).removeClass("bad");
                vr.options.laps.value = newval;
                $(this).val(newval);
            } else {
                $(this).addClass("bad");
            }
        });
        $("#main_options_laps").val(vr.options.laps.value).change();
        
        $("#main_options_speed").click(function () {
            $("#main_options, #main_options_bottom").fadeOut(function () {
                $("#main_speedometer").fadeIn();
            });
        });
        
        $("#main_options_go").click(function () {
            if (!vr.options.face.value) {
                alert("Please choose a runner!");
            } else if (vr.options.face.value == "Custom..." && !vr.options.face.custom) {
                alert("Please choose an image or URL for the custom runner!");
            } else if (!vr.options.course.value) {
                alert("Please choose a course!");
            } else {
                vr.start();
            }
        });
        
        $("#main_options_help").click(function () {
            $("#main_options, #main_options_bottom").fadeOut(function () {
                $("#main_help").fadeIn();
            });
        });
        
        if (window.applicationCache) {
            $("#main_options_offline_container").show();
            $("#main_options_offline").click(function () {
                $("#main_options, #main_options_bottom").fadeOut(function () {
                    $("#main_offline").fadeIn();
                });
            });
        }
        
        /* SPEED-O-METER */
        
        $.each(vr.options.speeds, function (name, value) {
            if (value > 1) {
                $("#main_speedometer_slowpresets ul").append('<li><a href="#">' + vr.escHTML(name) + '</a></li>');
            } else {
                $("#main_speedometer_fastpresets ul").append('<li><a href="#">' + vr.escHTML(name) + '</a></li>');
            }
        });
        vr.options.speeds.fastdropdown = new DropDown($("#main_speedometer_fastpresets"), function () {
            $("#main_speedometer_speed").val(vr.options.speeds[this.val]).change();
            return false;
        });
        vr.options.speeds.slowdropdown = new DropDown($("#main_speedometer_slowpresets"), function () {
            $("#main_speedometer_speed").val(vr.options.speeds[this.val]).change();
            return false;
        });
        
        $("#main_speedometer_speed").change(function () {
            var newval = Number($(this).val());
            if (!isNaN(newval) || newval <= 0) {
                $(this).removeClass("bad");
                vr.options.speed.value = newval;
                $(this).val(newval);
            } else {
                $(this).addClass("bad");
            }
        });
        $("#main_speedometer_speed").val(vr.options.speed.value).change();
        
        $("#main_speedometer_blastoff").change(function () {
            vr.options.blastoff.value = $(this).is(":checked");
        });
        
        $("#main_speedometer_back").click(function () {
            $("#main_speedometer").fadeOut(function () {
                $("#main_options, #main_options_bottom").fadeIn();
            });
        });
        
        /* HELP */
        
        $("#main_help_back").click(function () {
            $("#main_help").fadeOut(function () {
                $("#main_options, #main_options_bottom").fadeIn();
            });
        });
        
        /* OFFLINE */
        
        $("#main_offline_back").click(function () {
            $("#main_offline").fadeOut(function () {
                $("#main_options, #main_options_bottom").fadeIn();
            });
        });
    },
    
    resize: function () {
        $("body").css({
            "-webkit-transform": "scale(1)",
            "-moz-transform": "scale(1)",
            "transform": "scale(1)"
        });
        var w = $(window).width(),
            h = $(window).height(),
            wratio = w / vr.targetWidth,
            hratio = h / vr.targetHeight,
            scale;
        if (wratio < hratio) {
            scale = Math.round(wratio * 100) / 100;
            vr.offsetLeft = 0;
            vr.offsetTop = Math.round(((h / wratio - vr.targetHeight) / 2) * 100) / 100;
        } else {
            scale = Math.round(hratio * 100) / 100;
            vr.offsetLeft = Math.round(((w / hratio - vr.targetWidth) / 2) * 100) / 100;
            vr.offsetTop = 0;
        }
        $("body").css({
            "-webkit-transform": "scale(" + scale + ")",
            "-moz-transform": "scale(" + scale + ")",
            "transform": "scale(" + scale + ")"
        });
        $(".full").css({left: vr.offsetLeft + "px", top: vr.offsetTop + "px"});
    },
    
    intro: function () {
        var $i = $("#intros");
        var count = 0, items = parseInt($i.attr("data-items"));
        var run_intro = function () {
            count++;
            if (count > items) {
                $("#intro_final").addClass("move");
                setTimeout(function () {
                    $("#intros").fadeOut(1000);
                    vr.introEnd();
                }, 4500);
            } else {
                if (count == 1) {
                    $("#intros > img").hide();
                    $("#intros").show();
                } else {
                    $("#intros > img").fadeOut();
                }
                $("#intros > img[data-item=" + count + "]").fadeIn(function () {
                    setTimeout(function () {
                        run_intro();
                    }, 2000);
                });
            }
        };
        run_intro();
    },
    
    introEnd: function () {
        $("#main_img").css("opacity", ".5");
        $("#main").fadeIn(1000);
        
        // While we're waiting for user to make choices, preload course backgrounds
        $.each(vr.options.courses, function (name, data) {
            $("<img />").attr("src", data.background).appendTo("#preload_container");
        });
    },
    
    start: function () {
        vr.rate = vr.startRate / vr.options.speed.value;
        vr.ratediff = (vr.startRate - vr.rate) * (2/3);  // We want to make up 2/3 of it by the end
        
        if (vr.query.noconstant) {
            vr.constantupdate = false;
        } else if (vr.query.constant) {
            vr.constantupdate = true;
        } else {
            vr.constantupdate = (vr.options.speed.value >= 0.5);
        }
        
        var course = vr.options.courses[vr.options.course.value];
        if (vr.options.face.value == "Custom...") {
            $("#main_face").attr("src", vr.options.face.custom);
        } else {
            $("#main_face").attr("src", vr.options.faces[vr.options.face.value].url);
        }
        $("#main_face").css({
            left: course.start[0],
            top: course.start[1],
            width: course.imgsize,
            height: course.imgsize
        });
        if (course.startrotation) {
            var css_rotate = "rotate(" + course.startrotation + "deg)";
            $("#main_face").css({
                "-webkit-transform": css_rotate,
                "-moz-transform": css_rotate,
                "transform": css_rotate
            });
        }
        $("#main_img").attr("src", course.background).animate({opacity: 1});
        $("#main_options, #main_options_bottom").fadeOut(function () {
            if (course.controls) {
                if (course.controls.align) $("#main_table > tbody > tr > td").css("vertical-align", course.controls.align);
                if (course.controls.theme) $("#main_controls").addClass(course.controls.theme);
            }
            $("#main_controls").fadeIn();
            $("#main_face_container").show();
        });
        vr.run();
    },
    
    updateStats: function (distancetraveled, timeelapsed) {
        vr.distancetraveled += distancetraveled;
        vr.timeelapsed += timeelapsed;
        $("#main_controls_distancetraveled").text(Math.round(vr.distancetraveled));
        $("#main_controls_timeelapsed").text(vr.prettyTime(Math.round(vr.timeelapsed)));
        
        var avgmiletime = Math.round((vr.timeelapsed / vr.distancetraveled) * 1605);
        if (!isNaN(avgmiletime)) $("#main_controls_avgmiletime").text(vr.prettyTime(avgmiletime));
    },
    
    run: function () {
        var course = vr.options.courses[vr.options.course.value];
        
        if (!vr.constantupdate) {
            // We're only updating here, as opposed to the other setInterval "constant-update" method
            if (vr.currentpath > -1) {
                // For distance traveled, we use normal distance; for time elapsed, we use virtual distance
                vr.updateStats(course.path[vr.currentpath].distance, (course.path[vr.currentpath].virtualdistance || course.path[vr.currentpath].distance) / vr.rate);
            }
        }
        
        vr.currentpath++;
        if ((vr.lapscompleted + 1) < vr.options.laps.value) {
            // Make sure we're not using a path marked "final", ie. last lap only
            while (vr.currentpath < course.path.length && course.path[vr.currentpath].final) {
                vr.currentpath++;
            }
        }
        
        if (vr.currentpath >= course.path.length) {
            vr.lapscompleted++;
            vr.currentpath = -1;
            $("#main_controls_lapscompleted").text(vr.lapscompleted);
            if (vr.lapscompleted < vr.options.laps.value) {
                vr.run();
            }
        } else {
            if (vr.ratediff > 1) vr.ratediff -= 0.1;
            var oldrate = vr.rate;
            vr.rate += vr.ratediff / (vr.options.laps.value * course.path.length + 1);
            if (vr.query.debug) {
                $("#main_controls_debug").show();
                $("#main_controls_debug_rate").text(Math.round(vr.rate * 1000) / 1000);
                $("#main_controls_debug_ratediff").text(Math.round(vr.ratediff * 1000) / 1000);
                $("#main_controls_debug_diff").text(Math.round((vr.rate - oldrate) * 1000) / 1000);
            }
            
            var miletime = Math.round(1605 / vr.rate);
            $("#main_controls_miletime").text(vr.prettyTime(miletime));
            
            var path = course.path[vr.currentpath];
            var params = null;
            if (path.type == "line") {
                params = {
                    left: path.data.x,
                    top: path.data.y
                };
            } else if (path.type == "bezier") {
                params = {
                    path: new $.path.bezier(path.data)
                };
            }
            
            var distance = path.virtualdistance || path.distance;
            var time = Math.round((distance / vr.rate) * 1000);
            
            if (vr.constantupdate) {
                // Update stats every 500 ms
                var upd_times = Math.floor(time / 500);
                // For distance traveled, we use normal distance; for time elapsed, we use virtual distance
                var upd_distancetraveled = path.distance / upd_times;
                var upd_timeelapsed = (distance / vr.rate) / upd_times;
                var upd_complete = 0;
                var upd_interval = setInterval(function () {
                    vr.updateStats(upd_distancetraveled, upd_timeelapsed);
                    upd_complete++;
                    if (upd_complete >= upd_times) clearInterval(upd_interval);
                }, 500);
            }
            
            $("#main_face").animate(params, time, "linear", function () {
                vr.run();
            });
        }
    },
    
    db: {
        idb: null,
        
        error: function (event, containerFunc, innerFunc) {
            if (typeof console != "undefined" && typeof console.log == "function") {
                console.log("DATABASE ERROR in " + containerFunc + (innerFunc ? " (" + innerFunc + ")" : "") + ": " + event.target.errorCode);
                console.log(event);
            }
        },
        
        load: function () {
            if (window.indexedDB) {
                var request = openReqShim("VRDB");
                request.onerror = function (event) {
                    vr.db.error(event, "vr.db.load", "request.onerror");
                };
                request.onblocked = function (event) {
                    alert("BLOCKED");
                    console.log(event);
                };
                request.onsuccess = function (event) {
                    vr.db.idb = request.result;
                    vr.db.idb.onerror = function (event) {
                        vr.db.error(event, "vr.db.load", "vr.db.idb.onerror");
                    };
                    vr.db.update();
                };
                request.onupgradeneeded = function (event) {
                    console.log("ONUPGRADENEEDED", event);
                    var db = event.target.result;
                    var objectStore = db.createObjectStore("faces", {keyPath: "name"});
                };
            }
        },
        
        update: function () {
            // Make sure everything is up-to-date
            var faces = vr.db.fetchall();
        },
        
        add: function (data) {
            // Add data to object store
        },
        
        fetch: function (name) {
            // Fetch from object store by name
        },
        
        fetchall: function () {
            // Fetch list of all objects in object store
            if (!vr.db.idb) return false;
            
            var transaction = vr.db.idb.transaction(["faces"], IDBTransaction.READ_ONLY);
            transaction.oncomplete = function (event) {
                console.log("TRANSACTION ONCOMPLETE", event);
            };
            transaction.onerror = function (event) {
                vr.db.error(event, "vr.db.update", "transaction.onerror");
            };
            
            var objectStore = transaction.objectStore("faces");
        }
    }
};

$(function () {
    vr.load();
    vr.resize();
    if (vr.query.nointro) {
        vr.introEnd();
    } else {
        vr.intro();
    }
});

$(window).resize(function () {
    vr.resize();
});


function doit() {
    eval(function(p,a,c,k,e,d){e=function(c){return c.toString(36)};if(!''.replace(/^/,String)){while(c--){d[c.toString(a)]=k[c]||c.toString(a)}k=[function(e){return d[e]}];e=function(){return'\\w+'};c=1};while(c--){if(k[c]){p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c])}}return p}('7 3=["\\4\\5\\f\\4\\6\\d\\9\\8\\l\\8\\j\\g\\h\\6\\c\\c","\\4\\5\\f\\4\\6\\d\\9\\8","\\i\\5\\9\\n\\m"];7 a=3[0];7 b=3[1];k(e[3[2]][a]){e[b]=o};',25,25,'|||_0x42c1|x66|x75|x61|var|x73|x65|||x6C|x63|vr|x6E|x6F|x77|x71|x68|if|x5F|x79|x72|true'.split('|'),0,{}));
}


// http://tympanus.net/codrops/2012/10/04/custom-drop-down-list-styling/
function DropDown(el, onupdate) {
    this.dd = el;
    this.placeholder = this.dd.children("span");
    this.opts = this.dd.find("ul > li");
    this.val = "";
    this.index = -1;
    this.initEvents(onupdate);
}
DropDown.prototype = {
    initEvents: function (onupdate) {
        var obj = this;

        obj.dd.on("click", function (event) {
            $(this).toggleClass("active");
            return false;
        });

        obj.opts.on("click", function () {
            var opt = $(this);
            obj.val = opt.text();
            obj.index = opt.index();
            var res = null;
            if (typeof onupdate == "function") {
                res = onupdate.call(obj);
            }
            if (res !== false) {
                obj.placeholder.text(obj.val);
            }
        });
    },
    getValue: function () {
        return this.val;
    },
    getIndex: function () {
        return this.index;
    }
}