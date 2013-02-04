/*
    Copyright (c) 2013, Jake Hartz. All rights reserved.
    Use of this source code is governed by a BSD-style license
    that can be found in the LICENSE.txt file.
*/

// NOTE: Update manifest.appcache when you update this file

vr.options.boosts = {
    "magic": {
        strength: 10,
        uses: 4,
        addictive: false,
        sound: "boosts/magic.wav",
        image: "boosts/magic.png"
    },
    
    "coffee": {
        strength: 8,
        uses: 5,
        addictive: true,  // if addictive, then after we use it too much, we become dependant on it and its effects are the opposite of "strength" (1/strength)
        sound: null,
        image: "boosts/coffee.png"
    },
    
    "violin": {
        strength: 5,
        uses: 8,
        addictive: false,
        sound: "boosts/violin.wav",
        image: "boosts/violin.png"
    },
    
    "canada": {
        strength: 5,
        uses: 8,
        addictive: false,
        sound: "boosts/canada.wav",
        image: "boosts/canada.png"
    }
};