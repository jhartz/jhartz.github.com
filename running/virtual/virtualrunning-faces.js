vr.options.faces = {
    "Gold": {
        url: "faces/gold.gif"
    },
    "Dumbledore": {
        url: "faces/dumbledore.jpg",
        boost: {
            name: "magic",
            strength: 10,
            uses: 4,
            addictive: false,
            sound: "boosts/magic.wav",
            image: "boosts/magic.png"
        }
    },
    "Karl": {
        url: "faces/action.jpg",
        locked: true,
        boost: {
            name: "coffee",
            strength: 8,
            uses: 5,
            addictive: true,  // if addictive, then after we use it too much, we become dependant on it and its effects are the opposite of "strength" (1/strength)
            sound: null,
            image: "boosts/coffee.png"
        }
    },
    "Wimberbury": {
        url: "faces/wimberbury.jpg",
        locked: true,
        boost: {
            name: "violin",
            strength: 5,
            uses: 8,
            addictive: false,
            sound: "boosts/violin.wav",
            image: "boosts/violin.png"
        }
    },
    "OH Canada": {
        url: "faces/ohcanada.jpg",
        locked: true,
        boost: {
            name: "OH CANADA",
            strength: 5,
            uses: 8,
            addictive: false,
            sound: "boosts/ohcanada.wav",
            image: "boosts/ohcanada.png"
        }
    }
};