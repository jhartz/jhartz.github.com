/*
    Copyright (c) 2013, Jake Hartz. All rights reserved.
    Use of this source code is governed by a BSD-style license
    that can be found in the LICENSE.txt file.
*/

// NOTE: Update manifest.appcache when you update this file

/*
    "name": {
        action: string,     // name of action
        strength: number,   // higher strength = more of a boost, but fewer uses (pick a value BETWEEN 1 and 8)
        addictive: boolean, // if true, then after the boost is used too much, the user becomes dependant on it and its effects are the opposite of "strength" (1/strength)
        sound: string,      // url of sound to play while boost is being used
        image: string       // url of image to show while boost is being used
    }
*/

vr.options.boosts = {
    "magic": {
        action: "Use Magic",
        strength: 7,
        sound: "boosts/magic.wav",
        image: "boosts/magic.png"
    },
    
    "coffee": {
        action: "Drink Coffee",
        strength: 5,
        addictive: true,
        image: "boosts/coffee.png"
    },
    
    "violin": {
        action: "Play Music",
        strength: 3,
        sound: "boosts/violin.wav",
        image: "boosts/violin.png"
    },
    
    "syrup": {
        action: "Drink Syrup",
        strength: 3,
        sound: "boosts/canada.wav",
        image: "boosts/canada.png"
    }
};