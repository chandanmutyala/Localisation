sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (Controller, JSONModel, Filter, FilterOperator) {
    "use strict";

    return Controller.extend("localisation.controller.sa", {

        onInit: function () {
            var oModel = new JSONModel();
            oModel.loadData("./model/data.json");
            this.getView().setModel(oModel, "countryModel");

            oModel.attachRequestCompleted(function () {
                var aCountryData = oModel.getProperty("/countries");
                var oColumnMapping = oModel.getProperty("/columnMapping");

                // Populate LOB ComboBox
                var aLOBOptions = oModel.getProperty("/lobOptions");
                this._populateComboBox("lobComboBox", aLOBOptions);

                // Populate Business Area ComboBox
                var aBusinessAreaOptions = oModel.getProperty("/businessAreaOptions");
                this._populateComboBox("businessAreaComboBox", aBusinessAreaOptions);

                // Populate Status ComboBox
                var aStatusOptions = oModel.getProperty("/statusOptions");
                this._populateComboBox("statusComboBox", aStatusOptions);

                // Bind MultiComboBox for Country
                if (Array.isArray(aCountryData)) {
                    var oComboBox = this.byId("countryComboBox");
                    aCountryData.forEach(function (oCountry) {
                        oComboBox.addItem(new sap.ui.core.Item({
                            key: oCountry.code,
                            text: oCountry.name
                        }));
                    });
                } else {
                    console.error("Country data is not an array.");
                }

                // Display all columns initially
                var oTable = this.byId("scopeItemsTable");
                var aColumns = oTable.getColumns();
                aColumns.forEach(function (oColumn) {
                    oColumn.setVisible(true);  // Set all columns visible initially
                });
            }.bind(this));
        },

        _populateComboBox: function (sComboBoxId, aOptions) {
            var oComboBox = this.byId(sComboBoxId);
            if (oComboBox && Array.isArray(aOptions)) {
                aOptions.forEach(function (sOption) {
                    oComboBox.addItem(new sap.ui.core.Item({
                        key: sOption,
                        text: sOption
                    }));
                });
            } else {
                console.error("Failed to populate ComboBox: " + sComboBoxId);
            }
        },
        onComboBoxSelectionChange: function () {
            var aFilters = [];

            // Get selected values from LOB ComboBox
            var aSelectedLOB = this.byId("lobComboBox").getSelectedKeys();
            if (aSelectedLOB.length > 0) {
                aFilters.push(new Filter("LOB", FilterOperator.Contains, aSelectedLOB));
            }

            // Get selected values from Business Area ComboBox
            var aSelectedBusinessArea = this.byId("businessAreaComboBox").getSelectedKeys();
            if (aSelectedBusinessArea.length > 0) {
                aFilters.push(new Filter("BusinessArea", FilterOperator.Contains, aSelectedBusinessArea));
            }

            // Get selected values from Status ComboBox
            var aSelectedStatus = this.byId("statusComboBox").getSelectedKeys();
            if (aSelectedStatus.length > 0) {
                aFilters.push(new Filter("Status", FilterOperator.Contains, aSelectedStatus));
            }

            // Combine all filters with AND operator
            var oCombinedFilter = new Filter({
                filters: aFilters,
                and: true
            });

            // Apply the filters to the table
            var oTable = this.byId("scopeItemsTable");
            var oBinding = oTable.getBinding("rows");  // Use "items" instead of "rows" if using sap.m.Table
            oBinding.filter(oCombinedFilter);
        },

        onCountrySelectionChange: function (oEvent) {
            var aSelectedKeys = oEvent.getSource().getSelectedKeys();
            var oTable = this.byId("scopeItemsTable");
            var aColumns = oTable.getColumns();
            var oColumnMapping = this.getView().getModel("countryModel").getProperty("/columnMapping");

            // Function to set column visibility based on selected keys
            var updateColumnVisibility = function () {
                var bAnyKeySelected = aSelectedKeys.length > 0;

                aColumns.forEach(function (oColumn, i) {
                    if (i >= 6) {  // Assuming country columns start from index 6
                        var sKey = Object.keys(oColumnMapping).find(function (key) {
                            return oColumnMapping[key] === i;
                        });

                        if (bAnyKeySelected) {
                            oColumn.setVisible(aSelectedKeys.includes(sKey));
                        } else {
                            oColumn.setVisible(true);  // Show all columns if no key is selected
                        }
                    }
                });
            };

            updateColumnVisibility();
        }
    });
});
