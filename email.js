// Changes obfuscated email addresses into clickable mailto links
(function () {
  if (document.getElementsByClassName && document.getElementsByTagName) {
    var text = (function () {
      var escHTML = function (html) {
        return (html + "").replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt");
      };
      var dummy = document.createElement("span");
      dummy.innerHTML = "hello world";
      if (dummy.textContent) {
        return (function (elem) {
          return elem && escHTML(elem.textContent);
        });
      } else if (dummy.innerText) {
        return (function (elem) {
          return elem && escHTML(elem.innerText);
        });
      } else {
        return (function (elem) {
          return elem && elem.innerHTML;
        });
      }
    })();
    var es = document.getElementsByClassName("e");
    for (var i = 0; i < es.length; i++) {
      var parent = es[i].parentNode;
      if (parent.getElementsByTagName("a").length == 0) {
        var e = es[i];
        var a = parent.getElementsByClassName("a")[0];
        var l = parent.getElementsByClassName("l")[0];
        var addr = text(e) + "@" + text(a) + "." + text(l);
        parent.innerHTML = '<a href="mailto:' + addr + '">' + addr + '</a>';
      }
    }
  }
})();
