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

// Chapter 9 Table 1
function CONDUCTOR_COUNT_TO_ALLOWED_CONDUIT_AREA_RATIO(count) {
    if (count < 1) return 0;
    if (count == 1) return 0.53;
    if (count == 2) return 0.31;
    return 0.40;
}

const CONDUIT_TYPES = ["EMT", "FMC", "PVC Sched. 40", "PVC Sched. 80", "IMC", "RMC", "LFMC", "LFNC-B", "LFNC-A", "ENT", "HDPE", "PVC Type A", "PVC Type EB"];
const CONDUIT_TRADE_SIZES = ["3/8", "1/2", "3/4", "1", "1 1/4", "1 1/2", "2", "2 1/2", "3", "3 1/2", "4", "5", "6"];

// Chapter 9 Table 4
const CONDUIT_TYPE_TO_TRADE_SIZE_TO_MM_AREA = {
    EMT: {
        "1/2":   196,
        "3/4":   343,
        "1":     556,
        "1 1/4": 968,
        "1 1/2": 1314,
        "2":     2165,
        "2 1/2": 3783,
        "3":     5701,
        "3 1/2": 7451,
        "4":     9521
    },
    ENT: {
        "1/2":   158,
        "3/4":   293,
        "1":     507,
        "1 1/4": 908,
        "1 1/2": 1250,
        "2":     2067
    },
    FMC: {
        "3/8":   74,
        "1/2":   204,
        "3/4":   343,
        "1":     527,
        "1 1/4": 824,
        "1 1/2": 1201,
        "2":     2107,
        "2 1/2": 3167,
        "3":     4560,
        "3 1/2": 6207,
        "4":     8104

    },
    IMC: {
        "1/2":   222,
        "3/4":   377,
        "1":     620,
        "1 1/4": 1064,
        "1 1/2": 1432,
        "2":     2341,
        "2 1/2": 3308,
        "3":     5115,
        "3 1/2": 6822,
        "4":     8725
    },
    "LFNC-B": {
        "3/8":   123,
        "1/2":   204,
        "3/4":   350,
        "1":     564,
        "1 1/4": 984,
        "1 1/2": 1276,
        "2":     2091
    },
    "LFNC-A": {
        "3/8":   125,
        "1/2":   201,
        "3/4":   346,
        "1":     552,
        "1 1/4": 968,
        "1 1/2": 1301,
        "2":     2157
    },
    LFMC: {
        "3/8":   123,
        "1/2":   204,
        "3/4":   350,
        "1":     564,
        "1 1/4": 984,
        "1 1/2": 1276,
        "2":     2091,
        "2 1/2": 3147,
        "3":     4827,
        "3 1/2": 6277,
        "4":     8187
    },
    RMC: {
        "1/2":   204,
        "3/4":   353,
        "1":     573,
        "1 1/4": 984,
        "1 1/2": 1333,
        "2":     2198,
        "2 1/2": 3137,
        "3":     4840,
        "3 1/2": 6461,
        "4":     8316,
        "5":     13050,
        "6":     18821
    },
    "PVC Sched. 40": {
        "1/2":   184,
        "3/4":   327,
        "1":     535,
        "1 1/4": 935,
        "1 1/2": 1282,
        "2":     2124,
        "2 1/2": 3029,
        "3":     4693,
        "3 1/2": 6277,
        "4":     8091,
        "5":     12748,
        "6":     18433
    },
    "PVC Sched. 80": {
        "1/2":   141,
        "3/4":   263,
        "1":     445,
        "1 1/4": 799,
        "1 1/2": 1104,
        "2":     1855,
        "2 1/2": 2660,
        "3":     4151,
        "3 1/2": 5608,
        "4":     7268,
        "5":     11518,
        "6":     16513
    },
    "PVC Type A": {
        "1/2":   249,
        "3/4":   419,
        "1":     697,
        "1 1/4": 1140,
        "1 1/2": 1500,
        "2":     2350,
        "2 1/2": 3515,
        "3":     5281,
        "3 1/2": 6896,
        "4":     8858
    },
    "PVC Type EB": {
        "2":     2498,
        "3":     5621,
        "3 1/2": 7329,
        "4":     9314,
        "5":     14314,
        "6":     20333
    }
};
CONDUIT_TYPE_TO_TRADE_SIZE_TO_MM_AREA["HDPE"] = CONDUIT_TYPE_TO_TRADE_SIZE_TO_MM_AREA["PVC Sched. 40"];

