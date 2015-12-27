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

function getStaticLevels(ctx) {
    return [new Level({
        ctx: ctx,
        pps: [
            PersonPosition.createHangingPersonPosition({
                name: "Big Wyatt"
            }, {}, {}, 7, 100, 100, Math.PI/3, Math.PI/3, 4, true),

            PersonPosition.createHangingPersonPosition({
                name: "Littl Wyatt"
            }, {}, {}, 2, 1900, 100, 0, 0, 4, false)
        ],
        ppsPoints: [1, 5],
        onStatusChange: status,
        onPersonClick: function (data) {
            alert("Click on " + data.name + "!");
        }
    })];
}

function getDynamicLevels(ctx, width, height) {
    return [
        Level.createDynamicLevel({
            ctx: ctx,
            onStatusChange: status,
            onPersonClick: function (data) {
                alert("Someone was clicked!");
            }
        }, new Array(10), {
            x: [0, width],
            y: [0, height],
            //delta: [2, 6],
            //scale: [2, 6]
        })
    ];
}
