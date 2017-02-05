/*
 * Conduit Calculator
 * Copyright 2017 Jake Hartz
 *
 * Source code is licensed under the Modified BSD license:
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice,
 *    this list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *
 * 3. Neither the name of the copyright holder nor the names of its
 *    contributors may be used to endorse or promote products derived from this
 *    software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */

// Based on the 2011 NEC

// Table 310.104(A)
const TEMP_RATING_TO_CONDUCTOR_TYPES = {
    60: ["TW", "UF"],
    75: ["RHW", "THHW", "THW", "THWN", "XHHW", "USE", "ZW"],
    90: ["TBS", "SA", "SIS", "FEP", "FEPB", "MI", "RHH", "RHW-2", "THHN", "THHW", "THW-2", "THWN-2", "USE-2", "XHH", "XHHW", "XHHW-2", "ZW-2"]
};

const CONDUCTOR_TYPE_TO_TEMP_RATING = {};
Object.keys(TEMP_RATING_TO_CONDUCTOR_TYPES).forEach(function (temp) {
    TEMP_RATING_TO_CONDUCTOR_TYPES[temp].forEach(function (conductor) {
        CONDUCTOR_TYPE_TO_TEMP_RATING[conductor] = temp;
    });
});

const CONDUCTOR_SIZES = [
    "#18", "#16", "#14", "#12", "#10", "#8",
    "#6", "#4", "#3", "#2", "#1",
    "1/0", "2/0", "3/0", "4/0",
    "250", "300", "350", "400", "500",
    "600", "700", "750", "800", "900",
    "1000", "1250", "1500", "1750", "2000"
];

const TABLE_310_15_B_16 = {
//  AWG or   Cu   Cu   Cu   Al   Al   Al
//  kcmil    60C  75C  90C  60C  75C  90C
    "#18":  [0,   0,   14,  0,   0,   0   ],
    "#16":  [0,   0,   18,  0,   0,   0   ],
    "#14":  [15,  20,  25,  0,   0,   0   ],
    "#12":  [20,  25,  30,  15,  20,  25  ],
    "#10":  [30,  35,  40,  25,  30,  35  ],
    "#8":   [40,  50,  55,  35,  40,  45  ],

    "#6":   [55,  65,  75,  40,  50,  55  ],
    "#4":   [70,  85,  95,  55,  65,  75  ],
    "#3":   [85,  100, 115, 65,  75,  85  ],
    "#2":   [95,  115, 130, 75,  90,  100 ],
    "#1":   [110, 130, 145, 85,  100, 115 ],

    "1/0":  [125, 150, 170, 100, 120, 135 ],
    "2/0":  [145, 175, 195, 115, 135, 150 ],
    "3/0":  [165, 200, 225, 130, 155, 175 ],
    "4/0":  [195, 230, 260, 150, 180, 205 ],

    "250":  [215, 255, 290, 170, 205, 230 ],
    "300":  [240, 285, 320, 195, 230, 260 ],
    "350":  [260, 310, 350, 210, 250, 280 ],
    "400":  [280, 335, 380, 225, 270, 305 ],
    "500":  [320, 380, 430, 260, 310, 350 ],

    "600":  [350, 420, 475, 285, 340, 385 ],
    "700":  [385, 460, 520, 315, 375, 425 ],
    "750":  [400, 475, 535, 320, 385, 435 ],
    "800":  [410, 490, 555, 330, 395, 445 ],
    "900":  [435, 520, 585, 355, 425, 480 ],

    "1000": [455, 545, 615, 375, 445, 500 ],
    "1250": [495, 590, 665, 405, 485, 545 ],
    "1500": [525, 625, 705, 435, 520, 585 ],
    "1750": [545, 650, 735, 455, 545, 615 ],
    "2000": [555, 665, 750, 470, 560, 630 ]
};

const TEMP_RATING_TO_AMPACITIES_AND_CU_SIZES = {60: [], 75: [], 90: []};
const TEMP_RATING_TO_AMPACITIES_AND_AL_SIZES = {60: [], 75: [], 90: []};
CONDUCTOR_SIZES.forEach(function (size) {
    var row = TABLE_310_15_B_16[size];
    TEMP_RATING_TO_AMPACITIES_AND_CU_SIZES[60].push([row[0], size]);
    TEMP_RATING_TO_AMPACITIES_AND_CU_SIZES[75].push([row[1], size]);
    TEMP_RATING_TO_AMPACITIES_AND_CU_SIZES[90].push([row[2], size]);

    TEMP_RATING_TO_AMPACITIES_AND_AL_SIZES[60].push([row[3], size]);
    TEMP_RATING_TO_AMPACITIES_AND_AL_SIZES[75].push([row[4], size]);
    TEMP_RATING_TO_AMPACITIES_AND_AL_SIZES[90].push([row[5], size]);
});

