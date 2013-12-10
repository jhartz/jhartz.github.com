/*

Copyright (c) 2013 Jake Hartz

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/

var repdec = {
    ids: {
        body: "repdec_body",  // Element to show when ready (optional)
        err: "repdec_body",  // Element whose contents will be replaced with an error message (optional)
        a: "repdec_a",  // Input for first part of decimal (non-repeating section)
        b: "repdec_b",  // Input for second part of decimal (repeating section)
        dec: "repdec_dec",  // Element in which to display the interpretation of the inputted decimal (optional)
        frac_top: "repdec_frac_top",  // Element in which to display the numerator of the fraction
        frac_bottom: "repdec_frac_bottom",  // Element in which to display the denominator of the fraction
        frac_simp: "repdec_frac_simp",  // Element to show if a simplified fraction is available (optional)
        frac_simp_top: "repdec_frac_simp_top",  // Element in which to display the numerator of a simplified fraction (optional)
        frac_simp_bottom: "repdec_frac_simp_bottom",  // Element in which to display the denominator of a simplified fraction (optional)
        frac_zero: "repdec_frac_zero",  // Element to display if the fraction is equal to zero (optional)
        frac_one: "repdec_frac_one"  // Element to display if the fraction is equal to one (optional)
    },
    required_ids: ["a", "b", "dec", "frac_top", "frac_bottom"],
    classNames: {
        example: "repdec_example"  // Any element that, when clicked, should populate the repdec fields (optional)
                                   // These elements should have a "data-non-repeating" attribute that specifies the non-repeating digits (like ids.a) and a "data-repeating" attribute that specifies the repeating digits (like ids.b).
    },
    required_classNames: [],
    
    elems: {
        byId: {},
        byClassName: {}
    },
    
    err: function (msg, isbrowser) {
        if (document.getElementById(repdec.ids.err)) {
            var safemsg = msg.replace(/</g, "&gt;").replace(/>/g, "&lt;").replace(/&/g, "&amp;").replace(/\"/g, "&quot;");
            safemsg = safemsg.replace(/\n/g, "<br>");
            document.getElementById(repdec.ids.err).innerHTML = "<p>ERROR: " + safemsg + "</p>" + (isbrowser ? "<p>Please upgrade to a modern browser.</p>" : "");
        }
        throw msg;
    },
    
    prettyerr: function (msg) {
        if (repdec.elems.byId.dec) repdec.elems.byId.dec.innerHTML = msg;
        repdec.elems.byId.frac_top.innerHTML = "0";
        repdec.elems.byId.frac_bottom.innerHTML = "0";
        if (repdec.elems.byId.frac_simp) repdec.elems.byId.frac_simp.style.display = "none";
        if (repdec.elems.byId.frac_zero) repdec.elems.byId.frac_zero.style.display = "none";
        if (repdec.elems.byId.frac_one) repdec.elems.byId.frac_one.style.display = "none";
    },
    
    reduce: function (top, bottom) {
        var gcd = function gcd(a, b) {
            return b ? gcd(b, a % b) : a;
        };
        gcd = gcd(top, bottom);
        return [top/gcd, bottom/gcd];
    },
    
    addzeroes: function (orig_str, new_str) {
        if (new_str == "0") new_str = "";
        if (orig_str.charAt(0) == "0") {
            var place = 0;
            while (place !== false) {
                if (orig_str.charAt(place) == "0") {
                    new_str = "0" + new_str;
                    place++;
                } else {
                    place = false;
                }
            }
        }
        return new_str;
    },
    
    update: function () {
        var a = repdec.elems.byId.a.value ? parseInt(repdec.elems.byId.a.value, 10) : null;
        var b = repdec.elems.byId.b.value ? parseInt(repdec.elems.byId.b.value, 10) : null;
        if (isNaN(a) || isNaN(b) || b === null || (a && a < 0) || (b && b < 0)) {
            repdec.prettyerr("Not a number");
        } else {
            var str_a = a === null ? "" : a.toString(),
                str_b = b === null ? "" : b.toString();
            if (str_a.indexOf("e") != -1 || str_b.indexOf("e") != -1 || str_a.length > 15 || str_b.length > 15) {
                // We don't want any weirdness with big numbers that are represented oddly in float-world
                repdec.prettyerr("Number too large");
            } else {
                // Zeroes in front of a or b?
                if (a !== null) str_a = repdec.addzeroes(repdec.elems.byId.a.value, str_a);
                str_b = repdec.addzeroes(repdec.elems.byId.b.value, str_b);
                repdec.elems.byId.dec.innerHTML = '0.' + str_a + '<span style="border-top: 1px solid;">' + str_b + '</span> <em>or</em> 0.' + str_a + str_b + str_b + str_b + '...';
                
                var top = Number(str_a + str_b) - a;
                var bottom = Number((new Array(str_b.length + 1)).join("9") + (new Array(str_a.length + 1)).join("0"));
                repdec.elems.byId.frac_top.innerHTML = top;
                repdec.elems.byId.frac_bottom.innerHTML = bottom;
                if (top == 0 && repdec.elems.byId.frac_zero) {
                    if (repdec.elems.byId.frac_simp) repdec.elems.byId.frac_simp.style.display = "none";
                    if (repdec.elems.byId.frac_zero) repdec.elems.byId.frac_zero.style.display = "block";
                    if (repdec.elems.byId.frac_one) repdec.elems.byId.frac_one.style.display = "none";
                } else if (top == bottom && repdec.elems.byId.frac_one) {
                    if (repdec.elems.byId.frac_simp) repdec.elems.byId.frac_simp.style.display = "none";
                    if (repdec.elems.byId.frac_zero) repdec.elems.byId.frac_zero.style.display = "none";
                    if (repdec.elems.byId.frac_one) repdec.elems.byId.frac_one.style.display = "block";
                } else {
                    if (repdec.elems.byId.frac_zero) repdec.elems.byId.frac_zero.style.display = "none";
                    if (repdec.elems.byId.frac_one) repdec.elems.byId.frac_one.style.display = "none";
                    if (repdec.elems.byId.frac_simp_top && repdec.elems.byId.frac_simp_bottom) {
                        var reduced = repdec.reduce(top, bottom);
                        if (reduced[0] != top || reduced[1] != bottom) {
                            if (repdec.elems.byId.frac_simp) repdec.elems.byId.frac_simp.style.display = "block";
                            repdec.elems.byId.frac_simp_top.innerHTML = reduced[0];
                            repdec.elems.byId.frac_simp_bottom.innerHTML = reduced[1];
                        } else {
                            if (repdec.elems.byId.frac_simp) repdec.elems.byId.frac_simp.style.display = "none";
                        }
                    } else if (repdec.elems.byId.frac_simp) repdec.elems.byId.frac_simp.style.display = "none";
                }
            }
        }
    },
    
    onload: function () {
        for (var id in repdec.ids) {
            if (repdec.ids.hasOwnProperty(id)) {
                repdec.elems.byId[id] = document.getElementById(repdec.ids[id]);
                if (!repdec.elems.byId[id] && repdec.required_ids.indexOf(id) != -1) {
                    repdec.err("Couldn't find " + id);
                    return;
                }
            }
        }
        
        for (var className in repdec.classNames) {
            if (repdec.classNames.hasOwnProperty(className)) {
                repdec.elems.byClassName[className] = document.getElementsByClassName(repdec.classNames[className]);
                if (repdec.elems.byClassName[className].length == 0 && repdec.required_classNames.indexOf(className) != -1) {
                    repdec.err("Couldn't find " + className);
                    return;
                }
            }
        }
        
        if (typeof repdec.elems.byId.a.addEventListener != "function") {
            repdec.err("addEventListener not found", true);
            return;
        }
        
        repdec.elems.byId.a.addEventListener("keyup", function (event) {
            repdec.update();
        }, false);
        repdec.elems.byId.b.addEventListener("keyup", function (event) {
            repdec.update();
        }, false);
        
        if (repdec.elems.byClassName.example.length > 0) {
            for (var i = 0; i < repdec.elems.byClassName.example.length; i++) {
                repdec.elems.byClassName.example[i].addEventListener("click", function (event) {
                    repdec.elems.byId.a.value = this.getAttribute("data-non-repeating") || "";
                    repdec.elems.byId.b.value = this.getAttribute("data-repeating") || "";
                    repdec.update();
                }, false);
            }
        }
        
        repdec.update();
        if (repdec.elems.byId.body) repdec.elems.byId.body.style.display = "block";
    }
};

(function () {
    if (typeof window.onload == "function") {
        var oldwinload = window.onload;
        window.onload = function () {
            oldwinload.apply(this, arguments);
            repdec.onload();
        };
    } else {
        window.onload = function () {
            repdec.onload();
        };
    }
})();
