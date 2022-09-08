sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"../model/formatter",
	"sap/m/MessageBox",
	"sap/ui/model/json/JSONModel"
], function (Controller, formatter, MessageBox, JSONModel) {
	"use strict";

	return Controller.extend("com.incture.cherrywork.newdac.controller.Create", {
		formatter: formatter,

		// TEMP-TEST 18082022 (begin)
		garrGroupsOri: [],
		gvarItemAll: "",
		gvarItemCounts: "",
		// TEMP-TEST 18082022 (end)

		onInit: function () {
			var router = sap.ui.core.UIComponent.getRouterFor(this);
			router.attachRoutePatternMatched(this._handleRouteMatched, this);
		},

		_handleRouteMatched: function (oEvent) {
			if (oEvent.getParameter("name") === "Create") {
				var oPOUserTabModel = new JSONModel();
				this.getView().byId("idPODisp").setModel(oPOUserTabModel, "oPOUserTabModel");
				var oPOTabModel = new JSONModel();
				this.getView().setModel(oPOTabModel, "oPOTabModel");
				if (sap.ui.getCore().getModel("UpdateCreateUserModelSet") === undefined) {
					var router = sap.ui.core.UIComponent.getRouterFor(this);
					router.navTo("RouteUserProv");
					return;
				}
				this.getView().byId("ID_TAB_BAR_PROV_APP").setSelectedKey("UserDetailsKey");

				var modelCreateUpd = sap.ui.getCore().getModel("UpdateCreateUserModelSet").getData();
				var indUpdCre = sap.ui.getCore().getModel("UpdateCreateIndModel").getData();
				// this.getPOofUser(modelCreateUpd.id);
				//for hiding buttons
				var oModelIndB = new sap.ui.model.json.JSONModel(JSON.parse(JSON.stringify(indUpdCre)));
				this.getView().setModel(oModelIndB, "UpdateCreateIndModelViewSet");

				if (indUpdCre.UpdateCreateInd === "Create") {
					this.getView().byId("ID_USER_PROV_CRT").setTitle("Create User");
					this.bindingTableDataForAllSenario(modelCreateUpd, "C");
				} else if (indUpdCre.UpdateCreateInd === "Update") {
					this.getView().byId("ID_USER_PROV_CRT").setTitle("Update (" + modelCreateUpd.id + ")");
					this.bindingTableDataForAllSenario(modelCreateUpd, "U");
				} else {
					this.getView().byId("ID_USER_PROV_CRT").setTitle("Display (" + modelCreateUpd.id + ")");
					this.bindingTableDataForAllSenario(modelCreateUpd, "D");
				}
				this.onPressPobjectPanel(false);
				var oModelSalsOrg = new sap.ui.model.json.JSONModel(JSON.parse(JSON.stringify(modelCreateUpd)));
				this.getView().byId("ID_PROV_SIMF_USER_DET").setModel(oModelSalsOrg, "UserModelSet");
			}
		},

		//on after rendering
		onAfterRendering: function () {
			this.i18nModel = this.getView().getModel("i18n");
			this.oModel = this.getView().getModel("SalesOrganization");
			this.oModelMaterial = this.getView().getModel("MaterialModel");

			this.getCountryList();

			// TEMP-TEST 18082022 (begin)
			this.getGroupList();
			// var startIndex = 0;
			// this.onHandleGroupList(startIndex);
			// TEMP-TEST 18082022 (end)
		},

		//all table Data binding
		bindingTableDataForAllSenario: function (Data, Ind) {
			//set defauld expanded false
			this.expandOrCollapaseAllPanel(false);

			//declaration
			var temp_SalesOrgSwitch = false;
			var temp_CustomerSwitch = false;
			var temp_MaterialNumSwitch = false;
			var temp_DistribuChanlSwitch = false;
			var temp_MaterialGrpSwitch = false;
			var temp_MaterialGrpOneSwitch = false;
			var temp_MaterialGrp4Switch = false;
			var temp_DistrictSwitch = false;

			//variable diclaration 
			var salesOrg = [];
			var custNum = [];
			var distriChanne = [];
			var district = [];
			var materialGrp = [];
			var materialGrpOne = [];
			var materialGrp4 = [];
			var materialNum = [];
			var plant = [];
			var storloc = [];
			var country = [];
			var ordertype = [];
			var materialGrp2 = [];
			var materialGrp3 = [];
			var materialGrp5 = [];
			var prodhierarchy1 = [];
			var prodhierarchy2 = [];
			var prodhierarchy3 = [];
			var prodhierarchy4 = [];
			var prodhierarchy5 = [];
			var prodhierarchy6 = [];
			var prodhierarchy7 = [];
			var cusgrp = [];
			var cusgrp1 = [];
			var cusgrp2 = [];
			var cusgrp3 = [];
			var cusgrp4 = [];
			var cusgrp5 = [];
			var district1 = [];
			var material = [];

			if (Ind !== "C") {

				//sales organization
				for (var i = 0; i < Data.SalesOrganization.length; i++) {
					salesOrg.push({
						"SalesOrg": Data.SalesOrganization[i]
					});
				}
				if (salesOrg.length === 1 && salesOrg[0].SalesOrg.trim() === "*") {
					temp_SalesOrgSwitch = true;
					salesOrg = [];
				}

				//customer
				for (var i = 0; i < Data.CustomerNumber.length; i++) {
					custNum.push({
						"CustCode": Data.CustomerNumber[i]
					});
				}
				if (custNum.length === 1 && custNum[0].CustCode.trim() === "*") {
					temp_CustomerSwitch = true;
					custNum = [];
				}

				//Distribution Channel

				for (var i = 0; i < Data.DistributionChannel.length; i++) {
					distriChanne.push({
						"DistChl": Data.DistributionChannel[i]
					});
				}

				if (distriChanne.length === 1 && distriChanne[0].DistChl.trim() === "*") {
					temp_DistribuChanlSwitch = true;
					distriChanne = [];
				}

				//for District 
				for (var i = 0; i < Data.District.length; i++) {
					district.push({
						"Division": Data.District[i]
					});
				}

				if (district.length === 1 && district[0].Division.trim() === "*") {
					temp_DistrictSwitch = true;
					district = [];
				}

				//material group
				for (var i = 0; i < Data.MaterialGroup.length; i++) {
					materialGrp.push({
						"Materialgroup": Data.MaterialGroup[i]
					});
				}
				if (materialGrp.length === 1 && materialGrp[0].Materialgroup.trim() === "*") {
					temp_MaterialGrpSwitch = true;
					materialGrp = [];
				}

				//material group One
				for (var i = 0; i < Data.MaterialGroupOne.length; i++) {
					materialGrpOne.push({
						"MaterialGroup1": Data.MaterialGroupOne[i]
					});

				}

				if (materialGrpOne.length === 1 && materialGrpOne[0].MaterialGroup1.trim() === "*") {
					temp_MaterialGrpOneSwitch = true;
					materialGrpOne = [];
				}

				//material group 4
				for (var i = 0; i < Data.MaterialGroup4.length; i++) {
					materialGrp4.push({
						"Materialgroup4": Data.MaterialGroup4[i]
					});

				}

				if (materialGrp4.length === 1 && materialGrp4[0].Materialgroup4.trim() === "*") {
					temp_MaterialGrp4Switch = true;
					materialGrp4 = [];
				}

				//end if
			}

			//sales organization
			var oModelSalsOrg = new sap.ui.model.json.JSONModel({
				results: salesOrg
			});
			oModelSalsOrg.setSizeLimit(salesOrg.length);
			this.getView().byId("ID_TBL_VIEW_PROV_SELS_ORG").setModel(oModelSalsOrg, "SlaesOrgViewSet");

			//for customer
			var oModelCustModel = new sap.ui.model.json.JSONModel({
				results: custNum
			});
			oModelCustModel.setSizeLimit(custNum.length);
			this.getView().byId("ID_TBL_VIEW_PROV_CUST_NUM").setModel(oModelCustModel, "CustomerNumViewSet");

			//for material number
			var oModelMatNumber = new sap.ui.model.json.JSONModel({
				results: materialNum
			});
			oModelMatNumber.setSizeLimit(materialNum.length);
			this.getView().byId("ID_TBL_VIEW_PROV_MATERIAL_NUM").setModel(oModelMatNumber, "MaterialNumViewSet");

			//for distribution channel

			var oModelDistri = new sap.ui.model.json.JSONModel({
				results: distriChanne
			});
			oModelDistri.setSizeLimit(distriChanne.length);
			this.getView().byId("ID_TBL_VIEW_PROV_DISTRU_CHANL").setModel(oModelDistri, "DistributionChannelViewSet");

			//for material group
			var oModelMatGroup = new sap.ui.model.json.JSONModel({
				results: materialGrp
			});
			oModelMatGroup.setSizeLimit(materialGrp.length);
			this.getView().byId("ID_TBL_VIEW_PROV_MAT_GRP_").setModel(oModelMatGroup, "MaterialGrpViewSet");

			//for material group one
			var oModelMatGroupOne = new sap.ui.model.json.JSONModel({
				results: materialGrpOne
			});
			oModelMatGroupOne.setSizeLimit(materialGrpOne.length);
			this.getView().byId("ID_TBL_VIEW_PROV_MAT_GRP_ONE").setModel(oModelMatGroupOne, "MaterialGrpOneViewSet");

			//for material group 4
			var oModelMatGroup4 = new sap.ui.model.json.JSONModel({
				results: materialGrp4
			});
			oModelMatGroup4.setSizeLimit(materialGrp4.length);
			this.getView().byId("ID_TBL_VIEW_PROV_MAT_GRP_4").setModel(oModelMatGroup4, "MaterialGrp4ViewSet");

			//for District
			var oModelDistrict = new sap.ui.model.json.JSONModel({
				results: district
			});
			oModelDistrict.setSizeLimit(district.length);
			this.getView().byId("ID_TBL_VIEW_PROV_DISTRICT").setModel(oModelDistrict, "DistrictViewSet");

			/*   	var oModelCountry = new sap.ui.model.json.JSONModel({
				results: country
			});
			oModelCountry.setSizeLimit(country.length);
			this.getView().byId("ID_TBL_VIEW_PROV_COUNTRY").setModel(oModelCountry, "CountryViewSet");*/

			//for all selected true / false
			var omodelSwitch = new sap.ui.model.json.JSONModel({
				SalesOrgSwitch: temp_SalesOrgSwitch,
				CustomerSwitch: temp_CustomerSwitch,
				MaterialNumSwitch: temp_MaterialNumSwitch,
				DistribuChanlSwitch: temp_DistribuChanlSwitch,
				MaterialGrpSwitch: temp_MaterialGrpSwitch,
				MaterialGrpOneSwitch: temp_MaterialGrpOneSwitch,
				MaterialGrp4Switch: temp_MaterialGrp4Switch,
				DistrictSwitch: temp_DistrictSwitch
			});
			this.getView().setModel(omodelSwitch, "SwitchOnOffSet");

			var msg1 = this.i18nModel.getProperty("salesOrganizationCountLbl");
			this.getView().byId("ID_PROV_LBL_C_SALS_ORG").setText(msg1 + " (" + salesOrg.length + ")");

			var msg2 = this.i18nModel.getProperty("customerLblCount");
			this.getView().byId("ID_PROV_LBL_C_CUST_NUM").setText(msg2 + " (" + custNum.length + ")");

			var msg3 = this.i18nModel.getProperty("materialNumberCountLbl");
			this.getView().byId("ID_PROV_LBL_C_Mat_NUM").setText(msg3 + " (" + materialNum.length + ")");

			var msg4 = this.i18nModel.getProperty("distributionChannelCountLbl");
			this.getView().byId("ID_PROV_LBL_C_DISTRI_CHNL").setText(msg4 + " (" + distriChanne.length + ")");

			var msg5 = this.i18nModel.getProperty("materialGroupCountLbl");
			this.getView().byId("ID_PROV_LBL_C_MAT_GRP").setText(msg5 + " (" + materialGrp.length + ")");

			var msg6 = this.i18nModel.getProperty("materialGroupOneCountLbl");
			this.getView().byId("ID_PROV_LBL_C_MAT_GRP_ONE").setText(msg6 + " (" + materialGrpOne.length + ")");

			var msg6 = this.i18nModel.getProperty("materialGroup4CountLbl");
			this.getView().byId("ID_PROV_LBL_C_MAT_GRP_4").setText(msg6 + " (" + materialGrp4.length + ")");

			var msg7 = this.i18nModel.getProperty("distrcitCountLbl");
			this.getView().byId("ID_PROV_LBL_C_MAT_DISTRCT").setText(msg7 + " (" + district.length + ")");

		},

		//back from Create
		onBackFromCreateToUser: function () {
			var router = sap.ui.core.UIComponent.getRouterFor(this);
			router.navTo("RouteUserProv");
		},

		//function to fetch the country list
		getCountryList: function () {
			var that = this;
			var oURL = "/IDPService/md/md/countries";
			var oModel = new sap.ui.model.json.JSONModel();
			var oData = "";
			var oDataArr = [];
			var oBusyDialog = new sap.m.BusyDialog();
			oBusyDialog.open();
			oModel.loadData(oURL, true, "GET", false, false);
			oModel.attachRequestCompleted(function (oEvent) {
				oBusyDialog.close();
				if (oEvent.getParameter("success")) {
					oData = oEvent.getSource().getData();
					for (var i = 0; i < Object.keys(oData).length; i++) {
						oDataArr.push({
							key: Object.keys(oData)[i],
							desc: oData[Object.keys(oData)[i]]
						});
					}
					var oCountryModel = new sap.ui.model.json.JSONModel({
						results: oDataArr
					});
					oCountryModel.setSizeLimit(oDataArr.length);
					that.getView().setModel(oCountryModel, "oCountryModel");
				}
			});
			oModel.attachRequestFailed(function (oEvent) {
				oBusyDialog.close();
				var sMsg = oEvent.getParameters().responseText;
				sap.m.MessageBox.error(sMsg, {
					styleClass: "sapUiSizeCompact"
				});
			});
		},

		// TEMP-TEST 18082022 (begin)
		onHandleGroupList: function (oStartIndex) {
			var that = this;
			this.onFetchGroupList(oStartIndex, function (oResponse) {
				if (oResponse.callfunction === "success") {
					var oStartIndexNext;
					var aData = oResponse.datareturn;
					var totalItem = aData.totalResults;
					var resource = aData.Resources;
					var lastIndexResrc = resource.length;

					if (that.garrGroupsOri.length === 0) {
						that.gvarItemAll = totalItem;
						that.garrGroupsOri = resource;
						that.gvarItemCounts = lastIndexResrc + 1;
						that.onHandleGroupList(that.gvarItemCounts);
					} else {
						that.gvarItemCounts = that.gvarItemCounts + lastIndexResrc;
						if (that.garrGroupsOri.length < parseInt(that.gvarItemAll, 10) && that.garrGroupsOri.length !== parseInt(that.gvarItemAll, 10)) {
							for (var i = 0; i < resource.length; i++) {
								that.garrGroupsOri.push(resource[i]);
								if (resource.length === i + 1) {
									oStartIndexNext = that.gvarItemCounts;
									if (that.garrGroupsOri.length === parseInt(that.gvarItemAll, 10)) {
										var oArrayGroup = JSON.parse(JSON.stringify(that.garrGroupsOri));
										// Here modify check array users call function 
										that.onBindGroupList(oArrayGroup);
									} else {
										that.onHandleGroupList(oStartIndexNext);
									}
								}
							}
						}
					}
				} else if (oResponse.callfunction === "error") {
					sap.m.MessageToast.show("Test Error in Retrieving All Users");
				}
			});
		},
		// TEMP-TEST 18082022 (end)

		// TEMP-TEST 18082022 (begin)
		onBindGroupList: function (oArrayGroup) {
			var that = this;
			var finalData = [];
			for (var i = 0; i < oArrayGroup.length; i++) {
				var oKey = oArrayGroup[i]["urn:sap:cloud:scim:schemas:extension:custom:2.0:Group"].name;
				if (oKey.startsWith("DKSH-API") === false) {
					finalData.push({
						key: oArrayGroup[i]["urn:sap:cloud:scim:schemas:extension:custom:2.0:Group"].name,
						desc: oArrayGroup[i]["urn:sap:cloud:scim:schemas:extension:custom:2.0:Group"].description
					});
				}
			}
			var groupModel = new sap.ui.model.json.JSONModel({
				results: finalData
			});
			groupModel.setSizeLimit(finalData.length);
			that.getView().setModel(groupModel, "GroupModelSet");
		},
		// TEMP-TEST 18082022 (end)

		// TEMP-TEST 18082022 (begin)
		onFetchGroupList: function (oStartIndex, oCallback) {
			// Refer URL : 1."/IDPService/service/scim/Groups" 2."/IDPService/scim/Groups" & parameters ?count=120&startIndex=50
			var oBusyDialog = new sap.m.BusyDialog();
			oBusyDialog.open();
			var oResponse = [];
			jQuery.ajax({
				type: "GET",
				url: "/IDPService/scim/Groups",
				data: {
					startIndex: oStartIndex
				},
				// contentType: "application/json",
				// dataType: "json",
				async: false,
				success: function (data, textStatus, jqXHR) {
					oBusyDialog.close();
					oResponse = {
						callfunction: "success",
						datareturn: data
					};
					oCallback(oResponse);
				},
				error: function (jqXHR, textStatus, errorThrown) {
					oBusyDialog.close();
					oResponse = {
						callfunction: "error",
						datareturn: []
					};
					oCallback(oResponse);
				}
			});
		},
		// TEMP-TEST 18082022 (end)

		//function to fetch the group list
		getGroupList: function () {
			var that = this;
			var sURL = '/IDPService/service/scim/Groups?filter=displayName co "DKSH_"';
			var finalData = [];
			var oBusyDialog = new sap.m.BusyDialog();
			oBusyDialog.open();
			this.getOwnerComponent()
				.getApiModel("CCGroups", sURL)
				.then(function (oData) {
						oBusyDialog.close();
						for (var i = 0; i < oData.Resources.length; i++) {
							finalData.push({
								key: oData.Resources[i]["urn:sap:cloud:scim:schemas:extension:custom:2.0:Group"].name,
								desc: oData.Resources[i]["urn:sap:cloud:scim:schemas:extension:custom:2.0:Group"].description
							});
						}
						var groupModel = new sap.ui.model.json.JSONModel({
							results: finalData
						});
						groupModel.setSizeLimit(finalData.length);
						that.getView().setModel(groupModel, "GroupModelSet");
					},
					function (oError) {
						oBusyDialog.close();
						sap.m.MessageBox.error(oError, {
							styleClass: "sapUiSizeCompact"
						});
					}
				);
		},

		///////////////////////////////// Sales Organization /////////////////////////////////////////////////

		//	f4 for Slaes Org
		handleValueHelpSalesOrganization: function (oEvent) {
			var that = this;
			if (!that.salesOrgFrag) {
				that.salesOrgFrag = sap.ui.xmlfragment("com.incture.cherrywork.newdac.fragments.SalesOrg", that);
				that.getView().addDependent(that.salesOrgFrag);
			}
			that.readSalesOrganization();
		},

		//	on conform sales Org
		onConfirmChangeSalesOrganization: function (oEvent) {
			oEvent.getSource().getBinding("items").filter([]);

			var selectedContext = oEvent.getParameters().selectedContexts;
			var oSelsOrgDet = this.getView().byId("ID_TBL_VIEW_PROV_SELS_ORG").getModel("SlaesOrgViewSet");
			//remove duplicate
			var duplicate = [];
			var countDup = 0;
			var nonDupArray = [];
			for (var i = 0; i < selectedContext.length; i++) {
				countDup = 0;
				for (var j = 0; j < oSelsOrgDet.getData().results.length; j++) {

					if (selectedContext[i].getObject().SalesOrg === oSelsOrgDet.getData().results[j].SalesOrg) {
						duplicate.push(selectedContext[i].getObject().SalesOrg);
						countDup++;
					}
				}
				if (countDup === 0) {
					nonDupArray.push(selectedContext[i].getObject());
				}
			}

			//if duplicate return
			if (duplicate.length > 0) {
				var msg = this.i18nModel.getProperty("alreadyPresentF4SelctionDupMsg");
				sap.m.MessageToast.show(msg + " " + duplicate.join(", "));
			}

			for (var i = 0; i < nonDupArray.length; i++) {
				var selectedObj = nonDupArray[i];
				oSelsOrgDet.getData().results.push({
					"SalesOrg": selectedObj.SalesOrg,
					"Name": selectedObj.Name
				});
			}
			oSelsOrgDet.setSizeLimit(oSelsOrgDet.getData().results.length);
			oSelsOrgDet.refresh();
			var msg1 = this.i18nModel.getProperty("salesOrganizationCountLbl");
			this.getView().byId("ID_PROV_LBL_C_SALS_ORG").setText(msg1 + " (" + oSelsOrgDet.getData().results.length + ")");
			//this.salesOrgFrag.close();
		},

		//	on cancel Sales Org
		onCancelChangeSalesOrganization: function (oEvent) {},

		//live search Sales Org
		onLiveChangeSalesOrganization: function (oEvent) {
			var value = oEvent.getParameters().value;
			var filters = new Array();
			var oFilter = new sap.ui.model.Filter([new sap.ui.model.Filter("Name", sap.ui.model.FilterOperator.Contains, value),
				new sap.ui.model.Filter("SalesOrg", sap.ui.model.FilterOperator.Contains, value)
			]);
			filters.push(oFilter);
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter(filters);
		},

		//read sales Organization
		readSalesOrganization: function () {
			var that = this;
			var lang = "";
			if (sap.ushell) {
				lang = sap.ui.getCore().getConfiguration().getLanguage();
			} else {
				lang = "EN";
			}

			//coment later
			//lang = "E";
			var busyDialog = new sap.m.BusyDialog();
			busyDialog.open();
			if (!that.oModelSelsOrganization) {
				var url = encodeURI("/ZSALESORGLOOKUPSet");
				this.oModel.read(url, {
					async: true,
					urlParameters: "$filter=Language eq '" + lang.toUpperCase() + "'",
					success: function (oData, oResponse) {
						that.oModelSelsOrganization = new sap.ui.model.json.JSONModel({
							results: oData.results
						});
						that.oModelSelsOrganization.setSizeLimit(oData.results.length);
						//	//sap.ui.getCore().byId("ID_TBL_PROV_SELS_ORG").setModel(that.oModelSelsOrganization, "SlaesOrgSet");
						that.salesOrgFrag.setModel(that.oModelSelsOrganization, "SlaesOrgSet");
						busyDialog.close();
						that.salesOrgFrag.open();
					},
					error: function (error) {
						busyDialog.close();
						var errorMsg = JSON.parse(error.responseText);
						errorMsg = errorMsg.error.message.value;
						that.errorMsg(errorMsg);
					}
				});
			} else {
				busyDialog.close();
				that.salesOrgFrag.open();
			}
		},
		//	General Error Message Box
		errorMsg: function (errorMsg) {
			sap.m.MessageBox.show(
				errorMsg, {
					styleClass: 'sapUiSizeCompact',
					icon: sap.m.MessageBox.Icon.ERROR,
					title: "Error",
					actions: [sap.m.MessageBox.Action.OK],
					onClose: function (oAction) {}
				}
			);
		},

		// delete on click of sales order data
		onPressDeleteSalsOrganization: function (oEvent) {
			var index = oEvent.getSource().getBindingContext("SlaesOrgViewSet").sPath.split("/").pop();
			var oModel = this.getView().byId("ID_TBL_VIEW_PROV_SELS_ORG").getModel("SlaesOrgViewSet");
			oModel.getData().results.splice(index, 1);
			var msg1 = this.i18nModel.getProperty("deletedSuccessfully");
			sap.m.MessageToast.show(msg1);
			oModel.refresh();
			var msg = this.i18nModel.getProperty("salesOrganizationCountLbl");
			this.getView().byId("ID_PROV_LBL_C_SALS_ORG").setText(msg + " (" + oModel.getData().results.length + ")");

		},

		////////////////////////////////////////////////////////// Customer Number////////////////////////////////////

		//	f4 for Customer Number Search
		handleValueHelpCustomerNumber: function (oEvent) {
			var that = this;
			if (!that.customerNumFragSerach) {
				that.customerNumFragSerach = sap.ui.xmlfragment("com.incture.cherrywork.newdac.fragments.CustomerSearch",
					that);
				that.getView().addDependent(that.customerNumFragSerach);
			}
			var oModelCustSearch = new sap.ui.model.json.JSONModel({
				CustId: "",
				CustName: "",
				CustName2: ""
			});
			that.customerNumFragSerach.setModel(oModelCustSearch, "CustomerSerchSet");
			that.customerNumFragSerach.open();
		},

		//	f4 for Customer Number
		handleValueHelpCustomerSearchFrag: function (oEvent) {
			var that = this;
			if (!that.customerNumFrag) {
				that.customerNumFrag = sap.ui.xmlfragment("com.incture.cherrywork.newdac.fragments.CustomerNumber", that);
				that.getView().addDependent(that.customerNumFrag);
			}
			var data = that.customerNumFragSerach.getModel("CustomerSerchSet").getData();
			var filtrData = "$filter=";
			if (data.CustId.trim() === "" && data.CustName.trim() === "" && data.CustName2.trim() === "") {
				var msg = this.i18nModel.getProperty("addEitherIdOrName");
				sap.m.MessageToast.show(msg);
				return;
			}

			var count = 0;
			var count1 = 0;
			if (data.CustId.trim() !== "") {
				filtrData = filtrData + "CustId eq '" + data.CustId + "'";
				count++;
			}
			if (data.CustName.trim() !== "") {
				count1++;
				if (count === 0)
					filtrData = filtrData + "Name1 eq '" + data.CustName + "'";
				else
					filtrData = filtrData + " and Name1 eq '" + data.CustName + "'";
			}

			if (data.CustName2.trim() !== "") {
				if (count === 0 && count1 === 0)
					filtrData = filtrData + "Name2 eq '" + data.CustName2 + "'";
				else
					filtrData = filtrData + " and Name2 eq '" + data.CustName2 + "'";
			}
			that.readCustomerNumber(filtrData);
		},

		//cancel
		handleValueHelpCustomerCancelSearchFrag: function () {
			this.customerNumFragSerach.close()
		},

		//	on conform Customer number
		onConfirmChangeCustomerNumber: function (oEvent) {
			this.customerNumFragSerach.close();
			oEvent.getSource().getBinding("items").filter([]);
			var selectedContext = oEvent.getParameters().selectedContexts;
			var oSelsOrgDet = this.getView().byId("ID_TBL_VIEW_PROV_CUST_NUM").getModel("CustomerNumViewSet");
			//remove duplicate
			var duplicate = [];
			var countDup = 0;
			var nonDupArray = [];
			for (var i = 0; i < selectedContext.length; i++) {
				countDup = 0;
				for (var j = 0; j < oSelsOrgDet.getData().results.length; j++) {

					if (selectedContext[i].getObject().CustCode === oSelsOrgDet.getData().results[j].CustCode) {
						duplicate.push(selectedContext[i].getObject().CustCode);
						countDup++;
					}
				}
				if (countDup === 0) {
					nonDupArray.push(selectedContext[i].getObject());
				}
			}

			//if duplicate return
			if (duplicate.length > 0) {
				var msg = this.i18nModel.getProperty("alreadyPresentF4SelctionDupMsg");
				sap.m.MessageToast.show(msg + " " + duplicate.join(", "));
			}

			for (var i = 0; i < nonDupArray.length; i++) {
				var selectedObj = nonDupArray[i];
				oSelsOrgDet.getData().results.push({
					"CustCode": selectedObj.CustCode,
					"Name1": selectedObj.Name1
				});
			}
			oSelsOrgDet.setSizeLimit(oSelsOrgDet.getData().results.length);
			oSelsOrgDet.refresh();
			var msg1 = this.i18nModel.getProperty("customerLblCount");
			this.getView().byId("ID_PROV_LBL_C_CUST_NUM").setText(msg1 + " (" + oSelsOrgDet.getData().results.length + ")");
		},

		//	on cancel Customer 
		onCancelChangeCustomerNumber: function (oEvent) {},

		//live search Customer Number
		onLiveChangeCustomerNumber: function (oEvent) {
			var value = oEvent.getParameters().value;
			var filters = new Array();
			var oFilter = new sap.ui.model.Filter([new sap.ui.model.Filter("Name1", sap.ui.model.FilterOperator.Contains, value),
				new sap.ui.model.Filter("CustCode", sap.ui.model.FilterOperator.Contains, value)
			]);
			filters.push(oFilter);
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter(filters);
		},

		//read customer number
		readCustomerNumber: function (data) {
			var that = this;
			var busyDialog = new sap.m.BusyDialog();
			busyDialog.open();
			var url = encodeURI("/CustomerSet");
			this.oModel.read(url, {
				async: true,
				urlParameters: data,
				success: function (oData, oResponse) {
					for (var i = 0; i < oData.results.length; i++) {
						oData.results[i].CustCode = parseInt(oData.results[i].CustId).toString();
						oData.results[i].Name1 = oData.results[i].Name1 + " " + oData.results[i].Name2;
					}
					that.oModelCustomerNumber = new sap.ui.model.json.JSONModel({
						results: oData.results
					});
					that.oModelCustomerNumber.setSizeLimit(oData.results.length);
					that.customerNumFrag.setModel(that.oModelCustomerNumber, "CustomerNumSet");
					busyDialog.close();
					that.customerNumFrag.open();
				},
				error: function (error) {
					busyDialog.close();
					var errorMsg = JSON.parse(error.responseText);
					errorMsg = errorMsg.error.message.value;
					that.errorMsg(errorMsg);
				}
			});

		},

		// delete on click Customer Number
		onPressDeleteCustomerNumber: function (oEvent) {
			var index = oEvent.getSource().getBindingContext("CustomerNumViewSet").sPath.split("/").pop();
			var oModel = this.getView().byId("ID_TBL_VIEW_PROV_CUST_NUM").getModel("CustomerNumViewSet");
			oModel.getData().results.splice(index, 1);
			var msg1 = this.i18nModel.getProperty("deletedSuccessfully");
			sap.m.MessageToast.show(msg1);
			oModel.refresh();
			var msg = this.i18nModel.getProperty("customerLblCount");
			this.getView().byId("ID_PROV_LBL_C_CUST_NUM").setText(msg + " (" + oModel.getData().results.length + ")");
		},

		////////////////////////////////////////////////////Material Number/////////////////////////

		//	f4 for Material number
		handleValueHelpMaterialNumber: function (oEvent) {
			var that = this;
			if (!that.materialNumFrag) {
				that.materialNumFrag = sap.ui.xmlfragment("com.incture.cherrywork.newdac.fragments.MaterialNumber", that);
				that.getView().addDependent(that.materialNumFrag);
			}
			that.readMaterialNumber();
		},

		//	on conform Material Number
		onConfirmChangeMaterialNumber: function (oEvent) {
			oEvent.getSource().getBinding("items").filter([]);
			var selectedContext = oEvent.getParameters().selectedContexts;
			var oSelsOrgDet = this.getView().byId("ID_TBL_VIEW_PROV_MATERIAL_NUM").getModel("MaterialNumViewSet");
			//remove duplicate
			var duplicate = [];
			var countDup = 0;
			var nonDupArray = [];
			for (var i = 0; i < selectedContext.length; i++) {
				countDup = 0;
				for (var j = 0; j < oSelsOrgDet.getData().results.length; j++) {

					if (selectedContext[i].getObject().MatCode === oSelsOrgDet.getData().results[j].MatCode) {
						duplicate.push(selectedContext[i].getObject().MatCode);
						countDup++;
					}
				}
				if (countDup === 0) {
					nonDupArray.push(selectedContext[i].getObject());
				}
			}

			//if duplicate return
			if (duplicate.length > 0) {
				var msg = this.i18nModel.getProperty("alreadyPresentF4SelctionDupMsg");
				sap.m.MessageToast.show(msg + " " + duplicate.join(", "));
			}

			for (var i = 0; i < nonDupArray.length; i++) {
				var selectedObj = nonDupArray[i];
				oSelsOrgDet.getData().results.push({
					"MatCode": selectedObj.MatCode,
					"MatCodeDesc": selectedObj.MatCodeDesc
				});
			}
			oSelsOrgDet.setSizeLimit(oSelsOrgDet.getData().results.length);
			oSelsOrgDet.refresh();
			var msg1 = this.i18nModel.getProperty("materialNumberCountLbl");
			this.getView().byId("ID_PROV_LBL_C_Mat_NUM").setText(msg1 + " (" + oSelsOrgDet.getData().results.length + ")");
		},

		//	on cancel Material Number
		onCancelChangeMaterialNumber: function (oEvent) {},

		//live search Material Number
		onLiveChangeMaterialNumber: function (oEvent) {
			var value = oEvent.getParameters().value;
			var filters = new Array();
			var oFilter = new sap.ui.model.Filter([new sap.ui.model.Filter("MatCode", sap.ui.model.FilterOperator.Contains, value),
				new sap.ui.model.Filter("MatCodeDesc", sap.ui.model.FilterOperator.Contains, value)
			]);
			filters.push(oFilter);
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter(filters);
		},

		//read Material Number
		readMaterialNumber: function () {
			var that = this;
			var lang = "";
			if (sap.ushell) {
				lang = sap.ui.getCore().getConfiguration().getLanguage();
			} else {
				lang = "EN";
			}

			//coment later
			lang = "E";
			var busyDialog = new sap.m.BusyDialog();
			busyDialog.open();
			if (!that.oModelMaterialNumber) {
				var url = encodeURI("/ZSALESORGLOOKUPSet");
				this.oModel.read(url, {
					async: true,
					urlParameters: "$filter=Language eq '" + lang.toUpperCase() + "'",
					success: function (oData, oResponse) {

						that.oModelMaterialNumber = new sap.ui.model.json.JSONModel({
							results: oData.results
						});
						that.oModelMaterialNumber.setSizeLimit(oData.results.length);
						that.materialNumFrag.setModel(that.oModelMaterialNumber, "MaterialNumSet");
						busyDialog.close();
						that.materialNumFrag.open();
					},
					error: function (error) {
						busyDialog.close();
						var errorMsg = JSON.parse(error.responseText);
						errorMsg = errorMsg.error.message.value;
						that.errorMsg(errorMsg);
					}
				});
			} else {
				busyDialog.close();
				//sap.ui.getCore().byId("ID_TBL_PROV_MATERIAL_NUM").removeSelections();
				that.materialNumFrag.open();
			}
		},

		// delete on click of Material Number
		onPressDeleteMaterialNumber: function (oEvent) {
			var index = oEvent.getSource().getBindingContext("MaterialNumViewSet").sPath.split("/").pop();
			var oModel = this.getView().byId("ID_TBL_VIEW_PROV_MATERIAL_NUM").getModel("MaterialNumViewSet");
			oModel.getData().results.splice(index, 1);
			var msg1 = this.i18nModel.getProperty("deletedSuccessfully");
			sap.m.MessageToast.show(msg1);
			oModel.refresh();
			var msg = this.i18nModel.getProperty("materialNumberCountLbl");
			this.getView().byId("ID_PROV_LBL_C_Mat_NUM").setText(msg + " (" + oModel.getData().results.length + ")");

		},
		///////////////////////////////Distribution Channel ////////////////////////////////
		//	f4 for Distribution Channel
		handleValueHelpDistributionChannel: function (oEvent) {
			var that = this;
			if (!that.distributionChannelFrag) {
				that.distributionChannelFrag = sap.ui.xmlfragment(
					"com.incture.cherrywork.newdac.fragments.DistributionChannel", that);
				that.getView().addDependent(that.distributionChannelFrag);
			}
			that.readDistributionChannel();
		},

		//	on conform Distribition channel
		onConfirmChangeDistrubtionChannel: function (oEvent) {
			oEvent.getSource().getBinding("items").filter([]);
			var selectedContext = oEvent.getParameters().selectedContexts;
			var oSelsOrgDet = this.getView().byId("ID_TBL_VIEW_PROV_DISTRU_CHANL").getModel("DistributionChannelViewSet");
			//remove duplicate
			var duplicate = [];
			var countDup = 0;
			var nonDupArray = [];
			for (var i = 0; i < selectedContext.length; i++) {
				countDup = 0;
				for (var j = 0; j < oSelsOrgDet.getData().results.length; j++) {

					if (selectedContext[i].getObject().DistChl === oSelsOrgDet.getData().results[j].DistChl) {
						duplicate.push(selectedContext[i].getObject().DistChl);
						countDup++;
					}
				}
				if (countDup === 0) {
					nonDupArray.push(selectedContext[i].getObject());
				}
			}

			//if duplicate return
			if (duplicate.length > 0) {
				var msg = this.i18nModel.getProperty("alreadyPresentF4SelctionDupMsg");
				sap.m.MessageToast.show(msg + " " + duplicate.join(", "));
			}

			for (var i = 0; i < nonDupArray.length; i++) {
				var selectedObj = nonDupArray[i];
				oSelsOrgDet.getData().results.push({
					"DistChl": selectedObj.DistChl,
					"Name": selectedObj.Name
				});
			}
			oSelsOrgDet.setSizeLimit(oSelsOrgDet.getData().results.length);
			oSelsOrgDet.refresh();
			var msg1 = this.i18nModel.getProperty("distributionChannelCountLbl");
			this.getView().byId("ID_PROV_LBL_C_DISTRI_CHNL").setText(msg1 + " (" + oSelsOrgDet.getData().results.length + ")");
		},

		//	on cancel Distribution Channel
		onCancelChangeDistributionChannel: function (oEvent) {},

		//live search Distribution Channel
		onLiveChangeDistributionChannel: function (oEvent) {
			var value = oEvent.getParameters().value;
			var filters = new Array();
			var oFilter = new sap.ui.model.Filter([new sap.ui.model.Filter("Name", sap.ui.model.FilterOperator.Contains, value),
				new sap.ui.model.Filter("DistChl", sap.ui.model.FilterOperator.Contains, value)
			]);
			filters.push(oFilter);
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter(filters);
		},

		//read Distribuion Channel
		readDistributionChannel: function () {
			var that = this;
			var lang = "";
			if (sap.ushell) {
				lang = sap.ui.getCore().getConfiguration().getLanguage();
			} else {
				lang = "EN";
			}

			//coment later
			//	lang = "E";
			var busyDialog = new sap.m.BusyDialog();
			busyDialog.open();
			if (!that.oModelDistributionChannel) {
				var url = encodeURI("/ZDISTCHLLOOKUPSet");
				this.oModel.read(url, {
					async: true,
					urlParameters: "$filter=Language eq '" + lang.toUpperCase() + "'",
					success: function (oData, oResponse) {

						that.oModelDistributionChannel = new sap.ui.model.json.JSONModel({
							results: oData.results
						});
						that.oModelDistributionChannel.setSizeLimit(oData.results.length);
						that.distributionChannelFrag.setModel(that.oModelDistributionChannel, "DistributionChannelSet");
						busyDialog.close();
						that.distributionChannelFrag.open();
					},
					error: function (error) {
						busyDialog.close();
						var errorMsg = JSON.parse(error.responseText);
						errorMsg = errorMsg.error.message.value;
						that.errorMsg(errorMsg);
					}
				});
			} else {
				busyDialog.close();
				//sap.ui.getCore().byId("ID_TBL_PROV_DISTRU_CHANL").removeSelections();
				that.distributionChannelFrag.open();
			}
		},

		// delete on click of Distribution channel
		onPressDeleteDistributionChannel: function (oEvent) {
			var index = oEvent.getSource().getBindingContext("DistributionChannelViewSet").sPath.split("/").pop();
			var oModel = this.getView().byId("ID_TBL_VIEW_PROV_DISTRU_CHANL").getModel("DistributionChannelViewSet");
			oModel.getData().results.splice(index, 1);
			var msg1 = this.i18nModel.getProperty("deletedSuccessfully");
			sap.m.MessageToast.show(msg1);
			oModel.refresh();
			var msg = this.i18nModel.getProperty("distributionChannelCountLbl");
			this.getView().byId("ID_PROV_LBL_C_DISTRI_CHNL").setText(msg + " (" + oModel.getData().results.length + ")");

		},

		//////////////////////////////////Material Group//////////////////////////////////////////
		//	f4 for Material Group
		handleValueHelpMaterialGroup: function (oEvent) {
			var that = this;
			if (!that.materialGroupFrag) {
				that.materialGroupFrag = sap.ui.xmlfragment("com.incture.cherrywork.newdac.fragments.MaterialGroup", that);
				that.getView().addDependent(that.materialGroupFrag);
			}
			that.readMaterialGroup();
		},

		//	on conform Material Group
		onConfirmChangeMaterialGroup: function (oEvent) {
			oEvent.getSource().getBinding("items").filter([]);
			var selectedContext = oEvent.getParameters().selectedContexts;
			var oSelsOrgDet = this.getView().byId("ID_TBL_VIEW_PROV_MAT_GRP_").getModel("MaterialGrpViewSet");
			//remove duplicate
			var duplicate = [];
			var countDup = 0;
			var nonDupArray = [];
			for (var i = 0; i < selectedContext.length; i++) {
				countDup = 0;
				for (var j = 0; j < oSelsOrgDet.getData().results.length; j++) {

					if (selectedContext[i].getObject().Materialgroup === oSelsOrgDet.getData().results[j].Materialgroup) {
						duplicate.push(selectedContext[i].getObject().Materialgroup);
						countDup++;
					}
				}
				if (countDup === 0) {
					nonDupArray.push(selectedContext[i].getObject());
				}
			}

			//if duplicate return
			if (duplicate.length > 0) {
				var msg = this.i18nModel.getProperty("alreadyPresentF4SelctionDupMsg");
				sap.m.MessageToast.show(msg + " " + duplicate.join(", "));
			}

			for (var i = 0; i < nonDupArray.length; i++) {
				var selectedObj = nonDupArray[i];
				oSelsOrgDet.getData().results.push({
					"Materialgroup": selectedObj.Materialgroup,
					"Matgroupdesc": selectedObj.Matgroupdesc
				});
			}
			oSelsOrgDet.setSizeLimit(oSelsOrgDet.getData().results.length);
			oSelsOrgDet.refresh();
			var msg1 = this.i18nModel.getProperty("materialGroupCountLbl");
			this.getView().byId("ID_PROV_LBL_C_MAT_GRP").setText(msg1 + " (" + oSelsOrgDet.getData().results.length + ")");
		},

		//	on cancel Material Group
		onCancelChangeMaterialGroup: function (oEvent) {},

		//live search Material Group
		onLiveChangeMaterialGroup: function (oEvent) {
			var value = oEvent.getParameters().value;
			var filters = new Array();
			var oFilter = new sap.ui.model.Filter([new sap.ui.model.Filter("Materialgroup", sap.ui.model.FilterOperator.Contains, value),
				new sap.ui.model.Filter("Matgroupdesc", sap.ui.model.FilterOperator.Contains, value)
			]);
			filters.push(oFilter);
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter(filters);
		},

		//read Material Group
		readMaterialGroup: function () {
			var that = this;
			var lang = "";
			if (sap.ushell) {
				lang = sap.ui.getCore().getConfiguration().getLanguage();
			} else {
				lang = "EN";
			}

			//coment later
			//	lang = "E";
			var busyDialog = new sap.m.BusyDialog();
			busyDialog.open();
			if (!that.oModelMaterialGroup) {
				var url = encodeURI("/ZSearchHelp_MaterialGroupSet");
				this.oModelMaterial.read(url, {
					async: true,
					urlParameters: "$filter=Language eq '" + lang.toUpperCase() + "'",
					success: function (oData, oResponse) {

						that.oModelMaterialGroup = new sap.ui.model.json.JSONModel({
							results: oData.results
						});
						that.oModelMaterialGroup.setSizeLimit(oData.results.length);
						that.materialGroupFrag.setModel(that.oModelMaterialGroup, "MaterialGrpSet");
						busyDialog.close();
						that.materialGroupFrag.open();
					},
					error: function (error) {
						busyDialog.close();
						var errorMsg = JSON.parse(error.responseText);
						errorMsg = errorMsg.error.message.value;
						that.errorMsg(errorMsg);
					}
				});
			} else {
				busyDialog.close();
				//sap.ui.getCore().byId("ID_TBL_PROV_MAT_GRP_").removeSelections();
				that.materialGroupFrag.open();
			}
		},

		// delete on click of Material Group
		onPressDeleteMaterialGroup: function (oEvent) {
			var index = oEvent.getSource().getBindingContext("MaterialGrpViewSet").sPath.split("/").pop();
			var oModel = this.getView().byId("ID_TBL_VIEW_PROV_MAT_GRP_").getModel("MaterialGrpViewSet");
			oModel.getData().results.splice(index, 1);
			var msg1 = this.i18nModel.getProperty("deletedSuccessfully");
			sap.m.MessageToast.show(msg1);
			oModel.refresh();
			var msg = this.i18nModel.getProperty("materialGroupCountLbl");
			this.getView().byId("ID_PROV_LBL_C_MAT_GRP").setText(msg + " (" + oModel.getData().results.length + ")");

		},

		//////////////////////////////////Material Group One//////////////////////////////////////////
		//	f4 for Material Group one
		handleValueHelpMaterialGroupOne: function (oEvent) {
			var that = this;
			if (!that.materialGroupOneFrag) {
				that.materialGroupOneFrag = sap.ui.xmlfragment("com.incture.cherrywork.newdac.fragments.MaterialGroupOne",
					that);
				that.getView().addDependent(that.materialGroupOneFrag);
			}
			that.readMaterialGroupOne();
		},

		//	on conform Material Group One
		onConfirmChangeMaterialGroupOne: function (oEvent) {
			oEvent.getSource().getBinding("items").filter([]);
			var selectedContext = oEvent.getParameters().selectedContexts;
			var oSelsOrgDet = this.getView().byId("ID_TBL_VIEW_PROV_MAT_GRP_ONE").getModel("MaterialGrpOneViewSet");
			//remove duplicate
			var duplicate = [];
			var countDup = 0;
			var nonDupArray = [];
			for (var i = 0; i < selectedContext.length; i++) {
				countDup = 0;
				for (var j = 0; j < oSelsOrgDet.getData().results.length; j++) {

					if (selectedContext[i].getObject().MaterialGroup1 === oSelsOrgDet.getData().results[j].MaterialGroup1) {
						duplicate.push(selectedContext[i].getObject().MaterialGroup1);
						countDup++;
					}
				}
				if (countDup === 0) {
					nonDupArray.push(selectedContext[i].getObject());
				}
			}

			//if duplicate return
			if (duplicate.length > 0) {
				var msg = this.i18nModel.getProperty("alreadyPresentF4SelctionDupMsg");
				sap.m.MessageToast.show(msg + " " + duplicate.join(", "));
			}

			for (var i = 0; i < nonDupArray.length; i++) {
				var selectedObj = nonDupArray[i];
				oSelsOrgDet.getData().results.push({
					"MaterialGroup1": selectedObj.MaterialGroup1,
					"MatGroup1Desc": selectedObj.MatGroup1Desc
				});
			}
			oSelsOrgDet.setSizeLimit(oSelsOrgDet.getData().results.length);
			oSelsOrgDet.refresh();
			var msg1 = this.i18nModel.getProperty("materialGroupOneCountLbl");
			this.getView().byId("ID_PROV_LBL_C_MAT_GRP_ONE").setText(msg1 + " (" + oSelsOrgDet.getData().results.length + ")");
		},

		//	on cancel Material Group one
		onCancelChangeMaterialGroupOne: function (oEvent) {},

		//live search Material Group ONe
		onLiveChangeMaterialGroupOne: function (oEvent) {
			var value = oEvent.getParameters().value;
			var filters = new Array();
			var oFilter = new sap.ui.model.Filter([new sap.ui.model.Filter("MaterialGroup1", sap.ui.model.FilterOperator.Contains, value),
				new sap.ui.model.Filter("MatGroup1Desc", sap.ui.model.FilterOperator.Contains, value)
			]);
			filters.push(oFilter);
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter(filters);
		},

		//read Material Group One
		readMaterialGroupOne: function () {
			var that = this;
			var lang = "";
			if (sap.ushell) {
				lang = sap.ui.getCore().getConfiguration().getLanguage();
			} else {
				lang = "EN";
			}

			//coment later
			//lang = "E";
			var busyDialog = new sap.m.BusyDialog();
			busyDialog.open();
			if (!that.oModelMaterialGroupOne) {
				var url = encodeURI("/ZSearchHelp_MaterialGroup1Set");
				this.oModelMaterial.read(url, {
					async: true,
					urlParameters: "$filter=Language eq '" + lang.toUpperCase() + "'",
					success: function (oData, oResponse) {

						that.oModelMaterialGroupOne = new sap.ui.model.json.JSONModel({
							results: oData.results
						});
						that.oModelMaterialGroupOne.setSizeLimit(oData.results.length);
						that.materialGroupOneFrag.setModel(that.oModelMaterialGroupOne, "MaterialGrpOneSet");
						busyDialog.close();
						that.materialGroupOneFrag.open();
					},
					error: function (error) {
						busyDialog.close();
						var errorMsg = JSON.parse(error.responseText);
						errorMsg = errorMsg.error.message.value;
						that.errorMsg(errorMsg);
					}
				});
			} else {
				busyDialog.close();
				//sap.ui.getCore().byId("ID_TBL_PROV_MAT_GRP_ONE").removeSelections();
				that.materialGroupOneFrag.open();
			}
		},

		// delete on click of Material Group One
		onPressDeleteMaterialGroupOne: function (oEvent) {
			var index = oEvent.getSource().getBindingContext("MaterialGrpOneViewSet").sPath.split("/").pop();
			var oModel = this.getView().byId("ID_TBL_VIEW_PROV_MAT_GRP_ONE").getModel("MaterialGrpOneViewSet");
			oModel.getData().results.splice(index, 1);
			var msg1 = this.i18nModel.getProperty("deletedSuccessfully");
			sap.m.MessageToast.show(msg1);
			oModel.refresh();
			var msg = this.i18nModel.getProperty("materialGroupOneCountLbl");
			this.getView().byId("ID_PROV_LBL_C_MAT_GRP_ONE").setText(msg + " (" + oModel.getData().results.length + ")");

		},

		//////////////////////////////////////////////////District /////////////////////////////////////////////

		//	f4 for District
		handleValueHelpDistrcitt: function (oEvent) {
			var that = this;
			if (!that.districtOneFrag) {
				that.districtOneFrag = sap.ui.xmlfragment("com.incture.cherrywork.newdac.fragments.District", that);
				that.getView().addDependent(that.districtOneFrag);
			}
			that.readDitrict();
		},

		//	on conform District
		onConfirmChangeDistrict: function (oEvent) {
			oEvent.getSource().getBinding("items").filter([]);
			var selectedContext = oEvent.getParameters().selectedContexts;
			var oSelsOrgDet = this.getView().byId("ID_TBL_VIEW_PROV_DISTRICT").getModel("DistrictViewSet");
			//remove duplicate
			var duplicate = [];
			var countDup = 0;
			var nonDupArray = [];
			for (var i = 0; i < selectedContext.length; i++) {
				countDup = 0;
				for (var j = 0; j < oSelsOrgDet.getData().results.length; j++) {

					if (selectedContext[i].getObject().Division === oSelsOrgDet.getData().results[j].Division) {
						duplicate.push(selectedContext[i].getObject().Division);
						countDup++;
					}
				}
				if (countDup === 0) {
					nonDupArray.push(selectedContext[i].getObject());
				}
			}

			//if duplicate return
			if (duplicate.length > 0) {
				var msg = this.i18nModel.getProperty("alreadyPresentF4SelctionDupMsg");
				sap.m.MessageToast.show(msg + " " + duplicate.join(", "));
			}

			for (var i = 0; i < nonDupArray.length; i++) {
				var selectedObj = nonDupArray[i];
				oSelsOrgDet.getData().results.push({
					"Division": selectedObj.Division,
					"Name": selectedObj.Name
				});
			}
			oSelsOrgDet.setSizeLimit(oSelsOrgDet.getData().results.length);
			oSelsOrgDet.refresh();
			var msg1 = this.i18nModel.getProperty("distrcitCountLbl");
			this.getView().byId("ID_PROV_LBL_C_MAT_DISTRCT").setText(msg1 + " (" + oSelsOrgDet.getData().results.length + ")");
		},

		//	on cancelDistrict
		onCancelChangeDistrict: function (oEvent) {},

		//live search District
		onLiveChangeDistrict: function (oEvent) {
			var value = oEvent.getParameters().value;
			var filters = new Array();
			var oFilter = new sap.ui.model.Filter([new sap.ui.model.Filter("Division", sap.ui.model.FilterOperator.Contains, value),
				new sap.ui.model.Filter("Name", sap.ui.model.FilterOperator.Contains, value)
			]);
			filters.push(oFilter);
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter(filters);
		},

		//read Disrect
		readDitrict: function () {
			var that = this;
			var lang = "";
			if (sap.ushell) {
				lang = sap.ui.getCore().getConfiguration().getLanguage();
			} else {
				lang = "EN";
			}

			//coment later
			//lang = "E";
			var busyDialog = new sap.m.BusyDialog();
			busyDialog.open();
			if (!that.oModelDistrict) {
				var url = encodeURI("/ZDIVISIONLOOKUPSet");
				this.oModel.read(url, {
					async: true,
					urlParameters: "$filter=Language eq '" + lang.toUpperCase() + "'",
					success: function (oData, oResponse) {

						that.oModelDistrict = new sap.ui.model.json.JSONModel({
							results: oData.results
						});
						that.oModelDistrict.setSizeLimit(oData.results.length);
						that.districtOneFrag.setModel(that.oModelDistrict, "DistrictSet");
						busyDialog.close();
						that.districtOneFrag.open();
					},
					error: function (error) {
						busyDialog.close();
						var errorMsg = JSON.parse(error.responseText);
						errorMsg = errorMsg.error.message.value;
						that.errorMsg(errorMsg);
					}
				});
			} else {
				busyDialog.close();
				//sap.ui.getCore().byId("ID_TBL_PROV_DISTRICT").removeSelections();
				that.districtOneFrag.open();
			}
		},

		// delete on click of Material Group One
		onPressDeleteDistrict: function (oEvent) {
			var index = oEvent.getSource().getBindingContext("DistrictViewSet").sPath.split("/").pop();
			var oModel = this.getView().byId("ID_TBL_VIEW_PROV_DISTRICT").getModel("DistrictViewSet");
			oModel.getData().results.splice(index, 1);
			var msg1 = this.i18nModel.getProperty("deletedSuccessfully");
			sap.m.MessageToast.show(msg1);
			oModel.refresh();
			var msg = this.i18nModel.getProperty("distrcitCountLbl");
			this.getView().byId("ID_PROV_LBL_C_MAT_DISTRCT").setText(msg + " (" + oModel.getData().results.length + ")");

		},

		//on live Change first name
		liveChnageFirstName: function (oEvent) {
			oEvent.getSource().setValueState("None");
			oEvent.getSource().setTooltip(oEvent.getParameters().value);

		},

		//on live Change last name
		liveChnageLastName: function (oEvent) {
			oEvent.getSource().setValueState("None");
			oEvent.getSource().setTooltip(oEvent.getParameters().value);
		},

		liveChnageEmail: function (oEvent) {
			oEvent.getSource().setValueState("None");
			oEvent.getSource().setValue(oEvent.getParameters().value.trim());
			oEvent.getSource().setTooltip(oEvent.getParameters().value.trim());
		},

		liveChangePhoneNo: function (oEvent) {
			var newValue = "";
			var value = oEvent.getParameters().value.trim();
			for (var i = 0; i < value.length; i++) {
				newValue += value[i];
				if (/^([0-9]{1,14})?$/.test(newValue)) {} else {
					newValue = newValue.slice(0, -1);
				}
			}
			oEvent.getSource().setValue(newValue);
			oEvent.getSource().setTooltip(newValue);
			oEvent.getSource().setValueState("None");
		},

		//on country change
		onCountryChange: function (oEvent) {
			oEvent.getSource().setValueState("None");
			oEvent.getSource().setTooltip(oEvent.getParameters().value);
			// this.getView().getModel("UserModelSet").setProperty("/countryName", oEvent.getSource().getSelectedValue());
		},

		//IOP-function to create users
		onPressCreateUserFrag: function () {
			var that = this;

			// //sales organization
			// var saleOrgAttr1 = this.getView().byId("ID_TBL_VIEW_PROV_SELS_ORG").getModel("SlaesOrgViewSet").getData().results;
			// var salesOrgArrTemp = [];
			// for (var r = 0; r < saleOrgAttr1.length; r++) {
			// 	salesOrgArrTemp.push(saleOrgAttr1[r].SalesOrg);
			// }

			// //customer Number
			// var custNuAttr6 = this.getView().byId("ID_TBL_VIEW_PROV_CUST_NUM").getModel("CustomerNumViewSet").getData().results;
			// var custNoArrTemp = [];
			// for (var r = 0; r < custNuAttr6.length; r++) {
			// 	custNoArrTemp.push(custNuAttr6[r].CustCode);
			// }

			// //distributtion channel
			// var custNuAttr2 = this.getView().byId("ID_TBL_VIEW_PROV_DISTRU_CHANL").getModel("DistributionChannelViewSet").getData().results;
			// var distribuChannleTemp = [];
			// for (var r = 0; r < custNuAttr2.length; r++) {
			// 	distribuChannleTemp.push(custNuAttr2[r].DistChl);
			// }

			// //district
			// var custNuAttr3 = this.getView().byId("ID_TBL_VIEW_PROV_DISTRICT").getModel("DistrictViewSet").getData().results;
			// var districtTemp = [];
			// for (var r = 0; r < custNuAttr3.length; r++) {
			// 	districtTemp.push(custNuAttr3[r].Division);
			// }

			// //material group
			// var custNuAttr4 = this.getView().byId("ID_TBL_VIEW_PROV_MAT_GRP_").getModel("MaterialGrpViewSet").getData().results;
			// var materialGrpTemp = [];
			// for (var r = 0; r < custNuAttr4.length; r++) {
			// 	materialGrpTemp.push(custNuAttr4[r].Materialgroup);
			// }

			// //material group one
			// var custNuAttr5 = this.getView().byId("ID_TBL_VIEW_PROV_MAT_GRP_ONE").getModel("MaterialGrpOneViewSet").getData().results;
			// var materialGrpOneTemp = [];
			// for (var r = 0; r < custNuAttr5.length; r++) {
			// 	materialGrpOneTemp.push(custNuAttr5[r].MaterialGroup1);
			// }

			// //material group 4
			// var custNuAttr7 = this.getView().byId("ID_TBL_VIEW_PROV_MAT_GRP_4").getModel("MaterialGrp4ViewSet").getData().results;
			// var materialGrp4Temp = [];
			// for (var r = 0; r < custNuAttr7.length; r++) {
			// 	materialGrp4Temp.push(custNuAttr7[r].Materialgroup4);
			// }

			// //switch
			// var switchData = this.getView().getModel("SwitchOnOffSet").getData();

			// if (switchData.SalesOrgSwitch) {
			// 	salesOrgArrTemp = [];
			// 	salesOrgArrTemp.push("*");
			// }

			// if (switchData.CustomerSwitch) {
			// 	custNoArrTemp = [];
			// 	custNoArrTemp.push("*");
			// }

			// if (switchData.DistribuChanlSwitch) {
			// 	distribuChannleTemp = [];
			// 	distribuChannleTemp.push("*");
			// }

			// if (switchData.DistrictSwitch) {
			// 	districtTemp = [];
			// 	districtTemp.push("*");
			// }

			// if (switchData.MaterialGrpSwitch) {
			// 	materialGrpTemp = [];
			// 	materialGrpTemp.push("*");
			// }

			// if (switchData.MaterialGrpOneSwitch) {
			// 	materialGrpOneTemp = [];
			// 	materialGrpOneTemp.push("*");
			// }

			// if (switchData.MaterialGrp4Switch) {
			// 	materialGrp4Temp = [];
			// 	materialGrp4Temp.push("*");
			// }

			var oUserDetail = this.getView().byId("ID_PROV_SIMF_USER_DET").getModel("UserModelSet").getData();
			var firstName = oUserDetail.firstName.trim();
			var lastName = oUserDetail.lastName.trim();
			var email = oUserDetail.email.trim();
			var selectedCountry = oUserDetail.selectedCountry.trim();
			var countryName = this.getView().byId("countryId").getSelectedItem().getText();
			var phoneNo = oUserDetail.phoneNo.trim();
			var grpSelected = oUserDetail.groupSelected;
			var grps = grpSelected.join(",");
			var fullName = firstName + " " + lastName;
			var errCount = 0;

			//first Name check
			if (firstName === undefined || firstName === "") {
				errCount++;
				oUserDetail.firstNameValueState = "Error";
			} else {
				oUserDetail.firstNameValueState = "None";
			}

			//Last Name check
			if (lastName === undefined || lastName === "") {
				errCount++;
				oUserDetail.lastNameValueState = "Error";
			} else {
				oUserDetail.lastNameValueState = "None";
			}

			//Country check
			if (selectedCountry === undefined || selectedCountry === "") {
				errCount++;
				oUserDetail.countryValueState = "Error";
			} else {
				oUserDetail.countryValueState = "None";
			}

			//Country check
			if (email === undefined || email === "") {
				errCount++;
				oUserDetail.emailValueState = "Error";
			} else {
				oUserDetail.emailValueState = "None";
			}

			//group check
			if (grpSelected === undefined || grpSelected.length === 0) {
				errCount++;
				oUserDetail.groupValueState = "Error";
			} else {
				oUserDetail.groupValueState = "None";
			}

			if (errCount > 0) {
				var msg = this.i18nModel.getProperty("fillAllMandatoryFields");
				sap.m.MessageToast.show(msg);
				this.getView().byId("ID_PROV_SIMF_USER_DET").getModel("UserModelSet").refresh();
				return;
			}

			//check valid email
			var emailVal = that.validateEmail(email);
			if (emailVal === "E") {
				var msg1 = this.i18nModel.getProperty("enterEmailisNotValidFormat");
				sap.m.MessageToast.show(msg1);
				oUserDetail.emailValueState = "Error";
				this.getView().byId("ID_PROV_SIMF_USER_DET").getModel("UserModelSet").refresh();
				return;
			}

			//check data access assigned all
			// if (salesOrgArrTemp.join("@").trim() === "" ||
			// 	distribuChannleTemp.join("@").trim() === "" ||
			// 	districtTemp.join("@").trim() === "" ||
			// 	materialGrpTemp.join("@").trim() === "" ||
			// 	materialGrp4Temp.join("@").trim() === "" ||
			// 	custNoArrTemp.join("@").trim() === "" /*||
			// 	materialGrpOneTemp.join("@").trim() === ""*/) {
			// 	var msgDataAc = this.i18nModel.getProperty("assignValueToDataAccessControll");
			// 	sap.m.MessageToast.show(msgDataAc);
			// 	return;
			// }

			//add groups
			var groupsTemp = [];
			for (var i = 0; i < grpSelected.length; i++) {
				groupsTemp.push({
					"value": grpSelected[i],
					"display": grpSelected[i]
				});
			}

			//	if (sFlagCheck) {
			//	if (true) {
			var sUrl = "/IDPService/service/scim/Users";
			var oPayload = {
				"groups": groupsTemp,
				"userName": fullName,
				"name": {
					"givenName": firstName,
					"familyName": lastName
				},
				"emails": [{
					"value": email
				}],
				"displayName": firstName + " " + lastName,
				"addresses": [{
					"type": "home",
					"country": selectedCountry
				}],
				"phoneNumbers": [{
					"value": phoneNo,
					"type": "mobile"
				}],
				// ,
				// "urn:sap:cloud:scim:schemas:extension:custom:2.0:User": {
				// 	"attributes": [{
				// 		"name": "customAttribute1",
				// 		"value": salesOrgArrTemp.join("@")
				// 	}, {
				// 		"name": "customAttribute2",
				// 		"value": distribuChannleTemp.join("@")
				// 	}, {
				// 		"name": "customAttribute3",
				// 		"value": districtTemp.join("@")
				// 	}, {
				// 		"name": "customAttribute4",
				// 		"value": materialGrpTemp.join("@")
				// 	}, {
				// 		"name": "customAttribute5",
				// 		"value": materialGrp4Temp.join("@")
				// 	}, {
				// 		"name": "customAttribute6",
				// 		"value": custNoArrTemp.join("@")
				// 	}/*, {
				// 		"name": "customAttribute7",
				// 		"value": materialGrpOneTemp.join("@")
				// 	}*/]
				// },
				"password": "Resetme1",
				//"passwordPolicy": "https://accounts.sap.com/policy/passwords/sap/enterprise/1.0",
				"active": true,
				"sendMail": "true",
				"mailVerified": "true"
			};
			var oHeader = {
				"Content-Type": "application/scim+json"
			};
			var oCreateUserModel = new sap.ui.model.json.JSONModel();
			var oBusyDialog = new sap.m.BusyDialog();
			oBusyDialog.open();
			//	var that = this;
			oCreateUserModel.loadData(sUrl, JSON.stringify(oPayload), true, "POST", false, false, oHeader);
			oCreateUserModel.attachRequestCompleted(function (oEvent) {
				oBusyDialog.close();
				if (oEvent.getParameter("success")) {
					//	that.getView().byId("ID_PROV_SIMF_USER_DET").close();
					sap.m.MessageToast.show(oEvent.getSource().getData().name.givenName + " " + oEvent.getSource().getData().name.familyName +
						" user is created successfully with User ID - " + oEvent.getSource().getData().id);
					var router = sap.ui.core.UIComponent.getRouterFor(that);
					router.navTo("RouteUserProv");
					var oModelRef = new sap.ui.model.json.JSONModel({
						refreshUser: true
					});
					sap.ui.getCore().setModel(oModelRef, "refreshUserModel");
					var postData = {
						"userId": oEvent.getSource().getData().id,
						"email": email,
						"country": countryName,
						"userGroup": grps,
						"firstName": firstName,
						"lastName": lastName
					};
					jQuery.ajax({
						type: "POST",
						data: JSON.stringify(postData),
						contentType: "application/json",
						url: "/DKSHJavaService/userDetails/saveOrUpdate",
						dataType: "json",
						async: false,
						success: function (data, textStatus, jqXHR) {},
						error: function (data, textStatus, jqXHR) {}
					});
				} else {}
			});
			oCreateUserModel.attachRequestFailed(function (oEvent) {
				oBusyDialog.close();
				var sMsg = oEvent.getParameters().responseText;
				sap.m.MessageBox.error(sMsg, {
					styleClass: "sapUiSizeCompact"
				});
			});
			/*	} else {
					sap.m.MessageToast.show("Not changable");
				}*/
		},

		//on group Selection Change
		onGroupSelectionChange: function (oEvent) {
			oEvent.getSource().setValueState("None");
		},

		//function to validate email id format
		validateEmail: function (value) {
			var oRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
			var sText = value;
			if (oRegex.test(sText)) {
				return "S";
			} else {
				return "E";
			}
		},

		//on cancel 
		onUserCancel: function () {
			var router = sap.ui.core.UIComponent.getRouterFor(this);
			router.navTo("RouteUserProv");
		},

		//on press update button
		onPressUpdateUserFrag: function () {
			var that = this;

			//for Sales Oraganization
			var saleOrgAttr1 = this.getView().byId("ID_TBL_VIEW_PROV_SELS_ORG").getModel("SlaesOrgViewSet").getData().results;
			var salesOrgArrTemp = [];
			for (var r = 0; r < saleOrgAttr1.length; r++) {
				salesOrgArrTemp.push(saleOrgAttr1[r].SalesOrg);
			}

			//customer Number
			var custNuAttr6 = this.getView().byId("ID_TBL_VIEW_PROV_CUST_NUM").getModel("CustomerNumViewSet").getData().results;
			var custNoArrTemp = [];
			for (var r = 0; r < custNuAttr6.length; r++) {
				custNoArrTemp.push(custNuAttr6[r].CustCode);
			}

			//distributtion channel
			var custNuAttr2 = this.getView().byId("ID_TBL_VIEW_PROV_DISTRU_CHANL").getModel("DistributionChannelViewSet").getData().results;
			var distribuChannleTemp = [];
			for (var r = 0; r < custNuAttr2.length; r++) {
				distribuChannleTemp.push(custNuAttr2[r].DistChl);
			}

			//district
			var custNuAttr3 = this.getView().byId("ID_TBL_VIEW_PROV_DISTRICT").getModel("DistrictViewSet").getData().results;
			var districtTemp = [];
			for (var r = 0; r < custNuAttr3.length; r++) {
				districtTemp.push(custNuAttr3[r].Division);
			}

			//material group
			var custNuAttr4 = this.getView().byId("ID_TBL_VIEW_PROV_MAT_GRP_").getModel("MaterialGrpViewSet").getData().results;
			var materialGrpTemp = [];
			for (var r = 0; r < custNuAttr4.length; r++) {
				materialGrpTemp.push(custNuAttr4[r].Materialgroup);
			}

			//material group one
			var custNuAttr5 = this.getView().byId("ID_TBL_VIEW_PROV_MAT_GRP_ONE").getModel("MaterialGrpOneViewSet").getData().results;
			var materialGrpOneTemp = [];
			for (var r = 0; r < custNuAttr5.length; r++) {
				materialGrpOneTemp.push(custNuAttr5[r].MaterialGroup1);
			}

			//material group 4
			var custNuAttr7 = this.getView().byId("ID_TBL_VIEW_PROV_MAT_GRP_4").getModel("MaterialGrp4ViewSet").getData().results;
			var materialGrp4Temp = [];
			for (var r = 0; r < custNuAttr7.length; r++) {
				materialGrp4Temp.push(custNuAttr7[r].Materialgroup4);
			}

			//switch check 
			var switchData = this.getView().getModel("SwitchOnOffSet").getData();

			if (switchData.SalesOrgSwitch) {
				salesOrgArrTemp = [];
				salesOrgArrTemp.push("*");
			}

			if (switchData.CustomerSwitch) {
				custNoArrTemp = [];
				custNoArrTemp.push("*");
			}

			if (switchData.DistribuChanlSwitch) {
				distribuChannleTemp = [];
				distribuChannleTemp.push("*");
			}

			if (switchData.DistrictSwitch) {
				districtTemp = [];
				districtTemp.push("*");
			}

			if (switchData.MaterialGrpSwitch) {
				materialGrpTemp = [];
				materialGrpTemp.push("*");
			}

			if (switchData.MaterialGrpOneSwitch) {
				materialGrpOneTemp = [];
				materialGrpOneTemp.push("*");
			}

			if (switchData.MaterialGrp4Switch) {
				materialGrp4Temp = [];
				materialGrp4Temp.push("*");
			}

			var oUserDetail = this.getView().byId("ID_PROV_SIMF_USER_DET").getModel("UserModelSet").getData();
			var idUser = oUserDetail.id;
			var firstName = oUserDetail.firstName.trim();
			var lastName = oUserDetail.lastName.trim();
			var email = oUserDetail.email.trim();
			var selectedCountry = oUserDetail.selectedCountry.trim();
			var countryName = this.getView().byId("countryId").getSelectedItem().getText();
			var phoneNo = oUserDetail.phoneNo.trim();
			var grpSelected = oUserDetail.groupSelected;
			var grps = grpSelected.join(",");
			var fullName = firstName + " " + lastName;
			var errCount = 0;

			//first Name check
			if (firstName === undefined || firstName === "") {
				errCount++;
				oUserDetail.firstNameValueState = "Error";
			} else {
				oUserDetail.firstNameValueState = "None";
			}

			//Last Name check
			if (lastName === undefined || lastName === "") {
				errCount++;
				oUserDetail.lastNameValueState = "Error";
			} else {
				oUserDetail.lastNameValueState = "None";
			}

			//Country check
			if (selectedCountry === undefined || selectedCountry === "") {
				errCount++;
				oUserDetail.countryValueState = "Error";
			} else {
				oUserDetail.countryValueState = "None";
			}

			//Country check
			if (email === undefined || email === "") {
				errCount++;
				oUserDetail.emailValueState = "Error";
			} else {
				oUserDetail.emailValueState = "None";
			}

			//group check
			if (grpSelected === undefined || grpSelected.length === 0) {
				errCount++;
				oUserDetail.groupValueState = "Error";
			} else {
				oUserDetail.groupValueState = "None";
			}

			if (errCount > 0) {
				var msg = this.i18nModel.getProperty("fillAllMandatoryFields");
				sap.m.MessageToast.show(msg);
				this.getView().byId("ID_PROV_SIMF_USER_DET").getModel("UserModelSet").refresh();
				return;
			}

			//check valid email
			var emailVal = that.validateEmail(email);
			if (emailVal === "E") {
				var msg1 = this.i18nModel.getProperty("enterEmailisNotValidFormat");
				sap.m.MessageToast.show(msg1);
				oUserDetail.emailValueState = "Error";
				this.getView().byId("ID_PROV_SIMF_USER_DET").getModel("UserModelSet").refresh();
				return;
			}

			//check data access assigned all
			// if (salesOrgArrTemp.join("@").trim() === "" ||
			// 	distribuChannleTemp.join("@").trim() === "" ||
			// 	districtTemp.join("@").trim() === "" ||
			// 	materialGrpTemp.join("@").trim() === "" ||
			// 	materialGrp4Temp.join("@").trim() === "" ||
			// 	custNoArrTemp.join("@").trim() === ""
			// 	/*||
			// 		materialGrpOneTemp.join("@").trim() === ""*/
			// ) {
			// 	var msgDataAc = this.i18nModel.getProperty("assignValueToDataAccessControll");
			// 	sap.m.MessageToast.show(msgDataAc);
			// 	return;
			// }

			//add groups
			var groupsTemp = [];
			for (var i = 0; i < grpSelected.length; i++) {
				groupsTemp.push({
					"value": grpSelected[i],
					"display": grpSelected[i]
				});
			}

			//	if (sFlagCheck) {
			//	if (true) {
			var sUrl = "/IDPService/service/scim/Users/" + idUser;
			var oPayload = {
				"id": idUser,
				"groups": groupsTemp,
				"userName": fullName,
				"name": {
					"givenName": firstName,
					"familyName": lastName
				},
				"emails": [{
					"value": email
				}],
				"displayName": firstName + " " + lastName,
				"addresses": [{
					"type": "home",
					"country": selectedCountry
				}],
				"phoneNumbers": [{
					"value": phoneNo,
					"type": "mobile"
				}],
				// "urn:sap:cloud:scim:schemas:extension:custom:2.0:User": {
				// 	"attributes": [{
				// 			"name": "customAttribute1",
				// 			"value": salesOrgArrTemp.join("@")
				// 		}, {
				// 			"name": "customAttribute2",
				// 			"value": distribuChannleTemp.join("@")
				// 		}, {
				// 			"name": "customAttribute3",
				// 			"value": districtTemp.join("@")
				// 		}, {
				// 			"name": "customAttribute4",
				// 			"value": materialGrpTemp.join("@")
				// 		}, {
				// 			"name": "customAttribute5",
				// 			"value": materialGrp4Temp.join("@")
				// 		}, {
				// 			"name": "customAttribute6",
				// 			"value": custNoArrTemp.join("@")
				// 		}
				// 		/*, {
				// 													"name": "customAttribute7",
				// 													"value": materialGrpOneTemp.join("@")
				// 												}*/
				// 	]
				// },
				//"password": "Resetme1",
				//"passwordPolicy": "https://accounts.sap.com/policy/passwords/sap/enterprise/1.0",
				"active": true,
				"sendMail": "false",
				"mailVerified": "true",
				"schemas": oUserDetail.schemas
			};
			var oHeader = {
				"Content-Type": "application/scim+json"
			};
			var oCreateUserModel = new sap.ui.model.json.JSONModel();
			var oBusyDialog = new sap.m.BusyDialog();
			oBusyDialog.open();
			oCreateUserModel.loadData(sUrl, JSON.stringify(oPayload), true, "PUT", false, false, oHeader);
			oCreateUserModel.attachRequestCompleted(function (oEvent) {
				oBusyDialog.close();
				if (oEvent.getParameter("success")) {
					sap.m.MessageToast.show(oEvent.getSource().getData().id + " User changes is updated successfully");
					var oModelRef = new sap.ui.model.json.JSONModel({
						refreshUser: true
					});
					sap.ui.getCore().setModel(oModelRef, "refreshUserModel");
					var router = sap.ui.core.UIComponent.getRouterFor(that);
					router.navTo("RouteUserProv");
					var postData = {
						"userId": oEvent.getSource().getData().id,
						"email": email,
						"country": countryName,
						"userGroup": grps,
						"firstName": firstName,
						"lastName": lastName
					};
					jQuery.ajax({
						type: "PUT",
						data: JSON.stringify(postData),
						contentType: "application/json",
						url: "/DKSHJavaService/userDetails/updateUser",
						dataType: "json",
						async: false,
						success: function (data, textStatus, jqXHR) {},
						error: function (data, textStatus, jqXHR) {}
					});
				} else {

				}
			});
			oCreateUserModel.attachRequestFailed(function (oEvent) {
				oBusyDialog.close();
				var sMsg = oEvent.getParameters().responseText;
				sap.m.MessageBox.error(sMsg, {
					styleClass: "sapUiSizeCompact"
				});
			});
		},

		//on chnage sales organization switch
		onChangeSwitchSalesOrganization: function (oEvent) {
			var that = this;
			var msg = this.i18nModel.getProperty("AreYouSureWantGiveAllAccess");
			//oEvent
			if (oEvent.getParameters().state) {
				sap.m.MessageBox.confirm(
					msg, {
						actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
						initialFocus: MessageBox.Action.NO,
						onClose: function (oAction) {
							if (oAction === sap.m.MessageBox.Action.YES) {
								var tblModel = that.getView().byId("ID_TBL_VIEW_PROV_SELS_ORG").getModel("SlaesOrgViewSet");
								tblModel.getData().results = [];
								tblModel.refresh();
								var msg1 = that.i18nModel.getProperty("salesOrganizationCountLbl");
								that.getView().byId("ID_PROV_LBL_C_SALS_ORG").setText(msg1 + " (0)");
							} else {
								var mdl = that.getView().getModel("SwitchOnOffSet");
								var model = mdl.getData();
								model.SalesOrgSwitch = false;
								mdl.refresh();
							}
						}
					}
				);
			}
		},

		////for Customer Switch
		onChangeSwitchCustomerNumber: function (oEvent) {
			var that = this;
			var msg = this.i18nModel.getProperty("AreYouSureWantGiveAllAccess");
			//oEvent
			if (oEvent.getParameters().state) {
				sap.m.MessageBox.confirm(
					msg, {
						actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
						initialFocus: MessageBox.Action.NO,
						onClose: function (oAction) {
							if (oAction === sap.m.MessageBox.Action.YES) {
								var tblModel = that.getView().byId("ID_TBL_VIEW_PROV_CUST_NUM").getModel("CustomerNumViewSet");
								tblModel.getData().results = [];
								tblModel.refresh();
								var msg1 = that.i18nModel.getProperty("customerLblCount");
								that.getView().byId("ID_PROV_LBL_C_CUST_NUM").setText(msg1 + " (0)");
							} else {
								var mdl = that.getView().getModel("SwitchOnOffSet");
								var model = mdl.getData();
								model.CustomerSwitch = false;
								mdl.refresh();
							}
						}
					}
				);
			}
		},

		////for Material Switch
		onChangeSwitchMaterialNo: function (oEvent) {
			var that = this;
			var msg = this.i18nModel.getProperty("AreYouSureWantGiveAllAccess");
			//oEvent
			if (oEvent.getParameters().state) {
				sap.m.MessageBox.confirm(
					msg, {
						actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
						initialFocus: MessageBox.Action.NO,
						onClose: function (oAction) {
							if (oAction === sap.m.MessageBox.Action.YES) {
								var tblModel = that.getView().byId("ID_TBL_VIEW_PROV_MATERIAL_NUM").getModel("MaterialNumViewSet");
								tblModel.getData().results = [];
								tblModel.refresh();
								var msg1 = that.i18nModel.getProperty("materialNumberCountLbl");
								that.getView().byId("ID_PROV_LBL_C_Mat_NUM").setText(msg1 + " (0)");
							} else {
								var mdl = that.getView().getModel("SwitchOnOffSet");
								var model = mdl.getData();
								model.MaterialNumSwitch = false;
								mdl.refresh();
							}
						}
					}
				);
			}
		},

		////for Distribution channel Switch
		onChangeSwitchDistributionChanl: function (oEvent) {
			var that = this;
			var msg = this.i18nModel.getProperty("AreYouSureWantGiveAllAccess");
			//oEvent
			if (oEvent.getParameters().state) {
				sap.m.MessageBox.confirm(
					msg, {
						actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
						initialFocus: MessageBox.Action.NO,
						onClose: function (oAction) {
							if (oAction === sap.m.MessageBox.Action.YES) {
								var tblModel = that.getView().byId("ID_TBL_VIEW_PROV_DISTRU_CHANL").getModel("DistributionChannelViewSet");
								tblModel.getData().results = [];
								tblModel.refresh();
								var msg1 = that.i18nModel.getProperty("distributionChannelCountLbl");
								that.getView().byId("ID_PROV_LBL_C_DISTRI_CHNL").setText(msg1 + " (0)");
							} else {
								var mdl = that.getView().getModel("SwitchOnOffSet");
								var model = mdl.getData();
								model.DistribuChanlSwitch = false;
								mdl.refresh();
							}
						}
					}
				);
			}
		},

		////for Material Group Switch
		onChangeSwitchMaterialGroup: function (oEvent) {
			var that = this;
			var msg = this.i18nModel.getProperty("AreYouSureWantGiveAllAccess");
			//oEvent
			if (oEvent.getParameters().state) {
				sap.m.MessageBox.confirm(
					msg, {
						actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
						initialFocus: MessageBox.Action.NO,
						onClose: function (oAction) {
							if (oAction === sap.m.MessageBox.Action.YES) {
								var tblModel = that.getView().byId("ID_TBL_VIEW_PROV_MAT_GRP_").getModel("MaterialGrpViewSet");
								tblModel.getData().results = [];
								tblModel.refresh();
								var msg1 = that.i18nModel.getProperty("materialGroupCountLbl");
								that.getView().byId("ID_PROV_LBL_C_MAT_GRP").setText(msg1 + " (0)");
							} else {
								var mdl = that.getView().getModel("SwitchOnOffSet");
								var model = mdl.getData();
								model.MaterialGrpSwitch = false;
								mdl.refresh();
							}
						}
					}
				);
			}
		},

		////for Material Group One Switch
		onChangeSwitchMaterialGroupOne: function (oEvent) {
			var that = this;
			var msg = this.i18nModel.getProperty("AreYouSureWantGiveAllAccess");
			//oEvent
			if (oEvent.getParameters().state) {
				sap.m.MessageBox.confirm(
					msg, {
						actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
						initialFocus: MessageBox.Action.NO,
						onClose: function (oAction) {
							if (oAction === sap.m.MessageBox.Action.YES) {
								var tblModel = that.getView().byId("ID_TBL_VIEW_PROV_MAT_GRP_ONE").getModel("MaterialGrpOneViewSet");
								tblModel.getData().results = [];
								tblModel.refresh();
								var msg1 = that.i18nModel.getProperty("materialGroupOneCountLbl");
								that.getView().byId("ID_PROV_LBL_C_MAT_GRP_ONE").setText(msg1 + " (0)");
							} else {
								var mdl = that.getView().getModel("SwitchOnOffSet");
								var model = mdl.getData();
								model.MaterialGrpOneSwitch = false;
								mdl.refresh();
							}
						}
					}
				);
			}
		},

		////for Material Group 4 Switch
		onChangeSwitchMaterialGroup4: function (oEvent) {
			var that = this;
			var msg = this.i18nModel.getProperty("AreYouSureWantGiveAllAccess");
			//oEvent
			if (oEvent.getParameters().state) {
				sap.m.MessageBox.confirm(
					msg, {
						actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
						initialFocus: MessageBox.Action.NO,
						onClose: function (oAction) {
							if (oAction === sap.m.MessageBox.Action.YES) {
								var tblModel = that.getView().byId("ID_TBL_VIEW_PROV_MAT_GRP_4").getModel("MaterialGrp4ViewSet");
								tblModel.getData().results = [];
								tblModel.refresh();
								var msg1 = that.i18nModel.getProperty("materialGroup4CountLbl");
								that.getView().byId("ID_PROV_LBL_C_MAT_GRP_4").setText(msg1 + " (0)");
							} else {
								var mdl = that.getView().getModel("SwitchOnOffSet");
								var model = mdl.getData();
								model.MaterialGrp4Switch = false;
								mdl.refresh();
							}
						}
					}
				);
			}
		},

		////for District Switch
		onChangeSwitchDistrict: function (oEvent) {
			var that = this;
			var msg = this.i18nModel.getProperty("AreYouSureWantGiveAllAccess");
			//oEvent
			if (oEvent.getParameters().state) {
				sap.m.MessageBox.confirm(
					msg, {
						actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
						initialFocus: MessageBox.Action.NO,
						onClose: function (oAction) {
							if (oAction === sap.m.MessageBox.Action.YES) {
								var tblModel = that.getView().byId("ID_TBL_VIEW_PROV_DISTRICT").getModel("DistrictViewSet");
								tblModel.getData().results = [];
								tblModel.refresh();
								var msg1 = that.i18nModel.getProperty("distrcitCountLbl");
								that.getView().byId("ID_PROV_LBL_C_MAT_DISTRCT").setText(msg1 + " (0)");
							} else {
								var mdl = that.getView().getModel("SwitchOnOffSet");
								var model = mdl.getData();
								model.DistrictSwitch = false;
								mdl.refresh();
							}
						}
					}
				);
			}
		},

		//expand or collapse panel
		expandOrCollapaseAllPanel: function (val) {
			//for all selected true / false
			var omodelPanel = new sap.ui.model.json.JSONModel({

				SalesOrgPanel: val,
				CustomerPanel: val,
				MaterialNumPanel: val,
				DistribuChanlPanel: val,
				MaterialGrpPanel: val,
				MaterialGrpOnePanel: val,
				DistrictPanel: val,
				MaterialGrp4Panel: val,
				SalesOrgPanel1: val,
				CustomerPanel1: val,
				MaterialNumPanel1: val,
				DistribuChanlPanel1: val,
				MaterialGrpPanel1: val,
				MaterialGrpOnePanel1: val,
				DistrictPanel1: val,
				MaterialGrp4Panel1: val,
				PlantPanel: val,
				CountryPanel: val,
				OrderTypePanel: val,
				StorLocPanel: val,
				MaterialGrp2Panel: val,
				MaterialGrp3Panel: val,
				MaterialGrp5Panel: val,
				PH1Panel: val,
				PH2Panel: val,
				PH3Panel: val,
				PH4Panel: val,
				PH5Panel: val,
				PH6Panel: val,
				PH7Panel: val,
				CGPanel: val,
				CG1Panel: val,
				CG2Panel: val,
				CG3Panel: val,
				CG4Panel: val,
				CG5Panel: val,
				MatPanel: val,
				Dis1Panel: val

			});
			this.getView().setModel(omodelPanel, "PanelOnOffSet");
			this.getView().getModel("PanelOnOffSet").refresh(true);
		},
		onPressPobjectPanel: function (val) {
			var PanelPobjectMdl = new JSONModel();
			PanelPobjectMdl.setData({
				PObjectPanel: val
			});
			this.getView().setModel(PanelPobjectMdl, "PanelPobjectMdl");
			this.getView().getModel("PanelPobjectMdl").refresh(true);
		},
		//expand all Panel
		onPressExpandAll: function () {
			this.expandOrCollapaseAllPanel(true);
		},

		//expand all Panel
		onPressCollapseAll: function () {
			this.expandOrCollapaseAllPanel(false);
		},

		//////////////////////////////////Material Group Four//////////////////////////////////////////
		//	f4 for Material Group 4
		handleValueHelpMaterialGroup4: function (oEvent) {
			var that = this;
			if (!that.materialGroup4Frag) {
				that.materialGroup4Frag = sap.ui.xmlfragment("com.incture.cherrywork.newdac.fragments.MaterialGroup4",
					that);
				that.getView().addDependent(that.materialGroup4Frag);
			}
			that.readMaterialGroup4();
		},

		//	on conform Material Group 4
		onConfirmChangeMaterialGroup4: function (oEvent) {
			oEvent.getSource().getBinding("items").filter([]);
			var selectedContext = oEvent.getParameters().selectedContexts;
			var oSelsOrgDet = this.getView().byId("ID_TBL_VIEW_PROV_MAT_GRP_4").getModel("MaterialGrp4ViewSet");
			//remove duplicate
			var duplicate = [];
			var countDup = 0;
			var nonDupArray = [];
			for (var i = 0; i < selectedContext.length; i++) {
				countDup = 0;
				for (var j = 0; j < oSelsOrgDet.getData().results.length; j++) {

					if (selectedContext[i].getObject().Materialgroup4 === oSelsOrgDet.getData().results[j].Materialgroup4) {
						duplicate.push(selectedContext[i].getObject().Materialgroup4);
						countDup++;
					}
				}
				if (countDup === 0) {
					nonDupArray.push(selectedContext[i].getObject());
				}
			}

			//if duplicate return
			if (duplicate.length > 0) {
				var msg = this.i18nModel.getProperty("alreadyPresentF4SelctionDupMsg");
				sap.m.MessageToast.show(msg + " " + duplicate.join(", "));
			}

			for (var i = 0; i < nonDupArray.length; i++) {
				var selectedObj = nonDupArray[i];
				oSelsOrgDet.getData().results.push({
					"Materialgroup4": selectedObj.Materialgroup4,
					"Matgroup4desc": selectedObj.Matgroup4desc
				});
			}
			oSelsOrgDet.setSizeLimit(oSelsOrgDet.getData().results.length);
			oSelsOrgDet.refresh();
			var msg1 = this.i18nModel.getProperty("materialGroup4CountLbl");
			this.getView().byId("ID_PROV_LBL_C_MAT_GRP_4").setText(msg1 + " (" + oSelsOrgDet.getData().results.length + ")");
		},

		//	on cancel Material Group 4
		onCancelChangeMaterialGroup4: function (oEvent) {},

		//live search Material Group 4
		onLiveChangeMaterialGroup4: function (oEvent) {
			var value = oEvent.getParameters().value;
			var filters = new Array();
			var oFilter = new sap.ui.model.Filter([new sap.ui.model.Filter("Materialgroup4", sap.ui.model.FilterOperator.Contains, value),
				new sap.ui.model.Filter("Matgroup4desc", sap.ui.model.FilterOperator.Contains, value)
			]);
			filters.push(oFilter);
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter(filters);
		},

		//read Material Group 4
		readMaterialGroup4: function () {
			var that = this;
			var lang = "";
			if (sap.ushell) {
				lang = sap.ui.getCore().getConfiguration().getLanguage();
			} else {
				lang = "EN";
			}

			//coment later
			//	lang = "E";
			var busyDialog = new sap.m.BusyDialog();
			busyDialog.open();
			if (!that.oModelMaterialGroup4) {
				var url = encodeURI("/ZSearchHelp_MaterialGroup4Set");
				this.oModelMaterial.read(url, {
					async: true,
					urlParameters: "$filter=Language eq '" + lang.toUpperCase() + "'",
					success: function (oData, oResponse) {

						that.oModelMaterialGroup4 = new sap.ui.model.json.JSONModel({
							results: oData.results
						});
						that.oModelMaterialGroup4.setSizeLimit(oData.results.length);
						that.materialGroup4Frag.setModel(that.oModelMaterialGroup4, "MaterialGrp4Set");
						busyDialog.close();
						that.materialGroup4Frag.open();
					},
					error: function (error) {
						busyDialog.close();
						var errorMsg = JSON.parse(error.responseText);
						errorMsg = errorMsg.error.message.value;
						that.errorMsg(errorMsg);
					}
				});
			} else {
				busyDialog.close();
				//sap.ui.getCore().byId("ID_TBL_PROV_MAT_GRP_4").removeSelections();
				that.materialGroup4Frag.open();
			}
		},

		// delete on click of Material Group 4
		onPressDeleteMaterialGroup4: function (oEvent) {
			var index = oEvent.getSource().getBindingContext("MaterialGrp4ViewSet").sPath.split("/").pop();
			var oModel = this.getView().byId("ID_TBL_VIEW_PROV_MAT_GRP_4").getModel("MaterialGrp4ViewSet");
			oModel.getData().results.splice(index, 1);
			var msg1 = this.i18nModel.getProperty("deletedSuccessfully");
			sap.m.MessageToast.show(msg1);
			oModel.refresh();
			var msg = this.i18nModel.getProperty("materialGroup4CountLbl");
			this.getView().byId("ID_PROV_LBL_C_MAT_GRP_4").setText(msg + " (" + oModel.getData().results.length + ")");

		},

		getPOofUser: function (userId) {
			if (userId) {
				var oPOUserModel = new JSONModel();

				jQuery.ajax({
					type: "GET",
					contentType: "application/json",
					url: "/DKSHJavaService/dac/userWithDetails/" + userId,
					dataType: "json",
					async: false,
					success: function (data, textStatus, jqXHR) {
						oPOUserModel.setData(data);
					}

				});
				this.getView().byId("idPODisp").setModel(oPOUserModel, "oPOUserModel");
				var Data = this.getView().byId("idPODisp").getModel("oPOUserModel").getData();
			}
		},
		// onExpandPO: function (oEvent) {
		// 	var aPath = parseInt(oEvent.getSource().getBindingInfo("headerText").binding.getContext().getPath().split("projects/")[1]);
		// 	var Data = this.getView().byId("idPODisp").getModel("oPOUserModel").getData().projects[aPath].permissionObject.permissionDetails;

		// 	//declaration
		// 	var all_Switch = false;
		// 	var temp_SalesOrgSwitch1 = false;
		// 	var temp_CustomerSwitch1 = false;
		// 	var temp_MaterialNumSwitch1 = false;
		// 	var temp_DistribuChanlSwitch1 = false;
		// 	var temp_MaterialGrpSwitch1 = false;
		// 	var temp_MaterialGrpOneSwitch1 = false;
		// 	var temp_MaterialGrp4Switch1 = false;
		// 	var temp_DistrictSwitch1 = false;
		// 	var temp_PlantSwitch = false;
		// 	var temp_StorLocSwitch = false;
		// 	var temp_CountrySwitch = false;
		// 	var temp_OrderTypeSwitch = false;
		// 	var temp_MaterialGrp2Switch = false;
		// 	var temp_MaterialGrp3Switch = false;
		// 	var temp_MaterialGrp5Switch = false;
		// 	var temp_ProdHierarchy1Switch = false;
		// 	var temp_ProdHierarchy2Switch = false;
		// 	var temp_ProdHierarchy3Switch = false;
		// 	var temp_ProdHierarchy4Switch = false;
		// 	var temp_ProdHierarchy5Switch = false;
		// 	var temp_ProdHierarchy6Switch = false;
		// 	var temp_ProdHierarchy7Switch = false;
		// 	var temp_CustomerGrp1Switch = false;
		// 	var temp_CustomerGrp2Switch = false;
		// 	var temp_CustomerGrp3Switch = false;
		// 	var temp_CustomerGrp4Switch = false;
		// 	var temp_CustomerGrp5Switch = false;
		// 	var temp_CustomerGrpSwitch = false;
		// 	var temp_District1Switch = false;
		// 	var temp_MaterialSwitch = false;

		// 	//variable declaration 
		// 	var salesOrg1 = [];
		// 	var custNum1 = [];
		// 	var distriChanne1 = [];
		// 	var division = [];
		// 	var materialGrp1 = [];
		// 	var materialGrpOne1 = [];
		// 	var materialGrp41 = [];
		// 	var materialNum = [];
		// 	var plant = [];
		// 	var storloc = [];
		// 	var country = [];
		// 	var ordertype = [];
		// 	var materialGrp2 = [];
		// 	var materialGrp3 = [];
		// 	var materialGrp5 = [];
		// 	var prodhierarchy1 = [];
		// 	var prodhierarchy2 = [];
		// 	var prodhierarchy3 = [];
		// 	var prodhierarchy4 = [];
		// 	var prodhierarchy5 = [];
		// 	var prodhierarchy6 = [];
		// 	var prodhierarchy7 = [];
		// 	var cusgrp = [];
		// 	var cusgrp1 = [];
		// 	var cusgrp2 = [];
		// 	var cusgrp3 = [];
		// 	var cusgrp4 = [];
		// 	var cusgrp5 = [];
		// 	var district1 = [];
		// 	var material = [];

		// 	//sales organization

		// 	for (var i = 0; i < Data.length; i++) {

		// 		if (Data.length === 29) {
		// 			var cn = 0;
		// 			for (var k = 0; k < Data.length; k++) {
		// 				if (Data[k].attributeValue === "*") {
		// 					cn++;
		// 				}
		// 			}
		// 			if (cn === 29) {

		// 				all_Switch = true;
		// 				this.switchCount = 29;
		// 			}

		// 		}

		// 		if (Data[i].attributeId === "ATR01" && Data[i].attributeValue !== "*") {
		// 			salesOrg1.push({
		// 				"attributeValue": Data[i].attributeValue,
		// 				"attributeValueDesc": Data[i].attributeValueDesc,
		// 				"inclusion": Data[i].inclusion
		// 			});
		// 		} else if (Data[i].attributeId === "ATR01" && Data[i].attributeValue === "*") {
		// 			temp_SalesOrgSwitch1 = true;
		// 			salesOrg1 = [];
		// 		}
		// 	}
		// 	for (var i = 0; i < Data.length; i++) {
		// 		if (Data[i].attributeId === "ATR06" && Data[i].attributeValue !== "*") {
		// 			custNum1.push({
		// 				"attributeValue": Data[i].attributeValue,
		// 				"attributeValueDesc": Data[i].attributeValueDesc,
		// 				"inclusion": Data[i].inclusion
		// 			});
		// 		} else if (Data[i].attributeId === "ATR06" && Data[i].attributeValue === "*") {
		// 			temp_CustomerSwitch1 = true;
		// 			custNum1 = [];
		// 		}
		// 	}
		// 	for (var i = 0; i < Data.length; i++) {
		// 		if (Data[i].attributeId === "ATR02" && Data[i].attributeValue !== "*") {
		// 			distriChanne1.push({
		// 				"attributeValue": Data[i].attributeValue,
		// 				"attributeValueDesc": Data[i].attributeValueDesc,
		// 				"inclusion": Data[i].inclusion
		// 			});
		// 		} else if (Data[i].attributeId === "ATR02" && Data[i].attributeValue === "*") {
		// 			temp_DistribuChanlSwitch1 = true;
		// 			distriChanne1 = [];
		// 		}
		// 	}
		// 	for (var i = 0; i < Data.length; i++) {
		// 		if (Data[i].attributeId === "ATR04" && Data[i].attributeValue !== "*") {
		// 			materialGrp1.push({
		// 				"attributeValue": Data[i].attributeValue,
		// 				"attributeValueDesc": Data[i].attributeValueDesc,
		// 				"inclusion": Data[i].inclusion
		// 			});
		// 		} else if (Data[i].attributeId === "ATR04" && Data[i].attributeValue === "*") {
		// 			temp_MaterialGrpSwitch1 = true;
		// 			materialGrp1 = [];
		// 		}
		// 	}
		// 	for (var i = 0; i < Data.length; i++) {
		// 		if (Data[i].attributeId === "ATR11" && Data[i].attributeValue !== "*") {
		// 			materialGrpOne1.push({
		// 				"attributeValue": Data[i].attributeValue,
		// 				"attributeValueDesc": Data[i].attributeValueDesc,
		// 				"inclusion": Data[i].inclusion
		// 			});
		// 		} else if (Data[i].attributeId === "ATR11" && Data[i].attributeValue === "*") {
		// 			temp_MaterialGrpOneSwitch1 = true;
		// 			materialGrpOne1 = [];
		// 		}
		// 	}

		// 	for (var i = 0; i < Data.length; i++) {
		// 		if (Data[i].attributeId === "ATR05" && Data[i].attributeValue !== "*") {
		// 			materialGrp41.push({
		// 				"attributeValue": Data[i].attributeValue,
		// 				"attributeValueDesc": Data[i].attributeValueDesc,
		// 				"inclusion": Data[i].inclusion
		// 			});
		// 		} else if (Data[i].attributeId === "ATR05" && Data[i].attributeValue === "*") {
		// 			temp_MaterialGrp4Switch1 = true;
		// 			materialGrp41 = [];
		// 		}
		// 	}
		// 	for (var i = 0; i < Data.length; i++) {
		// 		if (Data[i].attributeId === "ATR03" && Data[i].attributeValue !== "*") {
		// 			division.push({
		// 				"attributeValue": Data[i].attributeValue,
		// 				"attributeValueDesc": Data[i].attributeValueDesc,
		// 				"inclusion": Data[i].inclusion
		// 			});
		// 		} else if (Data[i].attributeId === "ATR03" && Data[i].attributeValue === "*") {
		// 			temp_DistrictSwitch1 = true;
		// 			division = [];
		// 		}
		// 	}
		// 	//plant
		// 	for (var i = 0; i < Data.length; i++) {
		// 		if (Data[i].attributeId === "ATR09" && Data[i].attributeValue !== "*") {
		// 			plant.push({
		// 				"attributeValue": Data[i].attributeValue,
		// 				"attributeValueDesc": Data[i].attributeValueDesc,
		// 				"inclusion": Data[i].inclusion
		// 			});
		// 		} else if (Data[i].attributeId === "ATR09" && Data[i].attributeValue === "*") {
		// 			temp_PlantSwitch = true;
		// 			plant = [];
		// 		}
		// 	}
		// 	for (var i = 0; i < Data.length; i++) {
		// 		if (Data[i].attributeId === "ATR29" && Data[i].attributeValue !== "*") {
		// 			country.push({
		// 				"attributeValue": Data[i].attributeValue,
		// 				"attributeValueDesc": Data[i].attributeValueDesc,
		// 				"inclusion": Data[i].inclusion
		// 			});
		// 		} else if (Data[i].attributeId === "ATR29" && Data[i].attributeValue === "*") {
		// 			temp_CountrySwitch = true;
		// 			country = [];
		// 		}
		// 	}

		// 	for (var i = 0; i < Data.length; i++) {
		// 		if (Data[i].attributeId === "ATR08" && Data[i].attributeValue !== "*") {
		// 			ordertype.push({
		// 				"attributeValue": Data[i].attributeValue,
		// 				"attributeValueDesc": Data[i].attributeValueDesc,
		// 				"inclusion": Data[i].inclusion
		// 			});
		// 		} else if (Data[i].attributeId === "ATR08" && Data[i].attributeValue === "*") {
		// 			temp_OrderTypeSwitch = true;
		// 			ordertype = [];
		// 		}
		// 	}
		// 	for (var i = 0; i < Data.length; i++) {
		// 		if (Data[i].attributeId === "ATR10" && Data[i].attributeValue !== "*") {
		// 			storloc.push({
		// 				"attributeValue": Data[i].attributeValue,
		// 				"attributeValueDesc": Data[i].attributeValueDesc,
		// 				"inclusion": Data[i].inclusion
		// 			});
		// 		} else if (Data[i].attributeId === "ATR10" && Data[i].attributeValue === "*") {
		// 			temp_StorLocSwitch = true;
		// 			storloc = [];
		// 		}
		// 	}

		// 	for (var i = 0; i < Data.length; i++) {
		// 		if (Data[i].attributeId === "ATR12" && Data[i].attributeValue !== "*") {
		// 			materialGrp2.push({
		// 				"attributeValue": Data[i].attributeValue,
		// 				"attributeValueDesc": Data[i].attributeValueDesc,
		// 				"inclusion": Data[i].inclusion
		// 			});
		// 		} else if (Data[i].attributeId === "ATR12" && Data[i].attributeValue === "*") {
		// 			temp_MaterialGrp2Switch = true;
		// 			materialGrp2 = [];
		// 		}
		// 	}
		// 	for (var i = 0; i < Data.length; i++) {
		// 		if (Data[i].attributeId === "ATR13" && Data[i].attributeValue !== "*") {
		// 			materialGrp3.push({
		// 				"attributeValue": Data[i].attributeValue,
		// 				"attributeValueDesc": Data[i].attributeValueDesc,
		// 				"inclusion": Data[i].inclusion
		// 			});
		// 		} else if (Data[i].attributeId === "ATR13" && Data[i].attributeValue === "*") {
		// 			temp_MaterialGrp3Switch = true;
		// 			materialGrp3 = [];
		// 		}
		// 	}
		// 	for (var i = 0; i < Data.length; i++) {
		// 		if (Data[i].attributeId === "ATR14" && Data[i].attributeValue !== "*") {
		// 			materialGrp5.push({
		// 				"attributeValue": Data[i].attributeValue,
		// 				"attributeValueDesc": Data[i].attributeValueDesc,
		// 				"inclusion": Data[i].inclusion
		// 			});
		// 		} else if (Data[i].attributeId === "ATR14" && Data[i].attributeValue === "*") {

		// 			temp_MaterialGrp5Switch = true;
		// 			materialGrp5 = [];
		// 		}
		// 	}
		// 	for (var i = 0; i < Data.length; i++) {
		// 		if (Data[i].attributeId === "ATR15" && Data[i].attributeValue !== "*") {
		// 			prodhierarchy1.push({
		// 				"attributeValue": Data[i].attributeValue,
		// 				"attributeValueDesc": Data[i].attributeValueDesc,
		// 				"inclusion": Data[i].inclusion
		// 			});
		// 		} else if (Data[i].attributeId === "ATR15" && Data[i].attributeValue === "*") {
		// 			temp_ProdHierarchy1Switch = true;
		// 			prodhierarchy1 = [];
		// 		}
		// 	}
		// 	for (var i = 0; i < Data.length; i++) {
		// 		if (Data[i].attributeId === "ATR16" && Data[i].attributeValue !== "*") {
		// 			prodhierarchy2.push({
		// 				"attributeValue": Data[i].attributeValue,
		// 				"attributeValueDesc": Data[i].attributeValueDesc,
		// 				"inclusion": Data[i].inclusion
		// 			});
		// 		} else if (Data[i].attributeId === "ATR16" && Data[i].attributeValue === "*") {
		// 			temp_ProdHierarchy2Switch = true;
		// 			prodhierarchy2 = [];
		// 		}
		// 	}
		// 	for (var i = 0; i < Data.length; i++) {
		// 		if (Data[i].attributeId === "ATR17" && Data[i].attributeValue !== "*") {
		// 			prodhierarchy3.push({
		// 				"attributeValue": Data[i].attributeValue,
		// 				"attributeValueDesc": Data[i].attributeValueDesc,
		// 				"inclusion": Data[i].inclusion
		// 			});
		// 		} else if (Data[i].attributeId === "ATR17" && Data[i].attributeValue === "*") {
		// 			temp_ProdHierarchy3Switch = true;
		// 			prodhierarchy3 = [];
		// 		}
		// 	}
		// 	for (var i = 0; i < Data.length; i++) {
		// 		if (Data[i].attributeId === "ATR18" && Data[i].attributeValue !== "*") {
		// 			prodhierarchy4.push({
		// 				"attributeValue": Data[i].attributeValue,
		// 				"attributeValueDesc": Data[i].attributeValueDesc,
		// 				"inclusion": Data[i].inclusion
		// 			});
		// 		} else if (Data[i].attributeId === "ATR18" && Data[i].attributeValue === "*") {
		// 			temp_ProdHierarchy4Switch = true;
		// 			prodhierarchy4 = [];
		// 		}
		// 	}
		// 	for (var i = 0; i < Data.length; i++) {
		// 		if (Data[i].attributeId === "ATR19" && Data[i].attributeValue !== "*") {
		// 			prodhierarchy5.push({
		// 				"attributeValue": Data[i].attributeValue,
		// 				"attributeValueDesc": Data[i].attributeValueDesc,
		// 				"inclusion": Data[i].inclusion
		// 			});
		// 		} else if (Data[i].attributeId === "ATR19" && Data[i].attributeValue === "*") {
		// 			temp_ProdHierarchy5Switch = true;
		// 			prodhierarchy5 = [];
		// 		}
		// 	}
		// 	for (var i = 0; i < Data.length; i++) {
		// 		if (Data[i].attributeId === "ATR20" && Data[i].attributeValue !== "*") {
		// 			prodhierarchy6.push({
		// 				"attributeValue": Data[i].attributeValue,
		// 				"attributeValueDesc": Data[i].attributeValueDesc,
		// 				"inclusion": Data[i].inclusion
		// 			});
		// 		} else if (Data[i].attributeId === "ATR20" && Data[i].attributeValue === "*") {
		// 			temp_ProdHierarchy6Switch = true;
		// 			prodhierarchy6 = [];
		// 		}
		// 	}
		// 	for (var i = 0; i < Data.length; i++) {
		// 		if (Data[i].attributeId === "ATR21" && Data[i].attributeValue !== "*") {
		// 			prodhierarchy7.push({
		// 				"attributeValue": Data[i].attributeValue,
		// 				"attributeValueDesc": Data[i].attributeValueDesc,
		// 				"inclusion": Data[i].inclusion
		// 			});
		// 		} else if (Data[i].attributeId === "ATR21" && Data[i].attributeValue === "*") {
		// 			temp_ProdHierarchy7Switch = true;
		// 			prodhierarchy7 = [];
		// 		}
		// 	}
		// 	/*	for (var i=0; i < Data.length; i++){
		//                     if(Data[i].attributeId === "ATR21" && Data[i].attributeValue !== "*"){
		//                      prodhierarchy7.push({
		// 							"attributeValue": Data[i].attributeValue,
		//                                  "attributeValueDesc": Data[i].attributeValueDesc,
		//                                  "inclusion" : Data[i].inclusion
		// 						});
		//                     }
		// 				}*/
		// 	for (var i = 0; i < Data.length; i++) {
		// 		if (Data[i].attributeId === "ATR23" && Data[i].attributeValue !== "*") {
		// 			cusgrp1.push({
		// 				"attributeValue": Data[i].attributeValue,
		// 				"attributeValueDesc": Data[i].attributeValueDesc,
		// 				"inclusion": Data[i].inclusion
		// 			});
		// 		} else if (Data[i].attributeId === "ATR23" && Data[i].attributeValue === "*") {
		// 			temp_CustomerGrp1Switch = true;
		// 			cusgrp1 = [];
		// 		}
		// 	}
		// 	for (var i = 0; i < Data.length; i++) {
		// 		if (Data[i].attributeId === "ATR22" && Data[i].attributeValue !== "*") {
		// 			cusgrp.push({
		// 				"attributeValue": Data[i].attributeValue,
		// 				"attributeValueDesc": Data[i].attributeValueDesc,
		// 				"inclusion": Data[i].inclusion
		// 			});
		// 		} else if (Data[i].attributeId === "ATR22" && Data[i].attributeValue === "*") {
		// 			temp_CustomerGrpSwitch = true;
		// 			cusgrp = [];
		// 		}
		// 	}
		// 	for (var i = 0; i < Data.length; i++) {
		// 		if (Data[i].attributeId === "ATR24" && Data[i].attributeValue !== "*") {
		// 			cusgrp2.push({
		// 				"attributeValue": Data[i].attributeValue,
		// 				"attributeValueDesc": Data[i].attributeValueDesc,
		// 				"inclusion": Data[i].inclusion
		// 			});
		// 		} else if (Data[i].attributeId === "ATR24" && Data[i].attributeValue === "*") {
		// 			temp_CustomerGrp2Switch = true;
		// 			cusgrp2 = [];
		// 		}
		// 	}
		// 	for (var i = 0; i < Data.length; i++) {
		// 		if (Data[i].attributeId === "ATR25" && Data[i].attributeValue !== "*") {
		// 			cusgrp3.push({
		// 				"attributeValue": Data[i].attributeValue,
		// 				"attributeValueDesc": Data[i].attributeValueDesc,
		// 				"inclusion": Data[i].inclusion
		// 			});
		// 		} else if (Data[i].attributeId === "ATR25" && Data[i].attributeValue === "*") {
		// 			temp_CustomerGrp3Switch = true;
		// 			cusgrp3 = [];
		// 		}
		// 	}
		// 	for (var i = 0; i < Data.length; i++) {
		// 		if (Data[i].attributeId === "ATR26" && Data[i].attributeValue !== "*") {
		// 			cusgrp4.push({
		// 				"attributeValue": Data[i].attributeValue,
		// 				"attributeValueDesc": Data[i].attributeValueDesc,
		// 				"inclusion": Data[i].inclusion
		// 			});
		// 		} else if (Data[i].attributeId === "ATR26" && Data[i].attributeValue === "*") {
		// 			temp_CustomerGrp4Switch = true;
		// 			cusgrp4 = [];
		// 		}
		// 	}
		// 	for (var i = 0; i < Data.length; i++) {
		// 		if (Data[i].attributeId === "ATR27" && Data[i].attributeValue !== "*") {
		// 			cusgrp5.push({
		// 				"attributeValue": Data[i].attributeValue,
		// 				"attributeValueDesc": Data[i].attributeValueDesc,
		// 				"inclusion": Data[i].inclusion
		// 			});
		// 		} else if (Data[i].attributeId === "ATR27" && Data[i].attributeValue === "*") {
		// 			temp_CustomerGrp5Switch = true;
		// 			cusgrp5 = [];
		// 		}
		// 	}
		// 	for (var i = 0; i < Data.length; i++) {
		// 		if (Data[i].attributeId === "ATR28" && Data[i].attributeValue !== "*") {
		// 			district1.push({
		// 				"attributeValue": Data[i].attributeValue,
		// 				"attributeValueDesc": Data[i].attributeValueDesc,
		// 				"inclusion": Data[i].inclusion
		// 			});
		// 		} else if (Data[i].attributeId === "ATR28" && Data[i].attributeValue === "*") {
		// 			temp_District1Switch = true;
		// 			district1 = [];
		// 		}
		// 	}
		// 	for (var i = 0; i < Data.length; i++) {
		// 		if (Data[i].attributeId === "ATR07" && Data[i].attributeValue !== "*") {
		// 			material.push({
		// 				"attributeValue": Data[i].attributeValue,
		// 				"attributeValueDesc": Data[i].attributeValueDesc,
		// 				"inclusion": Data[i].inclusion
		// 			});
		// 		} else if (Data[i].attributeId === "ATR07" && Data[i].attributeValue === "*") {
		// 			temp_MaterialSwitch = true;
		// 			material = [];
		// 		}
		// 	}

		// 	var omodelSwitch1 = new sap.ui.model.json.JSONModel({
		// 		AllSwitch: all_Switch,
		// 		SalesOrgSwitch1: temp_SalesOrgSwitch1,
		// 		CustomerSwitch1: temp_CustomerSwitch1,
		// 		MaterialNumSwitch1: temp_MaterialNumSwitch1,
		// 		DistribuChanlSwitch1: temp_DistribuChanlSwitch1,
		// 		MaterialGrpSwitch1: temp_MaterialGrpSwitch1,
		// 		MaterialGrpOneSwitch1: temp_MaterialGrpOneSwitch1,
		// 		MaterialGrp4Switch1: temp_MaterialGrp4Switch1,
		// 		DistrictSwitch1: temp_DistrictSwitch1,
		// 		PlantSwitch: temp_PlantSwitch,
		// 		CountrySwitch: temp_CountrySwitch,
		// 		StorageLocSwitch: temp_StorLocSwitch,
		// 		OrderTypeSwitch: temp_OrderTypeSwitch,
		// 		MatGrp2Switch: temp_MaterialGrp2Switch,
		// 		MatGrp3Switch: temp_MaterialGrp3Switch,
		// 		MatGrp5Switch: temp_MaterialGrp5Switch,
		// 		ProdHierarchy1Switch: temp_ProdHierarchy1Switch,
		// 		ProdHierarchy2Switch: temp_ProdHierarchy2Switch,
		// 		ProdHierarchy3Switch: temp_ProdHierarchy3Switch,
		// 		ProdHierarchy4Switch: temp_ProdHierarchy4Switch,
		// 		ProdHierarchy5Switch: temp_ProdHierarchy5Switch,
		// 		ProdHierarchy6Switch: temp_ProdHierarchy6Switch,
		// 		ProdHierarchy7Switch: temp_ProdHierarchy7Switch,
		// 		CustomerGrpSwitch: temp_CustomerGrpSwitch,
		// 		CustomerGrp1Switch: temp_CustomerGrp1Switch,
		// 		CustomerGrp2Switch: temp_CustomerGrp2Switch,
		// 		CustomerGrp3Switch: temp_CustomerGrp3Switch,
		// 		CustomerGrp4Switch: temp_CustomerGrp4Switch,
		// 		CustomerGrp5Switch: temp_CustomerGrp5Switch,
		// 		District1Switch: temp_District1Switch,
		// 		MaterialSwitch: temp_MaterialSwitch
		// 	});
		// 	this.getView().setModel(omodelSwitch1, "SwitchOnOffSet1");

		// 	this.getView().byId("idPODisp").getModel("oPOUserModel").getData().projects[aPath].salesOrg = salesOrg1;
		// 	this.getView().byId("idPODisp").getModel("oPOUserModel").getData().projects[aPath].distriChanne = distriChanne1;
		// 	this.getView().byId("idPODisp").getModel("oPOUserModel").getData().projects[aPath].custNum = custNum1;
		// 	this.getView().byId("idPODisp").getModel("oPOUserModel").getData().projects[aPath].materialGrp4 = materialGrp41;
		// 	this.getView().byId("idPODisp").getModel("oPOUserModel").getData().projects[aPath].materialGrpOne = materialGrpOne1;
		// 	this.getView().byId("idPODisp").getModel("oPOUserModel").getData().projects[aPath].materialGrp = materialGrp1;
		// 	this.getView().byId("idPODisp").getModel("oPOUserModel").getData().projects[aPath].district = division;
		// 	this.getView().byId("idPODisp").getModel("oPOUserModel").getData().projects[aPath].plant = plant;
		// 	this.getView().byId("idPODisp").getModel("oPOUserModel").getData().projects[aPath].country = country;
		// 	this.getView().byId("idPODisp").getModel("oPOUserModel").getData().projects[aPath].ordertype = ordertype;
		// 	this.getView().byId("idPODisp").getModel("oPOUserModel").getData().projects[aPath].storloc = storloc;
		// 	/*this.getView().byId("idPODisp").getModel("oPOUserModel").getData().projects[aPath].materialGrp = materialGrp;*/
		// 	this.getView().byId("idPODisp").getModel("oPOUserModel").getData().projects[aPath].materialGrp2 = materialGrp2;
		// 	this.getView().byId("idPODisp").getModel("oPOUserModel").getData().projects[aPath].materialGrp3 = materialGrp3;
		// 	this.getView().byId("idPODisp").getModel("oPOUserModel").getData().projects[aPath].materialGrp5 = materialGrp5;
		// 	this.getView().byId("idPODisp").getModel("oPOUserModel").getData().projects[aPath].prodhierarchy1 = prodhierarchy1;
		// 	this.getView().byId("idPODisp").getModel("oPOUserModel").getData().projects[aPath].prodhierarchy2 = prodhierarchy2;
		// 	this.getView().byId("idPODisp").getModel("oPOUserModel").getData().projects[aPath].prodhierarchy3 = prodhierarchy3;
		// 	this.getView().byId("idPODisp").getModel("oPOUserModel").getData().projects[aPath].prodhierarchy4 = prodhierarchy4;
		// 	this.getView().byId("idPODisp").getModel("oPOUserModel").getData().projects[aPath].prodhierarchy5 = prodhierarchy5;
		// 	this.getView().byId("idPODisp").getModel("oPOUserModel").getData().projects[aPath].prodhierarchy6 = prodhierarchy6;
		// 	this.getView().byId("idPODisp").getModel("oPOUserModel").getData().projects[aPath].prodhierarchy7 = prodhierarchy7;
		// 	this.getView().byId("idPODisp").getModel("oPOUserModel").getData().projects[aPath].cusgrp = cusgrp;
		// 	this.getView().byId("idPODisp").getModel("oPOUserModel").getData().projects[aPath].cusgrp1 = cusgrp1;
		// 	this.getView().byId("idPODisp").getModel("oPOUserModel").getData().projects[aPath].cusgrp2 = cusgrp2;
		// 	this.getView().byId("idPODisp").getModel("oPOUserModel").getData().projects[aPath].cusgrp3 = cusgrp3;
		// 	this.getView().byId("idPODisp").getModel("oPOUserModel").getData().projects[aPath].cusgrp4 = cusgrp4;
		// 	this.getView().byId("idPODisp").getModel("oPOUserModel").getData().projects[aPath].cusgrp5 = cusgrp5;
		// 	this.getView().byId("idPODisp").getModel("oPOUserModel").getData().projects[aPath].district1 = district1;
		// 	this.getView().byId("idPODisp").getModel("oPOUserModel").getData().projects[aPath].material = material;

		// 	this.getView().byId("idPODisp").getModel("oPOUserModel").refresh(true);
		// 	var msg2 = this.i18nModel.getProperty("customerLblCount");
		// 	this.getView().byId("ID_PROV_LBL_C_CUST_NUM1").setText(msg2 + " (" + custNum1.length + ")");

		// 	var msg1 = this.i18nModel.getProperty("salesOrganizationCountLbl");
		// 	this.getView().byId("ID_PROV_LBL_C_SALS_ORG1").setText(msg1 + " (" + salesOrg1.length + ")");

		// },
		onExpandPO: function (oEvent) {
			var object = oEvent.getSource().getBindingContext("oPOUserTabModel").getObject();
			var index = oEvent.getSource().getBindingContext("oPOUserTabModel").getPath().split("/").pop();
			var that = this;
			var arg = sap.ui.getCore().getModel("UpdateCreateUserModelSet").getData().id + "&" + object.domainCode;
			if (oEvent.getParameter("expand")) {
				var oBusyDialog = new sap.m.BusyDialog();
				oBusyDialog.open();
				jQuery.ajax({
					type: "GET",
					contentType: "application/json",
					url: "/DKSHJavaService/userDetails/findPermissionDetails/" + arg,
					dataType: "json",
					async: false,
					success: function (data, textStatus, jqXHR) {
						oBusyDialog.close();
						that._fnSetPanelData(data, index);
						// oPOUserTabModel.setData({"results":data});
					},
					error: function (error) {
						oBusyDialog.close();
						// oEvent.getSource().setExpanded(false);
						sap.m.MessageToast.show("No Data");
					}
				});
			}
		},
		_fnSetPanelData: function (Data, index) {
			var oPOUserTabModel = this.getView().byId("idPODisp").getModel("oPOUserTabModel");
			var obj = oPOUserTabModel.getData().results[index];
			var all_Switch = false;
			var temp_SalesOrgSwitch1 = false;
			var temp_CustomerSwitch1 = false;
			var temp_MaterialNumSwitch1 = false;
			var temp_DistribuChanlSwitch1 = false;
			var temp_MaterialGrpSwitch1 = false;
			var temp_MaterialGrpOneSwitch1 = false;
			var temp_MaterialGrp4Switch1 = false;
			var temp_DistrictSwitch1 = false;
			var temp_PlantSwitch = false;
			var temp_StorLocSwitch = false;
			var temp_CountrySwitch = false;
			var temp_OrderTypeSwitch = false;
			var temp_MaterialGrp2Switch = false;
			var temp_MaterialGrp3Switch = false;
			var temp_MaterialGrp5Switch = false;
			var temp_ProdHierarchy1Switch = false;
			var temp_ProdHierarchy2Switch = false;
			var temp_ProdHierarchy3Switch = false;
			var temp_ProdHierarchy4Switch = false;
			var temp_ProdHierarchy5Switch = false;
			var temp_ProdHierarchy6Switch = false;
			var temp_ProdHierarchy7Switch = false;
			var temp_CustomerGrp1Switch = false;
			var temp_CustomerGrp2Switch = false;
			var temp_CustomerGrp3Switch = false;
			var temp_CustomerGrp4Switch = false;
			var temp_CustomerGrp5Switch = false;
			var temp_CustomerGrpSwitch = false;
			var temp_District1Switch = false;
			var temp_MaterialSwitch = false;

			//sales organization

			for (var i = 0; i < Data.length; i++) {

				if (Data.length === 29) {
					var cn = 0;
					for (var k = 0; k < Data.length; k++) {
						if (Data[k].permissionObjectDetailsDos && Data[k].permissionObjectDetailsDos[0].attributeValue === "*") {
							cn++;
						}
					}
					if (cn === 29) {

						all_Switch = true;
						this.switchCount = 29;
					}

				}
			}
			if (Data[0].permissionObjectDetailsDos) {
				if (Data[0].permissionObjectDetailsDos[0].attributeValue !== "*") {
					obj.salesOrg1 = Data[0].permissionObjectDetailsDos;
				} else {
					temp_SalesOrgSwitch1 = true;
					obj.salesOrg1 = [];
				}
			}
			if (Data[1].permissionObjectDetailsDos) {
				if (Data[1].permissionObjectDetailsDos[0].attributeValue !== "*") {
					obj.distriChanne1 = Data[1].permissionObjectDetailsDos;
				} else {
					temp_DistribuChanlSwitch1 = true;
					obj.distriChanne1 = [];
				}
			}
			if (Data[2].permissionObjectDetailsDos) {
				if (Data[2].permissionObjectDetailsDos[0].attributeValue !== "*") {
					obj.division = Data[2].permissionObjectDetailsDos;
				} else {
					temp_DistrictSwitch1 = true;
					obj.division = [];
				}
			}

			if (Data[3].permissionObjectDetailsDos) {
				if (Data[3].permissionObjectDetailsDos[0].attributeValue !== "*") {
					obj.materialGrp1 = Data[3].permissionObjectDetailsDos;
				} else {
					temp_MaterialGrpSwitch1 = true;
					obj.materialGrp1 = [];
				}
			}
			if (Data[4].permissionObjectDetailsDos) {
				if (Data[4].permissionObjectDetailsDos[0].attributeValue !== "*") {
					obj.materialGrp41 = Data[4].permissionObjectDetailsDos;
				} else {
					temp_MaterialGrp4Switch1 = true;
					obj.materialGrp41 = [];
				}
			}
			if (Data[5].permissionObjectDetailsDos) {
				if (Data[5].permissionObjectDetailsDos[0].attributeValue !== "*") {
					obj.custNum1 = Data[5].permissionObjectDetailsDos;
				} else {
					temp_CustomerSwitch1 = true;
					obj.custNum1 = [];
				}
			}
			if (Data[6].permissionObjectDetailsDos) {
				if (Data[6].permissionObjectDetailsDos[0].attributeValue !== "*") {
					obj.material = Data[6].permissionObjectDetailsDos;
				} else {
					temp_MaterialSwitch = true;
					obj.material = [];
				}
			}
			if (Data[7].permissionObjectDetailsDos) {
				if (Data[7].permissionObjectDetailsDos[0].attributeValue !== "*") {
					obj.ordertype = Data[7].permissionObjectDetailsDos;
				} else {
					temp_OrderTypeSwitch = true;
					obj.ordertype = [];
				}
			}
			if (Data[8].permissionObjectDetailsDos) {
				if (Data[8].permissionObjectDetailsDos[0].attributeValue !== "*") {
					obj.plant = Data[8].permissionObjectDetailsDos;
				} else {
					temp_PlantSwitch = true;
					obj.plant = [];
				}
			}
			if (Data[9].permissionObjectDetailsDos) {
				if (Data[9].permissionObjectDetailsDos[0].attributeValue !== "*") {
					obj.storloc = Data[9].permissionObjectDetailsDos;
				} else {
					temp_StorLocSwitch = true;
					obj.storloc = [];
				}
			}
			if (Data[10].permissionObjectDetailsDos) {
				if (Data[10].permissionObjectDetailsDos[0].attributeValue !== "*") {
					obj.materialGrpOne1 = Data[10].permissionObjectDetailsDos;
				} else {
					temp_MaterialGrpOneSwitch1 = true;
					obj.materialGrpOne1 = [];
				}
			}
			if (Data[11].permissionObjectDetailsDos) {
				if (Data[11].permissionObjectDetailsDos[0].attributeValue !== "*") {
					obj.materialGrp2 = Data[11].permissionObjectDetailsDos;
				} else {
					temp_MaterialGrp2Switch = true;
					obj.materialGrp2 = [];
				}
			}
			if (Data[12].permissionObjectDetailsDos) {
				if (Data[12].permissionObjectDetailsDos[0].attributeValue !== "*") {
					obj.materialGrp3 = Data[12].permissionObjectDetailsDos;
				} else {
					temp_MaterialGrp3Switch = true;
					obj.materialGrp3 = [];
				}
			}
			if (Data[13].permissionObjectDetailsDos) {
				if (Data[13].permissionObjectDetailsDos[0].attributeValue !== "*") {
					obj.materialGrp5 = Data[13].permissionObjectDetailsDos;
				} else {
					temp_MaterialGrp5Switch = true;
					obj.materialGrp5 = [];
				}
			}
			if (Data[14].permissionObjectDetailsDos) {
				if (Data[14].permissionObjectDetailsDos[0].attributeValue !== "*") {
					obj.prodhierarchy1 = Data[14].permissionObjectDetailsDos;
				} else {
					temp_ProdHierarchy1Switch = true;
					obj.prodhierarchy1 = [];
				}
			}
			if (Data[15].permissionObjectDetailsDos) {
				if (Data[15].permissionObjectDetailsDos[0].attributeValue !== "*") {
					obj.prodhierarchy2 = Data[15].permissionObjectDetailsDos;
				} else {
					temp_ProdHierarchy2Switch = true;
					obj.prodhierarchy2 = [];
				}
			}
			if (Data[16].permissionObjectDetailsDos) {
				if (Data[16].permissionObjectDetailsDos[0].attributeValue !== "*") {
					obj.prodhierarchy3 = Data[16].permissionObjectDetailsDos;
				} else {
					temp_ProdHierarchy3Switch = true;
					obj.prodhierarchy3 = [];
				}
			}
			if (Data[17].permissionObjectDetailsDos) {
				if (Data[17].permissionObjectDetailsDos[0].attributeValue !== "*") {
					obj.prodhierarchy4 = Data[17].permissionObjectDetailsDos;
				} else {
					temp_ProdHierarchy4Switch = true;
					obj.prodhierarchy4 = [];
				}
			}
			if (Data[18].permissionObjectDetailsDos) {
				if (Data[18].permissionObjectDetailsDos[0].attributeValue !== "*") {
					obj.prodhierarchy5 = Data[18].permissionObjectDetailsDos;
				} else {
					temp_ProdHierarchy5Switch = true;
					obj.prodhierarchy5 = [];
				}
			}
			if (Data[19].permissionObjectDetailsDos) {
				if (Data[19].permissionObjectDetailsDos[0].attributeValue !== "*") {
					obj.prodhierarchy6 = Data[19].permissionObjectDetailsDos;
				} else {
					temp_ProdHierarchy6Switch = true;
					obj.prodhierarchy6 = [];
				}
			}
			if (Data[20].permissionObjectDetailsDos) {
				if (Data[20].permissionObjectDetailsDos[0].attributeValue !== "*") {
					obj.prodhierarchy7 = Data[20].permissionObjectDetailsDos;
				} else {
					temp_ProdHierarchy7Switch = true;
					obj.prodhierarchy7 = [];
				}
			}
			if (Data[21].permissionObjectDetailsDos) {
				if (Data[21].permissionObjectDetailsDos[0].attributeValue !== "*") {
					obj.cusgrp = Data[21].permissionObjectDetailsDos;
				} else {
					temp_CustomerGrpSwitch = true;
					obj.cusgrp = [];
				}
			}
			if (Data[22].permissionObjectDetailsDos) {
				if (Data[22].permissionObjectDetailsDos[0].attributeValue !== "*") {
					obj.cusgrp1 = Data[22].permissionObjectDetailsDos;
				} else {
					temp_CustomerGrp1Switch = true;
					obj.cusgrp1 = [];
				}
			}
			if (Data[23].permissionObjectDetailsDos) {
				if (Data[23].permissionObjectDetailsDos[0].attributeValue !== "*") {
					obj.cusgrp2 = Data[23].permissionObjectDetailsDos;
				} else {
					temp_CustomerGrp2Switch = true;
					obj.cusgrp2 = [];
				}
			}
			if (Data[24].permissionObjectDetailsDos) {
				if (Data[24].permissionObjectDetailsDos[0].attributeValue !== "*") {
					obj.cusgrp3 = Data[24].permissionObjectDetailsDos;
				} else {
					temp_CustomerGrp3Switch = true;
					obj.cusgrp3 = [];
				}
			}
			if (Data[25].permissionObjectDetailsDos) {
				if (Data[25].permissionObjectDetailsDos[0].attributeValue !== "*") {
					obj.cusgrp4 = Data[25].permissionObjectDetailsDos;
				} else {
					temp_CustomerGrp4Switch = true;
					obj.cusgrp4 = [];
				}
			}
			if (Data[26].permissionObjectDetailsDos) {
				if (Data[26].permissionObjectDetailsDos[0].attributeValue !== "*") {
					obj.cusgrp5 = Data[26].permissionObjectDetailsDos;
				} else {
					temp_CustomerGrp5Switch = true;
					obj.cusgrp5 = [];
				}
			}
			if (Data[27].permissionObjectDetailsDos) {
				if (Data[27].permissionObjectDetailsDos[0].attributeValue !== "*") {
					obj.district1 = Data[27].permissionObjectDetailsDos;
				} else {
					temp_District1Switch = true;
					obj.district1 = [];
				}
			}
			if (Data[28].permissionObjectDetailsDos) {
				if (Data[28].permissionObjectDetailsDos[0].attributeValue !== "*") {
					obj.country = Data[28].permissionObjectDetailsDos;
				} else {
					temp_CountrySwitch = true;
					obj.country = [];
				}
			}

			obj.AllSwitch = all_Switch;
			obj.SalesOrgSwitch1 = temp_SalesOrgSwitch1;
			obj.CustomerSwitch1 = temp_CustomerSwitch1;
			obj.MaterialNumSwitch1 = temp_MaterialNumSwitch1;
			obj.DistribuChanlSwitch1 = temp_DistribuChanlSwitch1;
			obj.MaterialGrpSwitch1 = temp_MaterialGrpSwitch1;
			obj.MaterialGrpOneSwitch1 = temp_MaterialGrpOneSwitch1;
			obj.MaterialGrp4Switch1 = temp_MaterialGrp4Switch1;
			obj.DistrictSwitch1 = temp_DistrictSwitch1;
			obj.PlantSwitch = temp_PlantSwitch;
			obj.CountrySwitch = temp_CountrySwitch;
			obj.StorageLocSwitch = temp_StorLocSwitch;
			obj.OrderTypeSwitch = temp_OrderTypeSwitch;
			obj.MatGrp2Switch = temp_MaterialGrp2Switch;
			obj.MatGrp3Switch = temp_MaterialGrp3Switch;
			obj.MatGrp5Switch = temp_MaterialGrp5Switch;
			obj.ProdHierarchy1Switch = temp_ProdHierarchy1Switch;
			obj.ProdHierarchy2Switch = temp_ProdHierarchy2Switch;
			obj.ProdHierarchy3Switch = temp_ProdHierarchy3Switch;
			obj.ProdHierarchy4Switch = temp_ProdHierarchy4Switch;
			obj.ProdHierarchy5Switch = temp_ProdHierarchy5Switch;
			obj.ProdHierarchy6Switch = temp_ProdHierarchy6Switch;
			obj.ProdHierarchy7Switch = temp_ProdHierarchy7Switch;
			obj.CustomerGrpSwitch = temp_CustomerGrpSwitch;
			obj.CustomerGrp1Switch = temp_CustomerGrp1Switch;
			obj.CustomerGrp2Switch = temp_CustomerGrp2Switch;
			obj.CustomerGrp3Switch = temp_CustomerGrp3Switch;
			obj.CustomerGrp4Switch = temp_CustomerGrp4Switch;
			obj.CustomerGrp5Switch = temp_CustomerGrp5Switch;
			obj.District1Switch = temp_District1Switch;
			obj.MaterialSwitch = temp_MaterialSwitch;
			oPOUserTabModel.refresh();
		},
		onExpandPOUser: function (oEvent) {
			var object = oEvent.getSource().getBindingContext("oPOTabModel").getObject();
			var index = oEvent.getSource().getBindingContext("oPOTabModel").getPath().split("/").pop();
			var that = this;
			var arg = sap.ui.getCore().getModel("UpdateCreateUserModelSet").getData().id + "&" + object.permissionObjectGuid;
			if (oEvent.getParameter("expand")) {
				var oBusyDialog = new sap.m.BusyDialog();
				oBusyDialog.open();
				jQuery.ajax({
					type: "GET",
					contentType: "application/json",
					url: "/DKSHJavaService/permissionObject/findByIdWithDetails/" + object.permissionObjectGuid,
					dataType: "json",
					async: false,
					success: function (data, textStatus, jqXHR) {
						oBusyDialog.close();
						that._fnPOSetPanelData(data, index);
						// oPOUserTabModel.setData({"results":data});
					},
					error: function (error) {
						oBusyDialog.close();
						// oEvent.getSource().setExpanded(false);
						sap.m.MessageToast.show("No Data");
					}
				});
			}
		},
		_fnPOSetPanelData: function (Data, index) {
			var oPOUserTabModel = this.getView().getModel("oPOTabModel");
			var obj = oPOUserTabModel.getData().results[index];
			obj.AllSwitch = true;
			for (var i = 0; i < Data.length; i++) {
				if (Data[0].permissionObjectDetailsDos) {
					if (Data[0].permissionObjectDetailsDos[0].attributeValue !== "*") {
						obj.salesOrg1 = Data[0].permissionObjectDetailsDos;
						obj.AllSwitch = false;
					} else {
						// temp_SalesOrgSwitch1 = true;
						obj.salesOrg1 = [];
					}
				}
				if (Data[1].permissionObjectDetailsDos) {
					if (Data[1].permissionObjectDetailsDos[0].attributeValue !== "*") {
						obj.distriChanne1 = Data[1].permissionObjectDetailsDos;
						obj.AllSwitch = false;
					} else {
						// temp_DistribuChanlSwitch1 = true;
						obj.distriChanne1 = [];
					}
				}
				if (Data[2].permissionObjectDetailsDos) {
					if (Data[2].permissionObjectDetailsDos[0].attributeValue !== "*") {
						obj.division = Data[2].permissionObjectDetailsDos;
						obj.AllSwitch = false;
					} else {
						// temp_DistrictSwitch1 = true;
						obj.division = [];
					}
				}

				if (Data[3].permissionObjectDetailsDos) {
					if (Data[3].permissionObjectDetailsDos[0].attributeValue !== "*") {
						obj.materialGrp1 = Data[3].permissionObjectDetailsDos;
						obj.AllSwitch = false;
					} else {
						// temp_MaterialGrpSwitch1 = true;
						obj.materialGrp1 = [];
					}
				}
				if (Data[4].permissionObjectDetailsDos) {
					if (Data[4].permissionObjectDetailsDos[0].attributeValue !== "*") {
						obj.materialGrp41 = Data[4].permissionObjectDetailsDos;
						obj.AllSwitch = false;
					} else {
						// temp_MaterialGrp4Switch1 = true;
						obj.materialGrp41 = [];
					}
				}
				if (Data[5].permissionObjectDetailsDos) {
					if (Data[5].permissionObjectDetailsDos[0].attributeValue !== "*") {
						obj.custNum1 = Data[5].permissionObjectDetailsDos;
						obj.AllSwitch = false;
					} else {
						// temp_CustomerSwitch1 = true;
						obj.custNum1 = [];
					}
				}
				if (Data[6].permissionObjectDetailsDos) {
					if (Data[6].permissionObjectDetailsDos[0].attributeValue !== "*") {
						obj.material = Data[6].permissionObjectDetailsDos;
						obj.AllSwitch = false;
					} else {
						// temp_MaterialSwitch = true;
						obj.material = [];
					}
				}
				if (Data[7].permissionObjectDetailsDos) {
					if (Data[7].permissionObjectDetailsDos[0].attributeValue !== "*") {
						obj.ordertype = Data[7].permissionObjectDetailsDos;
						obj.AllSwitch = false;
					} else {
						// temp_OrderTypeSwitch = true;
						obj.ordertype = [];
					}
				}
				if (Data[8].permissionObjectDetailsDos) {
					if (Data[8].permissionObjectDetailsDos[0].attributeValue !== "*") {
						obj.plant = Data[8].permissionObjectDetailsDos;
						obj.AllSwitch = false;
					} else {
						// temp_PlantSwitch = true;
						obj.plant = [];
					}
				}
				if (Data[9].permissionObjectDetailsDos) {
					if (Data[9].permissionObjectDetailsDos[0].attributeValue !== "*") {
						obj.storloc = Data[9].permissionObjectDetailsDos;
						obj.AllSwitch = false;
					} else {
						// temp_StorLocSwitch = true;
						obj.storloc = [];
					}
				}
				if (Data[10].permissionObjectDetailsDos) {
					if (Data[10].permissionObjectDetailsDos[0].attributeValue !== "*") {
						obj.materialGrpOne1 = Data[10].permissionObjectDetailsDos;
						obj.AllSwitch = false;
					} else {
						// temp_MaterialGrpOneSwitch1 = true;
						obj.materialGrpOne1 = [];
					}
				}
				if (Data[11].permissionObjectDetailsDos) {
					if (Data[11].permissionObjectDetailsDos[0].attributeValue !== "*") {
						obj.materialGrp2 = Data[11].permissionObjectDetailsDos;
						obj.AllSwitch = false;
					} else {
						// temp_MaterialGrp2Switch = true;
						obj.materialGrp2 = [];
					}
				}
				if (Data[12].permissionObjectDetailsDos) {
					if (Data[12].permissionObjectDetailsDos[0].attributeValue !== "*") {
						obj.materialGrp3 = Data[12].permissionObjectDetailsDos;
						obj.AllSwitch = false;
					} else {
						// temp_MaterialGrp3Switch = true;
						obj.materialGrp3 = [];
					}
				}
				if (Data[13].permissionObjectDetailsDos) {
					if (Data[13].permissionObjectDetailsDos[0].attributeValue !== "*") {
						obj.materialGrp5 = Data[13].permissionObjectDetailsDos;
						obj.AllSwitch = false;
					} else {
						// temp_MaterialGrp5Switch = true;
						obj.materialGrp5 = [];
					}
				}
				if (Data[14].permissionObjectDetailsDos) {
					if (Data[14].permissionObjectDetailsDos[0].attributeValue !== "*") {
						obj.prodhierarchy1 = Data[14].permissionObjectDetailsDos;
						obj.AllSwitch = false;
					} else {
						// temp_ProdHierarchy1Switch = true;
						obj.prodhierarchy1 = [];
					}
				}
				if (Data[15].permissionObjectDetailsDos) {
					if (Data[15].permissionObjectDetailsDos[0].attributeValue !== "*") {
						obj.prodhierarchy2 = Data[15].permissionObjectDetailsDos;
						obj.AllSwitch = false;
					} else {
						// temp_ProdHierarchy2Switch = true;
						obj.prodhierarchy2 = [];
					}
				}
				if (Data[16].permissionObjectDetailsDos) {
					if (Data[16].permissionObjectDetailsDos[0].attributeValue !== "*") {
						obj.prodhierarchy3 = Data[16].permissionObjectDetailsDos;
						obj.AllSwitch = false;
					} else {
						// temp_ProdHierarchy3Switch = true;
						obj.prodhierarchy3 = [];
					}
				}
				if (Data[17].permissionObjectDetailsDos) {
					if (Data[17].permissionObjectDetailsDos[0].attributeValue !== "*") {
						obj.prodhierarchy4 = Data[17].permissionObjectDetailsDos;
						obj.AllSwitch = false;
					} else {
						// temp_ProdHierarchy4Switch = true;
						obj.prodhierarchy4 = [];
					}
				}
				if (Data[18].permissionObjectDetailsDos) {
					if (Data[18].permissionObjectDetailsDos[0].attributeValue !== "*") {
						obj.prodhierarchy5 = Data[18].permissionObjectDetailsDos;
						obj.AllSwitch = false;
					} else {
						// temp_ProdHierarchy5Switch = true;
						obj.prodhierarchy5 = [];
					}
				}
				if (Data[19].permissionObjectDetailsDos) {
					if (Data[19].permissionObjectDetailsDos[0].attributeValue !== "*") {
						obj.prodhierarchy6 = Data[19].permissionObjectDetailsDos;
						obj.AllSwitch = false;
					} else {
						// temp_ProdHierarchy6Switch = true;
						obj.prodhierarchy6 = [];
					}
				}
				if (Data[20].permissionObjectDetailsDos) {
					if (Data[20].permissionObjectDetailsDos[0].attributeValue !== "*") {
						obj.prodhierarchy7 = Data[20].permissionObjectDetailsDos;
						obj.AllSwitch = false;
					} else {
						// temp_ProdHierarchy7Switch = true;
						obj.prodhierarchy7 = [];
					}
				}
				if (Data[21].permissionObjectDetailsDos) {
					if (Data[21].permissionObjectDetailsDos[0].attributeValue !== "*") {
						obj.cusgrp = Data[21].permissionObjectDetailsDos;
						obj.AllSwitch = false;
					} else {
						// temp_CustomerGrpSwitch = true;
						obj.cusgrp = [];
					}
				}
				if (Data[22].permissionObjectDetailsDos) {
					if (Data[22].permissionObjectDetailsDos[0].attributeValue !== "*") {
						obj.cusgrp1 = Data[22].permissionObjectDetailsDos;
						obj.AllSwitch = false;
					} else {
						// temp_CustomerGrp1Switch = true;
						obj.cusgrp1 = [];
					}
				}
				if (Data[23].permissionObjectDetailsDos) {
					if (Data[23].permissionObjectDetailsDos[0].attributeValue !== "*") {
						obj.cusgrp2 = Data[23].permissionObjectDetailsDos;
						obj.AllSwitch = false;
					} else {
						// temp_CustomerGrp2Switch = true;
						obj.cusgrp2 = [];
					}
				}
				if (Data[24].permissionObjectDetailsDos) {
					if (Data[24].permissionObjectDetailsDos[0].attributeValue !== "*") {
						obj.cusgrp3 = Data[24].permissionObjectDetailsDos;
						obj.AllSwitch = false;
					} else {
						// temp_CustomerGrp3Switch = true;
						obj.cusgrp3 = [];
					}
				}
				if (Data[25].permissionObjectDetailsDos) {
					if (Data[25].permissionObjectDetailsDos[0].attributeValue !== "*") {
						obj.cusgrp4 = Data[25].permissionObjectDetailsDos;
						obj.AllSwitch = false;
					} else {
						// temp_CustomerGrp4Switch = true;
						obj.cusgrp4 = [];
					}
				}
				if (Data[26].permissionObjectDetailsDos) {
					if (Data[26].permissionObjectDetailsDos[0].attributeValue !== "*") {
						obj.cusgrp5 = Data[26].permissionObjectDetailsDos;
						obj.AllSwitch = false;
					} else {
						// temp_CustomerGrp5Switch = true;
						obj.cusgrp5 = [];
					}
				}
				if (Data[27].permissionObjectDetailsDos) {
					if (Data[27].permissionObjectDetailsDos[0].attributeValue !== "*") {
						obj.district1 = Data[27].permissionObjectDetailsDos;
						obj.AllSwitch = false;
					} else {
						// temp_District1Switch = true;
						obj.district1 = [];
					}
				}
				if (Data[28].permissionObjectDetailsDos) {
					if (Data[28].permissionObjectDetailsDos[0].attributeValue !== "*") {
						obj.country = Data[28].permissionObjectDetailsDos;
						obj.AllSwitch = false;
					} else {
						// temp_CountrySwitch = true;
						obj.country = [];
					}
				}
			}
			oPOUserTabModel.refresh();
		},
		handleIconTabSelectChangeSelection: function (oEvent) {
			if (oEvent.getSource().getSelectedKey() == "POKey") {
				if (!this.getView().byId("idPODisp").getModel("oPOUserTabModel").getData().results) {
					var oPOUserTabModel = new JSONModel();
					jQuery.ajax({
						type: "GET",
						contentType: "application/json",
						url: "/DKSHJavaService/domainText/list",
						dataType: "json",
						async: false,
						success: function (data, textStatus, jqXHR) {
							oPOUserTabModel.setData({
								"results": data
							});
						}
					});
					this.getView().byId("idPODisp").setModel(oPOUserTabModel, "oPOUserTabModel");
				}
			} else if (oEvent.getSource().getSelectedKey() == "PODetailsKey") {
				if (!this.getView().getModel("oPOTabModel").getData().results) {
					var oPOTabModel = new JSONModel();
					var modelCreateUpd = sap.ui.getCore().getModel("UpdateCreateUserModelSet").getData();
					jQuery.ajax({
						type: "GET",
						contentType: "application/json",
						url: "/DKSHJavaService/userDetails/findAllPermissionObjects/" + modelCreateUpd.id,
						dataType: "json",
						async: false,
						success: function (data, textStatus, jqXHR) {
							oPOTabModel.setSizeLimit(1000);
							oPOTabModel.setData({
								"results": data
							});
						}
					});
					this.getView().setModel(oPOTabModel, "oPOTabModel");
				}
			}
		}

	});

});