// Table 250.122
const EGC_CU_SIZE_TO_MAX_BREAKER = {
    "#14": 15,
    "#12": 20,
    "#10": 60,
    "#8": 100,

    "#6": 200,
    "#4": 300,
    "#3": 400,

    "#2": 500,
    "#1": 600,
    "1/0": 800

    // etc.
};
const EGC_AL_SIZE_TO_MAX_BREAKER = {
    "#12": 15,
    "#10": 20,
    "#8": 60,
    "#6": 100,

    "#4": 200,
    "#2": 300,
    "#1": 400,

    "1/0": 500,
    "2/0": 600,
    "3/0": 800

    // etc.
};

const TABLE_310_15_B_2_a = [
    // degrees C    degrees F       60      75      90
    ["10 or less",  "50 or less",   1.29,   1.20,   1.15],
    ["11-15",       "51-59",        1.22,   1.15,   1.12],
    ["16-20",       "60-68",        1.15,   1.11,   1.08],
    ["21-25",       "69-77",        1.08,   1.05,   1.04],
    ["26-30",       "78-86",        1.00,   1.00,   1.00],
    ["31-35",       "87-95",        0.91,   0.94,   0.96],
    ["36-50",       "96-104",       0.82,   0.88,   0.91],
    ["41-45",       "105-113",      0.71,   0.82,   0.87],
    ["46-50",       "114-122",      0.58,   0.75,   0.82],
    ["51-55",       "123-131",      0.41,   0.67,   0.76],
    ["56-60",       "132-140",      0,      0.58,   0.71],
    ["61-65",       "141-149",      0,      0.47,   0.65],
    ["66-70",       "150-158",      0,      0.33,   0.58],
    ["71-75",       "159-167",      0,      0,      0.50],
    ["76-80",       "168-176",      0,      0,      0.41],
    ["81-85",       "177-185",      0,      0,      0.29]
];

const AMBIENT_TEMP_RANGES = TABLE_310_15_B_2_a.map(function (row) {
    return row.slice(0, 2);
});
const DEFAULT_AMBIENT_TEMP_RANGE_INDEX = 4; // ["26-30", "78-86"]
const AMBIENT_TEMP_RANGE_INDEX_TO_MULTIPLIER_BY_TEMP_RATING = TABLE_310_15_B_2_a.map(function (row) {
    return {
        60: row[2],
        75: row[3],
        90: row[4]
    };
});

// Table 310.15(B)(3)(a)
function CCC_COUNT_TO_MULTIPLIER(count) {
    if (count <= 3)  return 1.0;
    if (count <= 6)  return 0.8;
    if (count <= 9)  return 0.7;
    if (count <= 20) return 0.5;
    if (count <= 30) return 0.45;
    if (count <= 40) return 0.4;
    return 0.35;
}

// Chapter 9 Table 5
const CONDUCTOR_TYPE_TO_SIZE_TO_MM_AREA = {};
// These are the most common conductors, so we make sure they're at the top
// "null" indicates a separator, and is followed by a label
const ALL_CONDUCTOR_TYPES = [
    null, "Common Types", "THHN", "THWN-2", "XHHW", "XHHW-2",
    null, "Other Types (Ch. 9 Table 5)"
];
function registerConductors(types, sizesToMmArea) {
    var registry = CONDUCTOR_TYPE_TO_SIZE_TO_MM_AREA;
    types.forEach(function (type) {
        if (ALL_CONDUCTOR_TYPES.indexOf(type) == -1) {
            ALL_CONDUCTOR_TYPES.push(type);
        }
        if (!registry.hasOwnProperty(type)) {
            registry[type] = {};
        }
        Object.keys(sizesToMmArea).forEach(function (size) {
            registry[type][size] = sizesToMmArea[size];
        });
    });
}

