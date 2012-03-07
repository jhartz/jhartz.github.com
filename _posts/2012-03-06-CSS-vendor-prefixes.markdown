---
layout: post
title: "CSS vendor prefixes - a retun to the IE6 era?"
date: 2012-03-06 17:28:00  # 8:28 pm EST
excerpt: 'CSS vendor prefixes, a system originally meant for testing prototypes of not-yet-standardized CSS features, have led to "Only-works-in-WebKit" sites on the mobile Web and across the Internet, just like the old days of "Only-works-in-IE6" sites (a problem which took a decade to fix).'
---
I just read [a great article][1] regarding the current problems in the browser world (mostly among mobile browsers) regarding CSS vendor prefixes. A system originally meant for testing prototypes of not-yet-standardized CSS features, vendor prefixes (such as the most problematic, `-webkit-*`) have led to "Only-works-in-WebKit" sites on the mobile Web, just like the old days of "Only-works-in-IE6" sites (a problem which took a decade to fix).

Additionally, this is leading web developers back into the old habit of using browser detection, resulting in vendor-specific websites, sometimes even used to promote a specific browser as being better, even though most modern browsers support the features in question. A few examples:

* [Angry Birds][2] (Chrome-branded)
* [Cut the Rope][3] (IE-branded; play is limited in other browsers)

And these sites aren't even on the mobile web (where WebKit-based browsers dominate, a factor that contributes to the problem) - they are right here at home on the desktop Internet, the same one that had this same problem long ago in the days of the original browser wars. Although Cut the Rope works fine in any modern HTML5 browser, you must download the latest version of Internet Explorer to gain access to all the levels. This is not exactly the same as the `-webkit-*` problem on the mobile web, but it is very similar and thus should also be watched out for.

Back in the old days, web developers would check for a certain browser to see if they should show a page with special content, which resulted in users of some browsers not being able to access content that their browser was capable of rendering just because the web developer only checked for one or two major browsers. Now, web developers are beginning to lazily fall back to this kind of browser detection instead of the much-more-accepted feature detection, a mistake that should be recognized by any modern web developer and is causing great harm to the open web.

However, I have not yet seen a valid fix to this problem. Many blog posts on [Planet Mozilla](http://planet.mozilla.org/) have proposed solutions to this problem, but many seem to lead to a solution that would still involve vendor/browser-related CSS properties. The only real solution here is to work with browser vendors and web developers to try to use standard CSS properties when applicable, and remove support for vendor-specific properties when the standards are released. When vendor-specific prefixes must be used, web developers should make sure to support `-moz-*`, `-ms-*`, `-o-*`, and any other prefixes in addition to just `-webkit-*`.

It is time that vendor-specific prefixes were put back to use the way they were originally intended - as prototypes of new features waiting for standardization. Perhaps the biggest problem is that the modern web is accelerating so rapidly that vendor prefixes no longer have a place for features that are stable enough to be used. However, how can we decide when a feature is ready? And, more importantly, how can we implement it in a standard way across all browsers? Keeping this in mind (especially the word "standard"), it may not be just the web browsers/developers - the standardization process might be able to use a bit of work, too. Everyone involved in the web must be prepared to accelerate development to continue to meet the demands of the accelerating modern web.

### Update
FYI: I'm not trying to blame the W3C or CSS WG - more the process by which browser vendors propose standards, or the stage in a CSS property's development when the vendor chooses to standardize it.

Also, In addition to the original article I linked to above, here is [another article][4] by the same author with some clarifications (and also [another one][5]).

[1]: http://www.glazman.org/weblog/dotclear/index.php?post/2012/02/09/CALL-FOR-ACTION%3A-THE-OPEN-WEB-NEEDS-YOU-NOW
[2]: http://chrome.angrybirds.com/
[3]: http://www.cuttherope.ie/
[4]: http://www.glazman.org/weblog/dotclear/index.php?post/2012/02/09/Some-clarifications
[5]: http://www.glazman.org/weblog/dotclear/index.php?post/2012/02/10/Blaming-CSS-WG-is-too-easy-Brendan