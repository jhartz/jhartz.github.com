/*
    Copyright (c) 2013, Jake Hartz. All rights reserved.
    Use of this source code is governed by a BSD-style license
    that can be found in the LICENSE.txt file.
*/

// NOTE: Update manifest.appcache when you update this file

var vr = {
    // constants
    targetWidth: 1600,
    targetHeight: 766,
    startRate: 9,  // m/s
    boostTimeNeeded: 4,  // the minimum amount of seconds that a boost should last
    boostMaxStrength: 10,  // the maximum strength that a boost should be allowed to be (affects how much of any boost the user can use)
    boostScaler: 1.8,  // how strong boosts should be applied
    
    options: {
        courses: {},  // in separate file
        course: {},
        
        boosts: {},  // in separate file
        boost: {},
        
        faces: [],  // in separate file
        face: {},
        
        laps: 2,
        
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
    
    preload: function (url) {
        $("<img />").attr("src", url).appendTo("#preload_container");
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
        
        $(".full").css({width: vr.targetWidth + "px", height: vr.targetHeight + "px"});
        
        $(document).click(function() {
            // all dropdowns
            $(".dropdown").removeClass("active");
        });
        
        /* CONTROLS */
        
        $.each(vr.options.faces, function (index, data) {
            if (data.name && data.url) {
                if (!data.locked || vr.query[data.name.toLowerCase()] || vr.funfaces) {
                    $("#main_options_face ul").append('<li data-type="preset" data-value="' + index + '"><img src="' + vr.escHTML(data.endurl || data.url) + '"><a href="#">' + vr.escHTML(data.name) + '</a></li>');
                    // If we have an endurl above, then we need to preload normal url
                    if (data.endurl) vr.preload(data.url);
                }
            }
        });
        vr.options.face.dropdown = new DropDown($("#main_options_face"), function () {
            if (this.type == "preset") {
                vr.options.face.type = "preset";
                vr.options.face.data = vr.options.faces[this.value];
            } else if (this.type == "db") {
                vr.options.face.type = "db";
                vr.db.fetch(JSON.parse(this.value).key, function (data) {
                    vr.options.face.data = data;
                });
            } else if (this.type == "custom") {
                $("#main_options, #main_options_bottom").fadeOut(function () {
                    $("#main_customface").fadeIn();
                });
                return false;
            }
        });
        if (window.indexedDB && typeof JSON != "undefined" && typeof FileReader != "undefined") {
            vr.db.ready = function () {
                $("#main_options_face ul").append('<li data-type="custom"><a href="#">Custom...</a></li>');
                $("#main_options_manage_container").show();
            };
            vr.db.update = function () {
                // Make sure everything is up-to-date
                $("#main_options_face li[data-type=db]").remove();
                $("#main_manage_facelist").empty();
                var completed = 0;
                vr.db.fetchall(function (key, data) {
                    completed++;
                    
                    $("#main_options_face li[data-type=custom]").before('<li data-type="db" data-value="' + vr.escHTML(JSON.stringify({key: key})) + '"><img src="' + vr.escHTML(data.endurl || data.url) + '"><a href="#">' + vr.escHTML(data.name) + '</a></li>');
                    
                    var randid = "CheckBox_MANAGE_" + Math.random().toString(36).substring(2);
                    $("#main_manage_facelist").append('<div><input id="' + vr.escHTML(randid) + '" type="checkbox" data-value="' + vr.escHTML(JSON.stringify({key: key})) + '" value="yes" title="' + vr.escHTML(data.name) + '"></div>');
                    $(document.getElementById(randid)).checkbox();
                }, function () {
                    if (completed == 0) {
                        $("#main_manage_facelist").text("No custom runners");
                    }
                });
            };
            vr.db.load();
        }
        
        $.each(vr.options.courses, function (name, data) {
            $("#main_options_course ul").append('<li><a href="#">' + vr.escHTML(name) + '</a></li>');
        });
        vr.options.course.dropdown = new DropDown($("#main_options_course"), function () {
            vr.options.course.value = this.text;
        });
        
        $("#main_options_laps").change(function () {
            var newval = parseInt($(this).val(), 10);
            if (isNaN(newval) || newval <= 0) {
                $(this).addClass("bad");
            } else {
                $(this).removeClass("bad");
                vr.options.laps = newval;
                $(this).val(newval);
            }
        });
        $("#main_options_laps").val(vr.options.laps).change();
        
        $("#main_options_go").click(function () {
            if (!vr.options.face.data) {
                alert("Please choose a runner.");
            } else if (!vr.options.course.value) {
                alert("Please choose a course.");
            } else {
                $("#main_options_laps").change();
                if ($("#main_options_laps").hasClass("bad")) {
                    alert("Please enter a valid number of laps.");
                    $("#main_options_laps")[0].focus();
                } else {
                    vr.start();
                }
            }
        });
        
        if (window.applicationCache) {
            $("#main_options_offline_container").show();
        }
        
        $.each(["speedometer", "help", "manage", "offline", "source"], function (i, dialog) {
            $("#main_options_" + dialog).click(function () {
                $("#main_options, #main_options_bottom").fadeOut(function () {
                    $("#main_" + dialog).fadeIn();
                });
            });
            
            $("#main_" + dialog + "_back").click(function () {
                $("#main_" + dialog).fadeOut(function () {
                    $("#main_options, #main_options_bottom").fadeIn();
                });
            });
        });
        
        /* CUSTOM FACE */
        
        $("#main_customface_uploadbtn").click(function () {
            $("#main_customface_fileinput")[0].click();
        });
        
        $("#main_customface_fileinput").change(function (event) {
            if (event.target.files && event.target.files.length > 0) {
                var file = event.target.files[0];
                var ext = file.name.substring(file.name.lastIndexOf(".") + 1).toLowerCase();
                if (ext != "vrff") {
                    alert("Invalid file!\nPlease select a *.vrff file.");
                } else {
                    var reader = new FileReader();
                    reader.onload = function () {
                        if (reader.result) {
                            var result;
                            try {
                                result = JSON.parse(reader.result);
                            } catch (err) {}
                            if (result && (typeof Array.isArray != "function" || Array.isArray(result))) {
                                var good_result = [];
                                $.each(result, function (index, data) {
                                    if (data.name && data.url) {
                                        good_result.push(data);
                                    }
                                });
                                if (good_result.length) {
                                    var completed = 0;
                                    $.each(good_result, function (index, data) {
                                        vr.db.add(data, function () {
                                            completed++;
                                            if (completed >= good_result.length) {
                                                vr.db.update();
                                            }
                                        });
                                    });
                                    $("#main_customface_back").click();
                                } else {
                                    alert("Error reading file!\nDetails: No valid entries.");
                                }
                            } else {
                                alert("Error reading file!\nDetails: Could not parse JSON.");
                            }
                        } else {
                            alert("Error reading file!\nDetails: File is empty or unreadable.");
                        }
                    };
                    reader.onerror = function () {
                        alert("Error reading file!\nDetails: " + reader.error);
                    };
                    reader.readAsText(file);
                }
            }
        });
        
        $("#main_customface_custombtn").click(function () {
            $("#main_customface_custom1_name").val("");
            $("#main_customface_custom2_filename").text("");
            vr.options.boost.dropdown.clear();
            vr.options.face.customtemp = {};
            $("#main_customface_custombtn_container").slideUp();
            $("#main_customface_custom1").slideDown();
        });
        
        $("#main_customface_custom1_next").click(function () {
            var newval = $("#main_customface_custom1_name").val();
            if (typeof newval.trim == "function") newval = newval.trim();
            if (!newval) {
                alert("Please enter a name.");
                $("#main_customface_custom1_name")[0].focus();
            } else {
                vr.options.face.customtemp.name = newval;
                $("#main_customface_custom1").slideUp();
                $("#main_customface_custom2").slideDown();
            }
        });
        
        $("#main_customface_custom2_browse").click(function () {
            $("#main_customface_custom2_fileinput")[0].click();
        });
        
        $("#main_customface_custom2_fileinput").change(function (event) {
            if (event.target.files && event.target.files.length > 0) {
                var file = event.target.files[0];
                var ext = file.name.substring(file.name.lastIndexOf(".") + 1).toLowerCase();
                if (!(ext == "png" || ext == "jpg" || ext == "jpeg" || ext == "gif" || ext == "svg" || ext == "bmp")) {
                    alert("Invalid file!\nPlease select an image.");
                } else {
                    var reader = new FileReader();
                    reader.onload = function () {
                        if (reader.result) {
                            $("#main_customface_custom2_filename").text(file.name);
                            vr.options.face.customtemp.url = reader.result;
                        } else {
                            alert("Error reading file!\nDetails: File is empty or unreadable.");
                        }
                    };
                    reader.onerror = function () {
                        alert("Error reading file!\nDetails: " + reader.error);
                    };
                    reader.readAsDataURL(file);
                }
            }
        });
        
        $("#main_customface_custom2_next").click(function () {
            if (!vr.options.face.customtemp.url) {
                alert("Please click \"Browse\" and select an image.");
            } else {
                $("#main_customface_custom2").slideUp();
                $("#main_customface_custom3").slideDown();
            }
        });
        
        $.each(vr.options.boosts, function (name, data) {
            $("#main_customface_custom3_boost ul").append('<li><a href="#">' + vr.escHTML(name) + '</a></li>');
        });
        vr.options.boost.dropdown = new DropDown($("#main_customface_custom3_boost"), function () {
            vr.options.face.customtemp.boost = this.text;
        });
        
        $("#main_customface_custom3_save").click(function () {
            if (!vr.options.face.customtemp.boost) {
                alert("Please select a boost.");
            } else {
                vr.db.add(vr.options.face.customtemp, function () {
                    vr.db.update();
                });
                $("#main_customface_back").click();
            }
        });
        
        $("#main_customface_back").click(function () {
            $("#main_customface").fadeOut(function () {
                $("#main_options, #main_options_bottom").fadeIn();
                $("#main_customface_custombtn_container").show();
                $("#main_customface_custom1, #main_customface_custom2, #main_customface_custom3").hide()
            });
        });
        
        /* SPEED-O-METER */
        
        $.each(vr.options.speeds, function (name, value) {
            if (value > 1) {
                $("#main_speedometer_slowpresets ul").append('<li><a href="#">' + vr.escHTML(name) + '</a></li>');
            } else {
                $("#main_speedometer_fastpresets ul").append('<li><a href="#">' + vr.escHTML(name) + '</a></li>');
            }
        });
        vr.options.speeds.fastdropdown = new DropDown($("#main_speedometer_fastpresets"), function () {
            $("#main_speedometer_speed").val(vr.options.speeds[this.text]).change();
            return false;
        });
        vr.options.speeds.slowdropdown = new DropDown($("#main_speedometer_slowpresets"), function () {
            $("#main_speedometer_speed").val(vr.options.speeds[this.text]).change();
            return false;
        });
        
        $("#main_speedometer_speed").change(function () {
            var newval = Number($(this).val());
            if (isNaN(newval) || newval <= 0) {
                $(this).addClass("bad");
            } else {
                $(this).removeClass("bad");
                vr.options.speed.value = newval;
                $(this).val(newval);
            }
        });
        $("#main_speedometer_speed").val(vr.options.speed.value).change();
        
        $("#main_speedometer_blastoff").checkbox().change(function () {
            vr.options.blastoff.value = $(this).is(":checked");
        });
        $("#main_speedometer_blastoff")[0].checked = vr.options.blastoff.value;
        
        $("#main_speedometer_back").click(function () {
            $("#main_speedometer_speed").change();
            if ($("#main_speedometer_speed").hasClass("bad")) {
                alert("Please enter a valid speed value or select one of the presets.");
            } else {
                $("#main_speedometer").fadeOut(function () {
                    $("#main_options, #main_options_bottom").fadeIn();
                });
            }
        });
        
        /* MANAGE RUNNERS */
        
        if (typeof btoa == "function") {
            $("#main_manage_facelist").on("change", "input", function () {
                var $inputs = $("#main_manage_facelist input:checked");
                if ($inputs.length == 0) {
                    $("#main_manage_export").attr("href", "data:application/json;base64," + btoa("[]"));
                } else {
                    var sending = [];
                    var names = [];
                    var completed = 0;
                    $inputs.each(function () {
                        vr.db.fetch(JSON.parse($(this).attr("data-value")).key, function (data) {
                            sending.push(data);
                            names.push(data.name.replace(/[<>:"/\\|?*\x00-\x1f]+/g, "_"));
                            completed++;
                            if (completed >= $inputs.length) {
                                $("#main_manage_export").attr({
                                    href: "data:application/json;base64," + btoa(JSON.stringify(sending)),
                                    download: "Virtual Running - " + names.join(", ") + ".vrff"
                                });
                            }
                        });
                    });
                }
            });
            
            $("#main_manage_export").show().attr("href", "data:application/json;base64," + btoa("[]")).click(function () {
                var $inputs = $("#main_manage_facelist input:checked");
                if ($inputs.length == 0) {
                    alert("Please select one or more runners.");
                    return false;
                } else if (typeof document.createElement("a").download == "undefined") {
                    alert("Right-click this button, select \"Save Link As\" or \"Save Target As\", and name the file something like \"name.vrff\"");
                    return false;
                }
            });
        }
        
        $("#main_manage_delete").click(function () {
            var $inputs = $("#main_manage_facelist input:checked");
            if ($inputs.length == 0) {
                alert("Please select one or more runners.");
            } else {
                var completed = 0;
                $inputs.each(function () {
                    var $top = $(this).closest("div");
                    vr.db.remove(JSON.parse($(this).attr("data-value")).key, function () {
                        completed++;
                        if (completed >= $inputs.length) {
                            vr.db.update();
                        }
                    });
                });
            }
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
            vr.preload(data.background);
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
        
        if (vr.options.face.data.endurl) vr.preload(vr.options.face.data.endurl);
        
        var course = vr.options.courses[vr.options.course.value];
        $("#main_face").attr("src", vr.options.face.data.url).css({
            left: course.start[0],
            top: course.start[1],
            width: course.imgsize,
            height: course.imgsize
        });
        if (course.startrotation || course.flipX || course.flipY) {
            var css = [];
            if (course.startrotation) css.push("rotate(" + course.startrotation + "deg)");
            if (course.flipX) css.push("scaleX(-1)");
            if (course.flipY) css.push("scaleY(-1)");
            css = css.join(" ");
            $("#main_face").css({
                "-webkit-transform": css,
                "-moz-transform": css,
                "transform": css
            });
        }
        $("#main_img").attr("src", course.background).animate({opacity: 1});
        
        vr.options.boost.enabled = false;
        if (vr.options.boosts.hasOwnProperty(vr.options.face.data.boost)) {
            vr.options.boost.data = vr.options.boosts[vr.options.face.data.boost];
            if (vr.options.boost.data.strength > 0 && vr.options.boost.data.strength < vr.boostMaxStrength) {
                vr.options.boost.enabled = true;
                vr.options.boost.useme = 0;
                vr.options.boost.uses = 0;
                vr.options.boost.timeelapsed = 0;
                if (vr.options.boost.data.image) {
                    vr.options.boost.image = vr.options.boost.data.image;
                    // Try to cut the opacity of the image in half (and preload it while we're at it)
                    var img = new Image();
                    img.onload = function () {
                        if (img.width && img.height) {
                            var canvas = document.createElement("canvas");
                            if (typeof canvas.getContext == "function") {
                                canvas.width = img.width;
                                canvas.height = img.height;
                                var context = canvas.getContext("2d");
                                context.globalAlpha = 0.5;
                                context.drawImage(img, 0, 0);
                                vr.options.boost.image = canvas.toDataURL("image/png");
                            }
                        }
                    };
                    img.src = vr.options.boost.data.image;
                }
                if (typeof vr.options.boost.data.sound == "object" && vr.options.boost.data.sound.length) {
                    var $audio = $("#boost_sound");
                    if (typeof $audio[0].play == "function") {
                        $.each(vr.options.boost.data.sound, function (index, data) {
                            var source = document.createElement("source");
                            source.src = data;
                            $audio.append(source);
                        });
                        $audio[0].load();
                        vr.options.boost.audioenabled = true;
                    }
                }
                $("#main_controls_boost").show();
                $("#main_controls_boost_btn").text(vr.options.boost.data.action).click(function () {
                    vr.options.boost.useme++;
                    $("#main_controls_boost_readying_container:hidden").slideDown();
                    $("#main_controls_boost_readying").text(vr.options.boost.useme);
                });
            }
        }
        
        $("#main_options, #main_options_bottom").fadeOut(function () {
            if (course.controls) {
                if (course.controls.align) $("#main_table > tbody > tr > td").css("vertical-align", course.controls.align);
                if (course.controls.theme) $("#main_controls").addClass(course.controls.theme);
                if (course.controls.css) $("#main_controls").css(course.controls.css);
            }
            if (vr.query.debug) {
                $("#main_controls_debug").show();
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
        
        if (!vr.constantupdate && vr.currentpath > -1 && course.path[vr.currentpath].distance > 5) {
            // We're only updating here, as opposed to the other setInterval "constant-update" method
            // For distance traveled, we use normal distance; for time elapsed, we use virtual distance
            vr.updateStats(course.path[vr.currentpath].distance, (course.path[vr.currentpath].virtualdistance || course.path[vr.currentpath].distance) / vr.rate);
        }
        
        if (vr.options.boost.diff && vr.currentpath > -1 && course.path[vr.currentpath].distance > 5) {
            // Here we're using virtual distance since it's time elapsed
            var timeelapsed = (course.path[vr.currentpath].virtualdistance || course.path[vr.currentpath].distance) / vr.rate;
            vr.options.boost.timeelapsed += timeelapsed;
            if (vr.options.boost.timeelapsed >= vr.boostTimeNeeded) {
                vr.rate -= vr.options.boost.diff;
                vr.options.boost.diff = 0;
                vr.options.boost.timeelapsed = 0;
                $("#main_controls").css("background-image", "none");
            }
        }
        
        vr.currentpath++;
        if ((vr.lapscompleted + 1) < vr.options.laps) {
            // Make sure we're not using a path marked "final", ie. last lap only
            while (vr.currentpath < course.path.length && course.path[vr.currentpath].final) {
                vr.currentpath++;
            }
        } else if (vr.currentpath > -1 && course.path[vr.currentpath]) {
            // We're on the last lap; check if we should start blastoff ending
            if (vr.options.blastoff.value && course.path[vr.currentpath].blastoffStart) {
                vr.options.blastoff.go = true;  // to start the blastoff; then for future paths we'll check vr.options.blastoff.started to keep the blastoff speed going
            }
        }
        
        if (vr.currentpath >= course.path.length) {
            vr.lapscompleted++;
            vr.currentpath = -1;
            $("#main_controls_lapscompleted").text(vr.lapscompleted);
            if (vr.lapscompleted < vr.options.laps) {
                vr.run();
            } else {
                // We're done!!
                if (vr.options.face.data.endurl) {
                    $("#main_face").attr("src", vr.options.face.data.endurl);
                }
                $("#main_controls_boost:visible, #main_controls_boost_readying_container:visible").slideUp();
            }
        } else {
            if (vr.ratediff > 1) vr.ratediff -= 0.1;
            var oldrate = vr.rate;
            vr.rate += vr.ratediff / (vr.options.laps * course.path.length + 1);
            
            if (vr.options.boost.enabled) {
                if (vr.options.boost.timeelapsed == 0) {
                    vr.options.boost.diff = 0;
                    while (vr.options.boost.useme > 0 && vr.options.boost.diff < vr.options.boost.data.strength * vr.boostScaler * 2) {
                        vr.options.boost.useme--;
                        if (vr.options.boost.uses >= vr.boostMaxStrength - vr.options.boost.data.strength) {
                            vr.options.boost.diff -= vr.options.boost.data.strength * vr.boostScaler;
                        } else {
                            vr.options.boost.diff += vr.options.boost.data.strength * vr.boostScaler;
                        }
                        vr.options.boost.uses++;
                    }
                    if (vr.rate + vr.options.boost.diff < 0) {
                        // We can't go all the way because that would be a negative rate, so we'll just cut off 4/5 of the rate
                        vr.options.boost.diff = vr.rate * (-0.8);
                        if (vr.rate + vr.options.boost.diff < 0.01) {
                            // But still too much
                            vr.options.boost.diff = 0.01 - vr.rate;
                        }
                    }
                    vr.rate += vr.options.boost.diff;
                    if (vr.options.boost.diff) {
                        if (vr.options.boost.image) {
                            $("#main_controls").css("background-image", "url(" + vr.options.boost.image + ")");
                        }
                        if (vr.options.boost.audioenabled) {
                            $("#boost_sound")[0].play();
                        }
                    }
                }
                $("#main_controls_boost_uses").text(vr.options.boost.uses + "/" + (vr.boostMaxStrength - vr.options.boost.data.strength));
                if (vr.options.boost.useme) {
                    $("#main_controls_boost_readying_container:hidden").slideDown();
                    $("#main_controls_boost_readying").text(vr.options.boost.useme);
                } else {
                    $("#main_controls_boost_readying_container:visible").slideUp();
                }
            }
            
            if (vr.query.debug) {
                $("#main_controls_debug_rate").text(Math.round(vr.rate * 1000) / 1000);
                $("#main_controls_debug_ratediff").text(Math.round(vr.ratediff * 1000) / 1000);
                $("#main_controls_debug_diff").text(Math.round((vr.rate - oldrate) * 1000) / 1000);
                $("#main_controls_debug_boostdiff").text(Math.round(vr.options.boost.diff * 1000) / 1000);
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
                var data = path.data;
                if (course.flipX || course.flipY) {
                    var css = [];
                    if ((course.flipX && typeof data.flipX == "undefined") || data.flipX) css.push("scaleX(-1)");
                    if ((course.flipY && typeof data.flipY == "undefined") || data.flipY) css.push("scaleY(-1)");
                    data.transform_other = css.join(" ");
                }
                params = {
                    path: new $.path.bezier(data)
                };
            }
            
            var distance = path.virtualdistance || path.distance;
            var time = Math.round((distance / vr.rate) * 1000);
            
            if (vr.constantupdate && path.distance > 5) {
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
            
            if (vr.options.blastoff.go) {
                vr.options.blastoff.started = true;
            }
            
            $("#main_face").animate(params, time, vr.options.blastoff.go ? "easeInBack" : "linear", function () {
                vr.run();
            });
            
            vr.options.blastoff.go = false;
        }
    },
    
    db: {
        idb: null,
        DB_NAME: "VRDB",
        DB_STORE: "faces",
        
        error: function (event, func) {
            alert("DATABASE ERROR in " + func + ": " + event.target.errorCode + "\nDetails in error console");
            if (typeof console != "undefined" && typeof console.log == "function") {
                console.log("DATABASE ERROR in " + func + ": " + event.target.errorCode + "...");
                console.log(event);
            }
        },
        
        load: function () {
            if (window.indexedDB) {
                var request = window.indexedDB.open(vr.db.DB_NAME);
                request.onerror = function (event) {
                    vr.db.error(event, "request.onerror");
                };
                request.onblocked = function (event) {
                    vr.db.error(event, "request.onblocked");
                };
                request.onsuccess = function (event) {
                    vr.db.idb = request.result;
                    vr.db.idb.onerror = function (event) {
                        vr.db.error(event, "vr.db.idb.onerror");
                    };
                    vr.db.ready();
                    vr.db.update();
                };
                request.onupgradeneeded = function (event) {
                    var db = event.target.result;
                    var objectStore = db.createObjectStore(vr.db.DB_STORE, {autoIncrement: true});
                };
            }
        },
        
        objectStore: function (mode) {
            if (mode == "readwrite") {
                mode = IDBTransaction.READ_WRITE || "readwrite";
            } else {
                mode = IDBTransaction.READ_ONLY || "readonly";
            }
            return vr.db.idb.transaction([vr.db.DB_STORE], mode).objectStore(vr.db.DB_STORE);
        },
        
        ready: function () {
            // Implemented above, in vr.load()
        },
        
        update: function () {
            // Implemented above, in vr.load()
        },
        
        fetch: function (key, callback) {
            // Fetch from object store by key
            if (!vr.db.idb) return false;
            
            vr.db.objectStore().get(key).onsuccess = function (event) {
                if (typeof callback == "function") callback(event.target.result);
            };
        },
        
        fetchall: function (callback, endcallback) {
            // Fetch list of all objects in object store
            if (!vr.db.idb) return false;
            
            vr.db.objectStore().openCursor().onsuccess = function (event) {
                var cursor = event.target.result;
                if (cursor) {
                    if (typeof callback == "function") callback(cursor.key, cursor.value);
                    cursor.continue();
                } else {
                    if (typeof endcallback == "function") endcallback();
                }
            };
        },
        
        add: function (data, callback) {
            // Add data to object store
            if (!vr.db.idb) return false;
            
            vr.db.objectStore("readwrite").add(data).onsuccess = function (event) {
                if (typeof callback == "function") callback.apply(this, arguments);
            };
        },
        
        put: function (key, data, callback) {
            // Update data with key in object store
            if (!vr.db.idb) return false;
            
            vr.db.objectStore("readwrite").put(data, key).onsuccess = function (event) {
                if (typeof callback == "function") callback.apply(this, arguments);
            };
        },
        
        remove: function (key, callback) {
            // Remove key from object store
            if (!vr.db.idb) return false;
            
            vr.db.objectStore("readwrite").delete(key).onsuccess = function (event) {
                if (typeof callback == "function") callback.apply(this, arguments);
            };
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


// jQuery plugin to go with CSS pretty checkbox (link in style.css)
(function ($) {
    jQuery.fn.checkbox = function () {
        // Turn a normal checkbox into a fancy checkbox
        var $input = this;
        var randid = "CheckBox_" + Math.random().toString(36).substring(2);
        if (!$input[0].id) $input[0].id = randid + "_input";
        var inputid = $input[0].id;
        $input.after('<table><tbody><tr><td style="width: 30%;"><div class="checkbox"><span id="' + randid + '"></span><label for="' + vr.escHTML(inputid) + '"></label></div></td><td style="text-align: left;"><label for="' + vr.escHTML(inputid) + '" style="margin-left: 20px;">' + vr.escHTML($input.attr("title")) + '</label></td></tr></tbody></table>');
        $("#" + randid).replaceWith($input);
        return $input.css("display", "none");
    };
})(jQuery);


// http://tympanus.net/codrops/2012/10/04/custom-drop-down-list-styling/
function DropDown($el, onchange) {
    var obj = this;
    obj.$placeholder = $el.children("span");
    obj.origtext = obj.$placeholder.text();
    
    obj.clear = function () {
        obj.value = null;
        obj.type = null;
        obj.text = "";
        obj.$placeholder.text(obj.origtext);
    };
    obj.clear();
    
    $el.on("click", function (event) {
        $(this).toggleClass("active");
        return false;
    });
    
    $el.find("ul").on("click", "li", function () {
        var $opt = $(this);
        
        obj.oldvalue = obj.value;
        obj.oldtype = obj.type;
        obj.oldtext = obj.text;
        
        obj.value = $opt.attr("data-value");
        if (obj.value === undefined) obj.value = null;
        obj.type = $opt.attr("data-type");
        if (obj.type === undefined) obj.type = null;
        obj.text = $opt.text();
        
        var res = null;
        if (typeof onchange == "function") {
            res = onchange.call(obj);
        }
        if (res === false) {
            obj.value = obj.oldvalue;
            obj.type = obj.oldtype;
            obj.text = obj.oldtext;
        } else {
            obj.$placeholder.text(obj.text);
        }
    });
}