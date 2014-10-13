---
layout: post
title: "Experimenting with JavaScript obfuscation"
excerpt: "I'm not a fan of JavaScript obfuscation. However, I'm working on an entirely client-side (JavaScript) project, and I decided that I would play around with obfuscating so I could put the client secret into my code and have it ever-so-slightly more protected than if it were just in plain sight."
---
Everyone knows about the age-old idea of JavaScript obfuscation. To start right off, I do not support the concept. Why?

1. It goes against the principles behind Free and Open-Source software.
2. It is quite easily reversible:

    _eval = eval;
    eval = function () {
        console.log(arguments);
        _eval.apply(this, arguments);
    };
    /* Execute obfuscated code now */

(If anyone can find a method of obfuscation that is not flunked by that method, please let me know; it would be interesting!)

Anyway, I'm working on a project where I'm accessing an API that requires a client secret code for OAuth. It's entirely client-side (JavaScript), so using server-side code is not an option. I decided that I would play around with obfuscating so I could put the client secret into my code and have it ever-so-slightly more protected than if it were just in plain sight. Of course, there's oodles of obfuscation utilities out there, but I decided to roll my own, just for fun.

<!-- see more -->

NOTE: This based on [Firefox's array comprehensions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Array_comprehensions#Differences_to_the_older_JS1.7.2FJS1.8_comprehensions) (not even the new fancy [ECMAScript6 array comprehensions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Array_comprehensions)). This is completely incompatible with everything except Firefox. (Can you tell that this project that I was working on is Firefox-specific? Perhaps, if you're clever, you can pick out from my hints that it's actually a Firefox add-on!)

<script type="text/javascript">
function obfuscate(str) {
    // https://gist.github.com/mathiasbynens/1243213
    var u = function (str) {
        return str.replace(/[\s\S]/g, function(character) {
            var escape = character.charCodeAt().toString(16),
            longhand = escape.length > 2;
            return '\\' + (longhand ? 'u' : 'x') + ('0000' + escape).slice(longhand ? -4 : -2);
        });
    };
    // With toString(32), it's guaranteed to be 2 digits as long as the character code is from 32 (which is the first non-control character) to 1023 (inclusive).
    var coded = [(str.charCodeAt(i)+1).toString(32) for (i in (function(){let x = str.length; while (x--) yield x;})())];
    if ([j.length == 2 for (j of coded)].indexOf(false) != -1) {
        return '"Error: One or more characters are not in between 30 and 1023!"';
    }
    coded = coded.join('');
    var template = 'void(this["' + u('eval') + '"]([this["' + u('String') + '"]["' + u('fromCharCode') + '"](this["' + u('parseInt') + '"]("__CODED__".substring(i-0x1,i+0x1),0x20)-0x1)for(i in (function(){let x=__CODED_LENGTH__;while(x) yield (x--,x--);})())]["' + u('join') + '"]("")))';
    return 'this["' + u('eval') + '"]("' + u(template.replace('__CODED__', u(coded)).replace('__CODED_LENGTH__', coded.length)) + '")';
}

window.addEventListener("load", function () {
    [
        'const mySecret = "ABCDE:fghijkl.12345";',
        'console.log("' + String.fromCharCode(1022) + '");',
        '"\n"'
    ].forEach(function (example) {
        var code = document.createElement("code");
        code.textContent = example;
        var span = document.createElement("span");
        span.textContent = ": " + obfuscate(example);
        var li = document.createElement("li");
        li.appendChild(code);
        li.appendChild(span);
        document.getElementById("examples").appendChild(li);
    });
    
    document.getElementById("obfuscate").addEventListener("click", function () {
        document.getElementById("from_obfuscate").value = obfuscate(document.getElementById("to_obfuscate").value);
    }, false);
}, false);
</script>

```javascript
function obfuscate(str) {
    var u = function (str) {
        // from https://gist.github.com/mathiasbynens/1243213
        return str.replace(/[\s\S]/g, function(character) {
            var escape = character.charCodeAt().toString(16),
            longhand = escape.length > 2;
            return '\\' + (longhand ? 'u' : 'x') + ('0000' + escape).slice(longhand ? -4 : -2);
        });
    };
    // With toString(32), it's guaranteed to be 2 digits as long as the character code is from 32 (which is the first non-control character) to 1023 (inclusive).
    var coded = [(str.charCodeAt(i)+1).toString(32) for (i in (function(){let x = str.length; while (x--) yield x;})())];
    if ([j.length == 2 for (j of coded)].indexOf(false) != -1) {
        return '"Error: One or more characters are not in between 30 and 1023!"';
    }
    coded = coded.join('');
    var template = 'void(this["' + u('eval') + '"]([this["' + u('String') + '"]["' + u('fromCharCode') + '"](this["' + u('parseInt') + '"]("__CODED__".substring(i-0x1,i+0x1),0x20)-0x1)for(i in (function(){let x=__CODED_LENGTH__;while(x) yield (x--,x--);})())]["' + u('join') + '"]("")))';
    return 'this["' + u('eval') + '"]("' + u(template.replace('__CODED__', u(coded)).replace('__CODED_LENGTH__', coded.length)) + '")';
}
```

Examples (if you're running Firefox):

<ul id="examples"></ul>

Live Playground (again, if you're running Firefox):

<p><label for="to_obfuscate">Code to obfuscate: </label><input id="to_obfuscate"> <button id="obfuscate">Obfuscate!</button></p>
<p><textarea id="from_obfuscate" style="width: 100%;" rows="6"></textarea></p>
