/*
    Copyright (c) 2013, Jake Hartz. All rights reserved.
    Use of this source code is governed by a BSD-style license
    that can be found in the LICENSE.txt file.
*/

// NOTE: Update manifest.appcache when you update this file

/*
    "name": {
        action: string,    // name of action
        strength: number,  // higher strength = more of a boost, but fewer uses (pick a value BETWEEN 0 and 10)
        image: string,     // url of image to show while boost is being used
        sound: array       // list of urls of sound to play while boost is being used (multiple URLs for different audio formats)
    }
*/

vr.options.boosts = {
    "magic": {
        action: "Use Magic",
        strength: 9,
        image: "boosts/magic.png",
        sound: ["boosts/magic.wav"]
    },
    
    "coffee": {
        action: "Drink Coffee",
        strength: 7,
        image: "boosts/coffee.png"
    },
    
    "violin": {
        action: "Play Music",
        strength: 5,
        image: "boosts/violin.png",
        sound: ["boosts/violin.wav"]
    },
    
    "syrup": {
        action: "Drink Syrup",
        strength: 5,
        image: "boosts/canada.png",
        sound: ["boosts/canada.wav"]
    }
};