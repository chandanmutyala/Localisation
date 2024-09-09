

sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    function (Controller) {
        "use strict";

        return Controller.extend("localisation.controller.rms", {
            onInit: function () {

            },
            onNew: function () {
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("RouteCRMS");
            }


        });
    });
