sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"com/incture/cherrywork/newdac/model/models"
], function (UIComponent, Device, models) {
	"use strict";

	return UIComponent.extend("com.incture.cherrywork.newdac.Component", {

		metadata: {
			manifest: "json",
			config: {
				fullWidth: true
			}
		},

		oApiModel: {},
		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function () {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// enable routing
			this.getRouter().initialize();

			// set the device model
			this.setModel(models.createDeviceModel(), "device");
		},

		/** 
		 * Get API model
		 * @param sModel string API model key
		 * @param sURI string URI string
		 * @param bSync boolean force reload
		 * @returns Promise GET response data
		 */
		getApiModel: function (sModel, sURI, bSync) {
			var oModel = new sap.ui.model.json.JSONModel();
			var fnLoadModel = function (sURL, oParameters) {
				return new Promise(function (fnResolve) {
					oModel.loadData(sURL, oParameters).then(
						function () {
							fnResolve(oModel.getData());
						}
					).catch(
						function (oError) {
							fnResolve({});
						}
					);
				});
			};
			if (bSync) {
				this.oApiModel[sModel] = null;
			}
			if (!this.oApiModel[sModel]) {
				this.oApiModel[sModel] = new Promise(
					function (fnResolve, fnReject) {
						var aPromise = [];
						oModel.loadData(sURI).then(
							function () {
								var oData = oModel.getData();
								for (var i = oData.Resources.length + 1; i <= oData.totalResults; i += oData.Resources.length) {
									aPromise.push(
										fnLoadModel(sURI, {
											startIndex: i
										})
									);
								}
								if (aPromise.length > 0) {
									Promise.allSettled(aPromise).then(function (aResult) {
										aResult.forEach(
											function (oResult, iI) {
												if (oResult.status === "fulfilled") {
													oData.Resources = oData.Resources.concat(oResult.value.Resources);
												}
											}
										);
										fnResolve(oData);
									});
								} else {
									fnResolve(oData);
								}
							}
						).catch(
							function (oError) {
								fnReject(oError);
							}
						);
					}
				);
			}
			return this.oApiModel[sModel];
		},

		/** 
		 * Get API model by ID
		 * @param sModel string API model key
		 * @param sURI string URI string
		 * @param bSync boolean force reload
		 * @returns Promise GET response data
		 */
		getApiModelById: function (sModel, sURI, bSync) {
			var oModel = new sap.ui.model.json.JSONModel();
			var fnLoadModel = function (sURL, oParameters) {
				var aResponse = [];
				return new Promise(function (fnResolve) {
					oModel.loadData(sURL, oParameters).then(
						function () {
							var oResponse = oModel.getData();
							aResponse.push(oResponse);
							if (oResponse.nextId === "end") {
								fnResolve(aResponse);
							} else {
								fnLoadModel(sURL, {
									startId: oResponse.nextId
								}).then(function (aSub) {
									aResponse = aResponse.concat(aSub);
									fnResolve(aResponse);
								});
							}
						}
					).catch(
						function (oError) {
							fnResolve(aResponse);
						}
					);
				});
			};
			if (bSync) {
				this.oApiModel[sModel] = null;
			}
			if (!this.oApiModel[sModel]) {
				this.oApiModel[sModel] = fnLoadModel(sURI, {
					startId: "initial"
				});
			}
			return this.oApiModel[sModel];
		},

		/** 
		 * @public
		 * @override
		 */
		destroy: function () {
			this.oApiModel = {};
			UIComponent.prototype.destroy.apply(this, arguments);
		}
	});
});