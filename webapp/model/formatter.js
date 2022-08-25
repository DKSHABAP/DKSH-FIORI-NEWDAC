jQuery.sap.require("sap.ca.ui.model.format.DateFormat");
jQuery.sap.require("sap.ca.ui.model.format.NumberFormat");
sap.ui.define([], function () {
	"use strict";

	return {

		//for f4 code and desc
		f4ValueBind: function (val1, val2) {
			if (val1 && val2) {
				return val1 + " (" + val2 + ")";
			} else if (val1 && !val2) {
				return val1;
			} else if (!val1 && val2) {
				return val2;
			} else {
				return "";
			}
		},

		//table change mode
		TableModeChange: function (value1) {
			if (value1) {
				//return "MultiSelect";
				return "None";
			} else {
				return "None";
			}
		},

		//for create button
		CreateButtonVisible: function (val1) {
			if (val1 === "Create") {
				return true;
			} else {
				return false;
			}
		},

		//for update button
		updateeButtonVisible: function (val1) {
			if (val1 === "Update") {
				return true;
			} else {
				return false;
			}
		},
		lengthVisible: function (value) {
			if (value && value.length > 0)
				return true;
			return false;
		},
		panelVisible: function (value) {
			if (value)
				return true;
			return false;
		},
		switchState: function (value) {
			if (value && value.length == 0)
				return true;
			return false;
		}
	};
});