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

const FRAC = {
    "3/8": "⅜",
    "1/2": "½",
    "3/4": "¾"
};
const DEGREE = "°";
const LTE = "≤";

const UI = {
    init: function () {
        Object.keys(UI).filter(function (uiKey) {
            return typeof UI[uiKey].init == "function";
        }).forEach(function (uiKey) {
            UI[uiKey].init();
        });
    },

    main: {
        container: document.getElementById("main-container"),
        ambientTempDropdown: document.getElementById("ambient-temp"),
        conduitTypeDropdown: document.getElementById("conduit-type"),
        minimumConduitSize: document.getElementById("minimum-conduit-size"),
        circuitTable: document.getElementById("circuit-table"),
        addCircuitButton: document.getElementById("add-circuit-button"),

        init: function () {
            var self = this;

            AMBIENT_TEMP_RANGES.forEach(function (range, index) {
                var option = document.createElement("option");
                option.setAttribute("value", "" + index);
                option.textContent = range[0] + " " + DEGREE + "C / " + range[1] + " " + DEGREE + "F";
                self.ambientTempDropdown.appendChild(option);
            });
            self.ambientTempDropdown.addEventListener("change", function (event) {
                self.updateAmbientTempMultiplier();
            }, false);

            self.ambientTempDropdown.selectedIndex = DEFAULT_AMBIENT_TEMP_RANGE_INDEX;
            self.updateAmbientTempMultiplier();

            CONDUIT_TYPES.forEach(function (type) {
                var option = document.createElement("option");
                option.setAttribute("value", type);
                option.textContent = type;
                self.conduitTypeDropdown.appendChild(option);
            });
            self.conduitTypeDropdown.addEventListener("change", function (event) {
                self.updateConduitType();
            }, false);
            self.conduitTypeDropdown.selectedIndex = 0;
            self.updateConduitType();

            self.addCircuitButton.addEventListener("click", function (event) {
                event.preventDefault();

                self.hide();
                UI.addCircuit.show();
            }, false);
        },

        show: function () {
            this.container.style.display = "block";
        },

        hide: function () {
            this.container.style.display = "none";
        },

        updateAmbientTempMultiplier: function () {
            CALCULATION.ambientTempMultiplierByConductorTempRating =
                AMBIENT_TEMP_RANGE_INDEX_TO_MULTIPLIER_BY_TEMP_RATING[this.ambientTempDropdown.selectedIndex];
            doCalculation();
        },

        updateConduitType: function () {
            CALCULATION.conduitType = this.conduitTypeDropdown.value;
            doCalculation();
        },

        updateCircuits: function () {
            var self = this;

            clear(self.circuitTable);

            // TODO ...

            doCalculation();
        },

        setConduitSize: function (tradeSize) {
            this.minimumConduitSize.textContent = tradeSize.split(" ").map(function (part) {
                if (FRAC.hasOwnProperty(part)) return FRAC[part];
                return part;
            }).join(" ");
        }
    },

    addEgc: {
        checkbox: document.getElementById("add-egc"),
        container: document.getElementById("add-egc-container"),
        typeDropdown: document.getElementById("add-egc-type"),
        materialCuRadio: document.getElementById("add-egc-material-cu"),
        materialAlRadio: document.getElementById("add-egc-material-al"),
        sizeDropdown: document.getElementById("add-egc-size"),

        isEnabled: false,

        init: function () {
            var self = this;

            initConductorTypeDropdown(self.typeDropdown, function (type) {
                // Make sure we have at least one of this type's available sizes
                // (for both Cu and Al)
                var sizes = CONDUCTOR_TYPE_TO_SIZES[type];
                for (var i = 0; i < sizes.length; i++) {
                    if (EGC_CU_SIZE_TO_MAX_BREAKER.hasOwnProperty(sizes[i]) &&
                        EGC_AL_SIZE_TO_MAX_BREAKER.hasOwnProperty(sizes[i])) {
                        return true;
                    }
                }
                return false;
            });
            self.typeDropdown.selectedIndex = 0;
            self.updateSizes();

            self.checkbox.addEventListener("click", function (event) {
                self.updateVisibility();
            }, false);

            [self.typeDropdown, self.materialCuRadio, self.materialAlRadio].forEach(function (elem) {
                elem.addEventListener("click", function (event) {
                    self.updateSizes();
                }, false);
            });

            self.sizeDropdown.addEventListener("click", function (event) {
                self.updateCalculation();
            }, false);

            self.checkbox.checked = false;
            self.updateVisibility();
        },

        updateVisibility: function () {
            var self = this;
            if (self.checkbox.checked) {
                self.container.style.display = "inline";
            } else {
                self.container.style.display = "none";
            }

            self.isEnabled = self.checkbox.checked;
            self.updateCalculation();
        },

        updateSizes: function () {
            var self = this;

            clear(self.sizeDropdown);

            var sizeToMaxBreaker = {};
            if (self.materialCuRadio.checked) {
                sizeToMaxBreaker = EGC_CU_SIZE_TO_MAX_BREAKER;
            } else if (self.materialAlRadio.checked) {
                sizeToMaxBreaker = EGC_AL_SIZE_TO_MAX_BREAKER;
            }

            var type = self.typeDropdown.value;
            var typeRegistry = CONDUCTOR_TYPE_TO_SIZE_TO_MM_AREA[type];

            CONDUCTOR_SIZES.filter(function (size) {
                return sizeToMaxBreaker.hasOwnProperty(size) && typeRegistry.hasOwnProperty(size);
            }).forEach(function (size) {
                var option = document.createElement("option");
                option.setAttribute("value", size);
                option.textContent = size + " (max. circuit " + LTE + " " + sizeToMaxBreaker[size] + " amps)";
                self.sizeDropdown.appendChild(option);
            });

            self.sizeDropdown.selectedIndex = 0;
            self.updateCalculation();
        },

        updateCalculation: function () {
            var self = this;

            if (self.isEnabled) {
                CALCULATION.mmAreas.egc = CONDUCTOR_TYPE_TO_SIZE_TO_MM_AREA[self.typeDropdown.value][self.sizeDropdown.value];
            } else {
                CALCULATION.mmAreas.egc = 0;
            }

            doCalculation();
        }
    },

    addCircuit: {
        container: document.getElementById("add-circuit-container"),
        nameInput: document.getElementById("add-circuit-name"),
        conductorTable: document.getElementById("add-circuit-conductor-table"),
        addButton: document.getElementById("add-circuit-add"),
        cancelButton: document.getElementById("add-circuit-cancel"),

        conductors: [],

        init: function () {
            var self = this;

            self.addButton.addEventListener("click", function (event) {
                event.preventDefault();

                // TODO ...
            }, false);

            self.cancelButton.addEventListener("click", function (event) {
                event.preventDefault();

                self.hide();
                UI.main.show();
            }, false);
        },

        show: function () {
            var self = this;

            self.nameInput.value = "";
            self.conductors = [];
            self.updateConductorTable();

            self.container.style.display = "block";
        },

        hide: function () {
            this.container.style.display = "none";
        },

        updateConductorTable: function () {
            var self = this;

            clear(self.conductorTable);

            // TODO ...
        }
    },

    addConductor1: {
        form: document.getElementById("add-conductor-1-form"),
        colorInput: document.getElementById("add-conductor-1-color"),
        typeDropdown: document.getElementById("add-conductor-1-type"),
        materialCuRadio: document.getElementById("add-conductor-1-material-cu"),
        materialAlRadio: document.getElementById("add-conductor-1-material-al"),
        amperageInput: document.getElementById("add-conductor-1-amperage"),
        cccCheckbox: document.getElementById("add-conductor-1-ccc"),

        init: function () {
            var self = this;

            initConductorTypeDropdown(self.typeDropdown);

            self.form.addEventListener("submit", function (event) {
                event.preventDefault();

                // TODO ...
            }, false);
        }
    },

    addConductor2: {
        form: document.getElementById("add-conductor-2-form"),
        colorInput: document.getElementById("add-conductor-2-color"),
        typeDropdown: document.getElementById("add-conductor-2-type"),
        sizeDropdown: document.getElementById("add-conductor-2-size"),
        cccCheckbox: document.getElementById("add-conductor-2-ccc"),

        init: function () {
            var self = this;

            initConductorTypeDropdown(self.typeDropdown);

            // Update UI.addConductor2.size whenever UI.addConductor2.type changes
            self.typeDropdown.addEventListener("change", function (event) {
                self.updateSizes();
            }, false);
            // Start it off with the first conductor type
            self.typeDropdown.selectedIndex = 0;
            self.updateSizes();

            self.form.addEventListener("submit", function (event) {
                event.preventDefault();

                // TODO ...
            }, false);
        },

        updateSizes: function () {
            var self = this;

            clear(self.sizeDropdown);

            var type = self.typeDropdown.value;
            CONDUCTOR_TYPE_TO_SIZES[type].forEach(function (size) {
                var option = document.createElement("option");
                option.setAttribute("value", size);
                option.textContent = size;
                self.sizeDropdown.appendChild(option);
            });
            self.sizeDropdown.selectedIndex = 0;
        }
    }
};

function initConductorTypeDropdown(typeDropdown, filter) {
    var optgroup = null;
    ALL_CONDUCTOR_TYPES.forEach(function (type) {
        if (type === null) {
            if (optgroup) {
                typeDropdown.appendChild(optgroup);
            }
            optgroup = null;
        } else if (optgroup === null) {
            optgroup = document.createElement("optgroup");
            optgroup.setAttribute("label", type);
        } else if (typeof filter != "function" || filter(type)) {
            var option = document.createElement("option");
            option.setAttribute("value", type);
            option.textContent = type;
            optgroup.appendChild(option);
        }
    });
    if (optgroup) {
        typeDropdown.appendChild(optgroup);
    }
}

function clear(elem) {
    while (elem.firstChild) elem.removeChild(elem.firstChild);
}

