/*

Copyright (c) 2013 Jake Hartz

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/

var repdec = {
    ids: {
        body: "repdec_body",  // Element to make visible when ready (optional)
        err: "repdec_body",  // Element to replace with error message (optional)
        a:  "repdec_a",  // Input for first part of decimal (non-repeating section)
        b:  "repdec_b",  // Input for second part of decimal (repeating section)
        dec: "repdec_dec",  // Element in which to display the interpretation of the inputted decimal (optional)
        frac_top: "repdec_frac_top",  // Element in which to display the numerator of the fraction
        frac_bottom: "repdec_frac_bottom"  // Element in which to display the denominator of the fraction
    },
    required: ["a", "b", "dec", "frac_top", "frac_bottom"],
    
    elems: {},
    
    err: function (msg, isbrowser) {
        if (document.getElementById(repdec.ids.err)) {
            var safemsg = msg.replace(/</g, "&gt;").replace(/>/g, "&lt;").replace(/&/g, "&amp;").replace(/\"/g, "&quot;");
            safemsg = safemsg.replace(/\n/g, "<br>");
            document.getElementById(repdec.ids.err).innerHTML = "<p>ERROR: " + safemsg + "</p>" + (isbrowser ? "<p>Please upgrade to a modern browser.</p>" : "");
        }
        throw msg;
    },
    
    update: function () {
        var a = repdec.elems.a.value ? parseInt(repdec.elems.a.value, 10) : null;
        var b = repdec.elems.b.value ? parseInt(repdec.elems.b.value, 10) : null;
        if (isNaN(a) || isNaN(b)) {
            repdec.elems.dec.innerHTML = "Not a number";
        } else {
            var str_a = a === null ? "" : a.toString(),
                str_b = b === null ? "" : b.toString();
            if (str_b.length > 2) str_b = str_b + str_b;
            else str_b = str_b + str_b + str_b;
            repdec.elems.dec.innerHTML = "0." + str_a + str_b + "...";
        }
    },
    
    onload: function () {
        for (var id in repdec.ids) {
            if (repdec.ids.hasOwnProperty(id)) {
                repdec.elems[id] = document.getElementById(repdec.ids[id]);
                if (!repdec.elems[id] && repdec.required.indexOf(id) != -1) {
                    repdec.err("Couldn't find " + id);
                    return;
                }
            }
        }
        
        if (typeof repdec.elems.a.addEventListener != "function") {
            repdec.err("addEventListener not found", true);
            return;
        }
        
        repdec.elems.a.addEventListener("keyup", function (event) {
            repdec.update();
        }, false);
        repdec.elems.b.addEventListener("keyup", function (event) {
            repdec.update();
        }, false);
        
        repdec.update();
        if (repdec.elems.body) repdec.elems.body.style.display = "block";
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