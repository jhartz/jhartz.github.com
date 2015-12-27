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

var utils = {
    /**
     * Convert from HSL to RGB. Each parameter should be between 0 and 1, inclusive
     *
     * @param {number} hue - The hue
     * @param {number} [sat=1] - The saturation
     * @param {number} [lum=0.5] - The lightness
     * @return {string} The color in hex RGB format
     */
    hslToRgb: function (hue, sat, lum) {
        if (typeof sat != "number") sat = 1;
        if (typeof lum != "number") lum = 0.5;

        var r, g, b;
        if (sat == 0) {
            r = g = b = 1;
        } else {
            var hue2rgb = function hue2rgb(p, q, t){
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1/6) return p + (q - p) * 6 * t;
                if (t < 1/2) return q;
                if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            }

            var q = lum < 0.5 ? lum * (1 + sat) : lum + sat - lum * sat;
            var p = 2 * lum - q;
            r = hue2rgb(p, q, hue + 1/3);
            g = hue2rgb(p, q, hue);
            b = hue2rgb(p, q, hue - 1/3);
        }

        return [
            ("00" + Math.round(r * 255).toString(16)).substr(-2),
            ("00" + Math.round(g * 255).toString(16)).substr(-2),
            ("00" + Math.round(b * 255).toString(16)).substr(-2)
        ].join("");
    }
};
