"use strict";
(function () {
    window.formatNumber = number => {
        return parseFloat(number).toString().replace(".", ",");
    };

    window.formatMeasurement = (measuredProperty, measuredValue) => {
        switch (measuredProperty) {
            case "Temperature":
                return formatNumber(measuredValue);

            case "RelativeHumidity":
                return formatNumber(measuredValue);

            case "Motion":
                return measuredValue ? "Liikettä" : "Ei liikettä";

            case "OpenClosed":
                return measuredValue ? "Auki" : "Kiinni";

            case "Contact":
                return measuredValue ? "Auki" : "Kiinni";

            case "PresenceOfWater":
                return measuredValue ? "Vettä" : "Ei vettä";

            case "BatteryVoltage":
                return formatNumber(measuredValue);

            case "Rssi":
                return formatNumber(measuredValue);
            default:
                return measuredValue;
        }
    };

    window.formatTimestamp = timestamp => {
        var date = timestamp.getDate() + "." +  (timestamp.getMonth() + 1) + ".";
        var minutes = timestamp.getMinutes() < 10 ? "0" + timestamp.getMinutes() : timestamp.getMinutes();
        var time = "klo " + timestamp.getHours() + ":" + minutes;
    
        return date + " " + time;
    };
})();
