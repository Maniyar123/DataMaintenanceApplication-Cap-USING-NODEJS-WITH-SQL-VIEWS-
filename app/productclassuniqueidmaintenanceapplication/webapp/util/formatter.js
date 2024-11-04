// webapp/util/formatter.js
sap.ui.define([], function() {
    "use strict";
    return {
        formatDate: function(date) {
            if (date) {
                const oDate = new Date(date);
                return oDate.toISOString().split("T")[0]; // Returns date in "YYYY-MM-DD" format
            }
            return "";
        }
    };
});