// p. 70-716
registerConductors(["RFH-2", "FFH-2"], {
    "#18":  9.355,
    "#16":  11.10
});
registerConductors(["RHH", "RHW", "RHW-2"], {
    "#14":  18.90,
    "#12":  22.77,
    "#10":  28.19,
    "#8":   53.87,
    "#6":   67.16,
    "#4":   86.00,
    "#3":   98.13,
    "#2":   112.9,
    "#1":   171.6,
    "1/0":  196.1,
    "2/0":  226.1,
    "3/0":  262.7,
    "4/0":  306.7,
    "250":  405.9,
    "300":  457.3,
    "350":  507.7,
    "400":  556.5,
    "500":  650.5,
    "600":  782.9,
    "700":  874.9,
    "750":  920.8,
    "800":  965.0,
    "900":  1057,
    "1000": 1143,
    "1250": 1515,
    "1500": 1738,
    "1750": 1959,
    "2000": 2175
});
registerConductors(["SF-2", "SFF-2"], {
    "#18":  7.419,
    "#16":  8.968,
    "#14":  11.10
});
registerConductors(["SF-1", "SFF-1"], {
    "#18":  4.194
});
registerConductors(["RFH-1", "XF", "XFF"], {
    "#18":  5.161
});
registerConductors(["TF", "TFF", "XF", "XFF"], {
    "#16":  7.032
});
registerConductors(["TW", "XF", "XFF", "THHW", "THW", "THW-2"], {
    "#14":  8.968
});

// p. 70-717
registerConductors(["TW", "THHW", "THW", "THW-2"], {
    "#12":  11.68,
    "#10":  15.68,
    "#8":   28.19
});
registerConductors(["RHH (without outer covering)", "RHW (without outer covering)", "RHW-2 (without outer covering)"], {
    "#14":  13.48
});
registerConductors(["RHH (without outer covering)", "RHW (without outer covering)", "RHW-2 (without outer covering)", "XF", "XFF"], {
    "#12":  16.77
});

registerConductors(["RHH (without outer covering)", "RHW (without outer covering)", "RHW-2 (without outer covering)", "XF", "XFF"], {
    "#10":  21.48
});
registerConductors(["RHH (without outer covering)", "RHW (without outer covering)", "RHW-2 (without outer covering)"], {
    "#8":   35.87
});
registerConductors(["TW", "THW", "THHW", "THW-2", "RHH (without outer covering)", "RHW (without outer covering)", "RHW-2 (without outer covering)"], {
    "#6":   46.84,
    "#4":   62.77,
    "#3":   73.16,
    "#2":   86.00,
    "#1":   122.6,
    "1/0":  143.4,
    "2/0":  169.3,
    "3/0":  201.1,
    "4/0":  239.9,
    "250":  296.5,
    "300":  340.7,
    "350":  384.4,
    "400":  427.0,
    "500":  509.7,
    "600":  627.7,
    "700":  710.3,
    "750":  751.7,
    "800":  791.7,
    "900":  874.9,
    "1000": 953.8,
    "1250": 1200,
    "1500": 1400,
    "1750": 1598,
    "2000": 1795
});
registerConductors(["TFN", "TFFN"], {
    "#18":  3.548,
    "#16":  4.645
});

// p. 70-718
registerConductors(["THHN", "THWN", "THWN-2"], {
    "#14":  6.258,
    "#12":  8.581,
    "#10":  13.61,
    "#8":   23.61,
    "#6":   32.71,
    "#4":   53.16,
    "#3":   62.77,
    "#2":   74.71,
    "#1":   100.8,
    "1/0":  119.7,
    "2/0":  143.4,
    "3/0":  172.8,
    "4/0":  208.8,
    "250":  256.1,
    "300":  297.3
});

registerConductors(["THHN", "THWN", "THWN-2"], {
    "350":  338.2,
    "400":  378.3,
    "500":  456.3,
    "600":  559.7,
    "700":  637.9,
    "750":  677.2,
    "800":  715.2,
    "900":  794.3,
    "1000": 869.5
});
registerConductors(["PF", "PGFF", "PGF", "PFF", "PTF", "PAF", "PTFF", "PAFF"], {
    "#18":  3.742,
    "#16":  4.839
});
registerConductors(["PF", "PGFF", "PGF", "PFF", "PTF", "PAF", "PTFF", "PAFF", "TFE", "FEP", "PFA", "FEPB", "PFAH"], {
    "#14":  6.452
});
registerConductors(["TFE", "FEP", "PFA", "FEPB", "PFAH"], {
    "#12":  8.839,
    "#10":  12.32,
    "#8":   21.48,
    "#6":   30.19,
    "#4":   43.23,
    "#3":   51.87,
    "#2":   62.77
});
registerConductors(["TFE", "PFAH"], {
    "#1":   90.26
});
registerConductors(["TFE", "PFA", "PFAH", "Z"], {
    "1/0":  108.1,
    "2/0":  130.8,
    "3/0":  158.9,
    "4/0":  193.5
});
registerConductors(["ZF", "ZFF"], {
    "#18":  2.903,
    "#16":  3.935
});

