/*
    Copyright (c) 2013, Jake Hartz. All rights reserved.
    Use of this source code is governed by a BSD-style license
    that can be found in the LICENSE.txt file.
*/

// NOTE: Update manifest.appcache when you update this file

vr.options.courses = {
    "Track": {
        background: "bg/track.jpg",
        imgsize: 55,  // width and height of image (px)
        start: [1135, 655],
        startrotation: 180,
        flipX: true,
        path: [
            {
                type: "bezier",
                distance: 50,  // virtual meters
                data: {
                    start: {
                        x: 1135,
                        y: 655,
                        angle: 40,
                        length: 1/2,
                        rotation: 180
                    },
                    end: {
                        x: 1510,
                        y: 380,
                        angle: -51,
                        rotation: 90
                    }
                }
            },
            {
                type: "bezier",
                distance: 50,
                data: {
                    start: {
                        x: 1510,
                        y: 380,
                        angle: 46,
                        rotation: 90
                    },
                    end: {
                        x: 1150,
                        y: 70,
                        angle: -36,
                        length: 1/2,
                        rotation: 0
                    }
                }
            },
            {
                type: "line",
                distance: 50,
                virtualdistance: 40,  // what we should pretend it is when doing rate/time calculations
                data: {
                    x: 800,
                    y: 70
                }
            },
            {
                type: "line",
                distance: 50,
                virtualdistance: 40,
                data: {
                    x: 440,
                    y: 70
                }
            },
            {
                type: "bezier",
                distance: 50,
                data: {
                    start: {
                        x: 440,
                        y: 70,
                        angle: 35,
                        rotation: 360
                    },
                    end: {
                        x: 39,
                        y: 368,
                        angle: -46,
                        length: 1/2,
                        rotation: 272
                    }
                }
            },
            {
                type: "bezier",
                distance: 50,
                data: {
                    start: {
                        x: 39,
                        y: 368,
                        angle: 54,
                        rotation: 272
                    },
                    end: {
                        x: 390,
                        y: 657,
                        angle: -40,
                        length: 1/2,
                        rotation: 180
                    }
                }
            },
            {
                type: "line",
                distance: 50,
                virtualdistance: 40,
                blastoffStart: true,
                data: {
                    x: 790,
                    y: 656
                }
            },
            {
                type: "line",
                distance: 50,
                virtualdistance: 40,
                data: {
                    x: 1135,
                    y: 655
                }
            },
            {
                type: "bezier",
                distance: 5,
                final: true,
                data: {
                    start: {
                        x: 1135,
                        y: 655,
                        angle: 220,
                        rotation: 180
                    },
                    end: {
                        x: 1170,
                        y: 655,
                        angle: 220,
                        rotation: 340
                    }
                }
            },
            {
                type: "bezier",
                distance: 5,
                final: true,
                data: {
                    flipX: false,
                    start: {
                        x: 1170,
                        y: 655,
                        angle: 220,
                        rotation: -20
                    },
                    end: {
                        x: 1210,
                        y: 662,
                        angle: 220,
                        rotation: 3
                    }
                }
            }
        ]
    },
    
    "Cliffs": {
        background: "bg/cliff.jpg",
        imgsize: 30,
        controls: {
            align: "top",
            theme: "light",
            css: {
                margin: "5px",
                left: "22%"
            }
        },
        start: [1473, 70],
        startrotation: 90,
        path: [
            {
                type: "line",
                distance: 160,
                virtualdistance: 110,
                data: {
                    x: 1449,
                    y: 450
                }
            },
            {
                type: "bezier",
                distance: 90,
                data: {
                    start: {
                        x: 1449,
                        y: 450,
                        angle: -49,
                        rotation: 90
                    },
                    end: {
                        x: 1100,
                        y: 659,
                        angle: 25,
                        rotation: 175
                    }
                }
            },
            {
                type: "line",
                distance: 150,
                data: {
                    x: 460,
                    y: 687
                }
            },
            {
                type: "bezier",
                distance: 60,
                data: {
                    start: {
                        x: 460,
                        y: 687,
                        angle: 14,
                        rotation: 175
                    },
                    end: {
                        x: 160,
                        y: 698,
                        angle: 10,
                        length: 1/5,
                        rotation: 270
                    }
                }
            },
            {
                type: "bezier",
                distance: 70,
                virtualdistance: 200,
                data: {
                    start: {
                        x: 160,
                        y: 687,
                        angle: -10,
                    },
                    end: {
                        x: 210,
                        y: 470,
                        angle: -20,
                        length: 2/3
                    }
                }
            },
            {
                type: "bezier",
                distance: 30,
                virtualdistance: 200,
                data: {
                    start: {
                        x: 210,
                        y: 470,
                        angle: -8,
                        rotation: -90
                    },
                    end: {
                        x: 315,
                        y: 364,
                        angle: 25,
                        rotation: -30
                    }
                }
            },
            {
                type: "bezier",
                distance: 10,
                virtualdistance: 25,
                data: {
                    start: {
                        x: 315,
                        y: 364,
                        angle: 0,
                        rotation: -30
                    },
                    end: {
                        x: 325,
                        y: 368,
                        angle: 0,
                        rotation: 10
                    }
                }
            },
            {
                type: "line",
                distance: 30,
                blastoffStart: true,
                data: {
                    x: 460,
                    y: 387
                }
            },
            {
                type: "bezier",
                distance: 40,
                data: {
                    start: {
                        x: 460,
                        y: 387,
                        angle: 15,
                        rotation: 10
                    },
                    end: {
                        x: 650,
                        y: 364,
                        angle: -15,
                        rotation: -21
                    }
                }
            },
            {
                type: "line",
                distance: 120,
                data: {
                    x: 1120,
                    y: 190
                }
            },
            {
                type: "bezier",
                distance: 28,
                data: {
                    start: {
                        x: 1120,
                        y: 190,
                        angle: 9,
                        rotation: -21
                    },
                    end: {
                        x: 1160,
                        y: 150,
                        angle: -6,
                        rotation: -83
                    }
                }
            },
            {
                type: "line",
                distance: 30,
                data: {
                    x: 1168,
                    y: 80
                }
            },
            {
                type: "bezier",
                distance: 11,
                data: {
                    start: {
                        x: 1168,
                        y: 80,
                        angle: -70,
                        rotation: -83
                    },
                    end: {
                        x: 1199,
                        y: 70,
                        angle: 50,
                        rotation: 5
                    }
                }
            },
            {
                type: "line",
                distance: 30,
                data: {
                    x: 1330,
                    y: 80
                }
            },
            {
                type: "bezier",
                distance: 36,
                data: {
                    start: {
                        x: 1330,
                        y: 80,
                        angle: 10,
                        rotation: 5
                    },
                    end: {
                        x: 1443,
                        y: 60,
                        angle: 40,
                        rotation: 10,
                        length: 1/8
                    }
                }
            },
            {
                type: "bezier",
                distance: 10,
                data: {
                    start: {
                        x: 1443,
                        y: 60,
                        angle: -20,
                        rotation: 10
                    },
                    end: {
                        x: 1473,
                        y: 70,
                        angle: 0,
                        rotation: 90
                    }
                }
            },
            {
                type: "bezier",
                distance: 40,
                final: true,
                data: {
                    start: {
                        x: 1473,
                        y: 70,
                        angle: -60,
                        rotation: 90
                    },
                    end: {
                        x: 1373,
                        y: 76,
                        angle: -130,
                        rotation: 0
                    }
                }
            }
        ]
    }
};