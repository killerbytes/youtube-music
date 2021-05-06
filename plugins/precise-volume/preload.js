const { ipcRenderer } = require("electron");

// Override specific listeners of volume-slider by modifying Element.prototype
function overrideAddEventListener() {
    // Events to ignore
    const nativeEvents = ["mousewheel", "keydown", "keyup"];
    // Save native addEventListener
    Element.prototype._addEventListener = Element.prototype.addEventListener;
    // Override addEventListener to Ignore specific events in volume-slider
    Element.prototype.addEventListener = function (type, listener, useCapture = false) {
        if (this.id === "volume-slider" || this.id === "expand-volume-slider") { // id of both volume sliders
            for (const eventType of nativeEvents) {
                if (eventType === type) {
                    return;
                }
            }
        }//else
        this._addEventListener(type, listener, useCapture);
    };
}

module.exports = () => {
    overrideAddEventListener();
    // Restore original function after did-finish-load to avoid keeping Element.prototype altered
    ipcRenderer.once("restoreAddEventListener", () => { //called from Main to make sure page is completly loaded
        Element.prototype.addEventListener = Element.prototype._addEventListener;
    });
};
