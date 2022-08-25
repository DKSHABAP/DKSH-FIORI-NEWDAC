sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"../model/formatter",
	"sap/ui/core/routing/History",
	"sap/m/MessageToast"
], function (Controller, JSONModel, formatter, History, MessageToast) {
	"use strict";

	return Controller.extend("com.incture.cherrywork.newdac.controller.PermissionObjectMaster", {
		formatter: formatter,
		onInit: function () {
			sap.ui.core.UIComponent.getRouterFor(this).attachRoutePatternMatched(this._onRouteMatched, this);
		},

		_onRouteMatched: function (oEvent) {
			/*	    if (oEvent.getParameters().name === "masterView") {*/
			/*	var aPOModel = new JSONModel();
				this.getView().setModel(aPOModel,"aPOModel");*/
			var that = this;
			jQuery.ajax({
				type: "GET",
				contentType: "application/json",
				url: "/DKSHJavaService/permissionObject/findAllPermissionObjects?pageNo=0&pageSize=1000",
				// url: "/DKSHJavaService/dac/getAllPermissionObjects",
				dataType: "json",
				async: false,
				success: function (data, textStatus, jqXHR) {
					that.getOwnerComponent().getModel("aPOModel").setSizeLimit(1000);
					that.getOwnerComponent().getModel("aPOModel").setData(data);
					that.onUpdateFinished();
				}
			});
			/*}*/
		},

		getRouter: function () {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},
		onAfterRendering: function () {
			this.i18nModel = this.getView().getModel("i18n");
		},
		onUpdateFinished: function (oEvent) {
			var that = this;
			var aHistory = sap.ui.core.routing.History.getInstance().aHistory;
			//	var pid = this.getView().getModel("aPOModel").getData()[0].permissionId;
			var pid = this.getOwnerComponent().getModel("aPOModel").getData()[0].permissionObjectGuid + "|" + this.getOwnerComponent().getModel(
				"aPOModel").getData()[0].permissionObjectText.replace(/\//g, "~");
			if (aHistory[aHistory.length - 1] === "masterView" || aHistory[aHistory.length - 2] === "masterView") {
				this.getRouter().navTo("detailViewP", {
					pid: pid
				});
			}
		},
		onListPress: function (oEvent) {
			var aPath = parseInt(oEvent.getSource().getBindingContextPath().split("/")[1]);
			//	var pid = this.getView().getModel("aPOModel").getData()[aPath].permissionId;
			// var pid = this.getOwnerComponent().getModel("aPOModel").getData()[aPath].permissionId;
			var pid = this.getOwnerComponent().getModel("aPOModel").getData()[aPath].permissionObjectGuid + "|" + this.getOwnerComponent().getModel(
				"aPOModel").getData()[aPath].permissionObjectText.replace(/\//g, "~");
			this.getRouter().navTo("detailViewP", {
				pid: pid
			});
		},

		onCreate: function () {
			var domainModel = new JSONModel();
			this.getView().setModel(domainModel, "domainModel");
			var that = this;
			jQuery.ajax({
				type: "GET",
				contentType: "application/json",
				url: "/DKSHJavaService/domainText/list",
				dataType: "json",
				async: false,
				success: function (data, textStatus, jqXHR) {
					that.getView().getModel("domainModel").setProperty("/items", data);
					// if (!that.createFrag)
					that.createFrag = sap.ui.xmlfragment("com.incture.cherrywork.newdac.fragments.createFrag", that);
					that.createFrag.open();
					that.createFrag.setModel(that.getView().getModel("domainModel"), "domainModel");
				}
			});
		},
		onCreateDomainSelect: function (oEvent) {
			var domainModel = this.getView().getModel("domainModel");
			var selectedText = oEvent.getParameters().selectedItem.getProperty("text");
			var selectedKey = oEvent.getParameters().selectedItem.getProperty("key");
			domainModel.getData().domainName = selectedKey;
			domainModel.refresh();
			var that = this;
			jQuery.ajax({
				type: "GET",
				contentType: "application/json",
				url: "/DKSHJavaService/attributeDetails/findByDomainCode/" + selectedText,
				dataType: "json",
				async: false,
				success: function (data, textStatus, jqXHR) {
					that.getView().getModel("domainModel").setProperty("/attributes", data);
				}
			});

		},
		onOkCreateFrag: function () {
			var domainModel = this.getView().getModel("domainModel");
			var paths = this.createFrag.mAggregations.content[3]._aSelectedPaths;
			var attributesModel = new JSONModel();
			sap.ui.getCore().setModel(attributesModel, "attributesModel");
			attributesModel.getData().allItems = domainModel.getData().attributes;
			attributesModel.getData().items = [];
			if (paths.length > 0) {
				for (var i = 0; i < paths.length; i++) {
					attributesModel.getData().items.push(domainModel.getProperty(paths[i]));
				}
				attributesModel.refresh();
				domainModel.setData();
				this.createFrag.close();
				this.fnMasterFilter("");
				this.getView().byId("mastIdSearch").setValue("");
				this.getRouter().navTo("CreatePermissionObject");
			} else {
				sap.m.MessageToast.show("Select atleast one item to Proceed");
			}
			// this.createFrag.close();
		},
		onCancelCreateFrag: function () {
			this.getView().getModel("domainModel").setData();
			this.createFrag.close();
		},
		fnMasterFilter: function (oEvent) {
			if (oEvent)
				var value = oEvent.getParameters().newValue;
			else
				var value = "";
			var filters = [];
			var oFilter = new sap.ui.model.Filter([new sap.ui.model.Filter("permissionObjectText", sap.ui.model.FilterOperator.Contains, value),
				new sap.ui.model.Filter("domainCode", sap.ui.model.FilterOperator.Contains, value)
			]);
			filters.push(oFilter);
			var oBinding = this.getView().byId("ShortProductList").getBinding("items");
			oBinding.filter(filters);
		},
		onNavBack: function () {
			this.fnMasterFilter("");
			this.getView().byId("mastIdSearch").setValue("");
			this.getRouter().navTo("RouteUserProv");
			//	this.getAllUsers();
			var oModelRef = new sap.ui.model.json.JSONModel({
				refreshUser: true
			});
			sap.ui.getCore().setModel(oModelRef, "refreshUserModel");
		}

	});

});