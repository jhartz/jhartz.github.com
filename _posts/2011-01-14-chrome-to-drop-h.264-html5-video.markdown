---
layout: post
title: Chrome to drop H.264 HTML5 video (and my views on Theora (Ogg) vs. VP8 (WebM) vs. H.264 (MP4))
excerpt: "Google is saying that it is going to drop native H.264 video support from Chrome in a motion to boost open codecs (mostly VP8/WebM)."
---
As some of you have probably heard many times (at least anyone who is subscribed to [Planet Mozilla](http://planet.mozilla.org/), where I saw at least 5 posts about it in a row), Google is saying that it is going to drop native H.264 video support from Chrome. (Just an FYI: H.264 is the video codec used in MP4 videos, why is why this is relevant.) In this case, we are talking about HTML5 video, the new way for browsers to embed video inside web pages without requiring Flash. There are 3 main codecs that are considered by browsers:

- **[H.264](http://en.wikipedia.org/wiki/H.264)**: This is a proprietary codec from [MPEG-LA](http://en.wikipedia.org/wiki/MPEG_LA). As the most common video codec used in the MPEG-4 container format (MP4, M4V, etc.), it is in use in many places today. Safari, Chrome, and Internet Explorer 9 (beta) currently support it in HTML5 &lt;video&gt; tags (although Chrome is supposedly dropping support for this codec soon).
- **[Theora](http://en.wikipedia.org/wiki/Theora)**: As one of the first open, royalty-free codecs for video, the Theora codec (usually used with the open [Vorbis](http://en.wikipedia.org/wiki/Vorbis) audio codec in an [Ogg](http://en.wikipedia.org/wiki/Ogg) container) was popular among supporters of open software, but it never really caught on with mainstream users. Firefox, Chrome, and Opera currently support it with HTML5 video.
- **[VP8](http://en.wikipedia.org/wiki/VP8)** ([WebM](http://en.wikipedia.org/wiki/WebM)): The VP8 codec was originally developed by On2 Technologies until Google acquired them in 2010. Then, Google open-sourced the codec and made it royalty-free to make it more appealing to free software users and developers. VP8 is usually contained inside the [WebM](http://en.wikipedia.org/wiki/WebM) format (which was developed by Google and uses VP8 for video and [Vorbis](http://en.wikipedia.org/wiki/Vorbis) for audio). The WebM format has made a *huge* leap in its first year, and is now just as popular (if not more than) the Theora codec and Ogg format. YouTube has started using WebM on its site, pushing the format even more. WebM is currently supported in Firefox, Chrome, and Opera.

### My Feelings on Theora and VP8/WebM vs. H.264

Well, considering MP4 Downloader is tied with H.264, I have to say that the codec itself is pretty good. It works well, and offers good compression. However, it is not completely royalty-free, and although MPEG-LA has royalty-free licensing for web video that uses H.264 (in most cases), it doesn't have to stay this way, and there is nothing to say that they will keep this way in the future. On the other side of the field, users of open codecs like Theora and VP8 don't have to worry about royalty payments or patents. In terms of quality and compression, here are my thoughts: Although Theora is a codec that has been under development for a while, and it is pretty mature by now, its compression still isn't as great as VP8 and H.264. (In some circumstances, Theora's image quality is better, but it is not very good at balancing that with good compression and file size.) Now, to the VP8 codec... It looks like a great possibility, and it might have a great future. However, VP8 is new, so it has all the shortcomings that all new products have, among them user experience and integration. One of the great things about H.264 is that copious devices, including mobile devices (smartphones, iPods, etc.), desktop computers, and many more can decode H.264 quickly because they can tap into the hardware to help. It will be a while until VP8 gets this capability (at least until hardware developers embrace it and add hardware decoding support to their products), so here H.264 has the leg up in that it has been around for a while. So, in the end, I think that, although VP8 is a good codec, it will be a while until it is accepted by the market, and, in the meantime, H.264 is not going to go anywhere (and Theora still has a bit of work to do).

### So what does this all mean?

Chrome is dropping H.264 support for HTML5 video. This means that the only browsers still using H.264 for HTML5 &lt;video&gt; tags are Safari and Internet Explorer 9 beta. The other 3 browsers in the top 5 (Chrome, Firefox, and Opera) are supporting open standards, including Theora (Ogg) and VP8 (WebM). Personally, I think the future here lies in WebM, considering that its speed, quality, and compression have a better chance at competing with H.264. However, H.264 isn't going anywhere for a long time. Of these codecs, H.264 is the best in terms of Flash support, and many sites will continue to use Flash to display videos. Also, most video-sharing sites are not inclined to re-encoding their entire video library to WebM (and supporting only WebM would alienate devices (like the iPod/iPhone/iPad and other mobile phones) that can only play H.264 video). So, in the end, Chrome is taking a big step towards supporting a free video codec (which is something I am very happy for, despite what it may sound like I'm implying here), but this doesn't mean H.264 will disappear. However, maybe we can continue to support free standards step-by-step and eventually WebM will be the codec of choice for all web developers.

<!-- see more -->

### Other Views (and Other News)

Official announcement: [Chromium Blog: HTML Video Codec Support in Chrome](http://blog.chromium.org/2011/01/html-video-codec-support-in-chrome.html)

Flash/Theora/VP8/H.264:

- [Flash, Google, VP8, and the future of internet video](http://x264dev.multimedia.cx/archives/292)
- [The Great Codec War](http://quetzalcoatal.blogspot.com/2011/01/great-codec-war.html)

Split decisions (and a nice recap): [The backlash over Google's HTML5 video bet](http://news.cnet.com/8301-30684_3-20028361-265.html)

Backlash: [Microsoft Lashes Google for Dropping H.264](http://www.pcmag.com/article2/0,2817,2375719,00.asp)

Different Views:

- [On Chrome Dropping H.264](http://robert.accettura.com/blog/2011/01/11/on-chrome-dropping-h-264/)
- [Why Google was correct in Chrome dropping H.264](http://www.arpitonline.com/blog/2011/01/11/why-google-was-correct-in-chrome-dropping-of-h-264/)
- [Why On Earth Is Google Chrome Dropping H.264](http://www.socialtimes.com/2011/01/google-chrome-h264/) (looks at it from a different view)