// p. 70-719
registerConductors(["Z", "ZF", "ZFF"], {
    "#14":  5.355
});
registerConductors(["Z"], {
    "#12":  7.548,
    "#10":  12.32,
    "#8":   19.48,
    "#6":   27.74,
    "#4":   40.32,
    "#3":   55.16,
    "#2":   66.39,
    "#1":   81.87
});

registerConductors(["XHHW", "ZW", "XHHW-2", "XHH"], {
    "#14":  8.968,
    "#12":  11.68,
    "#10":  15.68,
    "#8":   28.19,
    "#6":   38.06,
    "#4":   52.52,
    "#3":   62.06,
    "#2":   73.94
});
registerConductors(["XHHW", "XHHW-2", "XHH"], {
    "#1":   98.97,
    "1/0":  117.7,
    "2/0":  141.3,
    "3/0":  170.5,
    "4/0":  206.3,
    "250":  251.9,
    "300":  292.6,
    "350":  333.3,
    "400":  373.0,
    "500":  450.6,
    "600":  561.9,
    "700":  640.2,
    "750":  679.5,
    "800":  717.5,
    "900":  796.8,
    "1000": 872.2,
    "1250": 1108,
    "1500": 1300,
    "1750": 1492,
    "2000": 1682
});
registerConductors(["KF-2", "KFF-2"], {
    "#18":  2.000,
    "#16":  2.839,
    "#14":  4.129,
    "#12":  6.000,
    "#10":  8.968
});
registerConductors(["KF-1", "KFF-1"], {
    "#18":  1.677,
    "#16":  2.387,
    "#14":  3.548,
    "#12":  5.355,
    "#10":  8.194
});

// Chapter 9 Table 5A
ALL_CONDUCTOR_TYPES.push(null);
ALL_CONDUCTOR_TYPES.push("Compact Types (Ch. 9 Table 5A)");
registerConductors(["Compact RHH (without outer covering)", "Compact RHW (without outer covering)", "Compact USE"], {
    "#8":   34.25,
    "#6":   44.10,
    "#4":   56.84,
    "#2":   77.03,
    "#1":   109.5,
    "1/0":  126.6,
    "2/0":  147.8,
    "3/0":  176.3,
    "4/0":  207.6,
    "250":  259.0,
    "300":  296.5,
    "350":  332.3,
    "400":  370.5,
    "500":  438.2,
    "600":  542.8,
    "700":  613.1,
    "750":  652.8,
    "900":  779.3,
    "1000": 836.6
});
registerConductors(["Compact THW", "Compact THHW"], {
    "#8":   32.90,
    "#6":   42.58,
    "#4":   56.84,
    "#2":   77.03,
    "#1":   109.5,
    "1/0":  126.6,
    "2/0":  150.5,
    "3/0":  176.3,
    "4/0":  210.8,
    "250":  266.3,
    "300":  304.3,
    "350":  340.7,
    "400":  379.1,
    "500":  447.7,
    "600":  558.6,
    "700":  624.3,
    "750":  670.1,
    "900":  759.1,
    "1000": 836.6
});
registerConductors(["Compact THHN"], {
    "#6":   29.16,
    "#4":   47.10,
    "#2":   65.61,
    "#1":   87.23,
    "1/0":  102.6,
    "2/0":  124.1,
    "3/0":  147.7,
    "4/0":  179.4,
    "250":  227.4,
    "300":  262.6,
    "350":  300.4,
    "400":  336.5,
    "500":  396.8,
    "600":  491.6,
    "700":  558.6,
    "750":  585.5,
    "900":  722.5,
    "1000": 798.1
});
registerConductors(["Compact XHHW"], {
    "#8":   25.42,
    "#6":   34.19,
    "#4":   47.10,
    "#2":   65.61,
    "#1":   87.23,
    "1/0":  102.6,
    "2/0":  121.6,
    "3/0":  147.7,
    "4/0":  176.3,
    "250":  220.7,
    "300":  259.0,
    "350":  292.6,
    "400":  324.3,
    "500":  392.4,
    "600":  486.6,
    "700":  558.6,
    "750":  602.0,
    "900":  692.3,
    "1000": 766.6
});

const CONDUCTOR_TYPE_TO_SIZES = {};
ALL_CONDUCTOR_TYPES.forEach(function (type, index, arr) {
    if (type === null || arr[index - 1] === null) return;

    var typeRegistry = CONDUCTOR_TYPE_TO_SIZE_TO_MM_AREA[type];
    var sizes = (CONDUCTOR_TYPE_TO_SIZES[type] = []);
    CONDUCTOR_SIZES.forEach(function (size) {
        if (typeRegistry.hasOwnProperty(size)) {
            sizes.push(size);
        }
    });
});

