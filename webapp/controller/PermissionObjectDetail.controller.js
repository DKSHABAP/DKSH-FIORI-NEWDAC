sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"../model/formatter",
	"sap/m/MessageBox"
], function (Controller, JSONModel, formatter, MessageBox) {
	"use strict";

	return Controller.extend("com.incture.cherrywork.newdac.controller.PermissionObjectDetail", {
		formatter: formatter,

		onInit: function () {
			"use strict";
			var router = sap.ui.core.UIComponent.getRouterFor(this);
			router.attachRoutePatternMatched(this._onRouteMatched, this);
		},
		getRouter: function () {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},
		fnIconTabSelect: function (oEvent) {
			var visibilityModel = new JSONModel();
			visibilityModel.setData({
				save: false,
				cancel: false,
				copy: true,
				edit: true,
				deletePO: true
			});
			this.getView().setModel(visibilityModel, "visibilityModel");
			if (oEvent.getSource().getSelectedKey() == "assignedUsers") {
				visibilityModel.setData({
					save: false,
					cancel: false,
					copy: false,
					edit: false,
					deletePO: false
				});
				this.getView().setModel(visibilityModel, "visibilityModel");
				var busyDialog = new sap.m.BusyDialog();
				busyDialog.open();
				var that = this;
				jQuery.ajax({
					type: "GET",
					contentType: "application/json",
					url: "/DKSHJavaService/permissionObject/findUserDetailsById/" + this.perid,
					dataType: "json",
					async: false,
					success: function (data, textStatus, jqXHR) {
						busyDialog.close();
						var assignedUserModel = new JSONModel();
						that.getView().setModel(assignedUserModel, "assignedUserModel");
						assignedUserModel.setData(data);
					},
					error: function (error) {
						busyDialog.close();
						sap.m.MessageToast.show(error.responseText);
					}
				});
			}
		},
		_onRouteMatched: function (oEvent) {
			if (oEvent.getParameter("name") === "detailViewP") {
				var userModel = new sap.ui.model.json.JSONModel();
				userModel.loadData("/services/userapi/currentUser");
				userModel.attachRequestCompleted(function (oEvent) {

					sap.ui.getCore().setModel(userModel, "userapi");
				});
				if (this.getView().byId("ID_TAB_PO"))
					this.getView().byId("ID_TAB_PO").setSelectedKey("poKey");
				var detModel = new JSONModel();
				var that = this;
				this.switchCount = 0;
				that.expandOrCollapaseAllPanel(false);
				this.getView().setModel(detModel, "detModel");
				var UpdateCreateIndModelViewSet = new JSONModel();
				UpdateCreateIndModelViewSet.setData({
					EditableField: false
				});
				this.getView().setModel(UpdateCreateIndModelViewSet, "UpdateCreateIndModelViewSet");

				var createMdlViewSet = new JSONModel();
				createMdlViewSet.setData({
					EdtFldSO: false,
					EdtFldCus: false,
					EdtFldMN: false,
					EdtFldDisChnl: false,
					EdtFldMG: false,
					EdtFldMG1: false,
					EdtFldMG4: false,
					EdtFldDiv: false,
					EdtFldPlnt: false,
					EdtFldCntry: false,
					EdtFldOType: false,
					EdtFldStorLoc: false,
					EdtFldMG2: false,
					EdtFldMG3: false,
					EdtFldMG5: false,
					EdtFldPh1: false,
					EdtFldPh2: false,
					EdtFldPh3: false,
					EdtFldPh4: false,
					EdtFldPh5: false,
					EdtFldPh6: false,
					EdtFldPh7: false,
					EdtFldCG: false,
					EdtFldCG1: false,
					EdtFldCG2: false,
					EdtFldCG3: false,
					EdtFldCG4: false,
					EdtFldCG5: false,
					EdtFldDis1: false,
					EdtFldMat: false,

				});
				this.getView().setModel(createMdlViewSet, "createMdlViewSet");

				var visibilityModel = new JSONModel();
				visibilityModel.setData({
					save: false,
					cancel: false,
					copy: true,
					edit: true,
					deletePO: true
				});
				this.getView().setModel(UpdateCreateIndModelViewSet, "UpdateCreateIndModelViewSet");
				this.getView().setModel(visibilityModel, "visibilityModel");
				var value = oEvent.getParameters().arguments.pid.split("|");
				this.perid = value[0];
				this.permissionObjectText = value[1].replace(/~/g, "/");
				var busyDialog = new sap.m.BusyDialog();
				busyDialog.open();
				jQuery.ajax({
					type: "GET",
					contentType: "application/json",
					url: "/DKSHJavaService/permissionObject/findByIdWithDetails/" + this.perid,
					dataType: "json",
					async: false,
					success: function (data, textStatus, jqXHR) {
						detModel.setData(data);
						var title = that.permissionObjectText + " - Details";
						that.getView().byId("idDetailTitle").setTitle(title);
						that.bindingTableDataForAllSenario(data, busyDialog);
						that.expandOrCollapaseAllPanel(false);
					},
					error: function (error) {
						busyDialog.close();
						sap.m.MessageToast.show(error.responseText);
					},
				});
				that.expandOrCollapaseAllPanel(false);
			}

		},
		onAfterRendering: function () {
			this.i18nModel = this.getView().getModel("i18n");
			this.oModel = this.getView().getModel("SalesOrganization");
			this.oModelMaterial = this.getView().getModel("MaterialModel");
		},
		bindingTableDataForAllSenario: function (Data, busyDialog) {
			/*	var userName = sap.ui.getCore().getModel("userapi").getData().name;*/
			var userName = "";
			var that = this;

			var attributeDetails = this.getView().getModel("detModel").getData();
			//declaration
			var all_Switch = false;
			var temp_SalesOrgSwitch = true;
			var temp_CustomerSwitch = true;
			var temp_MaterialNumSwitch = true;
			var temp_DistribuChanlSwitch = true;
			var temp_MaterialGrpSwitch = true;
			var temp_MaterialGrpOneSwitch = true;
			var temp_MaterialGrp4Switch = true;
			var temp_DistrictSwitch = true;
			var temp_PlantSwitch = true;
			var temp_StorLocSwitch = true;
			var temp_CountrySwitch = true;
			var temp_OrderTypeSwitch = true;
			var temp_MaterialGrp2Switch = true;
			var temp_MaterialGrp3Switch = true;
			var temp_MaterialGrp5Switch = true;
			var temp_ProdHierarchy1Switch = true;
			var temp_ProdHierarchy2Switch = true;
			var temp_ProdHierarchy3Switch = true;
			var temp_ProdHierarchy4Switch = true;
			var temp_ProdHierarchy5Switch = true;
			var temp_ProdHierarchy6Switch = true;
			var temp_ProdHierarchy7Switch = true;
			var temp_CustomerGrp1Switch = true;
			var temp_CustomerGrp2Switch = true;
			var temp_CustomerGrp3Switch = true;
			var temp_CustomerGrp4Switch = true;
			var temp_CustomerGrp5Switch = true;
			var temp_CustomerGrpSwitch = true;
			var temp_District1Switch = true;
			var temp_MaterialSwitch = true;

			//variable declaration 
			var salesOrg = {
				"attributeId": "ATR01",
				"attributeDesc": "Sales Org",
				// "attributeDetailsGuid": "169a3fd1-2c99-43e5-96dc-466e1ef1e6bf",
				// "attributeDetailsGuid": "b079d1a3-f310-46ea-a5a3-8aef8e24d872",
				"attributeDetailsGuid": attributeDetails[0].attributeDetailsGuid,
				"domainCode": "cc",
				"isInclusion": true,
				"aliasName": "customAttribute1",
				"permissionObjectDetailsDos": []
			};
			var custNum = {
				"attributeId": "ATR06",
				"attributeDesc": "Customer Code",
				// "attributeDetailsGuid": "3a937ca7-16e5-47be-93ef-b647577aeb36",
				// "attributeDetailsGuid": "f2a21bfd-8bcb-475b-b707-55c596864c5d",
				"attributeDetailsGuid": attributeDetails[5].attributeDetailsGuid,
				"domainCode": "cc",
				"isInclusion": true,
				"aliasName": "customAttribute1",
				"permissionObjectDetailsDos": []
			};
			var distriChanne = {
				"attributeId": "ATR02",
				"attributeDesc": "Dist Channel",
				// "attributeDetailsGuid": "2570f50a-ef16-4b85-b9d1-2f0e1902d39e",
				// "attributeDetailsGuid": "57af0c60-3e1e-4c11-8ab7-90801bcec343",	
				"attributeDetailsGuid": attributeDetails[1].attributeDetailsGuid,
				"domainCode": "cc",
				"isInclusion": true,
				"aliasName": "customAttribute1",
				"permissionObjectDetailsDos": []
			};
			var district = {
				"attributeId": "ATR03",
				"attributeDesc": "Division",
				// "attributeDetailsGuid": "e3b54ff6-9b08-43b0-a91c-ccc6036810fd",
				// "attributeDetailsGuid": "b3857ec1-4058-462e-842d-d88f85087b69",
				"attributeDetailsGuid": attributeDetails[2].attributeDetailsGuid,
				"domainCode": "cc",
				"isInclusion": true,
				"aliasName": "customAttribute1",
				"permissionObjectDetailsDos": []
			};
			var materialGrp = {
				"attributeId": "ATR04",
				"attributeDesc": "Material Group",
				// "attributeDetailsGuid": "686d2593-3ba4-4ffa-a1e8-386c2fa66c78",
				// "attributeDetailsGuid": "072276f7-7847-46de-af1a-c065ca59731a",
				"attributeDetailsGuid": attributeDetails[3].attributeDetailsGuid,
				"domainCode": "cc",
				"isInclusion": true,
				"aliasName": "customAttribute1",
				"permissionObjectDetailsDos": []
			};
			var materialGrpOne = {
				"attributeId": "ATR11",
				"attributeDesc": "Material Group 1",
				// "attributeDetailsGuid": "16a3b281-a75c-4e87-8d28-28b1397e6045",
				// "attributeDetailsGuid": "0324bfea-8d38-4b4a-a80e-4afe1021b4a4",
				"attributeDetailsGuid": attributeDetails[10].attributeDetailsGuid,
				"domainCode": "cc",
				"isInclusion": true,
				"aliasName": "customAttribute1",
				"permissionObjectDetailsDos": []
			};
			var materialGrp4 = {
				"attributeId": "ATR05",
				"attributeDesc": "Material Group 4",
				// "attributeDetailsGuid": "2da6d510-80f4-4773-8c87-80287ab41526",
				// "attributeDetailsGuid": "80709c4b-3273-4bec-91a1-42e47161a17a",
				"attributeDetailsGuid": attributeDetails[4].attributeDetailsGuid,
				"domainCode": "cc",
				"isInclusion": true,
				"aliasName": "customAttribute1",
				"permissionObjectDetailsDos": []
			};
			var materialNum = [];
			var plant = {
				"attributeId": "ATR09",
				"attributeDesc": "Plant",
				// "attributeDetailsGuid": "748199bd-b84a-4a63-8fa2-874b2935c510",
				// "attributeDetailsGuid": "666771cd-edf5-48f9-9214-b7851b59ab3b",
				"attributeDetailsGuid": attributeDetails[8].attributeDetailsGuid,
				"domainCode": "cc",
				"isInclusion": true,
				"aliasName": "customAttribute1",
				"permissionObjectDetailsDos": []
			};
			var storloc = {
				"attributeId": "ATR10",
				"attributeDesc": "Storage Location",
				// "attributeDetailsGuid": "9fe7dbb1-7375-4835-804d-0174c098117f",
				// "attributeDetailsGuid": "9e26dae3-4dc4-4ed3-83e0-94312c3b5ec9",
				"attributeDetailsGuid": attributeDetails[9].attributeDetailsGuid,
				"domainCode": "cc",
				"isInclusion": true,
				"aliasName": "customAttribute1",
				"permissionObjectDetailsDos": []
			};
			var country = {
				"attributeId": "ATR29",
				"attributeDesc": "Country",
				// "attributeDetailsGuid": "20fecf50-7ee4-4fd2-824b-a1335261ffe1",
				// "attributeDetailsGuid": "1b893006-7a8b-4797-8d93-91ff7164065d",
				"attributeDetailsGuid": attributeDetails[28].attributeDetailsGuid,
				"domainCode": "cc",
				"isInclusion": true,
				"aliasName": "customAttribute1",
				"permissionObjectDetailsDos": []
			};
			var ordertype = {
				"attributeId": "ATR08",
				"attributeDesc": "Order Type",
				// "attributeDetailsGuid": "680e944e-be2f-4939-b49e-3bf78007cdae",
				// "attributeDetailsGuid": "4bf4f63c-b61c-4903-bf50-c2c94de50abc",
				"attributeDetailsGuid": attributeDetails[7].attributeDetailsGuid,
				"domainCode": "cc",
				"isInclusion": true,
				"aliasName": "customAttribute1",
				"permissionObjectDetailsDos": []
			};
			var materialGrp2 = {
				"attributeId": "ATR12",
				"attributeDesc": "Material Group 2",
				// "attributeDetailsGuid": "d07fd2b4-7a05-42da-b80c-cf5cd7072d73",
				// "attributeDetailsGuid": "00361c67-4176-4ef1-b971-0f4d523e1bdf",
				"attributeDetailsGuid": attributeDetails[11].attributeDetailsGuid,
				"domainCode": "cc",
				"isInclusion": true,
				"aliasName": "customAttribute1",
				"permissionObjectDetailsDos": []
			};
			var materialGrp3 = {
				"attributeId": "ATR13",
				"attributeDesc": "Material Group 3",
				// "attributeDetailsGuid": "6bcaa32d-43cd-4bf0-aa78-e2398fa15987",
				// "attributeDetailsGuid": "32663f15-0cdc-41ca-aadf-f309426a1c2d",
				"attributeDetailsGuid": attributeDetails[12].attributeDetailsGuid,
				"domainCode": "cc",
				"isInclusion": true,
				"aliasName": "customAttribute1",
				"permissionObjectDetailsDos": []
			};
			var materialGrp5 = {
				"attributeId": "ATR14",
				"attributeDesc": "Material Group 5",
				// "attributeDetailsGuid": "825e85ff-2221-4dca-a41f-37ee8bf138e4",
				// "attributeDetailsGuid": "33c2d687-181d-400d-934e-89a94009e20c",
				"attributeDetailsGuid": attributeDetails[13].attributeDetailsGuid,
				"domainCode": "cc",
				"isInclusion": true,
				"aliasName": "customAttribute1",
				"permissionObjectDetailsDos": []
			};
			var prodhierarchy1 = {
				"attributeId": "ATR15",
				"attributeDesc": "Product hierarchy 1",
				// "attributeDetailsGuid": "1be1c0ad-aeea-4f0f-8b6a-64cb2ce23bae",
				// "attributeDetailsGuid": "e6bc7d1b-071d-414d-8dc0-b968dfa5f81a",
				"attributeDetailsGuid": attributeDetails[14].attributeDetailsGuid,
				"domainCode": "cc",
				"isInclusion": true,
				"aliasName": "customAttribute1",
				"permissionObjectDetailsDos": []
			};
			var prodhierarchy2 = {
				"attributeId": "ATR16",
				"attributeDesc": "Product hierarchy 2",
				// "attributeDetailsGuid": "d2020c36-9be1-427d-8844-32f86fda59cd",
				// "attributeDetailsGuid": "aac021f3-edb1-4ab2-bcaa-884454377fbb",
				"attributeDetailsGuid": attributeDetails[15].attributeDetailsGuid,
				"domainCode": "cc",
				"isInclusion": true,
				"aliasName": "customAttribute1",
				"permissionObjectDetailsDos": []
			};
			var prodhierarchy3 = {
				"attributeId": "ATR17",
				"attributeDesc": "Product hierarchy 3",
				// "attributeDetailsGuid": "9fd58ee5-5bdc-45be-b21c-8305bc0df5ce",
				// "attributeDetailsGuid": "f04befae-10cd-48a6-82de-c6effef652df",
				"attributeDetailsGuid": attributeDetails[16].attributeDetailsGuid,
				"domainCode": "cc",
				"isInclusion": true,
				"aliasName": "customAttribute1",
				"permissionObjectDetailsDos": []
			};
			var prodhierarchy4 = {
				"attributeId": "ATR18",
				"attributeDesc": "Product hierarchy 4",
				// "attributeDetailsGuid": "0c8b2093-1841-4ed9-8b38-d5e0d7699ce0",
				// "attributeDetailsGuid": "4a2341a2-791c-434b-9b5f-3bc460cb8387",
				"attributeDetailsGuid": attributeDetails[17].attributeDetailsGuid,
				"domainCode": "cc",
				"isInclusion": true,
				"aliasName": "customAttribute1",
				"permissionObjectDetailsDos": []
			};
			var prodhierarchy5 = {
				"attributeId": "ATR19",
				"attributeDesc": "Product hierarchy 5",
				// "attributeDetailsGuid": "88b446c9-481d-432a-8b2d-1dc5f6b546aa",
				// "attributeDetailsGuid": "c0dcba57-6e89-4f06-a012-5ff991e35854",
				"attributeDetailsGuid": attributeDetails[18].attributeDetailsGuid,
				"domainCode": "cc",
				"isInclusion": true,
				"aliasName": "customAttribute1",
				"permissionObjectDetailsDos": []
			};
			var prodhierarchy6 = {
				"attributeId": "ATR20",
				"attributeDesc": "Product hierarchy 6",
				// "attributeDetailsGuid": "b033d5d5-e072-47f4-86a4-00d040b8719c",
				// "attributeDetailsGuid": "c8b278f2-d085-49b3-bd55-e703a9907520",
				"attributeDetailsGuid": attributeDetails[19].attributeDetailsGuid,
				"domainCode": "cc",
				"isInclusion": true,
				"aliasName": "customAttribute1",
				"permissionObjectDetailsDos": []
			};
			var prodhierarchy7 = {
				"attributeId": "ATR21",
				"attributeDesc": "Product hierarchy 7",
				// "attributeDetailsGuid": "f68c5793-3c8e-48f0-83c4-3991474d373b",
				// "attributeDetailsGuid": "7981c4f7-0fdb-48ff-ac99-989b46fe6d5c",
				"attributeDetailsGuid": attributeDetails[20].attributeDetailsGuid,
				"domainCode": "cc",
				"isInclusion": true,
				"aliasName": "customAttribute1",
				"permissionObjectDetailsDos": []
			};
			var cusgrp = {
				"attributeId": "ATR22",
				"attributeDesc": "Customer Group",
				// "attributeDetailsGuid": "b6e26e5e-f670-488a-85bf-173a0c2fec82",
				// "attributeDetailsGuid": "391baef4-fc5b-4e9a-908f-d75d0003c11d",
				"attributeDetailsGuid": attributeDetails[21].attributeDetailsGuid,
				"domainCode": "cc",
				"isInclusion": true,
				"aliasName": "customAttribute1",
				"permissionObjectDetailsDos": []
			};
			var cusgrp1 = {
				"attributeId": "ATR23",
				"attributeDesc": "Customer Group 1",
				// "attributeDetailsGuid": "1d0d7096-f4da-4080-a946-dcb0fed8e55b",
				// "attributeDetailsGuid": "1d984648-42f6-41b2-a9c2-ddb72b6f8e60",
				"attributeDetailsGuid": attributeDetails[22].attributeDetailsGuid,
				"domainCode": "cc",
				"isInclusion": true,
				"aliasName": "customAttribute1",
				"permissionObjectDetailsDos": []
			};
			var cusgrp2 = {
				"attributeId": "ATR24",
				"attributeDesc": "Customer Group 2",
				// "attributeDetailsGuid": "51612f4d-85e1-4f57-9665-ba76bb6fbddd",
				// "attributeDetailsGuid": "7f61ca91-4e1c-4fdc-8d3d-ea0238bc9c82",
				"attributeDetailsGuid": attributeDetails[23].attributeDetailsGuid,
				"domainCode": "cc",
				"isInclusion": true,
				"aliasName": "customAttribute1",
				"permissionObjectDetailsDos": []
			};
			var cusgrp3 = {
				"attributeId": "ATR25",
				"attributeDesc": "Customer Group 3",
				// "attributeDetailsGuid": "72d8d8ab-99bc-4412-83d9-4c11705b7418",
				// "attributeDetailsGuid": "ebf2c5bc-3fe0-4099-b6bd-fc810f404726",
				"attributeDetailsGuid": attributeDetails[24].attributeDetailsGuid,
				"domainCode": "cc",
				"isInclusion": true,
				"aliasName": "customAttribute1",
				"permissionObjectDetailsDos": []
			};
			var cusgrp4 = {
				"attributeId": "ATR26",
				"attributeDesc": "Customer Group 4",
				// "attributeDetailsGuid": "6112900f-9a00-4238-87f7-60fdd0ccc1ec",
				// "attributeDetailsGuid": "a7aedf3d-e7c0-4f6a-bbf9-78894b128fce",
				"attributeDetailsGuid": attributeDetails[25].attributeDetailsGuid,
				"domainCode": "cc",
				"isInclusion": true,
				"aliasName": "customAttribute1",
				"permissionObjectDetailsDos": []
			};
			var cusgrp5 = {
				"attributeId": "ATR27",
				"attributeDesc": "Customer Group 5",
				// "attributeDetailsGuid": "b85baf37-7eca-47f6-8c83-7ca808660f68",
				// "attributeDetailsGuid": "b429de78-5203-4b7e-ae75-077da35712b5",
				"attributeDetailsGuid": attributeDetails[26].attributeDetailsGuid,
				"domainCode": "cc",
				"isInclusion": true,
				"aliasName": "customAttribute1",
				"permissionObjectDetailsDos": []
			};
			var district1 = {
				"attributeId": "ATR28",
				"attributeDesc": "District",
				// "attributeDetailsGuid": "633ec7b6-6a2e-4205-89f7-5da123028d85",
				// "attributeDetailsGuid": "cfccd6e9-56e4-4774-944c-104c9dc6fefe",
				"attributeDetailsGuid": attributeDetails[27].attributeDetailsGuid,
				"domainCode": "cc",
				"isInclusion": true,
				"aliasName": "customAttribute1",
				"permissionObjectDetailsDos": []
			};
			var material = {
				"attributeId": "ATR07",
				"attributeDesc": "Material",
				// "attributeDetailsGuid": "cb203a9e-1a62-465f-92c6-0f8b214cc580",
				// "attributeDetailsGuid": "1199db72-bce4-46dd-b017-14d572aaba97",
				"attributeDetailsGuid": attributeDetails[6].attributeDetailsGuid,
				"domainCode": "cc",
				"isInclusion": true,
				"aliasName": "customAttribute1",
				"permissionObjectDetailsDos": []
			};

			/*	var objNameMdl = new sap.ui.model.json.JSONModel();
				this.getView().byId("idObjName").setModel(objNameMdl, "objNameMdl");*/

			//sales organization"permissionDesc": "",
			var visibleModel = new JSONModel();
			this.getView().setModel(visibleModel, "visibleModel");
			for (var i = 0; i < Data.length; i++) {
				if (Data.length === 29) {
					var cn = 0;
					for (var k = 0; k < Data.length; k++) {
						if (Data[k].permissionObjectDetailsDos && Data[k].permissionObjectDetailsDos[0].attributeValue === "*") {
							cn++;
						} else if (!Data[k].permissionObjectDetailsDos) {
							cn++;
						}
					}
					if (cn === 29) {
						all_Switch = true;
					}
					this.switchCount = cn;
				}
				if (Data[i].permissionObjectDetailsDos && Data[i].attributeId === "ATR01") {
					visibleModel.getData().ATR01visible = true;
					if (Data[i].permissionObjectDetailsDos[0].attributeValue !==
						"*") {
						for (var j = 0; j < Data[i].permissionObjectDetailsDos.length; j++) {
							salesOrg.permissionObjectDetailsDos.push({
								"permissionObjectGuid": this.perid,
								// "attributeDetailsGuid": "169a3fd1-2c99-43e5-96dc-466e1ef1e6bf",
								// "attributeDetailsGuid": "b079d1a3-f310-46ea-a5a3-8aef8e24d872",
								"attributeDetailsGuid": attributeDetails[0].attributeDetailsGuid,
								"attributeValue": Data[i].permissionObjectDetailsDos[j].attributeValue,
								"attributeText": Data[i].permissionObjectDetailsDos[j].attributeText,
							});
						}
						temp_SalesOrgSwitch = false;
					}

					if (Data[i].permissionObjectDetailsDos[0].attributeValue === "*") {
						temp_SalesOrgSwitch = true;
						salesOrg.permissionObjectDetailsDos = [];
					}
				}

			}
			//Distribution Channel

			for (var i = 0; i < Data.length; i++) {
				if (Data[i].permissionObjectDetailsDos && Data[i].attributeId === "ATR02") {
					visibleModel.getData().ATR02visible = true;
					if (Data[i].permissionObjectDetailsDos[0].attributeValue !== "*") {
						for (var j = 0; j < Data[i].permissionObjectDetailsDos.length; j++) {
							distriChanne.permissionObjectDetailsDos.push({
								"permissionObjectGuid": this.perid,
								// "attributeDetailsGuid": "2570f50a-ef16-4b85-b9d1-2f0e1902d39e",
								// "attributeDetailsGuid": "57af0c60-3e1e-4c11-8ab7-90801bcec343",
								"attributeDetailsGuid": attributeDetails[1].attributeDetailsGuid,
								"attributeValue": Data[i].permissionObjectDetailsDos[j].attributeValue,
								"attributeText": Data[i].permissionObjectDetailsDos[j].attributeText
							});
						}
						temp_DistribuChanlSwitch = false;
					}

					if (Data[i].permissionObjectDetailsDos[0].attributeValue === "*") {
						temp_DistribuChanlSwitch = true;
						distriChanne.permissionObjectDetailsDos = [];
					}
				}
			}
			//Division
			for (var i = 0; i < Data.length; i++) {
				if (Data[i].permissionObjectDetailsDos && Data[i].attributeId === "ATR03") {
					visibleModel.getData().ATR03visible = true;
					if (Data[i].permissionObjectDetailsDos[0].attributeValue !== "*") {
						for (var j = 0; j < Data[i].permissionObjectDetailsDos.length; j++) {
							district.permissionObjectDetailsDos.push({
								"permissionObjectGuid": this.perid,
								// "attributeDetailsGuid": "e3b54ff6-9b08-43b0-a91c-ccc6036810fd",
								// "attributeDetailsGuid": "b3857ec1-4058-462e-842d-d88f85087b69",
								"attributeDetailsGuid": attributeDetails[2].attributeDetailsGuid,
								"attributeValue": Data[i].permissionObjectDetailsDos[j].attributeValue,
								"attributeText": Data[i].permissionObjectDetailsDos[j].attributeText

							});
						}
						temp_DistrictSwitch = false;
					}

					if (Data[i].permissionObjectDetailsDos[0].attributeValue === "*") {
						temp_DistrictSwitch = true;
						district.permissionObjectDetailsDos = [];
					}
				}
			}

			//Material Goup			
			for (var i = 0; i < Data.length; i++) {
				if (Data[i].permissionObjectDetailsDos && Data[i].attributeId === "ATR04") {
					visibleModel.getData().ATR04visible = true;
					if (Data[i].permissionObjectDetailsDos[0].attributeValue !== "*") {
						for (var j = 0; j < Data[i].permissionObjectDetailsDos.length; j++) {
							materialGrp.permissionObjectDetailsDos.push({
								"permissionObjectGuid": this.perid,
								// "attributeDetailsGuid": "686d2593-3ba4-4ffa-a1e8-386c2fa66c78",
								// "attributeDetailsGuid": "072276f7-7847-46de-af1a-c065ca59731a",
								"attributeDetailsGuid": attributeDetails[3].attributeDetailsGuid,
								"attributeValue": Data[i].permissionObjectDetailsDos[j].attributeValue,
								"attributeText": Data[i].permissionObjectDetailsDos[j].attributeText
							});
						}
						temp_MaterialGrpSwitch = false;
					}

					if (Data[i].permissionObjectDetailsDos[0].attributeValue === "*") {
						temp_MaterialGrpSwitch = true;
						materialGrp.permissionObjectDetailsDos = [];
					}
				}
			}

			//Material Goup	4
			for (var i = 0; i < Data.length; i++) {
				if (Data[i].permissionObjectDetailsDos && Data[i].attributeId === "ATR05") {
					visibleModel.getData().ATR05visible = true;
					if (Data[i].permissionObjectDetailsDos[0].attributeValue !== "*") {
						for (var j = 0; j < Data[i].permissionObjectDetailsDos.length; j++) {
							materialGrp4.permissionObjectDetailsDos.push({
								"permissionObjectGuid": this.perid,
								// "attributeDetailsGuid": "2da6d510-80f4-4773-8c87-80287ab41526",
								// "attributeDetailsGuid": "80709c4b-3273-4bec-91a1-42e47161a17a",
								"attributeDetailsGuid": attributeDetails[4].attributeDetailsGuid,
								"attributeValue": Data[i].permissionObjectDetailsDos[j].attributeValue,
								"attributeText": Data[i].permissionObjectDetailsDos[j].attributeText
							});
						}
						temp_MaterialGrp4Switch = false;
					}
					if (Data[i].permissionObjectDetailsDos[0].attributeValue === "*") {
						temp_MaterialGrp4Switch = true;
						materialGrp4.permissionObjectDetailsDos = [];
					}
				}
			}
			//Customer Code				
			for (var i = 0; i < Data.length; i++) {
				if (Data[i].permissionObjectDetailsDos && Data[i].attributeId === "ATR06") {
					visibleModel.getData().ATR06visible = true;
					if (Data[i].permissionObjectDetailsDos[0].attributeValue !== "*") {
						for (var j = 0; j < Data[i].permissionObjectDetailsDos.length; j++) {
							custNum.permissionObjectDetailsDos.push({
								"permissionObjectGuid": this.perid,
								// "attributeDetailsGuid": "3a937ca7-16e5-47be-93ef-b647577aeb36",
								// "attributeDetailsGuid": "f2a21bfd-8bcb-475b-b707-55c596864c5d",
								"attributeDetailsGuid": attributeDetails[5].attributeDetailsGuid,
								"attributeValue": Data[i].permissionObjectDetailsDos[j].attributeValue,
								"attributeText": Data[i].permissionObjectDetailsDos[j].attributeText
							});
						}
						temp_CustomerSwitch = false;
					}

					if (Data[i].permissionObjectDetailsDos[0].attributeValue === "*") {
						temp_CustomerSwitch = true;
						custNum.permissionObjectDetailsDos = [];
					}
				}
			}
			//Material Group One

			for (var i = 0; i < Data.length; i++) {
				if (Data[i].permissionObjectDetailsDos && Data[i].attributeId === "ATR11") {
					visibleModel.getData().ATR11visible = true;
					if (Data[i].permissionObjectDetailsDos[0].attributeValue !== "*") {
						for (var j = 0; j < Data[i].permissionObjectDetailsDos.length; j++) {
							materialGrpOne.permissionObjectDetailsDos.push({
								"permissionObjectGuid": this.perid,
								// "attributeDetailsGuid": "16a3b281-a75c-4e87-8d28-28b1397e6045",
								// "attributeDetailsGuid": "0324bfea-8d38-4b4a-a80e-4afe1021b4a4",
								"attributeDetailsGuid": attributeDetails[10].attributeDetailsGuid,
								"attributeValue": Data[i].permissionObjectDetailsDos[j].attributeValue,
								"attributeText": Data[i].permissionObjectDetailsDos[j].attributeText
							});
						}
						temp_MaterialGrpOneSwitch = false;
					}

					if (Data[i].permissionObjectDetailsDos[0].attributeValue === "*") {
						temp_MaterialGrpOneSwitch = true;
						materialGrpOne.permissionObjectDetailsDos = [];
					}
				}
			}

			for (var i = 0; i < Data.length; i++) {
				if (Data[i].permissionObjectDetailsDos && Data[i].attributeId === "ATR09") {
					visibleModel.getData().ATR09visible = true;
					if (Data[i].permissionObjectDetailsDos[0].attributeValue !== "*") {
						for (var j = 0; j < Data[i].permissionObjectDetailsDos.length; j++) {
							plant.permissionObjectDetailsDos.push({
								"permissionObjectGuid": this.perid,
								// "attributeDetailsGuid": "748199bd-b84a-4a63-8fa2-874b2935c510",
								// "attributeDetailsGuid": "666771cd-edf5-48f9-9214-b7851b59ab3b",
								"attributeDetailsGuid": attributeDetails[8].attributeDetailsGuid,
								"attributeValue": Data[i].permissionObjectDetailsDos[j].attributeValue,
								"attributeText": Data[i].permissionObjectDetailsDos[j].attributeText
							});
						}
						temp_PlantSwitch = false;
					} else if (Data[i].permissionObjectDetailsDos[0].attributeValue === "*") {
						temp_PlantSwitch = true;
						plant.permissionObjectDetailsDos = [];
					}
				}
			}
			for (var i = 0; i < Data.length; i++) {
				if (Data[i].permissionObjectDetailsDos && Data[i].attributeId === "ATR29") {
					visibleModel.getData().ATR29visible = true;
					if (Data[i].permissionObjectDetailsDos[0].attributeValue !== "*") {
						for (var j = 0; j < Data[i].permissionObjectDetailsDos.length; j++) {
							country.permissionObjectDetailsDos.push({
								"permissionObjectGuid": this.perid,
								// "attributeDetailsGuid": "20fecf50-7ee4-4fd2-824b-a1335261ffe1",
								// "attributeDetailsGuid": "1b893006-7a8b-4797-8d93-91ff7164065d",
								"attributeDetailsGuid": attributeDetails[28].attributeDetailsGuid,
								"attributeValue": Data[i].permissionObjectDetailsDos[j].attributeValue,
								"attributeText": Data[i].permissionObjectDetailsDos[j].attributeText
							});
						}
						temp_CountrySwitch = false;
					} else if (Data[i].permissionObjectDetailsDos[0].attributeValue === "*") {
						temp_CountrySwitch = true;
						country.permissionObjectDetailsDos = [];
					}
				}
			}

			for (var i = 0; i < Data.length; i++) {
				if (Data[i].permissionObjectDetailsDos && Data[i].attributeId === "ATR08") {
					visibleModel.getData().ATR08visible = true;
					if (Data[i].permissionObjectDetailsDos[0].attributeValue !== "*") {
						for (var j = 0; j < Data[i].permissionObjectDetailsDos.length; j++) {
							ordertype.permissionObjectDetailsDos.push({
								"permissionObjectGuid": this.perid,
								// "attributeDetailsGuid": "680e944e-be2f-4939-b49e-3bf78007cdae",
								// "attributeDetailsGuid": "4bf4f63c-b61c-4903-bf50-c2c94de50abc",
								"attributeDetailsGuid": attributeDetails[7].attributeDetailsGuid,
								"attributeValue": Data[i].permissionObjectDetailsDos[j].attributeValue,
								"attributeText": Data[i].permissionObjectDetailsDos[j].attributeText
							});
						}
						temp_OrderTypeSwitch = false;
					} else if (Data[i].permissionObjectDetailsDos[0].attributeValue === "*") {
						temp_OrderTypeSwitch = true;
						ordertype.permissionObjectDetailsDos = [];
					}
				}
			}
			for (var i = 0; i < Data.length; i++) {
				if (Data[i].permissionObjectDetailsDos && Data[i].attributeId === "ATR10") {
					visibleModel.getData().ATR10visible = true;
					if (Data[i].permissionObjectDetailsDos[0].attributeValue !== "*") {
						for (var j = 0; j < Data[i].permissionObjectDetailsDos.length; j++) {
							storloc.permissionObjectDetailsDos.push({
								"permissionObjectGuid": this.perid,
								// "attributeDetailsGuid": "9fe7dbb1-7375-4835-804d-0174c098117f",
								// "attributeDetailsGuid": "9e26dae3-4dc4-4ed3-83e0-94312c3b5ec9",
								"attributeDetailsGuid": attributeDetails[9].attributeDetailsGuid,
								"attributeValue": Data[i].permissionObjectDetailsDos[j].attributeValue,
								"attributeText": Data[i].permissionObjectDetailsDos[j].attributeText
							});
						}
						temp_StorLocSwitch = false;
					} else if (Data[i].permissionObjectDetailsDos[0].attributeValue === "*") {
						temp_StorLocSwitch = true;
						storloc.permissionObjectDetailsDos = [];
					}
				}
			}

			for (var i = 0; i < Data.length; i++) {
				if (Data[i].permissionObjectDetailsDos && Data[i].attributeId === "ATR12") {
					visibleModel.getData().ATR12visible = true;
					if (Data[i].permissionObjectDetailsDos[0].attributeValue !== "*") {
						for (var j = 0; j < Data[i].permissionObjectDetailsDos.length; j++) {
							materialGrp2.permissionObjectDetailsDos.push({
								"permissionObjectGuid": this.perid,
								// "attributeDetailsGuid": "d07fd2b4-7a05-42da-b80c-cf5cd7072d73",
								// "attributeDetailsGuid": "00361c67-4176-4ef1-b971-0f4d523e1bdf",
								"attributeDetailsGuid": attributeDetails[11].attributeDetailsGuid,
								"attributeValue": Data[i].permissionObjectDetailsDos[j].attributeValue,
								"attributeText": Data[i].permissionObjectDetailsDos[j].attributeText
							});
						}
						temp_MaterialGrp2Switch = false;
					} else if (Data[i].permissionObjectDetailsDos[0].attributeValue === "*") {
						temp_MaterialGrp2Switch = true;
						materialGrp2.permissionObjectDetailsDos = [];
					}
				}
			}
			for (var i = 0; i < Data.length; i++) {
				if (Data[i].permissionObjectDetailsDos && Data[i].attributeId === "ATR13") {
					visibleModel.getData().ATR13visible = true;
					if (Data[i].permissionObjectDetailsDos[0].attributeValue !== "*") {
						for (var j = 0; j < Data[i].permissionObjectDetailsDos.length; j++) {
							materialGrp3.permissionObjectDetailsDos.push({
								"permissionObjectGuid": this.perid,
								// "attributeDetailsGuid": "6bcaa32d-43cd-4bf0-aa78-e2398fa15987",
								// "attributeDetailsGuid": "32663f15-0cdc-41ca-aadf-f309426a1c2d",
								"attributeDetailsGuid": attributeDetails[12].attributeDetailsGuid,
								"attributeValue": Data[i].permissionObjectDetailsDos[j].attributeValue,
								"attributeText": Data[i].permissionObjectDetailsDos[j].attributeText
							});
						}
						temp_MaterialGrp3Switch = false;
					} else if (Data[i].permissionObjectDetailsDos[0].attributeValue === "*") {
						temp_MaterialGrp3Switch = true;
						materialGrp3.permissionObjectDetailsDos = [];
					}
				}
			}
			for (var i = 0; i < Data.length; i++) {
				if (Data[i].permissionObjectDetailsDos && Data[i].attributeId === "ATR14") {
					visibleModel.getData().ATR14visible = true;
					if (Data[i].permissionObjectDetailsDos[0].attributeValue !== "*") {
						for (var j = 0; j < Data[i].permissionObjectDetailsDos.length; j++) {
							materialGrp5.permissionObjectDetailsDos.push({
								"permissionObjectGuid": this.perid,
								// "attributeDetailsGuid": "825e85ff-2221-4dca-a41f-37ee8bf138e4",
								// "attributeDetailsGuid": "33c2d687-181d-400d-934e-89a94009e20c",
								"attributeDetailsGuid": attributeDetails[13].attributeDetailsGuid,
								"attributeValue": Data[i].permissionObjectDetailsDos[j].attributeValue,
								"attributeText": Data[i].permissionObjectDetailsDos[j].attributeText
							});
						}
						temp_MaterialGrp5Switch = false;
					} else if (Data[i].permissionObjectDetailsDos[0].attributeValue === "*") {

						temp_MaterialGrp5Switch = true;
						materialGrp5.permissionObjectDetailsDos = [];
					}
				}
			}
			for (var i = 0; i < Data.length; i++) {
				if (Data[i].permissionObjectDetailsDos && Data[i].attributeId === "ATR15") {
					visibleModel.getData().ATR15visible = true;
					if (Data[i].permissionObjectDetailsDos[0].attributeValue !== "*") {
						for (var j = 0; j < Data[i].permissionObjectDetailsDos.length; j++) {
							prodhierarchy1.permissionObjectDetailsDos.push({
								"permissionObjectGuid": this.perid,
								// "attributeDetailsGuid": "1be1c0ad-aeea-4f0f-8b6a-64cb2ce23bae",
								// "attributeDetailsGuid": "e6bc7d1b-071d-414d-8dc0-b968dfa5f81a",
								"attributeDetailsGuid": attributeDetails[14].attributeDetailsGuid,
								"attributeValue": Data[i].permissionObjectDetailsDos[j].attributeValue,
								"attributeText": Data[i].permissionObjectDetailsDos[j].attributeText
							});
						}
						temp_ProdHierarchy1Switch = false;
					} else if (Data[i].permissionObjectDetailsDos[0].attributeValue === "*") {
						temp_ProdHierarchy1Switch = true;
						prodhierarchy1.permissionObjectDetailsDos = [];
					}
				}
			}
			for (var i = 0; i < Data.length; i++) {
				if (Data[i].permissionObjectDetailsDos && Data[i].attributeId === "ATR16") {
					visibleModel.getData().ATR16visible = true;
					if (Data[i].permissionObjectDetailsDos[0].attributeValue !== "*") {
						for (var j = 0; j < Data[i].permissionObjectDetailsDos.length; j++) {
							prodhierarchy2.permissionObjectDetailsDos.push({
								"permissionObjectGuid": this.perid,
								// "attributeDetailsGuid": "d2020c36-9be1-427d-8844-32f86fda59cd",
								// "attributeDetailsGuid": "aac021f3-edb1-4ab2-bcaa-884454377fbb",
								"attributeDetailsGuid": attributeDetails[15].attributeDetailsGuid,
								"attributeValue": Data[i].permissionObjectDetailsDos[j].attributeValue,
								"attributeText": Data[i].permissionObjectDetailsDos[j].attributeText
							});
						}
						temp_ProdHierarchy2Switch = false;
					} else if (Data[i].permissionObjectDetailsDos[0].attributeValue === "*") {
						temp_ProdHierarchy2Switch = true;
						prodhierarchy2.permissionObjectDetailsDos = [];
					}
				}
			}
			for (var i = 0; i < Data.length; i++) {
				if (Data[i].permissionObjectDetailsDos && Data[i].attributeId === "ATR17") {
					visibleModel.getData().ATR17visible = true;
					if (Data[i].permissionObjectDetailsDos[0].attributeValue !== "*") {
						for (var j = 0; j < Data[i].permissionObjectDetailsDos.length; j++) {
							prodhierarchy3.permissionObjectDetailsDos.push({
								"permissionObjectGuid": this.perid,
								// "attributeDetailsGuid": "9fd58ee5-5bdc-45be-b21c-8305bc0df5ce",
								// "attributeDetailsGuid": "f04befae-10cd-48a6-82de-c6effef652df",
								"attributeDetailsGuid": attributeDetails[16].attributeDetailsGuid,
								"attributeValue": Data[i].permissionObjectDetailsDos[j].attributeValue,
								"attributeText": Data[i].permissionObjectDetailsDos[j].attributeText
							});
						}
						temp_ProdHierarchy3Switch = false;
					} else if (Data[i].permissionObjectDetailsDos[0].attributeValue === "*") {
						temp_ProdHierarchy3Switch = true;
						prodhierarchy3.permissionObjectDetailsDos = [];
					}
				}
			}
			for (var i = 0; i < Data.length; i++) {
				if (Data[i].permissionObjectDetailsDos && Data[i].attributeId === "ATR18") {
					visibleModel.getData().ATR18visible = true;
					if (Data[i].permissionObjectDetailsDos[0].attributeValue !== "*") {

						for (var j = 0; j < Data[i].permissionObjectDetailsDos.length; j++) {
							prodhierarchy4.permissionObjectDetailsDos.push({
								"permissionObjectGuid": this.perid,
								// "attributeDetailsGuid": "0c8b2093-1841-4ed9-8b38-d5e0d7699ce0",
								// "attributeDetailsGuid": "4a2341a2-791c-434b-9b5f-3bc460cb8387",
								"attributeDetailsGuid": attributeDetails[17].attributeDetailsGuid,
								"attributeValue": Data[i].permissionObjectDetailsDos[j].attributeValue,
								"attributeText": Data[i].permissionObjectDetailsDos[j].attributeText
							});
						}
						temp_ProdHierarchy4Switch = false;
					} else if (Data[i].permissionObjectDetailsDos[0].attributeValue === "*") {
						temp_ProdHierarchy4Switch = true;
						prodhierarchy4.permissionObjectDetailsDos = [];
					}
				}
			}
			for (var i = 0; i < Data.length; i++) {
				if (Data[i].permissionObjectDetailsDos && Data[i].attributeId === "ATR19") {
					visibleModel.getData().ATR19visible = true;
					if (Data[i].permissionObjectDetailsDos[0].attributeValue !== "*") {
						for (var j = 0; j < Data[i].permissionObjectDetailsDos.length; j++) {
							prodhierarchy5.permissionObjectDetailsDos.push({
								"permissionObjectGuid": this.perid,
								// "attributeDetailsGuid": "88b446c9-481d-432a-8b2d-1dc5f6b546aa",
								// "attributeDetailsGuid": "c0dcba57-6e89-4f06-a012-5ff991e35854",
								"attributeDetailsGuid": attributeDetails[18].attributeDetailsGuid,
								"attributeValue": Data[i].permissionObjectDetailsDos[j].attributeValue,
								"attributeText": Data[i].permissionObjectDetailsDos[j].attributeText
							});
						}
						temp_ProdHierarchy5Switch = false;
					} else if (Data[i].permissionObjectDetailsDos[0].attributeValue === "*") {
						temp_ProdHierarchy5Switch = true;
						prodhierarchy5.permissionObjectDetailsDos = [];
					}
				}
			}
			for (var i = 0; i < Data.length; i++) {
				if (Data[i].permissionObjectDetailsDos && Data[i].attributeId === "ATR20") {
					visibleModel.getData().ATR20visible = true;
					if (Data[i].permissionObjectDetailsDos[0].attributeValue !== "*") {
						for (var j = 0; j < Data[i].permissionObjectDetailsDos.length; j++) {
							prodhierarchy6.permissionObjectDetailsDos.push({
								"permissionObjectGuid": this.perid,
								// "attributeDetailsGuid": "b033d5d5-e072-47f4-86a4-00d040b8719c",
								// "attributeDetailsGuid": "c8b278f2-d085-49b3-bd55-e703a9907520",
								"attributeDetailsGuid": attributeDetails[19].attributeDetailsGuid,
								"attributeValue": Data[i].permissionObjectDetailsDos[j].attributeValue,
								"attributeText": Data[i].permissionObjectDetailsDos[j].attributeText
							});
						}
						temp_ProdHierarchy6Switch = false;
					} else if (Data[i].permissionObjectDetailsDos[0].attributeValue === "*") {
						temp_ProdHierarchy6Switch = true;
						prodhierarchy6.permissionObjectDetailsDos = [];
					}
				}
			}
			for (var i = 0; i < Data.length; i++) {
				if (Data[i].permissionObjectDetailsDos && Data[i].attributeId === "ATR21") {
					visibleModel.getData().ATR21visible = true;
					if (Data[i].permissionObjectDetailsDos[0].attributeValue !== "*") {
						for (var j = 0; j < Data[i].permissionObjectDetailsDos.length; j++) {
							prodhierarchy7.permissionObjectDetailsDos.push({
								"permissionObjectGuid": this.perid,
								// "attributeDetailsGuid": "f68c5793-3c8e-48f0-83c4-3991474d373b",
								// "attributeDetailsGuid": "7981c4f7-0fdb-48ff-ac99-989b46fe6d5c",
								"attributeDetailsGuid": attributeDetails[20].attributeDetailsGuid,
								"attributeValue": Data[i].permissionObjectDetailsDos[j].attributeValue,
								"attributeText": Data[i].permissionObjectDetailsDos[j].attributeText
							});
						}
						temp_ProdHierarchy7Switch = false;
					} else if (Data[i].permissionObjectDetailsDos[0].attributeValue === "*") {
						temp_ProdHierarchy7Switch = true;
						prodhierarchy7.permissionObjectDetailsDos = [];
					}
				}
			}
			/*	for (var i=0; i < Data.length; i++){
			                       if(Data[i].attributeId.attributeId=== "ATR21" && Data[i].attributeValue !== "*"){
			                        prodhierarchy7.push({
												"attributeValue": Data[i].attributeValue,
			                                    "attributeValueDesc": Data[i].attributeValueDesc,
			                                    "inclusion" : Data[i].inclusion
											});
			                       }
									}*/
			for (var i = 0; i < Data.length; i++) {
				if (Data[i].permissionObjectDetailsDos && Data[i].attributeId === "ATR23") {
					visibleModel.getData().ATR23visible = true;
					if (Data[i].permissionObjectDetailsDos[0].attributeValue !== "*") {
						for (var j = 0; j < Data[i].permissionObjectDetailsDos.length; j++) {
							cusgrp1.permissionObjectDetailsDos.push({
								"permissionObjectGuid": this.perid,
								// "attributeDetailsGuid": "1d0d7096-f4da-4080-a946-dcb0fed8e55b",
								// "attributeDetailsGuid": "1d984648-42f6-41b2-a9c2-ddb72b6f8e60",
								"attributeDetailsGuid": attributeDetails[22].attributeDetailsGuid,
								"attributeValue": Data[i].permissionObjectDetailsDos[j].attributeValue,
								"attributeText": Data[i].permissionObjectDetailsDos[j].attributeText
							});
						}
						temp_CustomerGrp1Switch = false;
					} else if (Data[i].permissionObjectDetailsDos[0].attributeValue === "*") {
						temp_CustomerGrp1Switch = true;
						cusgrp1.permissionObjectDetailsDos = [];
					}
				}
			}
			for (var i = 0; i < Data.length; i++) {
				if (Data[i].permissionObjectDetailsDos && Data[i].attributeId === "ATR22") {
					visibleModel.getData().ATR22visible = true;
					if (Data[i].permissionObjectDetailsDos[0].attributeValue !== "*") {
						for (var j = 0; j < Data[i].permissionObjectDetailsDos.length; j++) {
							cusgrp.permissionObjectDetailsDos.push({
								"permissionObjectGuid": this.perid,
								// "attributeDetailsGuid": "b6e26e5e-f670-488a-85bf-173a0c2fec82",
								// "attributeDetailsGuid": "391baef4-fc5b-4e9a-908f-d75d0003c11d",
								"attributeDetailsGuid": attributeDetails[21].attributeDetailsGuid,
								"attributeValue": Data[i].permissionObjectDetailsDos[j].attributeValue,
								"attributeText": Data[i].permissionObjectDetailsDos[j].attributeText
							});
						}
						temp_CustomerGrpSwitch = false;
					} else if (Data[i].permissionObjectDetailsDos[0].attributeValue === "*") {
						temp_CustomerGrpSwitch = true;
						cusgrp.permissionObjectDetailsDos = [];
					}
				}
			}
			for (var i = 0; i < Data.length; i++) {
				if (Data[i].permissionObjectDetailsDos && Data[i].attributeId === "ATR24") {
					visibleModel.getData().ATR24visible = true;
					if (Data[i].permissionObjectDetailsDos[0].attributeValue !== "*") {
						for (var j = 0; j < Data[i].permissionObjectDetailsDos.length; j++) {
							cusgrp2.permissionObjectDetailsDos.push({
								"permissionObjectGuid": this.perid,
								// "attributeDetailsGuid": "51612f4d-85e1-4f57-9665-ba76bb6fbddd",
								// "attributeDetailsGuid": "7f61ca91-4e1c-4fdc-8d3d-ea0238bc9c82",
								"attributeDetailsGuid": attributeDetails[23].attributeDetailsGuid,
								"attributeValue": Data[i].permissionObjectDetailsDos[j].attributeValue,
								"attributeText": Data[i].permissionObjectDetailsDos[j].attributeText
							});
						}
						temp_CustomerGrp2Switch = false;
					} else if (Data[i].permissionObjectDetailsDos[0].attributeValue === "*") {
						temp_CustomerGrp2Switch = true;
						cusgrp2.permissionObjectDetailsDos = [];
					}
				}
			}
			for (var i = 0; i < Data.length; i++) {
				if (Data[i].permissionObjectDetailsDos && Data[i].attributeId === "ATR25") {
					visibleModel.getData().ATR25visible = true;
					if (Data[i].permissionObjectDetailsDos[0].attributeValue !== "*") {
						for (var j = 0; j < Data[i].permissionObjectDetailsDos.length; j++) {
							cusgrp3.permissionObjectDetailsDos.push({
								"permissionObjectGuid": this.perid,
								// "attributeDetailsGuid": "72d8d8ab-99bc-4412-83d9-4c11705b7418",
								// "attributeDetailsGuid": "ebf2c5bc-3fe0-4099-b6bd-fc810f404726",
								"attributeDetailsGuid": attributeDetails[24].attributeDetailsGuid,
								"attributeValue": Data[i].permissionObjectDetailsDos[j].attributeValue,
								"attributeText": Data[i].permissionObjectDetailsDos[j].attributeText
							});
						}
						temp_CustomerGrp3Switch = false;
					} else if (Data[i].permissionObjectDetailsDos[0].attributeValue === "*") {
						temp_CustomerGrp3Switch = true;
						cusgrp3.permissionObjectDetailsDos = [];
					}
				}
			}
			for (var i = 0; i < Data.length; i++) {
				if (Data[i].permissionObjectDetailsDos && Data[i].attributeId === "ATR26") {
					visibleModel.getData().ATR26visible = true;
					if (Data[i].permissionObjectDetailsDos[0].attributeValue !== "*") {
						for (var j = 0; j < Data[i].permissionObjectDetailsDos.length; j++) {
							cusgrp4.permissionObjectDetailsDos.push({
								"permissionObjectGuid": this.perid,
								// "attributeDetailsGuid": "6112900f-9a00-4238-87f7-60fdd0ccc1ec",
								// "attributeDetailsGuid": "a7aedf3d-e7c0-4f6a-bbf9-78894b128fce",
								"attributeDetailsGuid": attributeDetails[25].attributeDetailsGuid,
								"attributeValue": Data[i].permissionObjectDetailsDos[j].attributeValue,
								"attributeText": Data[i].permissionObjectDetailsDos[j].attributeText
							});
						}
						temp_CustomerGrp4Switch = false;
					} else if (Data[i].permissionObjectDetailsDos[0].attributeValue === "*") {
						temp_CustomerGrp4Switch = true;
						cusgrp4.permissionObjectDetailsDos = [];
					}
				}
			}
			for (var i = 0; i < Data.length; i++) {
				if (Data[i].permissionObjectDetailsDos && Data[i].attributeId === "ATR27") {
					visibleModel.getData().ATR27visible = true;
					if (Data[i].permissionObjectDetailsDos[0].attributeValue !== "*") {
						for (var j = 0; j < Data[i].permissionObjectDetailsDos.length; j++) {
							cusgrp5.permissionObjectDetailsDos.push({
								"permissionObjectGuid": this.perid,
								// "attributeDetailsGuid": "b85baf37-7eca-47f6-8c83-7ca808660f68",
								// "attributeDetailsGuid": "b429de78-5203-4b7e-ae75-077da35712b5",
								"attributeDetailsGuid": attributeDetails[26].attributeDetailsGuid,
								"attributeValue": Data[i].permissionObjectDetailsDos[j].attributeValue,
								"attributeText": Data[i].permissionObjectDetailsDos[j].attributeText
							});
						}
						temp_CustomerGrp5Switch = false;
					} else if (Data[i].permissionObjectDetailsDos[0].attributeValue === "*") {
						temp_CustomerGrp5Switch = true;
						cusgrp5.permissionObjectDetailsDos = [];
					}
				}
			}
			for (var i = 0; i < Data.length; i++) {
				if (Data[i].permissionObjectDetailsDos && Data[i].attributeId === "ATR28") {
					visibleModel.getData().ATR28visible = true;
					if (Data[i].permissionObjectDetailsDos[0].attributeValue !== "*") {
						for (var j = 0; j < Data[i].permissionObjectDetailsDos.length; j++) {
							district1.permissionObjectDetailsDos.push({
								"permissionObjectGuid": this.perid,
								// "attributeDetailsGuid": "633ec7b6-6a2e-4205-89f7-5da123028d85",
								// "attributeDetailsGuid": "cfccd6e9-56e4-4774-944c-104c9dc6fefe",
								"attributeDetailsGuid": attributeDetails[27].attributeDetailsGuid,
								"attributeValue": Data[i].permissionObjectDetailsDos[j].attributeValue,
								"attributeText": Data[i].permissionObjectDetailsDos[j].attributeText
							});
						}
						temp_District1Switch = false;
					} else if (Data[i].permissionObjectDetailsDos[0].attributeValue === "*") {
						temp_District1Switch = true;
						district1.permissionObjectDetailsDos = [];
					}
				}
			}
			for (var i = 0; i < Data.length; i++) {
				if (Data[i].permissionObjectDetailsDos && Data[i].attributeId === "ATR07") {
					visibleModel.getData().ATR07visible = true;
					if (Data[i].permissionObjectDetailsDos[0].attributeValue !== "*") {
						for (var j = 0; j < Data[i].permissionObjectDetailsDos.length; j++) {
							material.permissionObjectDetailsDos.push({
								"permissionObjectGuid": this.perid,
								// "attributeDetailsGuid": "cb203a9e-1a62-465f-92c6-0f8b214cc580",
								// "attributeDetailsGuid": "1199db72-bce4-46dd-b017-14d572aaba97",
								"attributeDetailsGuid": attributeDetails[6].attributeDetailsGuid,
								"attributeValue": Data[i].permissionObjectDetailsDos[j].attributeValue,
								"attributeText": Data[i].permissionObjectDetailsDos[j].attributeText
							});
						}
						temp_MaterialSwitch = false;
					} else if (Data[i].permissionObjectDetailsDos[0].attributeValue === "*") {
						temp_MaterialSwitch = true;
						material.permissionObjectDetailsDos = [];
					}
				}
			}

			//sales organization
			var oModelSalsOrg = new sap.ui.model.json.JSONModel({
				results: salesOrg
			});
			oModelSalsOrg.setSizeLimit(salesOrg.permissionObjectDetailsDos.length);
			this.getView().byId("ID_TBL_VIEW_PROV_SELS_ORG").setModel(oModelSalsOrg, "SlaesOrgViewSet");

			//for distribution channel

			var oModelDistri = new sap.ui.model.json.JSONModel({
				results: distriChanne
			});
			oModelDistri.setSizeLimit(distriChanne.permissionObjectDetailsDos.length);
			this.getView().byId("ID_TBL_VIEW_PROV_DISTRU_CHANL").setModel(oModelDistri, "DistributionChannelViewSet");

			//for customer
			var oModelCustModel = new sap.ui.model.json.JSONModel({
				results: custNum
			});
			oModelCustModel.setSizeLimit(custNum.permissionObjectDetailsDos.length);
			this.getView().byId("ID_TBL_VIEW_PROV_CUST_NUM").setModel(oModelCustModel, "CustomerNumViewSet");

			//for material group
			var oModelMatGroup = new sap.ui.model.json.JSONModel({
				results: materialGrp
			});
			oModelMatGroup.setSizeLimit(materialGrp.permissionObjectDetailsDos.length);
			this.getView().byId("ID_TBL_VIEW_PROV_MAT_GRP_").setModel(oModelMatGroup, "MaterialGrpViewSet");

			//for material group one
			var oModelMatGroupOne = new sap.ui.model.json.JSONModel({
				results: materialGrpOne
			});
			oModelMatGroupOne.setSizeLimit(materialGrpOne.permissionObjectDetailsDos.length);
			this.getView().byId("ID_TBL_VIEW_PROV_MAT_GRP_ONE").setModel(oModelMatGroupOne, "MaterialGrpOneViewSet");

			//for material group 4
			var oModelMatGroup4 = new sap.ui.model.json.JSONModel({
				results: materialGrp4
			});
			oModelMatGroup4.setSizeLimit(materialGrp4.permissionObjectDetailsDos.length);
			this.getView().byId("ID_TBL_VIEW_PROV_MAT_GRP_4").setModel(oModelMatGroup4, "MaterialGrp4ViewSet");

			//for District
			var oModelDistrict = new sap.ui.model.json.JSONModel({
				results: district
			});
			oModelDistrict.setSizeLimit(district.permissionObjectDetailsDos.length);
			this.getView().byId("ID_TBL_VIEW_PROV_DISTRICT").setModel(oModelDistrict, "DistrictViewSet");
			//plant
			var oModelPlant = new sap.ui.model.json.JSONModel({
				results: plant
			});
			oModelPlant.setSizeLimit(plant.permissionObjectDetailsDos.length);
			this.getView().byId("ID_TBL_VIEW_PROV_PLANT").setModel(oModelPlant, "PlantViewSet");
			oModelDistrict.setSizeLimit(district.permissionObjectDetailsDos.length);

			this.getView().byId("ID_TBL_VIEW_PROV_DISTRICT").setModel(oModelDistrict, "DistrictViewSet");
			//storloc
			var oModelStorLoc = new sap.ui.model.json.JSONModel({
				results: storloc
			});
			oModelStorLoc.setSizeLimit(storloc.permissionObjectDetailsDos.length);
			this.getView().byId("ID_TBL_VIEW_PROV_STORLOC").setModel(oModelStorLoc, "StorLocViewSet");

			var oModelCountry = new sap.ui.model.json.JSONModel({
				results: country
			});
			oModelCountry.setSizeLimit(country.permissionObjectDetailsDos.length);
			this.getView().byId("ID_TBL_VIEW_PROV_COUNTRY").setModel(oModelCountry, "CountryViewSet");

			var oModelOrderType = new sap.ui.model.json.JSONModel({
				results: ordertype
			});
			oModelOrderType.setSizeLimit(ordertype.permissionObjectDetailsDos.length);
			this.getView().byId("ID_TBL_VIEW_PROV_ORDER").setModel(oModelOrderType, "OrderTypeViewSet");

			var oModelMatGrp2 = new sap.ui.model.json.JSONModel({
				results: materialGrp2
			});
			oModelMatGrp2.setSizeLimit(materialGrp2.permissionObjectDetailsDos.length);
			this.getView().byId("ID_TBL_VIEW_PROV_MAT_GRP_TWO").setModel(oModelMatGrp2, "MaterialGrpTwoViewSet");

			var oModelMatGrp3 = new sap.ui.model.json.JSONModel({
				results: materialGrp3
			});
			oModelMatGrp3.setSizeLimit(materialGrp3.permissionObjectDetailsDos.length);
			this.getView().byId("ID_TBL_VIEW_PROV_MAT_GRP_THREE").setModel(oModelMatGrp3, "MaterialGrpThreeViewSet");

			var oModelMatGrp5 = new sap.ui.model.json.JSONModel({
				results: materialGrp5
			});
			oModelMatGrp5.setSizeLimit(materialGrp5.permissionObjectDetailsDos.length);
			this.getView().byId("ID_TBL_VIEW_PROV_MAT_GRP_FIVE").setModel(oModelMatGrp5, "MaterialGrpFiveViewSet");

			var oModelProdHrch1 = new sap.ui.model.json.JSONModel({
				results: prodhierarchy1
			});
			oModelProdHrch1.setSizeLimit(prodhierarchy1.permissionObjectDetailsDos.length);
			this.getView().byId("ID_TBL_VIEW_PROV_PROD_HRCH_ONE").setModel(oModelProdHrch1, "ProdHierarchy1ViewSet");

			var oModelProdHrch2 = new sap.ui.model.json.JSONModel({
				results: prodhierarchy2
			});
			oModelProdHrch2.setSizeLimit(prodhierarchy2.permissionObjectDetailsDos.length);
			this.getView().byId("ID_TBL_VIEW_PROV_PROD_HRCH_TWO").setModel(oModelProdHrch2, "ProdHierarchy2ViewSet");

			var oModelProdHrch3 = new sap.ui.model.json.JSONModel({
				results: prodhierarchy3
			});
			oModelProdHrch3.setSizeLimit(prodhierarchy3.permissionObjectDetailsDos.length);
			this.getView().byId("ID_TBL_VIEW_PROV_PROD_HRCH_THREE").setModel(oModelProdHrch3, "ProdHierarchy3ViewSet");
			var oModelProdHrch4 = new sap.ui.model.json.JSONModel({
				results: prodhierarchy4
			});
			oModelProdHrch4.setSizeLimit(prodhierarchy4.permissionObjectDetailsDos.length);
			this.getView().byId("ID_TBL_VIEW_PROV_PROD_HRCH_FOUR").setModel(oModelProdHrch4, "ProdHierarchy4ViewSet");
			var oModelProdHrch5 = new sap.ui.model.json.JSONModel({
				results: prodhierarchy5
			});
			oModelProdHrch5.setSizeLimit(prodhierarchy5.permissionObjectDetailsDos.length);
			this.getView().byId("ID_TBL_VIEW_PROV_PROD_HRCH_FIVE").setModel(oModelProdHrch5, "ProdHierarchy5ViewSet");
			var oModelProdHrch6 = new sap.ui.model.json.JSONModel({
				results: prodhierarchy6
			});
			oModelProdHrch6.setSizeLimit(prodhierarchy6.permissionObjectDetailsDos.length);
			this.getView().byId("ID_TBL_VIEW_PROV_PROD_HRCH_SIX").setModel(oModelProdHrch6, "ProdHierarchy6ViewSet");

			var oModelProdHrch7 = new sap.ui.model.json.JSONModel({
				results: prodhierarchy7
			});
			oModelProdHrch7.setSizeLimit(prodhierarchy7.permissionObjectDetailsDos.length);
			this.getView().byId("ID_TBL_VIEW_PROV_PROD_HRCH_SEVEN").setModel(oModelProdHrch7, "ProdHierarchy7ViewSet");

			var oModelCusGrp1 = new sap.ui.model.json.JSONModel({
				results: cusgrp1
			});
			oModelCusGrp1.setSizeLimit(cusgrp1.permissionObjectDetailsDos.length);
			this.getView().byId("ID_TBL_VIEW_PROV_CUS_GRP_ONE").setModel(oModelCusGrp1, "CusGrp1ViewSet");

			var oModelCusGrp2 = new sap.ui.model.json.JSONModel({
				results: cusgrp2
			});
			oModelCusGrp2.setSizeLimit(cusgrp2.permissionObjectDetailsDos.length);
			this.getView().byId("ID_TBL_VIEW_PROV_CUS_GRP_TWO").setModel(oModelCusGrp2, "CusGrp2ViewSet");
			var oModelCusGrp3 = new sap.ui.model.json.JSONModel({
				results: cusgrp3
			});
			oModelCusGrp3.setSizeLimit(cusgrp3.permissionObjectDetailsDos.length);
			this.getView().byId("ID_TBL_VIEW_PROV_CUS_GRP_THREE").setModel(oModelCusGrp3, "CusGrp3ViewSet");
			var oModelCusGrp4 = new sap.ui.model.json.JSONModel({
				results: cusgrp4
			});
			oModelCusGrp4.setSizeLimit(cusgrp4.permissionObjectDetailsDos.length);
			this.getView().byId("ID_TBL_VIEW_PROV_CUS_GRP_FOUR").setModel(oModelCusGrp4, "CusGrp4ViewSet");

			var oModelCusGrp5 = new sap.ui.model.json.JSONModel({
				results: cusgrp5
			});
			oModelCusGrp5.setSizeLimit(cusgrp5.permissionObjectDetailsDos.length);
			this.getView().byId("ID_TBL_VIEW_PROV_CUS_GRP_FIVE").setModel(oModelCusGrp5, "CusGrp5ViewSet");

			var oModelCusGrp = new sap.ui.model.json.JSONModel({
				results: cusgrp
			});
			oModelCusGrp.setSizeLimit(cusgrp.permissionObjectDetailsDos.length);
			this.getView().byId("ID_TBL_VIEW_PROV_CUS_GRP").setModel(oModelCusGrp, "CusGrpViewSet");

			var oModelDistrict1 = new sap.ui.model.json.JSONModel({
				results: district1
			});
			oModelDistrict1.setSizeLimit(district1.permissionObjectDetailsDos.length);
			this.getView().byId("ID_TBL_VIEW_PROV_DIST1").setModel(oModelDistrict1, "District1ViewSet");

			var oModelMaterial = new sap.ui.model.json.JSONModel({
				results: material
			});

			oModelMaterial.setSizeLimit(material.permissionObjectDetailsDos.length);
			this.getView().byId("ID_TBL_VIEW_PROV_MAT").setModel(oModelMaterial, "MaterialViewSet");

			//for all selected true / false
			var omodelSwitch = new sap.ui.model.json.JSONModel({
				AllSwitch: all_Switch,
				SalesOrgSwitch: temp_SalesOrgSwitch,
				CustomerSwitch: temp_CustomerSwitch,
				MaterialNumSwitch: temp_MaterialNumSwitch,
				DistribuChanlSwitch: temp_DistribuChanlSwitch,
				MaterialGrpSwitch: temp_MaterialGrpSwitch,
				MaterialGrpOneSwitch: temp_MaterialGrpOneSwitch,
				MaterialGrp4Switch: temp_MaterialGrp4Switch,
				DistrictSwitch: temp_DistrictSwitch,
				PlantSwitch: temp_PlantSwitch,
				CountrySwitch: temp_CountrySwitch,
				StorageLocSwitch: temp_StorLocSwitch,
				OrderTypeSwitch: temp_OrderTypeSwitch,
				MatGrp2Switch: temp_MaterialGrp2Switch,
				MatGrp3Switch: temp_MaterialGrp3Switch,
				MatGrp5Switch: temp_MaterialGrp5Switch,
				ProdHierarchy1Switch: temp_ProdHierarchy1Switch,
				ProdHierarchy2Switch: temp_ProdHierarchy2Switch,
				ProdHierarchy3Switch: temp_ProdHierarchy3Switch,
				ProdHierarchy4Switch: temp_ProdHierarchy4Switch,
				ProdHierarchy5Switch: temp_ProdHierarchy5Switch,
				ProdHierarchy6Switch: temp_ProdHierarchy6Switch,
				ProdHierarchy7Switch: temp_ProdHierarchy7Switch,
				CustomerGrpSwitch: temp_CustomerGrpSwitch,
				CustomerGrp1Switch: temp_CustomerGrp1Switch,
				CustomerGrp2Switch: temp_CustomerGrp2Switch,
				CustomerGrp3Switch: temp_CustomerGrp3Switch,
				CustomerGrp4Switch: temp_CustomerGrp4Switch,
				CustomerGrp5Switch: temp_CustomerGrp5Switch,
				District1Switch: temp_District1Switch,
				MaterialSwitch: temp_MaterialSwitch
			});
			this.getView().setModel(omodelSwitch, "SwitchOnOffSet");
			var msg1 = this.i18nModel.getProperty("salesOrganizationCountLbl");
			this.getView().byId("ID_PROV_LBL_C_SALS_ORG").setText(msg1 + " (" + salesOrg.permissionObjectDetailsDos.length + ")");

			var msg2 = this.i18nModel.getProperty("customerLblCount");
			this.getView().byId("ID_PROV_LBL_C_CUST_NUM").setText(msg2 + " (" + custNum.permissionObjectDetailsDos.length + ")");

			var msg3 = this.i18nModel.getProperty("materialNumberCountLbl");
			this.getView().byId("ID_PROV_LBL_C_Mat_NUM").setText(msg3 + " (" + materialNum.length + ")");

			var msg4 = this.i18nModel.getProperty("distributionChannelCountLbl");
			this.getView().byId("ID_PROV_LBL_C_DISTRI_CHNL").setText(msg4 + " (" + distriChanne.permissionObjectDetailsDos.length + ")");

			var msg5 = this.i18nModel.getProperty("materialGroupCountLbl");
			this.getView().byId("ID_PROV_LBL_C_MAT_GRP").setText(msg5 + " (" + materialGrp.permissionObjectDetailsDos.length + ")");

			var msg6 = this.i18nModel.getProperty("materialGroupOneCountLbl");
			this.getView().byId("ID_PROV_LBL_C_MAT_GRP_ONE").setText(msg6 + " (" + materialGrpOne.permissionObjectDetailsDos.length + ")");

			var msg6 = this.i18nModel.getProperty("materialGroup4CountLbl");
			this.getView().byId("ID_PROV_LBL_C_MAT_GRP_4").setText(msg6 + " (" + materialGrp4.permissionObjectDetailsDos.length + ")");

			var msg7 = this.i18nModel.getProperty("distrcitCountLbl");
			this.getView().byId("ID_PROV_LBL_C_MAT_DISTRCT").setText(msg7 + " (" + district.permissionObjectDetailsDos.length + ")");
			var msg8 = this.i18nModel.getProperty("plantCountLbl");
			this.getView().byId("ID_PROV_LBL_C_MAT_PLANT").setText(msg8 + " (" + plant.permissionObjectDetailsDos.length + ")");

			var msg9 = this.i18nModel.getProperty("storLocCountLbl");
			this.getView().byId("ID_PROV_LBL_C_MAT_STORLOC").setText(msg9 + " (" + storloc.permissionObjectDetailsDos.length + ")");

			var msg10 = this.i18nModel.getProperty("countryCountLbl");
			this.getView().byId("ID_PROV_LBL_C_COUNTRY").setText(msg10 + " (" + country.permissionObjectDetailsDos.length + ")");

			var msg11 = this.i18nModel.getProperty("orderTypeCountLbl");
			this.getView().byId("ID_PROV_LBL_C_ORDER").setText(msg11 + " (" + ordertype.permissionObjectDetailsDos.length + ")");

			var msg12 = this.i18nModel.getProperty("MatGrp2CountLbl");
			this.getView().byId("ID_PROV_LBL_C_MAT_GRP_TWO").setText(msg12 + " (" + materialGrp2.permissionObjectDetailsDos.length + ")");

			var msg13 = this.i18nModel.getProperty("MatGrp3CountLbl");
			this.getView().byId("ID_PROV_LBL_C_MAT_GRP_THREE").setText(msg13 + " (" + materialGrp3.permissionObjectDetailsDos.length + ")");

			var msg14 = this.i18nModel.getProperty("MatGrp5CountLbl");
			this.getView().byId("ID_PROV_LBL_C_MAT_GRP_FIVE").setText(msg14 + " (" + materialGrp5.permissionObjectDetailsDos.length + ")");

			var msg15 = this.i18nModel.getProperty("ProdHrch1CountLbl");
			this.getView().byId("ID_PROV_LBL_C_PROD_HRCH_ONE").setText(msg15 + " (" + prodhierarchy1.permissionObjectDetailsDos.length + ")");

			var msg16 = this.i18nModel.getProperty("ProdHrch2CountLbl");
			this.getView().byId("ID_PROV_LBL_C_PROD_HRCH_TWO").setText(msg16 + " (" + prodhierarchy2.permissionObjectDetailsDos.length + ")");
			var msg17 = this.i18nModel.getProperty("ProdHrch3CountLbl");
			this.getView().byId("ID_PROV_LBL_C_PROD_HRCH_THREE").setText(msg17 + " (" + prodhierarchy3.permissionObjectDetailsDos.length + ")");
			var msg18 = this.i18nModel.getProperty("ProdHrch4CountLbl");
			this.getView().byId("ID_PROV_LBL_C_PROD_HRCH_FOUR").setText(msg18 + " (" + prodhierarchy4.permissionObjectDetailsDos.length + ")");
			var msg19 = this.i18nModel.getProperty("ProdHrch5CountLbl");
			this.getView().byId("ID_PROV_LBL_C_PROD_HRCH_FIVE").setText(msg19 + " (" + prodhierarchy5.permissionObjectDetailsDos.length + ")");
			var msg20 = this.i18nModel.getProperty("ProdHrch6CountLbl");
			this.getView().byId("ID_PROV_LBL_C_PROD_HRCH_SIX").setText(msg20 + " (" + prodhierarchy6.permissionObjectDetailsDos.length + ")");

			var msg21 = this.i18nModel.getProperty("ProdHrch7CountLbl");
			this.getView().byId("ID_PROV_LBL_C_PROD_HRCH_SEVEN").setText(msg21 + " (" + prodhierarchy7.permissionObjectDetailsDos.length + ")");

			var msg22 = this.i18nModel.getProperty("CusGrpCountLbl");
			this.getView().byId("ID_PROV_LBL_C_CUS_GRP").setText(msg22 + " (" + cusgrp.permissionObjectDetailsDos.length + ")");
			var msg23 = this.i18nModel.getProperty("CusGrp1CountLbl");
			this.getView().byId("ID_PROV_LBL_C_CUS_GRP_ONE").setText(msg23 + " (" + cusgrp1.permissionObjectDetailsDos.length + ")");
			var msg24 = this.i18nModel.getProperty("CusGrp2CountLbl");
			this.getView().byId("ID_PROV_LBL_C_CUS_GRP_TWO").setText(msg24 + " (" + cusgrp2.permissionObjectDetailsDos.length + ")");
			var msg25 = this.i18nModel.getProperty("CusGrp3CountLbl");
			this.getView().byId("ID_PROV_LBL_C_CUS_GRP_THREE").setText(msg25 + " (" + cusgrp3.permissionObjectDetailsDos.length + ")");
			var msg26 = this.i18nModel.getProperty("CusGrp4CountLbl");
			this.getView().byId("ID_PROV_LBL_C_CUS_GRP_FOUR").setText(msg26 + " (" + cusgrp4.permissionObjectDetailsDos.length + ")");
			var msg27 = this.i18nModel.getProperty("CusGrp5CountLbl");
			this.getView().byId("ID_PROV_LBL_C_CUS_GRP_FIVE").setText(msg27 + " (" + cusgrp5.permissionObjectDetailsDos.length + ")");
			var msg28 = this.i18nModel.getProperty("District1CountLbl");
			this.getView().byId("ID_PROV_LBL_C_DIST1").setText(msg28 + " (" + district1.permissionObjectDetailsDos.length + ")");
			var msg29 = this.i18nModel.getProperty("MaterialCountLbl");
			this.getView().byId("ID_PROV_LBL_C_MAT").setText(msg29 + " (" + material.permissionObjectDetailsDos.length + ")");
			visibleModel.refresh();
			busyDialog.close();
		},

		/*handleValueHelpPlant: function (oEvent) {
					var userName = sap.ui.getCore().getModel("userapi").getData().name;
					var oSelsOrgDet = this.getView().byId("ID_TBL_VIEW_PROV_PLANT").getModel("PlantViewSet");
					oSelsOrgDet.getData().results.push({
						"permissionDesc": "",
						"attributeId": "ATR09",
						"attributeDesc": "Plant",
						"attributeValue": "",
						"attributeValueDesc": "",
						"headerOrItem": "h",
						"inclusion": true,

						"text": "",
						"createdBy": userName
					});

					oSelsOrgDet.setSizeLimit(oSelsOrgDet.getData().results.length);
					oSelsOrgDet.refresh();
					  var  msg8 = this.i18nModel.getProperty("plantCountLbl");
		           this.getView().byId("ID_PROV_LBL_C_MAT_PLANT").setText(msg8 + " (" + oSelsOrgDet.getData().results.length + ")");

				},*/

		handleValueHelpPlant: function (oEvent) {
			var that = this;
			if (!that.PlantFrag) {
				that.PlantFrag = sap.ui.xmlfragment("com.incture.cherrywork.newdac.fragments.Plant", that);
				that.getView().addDependent(that.PlantFrag);
			}
			that.readPlant();
		},
		readPlant: function () {
			var that = this;
			var lang = "";
			if (sap.ushell) {
				lang = sap.ui.getCore().getConfiguration().getLanguage();
				lang = lang.toUpperCase();
				if (lang == "TH")
					lang = 2;
			} else {
				lang = "E";
			}

			//coment later
			//lang = "E";
			var busyDialog = new sap.m.BusyDialog();
			busyDialog.open();
			var url = encodeURI("/ZSearchHelp_PlantSet");

			if (!that.oModelSloc) {
				var oModel = new sap.ui.model.odata.ODataModel("/DKSHODataService/sap/opu/odata/sap/ZDKSH_CC_INVENTORY_HDRLOOKUP_SRV");
				oModel.read(url, {
					async: true,
					urlParameters: "$filter=language  eq '" + lang + "'",
					success: function (oData, oResponse) {
						that.oModelPlant = new sap.ui.model.json.JSONModel({
							results: oData.results
						});
						that.oModelPlant.setSizeLimit(oData.results.length);
						//	//sap.ui.getCore().byId("ID_TBL_PROV_SELS_ORG").setModel(that.oModelSelsOrganization, "SlaesOrgSet");
						that.PlantFrag.setModel(that.oModelPlant, "PlantSet");
						busyDialog.close();
						that.PlantFrag.open();
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
				that.PlantFrag.open();
			}
		},
		onConfirmChangePlant: function (oEvent) {
			var userName = sap.ui.getCore().getModel("userapi").getData().name;
			oEvent.getSource().getBinding("items").filter([]);

			var selectedContext = oEvent.getParameters().selectedContexts;
			var oSelsOrgDet = this.getView().byId("ID_TBL_VIEW_PROV_PLANT").getModel("PlantViewSet");
			//remove duplicate
			var duplicate = [];
			var countDup = 0;
			var nonDupArray = [];
			for (var i = 0; i < selectedContext.length; i++) {
				countDup = 0;
				for (var j = 0; j < oSelsOrgDet.getData().results.permissionObjectDetailsDos.length; j++) {

					if (selectedContext[i].getObject().plantName === oSelsOrgDet.getData().results.permissionObjectDetailsDos[j].attributeText) {
						duplicate.push(selectedContext[i].getObject().plantName);
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
				oSelsOrgDet.getData().results.permissionObjectDetailsDos.push({
					"permissionObjectGuid": this.perid,
					// "attributeDetailsGuid": "748199bd-b84a-4a63-8fa2-874b2935c510",
					// "attributeDetailsGuid": "666771cd-edf5-48f9-9214-b7851b59ab3b",
					"attributeDetailsGuid": this.getView().getModel("detModel").getData()[8].attributeDetailsGuid,
					"attributeValue": selectedObj.plant,
					"attributeText": selectedObj.plantName,
				});
			}
			oSelsOrgDet.setSizeLimit(oSelsOrgDet.getData().results.permissionObjectDetailsDos.length);
			oSelsOrgDet.refresh();
			var msg1 = this.i18nModel.getProperty("plantCountLbl");
			this.getView().byId("ID_PROV_LBL_C_MAT_PLANT").setText(msg1 + " (" + oSelsOrgDet.getData().results.permissionObjectDetailsDos.length +
				")");
			//this.salesOrgFrag.close();
		},
		//live search Country
		onLiveChangePlant: function (oEvent) {
			var value = oEvent.getParameters().value;
			var filters = new Array();
			var oFilter = new sap.ui.model.Filter([new sap.ui.model.Filter("plant", sap.ui.model.FilterOperator.Contains, value),
				new sap.ui.model.Filter("plantName", sap.ui.model.FilterOperator.Contains, value)
			]);
			filters.push(oFilter);
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter(filters);
		},

		/*handleValueHelpStorLoc: function (oEvent) {

			var userName = sap.ui.getCore().getModel("userapi").getData().name;
			var oSelsOrgDet = this.getView().byId("ID_TBL_VIEW_PROV_STORLOC").getModel("StorLocViewSet");
			oSelsOrgDet.getData().results.push({
				"permissionDesc": "",
				"attributeId": "ATR10",
				"attributeDesc": "Storage Location",
				"attributeValue": "",
				"attributeValueDesc": "",
				"headerOrItem": "h",
				"inclusion": true,

				"text": "",
				"createdBy": userName
			});

			oSelsOrgDet.setSizeLimit(oSelsOrgDet.getData().results.length);
			oSelsOrgDet.refresh();
			var msg9 = this.i18nModel.getProperty("storLocCountLbl");
			this.getView().byId("ID_PROV_LBL_C_MAT_STORLOC").setText(msg9 + " (" + oSelsOrgDet.getData().results.length + ")");

		},*/
		handleValueHelpStorLoc: function (oEvent) {
			var that = this;
			if (!that.SLocFrag) {
				that.SLocFrag = sap.ui.xmlfragment("com.incture.cherrywork.newdac.fragments.StorLoc", that);
				that.getView().addDependent(that.SLocFrag);
			}
			that.readSLoc();
		},
		readSLoc: function () {
			var that = this;
			var lang = "";
			if (sap.ushell) {
				lang = sap.ui.getCore().getConfiguration().getLanguage();
				lang = lang.toUpperCase();
				if (lang == "TH")
					lang = 2;
			} else {
				lang = "E";
			}

			//coment later
			//lang = "E";
			var busyDialog = new sap.m.BusyDialog();
			busyDialog.open();
			var url = encodeURI("/ZSearchHelp_SlocSet");

			if (!that.oModelSloc) {
				var oModel = new sap.ui.model.odata.ODataModel("/DKSHODataService/sap/opu/odata/sap/ZDKSH_CC_INVENTORY_HDRLOOKUP_SRV");
				oModel.read(url, {
					async: true,
					urlParameters: "$filter=language  eq '" + lang + "'",
					success: function (oData, oResponse) {
						that.oModelSloc = new sap.ui.model.json.JSONModel({
							results: oData.results
						});
						that.oModelSloc.setSizeLimit(oData.results.length);
						//	//sap.ui.getCore().byId("ID_TBL_PROV_SELS_ORG").setModel(that.oModelSelsOrganization, "SlaesOrgSet");
						that.SLocFrag.setModel(that.oModelSloc, "SlocSet");
						busyDialog.close();
						that.SLocFrag.open();
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
				that.SLocFrag.open();
			}
		},
		onConfirmChangeSLoc: function (oEvent) {
			var userName = sap.ui.getCore().getModel("userapi").getData().name;
			oEvent.getSource().getBinding("items").filter([]);

			var selectedContext = oEvent.getParameters().selectedContexts;
			var oSelsOrgDet = this.getView().byId("ID_TBL_VIEW_PROV_STORLOC").getModel("StorLocViewSet");
			//remove duplicate
			var duplicate = [];
			var countDup = 0;
			var nonDupArray = [];
			for (var i = 0; i < selectedContext.length; i++) {
				countDup = 0;
				for (var j = 0; j < oSelsOrgDet.getData().results.permissionObjectDetailsDos.length; j++) {

					if (selectedContext[i].getObject().storagelocationDesc === oSelsOrgDet.getData().results.permissionObjectDetailsDos[j].attributeText) {
						duplicate.push(selectedContext[i].getObject().storagelocationDesc);
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
				oSelsOrgDet.getData().results.permissionObjectDetailsDos.push({
					"permissionObjectGuid": this.perid,
					// "attributeDetailsGuid": "9fe7dbb1-7375-4835-804d-0174c098117f",
					// "attributeDetailsGuid": "9e26dae3-4dc4-4ed3-83e0-94312c3b5ec9",
					"attributeDetailsGuid": this.getView().getModel("detModel").getData()[9].attributeDetailsGuid,
					"attributeValue": selectedObj.storageLocation,
					"attributeText": selectedObj.storagelocationDesc,
				});
			}
			oSelsOrgDet.setSizeLimit(oSelsOrgDet.getData().results.permissionObjectDetailsDos.length);
			oSelsOrgDet.refresh();
			var msg1 = this.i18nModel.getProperty("storLocCountLbl");
			this.getView().byId("ID_PROV_LBL_C_MAT_STORLOC").setText(msg1 + " (" + oSelsOrgDet.getData().results.permissionObjectDetailsDos.length +
				")");
			//this.salesOrgFrag.close();
		},
		//live search Country
		onLiveChangeStorLoc: function (oEvent) {
			var value = oEvent.getParameters().value;
			var filters = new Array();
			var oFilter = new sap.ui.model.Filter([new sap.ui.model.Filter("storageLocation", sap.ui.model.FilterOperator.Contains, value),
				new sap.ui.model.Filter("storagelocationDesc", sap.ui.model.FilterOperator.Contains, value)
			]);
			filters.push(oFilter);
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter(filters);
		},
		handleValueHelpCountry: function (oEvent) {
			var userName = sap.ui.getCore().getModel("userapi").getData().name;
			var oSelsOrgDet = this.getView().byId("ID_TBL_VIEW_PROV_COUNTRY").getModel("CountryViewSet");
			oSelsOrgDet.getData().results.permissionObjectDetailsDos.push({
				"permissionObjectGuid": this.perid,
				// "attributeDetailsGuid": "20fecf50-7ee4-4fd2-824b-a1335261ffe1",
				// "attributeDetailsGuid": "1b893006-7a8b-4797-8d93-91ff7164065d",
				"attributeDetailsGuid": this.getView().getModel("detModel").getData()[28].attributeDetailsGuid,
				"attributeValue": "",
				"attributeText": ""
			});

			oSelsOrgDet.setSizeLimit(oSelsOrgDet.getData().results.permissionObjectDetailsDos.length);
			oSelsOrgDet.refresh();
			var msg10 = this.i18nModel.getProperty("countryCountLbl");
			this.getView().byId("ID_PROV_LBL_C_COUNTRY").setText(msg10 + " (" + oSelsOrgDet.getData().results.permissionObjectDetailsDos.length +
				")");

		},
		onLiveChangeCountry: function (oEvent) {
			var value = oEvent.getParameters().value;
			var filters = new Array();
			var oFilter = new sap.ui.model.Filter([new sap.ui.model.Filter("countryCode", sap.ui.model.FilterOperator.Contains, value),
				new sap.ui.model.Filter("countryName", sap.ui.model.FilterOperator.Contains, value)
			]);
			filters.push(oFilter);
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter(filters);
		},
		handleValueHelpOrderType: function (oEvent) {

			var userName = sap.ui.getCore().getModel("userapi").getData().name;
			var oSelsOrgDet = this.getView().byId("ID_TBL_VIEW_PROV_ORDER").getModel("OrderTypeViewSet");
			oSelsOrgDet.getData().results.permissionObjectDetailsDos.push({
				"permissionDesc": "",
				"attributeId": "ATR08",
				"attributeDesc": "Order Type",
				"attributeValue": "",
				"attributeText": "",
				"headerOrItem": "h",
				"inclusion": true,

				"text": "",
				"createdBy": userName
			});

			oSelsOrgDet.setSizeLimit(oSelsOrgDet.getData().results.permissionObjectDetailsDos.length);
			oSelsOrgDet.refresh();
			var msg11 = this.i18nModel.getProperty("orderTypeCountLbl");
			this.getView().byId("ID_PROV_LBL_C_ORDER").setText(msg11 + " (" + oSelsOrgDet.getData().results.permissionObjectDetailsDos.length +
				")");

		},
		handleValueHelpMaterialGroupTwo: function (oEvent) {

			var userName = sap.ui.getCore().getModel("userapi").getData().name;
			var oSelsOrgDet = this.getView().byId("ID_TBL_VIEW_PROV_MAT_GRP_TWO").getModel("MaterialGrpTwoViewSet");
			oSelsOrgDet.getData().results.permissionObjectDetailsDos.push({
				"permissionObjectGuid": this.perid,
				// "attributeDetailsGuid": "d07fd2b4-7a05-42da-b80c-cf5cd7072d73",
				// "attributeDetailsGuid": "00361c67-4176-4ef1-b971-0f4d523e1bdf",
				"attributeDetailsGuid": this.getView().getModel("detModel").getData()[11].attributeDetailsGuid,
				"attributeValue": "",
				"attributeText": "",
			});

			oSelsOrgDet.setSizeLimit(oSelsOrgDet.getData().results.permissionObjectDetailsDos.length);
			oSelsOrgDet.refresh();
			var msg12 = this.i18nModel.getProperty("MatGrp2CountLbl");
			this.getView().byId("ID_PROV_LBL_C_MAT_GRP_TWO").setText(msg12 + " (" + oSelsOrgDet.getData().results.permissionObjectDetailsDos.length +
				")");

		},
		handleValueHelpMaterialGroupThree: function (oEvent) {

			var userName = sap.ui.getCore().getModel("userapi").getData().name;
			var oSelsOrgDet = this.getView().byId("ID_TBL_VIEW_PROV_MAT_GRP_THREE").getModel("MaterialGrpThreeViewSet");
			oSelsOrgDet.getData().results.permissionObjectDetailsDos.push({
				"permissionObjectGuid": this.perid,
				// "attributeDetailsGuid": "6bcaa32d-43cd-4bf0-aa78-e2398fa15987",
				// "attributeDetailsGuid": "32663f15-0cdc-41ca-aadf-f309426a1c2d",
				"attributeDetailsGuid": this.getView().getModel("detModel").getData()[12].attributeDetailsGuid,
				"attributeValue": "",
				"attributeText": ""
			});

			oSelsOrgDet.setSizeLimit(oSelsOrgDet.getData().results.permissionObjectDetailsDos.length);
			oSelsOrgDet.refresh();
			var msg13 = this.i18nModel.getProperty("MatGrp3CountLbl");
			this.getView().byId("ID_PROV_LBL_C_MAT_GRP_THREE").setText(msg13 + " (" + oSelsOrgDet.getData().results.permissionObjectDetailsDos.length +
				")");
		},

		handleValueHelpMaterialGroupFive: function (oEvent) {

			var userName = sap.ui.getCore().getModel("userapi").getData().name;
			var oSelsOrgDet = this.getView().byId("ID_TBL_VIEW_PROV_MAT_GRP_FIVE").getModel("MaterialGrpFiveViewSet");
			oSelsOrgDet.getData().results.permissionObjectDetailsDos.push({
				"permissionObjectGuid": this.perid,
				// "attributeDetailsGuid": "825e85ff-2221-4dca-a41f-37ee8bf138e4",
				// "attributeDetailsGuid": "33c2d687-181d-400d-934e-89a94009e20c",
				"attributeDetailsGuid": this.getView().getModel("detModel").getData()[13].attributeDetailsGuid,
				"attributeValue": "",
				"attributeText": "",
			});

			oSelsOrgDet.setSizeLimit(oSelsOrgDet.getData().results.permissionObjectDetailsDos.length);
			oSelsOrgDet.refresh();
			var msg14 = this.i18nModel.getProperty("MatGrp5CountLbl");
			this.getView().byId("ID_PROV_LBL_C_MAT_GRP_FIVE").setText(msg14 + " (" + oSelsOrgDet.getData().results.permissionObjectDetailsDos.length +
				")");

		},

		handleValueHelpProdHierarchyOne: function (oEvent) {

			var userName = sap.ui.getCore().getModel("userapi").getData().name;
			var oSelsOrgDet = this.getView().byId("ID_TBL_VIEW_PROV_PROD_HRCH_ONE").getModel("ProdHierarchy1ViewSet");
			oSelsOrgDet.getData().results.permissionObjectDetailsDos.push({
				"permissionObjectGuid": this.perid,
				// "attributeDetailsGuid": "825e85ff-2221-4dca-a41f-37ee8bf138e4",
				// "attributeDetailsGuid": "33c2d687-181d-400d-934e-89a94009e20c",
				"attributeDetailsGuid": this.getView().getModel("detModel").getData()[14].attributeDetailsGuid,
				"attributeValue": "",
				"attributeText": ""
			});

			oSelsOrgDet.setSizeLimit(oSelsOrgDet.getData().results.permissionObjectDetailsDos.length);
			oSelsOrgDet.refresh();
			var msg15 = this.i18nModel.getProperty("ProdHrch1CountLbl");
			this.getView().byId("ID_PROV_LBL_C_PROD_HRCH_ONE").setText(msg15 + " (" + oSelsOrgDet.getData().results.permissionObjectDetailsDos.length +
				")");
		},
		handleValueHelpProdHierarchyTwo: function (oEvent) {

			var userName = sap.ui.getCore().getModel("userapi").getData().name;
			var oSelsOrgDet = this.getView().byId("ID_TBL_VIEW_PROV_PROD_HRCH_TWO").getModel("ProdHierarchy2ViewSet");
			oSelsOrgDet.getData().results.permissionObjectDetailsDos.push({
				"permissionObjectGuid": this.perid,
				// "attributeDetailsGuid": "d2020c36-9be1-427d-8844-32f86fda59cd",
				// "attributeDetailsGuid": "aac021f3-edb1-4ab2-bcaa-884454377fbb",
				"attributeDetailsGuid": this.getView().getModel("detModel").getData()[15].attributeDetailsGuid,
				"attributeValue": "",
				"attributeText": ""
			});

			oSelsOrgDet.setSizeLimit(oSelsOrgDet.getData().results.permissionObjectDetailsDos.length);
			oSelsOrgDet.refresh();
			var msg16 = this.i18nModel.getProperty("ProdHrch2CountLbl");
			this.getView().byId("ID_PROV_LBL_C_PROD_HRCH_TWO").setText(msg16 + " (" + oSelsOrgDet.getData().results.permissionObjectDetailsDos.length +
				")");

		},
		handleValueHelpProdHierarchyThree: function (oEvent) {

			var userName = sap.ui.getCore().getModel("userapi").getData().name;
			var oSelsOrgDet = this.getView().byId("ID_TBL_VIEW_PROV_PROD_HRCH_THREE").getModel("ProdHierarchy3ViewSet");
			oSelsOrgDet.getData().results.permissionObjectDetailsDos.push({
				"permissionObjectGuid": this.perid,
				// "attributeDetailsGuid": "9fd58ee5-5bdc-45be-b21c-8305bc0df5ce",
				"attributeDetailsGuid": "f04befae-10cd-48a6-82de-c6effef652df",
				"attributeDetailsGuid": this.getView().getModel("detModel").getData()[16].attributeDetailsGuid,
				"attributeValue": "",
				"attributeText": ""
			});

			oSelsOrgDet.setSizeLimit(oSelsOrgDet.getData().results.permissionObjectDetailsDos.length);
			oSelsOrgDet.refresh();
			var msg17 = this.i18nModel.getProperty("ProdHrch3CountLbl");
			this.getView().byId("ID_PROV_LBL_C_PROD_HRCH_THREE").setText(msg17 + " (" + oSelsOrgDet.getData().results.permissionObjectDetailsDos
				.length + ")");

		},
		handleValueHelpProdHierarchyFour: function (oEvent) {

			var userName = sap.ui.getCore().getModel("userapi").getData().name;
			var oSelsOrgDet = this.getView().byId("ID_TBL_VIEW_PROV_PROD_HRCH_FOUR").getModel("ProdHierarchy4ViewSet");
			oSelsOrgDet.getData().results.permissionObjectDetailsDos.push({
				"permissionObjectGuid": this.perid,
				// "attributeDetailsGuid": "0c8b2093-1841-4ed9-8b38-d5e0d7699ce0",
				// "attributeDetailsGuid": "4a2341a2-791c-434b-9b5f-3bc460cb8387",
				"attributeDetailsGuid": this.getView().getModel("detModel").getData()[17].attributeDetailsGuid,
				"attributeValue": "",
				"attributeText": "",
			});

			oSelsOrgDet.setSizeLimit(oSelsOrgDet.getData().results.permissionObjectDetailsDos.length);
			oSelsOrgDet.refresh();
			var msg18 = this.i18nModel.getProperty("ProdHrch4CountLbl");
			this.getView().byId("ID_PROV_LBL_C_PROD_HRCH_FOUR").setText(msg18 + " (" + oSelsOrgDet.getData().results.permissionObjectDetailsDos
				.length + ")");

		},
		handleValueHelpProdHierarchyFive: function (oEvent) {

			var userName = sap.ui.getCore().getModel("userapi").getData().name;
			var oSelsOrgDet = this.getView().byId("ID_TBL_VIEW_PROV_PROD_HRCH_FIVE").getModel("ProdHierarchy5ViewSet");
			oSelsOrgDet.getData().results.permissionObjectDetailsDos.push({
				"permissionObjectGuid": this.perid,
				// "attributeDetailsGuid": "88b446c9-481d-432a-8b2d-1dc5f6b546aa",
				// "attributeDetailsGuid": "c0dcba57-6e89-4f06-a012-5ff991e35854",
				"attributeDetailsGuid": this.getView().getModel("detModel").getData()[18].attributeDetailsGuid,
				"attributeValue": "",
				"attributeText": ""
			});

			oSelsOrgDet.setSizeLimit(oSelsOrgDet.getData().results.permissionObjectDetailsDos.length);
			oSelsOrgDet.refresh();
			var msg19 = this.i18nModel.getProperty("ProdHrch5CountLbl");
			this.getView().byId("ID_PROV_LBL_C_PROD_HRCH_FIVE").setText(msg19 + " (" + oSelsOrgDet.getData().results.permissionObjectDetailsDos
				.length + ")");

		},
		handleValueHelpProdHierarchySix: function (oEvent) {

			var userName = sap.ui.getCore().getModel("userapi").getData().name;
			var oSelsOrgDet = this.getView().byId("ID_TBL_VIEW_PROV_PROD_HRCH_SIX").getModel("ProdHierarchy6ViewSet");
			oSelsOrgDet.getData().results.permissionObjectDetailsDos.push({
				"permissionObjectGuid": this.perid,
				// "attributeDetailsGuid": "b033d5d5-e072-47f4-86a4-00d040b8719c",
				// "attributeDetailsGuid": "c8b278f2-d085-49b3-bd55-e703a9907520",
				"attributeDetailsGuid": this.getView().getModel("detModel").getData()[19].attributeDetailsGuid,
				"attributeValue": "",
				"attributeText": ""
			});

			oSelsOrgDet.setSizeLimit(oSelsOrgDet.getData().results.permissionObjectDetailsDos.length);
			oSelsOrgDet.refresh();
			var msg20 = this.i18nModel.getProperty("ProdHrch6CountLbl");
			this.getView().byId("ID_PROV_LBL_C_PROD_HRCH_SIX").setText(msg20 + " (" + oSelsOrgDet.getData().results.permissionObjectDetailsDos.length +
				")");

		},
		handleValueHelpProdHierarchySeven: function (oEvent) {

			var userName = sap.ui.getCore().getModel("userapi").getData().name;
			var oSelsOrgDet = this.getView().byId("ID_TBL_VIEW_PROV_PROD_HRCH_SEVEN").getModel("ProdHierarchy7ViewSet");
			oSelsOrgDet.getData().results.permissionObjectDetailsDos.push({
				"permissionObjectGuid": this.perid,
				// "attributeDetailsGuid": "f68c5793-3c8e-48f0-83c4-3991474d373b",
				// "attributeDetailsGuid": "7981c4f7-0fdb-48ff-ac99-989b46fe6d5c",
				"attributeDetailsGuid": this.getView().getModel("detModel").getData()[20].attributeDetailsGuid,
				"attributeValue": "",
				"attributeText": ""
			});

			oSelsOrgDet.setSizeLimit(oSelsOrgDet.getData().results.permissionObjectDetailsDos.length);
			oSelsOrgDet.refresh();
			var msg21 = this.i18nModel.getProperty("ProdHrch7CountLbl");
			this.getView().byId("ID_PROV_LBL_C_PROD_HRCH_SEVEN").setText(msg21 + " (" + oSelsOrgDet.getData().results.permissionObjectDetailsDos
				.length + ")");
		},
		handleValueHelpCusGrp1: function (oEvent) {

			var userName = sap.ui.getCore().getModel("userapi").getData().name;
			var oSelsOrgDet = this.getView().byId("ID_TBL_VIEW_PROV_CUS_GRP_ONE").getModel("CusGrp1ViewSet");
			oSelsOrgDet.getData().results.permissionObjectDetailsDos.push({
				"permissionObjectGuid": this.perid,
				// "attributeDetailsGuid": "1d0d7096-f4da-4080-a946-dcb0fed8e55b",
				// "attributeDetailsGuid": "1d984648-42f6-41b2-a9c2-ddb72b6f8e60",
				"attributeDetailsGuid": this.getView().getModel("detModel").getData()[22].attributeDetailsGuid,
				"attributeValue": "",
				"attributeText": ""
			});

			oSelsOrgDet.setSizeLimit(oSelsOrgDet.getData().results.permissionObjectDetailsDos.length);
			oSelsOrgDet.refresh();
			var msg22 = this.i18nModel.getProperty("CusGrp1CountLbl");
			this.getView().byId("ID_PROV_LBL_C_CUS_GRP_ONE").setText(msg22 + " (" + oSelsOrgDet.getData().results.permissionObjectDetailsDos.length +
				")");

		},
		handleValueHelpCusGrp2: function (oEvent) {

			var userName = sap.ui.getCore().getModel("userapi").getData().name;
			var oSelsOrgDet = this.getView().byId("ID_TBL_VIEW_PROV_CUS_GRP_TWO").getModel("CusGrp2ViewSet");
			oSelsOrgDet.getData().results.permissionObjectDetailsDos.push({
				"permissionObjectGuid": this.perid,
				// "attributeDetailsGuid": "51612f4d-85e1-4f57-9665-ba76bb6fbddd",
				// "attributeDetailsGuid": "7f61ca91-4e1c-4fdc-8d3d-ea0238bc9c82",
				"attributeDetailsGuid": this.getView().getModel("detModel").getData()[23].attributeDetailsGuid,
				"attributeValue": "",
				"attributeText": ""
			});

			oSelsOrgDet.setSizeLimit(oSelsOrgDet.getData().results.permissionObjectDetailsDos.length);
			oSelsOrgDet.refresh();
			var msg23 = this.i18nModel.getProperty("CusGrp2CountLbl");
			this.getView().byId("ID_PROV_LBL_C_CUS_GRP_TWO").setText(msg23 + " (" + oSelsOrgDet.getData().results.permissionObjectDetailsDos.length +
				")");

		},
		handleValueHelpCusGrp3: function (oEvent) {

			var userName = sap.ui.getCore().getModel("userapi").getData().name;
			var oSelsOrgDet = this.getView().byId("ID_TBL_VIEW_PROV_CUS_GRP_THREE").getModel("CusGrp3ViewSet");
			oSelsOrgDet.getData().results.permissionObjectDetailsDos.push({
				"permissionObjectGuid": this.perid,
				// "attributeDetailsGuid": "72d8d8ab-99bc-4412-83d9-4c11705b7418",
				// "attributeDetailsGuid": "ebf2c5bc-3fe0-4099-b6bd-fc810f404726",
				"attributeDetailsGuid": this.getView().getModel("detModel").getData()[24].attributeDetailsGuid,
				"attributeValue": "",
				"attributeText": ""
			});

			oSelsOrgDet.setSizeLimit(oSelsOrgDet.getData().results.permissionObjectDetailsDos.length);
			oSelsOrgDet.refresh();
			var msg24 = this.i18nModel.getProperty("CusGrp3CountLbl");
			this.getView().byId("ID_PROV_LBL_C_CUS_GRP_THREE").setText(msg24 + " (" + oSelsOrgDet.getData().results.permissionObjectDetailsDos.length +
				")");

		},
		handleValueHelpCusGrp4: function (oEvent) {

			var userName = sap.ui.getCore().getModel("userapi").getData().name;
			var oSelsOrgDet = this.getView().byId("ID_TBL_VIEW_PROV_CUS_GRP_FOUR").getModel("CusGrp4ViewSet");
			oSelsOrgDet.getData().results.permissionObjectDetailsDos.push({
				"permissionObjectGuid": this.perid,
				// "attributeDetailsGuid": "6112900f-9a00-4238-87f7-60fdd0ccc1ec",
				// "attributeDetailsGuid": "a7aedf3d-e7c0-4f6a-bbf9-78894b128fce",
				"attributeDetailsGuid": this.getView().getModel("detModel").getData()[25].attributeDetailsGuid,
				"attributeValue": "",
				"attributeText": ""
			});

			oSelsOrgDet.setSizeLimit(oSelsOrgDet.getData().results.permissionObjectDetailsDos.length);
			oSelsOrgDet.refresh();
			var msg25 = this.i18nModel.getProperty("CusGrp4CountLbl");
			this.getView().byId("ID_PROV_LBL_C_CUS_GRP_FOUR").setText(msg25 + " (" + oSelsOrgDet.getData().results.permissionObjectDetailsDos.length +
				")");
		},
		handleValueHelpCusGrp5: function (oEvent) {

			var userName = sap.ui.getCore().getModel("userapi").getData().name;
			var oSelsOrgDet = this.getView().byId("ID_TBL_VIEW_PROV_CUS_GRP_FIVE").getModel("CusGrp5ViewSet");
			oSelsOrgDet.getData().results.permissionObjectDetailsDos.push({
				"permissionObjectGuid": this.perid,
				// "attributeDetailsGuid": "b85baf37-7eca-47f6-8c83-7ca808660f68",
				// "attributeDetailsGuid": "b429de78-5203-4b7e-ae75-077da35712b5",
				"attributeDetailsGuid": this.getView().getModel("detModel").getData()[26].attributeDetailsGuid,
				"attributeValue": "",
				"attributeText": ""
			});

			oSelsOrgDet.setSizeLimit(oSelsOrgDet.getData().results.permissionObjectDetailsDos.length);
			oSelsOrgDet.refresh();
			var msg26 = this.i18nModel.getProperty("CusGrp5CountLbl");
			this.getView().byId("ID_PROV_LBL_C_CUS_GRP_FIVE").setText(msg26 + " (" + oSelsOrgDet.getData().results.permissionObjectDetailsDos.length +
				")");

		},
		handleValueHelpCusGrp: function (oEvent) {

			var userName = sap.ui.getCore().getModel("userapi").getData().name;
			var oSelsOrgDet = this.getView().byId("ID_TBL_VIEW_PROV_CUS_GRP").getModel("CusGrpViewSet");
			oSelsOrgDet.getData().results.permissionObjectDetailsDos.push({
				"permissionObjectGuid": this.perid,
				// "attributeDetailsGuid": "b6e26e5e-f670-488a-85bf-173a0c2fec82",
				// "attributeDetailsGuid": "391baef4-fc5b-4e9a-908f-d75d0003c11d",
				"attributeDetailsGuid": this.getView().getModel("detModel").getData()[21].attributeDetailsGuid,
				"attributeValue": "",
				"attributeText": ""
			});

			oSelsOrgDet.setSizeLimit(oSelsOrgDet.getData().results.permissionObjectDetailsDos.length);
			oSelsOrgDet.refresh();
			var msg27 = this.i18nModel.getProperty("CusGrpCountLbl");
			this.getView().byId("ID_PROV_LBL_C_CUS_GRP").setText(msg27 + " (" + oSelsOrgDet.getData().results.permissionObjectDetailsDos.length +
				")");

		},
		handleValueHelpMaterial: function (oEvent) {

			var userName = sap.ui.getCore().getModel("userapi").getData().name;
			var oSelsOrgDet = this.getView().byId("ID_TBL_VIEW_PROV_MAT").getModel("MaterialViewSet");
			oSelsOrgDet.getData().results.permissionObjectDetailsDos.push({
				"permissionObjectGuid": this.perid,
				// "attributeDetailsGuid": "cb203a9e-1a62-465f-92c6-0f8b214cc580",
				// "attributeDetailsGuid": "1199db72-bce4-46dd-b017-14d572aaba97",
				"attributeDetailsGuid": this.getView().getModel("detModel").getData()[6].attributeDetailsGuid,
				"attributeValue": "",
				"attributeText": ""
					// "permissionDesc": "",
					// "attributeId": "ATR07",
					// "attributeDesc": "Material",
					// "attributeValue": "",
					// "attributeText": "",
					// "headerOrItem": "h",
					// "inclusion": true,
					// "text": "",
					// "createdBy": userName
			});

			oSelsOrgDet.setSizeLimit(oSelsOrgDet.getData().results.permissionObjectDetailsDos.length);
			oSelsOrgDet.refresh();
			var msg28 = this.i18nModel.getProperty("MaterialCountLbl");
			this.getView().byId("ID_PROV_LBL_C_MAT").setText(msg28 + " (" + oSelsOrgDet.getData().results.permissionObjectDetailsDos.length +
				")");

		},
		handleValueHelpDistrict1: function (oEvent) {

			var userName = sap.ui.getCore().getModel("userapi").getData().name;
			var oSelsOrgDet = this.getView().byId("ID_TBL_VIEW_PROV_DIST1").getModel("District1ViewSet");
			oSelsOrgDet.getData().results.permissionObjectDetailsDos.push({
				"permissionDesc": "",
				"attributeId": "ATR28",
				"attributeDesc": "District",
				"attributeValue": "",
				"attributeText": "",
				"headerOrItem": "h",
				"inclusion": true,
				"text": "",
				"createdBy": userName
			});

			oSelsOrgDet.setSizeLimit(oSelsOrgDet.getData().results.permissionObjectDetailsDos.length);
			oSelsOrgDet.refresh();
			var msg29 = this.i18nModel.getProperty("District1CountLbl");
			this.getView().byId("ID_PROV_LBL_C_DIST1").setText(msg29 + " (" + oSelsOrgDet.getData().results.permissionObjectDetailsDos.length +
				")");

		},
		//function to fetch the country list

		handleValueHelpCt: function (oEvent) {
			var that = this;
			if (!that.CtFrag) {
				that.CtFrag = sap.ui.xmlfragment("com.incture.cherrywork.newdac.fragments.Country", that);
				that.getView().addDependent(that.CtFrag);
			}
			that.readCt();
		},
		readCt: function () {
			var that = this;
			var lang = "";
			if (sap.ushell) {
				lang = sap.ui.getCore().getConfiguration().getLanguage();
				lang = lang.toUpperCase();
				if (lang == "TH")
					lang = 2;
			} else {
				lang = "D";
			}

			//coment later
			//lang = "E";
			var busyDialog = new sap.m.BusyDialog();
			busyDialog.open();
			var url = encodeURI("/countryLookupSet");

			if (!that.oModelCt) {
				var oModel = new sap.ui.model.odata.ODataModel("/DKSHDACODataService/sap/opu/odata/sap/ZDKSH_CC_DAC_LOOKUP_SRV");
				oModel.read(url, {
					async: true,
					urlParameters: "$filter=languageKey  eq '" + lang + "'",
					success: function (oData, oResponse) {
						that.oModelCt = new sap.ui.model.json.JSONModel({
							results: oData.results
						});
						that.oModelCt.setSizeLimit(oData.results.length);
						//	//sap.ui.getCore().byId("ID_TBL_PROV_SELS_ORG").setModel(that.oModelSelsOrganization, "SlaesOrgSet");
						that.CtFrag.setModel(that.oModelCt, "CtSet");
						busyDialog.close();
						that.CtFrag.open();
					},
					error: function (error) {
						busyDialog.close();
						sap.m.MessageBox.error("Error in retrieving values");
						var errorMsg = JSON.parse(error.responseText);
						errorMsg = errorMsg.error.message.value;
						that.errorMsg(errorMsg);
					}
				});
			} else {
				busyDialog.close();
				that.CtFrag.open();
			}
		},
		onConfirmChangeCt: function (oEvent) {
			var userName = sap.ui.getCore().getModel("userapi").getData().name;
			oEvent.getSource().getBinding("items").filter([]);

			var selectedContext = oEvent.getParameters().selectedContexts;
			var oSelsOrgDet = this.getView().byId("ID_TBL_VIEW_PROV_COUNTRY").getModel("CountryViewSet");
			//remove duplicate
			var duplicate = [];
			var countDup = 0;
			var nonDupArray = [];
			for (var i = 0; i < selectedContext.length; i++) {
				countDup = 0;
				for (var j = 0; j < oSelsOrgDet.getData().results.permissionObjectDetailsDos.length; j++) {

					if (selectedContext[i].getObject().countryName === oSelsOrgDet.getData().results.permissionObjectDetailsDos[j].attributeText) {
						duplicate.push(selectedContext[i].getObject().countryName);
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
				oSelsOrgDet.getData().results.permissionObjectDetailsDos.push({
					"permissionObjectGuid": this.perid,
					// "attributeDetailsGuid": "20fecf50-7ee4-4fd2-824b-a1335261ffe1",
					// "attributeDetailsGuid": "1b893006-7a8b-4797-8d93-91ff7164065d",
					"attributeDetailsGuid": this.getView().getModel("detModel").getData()[28].attributeDetailsGuid,
					"attributeValue": selectedObj.countryCode,
					"attributeText": selectedObj.countryName
				});
			}
			oSelsOrgDet.setSizeLimit(oSelsOrgDet.getData().results.permissionObjectDetailsDos.length);
			oSelsOrgDet.refresh();
			var msg10 = this.i18nModel.getProperty("countryCountLbl");
			this.getView().byId("ID_PROV_LBL_C_COUNTRY").setText(msg10 + " (" + oSelsOrgDet.getData().results.permissionObjectDetailsDos.length +
				")");
			//this.salesOrgFrag.close();
		},
		//live search Country
		// onLiveChangeCountry: function (oEvent) {
		// 	var value = oEvent.getParameters().value;
		// 	var filters = new Array();
		// 	var oFilter = new sap.ui.model.Filter([new sap.ui.model.Filter("countryCode", sap.ui.model.FilterOperator.Contains, value),
		// 		new sap.ui.model.Filter("countryName", sap.ui.model.FilterOperator.Contains, value)
		// 	]);
		// 	filters.push(oFilter);
		// 	var oBinding = oEvent.getSource().getBinding("items");
		// 	oBinding.filter(filters);
		// },

		//OType
		//function to fetch the OType list
		handleValueHelpOType: function (oEvent) {
			var that = this;
			if (!that.OTypeFrag) {
				that.OTypeFrag = sap.ui.xmlfragment("com.incture.cherrywork.newdac.fragments.OrderType", that);
				that.getView().addDependent(that.OTypeFrag);
			}
			that.readOType();
		},
		readOType: function () {
			var that = this;
			var lang = "";
			if (sap.ushell) {
				lang = sap.ui.getCore().getConfiguration().getLanguage();
				lang = lang.toUpperCase();
				if (lang == "TH")
					lang = 2;
			} else {
				lang = "D";
			}

			//coment later
			//lang = "E";
			var busyDialog = new sap.m.BusyDialog();
			busyDialog.open();
			var url = encodeURI("/orderTypeLookupSet");

			if (!that.oModelOType) {
				var oModel = new sap.ui.model.odata.ODataModel("/DKSHDACODataService/sap/opu/odata/sap/ZDKSH_CC_DAC_LOOKUP_SRV");
				oModel.read(url, {
					async: true,
					urlParameters: "$filter=languageKey  eq '" + lang + "'",
					success: function (oData, oResponse) {
						that.oModelOType = new sap.ui.model.json.JSONModel({
							results: oData.results
						});
						that.oModelOType.setSizeLimit(oData.results.length);
						//	//sap.ui.getCore().byId("ID_TBL_PROV_SELS_ORG").setModel(that.oModelSelsOrganization, "SlaesOrgSet");
						that.OTypeFrag.setModel(that.oModelOType, "OTypeSet");
						busyDialog.close();
						that.OTypeFrag.open();
					},
					error: function (error) {
						busyDialog.close();
						sap.m.MessageBox.error("Error in retrieving values");
						var errorMsg = JSON.parse(error.responseText);
						errorMsg = errorMsg.error.message.value;
						that.errorMsg(errorMsg);
					}
				});
			} else {
				busyDialog.close();
				that.OTypeFrag.open();
			}
		},
		onConfirmChangeOType: function (oEvent) {
			var userName = sap.ui.getCore().getModel("userapi").getData().name;
			oEvent.getSource().getBinding("items").filter([]);

			var selectedContext = oEvent.getParameters().selectedContexts;
			var oSelsOrgDet = this.getView().byId("ID_TBL_VIEW_PROV_ORDER").getModel("OrderTypeViewSet");
			//remove duplicate
			var duplicate = [];
			var countDup = 0;
			var nonDupArray = [];
			for (var i = 0; i < selectedContext.length; i++) {
				countDup = 0;
				for (var j = 0; j < oSelsOrgDet.getData().results.permissionObjectDetailsDos.length; j++) {

					if (selectedContext[i].getObject().orderTypeDesc === oSelsOrgDet.getData().results.permissionObjectDetailsDos[j].attributeText) {
						duplicate.push(selectedContext[i].getObject().orderTypeDesc);
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
				oSelsOrgDet.getData().results.permissionObjectDetailsDos.push({
					"permissionObjectGuid": this.perid,
					// "attributeDetailsGuid": "680e944e-be2f-4939-b49e-3bf78007cdae",
					// "attributeDetailsGuid": "4bf4f63c-b61c-4903-bf50-c2c94de50abc",
					"attributeDetailsGuid": this.getView().getModel("detModel").getData()[7].attributeDetailsGuid,
					"attributeValue": selectedObj.orderType,
					"attributeText": selectedObj.orderTypeDesc
				});
			}
			oSelsOrgDet.setSizeLimit(oSelsOrgDet.getData().results.permissionObjectDetailsDos.length);
			oSelsOrgDet.refresh();
			var msg11 = this.i18nModel.getProperty("orderTypeCountLbl");
			this.getView().byId("ID_PROV_LBL_C_ORDER").setText(msg11 + " (" + oSelsOrgDet.getData().results.permissionObjectDetailsDos.length +
				")");

		},

		onLiveChangeOType: function (oEvent) {
			var value = oEvent.getParameters().value;
			var filters = new Array();
			var oFilter = new sap.ui.model.Filter([new sap.ui.model.Filter("orderType", sap.ui.model.FilterOperator.Contains, value),
				new sap.ui.model.Filter("orderTypeDesc", sap.ui.model.FilterOperator.Contains, value)
			]);
			filters.push(oFilter);
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter(filters);
		},

		//District1

		handleValueHelpDis1: function (oEvent) {
			var that = this;
			if (!that.Dis1Frag) {
				that.Dis1Frag = sap.ui.xmlfragment("com.incture.cherrywork.newdac.fragments.District1", that);
				that.getView().addDependent(that.Dis1Frag);
			}
			that.readDis1();
		},
		readDis1: function () {
			var that = this;
			var lang = "";
			if (sap.ushell) {
				lang = sap.ui.getCore().getConfiguration().getLanguage();
				lang = lang.toUpperCase();
				if (lang == "TH")
					lang = 2;
			} else {
				lang = "E";
			}

			//coment later
			//lang = "E";
			var busyDialog = new sap.m.BusyDialog();
			busyDialog.open();
			var url = encodeURI("/districtLookupSet");

			if (!that.oModelDis1) {
				var oModel = new sap.ui.model.odata.ODataModel("/DKSHDACODataService/sap/opu/odata/sap/ZDKSH_CC_DAC_LOOKUP_SRV");
				oModel.read(url, {
					async: true,
					urlParameters: "$filter=languageKey  eq '" + lang + "'",
					success: function (oData, oResponse) {
						that.oModelDis1 = new sap.ui.model.json.JSONModel({
							results: oData.results
						});
						that.oModelDis1.setSizeLimit(oData.results.length);
						//	//sap.ui.getCore().byId("ID_TBL_PROV_SELS_ORG").setModel(that.oModelSelsOrganization, "SlaesOrgSet");
						that.Dis1Frag.setModel(that.oModelDis1, "Dis1Set");
						busyDialog.close();
						that.Dis1Frag.open();
					},
					error: function (error) {
						busyDialog.close();
						sap.m.MessageBox.error("Error in retrieving values");
						var errorMsg = JSON.parse(error.responseText);
						errorMsg = errorMsg.error.message.value;
						that.errorMsg(errorMsg);
					}
				});
			} else {
				busyDialog.close();
				that.Dis1Frag.open();
			}
		},
		onConfirmChangeDis1: function (oEvent) {
			var userName = sap.ui.getCore().getModel("userapi").getData().name;
			oEvent.getSource().getBinding("items").filter([]);

			var selectedContext = oEvent.getParameters().selectedContexts;
			var oSelsOrgDet = this.getView().byId("ID_TBL_VIEW_PROV_DIST1").getModel("District1ViewSet");
			//remove duplicate
			var duplicate = [];
			var countDup = 0;
			var nonDupArray = [];
			for (var i = 0; i < selectedContext.length; i++) {
				countDup = 0;
				for (var j = 0; j < oSelsOrgDet.getData().results.permissionObjectDetailsDos.length; j++) {

					if (selectedContext[i].getObject().districtName === oSelsOrgDet.getData().results.permissionObjectDetailsDos[j].attributeText) {
						duplicate.push(selectedContext[i].getObject().districtName);
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
				oSelsOrgDet.getData().results.permissionObjectDetailsDos.push({
					"permissionObjectGuid": this.perid,
					// "attributeDetailsGuid": "633ec7b6-6a2e-4205-89f7-5da123028d85",
					// "attributeDetailsGuid": "cfccd6e9-56e4-4774-944c-104c9dc6fefe",
					"attributeDetailsGuid": this.getView().getModel("detModel").getData()[27].attributeDetailsGuid,
					"attributeValue": selectedObj.districtCode,
					"attributeText": selectedObj.districtName
				});
			}
			oSelsOrgDet.setSizeLimit(oSelsOrgDet.getData().results.permissionObjectDetailsDos.length);
			oSelsOrgDet.refresh();
			var msg1 = this.i18nModel.getProperty("District1CountLbl");
			this.getView().byId("ID_PROV_LBL_C_DIST1").setText(msg1 + " (" + oSelsOrgDet.getData().results.permissionObjectDetailsDos.length +
				")");
			//this.salesOrgFrag.close();
		},

		onLiveChangeDis1: function (oEvent) {
			var value = oEvent.getParameters().value;
			var filters = new Array();
			var oFilter = new sap.ui.model.Filter([new sap.ui.model.Filter("districtCode", sap.ui.model.FilterOperator.Contains, value),
				new sap.ui.model.Filter("districtName", sap.ui.model.FilterOperator.Contains, value)
			]);
			filters.push(oFilter);
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter(filters);
		},

		handleValueHelpSalesOrganization: function (oEvent) {
			var that = this;
			if (!that.salesOrgFrag) {
				that.salesOrgFrag = sap.ui.xmlfragment("com.incture.cherrywork.newdac.fragments.SalesOrg", that);
				that.getView().addDependent(that.salesOrgFrag);
			}
			that.readSalesOrganization();
		},
		onConfirmChangeSalesOrganization: function (oEvent) {
			var userName = sap.ui.getCore().getModel("userapi").getData().name;
			oEvent.getSource().getBinding("items").filter([]);

			var selectedContext = oEvent.getParameters().selectedContexts;
			var oSelsOrgDet = this.getView().byId("ID_TBL_VIEW_PROV_SELS_ORG").getModel("SlaesOrgViewSet");
			//remove duplicate
			var duplicate = [];
			var countDup = 0;
			var nonDupArray = [];
			for (var i = 0; i < selectedContext.length; i++) {
				countDup = 0;
				for (var j = 0; j < oSelsOrgDet.getData().results.permissionObjectDetailsDos.length; j++) {

					if (selectedContext[i].getObject().SalesOrg === oSelsOrgDet.getData().results.permissionObjectDetailsDos[j].attributeValue) {
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
				oSelsOrgDet.getData().results.permissionObjectDetailsDos.push({
					"permissionObjectGuid": this.perid,
					// "attributeDetailsGuid": "169a3fd1-2c99-43e5-96dc-466e1ef1e6bf",
					// "attributeDetailsGuid": "b079d1a3-f310-46ea-a5a3-8aef8e24d872",
					"attributeDetailsGuid": this.getView().getModel("detModel").getData()[0].attributeDetailsGuid,
					"attributeValue": selectedObj.SalesOrg,
					"attributeText": selectedObj.Name
				});
			}
			oSelsOrgDet.setSizeLimit(oSelsOrgDet.getData().results.permissionObjectDetailsDos.length);
			oSelsOrgDet.refresh();
			var msg1 = this.i18nModel.getProperty("salesOrganizationCountLbl");
			this.getView().byId("ID_PROV_LBL_C_SALS_ORG").setText(msg1 + " (" + oSelsOrgDet.getData().results.permissionObjectDetailsDos.length +
				")");
			//this.salesOrgFrag.close();
		},
		//	f4 for Material Number Search
		handleValueHelpMaterialSearch: function (oEvent) {
			var that = this;
			if (!that.MaterialNumFragSerach) {
				that.MaterialNumFragSerach = sap.ui.xmlfragment("com.incture.cherrywork.newdac.fragments.MaterialSearch",
					that);
				that.getView().addDependent(that.MaterialNumFragSerach);
			}
			var oModelMatSearch = new sap.ui.model.json.JSONModel({
				MatId: "",
				MatName: "",
				MatName2: ""
			});
			that.MaterialNumFragSerach.setModel(oModelMatSearch, "MaterialSerchSet");
			that.MaterialNumFragSerach.open();
		},

		//	on cancel Sales Org
		onCancelChangeSalesOrganization: function (oEvent) {
			oEvent.getSource().getBinding("items").filter([]);
		},

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
				lang = lang.toUpperCase();
				if (lang == "TH")
					lang = 2;
			} else {
				lang = "EN";
			}

			//coment later
			//lang = "E";
			var busyDialog = new sap.m.BusyDialog();
			busyDialog.open();
			/*	var oModel = this.getView().getModel("SalesOrganization");*/
			if (!that.oModelSelsOrganization) {
				var url = encodeURI("/ZSALESORGLOOKUPSet");
				this.oModel.read(url, {
					async: true,
					urlParameters: "$filter=Language eq '" + lang + "'",
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
			oModel.getData().results.permissionObjectDetailsDos.splice(index, 1);
			var msg1 = this.i18nModel.getProperty("deletedSuccessfully");
			sap.m.MessageToast.show(msg1);
			oModel.refresh();
			var msg = this.i18nModel.getProperty("salesOrganizationCountLbl");
			this.getView().byId("ID_PROV_LBL_C_SALS_ORG").setText(msg + " (" + oModel.getData().results.length + ")");

		},
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
			this.customerNumFragSerach.close();
		},

		//	on conform Customer number
		onConfirmChangeCustomerNumber: function (oEvent) {
			var userName = sap.ui.getCore().getModel("userapi").getData().name;
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
				for (var j = 0; j < oSelsOrgDet.getData().results.permissionObjectDetailsDos.length; j++) {

					if (selectedContext[i].getObject().CustCode === oSelsOrgDet.getData().results.permissionObjectDetailsDos[j].attributeValue) {
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
				oSelsOrgDet.getData().results.permissionObjectDetailsDos.push({
					"permissionObjectGuid": this.perid,
					// "attributeDetailsGuid": "3a937ca7-16e5-47be-93ef-b647577aeb36",
					// "attributeDetailsGuid": "f2a21bfd-8bcb-475b-b707-55c596864c5d",
					"attributeDetailsGuid": this.getView().getModel("detModel").getData()[5].attributeDetailsGuid,
					"attributeValue": selectedObj.CustCode,
					"attributeText": selectedObj.Name1,
				});
			}
			oSelsOrgDet.setSizeLimit(oSelsOrgDet.getData().results.permissionObjectDetailsDos.length);
			oSelsOrgDet.refresh();
			var msg1 = this.i18nModel.getProperty("customerLblCount");
			this.getView().byId("ID_PROV_LBL_C_CUST_NUM").setText(msg1 + " (" + oSelsOrgDet.getData().results.permissionObjectDetailsDos.length +
				")");
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
		/*	onPressDeleteCustomerNumber: function (oEvent) {
				var index = oEvent.getSource().getBindingContext("CustomerNumViewSet").sPath.split("/").pop();
				var oModel = this.getView().byId("ID_TBL_VIEW_PROV_CUST_NUM").getModel("CustomerNumViewSet");
				oModel.getData().results.splice(index, 1);
				var msg1 = this.i18nModel.getProperty("deletedSuccessfully");
				sap.m.MessageToast.show(msg1);
				oModel.refresh();
				var msg = this.i18nModel.getProperty("customerLblCount");
				this.getView().byId("ID_PROV_LBL_C_CUST_NUM").setText(msg + " (" + oModel.getData().results.length + ")");
			},*/
		onPressDeleteCustomerNumber: function (oEvent) {
			var index = oEvent.getSource().getBindingContext("CustomerNumViewSet").sPath.split("/").pop();
			var oModel = this.getView().byId("ID_TBL_VIEW_PROV_CUST_NUM").getModel("CustomerNumViewSet");
			oModel.getData().results.permissionObjectDetailsDos.splice(index, 1);
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
				for (var j = 0; j < oSelsOrgDet.getData().results.permissionObjectDetailsDos.length; j++) {

					if (selectedContext[i].getObject().MatCode === oSelsOrgDet.getData().results.permissionObjectDetailsDos[j].attributeValue) {
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
				oSelsOrgDet.getData().results.permissionObjectDetailsDos.push({
					"permissionObjectGuid": this.perid,
					// "attributeDetailsGuid": "cb203a9e-1a62-465f-92c6-0f8b214cc580",
					// "attributeDetailsGuid": "1199db72-bce4-46dd-b017-14d572aaba97",
					"attributeDetailsGuid": this.getView().getModel("detModel").getData()[6].attributeDetailsGuid,
					"MatCode": selectedObj.MatCode,
					"MatCodeDesc": selectedObj.MatCodeDesc
				});
			}
			oSelsOrgDet.setSizeLimit(oSelsOrgDet.getData().results.permissionObjectDetailsDos.length);
			oSelsOrgDet.refresh();
			var msg1 = this.i18nModel.getProperty("materialNumberCountLbl");
			this.getView().byId("ID_PROV_LBL_C_Mat_NUM").setText(msg1 + " (" + oSelsOrgDet.getData().results.permissionObjectDetailsDos.length +
				")");
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
				lang = lang.toUpperCase();
				if (lang == "TH")
					lang = 2;
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
					urlParameters: "$filter=Language eq '" + lang + "'",
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
			var userName = sap.ui.getCore().getModel("userapi").getData().name;
			oEvent.getSource().getBinding("items").filter([]);

			var selectedContext = oEvent.getParameters().selectedContexts;
			var oSelsOrgDet = this.getView().byId("ID_TBL_VIEW_PROV_DISTRU_CHANL").getModel("DistributionChannelViewSet");
			//remove duplicate
			var duplicate = [];
			var countDup = 0;
			var nonDupArray = [];
			for (var i = 0; i < selectedContext.length; i++) {
				countDup = 0;
				for (var j = 0; j < oSelsOrgDet.getData().results.permissionObjectDetailsDos.length; j++) {

					if (selectedContext[i].getObject().DistChl === oSelsOrgDet.getData().results.permissionObjectDetailsDos[j].attributeValue) {
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
				oSelsOrgDet.getData().results.permissionObjectDetailsDos.push({
					"permissionObjectGuid": this.perid,
					// "attributeDetailsGuid": "2570f50a-ef16-4b85-b9d1-2f0e1902d39e",
					// "attributeDetailsGuid": "57af0c60-3e1e-4c11-8ab7-90801bcec343",
					"attributeDetailsGuid": this.getView().getModel("detModel").getData()[1].attributeDetailsGuid,
					"attributeValue": selectedObj.DistChl,
					"attributeText": selectedObj.Name,
				});
			}
			oSelsOrgDet.setSizeLimit(oSelsOrgDet.getData().results.permissionObjectDetailsDos.length);
			oSelsOrgDet.refresh();
			var msg1 = this.i18nModel.getProperty("distributionChannelCountLbl");
			this.getView().byId("ID_PROV_LBL_C_DISTRI_CHNL").setText(msg1 + " (" + oSelsOrgDet.getData().results.permissionObjectDetailsDos.length +
				")");
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
				lang = lang.toUpperCase();
				if (lang == "TH")
					lang = 2;
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
					urlParameters: "$filter=Language eq '" + lang + "'",
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
			oModel.getData().results.permissionObjectDetailsDos.splice(index, 1);
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
			var userName = sap.ui.getCore().getModel("userapi").getData().name;
			oEvent.getSource().getBinding("items").filter([]);

			var selectedContext = oEvent.getParameters().selectedContexts;
			var oSelsOrgDet = this.getView().byId("ID_TBL_VIEW_PROV_MAT_GRP_").getModel("MaterialGrpViewSet");
			//remove duplicate
			var duplicate = [];
			var countDup = 0;
			var nonDupArray = [];
			for (var i = 0; i < selectedContext.length; i++) {
				countDup = 0;
				for (var j = 0; j < oSelsOrgDet.getData().results.permissionObjectDetailsDos.length; j++) {

					if (selectedContext[i].getObject().Materialgroup === oSelsOrgDet.getData().results.permissionObjectDetailsDos[j].attributeValue) {
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
				oSelsOrgDet.getData().results.permissionObjectDetailsDos.push({
					"permissionObjectGuid": this.perid,
					// "attributeDetailsGuid": "686d2593-3ba4-4ffa-a1e8-386c2fa66c78",
					// "attributeDetailsGuid": "072276f7-7847-46de-af1a-c065ca59731a",
					"attributeDetailsGuid": this.getView().getModel("detModel").getData()[3].attributeDetailsGuid,
					"attributeValue": selectedObj.Materialgroup,
					"attributeText": selectedObj.Matgroupdesc,
				});
			}
			oSelsOrgDet.setSizeLimit(oSelsOrgDet.getData().results.permissionObjectDetailsDos.length);
			oSelsOrgDet.refresh();
			var msg1 = this.i18nModel.getProperty("materialGroupCountLbl");
			this.getView().byId("ID_PROV_LBL_C_MAT_GRP").setText(msg1 + " (" + oSelsOrgDet.getData().results.permissionObjectDetailsDos.length +
				")");
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
				lang = lang.toUpperCase();
				if (lang == "TH")
					lang = 2;
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
					urlParameters: "$filter=Language eq '" + lang + "'",
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
			oModel.getData().results.permissionObjectDetailsDos.splice(index, 1);
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
			var userName = sap.ui.getCore().getModel("userapi").getData().name;
			oEvent.getSource().getBinding("items").filter([]);

			var selectedContext = oEvent.getParameters().selectedContexts;
			var oSelsOrgDet = this.getView().byId("ID_TBL_VIEW_PROV_MAT_GRP_ONE").getModel("MaterialGrpOneViewSet");
			//remove duplicate
			var duplicate = [];
			var countDup = 0;
			var nonDupArray = [];
			for (var i = 0; i < selectedContext.length; i++) {
				countDup = 0;
				for (var j = 0; j < oSelsOrgDet.getData().results.permissionObjectDetailsDos.length; j++) {

					if (selectedContext[i].getObject().MaterialGroup1 === oSelsOrgDet.getData().results.permissionObjectDetailsDos[j].attributeValue) {
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
				oSelsOrgDet.getData().results.permissionObjectDetailsDos.push({
					"permissionObjectGuid": this.perid,
					// "attributeDetailsGuid": "16a3b281-a75c-4e87-8d28-28b1397e6045",
					// "attributeDetailsGuid": "0324bfea-8d38-4b4a-a80e-4afe1021b4a4",
					"attributeDetailsGuid": this.getView().getModel("detModel").getData()[10].attributeDetailsGuid,
					"attributeValue": selectedObj.MaterialGroup1,
					"attributeText": selectedObj.MatGroup1Desc
				});
			}
			oSelsOrgDet.setSizeLimit(oSelsOrgDet.getData().results.permissionObjectDetailsDos.length);
			oSelsOrgDet.refresh();
			var msg1 = this.i18nModel.getProperty("materialGroupOneCountLbl");
			this.getView().byId("ID_PROV_LBL_C_MAT_GRP_ONE").setText(msg1 + " (" + oSelsOrgDet.getData().results.permissionObjectDetailsDos.length +
				")");
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
				lang = lang.toUpperCase();
				if (lang == "TH")
					lang = 2;
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
					urlParameters: "$filter=Language eq '" + lang + "'",
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
			oModel.getData().results.permissionObjectDetailsDos.splice(index, 1);
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
			var userName = sap.ui.getCore().getModel("userapi").getData().name;
			oEvent.getSource().getBinding("items").filter([]);

			var selectedContext = oEvent.getParameters().selectedContexts;
			var oSelsOrgDet = this.getView().byId("ID_TBL_VIEW_PROV_DISTRICT").getModel("DistrictViewSet");
			//remove duplicate
			var duplicate = [];
			var countDup = 0;
			var nonDupArray = [];
			for (var i = 0; i < selectedContext.length; i++) {
				countDup = 0;
				for (var j = 0; j < oSelsOrgDet.getData().results.permissionObjectDetailsDos.length; j++) {

					if (selectedContext[i].getObject().Division === oSelsOrgDet.getData().results.permissionObjectDetailsDos[j].attributeValue) {
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
				oSelsOrgDet.getData().results.permissionObjectDetailsDos.push({
					"permissionObjectGuid": this.perid,
					// "attributeDetailsGuid": "e3b54ff6-9b08-43b0-a91c-ccc6036810fd",
					// "attributeDetailsGuid": "b3857ec1-4058-462e-842d-d88f85087b69",
					"attributeDetailsGuid": this.getView().getModel("detModel").getData()[2].attributeDetailsGuid,
					"attributeValue": selectedObj.Division,
					"attributeText": selectedObj.Name,
				});
			}
			oSelsOrgDet.setSizeLimit(oSelsOrgDet.getData().results.permissionObjectDetailsDos.length);
			oSelsOrgDet.refresh();
			var msg1 = this.i18nModel.getProperty("distrcitCountLbl");
			this.getView().byId("ID_PROV_LBL_C_MAT_DISTRCT").setText(msg1 + " (" + oSelsOrgDet.getData().results.permissionObjectDetailsDos.length +
				")");
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
				lang = lang.toUpperCase();
				if (lang == "TH")
					lang = 2;
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
					urlParameters: "$filter=Language eq '" + lang + "'",
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
				MaterialGrp4Panel1: val,
				MaterialGrp4Panel2: val,
				MaterialGrp4Panel4: val,
				MaterialGrp4Panel5: val,
				MaterialGrp4Panel6: val,
				MaterialGrp4Panel7: val,
				MaterialGrp4Panel8: val,
				MaterialGrp4Panel9: val,
				MaterialGrp4Panel10: val,
				MaterialGrp4Panel11: val,
				MaterialGrp4Panel12: val,
				MaterialGrp4Panel13: val,
				MaterialGrp4Panel14: val,
				MaterialGrp4Panel15: val,
				MaterialGrp4Panel16: val,
				MaterialGrp4Panel17: val,
				MaterialGrp4Panel18: val,
				MaterialGrp4Panel19: val,
				MaterialGrp4Panel20: val,
				MaterialGrp4Panel21: val,
				MaterialGrp4Panel22: val,
				MaterialGrp4Panel23: val
			});
			this.getView().setModel(omodelPanel, "PanelOnOffSet");
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
			var userName = sap.ui.getCore().getModel("userapi").getData().name;
			oEvent.getSource().getBinding("items").filter([]);

			var selectedContext = oEvent.getParameters().selectedContexts;
			var oSelsOrgDet = this.getView().byId("ID_TBL_VIEW_PROV_MAT_GRP_4").getModel("MaterialGrp4ViewSet");
			//remove duplicate
			var duplicate = [];
			var countDup = 0;
			var nonDupArray = [];
			for (var i = 0; i < selectedContext.length; i++) {
				countDup = 0;
				for (var j = 0; j < oSelsOrgDet.getData().results.permissionObjectDetailsDos.length; j++) {

					if (selectedContext[i].getObject().Materialgroup4 === oSelsOrgDet.getData().results.permissionObjectDetailsDos[j].attributeValue) {
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
				oSelsOrgDet.getData().results.permissionObjectDetailsDos.push({
					"permissionObjectGuid": this.perid,
					// "attributeDetailsGuid": "2da6d510-80f4-4773-8c87-80287ab41526",
					// "attributeDetailsGuid": "80709c4b-3273-4bec-91a1-42e47161a17a",
					"attributeDetailsGuid": this.getView().getModel("detModel").getData()[4].attributeDetailsGuid,
					"attributeValue": selectedObj.Materialgroup4,
					"attributeText": selectedObj.Matgroup4desc,
				});
			}
			oSelsOrgDet.setSizeLimit(oSelsOrgDet.getData().results.permissionObjectDetailsDos.length);
			oSelsOrgDet.refresh();
			var msg1 = this.i18nModel.getProperty("materialGroup4CountLbl");
			this.getView().byId("ID_PROV_LBL_C_MAT_GRP_4").setText(msg1 + " (" + oSelsOrgDet.getData().results.permissionObjectDetailsDos.length +
				")");
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
				lang = lang.toUpperCase();
				if (lang == "TH")
					lang = 2;
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
					urlParameters: "$filter=Language eq '" + lang + "'",
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
			oModel.getData().results.permissionObjectDetailsDos.splice(index, 1);
			var msg1 = this.i18nModel.getProperty("deletedSuccessfully");
			sap.m.MessageToast.show(msg1);
			oModel.refresh();
			var msg = this.i18nModel.getProperty("materialGroup4CountLbl");
			this.getView().byId("ID_PROV_LBL_C_MAT_GRP_4").setText(msg + " (" + oModel.getData().results.length + ")");

		},
		onPressDeleteDistrict: function (oEvent) {
			var index = oEvent.getSource().getBindingContext("DistrictViewSet").sPath.split("/").pop();
			var oModel = this.getView().byId("ID_TBL_VIEW_PROV_DISTRICT").getModel("DistrictViewSet");
			oModel.getData().results.permissionObjectDetailsDos.splice(index, 1);
			var msg1 = this.i18nModel.getProperty("deletedSuccessfully");
			sap.m.MessageToast.show(msg1);
			oModel.refresh();
			var msg = this.i18nModel.getProperty("distrcitCountLbl");
			this.getView().byId("ID_PROV_LBL_C_MAT_DISTRCT").setText(msg + " (" + oModel.getData().results.length + ")");
		},
		onPressDeletePlant: function (oEvent) {
			var index = oEvent.getSource().getBindingContext("PlantViewSet").sPath.split("/").pop();
			var oModel = this.getView().byId("ID_TBL_VIEW_PROV_PLANT").getModel("PlantViewSet");
			oModel.getData().results.permissionObjectDetailsDos.splice(index, 1);
			var msg1 = this.i18nModel.getProperty("deletedSuccessfully");
			sap.m.MessageToast.show(msg1);
			oModel.refresh();
			var msg = this.i18nModel.getProperty("plantCountLbl");
			this.getView().byId("ID_PROV_LBL_C_MAT_PLANT").setText(msg + " (" + oModel.getData().results.length + ")");

		},

		onPressDeleteCountry: function (oEvent) {
			var index = oEvent.getSource().getBindingContext("CountryViewSet").sPath.split("/").pop();
			var oModel = this.getView().byId("ID_TBL_VIEW_PROV_COUNTRY").getModel("CountryViewSet");
			oModel.getData().results.permissionObjectDetailsDos.splice(index, 1);
			var msg1 = this.i18nModel.getProperty("deletedSuccessfully");
			sap.m.MessageToast.show(msg1);
			oModel.refresh();
			var msg = this.i18nModel.getProperty("countryCountLbl");
			this.getView().byId("ID_PROV_LBL_C_COUNTRY").setText(msg + " (" + oModel.getData().results.length + ")");
		},
		onPressDeleteStorLoc: function (oEvent) {
			var index = oEvent.getSource().getBindingContext("StorLocViewSet").sPath.split("/").pop();
			var oModel = this.getView().byId("ID_TBL_VIEW_PROV_STORLOC").getModel("StorLocViewSet");
			oModel.getData().results.permissionObjectDetailsDos.splice(index, 1);
			var msg1 = this.i18nModel.getProperty("deletedSuccessfully");
			sap.m.MessageToast.show(msg1);
			oModel.refresh();
			var msg = this.i18nModel.getProperty("storLocCountLbl");
			this.getView().byId("ID_PROV_LBL_C_MAT_STORLOC").setText(msg + " (" + oModel.getData().results.length + ")");

		},

		onPressDeleteOrderType: function (oEvent) {
			var index = oEvent.getSource().getBindingContext("OrderTypeViewSet").sPath.split("/").pop();
			var oModel = this.getView().byId("ID_TBL_VIEW_PROV_ORDER").getModel("OrderTypeViewSet");
			oModel.getData().results.permissionObjectDetailsDos.splice(index, 1);
			var msg1 = this.i18nModel.getProperty("deletedSuccessfully");
			sap.m.MessageToast.show(msg1);
			oModel.refresh();
			var msg = this.i18nModel.getProperty("orderTypeCountLbl");
			this.getView().byId("ID_PROV_LBL_C_ORDER").setText(msg + " (" + oModel.getData().results.length + ")");
		},
		onPressDeleteMaterialGroupTwo: function (oEvent) {
			var index = oEvent.getSource().getBindingContext("MaterialGrpTwoViewSet").sPath.split("/").pop();
			var oModel = this.getView().byId("ID_TBL_VIEW_PROV_MAT_GRP_TWO").getModel("MaterialGrpTwoViewSet");
			oModel.getData().results.permissionObjectDetailsDos.splice(index, 1);
			var msg1 = this.i18nModel.getProperty("deletedSuccessfully");
			sap.m.MessageToast.show(msg1);
			oModel.refresh();
			var msg = this.i18nModel.getProperty("MatGrp2CountLbl");
			this.getView().byId("ID_PROV_LBL_C_MAT_GRP_TWO").setText(msg + " (" + oModel.getData().results.length + ")");
		},
		onPressDeleteMaterialGroupThree: function (oEvent) {
			var index = oEvent.getSource().getBindingContext("MaterialGrpThreeViewSet").sPath.split("/").pop();
			var oModel = this.getView().byId("ID_TBL_VIEW_PROV_MAT_GRP_THREE").getModel("MaterialGrpThreeViewSet");
			oModel.getData().results.permissionObjectDetailsDos.splice(index, 1);
			var msg1 = this.i18nModel.getProperty("deletedSuccessfully");
			sap.m.MessageToast.show(msg1);
			oModel.refresh();
			var msg = this.i18nModel.getProperty("MatGrp3CountLbl");
			this.getView().byId("ID_PROV_LBL_C_MAT_GRP_THREE").setText(msg + " (" + oModel.getData().results.length + ")");
		},

		onPressDeleteMaterialGroupFive: function (oEvent) {
			var index = oEvent.getSource().getBindingContext("MaterialGrpFiveViewSet").sPath.split("/").pop();
			var oModel = this.getView().byId("ID_TBL_VIEW_PROV_MAT_GRP_FIVE").getModel("MaterialGrpFiveViewSet");
			oModel.getData().results.permissionObjectDetailsDos.splice(index, 1);
			var msg1 = this.i18nModel.getProperty("deletedSuccessfully");
			sap.m.MessageToast.show(msg1);
			oModel.refresh();
			var msg = this.i18nModel.getProperty("MatGrp5CountLbl");
			this.getView().byId("ID_PROV_LBL_C_MAT_GRP_FIVE").setText(msg + " (" + oModel.getData().results.length + ")");
		},

		onPressDeleteProdHierarchyOne: function (oEvent) {
			var index = oEvent.getSource().getBindingContext("ProdHierarchy1ViewSet").sPath.split("/").pop();
			var oModel = this.getView().byId("ID_TBL_VIEW_PROV_PROD_HRCH_ONE").getModel("ProdHierarchy1ViewSet");
			oModel.getData().results.permissionObjectDetailsDos.splice(index, 1);
			var msg1 = this.i18nModel.getProperty("deletedSuccessfully");
			sap.m.MessageToast.show(msg1);
			oModel.refresh();
			var msg = this.i18nModel.getProperty("ProdHrch1CountLbl");
			this.getView().byId("ID_PROV_LBL_C_PROD_HRCH_ONE").setText(msg + " (" + oModel.getData().results.length + ")");
		},

		onPressDeleteProdHierarchyTwo: function (oEvent) {
			var index = oEvent.getSource().getBindingContext("ProdHierarchy2ViewSet").sPath.split("/").pop();
			var oModel = this.getView().byId("ID_TBL_VIEW_PROV_PROD_HRCH_TWO").getModel("ProdHierarchy2ViewSet");
			oModel.getData().results.permissionObjectDetailsDos.splice(index, 1);
			var msg1 = this.i18nModel.getProperty("deletedSuccessfully");
			sap.m.MessageToast.show(msg1);
			oModel.refresh();
			var msg = this.i18nModel.getProperty("ProdHrch2CountLbl");
			this.getView().byId("ID_PROV_LBL_C_PROD_HRCH_TWO").setText(msg + " (" + oModel.getData().results.length + ")");
		},
		onPressDeleteProdHierarchyThree: function (oEvent) {
			var index = oEvent.getSource().getBindingContext("ProdHierarchy3ViewSet").sPath.split("/").pop();
			var oModel = this.getView().byId("ID_TBL_VIEW_PROV_PROD_HRCH_THREE").getModel("ProdHierarchy3ViewSet");
			oModel.getData().results.permissionObjectDetailsDos.splice(index, 1);
			var msg1 = this.i18nModel.getProperty("deletedSuccessfully");
			sap.m.MessageToast.show(msg1);
			oModel.refresh();
			var msg = this.i18nModel.getProperty("ProdHrch3CountLbl");
			this.getView().byId("ID_PROV_LBL_C_PROD_HRCH_THREE").setText(msg + " (" + oModel.getData().results.length + ")");
		},
		onPressDeleteProdHierarchyFour: function (oEvent) {
			var index = oEvent.getSource().getBindingContext("ProdHierarchy4ViewSet").sPath.split("/").pop();
			var oModel = this.getView().byId("ID_TBL_VIEW_PROV_PROD_HRCH_FOUR").getModel("ProdHierarchy4ViewSet");
			oModel.getData().results.permissionObjectDetailsDos.splice(index, 1);
			var msg1 = this.i18nModel.getProperty("deletedSuccessfully");
			sap.m.MessageToast.show(msg1);
			oModel.refresh();
			var msg = this.i18nModel.getProperty("ProdHrch4CountLbl");
			this.getView().byId("ID_PROV_LBL_C_PROD_HRCH_FOUR").setText(msg + " (" + oModel.getData().results.length + ")");
		},
		onPressDeleteProdHierarchyFive: function (oEvent) {
			var index = oEvent.getSource().getBindingContext("ProdHierarchy5ViewSet").sPath.split("/").pop();
			var oModel = this.getView().byId("ID_TBL_VIEW_PROV_PROD_HRCH_FIVE").getModel("ProdHierarchy5ViewSet");
			oModel.getData().results.permissionObjectDetailsDos.splice(index, 1);
			var msg1 = this.i18nModel.getProperty("deletedSuccessfully");
			sap.m.MessageToast.show(msg1);
			oModel.refresh();
			var msg = this.i18nModel.getProperty("ProdHrch5CountLbl");
			this.getView().byId("ID_PROV_LBL_C_PROD_HRCH_FIVE").setText(msg + " (" + oModel.getData().results.length + ")");
		},
		onPressDeleteProdHierarchySix: function (oEvent) {
			var index = oEvent.getSource().getBindingContext("ProdHierarchy6ViewSet").sPath.split("/").pop();
			var oModel = this.getView().byId("ID_TBL_VIEW_PROV_PROD_HRCH_SIX").getModel("ProdHierarchy6ViewSet");
			oModel.getData().results.permissionObjectDetailsDos.splice(index, 1);
			var msg1 = this.i18nModel.getProperty("deletedSuccessfully");
			sap.m.MessageToast.show(msg1);
			oModel.refresh();
			var msg = this.i18nModel.getProperty("ProdHrch6CountLbl");
			this.getView().byId("ID_PROV_LBL_C_PROD_HRCH_SIX").setText(msg + " (" + oModel.getData().results.length + ")");
		},
		onPressDeleteProdHierarchySeven: function (oEvent) {
			var index = oEvent.getSource().getBindingContext("ProdHierarchy7ViewSet").sPath.split("/").pop();
			var oModel = this.getView().byId("ID_TBL_VIEW_PROV_PROD_HRCH_SEVEN").getModel("ProdHierarchy7ViewSet");
			oModel.getData().results.permissionObjectDetailsDos.splice(index, 1);
			var msg1 = this.i18nModel.getProperty("deletedSuccessfully");
			sap.m.MessageToast.show(msg1);
			oModel.refresh();
			var msg = this.i18nModel.getProperty("ProdHrch7CountLbl");
			this.getView().byId("ID_PROV_LBL_C_PROD_HRCH_SEVEN").setText(msg + " (" + oModel.getData().results.length + ")");
		},
		onPressDeleteCusGrp1: function (oEvent) {
			var index = oEvent.getSource().getBindingContext("CusGrp1ViewSet").sPath.split("/").pop();
			var oModel = this.getView().byId("ID_TBL_VIEW_PROV_CUS_GRP_ONE").getModel("CusGrp1ViewSet");
			oModel.getData().results.permissionObjectDetailsDos.splice(index, 1);
			var msg1 = this.i18nModel.getProperty("deletedSuccessfully");
			sap.m.MessageToast.show(msg1);
			oModel.refresh();
			var msg = this.i18nModel.getProperty("CusGrp1CountLbl");
			this.getView().byId("ID_PROV_LBL_C_CUS_GRP_ONE").setText(msg + " (" + oModel.getData().results.length + ")");
		},
		onPressDeleteCusGrp2: function (oEvent) {
			var index = oEvent.getSource().getBindingContext("CusGrp2ViewSet").sPath.split("/").pop();
			var oModel = this.getView().byId("ID_TBL_VIEW_PROV_CUS_GRP_TWO").getModel("CusGrp2ViewSet");
			oModel.getData().results.permissionObjectDetailsDos.splice(index, 1);
			var msg1 = this.i18nModel.getProperty("deletedSuccessfully");
			sap.m.MessageToast.show(msg1);
			oModel.refresh();
			var msg = this.i18nModel.getProperty("CusGrp2CountLbl");
			this.getView().byId("ID_PROV_LBL_C_CUS_GRP_TWO").setText(msg + " (" + oModel.getData().results.length + ")");
		},
		onPressDeleteCusGrp3: function (oEvent) {
			var index = oEvent.getSource().getBindingContext("CusGrp3ViewSet").sPath.split("/").pop();
			var oModel = this.getView().byId("ID_TBL_VIEW_PROV_CUS_GRP_THREE").getModel("CusGrp3ViewSet");
			oModel.getData().results.permissionObjectDetailsDos.splice(index, 1);
			var msg1 = this.i18nModel.getProperty("deletedSuccessfully");
			sap.m.MessageToast.show(msg1);
			oModel.refresh();
			var msg = this.i18nModel.getProperty("CusGrp3CountLbl");
			this.getView().byId("ID_PROV_LBL_C_CUS_GRP_THREE").setText(msg + " (" + oModel.getData().results.length + ")");
		},
		onPressDeleteCusGrp4: function (oEvent) {
			var index = oEvent.getSource().getBindingContext("CusGrp4ViewSet").sPath.split("/").pop();
			var oModel = this.getView().byId("ID_TBL_VIEW_PROV_CUS_GRP_FOUR").getModel("CusGrp4ViewSet");
			oModel.getData().results.permissionObjectDetailsDos.splice(index, 1);
			var msg1 = this.i18nModel.getProperty("deletedSuccessfully");
			sap.m.MessageToast.show(msg1);
			oModel.refresh();
			var msg = this.i18nModel.getProperty("CusGrp4CountLbl");
			this.getView().byId("ID_PROV_LBL_C_CUS_GRP_FOUR").setText(msg + " (" + oModel.getData().results.length + ")");
		},
		onPressDeleteCusGrp5: function (oEvent) {
			var index = oEvent.getSource().getBindingContext("CusGrp5ViewSet").sPath.split("/").pop();
			var oModel = this.getView().byId("ID_TBL_VIEW_PROV_CUS_GRP_FIVE").getModel("CusGrp5ViewSet");
			oModel.getData().results.permissionObjectDetailsDos.splice(index, 1);
			var msg1 = this.i18nModel.getProperty("deletedSuccessfully");
			sap.m.MessageToast.show(msg1);
			oModel.refresh();
			var msg = this.i18nModel.getProperty("CusGrp5CountLbl");
			this.getView().byId("ID_PROV_LBL_C_CUS_GRP_FIVE").setText(msg + " (" + oModel.getData().results.length + ")");
		},
		onPressDeleteCusGrp: function (oEvent) {
			var index = oEvent.getSource().getBindingContext("CusGrpViewSet").sPath.split("/").pop();
			var oModel = this.getView().byId("ID_TBL_VIEW_PROV_CUS_GRP").getModel("CusGrpViewSet");
			oModel.getData().results.permissionObjectDetailsDos.splice(index, 1);
			var msg1 = this.i18nModel.getProperty("deletedSuccessfully");
			sap.m.MessageToast.show(msg1);
			oModel.refresh();
			var msg = this.i18nModel.getProperty("CusGrpCountLbl");
			this.getView().byId("ID_PROV_LBL_C_CUS_GRP").setText(msg + " (" + oModel.getData().results.length + ")");
		},
		onPressDeleteDistrict1: function (oEvent) {
			var index = oEvent.getSource().getBindingContext("District1ViewSet").sPath.split("/").pop();
			var oModel = this.getView().byId("ID_TBL_VIEW_PROV_DIST1").getModel("District1ViewSet");
			oModel.getData().results.permissionObjectDetailsDos.splice(index, 1);
			var msg1 = this.i18nModel.getProperty("deletedSuccessfully");
			sap.m.MessageToast.show(msg1);
			oModel.refresh();
			var msg = this.i18nModel.getProperty("District1CountLbl");
			this.getView().byId("ID_PROV_LBL_C_DIST1").setText(msg + " (" + oModel.getData().results.length + ")");
		},
		onPressDeleteMaterial: function (oEvent) {
			var index = oEvent.getSource().getBindingContext("MaterialViewSet").sPath.split("/").pop();
			var oModel = this.getView().byId("ID_TBL_VIEW_PROV_MAT").getModel("MaterialViewSet");
			oModel.getData().results.permissionObjectDetailsDos.splice(index, 1);
			var msg1 = this.i18nModel.getProperty("deletedSuccessfully");
			sap.m.MessageToast.show(msg1);
			oModel.refresh();
			var msg = this.i18nModel.getProperty("MaterialCountLbl");
			this.getView().byId("ID_PROV_LBL_C_MAT").setText(msg + " (" + oModel.getData().results.length + ")");
		},
		onObjNameChange: function (oEvent) {
			this.getView().byId("idObjName").setValueState("None");
		},

		onCopy: function () {

			this.getRouter().navTo("CreatePermissionObject");

		},

		onEdit: function () {

			this.getView().getModel("UpdateCreateIndModelViewSet").getData().EditableField = true;
			this.getView().getModel("UpdateCreateIndModelViewSet").refresh(true);
			var createMdlViewSet = this.getView().getModel("createMdlViewSet").getData();
			var mdlData = this.getView().getModel("SwitchOnOffSet").getData();
			if (mdlData.SalesOrgSwitch === true) {
				createMdlViewSet.EdtFldSO = false;
			} else {
				createMdlViewSet.EdtFldSO = true;
			}
			///
			if (mdlData.CustomerSwitch === true) {
				createMdlViewSet.EdtFldCus = false;
			} else {
				createMdlViewSet.EdtFldCus = true;
			}
			if (mdlData.MaterialNumSwitch === true) {
				createMdlViewSet.EdtFldMN = false;
			} else {
				createMdlViewSet.EdtFldMN = true;
			}
			if (mdlData.DistribuChanlSwitch === true) {
				createMdlViewSet.EdtFldDisChnl = false;
			} else {
				createMdlViewSet.EdtFldDisChnl = true;
			}
			if (mdlData.MaterialGrpSwitch === true) {
				createMdlViewSet.EdtFldMG = false;
			} else {
				createMdlViewSet.EdtFldMG = true;
			}
			if (mdlData.MaterialGrpOneSwitch === true) {
				createMdlViewSet.EdtFldMG1 = false;
			} else {
				createMdlViewSet.EdtFldMG1 = true;
			}
			if (mdlData.MaterialGrp4Switch === true) {
				createMdlViewSet.EdtFldMG4 = false;
			} else {
				createMdlViewSet.EdtFldMG4 = true;
			}
			if (mdlData.DistrictSwitch === true) {
				createMdlViewSet.EdtFldDiv = false;
			} else {
				createMdlViewSet.EdtFldDiv = true;
			}
			if (mdlData.PlantSwitch === true) {
				createMdlViewSet.EdtFldPlnt = false;
			} else {
				createMdlViewSet.EdtFldPlnt = true;
			}
			if (mdlData.StorageLocSwitch === true) {
				createMdlViewSet.EdtFldStorLoc = false;
			} else {
				createMdlViewSet.EdtFldStorLoc = true;
			}
			if (mdlData.CountrySwitch === true) {
				createMdlViewSet.EdtFldCntry = false;
			} else {
				createMdlViewSet.EdtFldCntry = true;
			}
			if (mdlData.OrderTypeSwitch === true) {
				createMdlViewSet.EdtFldOType = false;
			} else {
				createMdlViewSet.EdtFldOType = true;
			}
			if (mdlData.MatGrp2Switch === true) {
				createMdlViewSet.EdtFldMG2 = false;
			} else {
				createMdlViewSet.EdtFldMG2 = true;
			}
			if (mdlData.MatGrp3Switch === true) {
				createMdlViewSet.EdtFldMG3 = false;
			} else {
				createMdlViewSet.EdtFldMG3 = true;
			}
			if (mdlData.MatGrp5Switch === true) {
				createMdlViewSet.EdtFldMG5 = false;
			} else {
				createMdlViewSet.EdtFldMG5 = true;
			}
			if (mdlData.ProdHierarchy1Switch === true) {
				createMdlViewSet.EdtFldPh1 = false;
			} else {
				createMdlViewSet.EdtFldPh1 = true;
			}
			if (mdlData.ProdHierarchy2Switch === true) {
				createMdlViewSet.EdtFldPh2 = false;
			} else {
				createMdlViewSet.EdtFldPh2 = true;
			}
			if (mdlData.ProdHierarchy3Switch === true) {
				createMdlViewSet.EdtFldPh3 = false;
			} else {
				createMdlViewSet.EdtFldPh3 = true;
			}
			if (mdlData.ProdHierarchy4Switch === true) {
				createMdlViewSet.EdtFldPh4 = false;
			} else {
				createMdlViewSet.EdtFldPh4 = true;
			}
			if (mdlData.ProdHierarchy5Switch === true) {
				createMdlViewSet.EdtFldPh5 = false;
			} else {
				createMdlViewSet.EdtFldPh5 = true;
			}
			if (mdlData.ProdHierarchy6Switch === true) {
				createMdlViewSet.EdtFldPh6 = false;
			} else {
				createMdlViewSet.EdtFldPh6 = true;
			}
			if (mdlData.ProdHierarchy7Switch === true) {
				createMdlViewSet.EdtFldPh7 = false;
			} else {
				createMdlViewSet.EdtFldPh7 = true;
			}
			if (mdlData.CustomerGrpSwitch === true) {
				createMdlViewSet.EdtFldCG = false;
			} else {
				createMdlViewSet.EdtFldCG = true;
			}
			if (mdlData.CustomerGrp1Switch === true) {
				createMdlViewSet.EdtFldCG1 = false;
			} else {
				createMdlViewSet.EdtFldCG1 = true;
			}

			if (mdlData.CustomerGrp2Switch === true) {
				createMdlViewSet.EdtFldCG2 = false;
			} else {
				createMdlViewSet.EdtFldCG2 = true;
			}
			if (mdlData.CustomerGrp3Switch === true) {
				createMdlViewSet.EdtFldCG3 = false;
			} else {
				createMdlViewSet.EdtFldCG3 = true;
			}
			if (mdlData.CustomerGrp4Switch === true) {
				createMdlViewSet.EdtFldCG4 = false;
			} else {
				createMdlViewSet.EdtFldCG4 = true;
			}
			if (mdlData.CustomerGrp5Switch === true) {
				createMdlViewSet.EdtFldCG5 = false;
			} else {
				createMdlViewSet.EdtFldCG5 = true;
			}

			if (mdlData.District1Switch === true) {
				createMdlViewSet.EdtFldDis1 = false;
			} else {
				createMdlViewSet.EdtFldDis1 = true;
			}
			if (mdlData.MaterialSwitch === true) {
				createMdlViewSet.EdtFldMat = false;
			} else {
				createMdlViewSet.EdtFldMat = true;
			}

			/*	createMdlViewSet.setData({
						EdtFldSO: true,
						EdtFldCus: true,
						EdtFldMN: true,
						EdtFldDisChnl: true,
						EdtFldMG: true,
						EdtFldMG1: true,
						EdtFldMG4: true,
						EdtFldDiv: true,
						EdtFldPlnt: true,
						EdtFldCntry: true,
						EdtFldOType: true,
						EdtFldStorLoc: true,
						EdtFldMG2: true,
						EdtFldMG3: true,
						EdtFldMG5: true,
						EdtFldPh1: true,
						EdtFldPh2: true,
						EdtFldPh3: true,
						EdtFldPh4: true,
						EdtFldPh5: true,
						EdtFldPh6: true,
						EdtFldPh7: true,
						EdtFldCG: true,
						EdtFldCG1: true,
						EdtFldCG2: true,
						EdtFldCG3: true,
						EdtFldCG4: true,
						EdtFldCG5: true,
						EdtFldDis1: true,
						EdtFldMat: true,
						
					});*/
			this.getView().getModel("createMdlViewSet").refresh(true);
			this.getView().getModel("visibilityModel").setData({
				save: true,
				cancel: true,
				copy: false,
				edit: false,
				deletePO: false
			});
			this.getView().getModel("visibilityModel").refresh(true);
		},

		onUpdate: function () {
			var that = this;
			var finalCreatePOArr = [];
			var errRowFlag = false;
			var busyDialog = new sap.m.BusyDialog();
			var userName = sap.ui.getCore().getModel("userapi").getData().name;
			var usersLength = 0;
			var userAssignedMdl = new JSONModel();
			that.getView().setModel(userAssignedMdl, "userAssignedMdl");

			if (this.getView().byId("ID_TBL_VIEW_PROV_PROD_HRCH_THREE").getModel("ProdHierarchy3ViewSet").getData().results.permissionObjectDetailsDos
				.length > 0) {
				var resPh3 = this.getView().byId("ID_TBL_VIEW_PROV_PROD_HRCH_THREE").getModel("ProdHierarchy3ViewSet").getData().results.permissionObjectDetailsDos;
				for (var a = 0; a < resPh3.length; a++) {
					if (resPh3[a].attributeId !== undefined) {
						if (resPh3[a].attributeValue === "") {
							resPh3[a].VSPh3 = "Error";
							resPh3[a].VSTPh3 = "Fill the row";
							errRowFlag = true;
							this.getView().byId("ID_TBL_VIEW_PROV_PROD_HRCH_THREE").getModel("ProdHierarchy3ViewSet").refresh();
						} else if (resPh3[a].attributeText === "") {
							resPh3[a].VSPh3Name = "Error";
							resPh3[a].VSTPh3Name = "Fill the row";
							errRowFlag = true;
							this.getView().byId("ID_TBL_VIEW_PROV_PROD_HRCH_THREE").getModel("ProdHierarchy3ViewSet").refresh();
						}
					}
				}
			}
			if (this.getView().byId("ID_TBL_VIEW_PROV_STORLOC").getModel("StorLocViewSet").getData().results.permissionObjectDetailsDos.length >
				0) {
				var resSLoc = this.getView().byId("ID_TBL_VIEW_PROV_STORLOC").getModel("StorLocViewSet").getData().results.permissionObjectDetailsDos;
				for (var a = 0; a < resSLoc.length; a++) {
					if (resSLoc[a].attributeId !== undefined) {
						if (resSLoc[a].attributeValue === "") {
							resSLoc[a].VSLoc = "Error";
							resSLoc[a].VSTLoc = "Fill the row";
							errRowFlag = true;
							this.getView().byId("ID_TBL_VIEW_PROV_STORLOC").getModel("StorLocViewSet").refresh();
						}
						if (resSLoc[a].attributeText === "") {
							resSLoc[a].VSLocName = "Error";
							resSLoc[a].VSTLocName = "Fill the row";
							errRowFlag = true;
							this.getView().byId("ID_TBL_VIEW_PROV_STORLOC").getModel("StorLocViewSet").refresh();
						}
					}
				}
			}
			if (this.getView().byId("ID_TBL_VIEW_PROV_PLANT").getModel("PlantViewSet").getData().results.permissionObjectDetailsDos.length > 0) {
				var res = this.getView().byId("ID_TBL_VIEW_PROV_PLANT").getModel("PlantViewSet").getData().results.permissionObjectDetailsDos;
				for (var a = 0; a < res.length; a++) {
					if (res[a].attributeId !== undefined) {
						if (res[a].attributeValue === "") {
							res[a].VS = "Error";
							res[a].VST = "Fill the row";
							errRowFlag = true;
							this.getView().byId("ID_TBL_VIEW_PROV_PLANT").getModel("PlantViewSet").refresh();
						}
						if (res[a].attributeText === "") {
							res[a].VSName = "Error";
							res[a].VSTName = "Fill the row";
							errRowFlag = true;
							this.getView().byId("ID_TBL_VIEW_PROV_PLANT").getModel("PlantViewSet").refresh();
						}
					}
				}
			}
			if (this.getView().byId("ID_TBL_VIEW_PROV_MAT_GRP_TWO").getModel("MaterialGrpTwoViewSet").getData().results.permissionObjectDetailsDos
				.length > 0) {
				var res = this.getView().byId("ID_TBL_VIEW_PROV_MAT_GRP_TWO").getModel("MaterialGrpTwoViewSet").getData().results.permissionObjectDetailsDos;
				for (var a = 0; a < res.length; a++) {
					if (res[a].attributeId !== undefined) {
						if (res[a].attributeValue === "") {
							res[a].VS = "Error";
							res[a].VST = "Fill the row";
							errRowFlag = true;
							this.getView().byId("ID_TBL_VIEW_PROV_MAT_GRP_TWO").getModel("MaterialGrpTwoViewSet").refresh();
						}
						if (res[a].attributeText === "") {
							res[a].VSName = "Error";
							res[a].VSTName = "Fill the row";
							errRowFlag = true;
							this.getView().byId("ID_TBL_VIEW_PROV_MAT_GRP_TWO").getModel("MaterialGrpTwoViewSet").refresh();
						}
					}
				}
			}
			if (this.getView().byId("ID_TBL_VIEW_PROV_MAT_GRP_THREE").getModel("MaterialGrpThreeViewSet").getData().results.permissionObjectDetailsDos
				.length > 0) {
				var res = this.getView().byId("ID_TBL_VIEW_PROV_MAT_GRP_THREE").getModel("MaterialGrpThreeViewSet").getData().results.permissionObjectDetailsDos;
				for (var a = 0; a < res.length; a++) {
					if (res[a].attributeId !== undefined) {
						if (res[a].attributeValue === "") {
							res[a].VS = "Error";
							res[a].VST = "Fill the row";
							errRowFlag = true;
							this.getView().byId("ID_TBL_VIEW_PROV_MAT_GRP_THREE").getModel("MaterialGrpThreeViewSet").refresh();
						}
						if (res[a].attributeText === "") {
							res[a].VSName = "Error";
							res[a].VSTName = "Fill the row";
							errRowFlag = true;
							this.getView().byId("ID_TBL_VIEW_PROV_MAT_GRP_THREE").getModel("MaterialGrpThreeViewSet").refresh();
						}
					}
				}
			}
			if (this.getView().byId("ID_TBL_VIEW_PROV_MAT_GRP_FIVE").getModel("MaterialGrpFiveViewSet").getData().results.permissionObjectDetailsDos
				.length > 0) {
				var res = this.getView().byId("ID_TBL_VIEW_PROV_MAT_GRP_FIVE").getModel("MaterialGrpFiveViewSet").getData().results.permissionObjectDetailsDos;
				for (var a = 0; a < res.length; a++) {
					if (res[a].attributeId !== undefined) {
						if (res[a].attributeValue === "") {
							res[a].VS = "Error";
							res[a].VST = "Fill the row";
							errRowFlag = true;
							this.getView().byId("ID_TBL_VIEW_PROV_MAT_GRP_FIVE").getModel("MaterialGrpFiveViewSet").refresh();
						}
						if (res[a].attributeText === "") {
							res[a].VSName = "Error";
							res[a].VSTName = "Fill the row";
							errRowFlag = true;
							this.getView().byId("ID_TBL_VIEW_PROV_MAT_GRP_FIVE").getModel("MaterialGrpFiveViewSet").refresh();
						}
					}
				}
			}
			if (this.getView().byId("ID_TBL_VIEW_PROV_PROD_HRCH_ONE").getModel("ProdHierarchy1ViewSet").getData().results.permissionObjectDetailsDos
				.length > 0) {
				var res = this.getView().byId("ID_TBL_VIEW_PROV_PROD_HRCH_ONE").getModel("ProdHierarchy1ViewSet").getData().results.permissionObjectDetailsDos;
				for (var a = 0; a < res.length; a++) {
					if (res[a].attributeId !== undefined) {
						if (res[a].attributeValue === "") {
							res[a].VS = "Error";
							res[a].VST = "Fill the row";
							errRowFlag = true;
							this.getView().byId("ID_TBL_VIEW_PROV_PROD_HRCH_ONE").getModel("ProdHierarchy1ViewSet").refresh();
						}
						if (res[a].attributeText === "") {
							res[a].VSName = "Error";
							res[a].VSTName = "Fill the row";
							errRowFlag = true;
							this.getView().byId("ID_TBL_VIEW_PROV_PROD_HRCH_ONE").getModel("ProdHierarchy1ViewSet").refresh();
						}
					}
				}
			}
			if (this.getView().byId("ID_TBL_VIEW_PROV_PROD_HRCH_TWO").getModel("ProdHierarchy2ViewSet").getData().results.permissionObjectDetailsDos
				.length > 0) {
				var res = this.getView().byId("ID_TBL_VIEW_PROV_PROD_HRCH_TWO").getModel("ProdHierarchy2ViewSet").getData().results.permissionObjectDetailsDos;
				for (var a = 0; a < res.length; a++) {
					if (res[a].attributeId !== undefined) {
						if (res[a].attributeValue === "") {
							res[a].VS = "Error";
							res[a].VST = "Fill the row";
							errRowFlag = true;
							this.getView().byId("ID_TBL_VIEW_PROV_PROD_HRCH_TWO").getModel("ProdHierarchy2ViewSet").refresh();
						}
						if (res[a].attributeText === "") {
							res[a].VSName = "Error";
							res[a].VSTName = "Fill the row";
							errRowFlag = true;
							this.getView().byId("ID_TBL_VIEW_PROV_PROD_HRCH_TWO").getModel("ProdHierarchy2ViewSet").refresh();
						}
					}
				}
			}
			if (this.getView().byId("ID_TBL_VIEW_PROV_PROD_HRCH_FOUR").getModel("ProdHierarchy4ViewSet").getData().results.permissionObjectDetailsDos
				.length > 0) {
				var res = this.getView().byId("ID_TBL_VIEW_PROV_PROD_HRCH_FOUR").getModel("ProdHierarchy4ViewSet").getData().results.permissionObjectDetailsDos;
				for (var a = 0; a < res.length; a++) {
					if (res[a].attributeId !== undefined) {
						if (res[a].attributeValue === "") {
							res[a].VS = "Error";
							res[a].VST = "Fill the row";
							errRowFlag = true;
							this.getView().byId("ID_TBL_VIEW_PROV_PROD_HRCH_FOUR").getModel("ProdHierarchy4ViewSet").refresh();
						}
						if (res[a].attributeText === "") {
							res[a].VSName = "Error";
							res[a].VSTName = "Fill the row";
							errRowFlag = true;
							this.getView().byId("ID_TBL_VIEW_PROV_PROD_HRCH_FOUR").getModel("ProdHierarchy4ViewSet").refresh();
						}
					}
				}
			}
			if (this.getView().byId("ID_TBL_VIEW_PROV_PROD_HRCH_FIVE").getModel("ProdHierarchy5ViewSet").getData().results.permissionObjectDetailsDos
				.length > 0) {
				var res = this.getView().byId("ID_TBL_VIEW_PROV_PROD_HRCH_FIVE").getModel("ProdHierarchy5ViewSet").getData().results.permissionObjectDetailsDos;
				for (var a = 0; a < res.length; a++) {
					if (res[a].attributeId !== undefined) {
						if (res[a].attributeValue === "") {
							res[a].VS = "Error";
							res[a].VST = "Fill the row";
							errRowFlag = true;
							this.getView().byId("ID_TBL_VIEW_PROV_PROD_HRCH_FIVE").getModel("ProdHierarchy5ViewSet").refresh();
						}
						if (res[a].attributeText === "") {
							res[a].VSName = "Error";
							res[a].VSTName = "Fill the row";
							errRowFlag = true;
							this.getView().byId("ID_TBL_VIEW_PROV_PROD_HRCH_FIVE").getModel("ProdHierarchy5ViewSet").refresh();
						}
					}
				}
			}
			if (this.getView().byId("ID_TBL_VIEW_PROV_PROD_HRCH_SIX").getModel("ProdHierarchy6ViewSet").getData().results.permissionObjectDetailsDos
				.length > 0) {
				var res = this.getView().byId("ID_TBL_VIEW_PROV_PROD_HRCH_SIX").getModel("ProdHierarchy6ViewSet").getData().results.permissionObjectDetailsDos;
				for (var a = 0; a < res.length; a++) {
					if (res[a].attributeId !== undefined) {
						if (res[a].attributeValue === "") {
							res[a].VS = "Error";
							res[a].VST = "Fill the row";
							errRowFlag = true;
							this.getView().byId("ID_TBL_VIEW_PROV_PROD_HRCH_SIX").getModel("ProdHierarchy6ViewSet").refresh();
						}
						if (res[a].attributeText === "") {
							res[a].VSName = "Error";
							res[a].VSTName = "Fill the row";
							errRowFlag = true;
							this.getView().byId("ID_TBL_VIEW_PROV_PROD_HRCH_SIX").getModel("ProdHierarchy6ViewSet").refresh();
						}
					}
				}
			}
			if (this.getView().byId("ID_TBL_VIEW_PROV_PROD_HRCH_SEVEN").getModel("ProdHierarchy7ViewSet").getData().results.permissionObjectDetailsDos
				.length > 0) {
				var res = this.getView().byId("ID_TBL_VIEW_PROV_PROD_HRCH_SEVEN").getModel("ProdHierarchy7ViewSet").getData().results.permissionObjectDetailsDos;
				for (var a = 0; a < res.length; a++) {
					if (res[a].attributeId !== undefined) {
						if (res[a].attributeValue === "") {
							res[a].VS = "Error";
							res[a].VST = "Fill the row";
							errRowFlag = true;
							this.getView().byId("ID_TBL_VIEW_PROV_PROD_HRCH_SEVEN").getModel("ProdHierarchy7ViewSet").refresh();
						}
						if (res[a].attributeText === "") {
							res[a].VSName = "Error";
							res[a].VSTName = "Fill the row";
							errRowFlag = true;
							this.getView().byId("ID_TBL_VIEW_PROV_PROD_HRCH_SEVEN").getModel("ProdHierarchy7ViewSet").refresh();
						}
					}
				}
			}
			if (this.getView().byId("ID_TBL_VIEW_PROV_CUS_GRP").getModel("CusGrpViewSet").getData().results.permissionObjectDetailsDos.length >
				0) {
				var res = this.getView().byId("ID_TBL_VIEW_PROV_CUS_GRP").getModel("CusGrpViewSet").getData().results.permissionObjectDetailsDos;
				for (var a = 0; a < res.length; a++) {
					if (res[a].attributeId !== undefined) {
						if (res[a].attributeValue === "") {
							res[a].VS = "Error";
							res[a].VST = "Fill the row";
							errRowFlag = true;
							this.getView().byId("ID_TBL_VIEW_PROV_CUS_GRP").getModel("CusGrpViewSet").refresh();
						}
						if (res[a].attributeText === "") {
							res[a].VSName = "Error";
							res[a].VSTName = "Fill the row";
							errRowFlag = true;
							this.getView().byId("ID_TBL_VIEW_PROV_CUS_GRP").getModel("CusGrpViewSet").refresh();
						}
					}
				}
			}
			if (this.getView().byId("ID_TBL_VIEW_PROV_CUS_GRP_ONE").getModel("CusGrp1ViewSet").getData().results.permissionObjectDetailsDos.length >
				0) {
				var res = this.getView().byId("ID_TBL_VIEW_PROV_CUS_GRP_ONE").getModel("CusGrp1ViewSet").getData().results.permissionObjectDetailsDos;
				for (var a = 0; a < res.length; a++) {
					if (res[a].attributeId !== undefined) {
						if (res[a].attributeValue === "") {
							res[a].VS = "Error";
							res[a].VST = "Fill the row";
							errRowFlag = true;
							this.getView().byId("ID_TBL_VIEW_PROV_CUS_GRP_ONE").getModel("CusGrp1ViewSet").refresh();
						}
						if (res[a].attributeText === "") {
							res[a].VSName = "Error";
							res[a].VSTName = "Fill the row";
							errRowFlag = true;
							this.getView().byId("ID_TBL_VIEW_PROV_CUS_GRP_ONE").getModel("CusGrp1ViewSet").refresh();
						}
					}
				}
			}
			if (this.getView().byId("ID_TBL_VIEW_PROV_CUS_GRP_TWO").getModel("CusGrp2ViewSet").getData().results.permissionObjectDetailsDos.length >
				0) {
				var res = this.getView().byId("ID_TBL_VIEW_PROV_CUS_GRP_TWO").getModel("CusGrp2ViewSet").getData().results.permissionObjectDetailsDos;
				for (var a = 0; a < res.length; a++) {
					if (res[a].attributeId !== undefined) {
						if (res[a].attributeValue === "") {
							res[a].VS = "Error";
							res[a].VST = "Fill the row";
							errRowFlag = true;
							this.getView().byId("ID_TBL_VIEW_PROV_CUS_GRP_TWO").getModel("CusGrp2ViewSet").refresh();
						}
						if (res[a].attributeText === "") {
							res[a].VSName = "Error";
							res[a].VSTName = "Fill the row";
							errRowFlag = true;
							this.getView().byId("ID_TBL_VIEW_PROV_CUS_GRP_TWO").getModel("CusGrp2ViewSet").refresh();
						}
					}
				}
			}
			if (this.getView().byId("ID_TBL_VIEW_PROV_CUS_GRP_THREE").getModel("CusGrp3ViewSet").getData().results.permissionObjectDetailsDos.length >
				0) {
				var res = this.getView().byId("ID_TBL_VIEW_PROV_CUS_GRP_THREE").getModel("CusGrp3ViewSet").getData().results.permissionObjectDetailsDos;
				for (var a = 0; a < res.length; a++) {
					if (res[a].attributeId !== undefined) {
						if (res[a].attributeValue === "") {
							res[a].VS = "Error";
							res[a].VST = "Fill the row";
							errRowFlag = true;
							this.getView().byId("ID_TBL_VIEW_PROV_CUS_GRP_THREE").getModel("CusGrp3ViewSet").refresh();
						}
						if (res[a].attributeText === "") {
							res[a].VSName = "Error";
							res[a].VSTName = "Fill the row";
							errRowFlag = true;
							this.getView().byId("ID_TBL_VIEW_PROV_CUS_GRP_THREE").getModel("CusGrp3ViewSet").refresh();
						}
					}
				}
			}
			if (this.getView().byId("ID_TBL_VIEW_PROV_CUS_GRP_FOUR").getModel("CusGrp4ViewSet").getData().results.permissionObjectDetailsDos.length >
				0) {
				var res = this.getView().byId("ID_TBL_VIEW_PROV_CUS_GRP_FOUR").getModel("CusGrp4ViewSet").getData().results.permissionObjectDetailsDos;
				for (var a = 0; a < res.length; a++) {
					if (res[a].attributeId !== undefined) {
						if (res[a].attributeValue === "") {
							res[a].VS = "Error";
							res[a].VST = "Fill the row";
							errRowFlag = true;
							this.getView().byId("ID_TBL_VIEW_PROV_CUS_GRP_FOUR").getModel("CusGrp4ViewSet").refresh();
						}
						if (res[a].attributeText === "") {
							res[a].VSName = "Error";
							res[a].VSTName = "Fill the row";
							errRowFlag = true;
							this.getView().byId("ID_TBL_VIEW_PROV_CUS_GRP_FOUR").getModel("CusGrp4ViewSet").refresh();
						}
					}
				}
			}
			if (this.getView().byId("ID_TBL_VIEW_PROV_CUS_GRP_FIVE").getModel("CusGrp5ViewSet").getData().results.permissionObjectDetailsDos.length >
				0) {
				var res = this.getView().byId("ID_TBL_VIEW_PROV_CUS_GRP_FIVE").getModel("CusGrp5ViewSet").getData().results.permissionObjectDetailsDos;
				for (var a = 0; a < res.length; a++) {
					if (res[a].attributeId !== undefined) {
						if (res[a].attributeValue === "") {
							res[a].VS = "Error";
							res[a].VST = "Fill the row";
							errRowFlag = true;
							this.getView().byId("ID_TBL_VIEW_PROV_CUS_GRP_FIVE").getModel("CusGrp5ViewSet").refresh();
						}
						if (res[a].attributeText === "") {
							res[a].VSName = "Error";
							res[a].VSTName = "Fill the row";
							errRowFlag = true;
							this.getView().byId("ID_TBL_VIEW_PROV_CUS_GRP_FIVE").getModel("CusGrp5ViewSet").refresh();
						}
					}
				}
			}
			if (this.getView().byId("ID_TBL_VIEW_PROV_MAT").getModel("MaterialViewSet").getData().results.permissionObjectDetailsDos.length > 0) {
				var res = this.getView().byId("ID_TBL_VIEW_PROV_MAT").getModel("MaterialViewSet").getData().results.permissionObjectDetailsDos;
				for (var a = 0; a < res.length; a++) {
					if (res[a].attributeId !== undefined) {
						if (res[a].attributeValue === "") {
							res[a].VS = "Error";
							res[a].VST = "Fill the row";
							errRowFlag = true;
							this.getView().byId("ID_TBL_VIEW_PROV_MAT").getModel("MaterialViewSet").refresh();
						}
						if (res[a].attributeText === "") {
							res[a].VSName = "Error";
							res[a].VSTName = "Fill the row";
							errRowFlag = true;
							this.getView().byId("ID_TBL_VIEW_PROV_MAT").getModel("MaterialViewSet").refresh();
						}
					}
				}
			}
			if (errRowFlag === true) {
				sap.m.MessageBox.error("Please fill the empty row of the attribute");
			}

			if (errRowFlag === false) {

				//sales organization
				var saleOrgAttr1 = this.getView().byId("ID_TBL_VIEW_PROV_SELS_ORG").getModel("SlaesOrgViewSet").getData().results.permissionObjectDetailsDos
					.length > 0 ? this.getView().byId("ID_TBL_VIEW_PROV_SELS_ORG").getModel("SlaesOrgViewSet").getData().results : [];

				var salesOrgArrTemp = [];
				/*for (var r = 0; r < saleOrgAttr1.length; r++) {
					salesOrgArrTemp.push(saleOrgAttr1[r].SalesOrg);
				}*/

				//customer Number
				var custNuAttr6 = this.getView().byId("ID_TBL_VIEW_PROV_CUST_NUM").getModel("CustomerNumViewSet").getData().results.permissionObjectDetailsDos
					.length > 0 ? this.getView().byId("ID_TBL_VIEW_PROV_CUST_NUM").getModel("CustomerNumViewSet").getData().results : [];

				var custNoArrTemp = [];
				/*for (var r = 0; r < custNuAttr6.length; r++) {
					custNoArrTemp.push(custNuAttr6[r].CustCode);
				}*/

				//distributtion channel
				var custNuAttr2 = this.getView().byId("ID_TBL_VIEW_PROV_DISTRU_CHANL").getModel("DistributionChannelViewSet").getData().results.permissionObjectDetailsDos
					.length > 0 ? this.getView().byId("ID_TBL_VIEW_PROV_DISTRU_CHANL").getModel("DistributionChannelViewSet").getData().results : [];

				/*	var distribuChannleTemp = [];
					for (var r = 0; r < custNuAttr2.length; r++) {
						distribuChannleTemp.push(custNuAttr2[r].DistChl);
					}*/

				//district
				var custNuAttr3 = this.getView().byId("ID_TBL_VIEW_PROV_DISTRICT").getModel("DistrictViewSet").getData().results.permissionObjectDetailsDos
					.length > 0 ? this.getView().byId("ID_TBL_VIEW_PROV_DISTRICT").getModel("DistrictViewSet").getData().results : [];

				/*	var districtTemp = [];
					for (var r = 0; r < custNuAttr3.length; r++) {
						districtTemp.push(custNuAttr3[r].Division);
					}*/

				//material group
				var custNuAttr4 = this.getView().byId("ID_TBL_VIEW_PROV_MAT_GRP_").getModel("MaterialGrpViewSet").getData().results.permissionObjectDetailsDos
					.length > 0 ? this.getView().byId("ID_TBL_VIEW_PROV_MAT_GRP_").getModel("MaterialGrpViewSet").getData().results : [];
				/*	var materialGrpTemp = [];
			for (var r = 0; r < custNuAttr4.length; r++) {
				materialGrpTemp.push(custNuAttr4[r].Materialgroup);
			}
*/
				//material group one
				var custNuAttr5 = this.getView().byId("ID_TBL_VIEW_PROV_MAT_GRP_ONE").getModel("MaterialGrpOneViewSet").getData().results.permissionObjectDetailsDos
					.length > 0 ? this.getView().byId("ID_TBL_VIEW_PROV_MAT_GRP_ONE").getModel("MaterialGrpOneViewSet").getData().results : [];
				/*	var materialGrpOneTemp = [];
					for (var r = 0; r < custNuAttr5.length; r++) {
						materialGrpOneTemp.push(custNuAttr5[r].MaterialGroup1);
					}*/

				//material group 4
				var custNuAttr7 = this.getView().byId("ID_TBL_VIEW_PROV_MAT_GRP_4").getModel("MaterialGrp4ViewSet").getData().results.permissionObjectDetailsDos
					.length > 0 ? this.getView().byId("ID_TBL_VIEW_PROV_MAT_GRP_4").getModel("MaterialGrp4ViewSet").getData().results : [];
				/*	var materialGrp4Temp = [];
					for (var r = 0; r < custNuAttr7.length; r++) {
						materialGrp4Temp.push(custNuAttr7[r].Materialgroup4);
					}*/

				var custNuAttr8 = this.getView().byId("ID_TBL_VIEW_PROV_PLANT").getModel("PlantViewSet").getData().results.permissionObjectDetailsDos
					.length >
					0 ? this.getView().byId("ID_TBL_VIEW_PROV_PLANT").getModel("PlantViewSet").getData().results : [];
				var custNuAttr9 = this.getView().byId("ID_TBL_VIEW_PROV_STORLOC").getModel("StorLocViewSet").getData().results.permissionObjectDetailsDos
					.length > 0 ? this.getView().byId("ID_TBL_VIEW_PROV_STORLOC").getModel("StorLocViewSet").getData().results : [];
				var custNuAttr10 = this.getView().byId("ID_TBL_VIEW_PROV_COUNTRY").getModel("CountryViewSet").getData().results.permissionObjectDetailsDos
					.length > 0 ? this.getView().byId("ID_TBL_VIEW_PROV_COUNTRY").getModel("CountryViewSet").getData().results : [];
				var custNuAttr11 = this.getView().byId("ID_TBL_VIEW_PROV_ORDER").getModel("OrderTypeViewSet").getData().results.permissionObjectDetailsDos
					.length > 0 ? this.getView().byId("ID_TBL_VIEW_PROV_ORDER").getModel("OrderTypeViewSet").getData().results : [];
				var custNuAttr12 = this.getView().byId("ID_TBL_VIEW_PROV_MAT_GRP_TWO").getModel("MaterialGrpTwoViewSet").getData().results.permissionObjectDetailsDos
					.length > 0 ? this.getView().byId("ID_TBL_VIEW_PROV_MAT_GRP_TWO").getModel("MaterialGrpTwoViewSet").getData().results : [];
				var custNuAttr13 = this.getView().byId("ID_TBL_VIEW_PROV_MAT_GRP_THREE").getModel("MaterialGrpThreeViewSet").getData().results.permissionObjectDetailsDos
					.length > 0 ? this.getView().byId("ID_TBL_VIEW_PROV_MAT_GRP_THREE").getModel("MaterialGrpThreeViewSet").getData().results : [];

				var custNuAttr14 = this.getView().byId("ID_TBL_VIEW_PROV_MAT_GRP_FIVE").getModel("MaterialGrpFiveViewSet").getData().results.permissionObjectDetailsDos
					.length > 0 ? this.getView().byId("ID_TBL_VIEW_PROV_MAT_GRP_FIVE").getModel("MaterialGrpFiveViewSet").getData().results : [];
				var custNuAttr15 = this.getView().byId("ID_TBL_VIEW_PROV_PROD_HRCH_ONE").getModel("ProdHierarchy1ViewSet").getData().results.permissionObjectDetailsDos
					.length > 0 ? this.getView().byId("ID_TBL_VIEW_PROV_PROD_HRCH_ONE").getModel("ProdHierarchy1ViewSet").getData().results : [];

				var custNuAttr16 = this.getView().byId("ID_TBL_VIEW_PROV_PROD_HRCH_TWO").getModel("ProdHierarchy2ViewSet").getData().results.permissionObjectDetailsDos
					.length > 0 ? this.getView().byId("ID_TBL_VIEW_PROV_PROD_HRCH_TWO").getModel("ProdHierarchy2ViewSet").getData().results : [];
				var custNuAttr17 = this.getView().byId("ID_TBL_VIEW_PROV_PROD_HRCH_THREE").getModel("ProdHierarchy3ViewSet").getData().results.permissionObjectDetailsDos
					.length > 0 ? this.getView().byId("ID_TBL_VIEW_PROV_PROD_HRCH_THREE").getModel("ProdHierarchy3ViewSet").getData().results : [];
				var custNuAttr18 = this.getView().byId("ID_TBL_VIEW_PROV_PROD_HRCH_FOUR").getModel("ProdHierarchy4ViewSet").getData().results.permissionObjectDetailsDos
					.length > 0 ? this.getView().byId("ID_TBL_VIEW_PROV_PROD_HRCH_FOUR").getModel("ProdHierarchy4ViewSet").getData().results : [];
				var custNuAttr19 = this.getView().byId("ID_TBL_VIEW_PROV_PROD_HRCH_FIVE").getModel("ProdHierarchy5ViewSet").getData().results.permissionObjectDetailsDos
					.length > 0 ? this.getView().byId("ID_TBL_VIEW_PROV_PROD_HRCH_FIVE").getModel("ProdHierarchy5ViewSet").getData().results : [];
				var custNuAttr20 = this.getView().byId("ID_TBL_VIEW_PROV_PROD_HRCH_SIX").getModel("ProdHierarchy6ViewSet").getData().results.permissionObjectDetailsDos
					.length > 0 ? this.getView().byId("ID_TBL_VIEW_PROV_PROD_HRCH_SIX").getModel("ProdHierarchy6ViewSet").getData().results : [];
				var custNuAttr21 = this.getView().byId("ID_TBL_VIEW_PROV_PROD_HRCH_SEVEN").getModel("ProdHierarchy7ViewSet").getData().results.permissionObjectDetailsDos
					.length > 0 ? this.getView().byId("ID_TBL_VIEW_PROV_PROD_HRCH_SEVEN").getModel("ProdHierarchy7ViewSet").getData().results : [];
				var custNuAttr22 = this.getView().byId("ID_TBL_VIEW_PROV_CUS_GRP").getModel("CusGrpViewSet").getData().results.permissionObjectDetailsDos
					.length > 0 ? this.getView().byId("ID_TBL_VIEW_PROV_CUS_GRP").getModel("CusGrpViewSet").getData().results : [];
				var custNuAttr23 = this.getView().byId("ID_TBL_VIEW_PROV_CUS_GRP_ONE").getModel("CusGrp1ViewSet").getData().results.permissionObjectDetailsDos
					.length > 0 ? this.getView().byId("ID_TBL_VIEW_PROV_CUS_GRP_ONE").getModel("CusGrp1ViewSet").getData().results : [];
				var custNuAttr24 = this.getView().byId("ID_TBL_VIEW_PROV_CUS_GRP_TWO").getModel("CusGrp2ViewSet").getData().results.permissionObjectDetailsDos
					.length > 0 ? this.getView().byId("ID_TBL_VIEW_PROV_CUS_GRP_TWO").getModel("CusGrp2ViewSet").getData().results : [];
				var custNuAttr25 = this.getView().byId("ID_TBL_VIEW_PROV_CUS_GRP_THREE").getModel("CusGrp3ViewSet").getData().results.permissionObjectDetailsDos
					.length > 0 ? this.getView().byId("ID_TBL_VIEW_PROV_CUS_GRP_THREE").getModel("CusGrp3ViewSet").getData().results : [];
				var custNuAttr26 = this.getView().byId("ID_TBL_VIEW_PROV_CUS_GRP_FOUR").getModel("CusGrp4ViewSet").getData().results.permissionObjectDetailsDos
					.length > 0 ? this.getView().byId("ID_TBL_VIEW_PROV_CUS_GRP_FOUR").getModel("CusGrp4ViewSet").getData().results : [];
				var custNuAttr27 = this.getView().byId("ID_TBL_VIEW_PROV_CUS_GRP_FIVE").getModel("CusGrp5ViewSet").getData().results.permissionObjectDetailsDos
					.length > 0 ? this.getView().byId("ID_TBL_VIEW_PROV_CUS_GRP_FIVE").getModel("CusGrp5ViewSet").getData().results : [];
				var custNuAttr28 = this.getView().byId("ID_TBL_VIEW_PROV_DIST1").getModel("District1ViewSet").getData().results.permissionObjectDetailsDos
					.length > 0 ? this.getView().byId("ID_TBL_VIEW_PROV_DIST1").getModel("District1ViewSet").getData().results : [];
				var custNuAttr29 = this.getView().byId("ID_TBL_VIEW_PROV_MAT").getModel("MaterialViewSet").getData().results.permissionObjectDetailsDos
					.length >
					0 ? this.getView().byId("ID_TBL_VIEW_PROV_MAT").getModel("MaterialViewSet").getData().results : [];
				//switch
				var switchData = this.getView().getModel("SwitchOnOffSet").getData();
				var visibleData = this.getView().getModel("visibleModel").getData();
				var attributeDetails = this.getView().getModel("detModel").getData();
				if (visibleData.ATR01visible && switchData.SalesOrgSwitch) {
					saleOrgAttr1 = {
						"attributeId": "ATR01",
						"attributeDesc": "Sales Org",
						// "attributeDetailsGuid": "169a3fd1-2c99-43e5-96dc-466e1ef1e6bf",
						// "attributeDetailsGuid": "b079d1a3-f310-46ea-a5a3-8aef8e24d872",
						"attributeDetailsGuid": attributeDetails[0].attributeDetailsGuid,
						"domainCode": "cc",
						"isInclusion": true,
						"aliasName": "customAttribute1",
						"permissionObjectDetailsDos": [{
							"permissionObjectGuid": this.perid,
							// "attributeDetailsGuid": "169a3fd1-2c99-43e5-96dc-466e1ef1e6bf",
							// "attributeDetailsGuid": "b079d1a3-f310-46ea-a5a3-8aef8e24d872",
							"attributeDetailsGuid": attributeDetails[0].attributeDetailsGuid,
							"attributeValue": "*",
							"attributeText": ""
						}]
					};
					/*	salesOrgArrTemp = [];
						salesOrgArrTemp.push("*");*/
				}

				if (visibleData.ATR06visible && switchData.CustomerSwitch) {
					custNuAttr6 = {
						"attributeId": "ATR06",
						"attributeDesc": "Customer Code",
						// "attributeDetailsGuid": "3a937ca7-16e5-47be-93ef-b647577aeb36",
						// "attributeDetailsGuid": "f2a21bfd-8bcb-475b-b707-55c596864c5d",
						"attributeDetailsGuid": attributeDetails[5].attributeDetailsGuid,
						"domainCode": "cc",
						"isInclusion": true,
						"aliasName": "customAttribute1",
						"permissionObjectDetailsDos": [{
							"permissionObjectGuid": this.perid,
							// "attributeDetailsGuid": "3a937ca7-16e5-47be-93ef-b647577aeb36",
							// "attributeDetailsGuid": "f2a21bfd-8bcb-475b-b707-55c596864c5d",
							"attributeDetailsGuid": attributeDetails[5].attributeDetailsGuid,
							"attributeValue": "*",
							"attributeText": ""
						}]
					};
					/*	custNoArrTemp = [];
						custNoArrTemp.push("*");*/
				}

				if (visibleData.ATR02visible && switchData.DistribuChanlSwitch) {
					custNuAttr2 = {
						"attributeId": "ATR02",
						"attributeDesc": "Dist Channel",
						// "attributeDetailsGuid": "2570f50a-ef16-4b85-b9d1-2f0e1902d39e",
						// "attributeDetailsGuid": "57af0c60-3e1e-4c11-8ab7-90801bcec343",
						"attributeDetailsGuid": attributeDetails[1].attributeDetailsGuid,
						"domainCode": "cc",
						"isInclusion": true,
						"aliasName": "customAttribute1",
						"permissionObjectDetailsDos": [{
							"permissionObjectGuid": this.perid,
							// "attributeDetailsGuid": "2570f50a-ef16-4b85-b9d1-2f0e1902d39e",
							// "attributeDetailsGuid": "57af0c60-3e1e-4c11-8ab7-90801bcec343",
							"attributeDetailsGuid": attributeDetails[1].attributeDetailsGuid,
							"attributeValue": "*",
							"attributeText": ""
						}]
					};
					/*	distribuChannleTemp = [];
						distribuChannleTemp.push("*");*/
				}

				if (visibleData.ATR03visible && switchData.DistrictSwitch) {
					/*	districtTemp = [];
						districtTemp.push("*");*/
					custNuAttr3 = {
						"attributeId": "ATR03",
						"attributeDesc": "Division",
						// "attributeDetailsGuid": "e3b54ff6-9b08-43b0-a91c-ccc6036810fd",
						// "attributeDetailsGuid": "b3857ec1-4058-462e-842d-d88f85087b69",
						"attributeDetailsGuid": attributeDetails[2].attributeDetailsGuid,
						"domainCode": "cc",
						"isInclusion": true,
						"aliasName": "customAttribute1",
						"permissionObjectDetailsDos": [{
							"permissionObjectGuid": this.perid,
							// "attributeDetailsGuid": "e3b54ff6-9b08-43b0-a91c-ccc6036810fd",
							// "attributeDetailsGuid": "b3857ec1-4058-462e-842d-d88f85087b69",
							"attributeDetailsGuid": attributeDetails[2].attributeDetailsGuid,
							"attributeValue": "*",
							"attributeText": ""
						}]
					};
				}

				if (visibleData.ATR04visible && switchData.MaterialGrpSwitch) {
					/*	materialGrpTemp = [];
						materialGrpTemp.push("*");*/
					custNuAttr4 = {
						"attributeId": "ATR04",
						"attributeDesc": "Material Group",
						// "attributeDetailsGuid": "686d2593-3ba4-4ffa-a1e8-386c2fa66c78",
						// "attributeDetailsGuid": "072276f7-7847-46de-af1a-c065ca59731a",
						"attributeDetailsGuid": attributeDetails[3].attributeDetailsGuid,
						"domainCode": "cc",
						"isInclusion": true,
						"aliasName": "customAttribute1",
						"permissionObjectDetailsDos": [{
							"permissionObjectGuid": this.perid,
							// "attributeDetailsGuid": "686d2593-3ba4-4ffa-a1e8-386c2fa66c78",
							// "attributeDetailsGuid": "072276f7-7847-46de-af1a-c065ca59731a",
							"attributeDetailsGuid": attributeDetails[3].attributeDetailsGuid,
							"attributeValue": "*",
							"attributeText": ""
						}]
					};
				}

				if (visibleData.ATR11visible && switchData.MaterialGrpOneSwitch) {
					/*	materialGrpOneTemp = [];
						materialGrpOneTemp.push("*");*/
					custNuAttr5 = {
						"attributeId": "ATR11",
						"attributeDesc": "Material Group 1",
						// "attributeDetailsGuid": "16a3b281-a75c-4e87-8d28-28b1397e6045",
						// "attributeDetailsGuid": "0324bfea-8d38-4b4a-a80e-4afe1021b4a4",
						"attributeDetailsGuid": attributeDetails[10].attributeDetailsGuid,
						"domainCode": "cc",
						"isInclusion": true,
						"aliasName": "customAttribute1",
						"permissionObjectDetailsDos": [{
							"permissionObjectGuid": this.perid,
							// "attributeDetailsGuid": "16a3b281-a75c-4e87-8d28-28b1397e6045",
							// "attributeDetailsGuid": "0324bfea-8d38-4b4a-a80e-4afe1021b4a4",
							"attributeDetailsGuid": attributeDetails[10].attributeDetailsGuid,
							"attributeValue": "*",
							"attributeText": ""
						}]
					};
				}

				if (visibleData.ATR05visible && switchData.MaterialGrp4Switch) {
					/*materialGrp4Temp = [];
					materialGrp4Temp.push("*");*/
					custNuAttr7 = {
						"attributeId": "ATR05",
						"attributeDesc": "Material Group 4",
						// "attributeDetailsGuid": "2da6d510-80f4-4773-8c87-80287ab41526",
						// "attributeDetailsGuid": "80709c4b-3273-4bec-91a1-42e47161a17a",
						"attributeDetailsGuid": attributeDetails[4].attributeDetailsGuid,
						"domainCode": "cc",
						"isInclusion": true,
						"aliasName": "customAttribute1",
						"permissionObjectDetailsDos": [{
							"permissionObjectGuid": this.perid,
							// "attributeDetailsGuid": "2da6d510-80f4-4773-8c87-80287ab41526",
							// "attributeDetailsGuid": "80709c4b-3273-4bec-91a1-42e47161a17a",
							"attributeDetailsGuid": attributeDetails[4].attributeDetailsGuid,
							"attributeValue": "*",
							"attributeText": ""
						}]
					};
				}

				if (visibleData.ATR09visible && switchData.PlantSwitch) {
					custNuAttr8 = {
						"attributeId": "ATR09",
						"attributeDesc": "Plant",
						// "attributeDetailsGuid": "748199bd-b84a-4a63-8fa2-874b2935c510",
						// "attributeDetailsGuid": "666771cd-edf5-48f9-9214-b7851b59ab3b",
						"attributeDetailsGuid": attributeDetails[8].attributeDetailsGuid,
						"domainCode": "cc",
						"isInclusion": true,
						"aliasName": "customAttribute1",
						"permissionObjectDetailsDos": [{
							"permissionObjectGuid": this.perid,
							// "attributeDetailsGuid": "748199bd-b84a-4a63-8fa2-874b2935c510",
							// "attributeDetailsGuid": "666771cd-edf5-48f9-9214-b7851b59ab3b",
							"attributeDetailsGuid": attributeDetails[8].attributeDetailsGuid,
							"attributeValue": "*",
							"attributeText": ""
						}]
					};
				}
				if (visibleData.ATR29visible && switchData.CountrySwitch) {
					custNuAttr10 = {
						"attributeId": "ATR29",
						"attributeDesc": "Country",
						// "attributeDetailsGuid": "20fecf50-7ee4-4fd2-824b-a1335261ffe1",
						// "attributeDetailsGuid": "1b893006-7a8b-4797-8d93-91ff7164065d",
						"attributeDetailsGuid": attributeDetails[28].attributeDetailsGuid,
						"domainCode": "cc",
						"isInclusion": true,
						"aliasName": "customAttribute1",
						"permissionObjectDetailsDos": [{
							"permissionObjectGuid": this.perid,
							// "attributeDetailsGuid": "20fecf50-7ee4-4fd2-824b-a1335261ffe1",
							// "attributeDetailsGuid": "1b893006-7a8b-4797-8d93-91ff7164065d",
							"attributeDetailsGuid": attributeDetails[28].attributeDetailsGuid,
							"attributeValue": "*",
							"attributeText": ""
						}]
					};
				}
				if (visibleData.ATR08visible && switchData.OrderTypeSwitch) {
					custNuAttr11 = {
						"attributeId": "ATR08",
						"attributeDesc": "Order Type",
						// "attributeDetailsGuid": "680e944e-be2f-4939-b49e-3bf78007cdae",
						// "attributeDetailsGuid": "4bf4f63c-b61c-4903-bf50-c2c94de50abc",
						"attributeDetailsGuid": attributeDetails[7].attributeDetailsGuid,
						"domainCode": "cc",
						"isInclusion": true,
						"aliasName": "customAttribute1",
						"permissionObjectDetailsDos": [{
							"permissionObjectGuid": this.perid,
							// "attributeDetailsGuid": "680e944e-be2f-4939-b49e-3bf78007cdae",
							// "attributeDetailsGuid": "4bf4f63c-b61c-4903-bf50-c2c94de50abc"
							"attributeDetailsGuid": attributeDetails[7].attributeDetailsGuid,
							"attributeValue": "*",
							"attributeText": ""
						}]
					};
				}
				if (visibleData.ATR10visible && switchData.StorageLocSwitch) {
					custNuAttr9 = {
						"attributeId": "ATR10",
						"attributeDesc": "Storage Location",
						// "attributeDetailsGuid": "9fe7dbb1-7375-4835-804d-0174c098117f",
						// "attributeDetailsGuid": "9e26dae3-4dc4-4ed3-83e0-94312c3b5ec9",
						"attributeDetailsGuid": attributeDetails[9].attributeDetailsGuid,
						"domainCode": "cc",
						"isInclusion": true,
						"aliasName": "customAttribute1",
						"permissionObjectDetailsDos": [{
							"permissionObjectGuid": this.perid,
							// "attributeDetailsGuid": "9fe7dbb1-7375-4835-804d-0174c098117f",
							// "attributeDetailsGuid": "9e26dae3-4dc4-4ed3-83e0-94312c3b5ec9",
							"attributeDetailsGuid": attributeDetails[9].attributeDetailsGuid,
							"attributeValue": "*",
							"attributeText": ""
						}]
					};
				}
				if (visibleData.ATR12visible && switchData.MatGrp2Switch) {
					/*materialGrp4Temp = [];
					materialGrp4Temp.push("*");*/
					custNuAttr12 = {
						"attributeId": "ATR12",
						"attributeDesc": "Material Group 2",
						// "attributeDetailsGuid": "d07fd2b4-7a05-42da-b80c-cf5cd7072d73",
						// "attributeDetailsGuid": "00361c67-4176-4ef1-b971-0f4d523e1bdf",
						"attributeDetailsGuid": attributeDetails[11].attributeDetailsGuid,
						"domainCode": "cc",
						"isInclusion": true,
						"aliasName": "customAttribute1",
						"permissionObjectDetailsDos": [{
							"permissionObjectGuid": this.perid,
							// "attributeDetailsGuid": "d07fd2b4-7a05-42da-b80c-cf5cd7072d73",
							// "attributeDetailsGuid": "00361c67-4176-4ef1-b971-0f4d523e1bdf",
							"attributeDetailsGuid": attributeDetails[11].attributeDetailsGuid,
							"attributeValue": "*",
							"attributeText": ""
						}]
					};
				}

				if (visibleData.ATR13visible && switchData.MatGrp3Switch) {
					/*materialGrp4Temp = [];
					materialGrp4Temp.push("*");*/
					custNuAttr13 = {
						"attributeId": "ATR13",
						"attributeDesc": "Material Group 3",
						// "attributeDetailsGuid": "6bcaa32d-43cd-4bf0-aa78-e2398fa15987",
						// "attributeDetailsGuid": "32663f15-0cdc-41ca-aadf-f309426a1c2d",
						"attributeDetailsGuid": attributeDetails[12].attributeDetailsGuid,
						"domainCode": "cc",
						"isInclusion": true,
						"aliasName": "customAttribute1",
						"permissionObjectDetailsDos": [{
							"permissionObjectGuid": this.perid,
							// "attributeDetailsGuid": "6bcaa32d-43cd-4bf0-aa78-e2398fa15987",
							// "attributeDetailsGuid": "32663f15-0cdc-41ca-aadf-f309426a1c2d",
							"attributeDetailsGuid": attributeDetails[12].attributeDetailsGuid,
							"attributeValue": "*",
							"attributeText": ""
						}]
					};
				}
				if (visibleData.ATR14visible && switchData.MatGrp5Switch) {
					/*materialGrp4Temp = [];
					materialGrp4Temp.push("*");*/
					custNuAttr14 = {
						"attributeId": "ATR14",
						"attributeDesc": "Material Group 5",
						// "attributeDetailsGuid": "825e85ff-2221-4dca-a41f-37ee8bf138e4",
						// "attributeDetailsGuid": "33c2d687-181d-400d-934e-89a94009e20c",
						"attributeDetailsGuid": attributeDetails[13].attributeDetailsGuid,
						"domainCode": "cc",
						"isInclusion": true,
						"aliasName": "customAttribute1",
						"permissionObjectDetailsDos": [{
							"permissionObjectGuid": this.perid,
							// "attributeDetailsGuid": "825e85ff-2221-4dca-a41f-37ee8bf138e4",
							// "attributeDetailsGuid": "33c2d687-181d-400d-934e-89a94009e20c",
							"attributeDetailsGuid": attributeDetails[13].attributeDetailsGuid,
							"attributeValue": "*",
							"attributeText": ""
						}]
					};
				}
				if (visibleData.ATR15visible && switchData.ProdHierarchy1Switch) {
					/*materialGrp4Temp = [];
					materialGrp4Temp.push("*");*/
					custNuAttr15 = {
						"attributeId": "ATR15",
						"attributeDesc": "Product hierarchy 1",
						// "attributeDetailsGuid": "1be1c0ad-aeea-4f0f-8b6a-64cb2ce23bae",
						// "attributeDetailsGuid": "e6bc7d1b-071d-414d-8dc0-b968dfa5f81a",
						"attributeDetailsGuid": attributeDetails[14].attributeDetailsGuid,
						"domainCode": "cc",
						"isInclusion": true,
						"aliasName": "customAttribute1",
						"permissionObjectDetailsDos": [{
							"permissionObjectGuid": this.perid,
							// "attributeDetailsGuid": "1be1c0ad-aeea-4f0f-8b6a-64cb2ce23bae",
							// "attributeDetailsGuid": "e6bc7d1b-071d-414d-8dc0-b968dfa5f81a",
							"attributeDetailsGuid": attributeDetails[14].attributeDetailsGuid,
							"attributeValue": "*",
							"attributeText": ""
						}]
					};
				}
				if (visibleData.ATR16visible && switchData.ProdHierarchy2Switch) {
					/*materialGrp4Temp = [];
					materialGrp4Temp.push("*");*/
					custNuAttr16 = {
						"attributeId": "ATR16",
						"attributeDesc": "Product hierarchy 2",
						// "attributeDetailsGuid": "d2020c36-9be1-427d-8844-32f86fda59cd",
						// "attributeDetailsGuid": "aac021f3-edb1-4ab2-bcaa-884454377fbb",
						"attributeDetailsGuid": attributeDetails[15].attributeDetailsGuid,
						"domainCode": "cc",
						"isInclusion": true,
						"aliasName": "customAttribute1",
						"permissionObjectDetailsDos": [{
							"permissionObjectGuid": this.perid,
							// "attributeDetailsGuid": "d2020c36-9be1-427d-8844-32f86fda59cd",
							// "attributeDetailsGuid": "aac021f3-edb1-4ab2-bcaa-884454377fbb",
							"attributeDetailsGuid": attributeDetails[15].attributeDetailsGuid,
							"attributeValue": "*",
							"attributeText": ""
						}]
					};
				}
				if (visibleData.ATR17visible && switchData.ProdHierarchy3Switch) {
					/*materialGrp4Temp = [];
					materialGrp4Temp.push("*");*/
					custNuAttr17 = {
						"attributeId": "ATR17",
						"attributeDesc": "Product hierarchy 3",
						// "attributeDetailsGuid": "9fd58ee5-5bdc-45be-b21c-8305bc0df5ce",
						// "attributeDetailsGuid": "f04befae-10cd-48a6-82de-c6effef652df",
						"attributeDetailsGuid": attributeDetails[16].attributeDetailsGuid,
						"domainCode": "cc",
						"isInclusion": true,
						"aliasName": "customAttribute1",
						"permissionObjectDetailsDos": [{
							"permissionObjectGuid": this.perid,
							// "attributeDetailsGuid": "9fd58ee5-5bdc-45be-b21c-8305bc0df5ce",
							// "attributeDetailsGuid": "f04befae-10cd-48a6-82de-c6effef652df",
							"attributeDetailsGuid": attributeDetails[16].attributeDetailsGuid,
							"attributeValue": "*",
							"attributeText": ""
						}]
					};
				}
				if (visibleData.ATR18visible && switchData.ProdHierarchy4Switch) {
					/*materialGrp4Temp = [];
					materialGrp4Temp.push("*");*/
					custNuAttr18 = {
						"attributeId": "ATR18",
						"attributeDesc": "Product hierarchy 4",
						// "attributeDetailsGuid": "0c8b2093-1841-4ed9-8b38-d5e0d7699ce0",
						// "attributeDetailsGuid": "4a2341a2-791c-434b-9b5f-3bc460cb8387",
						"attributeDetailsGuid": attributeDetails[17].attributeDetailsGuid,
						"domainCode": "cc",
						"isInclusion": true,
						"aliasName": "customAttribute1",
						"permissionObjectDetailsDos": [{
							"permissionObjectGuid": this.perid,
							// "attributeDetailsGuid": "0c8b2093-1841-4ed9-8b38-d5e0d7699ce0",
							// "attributeDetailsGuid": "4a2341a2-791c-434b-9b5f-3bc460cb8387",
							"attributeDetailsGuid": attributeDetails[17].attributeDetailsGuid,
							"attributeValue": "*",
							"attributeText": ""
						}]
					};
				}
				if (visibleData.ATR19visible && switchData.ProdHierarchy5Switch) {
					/*materialGrp4Temp = [];
					materialGrp4Temp.push("*");*/
					custNuAttr19 = {
						"attributeId": "ATR19",
						"attributeDesc": "Product hierarchy 5",
						// "attributeDetailsGuid": "88b446c9-481d-432a-8b2d-1dc5f6b546aa",
						// "attributeDetailsGuid": "c0dcba57-6e89-4f06-a012-5ff991e35854",
						"attributeDetailsGuid": attributeDetails[18].attributeDetailsGuid,
						"domainCode": "cc",
						"isInclusion": true,
						"aliasName": "customAttribute1",
						"permissionObjectDetailsDos": [{
							"permissionObjectGuid": this.perid,
							// "attributeDetailsGuid": "88b446c9-481d-432a-8b2d-1dc5f6b546aa",
							// "attributeDetailsGuid": "c0dcba57-6e89-4f06-a012-5ff991e35854",
							"attributeDetailsGuid": attributeDetails[18].attributeDetailsGuid,
							"attributeValue": "*",
							"attributeText": ""
						}]
					};
				}
				if (visibleData.ATR20visible && switchData.ProdHierarchy6Switch) {
					/*materialGrp4Temp = [];
					materialGrp4Temp.push("*");*/
					custNuAttr20 = {
						"attributeId": "ATR20",
						"attributeDesc": "Product hierarchy 6",
						// "attributeDetailsGuid": "b033d5d5-e072-47f4-86a4-00d040b8719c",
						// "attributeDetailsGuid": "c8b278f2-d085-49b3-bd55-e703a9907520",
						"attributeDetailsGuid": attributeDetails[19].attributeDetailsGuid,
						"domainCode": "cc",
						"isInclusion": true,
						"aliasName": "customAttribute1",
						"permissionObjectDetailsDos": [{
							"permissionObjectGuid": this.perid,
							// "attributeDetailsGuid": "b033d5d5-e072-47f4-86a4-00d040b8719c",
							// "attributeDetailsGuid": "c8b278f2-d085-49b3-bd55-e703a9907520",
							"attributeDetailsGuid": attributeDetails[19].attributeDetailsGuid,
							"attributeValue": "*",
							"attributeText": ""
						}]
					};
				}
				if (visibleData.ATR21visible && switchData.ProdHierarchy7Switch) {
					/*materialGrp4Temp = [];
					materialGrp4Temp.push("*");*/
					custNuAttr21 = {
						"attributeId": "ATR21",
						"attributeDesc": "Product hierarchy 7",
						// "attributeDetailsGuid": "f68c5793-3c8e-48f0-83c4-3991474d373b",
						// "attributeDetailsGuid": "7981c4f7-0fdb-48ff-ac99-989b46fe6d5c",
						"attributeDetailsGuid": attributeDetails[20].attributeDetailsGuid,
						"domainCode": "cc",
						"isInclusion": true,
						"aliasName": "customAttribute1",
						"permissionObjectDetailsDos": [{
							"permissionObjectGuid": this.perid,
							// "attributeDetailsGuid": "f68c5793-3c8e-48f0-83c4-3991474d373b",
							// "attributeDetailsGuid": "7981c4f7-0fdb-48ff-ac99-989b46fe6d5c",
							"attributeDetailsGuid": attributeDetails[20].attributeDetailsGuid,
							"attributeValue": "*",
							"attributeText": ""
						}]
					};
				}
				if (visibleData.ATR22visible && switchData.CustomerGrpSwitch) {
					/*materialGrp4Temp = [];
					materialGrp4Temp.push("*");*/
					custNuAttr22 = {
						"attributeId": "ATR22",
						"attributeDesc": "Customer Group",
						// "attributeDetailsGuid": "b6e26e5e-f670-488a-85bf-173a0c2fec82",
						// "attributeDetailsGuid": "391baef4-fc5b-4e9a-908f-d75d0003c11d",
						"attributeDetailsGuid": attributeDetails[21].attributeDetailsGuid,
						"domainCode": "cc",
						"isInclusion": true,
						"aliasName": "customAttribute1",
						"permissionObjectDetailsDos": [{
							"permissionObjectGuid": this.perid,
							// "attributeDetailsGuid": "b6e26e5e-f670-488a-85bf-173a0c2fec82",
							// "attributeDetailsGuid": "391baef4-fc5b-4e9a-908f-d75d0003c11d",
							"attributeDetailsGuid": attributeDetails[21].attributeDetailsGuid,
							"attributeValue": "*",
							"attributeText": ""
						}]
					};
				}
				if (visibleData.ATR23visible && switchData.CustomerGrp1Switch) {
					/*materialGrp4Temp = [];
					materialGrp4Temp.push("*");*/
					custNuAttr23 = {
						"attributeId": "ATR23",
						"attributeDesc": "Customer Group 1",
						// "attributeDetailsGuid": "1d0d7096-f4da-4080-a946-dcb0fed8e55b",
						// "attributeDetailsGuid": "1d984648-42f6-41b2-a9c2-ddb72b6f8e60",
						"attributeDetailsGuid": attributeDetails[22].attributeDetailsGuid,
						"domainCode": "cc",
						"isInclusion": true,
						"aliasName": "customAttribute1",
						"permissionObjectDetailsDos": [{
							"permissionObjectGuid": this.perid,
							// "attributeDetailsGuid": "1d0d7096-f4da-4080-a946-dcb0fed8e55b",
							// "attributeDetailsGuid": "1d984648-42f6-41b2-a9c2-ddb72b6f8e60",
							"attributeDetailsGuid": attributeDetails[22].attributeDetailsGuid,
							"attributeValue": "*",
							"attributeText": ""
						}]
					};
				}
				if (visibleData.ATR24visible && switchData.CustomerGrp2Switch) {
					/*materialGrp4Temp = [];
					materialGrp4Temp.push("*");*/
					custNuAttr24 = {
						"attributeId": "ATR24",
						"attributeDesc": "Customer Group 2",
						// "attributeDetailsGuid": "51612f4d-85e1-4f57-9665-ba76bb6fbddd",
						// "attributeDetailsGuid": "7f61ca91-4e1c-4fdc-8d3d-ea0238bc9c82",
						"attributeDetailsGuid": attributeDetails[23].attributeDetailsGuid,
						"domainCode": "cc",
						"isInclusion": true,
						"aliasName": "customAttribute1",
						"permissionObjectDetailsDos": [{
							"permissionObjectGuid": this.perid,
							// "attributeDetailsGuid": "51612f4d-85e1-4f57-9665-ba76bb6fbddd",
							// "attributeDetailsGuid": "7f61ca91-4e1c-4fdc-8d3d-ea0238bc9c82",
							"attributeDetailsGuid": attributeDetails[23].attributeDetailsGuid,
							"attributeValue": "*",
							"attributeText": ""
						}]
					};
				}
				if (visibleData.ATR25visible && switchData.CustomerGrp3Switch) {
					/*materialGrp4Temp = [];
					materialGrp4Temp.push("*");*/
					custNuAttr25 = {
						"attributeId": "ATR25",
						"attributeDesc": "Customer Group 3",
						// "attributeDetailsGuid": "72d8d8ab-99bc-4412-83d9-4c11705b7418",
						// "attributeDetailsGuid": "ebf2c5bc-3fe0-4099-b6bd-fc810f404726",
						"attributeDetailsGuid": attributeDetails[24].attributeDetailsGuid,
						"domainCode": "cc",
						"isInclusion": true,
						"aliasName": "customAttribute1",
						"permissionObjectDetailsDos": [{
							"permissionObjectGuid": this.perid,
							// "attributeDetailsGuid": "72d8d8ab-99bc-4412-83d9-4c11705b7418",
							// "attributeDetailsGuid": "ebf2c5bc-3fe0-4099-b6bd-fc810f404726",
							"attributeDetailsGuid": attributeDetails[24].attributeDetailsGuid,
							"attributeValue": "*",
							"attributeText": ""
						}]
					};
				}
				if (visibleData.ATR26visible && switchData.CustomerGrp4Switch) {
					/*materialGrp4Temp = [];
					materialGrp4Temp.push("*");*/
					custNuAttr26 = {
						"attributeId": "ATR26",
						"attributeDesc": "Customer Group 4",
						// "attributeDetailsGuid": "6112900f-9a00-4238-87f7-60fdd0ccc1ec",
						// "attributeDetailsGuid": "a7aedf3d-e7c0-4f6a-bbf9-78894b128fce",
						"attributeDetailsGuid": attributeDetails[25].attributeDetailsGuid,
						"domainCode": "cc",
						"isInclusion": true,
						"aliasName": "customAttribute1",
						"permissionObjectDetailsDos": [{
							"permissionObjectGuid": this.perid,
							// "attributeDetailsGuid": "6112900f-9a00-4238-87f7-60fdd0ccc1ec",
							// "attributeDetailsGuid": "a7aedf3d-e7c0-4f6a-bbf9-78894b128fce",
							"attributeDetailsGuid": attributeDetails[25].attributeDetailsGuid,
							"attributeValue": "*",
							"attributeText": ""
						}]
					};
				}
				if (visibleData.ATR27visible && switchData.CustomerGrp5Switch) {
					/*materialGrp4Temp = [];
					materialGrp4Temp.push("*");*/
					custNuAttr27 = {
						"attributeId": "ATR27",
						"attributeDesc": "Customer Group 5",
						// "attributeDetailsGuid": "b85baf37-7eca-47f6-8c83-7ca808660f68",
						// "attributeDetailsGuid": "b429de78-5203-4b7e-ae75-077da35712b5",
						"attributeDetailsGuid": attributeDetails[26].attributeDetailsGuid,
						"domainCode": "cc",
						"isInclusion": true,
						"aliasName": "customAttribute1",
						"permissionObjectDetailsDos": [{
							"permissionObjectGuid": this.perid,
							// "attributeDetailsGuid": "b85baf37-7eca-47f6-8c83-7ca808660f68",
							// "attributeDetailsGuid": "b429de78-5203-4b7e-ae75-077da35712b5",
							"attributeDetailsGuid": attributeDetails[26].attributeDetailsGuid,
							"attributeValue": "*",
							"attributeText": ""
						}]
					};
				}
				if (visibleData.ATR28visible && switchData.District1Switch) {
					/*materialGrp4Temp = [];
					materialGrp4Temp.push("*");*/
					custNuAttr28 = {
						"attributeId": "ATR28",
						"attributeDesc": "District",
						// "attributeDetailsGuid": "633ec7b6-6a2e-4205-89f7-5da123028d85",
						// "attributeDetailsGuid": "cfccd6e9-56e4-4774-944c-104c9dc6fefe",
						"attributeDetailsGuid": attributeDetails[27].attributeDetailsGuid,
						"domainCode": "cc",
						"isInclusion": true,
						"aliasName": "customAttribute1",
						"permissionObjectDetailsDos": [{
							"permissionObjectGuid": this.perid,
							// "attributeDetailsGuid": "633ec7b6-6a2e-4205-89f7-5da123028d85",
							// "attributeDetailsGuid": "cfccd6e9-56e4-4774-944c-104c9dc6fefe",
							"attributeDetailsGuid": attributeDetails[27].attributeDetailsGuid,
							"attributeValue": "*",
							"attributeText": ""
						}]
					};
				}
				if (visibleData.ATR07visible && switchData.MaterialSwitch) {
					/*materialGrp4Temp = [];
					materialGrp4Temp.push("*");*/
					custNuAttr29 = {

						"attributeId": "ATR07",
						"attributeDesc": "Material",
						// "attributeDetailsGuid": "cb203a9e-1a62-465f-92c6-0f8b214cc580",
						// "attributeDetailsGuid": "1199db72-bce4-46dd-b017-14d572aaba97",
						"attributeDetailsGuid": attributeDetails[6].attributeDetailsGuid,
						"domainCode": "cc",
						"isInclusion": true,
						"aliasName": "customAttribute1",
						"permissionObjectDetailsDos": [{
							"permissionObjectGuid": this.perid,
							// "attributeDetailsGuid": "cb203a9e-1a62-465f-92c6-0f8b214cc580",
							// "attributeDetailsGuid": "1199db72-bce4-46dd-b017-14d572aaba97",
							"attributeDetailsGuid": attributeDetails[6].attributeDetailsGuid,
							"attributeValue": "*",
							"attributeText": ""
						}]

					};
				}

				if ((visibleData.ATR01visible && saleOrgAttr1.length === 0) || (visibleData.ATR02visible && custNuAttr2.length === 0) || (
						visibleData.ATR03visible && custNuAttr3.length === 0) || (visibleData.ATR04visible && custNuAttr4.length === 0) ||
					(visibleData.ATR11visible && custNuAttr5.length ===
						0) ||
					(visibleData.ATR06visible && custNuAttr6.length === 0) || (visibleData.ATR05visible && custNuAttr7.length === 0) || (visibleData
						.ATR09visible && custNuAttr8.length === 0) || (visibleData.ATR10visible && custNuAttr9.length === 0) || (visibleData.ATR29visible &&
						custNuAttr10.length ===
						0) ||
					(visibleData.ATR08visible && custNuAttr11.length === 0) || (visibleData.ATR12visible && custNuAttr12.length === 0) || (
						visibleData.ATR13visible && custNuAttr13.length === 0) || (visibleData.ATR14visible && custNuAttr14.length === 0) ||
					(visibleData.ATR15visible && custNuAttr15.length ===
						0) ||
					(visibleData.ATR16visible && custNuAttr16.length === 0) || (visibleData.ATR17visible && custNuAttr17.length === 0) || (
						visibleData.ATR18visible && custNuAttr18.length === 0) || (visibleData.ATR19visible && custNuAttr19.length === 0) ||
					(visibleData.ATR20visible && custNuAttr20.length ===
						0) ||
					(visibleData.ATR21visible && custNuAttr21.length === 0) || (visibleData.ATR22visible && custNuAttr22.length === 0) || (
						visibleData.ATR23visible && custNuAttr23.length === 0) || (visibleData.ATR24visible && custNuAttr24.length === 0) ||
					(visibleData.ATR25visible && custNuAttr25.length ===
						0) ||
					(visibleData.ATR26visible && custNuAttr26.length === 0) || (visibleData.ATR27visible && custNuAttr27.length === 0) || (
						visibleData.ATR28visible && custNuAttr28.length === 0) || (visibleData.ATR07visible && custNuAttr29.length === 0)) {
					sap.m.MessageBox.error("Provide value to all attributes");
					return;
				}

				finalCreatePOArr = finalCreatePOArr.concat(saleOrgAttr1).concat(custNuAttr2).concat(custNuAttr3).concat(custNuAttr4).concat(
					custNuAttr5).concat(custNuAttr6).concat(custNuAttr7).concat(custNuAttr8).concat(custNuAttr9).concat(custNuAttr10).concat(
					custNuAttr11).concat(
					custNuAttr12).concat(custNuAttr13).concat(custNuAttr14).concat(custNuAttr15).concat(custNuAttr16).concat(custNuAttr17).concat(
					custNuAttr18).concat(custNuAttr19).concat(
					custNuAttr20).concat(custNuAttr21).concat(custNuAttr22).concat(custNuAttr23).concat(custNuAttr24).concat(custNuAttr25).concat(
					custNuAttr26).concat(
					custNuAttr27).concat(custNuAttr28).concat(custNuAttr29);
				// var permDesc = this.getView().getModel("detModel").getData()[0].permissionId.desc;
				// $.each(finalCreatePOArr, function () {
				// 	this.permissionDesc = permDesc;
				// });
				// $.each(finalCreatePOArr, function () {
				// 	this.createdBy = userName;
				// });

				finalCreatePOArr = JSON.stringify(finalCreatePOArr);

				jQuery.ajax({
					type: "GET",
					data: this.salesHdrData,
					contentType: "application/json",
					url: "/DKSHJavaService/permissionObject/findUsersCountById/" + this.perid,
					dataType: "json",
					async: false,
					success: function (jqXHR, textStatus, res) {
						// if (res.status == 204) {
						// usersLength = jqXHR.length;
						// userAssignedMdl.setData(jqXHR);
						// busyDialog.open();
						if (jqXHR) {
							var oDialog = new sap.m.Dialog({
								title: 'Confirm',
								type: 'Message',
								content: [new sap.m.Text({
									text: "This Permission Object is assigned to" + " " + jqXHR + " " + "user(s). Do you want to proceed?"
								}), new sap.m.Link({
									text: " View Assigned Users.",
									press: function (e) {
										that.displayAssignedUsers(that);
									}
								})],
								beginButton: new sap.m.Button({
									type: sap.m.ButtonType.Default,
									text: "Confirm",
									press: function () {
										// busyDialog.open();
										that._fnUpdateCall(that.permissionObjectText, finalCreatePOArr, that);
										oDialog.close();
									}
								}),
								endButton: new sap.m.Button({
									text: 'Cancel',
									press: function () {
										oDialog.close();
										// busyDialog.close();
									}
								}),
								afterClose: function () {
									oDialog.destroy();
								}
							});
							oDialog.open();
						} else {
							that._fnUpdateCall(that.permissionObjectText, finalCreatePOArr, that);
						}
					},
					error: function (jqXHR, textStatus, errorThrown) {
						sap.m.MessageBox.error("Error in Service");
					}
				});
			}
		},
		displayAssignedUsers: function (that) {
			jQuery.ajax({
				type: "GET",
				contentType: "application/json",
				url: "/DKSHJavaService/permissionObject/findUserDetailsById/" + this.perid,
				dataType: "json",
				async: false,
				success: function (data, textStatus, jqXHR) {
					var displayUserModel = new JSONModel();
					that.getView().setModel(displayUserModel, "displayUserModel");
					displayUserModel.setData(data);
					if (!that.userFrag) {
						that.userFrag = new sap.ui.xmlfragment("com.incture.cherrywork.newdac.fragments.displayAssignedUsers", that);
						that.getView().addDependent(that.userFrag)
					}
					that.userFrag.setModel(displayUserModel, "displayUserModel");
					that.userFrag.open()
				},
				error: function (error) {
					sap.m.MessageToast.show(error.responseText);
				}
			});
		},
		_fnUpdateCall: function (permissionObject, finalCreatePOArr, that) {
			var busyDialog = new sap.m.BusyDialog();
			busyDialog.open();
			jQuery.ajax({
				type: "PUT",
				data: finalCreatePOArr,
				contentType: "application/json",
				url: "/DKSHJavaService/permissionObjectDetails/updatePermisionObjectDetails",
				dataType: "json",
				async: false,
				success: function (jqXHR, textStatus, res) {
					busyDialog
					var successMsg = "Permission object" + " " + that.permissionObjectText + " " + "updated";
					sap.m.MessageToast.show(successMsg, {
						duration: 5000
					});
					busyDialog.close();
					that.getView().getModel("UpdateCreateIndModelViewSet").getData().EditableField = false;
					that.getView().getModel("UpdateCreateIndModelViewSet").refresh(true);
					var createMdlViewSet = that.getView().getModel("createMdlViewSet");
					createMdlViewSet.setData({
						EdtFldSO: false,
						EdtFldCus: false,
						EdtFldMN: false,
						EdtFldDisChnl: false,
						EdtFldMG: false,
						EdtFldMG1: false,
						EdtFldMG4: false,
						EdtFldDiv: false,
						EdtFldPlnt: false,
						EdtFldCntry: false,
						EdtFldOType: false,
						EdtFldStorLoc: false,
						EdtFldMG2: false,
						EdtFldMG3: false,
						EdtFldMG5: false,
						EdtFldPh1: false,
						EdtFldPh2: false,
						EdtFldPh3: false,
						EdtFldPh4: false,
						EdtFldPh5: false,
						EdtFldPh6: false,
						EdtFldPh7: false,
						EdtFldCG: false,
						EdtFldCG1: false,
						EdtFldCG2: false,
						EdtFldCG3: false,
						EdtFldCG4: false,
						EdtFldCG5: false,
						EdtFldDis1: false,
						EdtFldMat: false

					});
					that.getView().getModel("createMdlViewSet").refresh(true);
					that.getView().getModel("visibilityModel").setData({
						save: false,
						cancel: false,
						copy: true,
						edit: true,
						deletePO: true
					});
					that.getView().getModel("visibilityModel").refresh(true);
					that.expandOrCollapaseAllPanel(false);
				},
				error: function (jqXHR, textStatus, errorThrown) {
					var errorMsg = "Error in updating of Permission object" + " " + that.permissionObjectText;
					sap.m.MessageBox.error(errorMsg);
					busyDialog.close();
				}

			});
		},
		onPressCloseFrg: function (oEvent) {
			this.userFrag.close();
		},

		onDeletePO: function (oEvent) {
			var objName = this.permissionObjectText,
				pid = this.perid;
			var that = this;
			var arr = that.getOwnerComponent().getModel("aPOModel").getData();
			// var objName = this.getView().getModel("detModel").getData()[0].permissionId.desc;
			sap.m.MessageBox.confirm("Do you confirm to delete permission object - " + objName, {
				styleClass: "sapUiSizeCompact",
				actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
				initialFocus: MessageBox.Action.NO,
				onClose: function (oAction) {
					if (oAction === "YES") {
						jQuery.ajax({
							type: "GET",
							data: this.salesHdrData,
							contentType: "application/json",
							url: "/DKSHJavaService/permissionObject/findUsersCountById/" + pid,
							dataType: "json",
							async: false,
							success: function (jqXHR, textStatus, res) {
								if (jqXHR) {
									var oDialog = new sap.m.Dialog({
										title: 'Confirm',
										type: 'Message',
										content: [new sap.m.Text({
											text: "This Permission Object is assigned to" + " " + jqXHR + " " + "user(s). Do you want to proceed?"
										}), new sap.m.Link({
											text: " View Assigned Users.",
											press: function (e) {
												that.displayAssignedUsers(that);
											}
										})],
										beginButton: new sap.m.Button({
											type: sap.m.ButtonType.Default,
											text: "Confirm",
											press: function () {
												// busyDialog.open();
												that._fnDelete(pid, objName, that, arr);
												oDialog.close();
											}
										}),
										endButton: new sap.m.Button({
											text: 'Cancel',
											press: function () {
												oDialog.close();
												// busyDialog.close();
											}
										}),
										afterClose: function () {
											oDialog.destroy();
										}
									});
									oDialog.open();
								} else {
									that._fnDelete(pid, objName, that, arr);
								}
							},
							error: function (jqXHR, textStatus, errorThrown) {
								sap.m.MessageBox.error("Error in Service");
							}
						});
					}
				}
			});
			that.getView().getModel("detModel").refresh(true);
		},
		_fnDelete: function (pid, objName, that, arr) {
			var busyDialog = new sap.m.BusyDialog();
			busyDialog.open();
			jQuery.ajax({
				type: "DELETE",
				contentType: "application/json",
				url: "/DKSHJavaService/permissionObject/deleteById/" + pid,
				dataType: "json",
				async: false,
				success: function (data, textStatus, jqXHR) {
					if (data.status === "200 OK") {
						busyDialog.close();
						sap.m.MessageToast.show("permission object" + " " + objName + " " + "deleted.");
						for (var j = 0; j < arr.length; j++) {
							if (arr[j].permissionObjectText === objName) {
								arr.splice(j, 1);
							}
						}
						that.getOwnerComponent().getModel("aPOModel").setData(arr);
						that.getView().getModel("detModel").refresh(true);
						that.expandOrCollapaseAllPanel(false);
					}
				},
				error: function (error) {
					busyDialog.close();
					if (error.status == 200) {
						sap.m.MessageToast.show("permission object" + " " + objName + " " + "deleted.");
						for (var j = 0; j < arr.length; j++) {
							if (arr[j].permissionObjectText === objName) {
								arr.splice(j, 1);
							}
						}
						that.getOwnerComponent().getModel("aPOModel").setData(arr);
						that.getView().getModel("detModel").refresh(true);
						that.expandOrCollapaseAllPanel(false);
					} else {
						sap.m.MessageToast(error.responseText);
					}
				}
			});
		},
		// checkPOsUsers: function (pId) {
		// 	jQuery.ajax({
		// 		type: "GET",
		// 		data: this.salesHdrData,
		// 		contentType: "application/json",
		// 		url: "/DKSHJavaService/permissionObject/findUsersById/" + pId,
		// 		dataType: "json",
		// 		async: false,
		// 		success: function () {
		// 			jQuery.ajax({
		// 				type: "DELETE",
		// 				contentType: "application/json",
		// 				url: "/DKSHJavaService/permissionObject/deleteById/" + pid,
		// 				dataType: "json",
		// 				async: false,
		// 				success: function (data, textStatus, jqXHR) {
		// 					if (data.status === "200 OK") {
		// 						sap.m.MessageToast.show("permission object" + " " + objName + " " + "deleted.");
		// 						for (var j = 0; j < arr.length; j++) {
		// 							if (arr[j].permissionObjectText === objName) {
		// 								arr.splice(j, 1);
		// 							}
		// 						}
		// 						that.getOwnerComponent().getModel("aPOModel").setData(arr);
		// 						that.getView().getModel("detModel").refresh(true);
		// 						that.expandOrCollapaseAllPanel(false);

		// 					}
		// 				},
		// 				error: function (error) {
		// 					if (error.status == 200) {
		// 						sap.m.MessageToast.show("permission object" + " " + objName + " " + "deleted.");
		// 						for (var j = 0; j < arr.length; j++) {
		// 							if (arr[j].permissionObjectText === objName) {
		// 								arr.splice(j, 1);
		// 							}
		// 						}
		// 						that.getOwnerComponent().getModel("aPOModel").setData(arr);
		// 						that.getView().getModel("detModel").refresh(true);
		// 						that.expandOrCollapaseAllPanel(false);
		// 					}
		// 				}
		// 			});
		// 		},
		// 		error: function (error) {
		// 			if (error.responseText.includes("assign")) {
		// 				var oDialog = new sap.m.Dialog({
		// 					title: 'Do you want to Proceed?',
		// 					type: 'Message',
		// 					content: [new sap.m.Text({
		// 						text: error.responseText
		// 					})],
		// 					beginButton: new sap.m.Button({
		// 						type: sap.m.ButtonType.Default,
		// 						text: "Confirm",
		// 						press: function () {
		// 							// busyDialog.open();
		// 							jQuery.ajax({
		// 								type: "DELETE",
		// 								contentType: "application/json",
		// 								url: "/DKSHJavaService/permissionObject/deleteById/" + pid,
		// 								dataType: "json",
		// 								async: false,
		// 								success: function (data, textStatus, jqXHR) {
		// 									if (data.status === "200 OK") {
		// 										sap.m.MessageToast.show("permission object" + " " + objName + " " + "deleted.");
		// 										for (var j = 0; j < arr.length; j++) {
		// 											if (arr[j].permissionObjectText === objName) {
		// 												arr.splice(j, 1);
		// 											}
		// 										}
		// 										that.getOwnerComponent().getModel("aPOModel").setData(arr);
		// 										that.getView().getModel("detModel").refresh(true);
		// 										that.expandOrCollapaseAllPanel(false);

		// 									}
		// 								},
		// 								error: function (error) {
		// 									if (error.status == 200) {
		// 										sap.m.MessageToast.show("permission object" + " " + objName + " " + "deleted.");
		// 										for (var j = 0; j < arr.length; j++) {
		// 											if (arr[j].permissionObjectText === objName) {
		// 												arr.splice(j, 1);
		// 											}
		// 										}
		// 										that.getOwnerComponent().getModel("aPOModel").setData(arr);
		// 										that.getView().getModel("detModel").refresh(true);
		// 										that.expandOrCollapaseAllPanel(false);
		// 									}
		// 								}
		// 							});
		// 							oDialog.close();
		// 						}
		// 					}),
		// 					endButton: new sap.m.Button({
		// 						text: 'Cancel',
		// 						press: function () {
		// 							oDialog.close();
		// 							// busyDialog.close();
		// 						}

		// 					}),
		// 					afterClose: function () {
		// 						oDialog.destroy();
		// 					}
		// 				});
		// 			}
		// 		}
		// 	});
		// },

		onAddUserIds: function (oEvent) {
			this.getView().getModel().getData().users = this.getView().byId("imul").getSelectedKeys();
			this.getView().getModel().refresh(true);
		},

		onCancel: function (oEvent) {
			this.getView().getModel("UpdateCreateIndModelViewSet").getData().EditableField = false;
			this.getView().getModel("UpdateCreateIndModelViewSet").refresh(true);
			var createMdlViewSet = this.getView().getModel("createMdlViewSet");
			createMdlViewSet.setData({
				EdtFldSO: false,
				EdtFldCus: false,
				EdtFldMN: false,
				EdtFldDisChnl: false,
				EdtFldMG: false,
				EdtFldMG1: false,
				EdtFldMG4: false,
				EdtFldDiv: false,
				EdtFldPlnt: false,
				EdtFldCntry: false,
				EdtFldOType: false,
				EdtFldStorLoc: false,
				EdtFldMG2: false,
				EdtFldMG3: false,
				EdtFldMG5: false,
				EdtFldPh1: false,
				EdtFldPh2: false,
				EdtFldPh3: false,
				EdtFldPh4: false,
				EdtFldPh5: false,
				EdtFldPh6: false,
				EdtFldPh7: false,
				EdtFldCG: false,
				EdtFldCG1: false,
				EdtFldCG2: false,
				EdtFldCG3: false,
				EdtFldCG4: false,
				EdtFldCG5: false,
				EdtFldDis1: false,
				EdtFldMat: false,

			});
			this.getView().getModel("createMdlViewSet").refresh(true);
			this.getView().getModel("visibilityModel").setData({
				save: false,
				cancel: false,
				copy: true,
				edit: true,
				deletePO: true
			});
			this.getView().getModel("visibilityModel").refresh(true);
			this.expandOrCollapaseAllPanel(false);
		},

		onChangeSwitchforAll: function (oEvent) {
			var that = this;
			var msg = this.i18nModel.getProperty("AreYouSureWantGiveAllAccess");
			var msg1 = "are you sure you want to remove all access of all attributes? ";
			//oEvent
			if (oEvent.getParameters().state) {
				sap.m.MessageBox.confirm(
					msg, {
						actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
						initialFocus: MessageBox.Action.NO,
						onClose: function (oAction) {
							if (oAction === sap.m.MessageBox.Action.YES) {
								that.switchCount = 29;
								var tblModel = that.getView().byId("ID_TBL_VIEW_PROV_SELS_ORG").getModel("SlaesOrgViewSet");
								tblModel.getData().results.permissionObjectDetailsDos = [];
								tblModel.refresh();
								var msg1 = that.i18nModel.getProperty("salesOrganizationCountLbl");
								that.getView().byId("ID_PROV_LBL_C_SALS_ORG").setText(msg1 + " (0)");
								var mdl = that.getView().getModel("SwitchOnOffSet");
								var model = mdl.getData();
								model.SalesOrgSwitch = true;
								mdl.refresh();

								var tblModel = that.getView().byId("ID_TBL_VIEW_PROV_DISTRU_CHANL").getModel("DistributionChannelViewSet");
								tblModel.getData().results.permissionObjectDetailsDos = [];
								tblModel.refresh();
								var msg1 = that.i18nModel.getProperty("distributionChannelCountLbl");
								that.getView().byId("ID_PROV_LBL_C_DISTRI_CHNL").setText(msg1 + " (0)");
								var mdl = that.getView().getModel("SwitchOnOffSet");
								var model = mdl.getData();
								model.DistribuChanlSwitch = true;
								mdl.refresh();

								var tblModel = that.getView().byId("ID_TBL_VIEW_PROV_CUST_NUM").getModel("CustomerNumViewSet");
								tblModel.getData().results.permissionObjectDetailsDos = [];
								tblModel.refresh();
								var msg1 = that.i18nModel.getProperty("customerLblCount");
								that.getView().byId("ID_PROV_LBL_C_CUST_NUM").setText(msg1 + " (0)");

								var mdl = that.getView().getModel("SwitchOnOffSet");
								var model = mdl.getData();
								model.CustomerSwitch = true;
								mdl.refresh();

								var tblModel = that.getView().byId("ID_TBL_VIEW_PROV_MAT_GRP_").getModel("MaterialGrpViewSet");
								tblModel.getData().results.permissionObjectDetailsDos = [];
								tblModel.refresh();
								var msg1 = that.i18nModel.getProperty("materialGroupCountLbl");
								that.getView().byId("ID_PROV_LBL_C_MAT_GRP").setText(msg1 + " (0)");

								var mdl = that.getView().getModel("SwitchOnOffSet");
								var model = mdl.getData();
								model.MaterialGrpSwitch = true;
								mdl.refresh();

								var tblModel = that.getView().byId("ID_TBL_VIEW_PROV_MAT_GRP_ONE").getModel("MaterialGrpOneViewSet");
								tblModel.getData().results.permissionObjectDetailsDos = [];
								tblModel.refresh();
								var msg1 = that.i18nModel.getProperty("materialGroupOneCountLbl");
								that.getView().byId("ID_PROV_LBL_C_MAT_GRP_ONE").setText(msg1 + " (0)");

								var mdl = that.getView().getModel("SwitchOnOffSet");
								var model = mdl.getData();
								model.MaterialGrpOneSwitch = true;
								mdl.refresh();
								var tblModel = that.getView().byId("ID_TBL_VIEW_PROV_MAT_GRP_4").getModel("MaterialGrp4ViewSet");
								tblModel.getData().results.permissionObjectDetailsDos = [];
								tblModel.refresh();
								var msg1 = that.i18nModel.getProperty("materialGroup4CountLbl");
								that.getView().byId("ID_PROV_LBL_C_MAT_GRP_4").setText(msg1 + " (0)");

								var mdl = that.getView().getModel("SwitchOnOffSet");
								var model = mdl.getData();
								model.MaterialGrp4Switch = true;
								mdl.refresh();
								var tblModel = that.getView().byId("ID_TBL_VIEW_PROV_DISTRICT").getModel("DistrictViewSet");
								tblModel.getData().results.permissionObjectDetailsDos = [];
								tblModel.refresh();
								var msg1 = that.i18nModel.getProperty("distrcitCountLbl");
								that.getView().byId("ID_PROV_LBL_C_MAT_DISTRCT").setText(msg1 + " (0)");

								var mdl = that.getView().getModel("SwitchOnOffSet");
								var model = mdl.getData();
								model.DistrictSwitch = true;
								mdl.refresh();
								var tblModel = that.getView().byId("ID_TBL_VIEW_PROV_PLANT").getModel("PlantViewSet");
								tblModel.getData().results.permissionObjectDetailsDos = [];
								tblModel.refresh();
								var msg1 = that.i18nModel.getProperty("plantCountLbl");
								that.getView().byId("ID_PROV_LBL_C_MAT_PLANT").setText(msg1 + " (0)");

								var mdl = that.getView().getModel("SwitchOnOffSet");
								var model = mdl.getData();
								model.PlantSwitch = true;
								mdl.refresh();

								var tblModel = that.getView().byId("ID_TBL_VIEW_PROV_COUNTRY").getModel("CountryViewSet");
								tblModel.getData().results.permissionObjectDetailsDos = [];
								tblModel.refresh();
								var msg1 = that.i18nModel.getProperty("countryCountLbl");
								that.getView().byId("ID_PROV_LBL_C_COUNTRY").setText(msg1 + " (0)");

								var mdl = that.getView().getModel("SwitchOnOffSet");
								var model = mdl.getData();
								model.CountrySwitch = true;
								mdl.refresh();
								var tblModel = that.getView().byId("ID_TBL_VIEW_PROV_STORLOC").getModel("StorLocViewSet");
								tblModel.getData().results.permissionObjectDetailsDos = [];
								tblModel.refresh();
								var msg1 = that.i18nModel.getProperty("storLocCountLbl");
								that.getView().byId("ID_PROV_LBL_C_MAT_STORLOC").setText(msg1 + " (0)");

								var mdl = that.getView().getModel("SwitchOnOffSet");
								var model = mdl.getData();
								model.StorageLocSwitch = true;
								mdl.refresh();

								var tblModel = that.getView().byId("ID_TBL_VIEW_PROV_ORDER").getModel("OrderTypeViewSet");
								tblModel.getData().results.permissionObjectDetailsDos = [];
								tblModel.refresh();
								var msg1 = that.i18nModel.getProperty("orderTypeCountLbl");
								that.getView().byId("ID_PROV_LBL_C_ORDER").setText(msg1 + " (0)");

								var mdl = that.getView().getModel("SwitchOnOffSet");
								var model = mdl.getData();
								model.OrderTypeSwitch = true;
								mdl.refresh();
								var tblModel = that.getView().byId("ID_TBL_VIEW_PROV_MAT_GRP_TWO").getModel("MaterialGrpTwoViewSet");
								tblModel.getData().results.permissionObjectDetailsDos = [];
								tblModel.refresh();
								var msg1 = that.i18nModel.getProperty("MatGrp2CountLbl");
								that.getView().byId("ID_PROV_LBL_C_MAT_GRP_TWO").setText(msg1 + " (0)");

								var mdl = that.getView().getModel("SwitchOnOffSet");
								var model = mdl.getData();
								model.MatGrp2Switch = true;
								mdl.refresh();

								var tblModel = that.getView().byId("ID_TBL_VIEW_PROV_MAT_GRP_THREE").getModel("MaterialGrpThreeViewSet");
								tblModel.getData().results.permissionObjectDetailsDos = [];
								tblModel.refresh();
								var msg1 = that.i18nModel.getProperty("MatGrp3CountLbl");
								that.getView().byId("ID_PROV_LBL_C_MAT_GRP_THREE").setText(msg1 + " (0)");

								var mdl = that.getView().getModel("SwitchOnOffSet");
								var model = mdl.getData();
								model.MatGrp3Switch = true;
								mdl.refresh();
								var tblModel = that.getView().byId("ID_TBL_VIEW_PROV_MAT_GRP_FIVE").getModel("MaterialGrpFiveViewSet");
								tblModel.getData().results.permissionObjectDetailsDos = [];
								tblModel.refresh();
								var msg1 = that.i18nModel.getProperty("MatGrp5CountLbl");
								that.getView().byId("ID_PROV_LBL_C_MAT_GRP_FIVE").setText(msg1 + " (0)");

								var mdl = that.getView().getModel("SwitchOnOffSet");
								var model = mdl.getData();
								model.MatGrp5Switch = true;
								mdl.refresh();
								var tblModel = that.getView().byId("ID_TBL_VIEW_PROV_PROD_HRCH_ONE").getModel("ProdHierarchy1ViewSet");
								tblModel.getData().results.permissionObjectDetailsDos = [];
								tblModel.refresh();
								var msg1 = that.i18nModel.getProperty("ProdHrch1CountLbl");
								that.getView().byId("ID_PROV_LBL_C_PROD_HRCH_ONE").setText(msg1 + " (0)");

								var mdl = that.getView().getModel("SwitchOnOffSet");
								var model = mdl.getData();
								model.ProdHierarchy1Switch = true;
								mdl.refresh();
								var tblModel = that.getView().byId("ID_TBL_VIEW_PROV_PROD_HRCH_TWO").getModel("ProdHierarchy2ViewSet");
								tblModel.getData().results.permissionObjectDetailsDos = [];
								tblModel.refresh();
								var msg1 = that.i18nModel.getProperty("ProdHrch2CountLbl");
								that.getView().byId("ID_PROV_LBL_C_PROD_HRCH_TWO").setText(msg1 + " (0)");

								var mdl = that.getView().getModel("SwitchOnOffSet");
								var model = mdl.getData();
								model.ProdHierarchy2Switch = true;
								mdl.refresh();

								var tblModel = that.getView().byId("ID_TBL_VIEW_PROV_PROD_HRCH_THREE").getModel("ProdHierarchy3ViewSet");
								tblModel.getData().results.permissionObjectDetailsDos = [];
								tblModel.refresh();
								var msg1 = that.i18nModel.getProperty("ProdHrch3CountLbl");
								that.getView().byId("ID_PROV_LBL_C_PROD_HRCH_THREE").setText(msg1 + " (0)");

								var mdl = that.getView().getModel("SwitchOnOffSet");
								var model = mdl.getData();
								model.ProdHierarchy3Switch = true;
								mdl.refresh();
								var tblModel = that.getView().byId("ID_TBL_VIEW_PROV_PROD_HRCH_FOUR").getModel("ProdHierarchy4ViewSet");
								tblModel.getData().results.permissionObjectDetailsDos = [];
								tblModel.refresh();
								var msg1 = that.i18nModel.getProperty("ProdHrch4CountLbl");
								that.getView().byId("ID_PROV_LBL_C_PROD_HRCH_FOUR").setText(msg1 + " (0)");

								var mdl = that.getView().getModel("SwitchOnOffSet");
								var model = mdl.getData();
								model.ProdHierarchy4Switch = true;
								mdl.refresh();
								var tblModel = that.getView().byId("ID_TBL_VIEW_PROV_PROD_HRCH_FIVE").getModel("ProdHierarchy5ViewSet");
								tblModel.getData().results.permissionObjectDetailsDos = [];
								tblModel.refresh();
								var msg1 = that.i18nModel.getProperty("ProdHrch5CountLbl");
								that.getView().byId("ID_PROV_LBL_C_PROD_HRCH_FIVE").setText(msg1 + " (0)");

								var mdl = that.getView().getModel("SwitchOnOffSet");
								var model = mdl.getData();
								model.ProdHierarchy5Switch = true;
								mdl.refresh();

								var tblModel = that.getView().byId("ID_TBL_VIEW_PROV_PROD_HRCH_SIX").getModel("ProdHierarchy6ViewSet");
								tblModel.getData().results.permissionObjectDetailsDos = [];
								tblModel.refresh();
								var msg1 = that.i18nModel.getProperty("ProdHrch6CountLbl");
								that.getView().byId("ID_PROV_LBL_C_PROD_HRCH_SIX").setText(msg1 + " (0)");

								var mdl = that.getView().getModel("SwitchOnOffSet");
								var model = mdl.getData();
								model.ProdHierarchy6Switch = true;
								mdl.refresh();

								var tblModel = that.getView().byId("ID_TBL_VIEW_PROV_PROD_HRCH_SEVEN").getModel("ProdHierarchy7ViewSet");
								tblModel.getData().results.permissionObjectDetailsDos = [];
								tblModel.refresh();
								var msg1 = that.i18nModel.getProperty("ProdHrch7CountLbl");
								that.getView().byId("ID_PROV_LBL_C_PROD_HRCH_SEVEN").setText(msg1 + " (0)");

								var mdl = that.getView().getModel("SwitchOnOffSet");
								var model = mdl.getData();
								model.ProdHierarchy7Switch = true;
								mdl.refresh();

								var tblModel = that.getView().byId("ID_TBL_VIEW_PROV_CUS_GRP").getModel("CusGrpViewSet");
								tblModel.getData().results.permissionObjectDetailsDos = [];
								tblModel.refresh();
								var msg1 = that.i18nModel.getProperty("CusGrpCountLbl");
								that.getView().byId("ID_PROV_LBL_C_CUS_GRP").setText(msg1 + " (0)");

								var mdl = that.getView().getModel("SwitchOnOffSet");
								var model = mdl.getData();
								model.CustomerGrpSwitch = true;
								mdl.refresh();

								var tblModel = that.getView().byId("ID_TBL_VIEW_PROV_CUS_GRP_ONE").getModel("CusGrp1ViewSet");
								tblModel.getData().results.permissionObjectDetailsDos = [];
								tblModel.refresh();
								var msg1 = that.i18nModel.getProperty("CusGrp1CountLbl");
								that.getView().byId("ID_PROV_LBL_C_CUS_GRP_ONE").setText(msg1 + " (0)");

								var mdl = that.getView().getModel("SwitchOnOffSet");
								var model = mdl.getData();
								model.CustomerGrp1Switch = true;
								mdl.refresh();

								var tblModel = that.getView().byId("ID_TBL_VIEW_PROV_CUS_GRP_TWO").getModel("CusGrp2ViewSet");
								tblModel.getData().results.permissionObjectDetailsDos = [];
								tblModel.refresh();
								var msg1 = that.i18nModel.getProperty("CusGrp2CountLbl");
								that.getView().byId("ID_PROV_LBL_C_CUS_GRP_TWO").setText(msg1 + " (0)");

								var mdl = that.getView().getModel("SwitchOnOffSet");
								var model = mdl.getData();
								model.CustomerGrp2Switch = true;
								mdl.refresh();
								var tblModel = that.getView().byId("ID_TBL_VIEW_PROV_CUS_GRP_THREE").getModel("CusGrp3ViewSet");
								tblModel.getData().results.permissionObjectDetailsDos = [];
								tblModel.refresh();
								var msg1 = that.i18nModel.getProperty("CusGrp3CountLbl");
								that.getView().byId("ID_PROV_LBL_C_CUS_GRP_THREE").setText(msg1 + " (0)");

								var mdl = that.getView().getModel("SwitchOnOffSet");
								var model = mdl.getData();
								model.CustomerGrp3Switch = true;
								mdl.refresh();

								var tblModel = that.getView().byId("ID_TBL_VIEW_PROV_CUS_GRP_FOUR").getModel("CusGrp4ViewSet");
								tblModel.getData().results.permissionObjectDetailsDos = [];
								tblModel.refresh();
								var msg1 = that.i18nModel.getProperty("CusGrp4CountLbl");
								that.getView().byId("ID_PROV_LBL_C_CUS_GRP_FOUR").setText(msg1 + " (0)");

								var mdl = that.getView().getModel("SwitchOnOffSet");
								var model = mdl.getData();
								model.CustomerGrp4Switch = true;
								mdl.refresh();

								var tblModel = that.getView().byId("ID_TBL_VIEW_PROV_CUS_GRP_FIVE").getModel("CusGrp5ViewSet");
								tblModel.getData().results.permissionObjectDetailsDos = [];
								tblModel.refresh();
								var msg1 = that.i18nModel.getProperty("CusGrp5CountLbl");
								that.getView().byId("ID_PROV_LBL_C_CUS_GRP_FIVE").setText(msg1 + " (0)");

								var mdl = that.getView().getModel("SwitchOnOffSet");
								var model = mdl.getData();
								model.CustomerGrp5Switch = true;
								mdl.refresh();
								var tblModel = that.getView().byId("ID_TBL_VIEW_PROV_DIST1").getModel("District1ViewSet");
								tblModel.getData().results.permissionObjectDetailsDos = [];
								tblModel.refresh();
								var msg1 = that.i18nModel.getProperty("District1CountLbl");
								that.getView().byId("ID_PROV_LBL_C_DIST1").setText(msg1 + " (0)");

								var mdl = that.getView().getModel("SwitchOnOffSet");
								var model = mdl.getData();
								model.District1Switch = true;
								mdl.refresh();

								var tblModel = that.getView().byId("ID_TBL_VIEW_PROV_MAT").getModel("MaterialViewSet");
								tblModel.getData().results.permissionObjectDetailsDos = [];
								tblModel.refresh();
								var msg1 = that.i18nModel.getProperty("MaterialCountLbl");
								that.getView().byId("ID_PROV_LBL_C_MAT").setText(msg1 + " (0)");

								var mdl = that.getView().getModel("SwitchOnOffSet");
								var model = mdl.getData();
								model.MaterialSwitch = true;
								mdl.refresh();
								that.getView().getModel("createMdlViewSet").getData().EdtFldSO = false;
								that.getView().getModel("createMdlViewSet").getData().EdtFldCus = false;
								that.getView().getModel("createMdlViewSet").getData().EdtFldMN = false;
								that.getView().getModel("createMdlViewSet").getData().EdtFldDisChnl = false;
								that.getView().getModel("createMdlViewSet").getData().EdtFldMG = false;
								that.getView().getModel("createMdlViewSet").getData().EdtFldMG1 = false;
								that.getView().getModel("createMdlViewSet").getData().EdtFldMG4 = false;
								that.getView().getModel("createMdlViewSet").getData().EdtFldDiv = false;
								that.getView().getModel("createMdlViewSet").getData().EdtFldPlnt = false;
								that.getView().getModel("createMdlViewSet").getData().EdtFldCntry = false;
								that.getView().getModel("createMdlViewSet").getData().EdtFldOType = false;
								that.getView().getModel("createMdlViewSet").getData().EdtFldStorLoc = false;
								that.getView().getModel("createMdlViewSet").getData().EdtFldMG2 = false;
								that.getView().getModel("createMdlViewSet").getData().EdtFldMG3 = false;
								that.getView().getModel("createMdlViewSet").getData().EdtFldMG5 = false;
								that.getView().getModel("createMdlViewSet").getData().EdtFldPh1 = false;
								that.getView().getModel("createMdlViewSet").getData().EdtFldPh2 = false;
								that.getView().getModel("createMdlViewSet").getData().EdtFldPh3 = false;
								that.getView().getModel("createMdlViewSet").getData().EdtFldPh4 = false;
								that.getView().getModel("createMdlViewSet").getData().EdtFldPh5 = false;
								that.getView().getModel("createMdlViewSet").getData().EdtFldPh6 = false;
								that.getView().getModel("createMdlViewSet").getData().EdtFldPh7 = false;
								that.getView().getModel("createMdlViewSet").getData().EdtFldCG = false;
								that.getView().getModel("createMdlViewSet").getData().EdtFldCG1 = false;
								that.getView().getModel("createMdlViewSet").getData().EdtFldCG2 = false;
								that.getView().getModel("createMdlViewSet").getData().EdtFldCG3 = false;
								that.getView().getModel("createMdlViewSet").getData().EdtFldCG4 = false;
								that.getView().getModel("createMdlViewSet").getData().EdtFldCG5 = false;
								that.getView().getModel("createMdlViewSet").getData().EdtFldDis1 = false;
								that.getView().getModel("createMdlViewSet").getData().EdtFldMat = false;
								that.getView().getModel("createMdlViewSet").refresh(true);

							} else {
								var mdl = that.getView().getModel("SwitchOnOffSet");
								var model = mdl.getData();
								model.AllSwitch = false;
								mdl.refresh();
							}
						}
					}
				);
			} else if (!oEvent.getParameters().state) {
				sap.m.MessageBox.confirm(
					msg1, {
						actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
						initialFocus: MessageBox.Action.NO,
						onClose: function (oAction) {
							if (oAction === sap.m.MessageBox.Action.YES) {
								that.switchCount = 0;
								var mdl = that.getView().getModel("SwitchOnOffSet");
								var model = mdl.getData();
								model.SalesOrgSwitch = false;

								model.CustomerSwitch = false;
								model.MaterialNumSwitch = false;
								model.DistribuChanlSwitch = false;
								model.MaterialGrpSwitch = false;
								model.MaterialGrpOneSwitch = false;
								model.MaterialGrp4Switch = false;
								model.DistrictSwitch = false;
								model.PlantSwitch = false;
								model.CountrySwitch = false;
								model.StorageLocSwitch = false;
								model.OrderTypeSwitch = false;
								model.MatGrp2Switch = false;
								model.MatGrp3Switch = false;
								model.MatGrp5Switch = false;
								model.ProdHierarchy1Switch = false;
								model.ProdHierarchy2Switch = false;
								model.ProdHierarchy3Switch = false;
								model.ProdHierarchy4Switch = false;
								model.ProdHierarchy5Switch = false;
								model.ProdHierarchy6Switch = false;
								model.ProdHierarchy7Switch = false;
								model.CustomerGrpSwitch = false;
								model.CustomerGrp1Switch = false;
								model.CustomerGrp2Switch = false;
								model.CustomerGrp3Switch = false;
								model.CustomerGrp4Switch = false;
								model.CustomerGrp5Switch = false;
								model.District1Switch = false;
								model.MaterialSwitch = false;
								mdl.refresh();
								that.getView().getModel("createMdlViewSet").getData().EdtFldSO = true;
								that.getView().getModel("createMdlViewSet").getData().EdtFldCus = true;
								that.getView().getModel("createMdlViewSet").getData().EdtFldMN = true;
								that.getView().getModel("createMdlViewSet").getData().EdtFldDisChnl = true;
								that.getView().getModel("createMdlViewSet").getData().EdtFldMG = true;
								that.getView().getModel("createMdlViewSet").getData().EdtFldMG1 = true;
								that.getView().getModel("createMdlViewSet").getData().EdtFldMG4 = true;
								that.getView().getModel("createMdlViewSet").getData().EdtFldDiv = true;
								that.getView().getModel("createMdlViewSet").getData().EdtFldPlnt = true;
								that.getView().getModel("createMdlViewSet").getData().EdtFldCntry = true;
								that.getView().getModel("createMdlViewSet").getData().EdtFldOType = true;
								that.getView().getModel("createMdlViewSet").getData().EdtFldStorLoc = true;
								that.getView().getModel("createMdlViewSet").getData().EdtFldMG2 = true;
								that.getView().getModel("createMdlViewSet").getData().EdtFldMG3 = true;
								that.getView().getModel("createMdlViewSet").getData().EdtFldMG5 = true;
								that.getView().getModel("createMdlViewSet").getData().EdtFldPh1 = true;
								that.getView().getModel("createMdlViewSet").getData().EdtFldPh2 = true;
								that.getView().getModel("createMdlViewSet").getData().EdtFldPh3 = true;
								that.getView().getModel("createMdlViewSet").getData().EdtFldPh4 = true;
								that.getView().getModel("createMdlViewSet").getData().EdtFldPh5 = true;
								that.getView().getModel("createMdlViewSet").getData().EdtFldPh6 = true;
								that.getView().getModel("createMdlViewSet").getData().EdtFldPh7 = true;
								that.getView().getModel("createMdlViewSet").getData().EdtFldCG = true;
								that.getView().getModel("createMdlViewSet").getData().EdtFldCG1 = true;
								that.getView().getModel("createMdlViewSet").getData().EdtFldCG2 = true;
								that.getView().getModel("createMdlViewSet").getData().EdtFldCG3 = true;
								that.getView().getModel("createMdlViewSet").getData().EdtFldCG4 = true;
								that.getView().getModel("createMdlViewSet").getData().EdtFldCG5 = true;
								that.getView().getModel("createMdlViewSet").getData().EdtFldDis1 = true;
								that.getView().getModel("createMdlViewSet").getData().EdtFldMat = true;
								that.getView().getModel("createMdlViewSet").refresh(true);
							} else {
								var mdl = that.getView().getModel("SwitchOnOffSet");
								var model = mdl.getData();
								model.AllSwitch = true;
								mdl.refresh();
							}
						}
					}
				);
			}
		},

		onChangeSwitchSalesOrganization: function (oEvent) {
			var that = this;
			var msg = this.i18nModel.getProperty("AreYouSureWantGiveAllAccess");
			//oEvent
			/*	if (oEvent.getParameters().state) {
					sap.m.MessageBox.confirm(
						msg, {
							actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
							onClose: function (oAction) {
								if (oAction === sap.m.MessageBox.Action.YES) {*/
			var tblModel = that.getView().byId("ID_TBL_VIEW_PROV_SELS_ORG").getModel("SlaesOrgViewSet");
			tblModel.getData().results.permissionObjectDetailsDos = [];
			tblModel.refresh();
			var msg1 = that.i18nModel.getProperty("salesOrganizationCountLbl");
			that.getView().byId("ID_PROV_LBL_C_SALS_ORG").setText(msg1 + " (0)");
			if (oEvent.getParameters().state) {
				that.getView().getModel("createMdlViewSet").getData().EdtFldSO = false;
				that.getView().getModel("createMdlViewSet").refresh(true);
				that.switchCount += 1;
				if (that.switchCount === 29) {
					var mdl = that.getView().getModel("SwitchOnOffSet");
					var model = mdl.getData();
					model.AllSwitch = true;
					mdl.refresh();
				}
			} else {
				that.switchCount -= 1;
				this.getView().getModel("createMdlViewSet").getData().EdtFldSO = true;
				this.getView().getModel("createMdlViewSet").refresh(true);
				var mdl = that.getView().getModel("SwitchOnOffSet");
				var model = mdl.getData();
				model.AllSwitch = false;
				mdl.refresh();
			}
			/*	} else {
								var mdl = that.getView().getModel("SwitchOnOffSet");
								var model = mdl.getData();
								model.SalesOrgSwitch = false;
								mdl.refresh();
							}
						}
					}
				);
			}*/
		},

		////for Customer Switch
		onChangeSwitchCustomerNumber: function (oEvent) {
			var that = this;
			var msg = this.i18nModel.getProperty("AreYouSureWantGiveAllAccess");
			//oEvent
			/*	if (oEvent.getParameters().state) {
					sap.m.MessageBox.confirm(
						msg, {
							actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
							onClose: function (oAction) {
								if (oAction === sap.m.MessageBox.Action.YES) {*/
			var tblModel = that.getView().byId("ID_TBL_VIEW_PROV_CUST_NUM").getModel("CustomerNumViewSet");
			tblModel.getData().results.permissionObjectDetailsDos = [];
			tblModel.refresh();
			var msg1 = that.i18nModel.getProperty("customerLblCount");
			that.getView().byId("ID_PROV_LBL_C_CUST_NUM").setText(msg1 + " (0)");
			if (oEvent.getParameters().state) {
				this.getView().getModel("createMdlViewSet").getData().EdtFldCus = false;
				this.getView().getModel("createMdlViewSet").refresh(true);
				that.switchCount += 1;
				if (that.switchCount === 29) {
					var mdl = that.getView().getModel("SwitchOnOffSet");
					var model = mdl.getData();
					model.AllSwitch = true;
					mdl.refresh();
				}
			} else {
				that.switchCount -= 1;
				this.getView().getModel("createMdlViewSet").getData().EdtFldCus = true;
				this.getView().getModel("createMdlViewSet").refresh(true);
				var mdl = that.getView().getModel("SwitchOnOffSet");
				var model = mdl.getData();
				model.AllSwitch = false;
				mdl.refresh();
			}
			/*	} else {
								var mdl = that.getView().getModel("SwitchOnOffSet");
								var model = mdl.getData();
								model.CustomerSwitch = false;
								mdl.refresh();
							}
						}
					}
				);
			}*/
		},

		////for Material Switch
		onChangeSwitchMaterialNo: function (oEvent) {
			var that = this;
			var msg = this.i18nModel.getProperty("AreYouSureWantGiveAllAccess");
			//oEvent
			/*	if (oEvent.getParameters().state) {
					sap.m.MessageBox.confirm(
						msg, {
							actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
							onClose: function (oAction) {
								if (oAction === sap.m.MessageBox.Action.YES) {*/
			var tblModel = that.getView().byId("ID_TBL_VIEW_PROV_MATERIAL_NUM").getModel("MaterialNumViewSet");
			tblModel.getData().results.permissionObjectDetailsDos = [];
			tblModel.refresh();
			var msg1 = that.i18nModel.getProperty("materialNumberCountLbl");
			that.getView().byId("ID_PROV_LBL_C_Mat_NUM").setText(msg1 + " (0)");
			if (oEvent.getParameters().state) {
				this.getView().getModel("createMdlViewSet").getData().EdtFldMN = false;
				this.getView().getModel("createMdlViewSet").refresh(true);
				that.switchCount += 1;
				if (that.switchCount === 29) {
					var mdl = that.getView().getModel("SwitchOnOffSet");
					var model = mdl.getData();
					model.AllSwitch = true;
					mdl.refresh();
				}
			} else {
				that.switchCount -= 1;
				this.getView().getModel("createMdlViewSet").getData().EdtFldMN = true;
				this.getView().getModel("createMdlViewSet").refresh(true);
				var mdl = that.getView().getModel("SwitchOnOffSet");
				var model = mdl.getData();
				model.AllSwitch = false;
				mdl.refresh();
			}
			/*	} else {
								var mdl = that.getView().getModel("SwitchOnOffSet");
								var model = mdl.getData();
								model.MaterialNumSwitch = false;
								mdl.refresh();
							}
						}
					}
				);
			}*/
		},

		////for Distribution channel Switch
		onChangeSwitchDistributionChanl: function (oEvent) {
			var that = this;
			var msg = this.i18nModel.getProperty("AreYouSureWantGiveAllAccess");
			//oEvent
			/*	if (oEvent.getParameters().state) {
					sap.m.MessageBox.confirm(
						msg, {
							actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
							onClose: function (oAction) {
								if (oAction === sap.m.MessageBox.Action.YES) {*/
			var tblModel = that.getView().byId("ID_TBL_VIEW_PROV_DISTRU_CHANL").getModel("DistributionChannelViewSet");
			tblModel.getData().results.permissionObjectDetailsDos = [];
			tblModel.refresh();
			var msg1 = that.i18nModel.getProperty("distributionChannelCountLbl");
			that.getView().byId("ID_PROV_LBL_C_DISTRI_CHNL").setText(msg1 + " (0)");
			if (oEvent.getParameters().state) {
				this.getView().getModel("createMdlViewSet").getData().EdtFldDisChnl = false;
				this.getView().getModel("createMdlViewSet").refresh(true);
				that.switchCount += 1;
				if (that.switchCount === 29) {
					var mdl = that.getView().getModel("SwitchOnOffSet");
					var model = mdl.getData();
					model.AllSwitch = true;
					mdl.refresh();
				}
			} else {
				that.switchCount -= 1;
				this.getView().getModel("createMdlViewSet").getData().EdtFldDisChnl = true;
				this.getView().getModel("createMdlViewSet").refresh(true);
				var mdl = that.getView().getModel("SwitchOnOffSet");
				var model = mdl.getData();
				model.AllSwitch = false;
				mdl.refresh();
			}
			/*} else {
								var mdl = that.getView().getModel("SwitchOnOffSet");
								var model = mdl.getData();
								model.DistribuChanlSwitch = false;
								mdl.refresh();
							}
						}
					}
				);
			}*/
		},

		////for Material Group Switch
		onChangeSwitchMaterialGroup: function (oEvent) {
			var that = this;
			var msg = this.i18nModel.getProperty("AreYouSureWantGiveAllAccess");
			//oEvent
			/*	if (oEvent.getParameters().state) {
					sap.m.MessageBox.confirm(
						msg, {
							actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
							onClose: function (oAction) {
								if (oAction === sap.m.MessageBox.Action.YES) {*/
			var tblModel = that.getView().byId("ID_TBL_VIEW_PROV_MAT_GRP_").getModel("MaterialGrpViewSet");
			tblModel.getData().results.permissionObjectDetailsDos = [];
			tblModel.refresh();
			var msg1 = that.i18nModel.getProperty("materialGroupCountLbl");
			that.getView().byId("ID_PROV_LBL_C_MAT_GRP").setText(msg1 + " (0)");
			if (oEvent.getParameters().state) {
				this.getView().getModel("createMdlViewSet").getData().EdtFldMG = false;
				this.getView().getModel("createMdlViewSet").refresh(true);
				that.switchCount += 1;
				if (that.switchCount === 29) {
					var mdl = that.getView().getModel("SwitchOnOffSet");
					var model = mdl.getData();
					model.AllSwitch = true;
					mdl.refresh();
				}
			} else {
				that.switchCount -= 1;
				this.getView().getModel("createMdlViewSet").getData().EdtFldMG = true;
				this.getView().getModel("createMdlViewSet").refresh(true);
				var mdl = that.getView().getModel("SwitchOnOffSet");
				var model = mdl.getData();
				model.AllSwitch = false;
				mdl.refresh();
			}
			/*	} else {
								var mdl = that.getView().getModel("SwitchOnOffSet");
								var model = mdl.getData();
								model.MaterialGrpSwitch = false;
								mdl.refresh();
							}
						}
					}
				);
			}*/
		},

		////for Material Group One Switch
		onChangeSwitchMaterialGroupOne: function (oEvent) {
			var that = this;
			var msg = this.i18nModel.getProperty("AreYouSureWantGiveAllAccess");
			//oEvent
			/*	if (oEvent.getParameters().state) {
				sap.m.MessageBox.confirm(
					msg, {
						actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
						onClose: function (oAction) {
							if (oAction === sap.m.MessageBox.Action.YES) {*/
			var tblModel = that.getView().byId("ID_TBL_VIEW_PROV_MAT_GRP_ONE").getModel("MaterialGrpOneViewSet");
			tblModel.getData().results.permissionObjectDetailsDos = [];
			tblModel.refresh();
			var msg1 = that.i18nModel.getProperty("materialGroupOneCountLbl");
			that.getView().byId("ID_PROV_LBL_C_MAT_GRP_ONE").setText(msg1 + " (0)");
			if (oEvent.getParameters().state) {
				this.getView().getModel("createMdlViewSet").getData().EdtFldMG1 = false;
				this.getView().getModel("createMdlViewSet").refresh(true);
				that.switchCount += 1;
				if (that.switchCount === 29) {
					var mdl = that.getView().getModel("SwitchOnOffSet");
					var model = mdl.getData();
					model.AllSwitch = true;
					mdl.refresh();
				}
			} else {
				that.switchCount -= 1;
				this.getView().getModel("createMdlViewSet").getData().EdtFldMG1 = true;
				this.getView().getModel("createMdlViewSet").refresh(true);
				var mdl = that.getView().getModel("SwitchOnOffSet");
				var model = mdl.getData();
				model.AllSwitch = false;
				mdl.refresh();
			}
			/*	} else {
								var mdl = that.getView().getModel("SwitchOnOffSet");
								var model = mdl.getData();
								model.MaterialGrpOneSwitch = false;
								mdl.refresh();
							}
						}
					}
				);
			}*/
		},

		////for Material Group 4 Switch
		onChangeSwitchMaterialGroup4: function (oEvent) {
			var that = this;
			var msg = this.i18nModel.getProperty("AreYouSureWantGiveAllAccess");
			//oEvent
			/*	if (oEvent.getParameters().state) {
					sap.m.MessageBox.confirm(
						msg, {
							actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
							onClose: function (oAction) {
								if (oAction === sap.m.MessageBox.Action.YES) {*/
			var tblModel = that.getView().byId("ID_TBL_VIEW_PROV_MAT_GRP_4").getModel("MaterialGrp4ViewSet");
			tblModel.getData().results.permissionObjectDetailsDos = [];
			tblModel.refresh();
			var msg1 = that.i18nModel.getProperty("materialGroup4CountLbl");
			that.getView().byId("ID_PROV_LBL_C_MAT_GRP_4").setText(msg1 + " (0)");
			if (oEvent.getParameters().state) {
				this.getView().getModel("createMdlViewSet").getData().EdtFldMG4 = false;
				this.getView().getModel("createMdlViewSet").refresh(true);
				that.switchCount += 1;
				if (that.switchCount === 29) {
					var mdl = that.getView().getModel("SwitchOnOffSet");
					var model = mdl.getData();
					model.AllSwitch = true;
					mdl.refresh();
				}
			} else {
				that.switchCount -= 1;
				this.getView().getModel("createMdlViewSet").getData().EdtFldMG4 = true;
				this.getView().getModel("createMdlViewSet").refresh(true);
				var mdl = that.getView().getModel("SwitchOnOffSet");
				var model = mdl.getData();
				model.AllSwitch = false;
				mdl.refresh();
			}
			/*	} else {
								var mdl = that.getView().getModel("SwitchOnOffSet");
								var model = mdl.getData();
								model.MaterialGrp4Switch = false;
								mdl.refresh();
							}
						}
					}
				);
			}*/
		},

		////for District Switch
		onChangeSwitchDistrict: function (oEvent) {
			var that = this;
			var msg = this.i18nModel.getProperty("AreYouSureWantGiveAllAccess");
			//oEvent
			/*	if (oEvent.getParameters().state) {
					sap.m.MessageBox.confirm(
						msg, {
							actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
							onClose: function (oAction) {
								if (oAction === sap.m.MessageBox.Action.YES) {*/
			var tblModel = that.getView().byId("ID_TBL_VIEW_PROV_DISTRICT").getModel("DistrictViewSet");
			tblModel.getData().results.permissionObjectDetailsDos = [];
			tblModel.refresh();
			var msg1 = that.i18nModel.getProperty("distrcitCountLbl");
			that.getView().byId("ID_PROV_LBL_C_MAT_DISTRCT").setText(msg1 + " (0)");
			if (oEvent.getParameters().state) {
				this.getView().getModel("createMdlViewSet").getData().EdtFldDiv = false;
				this.getView().getModel("createMdlViewSet").refresh(true);
				that.switchCount += 1;
				if (that.switchCount === 29) {
					var mdl = that.getView().getModel("SwitchOnOffSet");
					var model = mdl.getData();
					model.AllSwitch = true;
					mdl.refresh();
				}
			} else {
				that.switchCount -= 1;
				this.getView().getModel("createMdlViewSet").getData().EdtFldDiv = true;
				this.getView().getModel("createMdlViewSet").refresh(true);
				var mdl = that.getView().getModel("SwitchOnOffSet");
				var model = mdl.getData();
				model.AllSwitch = false;
				mdl.refresh();
			}
			/*	} else {
								var mdl = that.getView().getModel("SwitchOnOffSet");
								var model = mdl.getData();
								model.DistrictSwitch = false;
								mdl.refresh();
							}
						}
					}
				);
			}*/
		},

		////for Plant Switch
		onChangeSwitchPlant: function (oEvent) {
			var that = this;
			var msg = this.i18nModel.getProperty("AreYouSureWantGiveAllAccess");
			//oEvent
			/*	if (oEvent.getParameters().state) {
					sap.m.MessageBox.confirm(
						msg, {
							actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
							onClose: function (oAction) {
								if (oAction === sap.m.MessageBox.Action.YES) {*/
			var tblModel = that.getView().byId("ID_TBL_VIEW_PROV_PLANT").getModel("PlantViewSet");
			tblModel.getData().results.permissionObjectDetailsDos = [];
			tblModel.refresh();
			var msg1 = that.i18nModel.getProperty("plantCountLbl");
			that.getView().byId("ID_PROV_LBL_C_MAT_PLANT").setText(msg1 + " (0)");
			if (oEvent.getParameters().state) {
				this.getView().getModel("createMdlViewSet").getData().EdtFldPlnt = false;
				this.getView().getModel("createMdlViewSet").refresh(true);
				that.switchCount += 1;
				if (that.switchCount === 29) {
					var mdl = that.getView().getModel("SwitchOnOffSet");
					var model = mdl.getData();
					model.AllSwitch = true;
					mdl.refresh();
				}
			} else {
				that.switchCount -= 1;
				this.getView().getModel("createMdlViewSet").getData().EdtFldPlnt = true;
				this.getView().getModel("createMdlViewSet").refresh(true);
				var mdl = that.getView().getModel("SwitchOnOffSet");
				var model = mdl.getData();
				model.AllSwitch = false;
				mdl.refresh();
			}
			/*	} else {
								var mdl = that.getView().getModel("SwitchOnOffSet");
								var model = mdl.getData();
								model.PlantSwitch = false;
								mdl.refresh();
							}
						}
					}
				);
			}*/
		},

		////for Country Switch
		onChangeSwitchCountry: function (oEvent) {
			var that = this;
			var msg = this.i18nModel.getProperty("AreYouSureWantGiveAllAccess");
			//oEvent
			/*	if (oEvent.getParameters().state) {
					sap.m.MessageBox.confirm(
						msg, {
							actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
							onClose: function (oAction) {
								if (oAction === sap.m.MessageBox.Action.YES) {*/
			var tblModel = that.getView().byId("ID_TBL_VIEW_PROV_COUNTRY").getModel("CountryViewSet");
			tblModel.getData().results.permissionObjectDetailsDos = [];
			tblModel.refresh();
			var msg1 = that.i18nModel.getProperty("countryCountLbl");
			that.getView().byId("ID_PROV_LBL_C_COUNTRY").setText(msg1 + " (0)");
			if (oEvent.getParameters().state) {
				this.getView().getModel("createMdlViewSet").getData().EdtFldCntry = false;
				this.getView().getModel("createMdlViewSet").refresh(true);
				that.switchCount += 1;
				if (that.switchCount === 29) {
					var mdl = that.getView().getModel("SwitchOnOffSet");
					var model = mdl.getData();
					model.AllSwitch = true;
					mdl.refresh();
				}
			} else {
				that.switchCount -= 1;
				this.getView().getModel("createMdlViewSet").getData().EdtFldCntry = true;
				this.getView().getModel("createMdlViewSet").refresh(true);
				var mdl = that.getView().getModel("SwitchOnOffSet");
				var model = mdl.getData();
				model.AllSwitch = false;
				mdl.refresh();
			}
			/*	} else {
								var mdl = that.getView().getModel("SwitchOnOffSet");
								var model = mdl.getData();
								model.CountrySwitch = false;
								mdl.refresh();
							}
						}
					}
				);
			}*/
		},

		////for Storage Location Switch
		onChangeSwitchStorLoc: function (oEvent) {
			var that = this;
			var msg = this.i18nModel.getProperty("AreYouSureWantGiveAllAccess");
			//oEvent
			/*	if (oEvent.getParameters().state) {
					sap.m.MessageBox.confirm(
						msg, {
							actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
							onClose: function (oAction) {
								if (oAction === sap.m.MessageBox.Action.YES) {*/
			var tblModel = that.getView().byId("ID_TBL_VIEW_PROV_STORLOC").getModel("StorLocViewSet");
			tblModel.getData().results.permissionObjectDetailsDos = [];
			tblModel.refresh();
			var msg1 = that.i18nModel.getProperty("storLocCountLbl");
			that.getView().byId("ID_PROV_LBL_C_MAT_STORLOC").setText(msg1 + " (0)");
			if (oEvent.getParameters().state) {
				this.getView().getModel("createMdlViewSet").getData().EdtFldStorLoc = false;
				this.getView().getModel("createMdlViewSet").refresh(true);
				that.switchCount += 1;
				if (that.switchCount === 29) {
					var mdl = that.getView().getModel("SwitchOnOffSet");
					var model = mdl.getData();
					model.AllSwitch = true;
					mdl.refresh();
				}
			} else {
				that.switchCount -= 1;
				this.getView().getModel("createMdlViewSet").getData().EdtFldStorLoc = true;
				this.getView().getModel("createMdlViewSet").refresh(true);
				var mdl = that.getView().getModel("SwitchOnOffSet");
				var model = mdl.getData();
				model.AllSwitch = false;
				mdl.refresh();
			}
			/*} else {
								var mdl = that.getView().getModel("SwitchOnOffSet");
								var model = mdl.getData();
								model.StorageLocSwitch = false;
								mdl.refresh();
							}
						}
					}
				);
			}*/
		},

		////for Ordertype Switch
		onChangeSwitchOrderType: function (oEvent) {
			var that = this;
			var msg = this.i18nModel.getProperty("AreYouSureWantGiveAllAccess");
			//oEvent
			/*	if (oEvent.getParameters().state) {
					sap.m.MessageBox.confirm(
						msg, {
							actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
							onClose: function (oAction) {
								if (oAction === sap.m.MessageBox.Action.YES) {*/
			var tblModel = that.getView().byId("ID_TBL_VIEW_PROV_ORDER").getModel("OrderTypeViewSet");
			tblModel.getData().results.permissionObjectDetailsDos = [];
			tblModel.refresh();
			var msg1 = that.i18nModel.getProperty("orderTypeCountLbl");
			that.getView().byId("ID_PROV_LBL_C_ORDER").setText(msg1 + " (0)");
			if (oEvent.getParameters().state) {
				this.getView().getModel("createMdlViewSet").getData().EdtFldOType = false;
				this.getView().getModel("createMdlViewSet").refresh(true);
				that.switchCount += 1;
				if (that.switchCount === 29) {
					var mdl = that.getView().getModel("SwitchOnOffSet");
					var model = mdl.getData();
					model.AllSwitch = true;
					mdl.refresh();
				}
			} else {
				that.switchCount -= 1;
				this.getView().getModel("createMdlViewSet").getData().EdtFldOType = true;
				this.getView().getModel("createMdlViewSet").refresh(true);
				var mdl = that.getView().getModel("SwitchOnOffSet");
				var model = mdl.getData();
				model.AllSwitch = false;
				mdl.refresh();
			}
			/*	} else {
								var mdl = that.getView().getModel("SwitchOnOffSet");
								var model = mdl.getData();
								model.OrderTypeSwitch = false;
								mdl.refresh();
							}
						}
					}
				);
			}*/
		},

		//MatGrp2 Switch

		onChangeSwitchMatGrp2: function (oEvent) {
			var that = this;
			var msg = this.i18nModel.getProperty("AreYouSureWantGiveAllAccess");
			//oEvent
			/*if (oEvent.getParameters().state) {
				sap.m.MessageBox.confirm(
					msg, {
						actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
						onClose: function (oAction) {
							if (oAction === sap.m.MessageBox.Action.YES) {*/
			var tblModel = that.getView().byId("ID_TBL_VIEW_PROV_MAT_GRP_TWO").getModel("MaterialGrpTwoViewSet");
			tblModel.getData().results.permissionObjectDetailsDos = [];
			tblModel.refresh();
			var msg1 = that.i18nModel.getProperty("MatGrp2CountLbl");
			that.getView().byId("ID_PROV_LBL_C_MAT_GRP_TWO").setText(msg1 + " (0)");
			if (oEvent.getParameters().state) {
				this.getView().getModel("createMdlViewSet").getData().EdtFldMG2 = false;
				this.getView().getModel("createMdlViewSet").refresh(true);
				that.switchCount += 1;
				if (that.switchCount === 29) {
					var mdl = that.getView().getModel("SwitchOnOffSet");
					var model = mdl.getData();
					model.AllSwitch = true;
					mdl.refresh();
				}
			} else {
				that.switchCount -= 1;
				this.getView().getModel("createMdlViewSet").getData().EdtFldMG2 = true;
				this.getView().getModel("createMdlViewSet").refresh(true);
				var mdl = that.getView().getModel("SwitchOnOffSet");
				var model = mdl.getData();
				model.AllSwitch = false;
				mdl.refresh();
			}
			/*	} else {
								var mdl = that.getView().getModel("SwitchOnOffSet");
								var model = mdl.getData();
								model.MatGrp2Switch = false;
								mdl.refresh();
							}
						}
					}
				);
			}*/
		},

		//MatGrp3 Switch

		onChangeSwitchMatGrp3: function (oEvent) {
			var that = this;
			var msg = this.i18nModel.getProperty("AreYouSureWantGiveAllAccess");
			//oEvent
			/*	if (oEvent.getParameters().state) {
					sap.m.MessageBox.confirm(
						msg, {
							actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
							onClose: function (oAction) {
								if (oAction === sap.m.MessageBox.Action.YES) {*/
			var tblModel = that.getView().byId("ID_TBL_VIEW_PROV_MAT_GRP_THREE").getModel("MaterialGrpThreeViewSet");
			tblModel.getData().results.permissionObjectDetailsDos = [];
			tblModel.refresh();
			var msg1 = that.i18nModel.getProperty("MatGrp3CountLbl");
			that.getView().byId("ID_PROV_LBL_C_MAT_GRP_THREE").setText(msg1 + " (0)");
			if (oEvent.getParameters().state) {
				this.getView().getModel("createMdlViewSet").getData().EdtFldMG3 = false;
				this.getView().getModel("createMdlViewSet").refresh(true);
				that.switchCount += 1;
				if (that.switchCount === 29) {
					var mdl = that.getView().getModel("SwitchOnOffSet");
					var model = mdl.getData();
					model.AllSwitch = true;
					mdl.refresh();
				}
			} else {
				that.switchCount -= 1;
				this.getView().getModel("createMdlViewSet").getData().EdtFldMG3 = true;
				this.getView().getModel("createMdlViewSet").refresh(true);
				var mdl = that.getView().getModel("SwitchOnOffSet");
				var model = mdl.getData();
				model.AllSwitch = false;
				mdl.refresh();
			}
			/*	} else {
								var mdl = that.getView().getModel("SwitchOnOffSet");
								var model = mdl.getData();
								model.MatGrp3Switch = false;
								mdl.refresh();
							}
						}
					}
				);
			}*/
		},

		//MatGrp5 Switch

		onChangeSwitchMatGrp5: function (oEvent) {
			var that = this;
			var msg = this.i18nModel.getProperty("AreYouSureWantGiveAllAccess");
			//oEvent
			/*	if (oEvent.getParameters().state) {
					sap.m.MessageBox.confirm(
						msg, {
							actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
							onClose: function (oAction) {
								if (oAction === sap.m.MessageBox.Action.YES) {*/
			var tblModel = that.getView().byId("ID_TBL_VIEW_PROV_MAT_GRP_FIVE").getModel("MaterialGrpFiveViewSet");
			tblModel.getData().results.permissionObjectDetailsDos = [];
			tblModel.refresh();
			var msg1 = that.i18nModel.getProperty("MatGrp5CountLbl");
			that.getView().byId("ID_PROV_LBL_C_MAT_GRP_FIVE").setText(msg1 + " (0)");
			if (oEvent.getParameters().state) {
				this.getView().getModel("createMdlViewSet").getData().EdtFldMG5 = false;
				this.getView().getModel("createMdlViewSet").refresh(true);
				that.switchCount += 1;
				if (that.switchCount === 29) {
					var mdl = that.getView().getModel("SwitchOnOffSet");
					var model = mdl.getData();
					model.AllSwitch = true;
					mdl.refresh();
				}
			} else {
				that.switchCount -= 1;
				this.getView().getModel("createMdlViewSet").getData().EdtFldMG5 = true;
				this.getView().getModel("createMdlViewSet").refresh(true);
				var mdl = that.getView().getModel("SwitchOnOffSet");
				var model = mdl.getData();
				model.AllSwitch = false;
				mdl.refresh();
			}
			/*	} else {
								var mdl = that.getView().getModel("SwitchOnOffSet");
								var model = mdl.getData();
								model.MatGrp5Switch = false;
								mdl.refresh();
							}
						}
					}
				);
			}*/
		},

		//ProdHrch 1 Switch
		onChangeSwitchProdHierarchy1: function (oEvent) {
			var that = this;
			var msg = this.i18nModel.getProperty("AreYouSureWantGiveAllAccess");
			//oEvent
			/*if (oEvent.getParameters().state) {
				sap.m.MessageBox.confirm(
					msg, {
						actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
						onClose: function (oAction) {
							if (oAction === sap.m.MessageBox.Action.YES) {*/
			var tblModel = that.getView().byId("ID_TBL_VIEW_PROV_PROD_HRCH_ONE").getModel("ProdHierarchy1ViewSet");
			tblModel.getData().results.permissionObjectDetailsDos = [];
			tblModel.refresh();
			var msg1 = that.i18nModel.getProperty("ProdHrch1CountLbl");
			that.getView().byId("ID_PROV_LBL_C_PROD_HRCH_ONE").setText(msg1 + " (0)");
			if (oEvent.getParameters().state) {
				this.getView().getModel("createMdlViewSet").getData().EdtFldPh1 = false;
				this.getView().getModel("createMdlViewSet").refresh(true);
				that.switchCount += 1;
				if (that.switchCount === 29) {
					var mdl = that.getView().getModel("SwitchOnOffSet");
					var model = mdl.getData();
					model.AllSwitch = true;
					mdl.refresh();
				}
			} else {
				that.switchCount -= 1;
				this.getView().getModel("createMdlViewSet").getData().EdtFldPh1 = true;
				this.getView().getModel("createMdlViewSet").refresh(true);
				var mdl = that.getView().getModel("SwitchOnOffSet");
				var model = mdl.getData();
				model.AllSwitch = false;
				mdl.refresh();
			}
			/*} else {
								var mdl = that.getView().getModel("SwitchOnOffSet");
								var model = mdl.getData();
								model.ProdHierarchy1Switch = false;
								mdl.refresh();
							}
						}
					}
				);
			}*/
		},

		//ProdHrch 2 Switch
		onChangeSwitchProdHierarchy2: function (oEvent) {
			var that = this;
			var msg = this.i18nModel.getProperty("AreYouSureWantGiveAllAccess");
			//oEvent
			/*	if (oEvent.getParameters().state) {
					sap.m.MessageBox.confirm(
						msg, {
							actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
							onClose: function (oAction) {
								if (oAction === sap.m.MessageBox.Action.YES) {*/
			var tblModel = that.getView().byId("ID_TBL_VIEW_PROV_PROD_HRCH_TWO").getModel("ProdHierarchy2ViewSet");
			tblModel.getData().results.permissionObjectDetailsDos = [];
			tblModel.refresh();
			var msg1 = that.i18nModel.getProperty("ProdHrch2CountLbl");
			that.getView().byId("ID_PROV_LBL_C_PROD_HRCH_TWO").setText(msg1 + " (0)");
			if (oEvent.getParameters().state) {
				this.getView().getModel("createMdlViewSet").getData().EdtFldPh2 = false;
				this.getView().getModel("createMdlViewSet").refresh(true);
				that.switchCount += 1;
				if (that.switchCount === 29) {
					var mdl = that.getView().getModel("SwitchOnOffSet");
					var model = mdl.getData();
					model.AllSwitch = true;
					mdl.refresh();
				}
			} else {
				that.switchCount -= 1;
				this.getView().getModel("createMdlViewSet").getData().EdtFldPh2 = true;
				this.getView().getModel("createMdlViewSet").refresh(true);
				var mdl = that.getView().getModel("SwitchOnOffSet");
				var model = mdl.getData();
				model.AllSwitch = false;
				mdl.refresh();
			}
			/*	} else {
								var mdl = that.getView().getModel("SwitchOnOffSet");
								var model = mdl.getData();
								model.ProdHierarchy2Switch = false;
								mdl.refresh();
							}
						}
					}
				);
			}*/
		},
		//ProdHrch 3 Switch
		onChangeSwitchProdHierarchy3: function (oEvent) {
			var that = this;
			var msg = this.i18nModel.getProperty("AreYouSureWantGiveAllAccess");
			//oEvent
			/*if (oEvent.getParameters().state) {
				sap.m.MessageBox.confirm(
					msg, {
						actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
						onClose: function (oAction) {
							if (oAction === sap.m.MessageBox.Action.YES) {*/
			var tblModel = that.getView().byId("ID_TBL_VIEW_PROV_PROD_HRCH_THREE").getModel("ProdHierarchy3ViewSet");
			tblModel.getData().results.permissionObjectDetailsDos = [];
			tblModel.refresh();
			var msg1 = that.i18nModel.getProperty("ProdHrch3CountLbl");
			that.getView().byId("ID_PROV_LBL_C_PROD_HRCH_THREE").setText(msg1 + " (0)");
			if (oEvent.getParameters().state) {
				this.getView().getModel("createMdlViewSet").getData().EdtFldPh3 = false;
				this.getView().getModel("createMdlViewSet").refresh(true);
				that.switchCount += 1;
				if (that.switchCount === 29) {
					var mdl = that.getView().getModel("SwitchOnOffSet");
					var model = mdl.getData();
					model.AllSwitch = true;
					mdl.refresh();
				}
			} else {
				that.switchCount -= 1;
				this.getView().getModel("createMdlViewSet").getData().EdtFldPh3 = true;
				this.getView().getModel("createMdlViewSet").refresh(true);
				this.getView().getModel("createMdlViewSet").refresh(true);
				var mdl = that.getView().getModel("SwitchOnOffSet");
				var model = mdl.getData();
				model.AllSwitch = false;
				mdl.refresh();
			}
			/*	} else {
								var mdl = that.getView().getModel("SwitchOnOffSet");
								var model = mdl.getData();
								model.ProdHierarchy3Switch = false;
								mdl.refresh();
							}
						}
					}
				);
			}*/
		},
		//ProdHrch 4 Switch
		onChangeSwitchProdHierarchy4: function (oEvent) {
			var that = this;
			var msg = this.i18nModel.getProperty("AreYouSureWantGiveAllAccess");
			//oEvent
			/*	if (oEvent.getParameters().state) {
					sap.m.MessageBox.confirm(
						msg, {
							actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
							onClose: function (oAction) {
								if (oAction === sap.m.MessageBox.Action.YES) {*/
			var tblModel = that.getView().byId("ID_TBL_VIEW_PROV_PROD_HRCH_FOUR").getModel("ProdHierarchy4ViewSet");
			tblModel.getData().results.permissionObjectDetailsDos = [];
			tblModel.refresh();
			var msg1 = that.i18nModel.getProperty("ProdHrch4CountLbl");
			that.getView().byId("ID_PROV_LBL_C_PROD_HRCH_FOUR").setText(msg1 + " (0)");
			if (oEvent.getParameters().state) {
				this.getView().getModel("createMdlViewSet").getData().EdtFldPh4 = false;
				this.getView().getModel("createMdlViewSet").refresh(true);
				that.switchCount += 1;
				if (that.switchCount === 29) {
					var mdl = that.getView().getModel("SwitchOnOffSet");
					var model = mdl.getData();
					model.AllSwitch = true;
					mdl.refresh();
				}
			} else {
				that.switchCount -= 1;
				this.getView().getModel("createMdlViewSet").getData().EdtFldPh4 = true;
				this.getView().getModel("createMdlViewSet").refresh(true);
				this.getView().getModel("createMdlViewSet").refresh(true);
				var mdl = that.getView().getModel("SwitchOnOffSet");
				var model = mdl.getData();
				model.AllSwitch = false;
				mdl.refresh();
			}
			/*	} else {
								var mdl = that.getView().getModel("SwitchOnOffSet");
								var model = mdl.getData();
								model.ProdHierarchy4Switch = false;
								mdl.refresh();
							}
						}
					}s
				);
			}*/
		},
		//ProdHrch 5 Switch
		onChangeSwitchProdHierarchy5: function (oEvent) {
			var that = this;
			var msg = this.i18nModel.getProperty("AreYouSureWantGiveAllAccess");
			//oEvent
			/*	if (oEvent.getParameters().state) {
					sap.m.MessageBox.confirm(
						msg, {
							actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
							onClose: function (oAction) {
								if (oAction === sap.m.MessageBox.Action.YES) {*/
			var tblModel = that.getView().byId("ID_TBL_VIEW_PROV_PROD_HRCH_FIVE").getModel("ProdHierarchy5ViewSet");
			tblModel.getData().results.permissionObjectDetailsDos = [];
			tblModel.refresh();
			var msg1 = that.i18nModel.getProperty("ProdHrch5CountLbl");
			that.getView().byId("ID_PROV_LBL_C_PROD_HRCH_FIVE").setText(msg1 + " (0)");
			if (oEvent.getParameters().state) {
				this.getView().getModel("createMdlViewSet").getData().EdtFldPh5 = false;
				this.getView().getModel("createMdlViewSet").refresh(true);
				that.switchCount += 1;
				if (that.switchCount === 29) {
					var mdl = that.getView().getModel("SwitchOnOffSet");
					var model = mdl.getData();
					model.AllSwitch = true;
					mdl.refresh();
				}
			} else {
				that.switchCount -= 1;
				this.getView().getModel("createMdlViewSet").getData().EdtFldPh5 = true;
				this.getView().getModel("createMdlViewSet").refresh(true);
				this.getView().getModel("createMdlViewSet").refresh(true);
				var mdl = that.getView().getModel("SwitchOnOffSet");
				var model = mdl.getData();
				model.AllSwitch = false;
				mdl.refresh();
			}
			/*	} else {
								var mdl = that.getView().getModel("SwitchOnOffSet");
								var model = mdl.getData();
								model.ProdHierarchy5Switch = false;
								mdl.refresh();
							}
						}
					}
				);
			}*/
		},

		//ProdHrch 6 Switch
		onChangeSwitchProdHierarchy6: function (oEvent) {
			var that = this;
			var msg = this.i18nModel.getProperty("AreYouSureWantGiveAllAccess");
			//oEvent
			/*	if (oEvent.getParameters().state) {
					sap.m.MessageBox.confirm(
						msg, {
							actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
							onClose: function (oAction) {
								if (oAction === sap.m.MessageBox.Action.YES) {*/
			var tblModel = that.getView().byId("ID_TBL_VIEW_PROV_PROD_HRCH_SIX").getModel("ProdHierarchy6ViewSet");
			tblModel.getData().results.permissionObjectDetailsDos = [];
			tblModel.refresh();
			var msg1 = that.i18nModel.getProperty("ProdHrch6CountLbl");
			that.getView().byId("ID_PROV_LBL_C_PROD_HRCH_SIX").setText(msg1 + " (0)");
			if (oEvent.getParameters().state) {
				this.getView().getModel("createMdlViewSet").getData().EdtFldPh6 = false;
				this.getView().getModel("createMdlViewSet").refresh(true);
				that.switchCount += 1;
				if (that.switchCount === 29) {
					var mdl = that.getView().getModel("SwitchOnOffSet");
					var model = mdl.getData();
					model.AllSwitch = true;
					mdl.refresh();
				}
			} else {
				that.switchCount -= 1;
				this.getView().getModel("createMdlViewSet").getData().EdtFldPh6 = true;
				this.getView().getModel("createMdlViewSet").refresh(true);
				var mdl = that.getView().getModel("SwitchOnOffSet");
				var model = mdl.getData();
				model.AllSwitch = false;
				mdl.refresh();
			}
			/*	} else {
								var mdl = that.getView().getModel("SwitchOnOffSet");
								var model = mdl.getData();
								model.ProdHierarchy6Switch = false;
								mdl.refresh();
							}
						}
					}
				);
			}*/
		},

		//ProdHrch 7 Switch
		onChangeSwitchProdHierarchy7: function (oEvent) {
			var that = this;
			var msg = this.i18nModel.getProperty("AreYouSureWantGiveAllAccess");
			//oEvent
			/*	if (oEvent.getParameters().state) {
					sap.m.MessageBox.confirm(
						msg, {
							actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
							onClose: function (oAction) {
								if (oAction === sap.m.MessageBox.Action.YES) {*/
			var tblModel = that.getView().byId("ID_TBL_VIEW_PROV_PROD_HRCH_SEVEN").getModel("ProdHierarchy7ViewSet");
			tblModel.getData().results.permissionObjectDetailsDos = [];
			tblModel.refresh();
			var msg1 = that.i18nModel.getProperty("ProdHrch7CountLbl");
			that.getView().byId("ID_PROV_LBL_C_PROD_HRCH_SEVEN").setText(msg1 + " (0)");
			if (oEvent.getParameters().state) {
				this.getView().getModel("createMdlViewSet").getData().EdtFldPh7 = false;
				this.getView().getModel("createMdlViewSet").refresh(true);
				that.switchCount += 1;
				if (that.switchCount === 29) {
					var mdl = that.getView().getModel("SwitchOnOffSet");
					var model = mdl.getData();
					model.AllSwitch = true;
					mdl.refresh();
				}
			} else {
				that.switchCount -= 1;
				this.getView().getModel("createMdlViewSet").getData().EdtFldPh7 = true;
				this.getView().getModel("createMdlViewSet").refresh(true);
				var mdl = that.getView().getModel("SwitchOnOffSet");
				var model = mdl.getData();
				model.AllSwitch = false;
				mdl.refresh();
			}
			/*	} else {
								var mdl = that.getView().getModel("SwitchOnOffSet");
								var model = mdl.getData();
								model.ProdHierarchy7Switch = false;
								mdl.refresh();
							}
						}
					}
				);
			}*/
		},

		//CusGrp Switch
		onChangeSwitchCustomerGrp: function (oEvent) {
			var that = this;
			var msg = this.i18nModel.getProperty("AreYouSureWantGiveAllAccess");

			/*		if (oEvent.getParameters().state) {
						sap.m.MessageBox.confirm(
							msg, {
								actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
								onClose: function (oAction) {
									if (oAction === sap.m.MessageBox.Action.YES) {*/
			var tblModel = that.getView().byId("ID_TBL_VIEW_PROV_CUS_GRP").getModel("CusGrpViewSet");
			tblModel.getData().results.permissionObjectDetailsDos = [];
			tblModel.refresh();
			var msg1 = that.i18nModel.getProperty("CusGrpCountLbl");
			that.getView().byId("ID_PROV_LBL_C_CUS_GRP").setText(msg1 + " (0)");
			if (oEvent.getParameters().state) {
				this.getView().getModel("createMdlViewSet").getData().EdtFldCG = false;
				this.getView().getModel("createMdlViewSet").refresh(true);
				that.switchCount += 1;
				if (that.switchCount === 29) {
					var mdl = that.getView().getModel("SwitchOnOffSet");
					var model = mdl.getData();
					model.AllSwitch = true;
					mdl.refresh();
				}
			} else {
				that.switchCount -= 1;
				this.getView().getModel("createMdlViewSet").getData().EdtFldCG = true;
				this.getView().getModel("createMdlViewSet").refresh(true);
				var mdl = that.getView().getModel("SwitchOnOffSet");
				var model = mdl.getData();
				model.AllSwitch = false;
				mdl.refresh();
			}
			/*	} else {
								var mdl = that.getView().getModel("SwitchOnOffSet");
								var model = mdl.getData();
								model.CustomerGrpSwitch = false;
								mdl.refresh();
							}
						}
					}
				);
			}*/
		},

		//CusGrp1 Switch
		onChangeSwitchCustomerGrp1: function (oEvent) {
			var that = this;
			var msg = this.i18nModel.getProperty("AreYouSureWantGiveAllAccess");

			/*	if (oEvent.getParameters().state) {
					sap.m.MessageBox.confirm(
						msg, {
							actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
							onClose: function (oAction) {
								if (oAction === sap.m.MessageBox.Action.YES) {*/
			var tblModel = that.getView().byId("ID_TBL_VIEW_PROV_CUS_GRP_ONE").getModel("CusGrp1ViewSet");
			tblModel.getData().results.permissionObjectDetailsDos = [];
			tblModel.refresh();
			var msg1 = that.i18nModel.getProperty("CusGrp1CountLbl");
			that.getView().byId("ID_PROV_LBL_C_CUS_GRP_ONE").setText(msg1 + " (0)");
			if (oEvent.getParameters().state) {
				this.getView().getModel("createMdlViewSet").getData().EdtFldCG1 = false;
				this.getView().getModel("createMdlViewSet").refresh(true);
				that.switchCount += 1;
				if (that.switchCount === 29) {
					var mdl = that.getView().getModel("SwitchOnOffSet");
					var model = mdl.getData();
					model.AllSwitch = true;
					mdl.refresh();
				}
			} else {
				that.switchCount -= 1;
				this.getView().getModel("createMdlViewSet").getData().EdtFldCG1 = true;
				this.getView().getModel("createMdlViewSet").refresh(true);
				var mdl = that.getView().getModel("SwitchOnOffSet");
				var model = mdl.getData();
				model.AllSwitch = false;
				mdl.refresh();
			}
			/*	} else {
								var mdl = that.getView().getModel("SwitchOnOffSet");
								var model = mdl.getData();
								model.CustomerGrp1Switch = false;
								mdl.refresh();
							}
						}
					}
				);
			}*/
		},

		//CusGrp2 Switch
		onChangeSwitchCustomerGrp2: function (oEvent) {
			var that = this;
			var msg = this.i18nModel.getProperty("AreYouSureWantGiveAllAccess");

			/*		if (oEvent.getParameters().state) {
						sap.m.MessageBox.confirm(
							msg, {
								actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
								onClose: function (oAction) {
									if (oAction === sap.m.MessageBox.Action.YES) {*/
			var tblModel = that.getView().byId("ID_TBL_VIEW_PROV_CUS_GRP_TWO").getModel("CusGrp2ViewSet");
			tblModel.getData().results.permissionObjectDetailsDos = [];
			tblModel.refresh();
			var msg1 = that.i18nModel.getProperty("CusGrp2CountLbl");
			that.getView().byId("ID_PROV_LBL_C_CUS_GRP_TWO").setText(msg1 + " (0)");
			if (oEvent.getParameters().state) {
				this.getView().getModel("createMdlViewSet").getData().EdtFldCG2 = false;
				this.getView().getModel("createMdlViewSet").refresh(true);
				that.switchCount += 1;
				if (that.switchCount === 29) {
					var mdl = that.getView().getModel("SwitchOnOffSet");
					var model = mdl.getData();
					model.AllSwitch = true;
					mdl.refresh();
				}
			} else {
				that.switchCount -= 1;
				this.getView().getModel("createMdlViewSet").getData().EdtFldCG2 = true;
				this.getView().getModel("createMdlViewSet").refresh(true);
				var mdl = that.getView().getModel("SwitchOnOffSet");
				var model = mdl.getData();
				model.AllSwitch = false;
				mdl.refresh();
			}
			/*	} else {
								var mdl = that.getView().getModel("SwitchOnOffSet");
								var model = mdl.getData();
								model.CustomerGrp2Switch = false;
								mdl.refresh();
							}
						}
					}
				);
			}*/
		},

		//CusGrp3 Switch
		onChangeSwitchCustomerGrp3: function (oEvent) {
			var that = this;
			var msg = this.i18nModel.getProperty("AreYouSureWantGiveAllAccess");

			/*	if (oEvent.getParameters().state) {
					sap.m.MessageBox.confirm(
						msg, {
							actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
							onClose: function (oAction) {
								if (oAction === sap.m.MessageBox.Action.YES) {*/
			var tblModel = that.getView().byId("ID_TBL_VIEW_PROV_CUS_GRP_THREE").getModel("CusGrp3ViewSet");
			tblModel.getData().results.permissionObjectDetailsDos = [];
			tblModel.refresh();
			var msg1 = that.i18nModel.getProperty("CusGrp3CountLbl");
			that.getView().byId("ID_PROV_LBL_C_CUS_GRP_THREE").setText(msg1 + " (0)");
			if (oEvent.getParameters().state) {
				this.getView().getModel("createMdlViewSet").getData().EdtFldCG3 = false;
				this.getView().getModel("createMdlViewSet").refresh(true);
				that.switchCount += 1;
				if (that.switchCount === 29) {
					var mdl = that.getView().getModel("SwitchOnOffSet");
					var model = mdl.getData();
					model.AllSwitch = true;
					mdl.refresh();
				}
			} else {
				that.switchCount -= 1;
				this.getView().getModel("createMdlViewSet").getData().EdtFldCG3 = true;
				this.getView().getModel("createMdlViewSet").refresh(true);
				var mdl = that.getView().getModel("SwitchOnOffSet");
				var model = mdl.getData();
				model.AllSwitch = false;
				mdl.refresh();
			}
			/*	} else {
								var mdl = that.getView().getModel("SwitchOnOffSet");
								var model = mdl.getData();
								model.CustomerGrp3Switch = false;
								mdl.refresh();
							}
						}
					}
				);
			}*/
		},

		//CusGrp4 Switch
		onChangeSwitchCustomerGrp4: function (oEvent) {
			var that = this;
			var msg = this.i18nModel.getProperty("AreYouSureWantGiveAllAccess");

			/*	if (oEvent.getParameters().state) {
					sap.m.MessageBox.confirm(
						msg, {
							actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
							onClose: function (oAction) {
								if (oAction === sap.m.MessageBox.Action.YES) {*/
			var tblModel = that.getView().byId("ID_TBL_VIEW_PROV_CUS_GRP_FOUR").getModel("CusGrp4ViewSet");
			tblModel.getData().results.permissionObjectDetailsDos = [];
			tblModel.refresh();
			var msg1 = that.i18nModel.getProperty("CusGrp4CountLbl");
			that.getView().byId("ID_PROV_LBL_C_CUS_GRP_FOUR").setText(msg1 + " (0)");
			if (oEvent.getParameters().state) {
				this.getView().getModel("createMdlViewSet").getData().EdtFldCG4 = false;
				this.getView().getModel("createMdlViewSet").refresh(true);
				that.switchCount += 1;
				if (that.switchCount === 29) {
					var mdl = that.getView().getModel("SwitchOnOffSet");
					var model = mdl.getData();
					model.AllSwitch = true;
					mdl.refresh();
				}
			} else {
				that.switchCount -= 1;
				this.getView().getModel("createMdlViewSet").getData().EdtFldCG4 = true;
				this.getView().getModel("createMdlViewSet").refresh(true);
				var mdl = that.getView().getModel("SwitchOnOffSet");
				var model = mdl.getData();
				model.AllSwitch = false;
				mdl.refresh();
			}
			/*	} else {
								var mdl = that.getView().getModel("SwitchOnOffSet");
								var model = mdl.getData();
								model.CustomerGrp4Switch = false;
								mdl.refresh();
							}
						}
					}
				);
			}*/
		},

		//CusGrp5 Switch
		onChangeSwitchCustomerGrp5: function (oEvent) {
			var that = this;
			var msg = this.i18nModel.getProperty("AreYouSureWantGiveAllAccess");

			/*	if (oEvent.getParameters().state) {
					sap.m.MessageBox.confirm(
						msg, {
							actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
							onClose: function (oAction) {
								if (oAction === sap.m.MessageBox.Action.YES) {*/
			var tblModel = that.getView().byId("ID_TBL_VIEW_PROV_CUS_GRP_FIVE").getModel("CusGrp5ViewSet");
			tblModel.getData().results.permissionObjectDetailsDos = [];
			tblModel.refresh();
			var msg1 = that.i18nModel.getProperty("CusGrp5CountLbl");
			that.getView().byId("ID_PROV_LBL_C_CUS_GRP_FIVE").setText(msg1 + " (0)");
			if (oEvent.getParameters().state) {
				this.getView().getModel("createMdlViewSet").getData().EdtFldCG5 = false;
				this.getView().getModel("createMdlViewSet").refresh(true);
				that.switchCount += 1;
				if (that.switchCount === 29) {
					var mdl = that.getView().getModel("SwitchOnOffSet");
					var model = mdl.getData();
					model.AllSwitch = true;
					mdl.refresh();
				}
			} else {
				that.switchCount -= 1;
				this.getView().getModel("createMdlViewSet").getData().EdtFldCG5 = true;
				this.getView().getModel("createMdlViewSet").refresh(true);
				var mdl = that.getView().getModel("SwitchOnOffSet");
				var model = mdl.getData();
				model.AllSwitch = false;
				mdl.refresh();
			}
			/*	} else {
								var mdl = that.getView().getModel("SwitchOnOffSet");
								var model = mdl.getData();
								model.CustomerGrp5Switch = false;
								mdl.refresh();
							}
						}
					}
				);
			}*/
		},

		//District1 Switch
		onChangeSwitchDistrict1: function (oEvent) {
			var that = this;
			var msg = this.i18nModel.getProperty("AreYouSureWantGiveAllAccess");

			/*if (oEvent.getParameters().state) {
				sap.m.MessageBox.confirm(
					msg, {
						actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
						onClose: function (oAction) {
							if (oAction === sap.m.MessageBox.Action.YES) {*/
			var tblModel = that.getView().byId("ID_TBL_VIEW_PROV_DIST1").getModel("District1ViewSet");
			tblModel.getData().results.permissionObjectDetailsDos = [];
			tblModel.refresh();
			var msg1 = that.i18nModel.getProperty("District1CountLbl");
			that.getView().byId("ID_PROV_LBL_C_DIST1").setText(msg1 + " (0)");
			if (oEvent.getParameters().state) {
				this.getView().getModel("createMdlViewSet").getData().EdtFldDis1 = false;
				this.getView().getModel("createMdlViewSet").refresh(true);
				that.switchCount += 1;
				if (that.switchCount === 29) {
					var mdl = that.getView().getModel("SwitchOnOffSet");
					var model = mdl.getData();
					model.AllSwitch = true;
					mdl.refresh();
				}
			} else {
				that.switchCount -= 1;
				this.getView().getModel("createMdlViewSet").getData().EdtFldDis1 = true;
				this.getView().getModel("createMdlViewSet").refresh(true);
				var mdl = that.getView().getModel("SwitchOnOffSet");
				var model = mdl.getData();
				model.AllSwitch = false;
				mdl.refresh();
			}
			/*	} else {
								var mdl = that.getView().getModel("SwitchOnOffSet");
								var model = mdl.getData();
								model.District1Switch = false;
								mdl.refresh();
							}
						}
					}
				);
			}*/
		},

		//Material Switch
		onChangeSwitchMaterial: function (oEvent) {
			var that = this;
			var msg = this.i18nModel.getProperty("AreYouSureWantGiveAllAccess");

			/*	if (oEvent.getParameters().state) {
					sap.m.MessageBox.confirm(
						msg, {
							actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
							onClose: function (oAction) {
								if (oAction === sap.m.MessageBox.Action.YES) {*/
			var tblModel = that.getView().byId("ID_TBL_VIEW_PROV_MAT").getModel("MaterialViewSet");
			tblModel.getData().results.permissionObjectDetailsDos = [];
			tblModel.refresh();
			var msg1 = that.i18nModel.getProperty("MaterialCountLbl");
			that.getView().byId("ID_PROV_LBL_C_MAT").setText(msg1 + " (0)");
			if (oEvent.getParameters().state) {
				this.getView().getModel("createMdlViewSet").getData().EdtFldMat = false;
				this.getView().getModel("createMdlViewSet").refresh(true);
				that.switchCount += 1;
				if (that.switchCount === 29) {
					var mdl = that.getView().getModel("SwitchOnOffSet");
					var model = mdl.getData();
					model.AllSwitch = true;
					mdl.refresh();
				}
			} else {
				that.switchCount -= 1;
				this.getView().getModel("createMdlViewSet").getData().EdtFldMat = true;
				this.getView().getModel("createMdlViewSet").refresh(true);
				var mdl = that.getView().getModel("SwitchOnOffSet");
				var model = mdl.getData();
				model.AllSwitch = false;
				mdl.refresh();
			}
			/*		} else {
								var mdl = that.getView().getModel("SwitchOnOffSet");
								var model = mdl.getData();
								model.MaterialSwitch = false;
								mdl.refresh();
							}
						}
					}
				);
			}*/
		},
		handleValueHelpMaterialSearchFrag: function (oEvent) {
			var that = this;
			if (!that.MaterialFrag) {
				that.MaterialFrag = sap.ui.xmlfragment("com.incture.cherrywork.newdac.fragments.Material", that);
				that.getView().addDependent(that.MaterialFrag);
			}
			var data = that.MaterialNumFragSerach.getModel("MaterialSerchSet").getData();
			var filtrData = "$filter=";
			if (data.MatId.trim() === "" && data.MatName.trim() === "") {
				var msg = this.i18nModel.getProperty("addEitherIdOrName");
				sap.m.MessageToast.show(msg);
				return;
			}

			var count = 0;
			var count1 = 0;
			if (data.MatId.trim() !== "") {
				filtrData = filtrData + "material eq '" + data.MatId + "'";
				count++;
			}
			if (data.MatName.trim() !== "") {
				count1++;
				if (count === 0)
					filtrData = filtrData + "materialDesc eq '" + data.MatName + "'";
				else
					filtrData = filtrData + " and materialDesc eq '" + data.MatName + "'";
			}
			that.readMaterials(filtrData);
		},
		handleValueHelpMaterialCancelSearchFrag: function () {
			this.MaterialNumFragSerach.close();
		},
		onLiveChangeMateNumber: function (oEvent) {
			var value = oEvent.getParameters().value;
			var filters = new Array();
			var oFilter = new sap.ui.model.Filter([new sap.ui.model.Filter("Name", sap.ui.model.FilterOperator.Contains, value),
				new sap.ui.model.Filter("MatCode", sap.ui.model.FilterOperator.Contains, value)
			]);
			filters.push(oFilter);
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter(filters);
		},
		onConfirmChangeMaterNumber: function (oEvent) {
			var userName = sap.ui.getCore().getModel("userapi").getData().name;
			this.MaterialNumFragSerach.close();
			oEvent.getSource().getBinding("items").filter([]);
			// var objName = this.getView().byId("idObjName").getModel("objNameMdl").getData().ObjectName;
			var selectedContext = oEvent.getParameters().selectedContexts;
			var oSelsOrgDet = this.getView().byId("ID_TBL_VIEW_PROV_MAT").getModel("MaterialViewSet");
			//remove duplicate
			var duplicate = [];
			var countDup = 0;
			var nonDupArray = [];
			for (var i = 0; i < selectedContext.length; i++) {
				countDup = 0;
				for (var j = 0; j < oSelsOrgDet.getData().results.permissionObjectDetailsDos.length; j++) {

					if (selectedContext[i].getObject().MatCode === oSelsOrgDet.getData().results.permissionObjectDetailsDos[j].attributeValue) {
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
				oSelsOrgDet.getData().results.permissionObjectDetailsDos.push({
					"permissionObjectGuid": this.perid,
					// "attributeDetailsGuid": "3a937ca7-16e5-47be-93ef-b647577aeb36",
					// "attributeDetailsGuid": "f2a21bfd-8bcb-475b-b707-55c596864c5d",
					"attributeDetailsGuid": this.getView().getModel("detModel").getData()[6].attributeDetailsGuid,
					"attributeValue": selectedObj.MatCode,
					"attributeText": selectedObj.Name
				});
			}
			oSelsOrgDet.setSizeLimit(oSelsOrgDet.getData().results.permissionObjectDetailsDos.length);
			oSelsOrgDet.refresh();
			var msg1 = this.i18nModel.getProperty("MaterialCountLbl");
			this.getView().byId("ID_PROV_LBL_C_MAT").setText(msg1 + " (" + oSelsOrgDet.getData().results.permissionObjectDetailsDos.length + ")");
		},
		readMaterials: function (data) {
			var that = this;
			var busyDialog = new sap.m.BusyDialog();
			busyDialog.open();
			var url = encodeURI("/ZSearchHelp_MaterialSet");
			var oModel = new sap.ui.model.odata.ODataModel("/DKSHODataService/sap/opu/odata/sap/ZDKSH_CC_INVENTORY_HDRLOOKUP_SRV");
			oModel.read(url, {
				async: true,
				urlParameters: data,
				success: function (oData, oResponse) {
					for (var i = 0; i < oData.results.length; i++) {
						oData.results[i].MatCode = parseInt(oData.results[i].material).toString();
						oData.results[i].Name = oData.results[i].materialDesc;
					}
					that.oModelMateNumber = new sap.ui.model.json.JSONModel({
						results: oData.results
					});
					that.oModelMateNumber.setSizeLimit(oData.results.length);
					that.MaterialFrag.setModel(that.oModelMateNumber, "oModelMateNumberSet");
					busyDialog.close();
					that.MaterialFrag.open();
				},
				error: function (error) {
					busyDialog.close();
					var errorMsg = JSON.parse(error.responseText);
					errorMsg = errorMsg.error.message.value;
					that.errorMsg(errorMsg);
				}
			});

		},
		onPh3IP: function (oEvent) {
			if (oEvent.getParameter("newValue") !== "") {
				oEvent.getSource()._getBindingContext("ProdHierarchy3ViewSet").getObject().VSPh3 = "None";
				oEvent.getSource()._getBindingContext("ProdHierarchy3ViewSet").getObject().VSTPh3 = "";
				this.getView().byId("ID_TBL_VIEW_PROV_PROD_HRCH_THREE").getModel("ProdHierarchy3ViewSet").refresh();
			}
		},
		onPh3IPName: function (oEvent) {
			if (oEvent.getParameter("newValue") !== "") {
				oEvent.getSource()._getBindingContext("ProdHierarchy3ViewSet").getObject().VSPh3Name = "None";
				oEvent.getSource()._getBindingContext("ProdHierarchy3ViewSet").getObject().VSTPh3Name = "";
				this.getView().byId("ID_TBL_VIEW_PROV_PROD_HRCH_THREE").getModel("ProdHierarchy3ViewSet").refresh();
			}
		},
		onSlocIP: function (oEvent) {
			if (oEvent.getParameter("newValue") !== "") {
				oEvent.getSource()._getBindingContext("StorLocViewSet").getObject().VSLoc = "None";
				oEvent.getSource()._getBindingContext("StorLocViewSet").getObject().VSTLoc = "";
				this.getView().byId("ID_TBL_VIEW_PROV_STORLOC").getModel("StorLocViewSet").refresh();
			}
		},
		onSlocIPName: function (oEvent) {
			if (oEvent.getParameter("newValue") !== "") {
				oEvent.getSource()._getBindingContext("StorLocViewSet").getObject().VSLocName = "None";
				oEvent.getSource()._getBindingContext("StorLocViewSet").getObject().VSTLocName = "";
				this.getView().byId("ID_TBL_VIEW_PROV_STORLOC").getModel("StorLocViewSet").refresh();
			}
		},
		onLivChngPlant: function (oEvent) {
			if (oEvent.getParameter("newValue") !== "") {
				oEvent.getSource()._getBindingContext("PlantViewSet").getObject().VS = "None";
				oEvent.getSource()._getBindingContext("PlantViewSet").getObject().VST = "";
				this.getView().byId("ID_TBL_VIEW_PROV_PLANT").getModel("PlantViewSet").refresh();
			}
		},
		onLivChngPlantName: function (oEvent) {
			if (oEvent.getParameter("newValue") !== "") {
				oEvent.getSource()._getBindingContext("PlantViewSet").getObject().VSName = "None";
				oEvent.getSource()._getBindingContext("PlantViewSet").getObject().VSTName = "";
				this.getView().byId("ID_TBL_VIEW_PROV_PLANT").getModel("PlantViewSet").refresh();
			}
		},
		onLivChngMG2: function (oEvent) {
			if (oEvent.getParameter("newValue") !== "") {
				oEvent.getSource()._getBindingContext("MaterialGrpTwoViewSet").getObject().VS = "None";
				oEvent.getSource()._getBindingContext("MaterialGrpTwoViewSet").getObject().VST = "";
				this.getView().byId("ID_TBL_VIEW_PROV_MAT_GRP_TWO").getModel("MaterialGrpTwoViewSet").refresh();
			}
		},
		onLivChngMG2Name: function (oEvent) {
			if (oEvent.getParameter("newValue") !== "") {
				oEvent.getSource()._getBindingContext("MaterialGrpTwoViewSet").getObject().VSName = "None";
				oEvent.getSource()._getBindingContext("MaterialGrpTwoViewSet").getObject().VSTName = "";
				this.getView().byId("ID_TBL_VIEW_PROV_MAT_GRP_TWO").getModel("MaterialGrpTwoViewSet").refresh();
			}
		},
		onLivChngMG3: function (oEvent) {
			if (oEvent.getParameter("newValue") !== "") {
				oEvent.getSource()._getBindingContext("MaterialGrpThreeViewSet").getObject().VS = "None";
				oEvent.getSource()._getBindingContext("MaterialGrpThreeViewSet").getObject().VST = "";
				this.getView().byId("ID_TBL_VIEW_PROV_MAT_GRP_THREE").getModel("MaterialGrpThreeViewSet").refresh();
			}
		},
		onLivChngMG3Name: function (oEvent) {
			if (oEvent.getParameter("newValue") !== "") {
				oEvent.getSource()._getBindingContext("MaterialGrpThreeViewSet").getObject().VSName = "None";
				oEvent.getSource()._getBindingContext("MaterialGrpThreeViewSet").getObject().VSTName = "";
				this.getView().byId("ID_TBL_VIEW_PROV_MAT_GRP_THREE").getModel("MaterialGrpThreeViewSet").refresh();
			}
		},
		onLivChngMG5: function (oEvent) {
			if (oEvent.getParameter("newValue") !== "") {
				oEvent.getSource()._getBindingContext("MaterialGrpFiveViewSet").getObject().VS = "None";
				oEvent.getSource()._getBindingContext("MaterialGrpFiveViewSet").getObject().VST = "";
				this.getView().byId("ID_TBL_VIEW_PROV_MAT_GRP_FIVE").getModel("MaterialGrpFiveViewSet").refresh();
			}
		},
		onLivChngMG5Name: function (oEvent) {
			if (oEvent.getParameter("newValue") !== "") {
				oEvent.getSource()._getBindingContext("MaterialGrpFiveViewSet").getObject().VSName = "None";
				oEvent.getSource()._getBindingContext("MaterialGrpFiveViewSet").getObject().VSTName = "";
				this.getView().byId("ID_TBL_VIEW_PROV_MAT_GRP_FIVE").getModel("MaterialGrpFiveViewSet").refresh();
			}
		},
		onLivChngPH1: function (oEvent) {
			if (oEvent.getParameter("newValue") !== "") {
				oEvent.getSource()._getBindingContext("ProdHierarchy1ViewSet").getObject().VS = "None";
				oEvent.getSource()._getBindingContext("ProdHierarchy1ViewSet").getObject().VST = "";
				this.getView().byId("ID_TBL_VIEW_PROV_PROD_HRCH_ONE").getModel("ProdHierarchy1ViewSet").refresh();
			}
		},
		onLivChngPH1Name: function (oEvent) {
			if (oEvent.getParameter("newValue") !== "") {
				oEvent.getSource()._getBindingContext("ProdHierarchy1ViewSet").getObject().VSName = "None";
				oEvent.getSource()._getBindingContext("ProdHierarchy1ViewSet").getObject().VSTName = "";
				this.getView().byId("ID_TBL_VIEW_PROV_PROD_HRCH_ONE").getModel("ProdHierarchy1ViewSet").refresh();
			}
		},
		onLivChngPH2: function (oEvent) {
			if (oEvent.getParameter("newValue") !== "") {
				oEvent.getSource()._getBindingContext("ProdHierarchy2ViewSet").getObject().VS = "None";
				oEvent.getSource()._getBindingContext("ProdHierarchy2ViewSet").getObject().VST = "";
				this.getView().byId("ID_TBL_VIEW_PROV_PROD_HRCH_TWO").getModel("ProdHierarchy2ViewSet").refresh();
			}
		},
		onLivChngPH2Name: function (oEvent) {
			if (oEvent.getParameter("newValue") !== "") {
				oEvent.getSource()._getBindingContext("ProdHierarchy2ViewSet").getObject().VSName = "None";
				oEvent.getSource()._getBindingContext("ProdHierarchy2ViewSet").getObject().VSTName = "";
				this.getView().byId("ID_TBL_VIEW_PROV_PROD_HRCH_TWO").getModel("ProdHierarchy2ViewSet").refresh();
			}
		},
		onLivChngPH4: function (oEvent) {
			if (oEvent.getParameter("newValue") !== "") {
				oEvent.getSource()._getBindingContext("ProdHierarchy4ViewSet").getObject().VS = "None";
				oEvent.getSource()._getBindingContext("ProdHierarchy4ViewSet").getObject().VST = "";
				this.getView().byId("ID_TBL_VIEW_PROV_PROD_HRCH_FOUR").getModel("ProdHierarchy4ViewSet").refresh();
			}
		},
		onLivChngPH4Name: function (oEvent) {
			if (oEvent.getParameter("newValue") !== "") {
				oEvent.getSource()._getBindingContext("ProdHierarchy4ViewSet").getObject().VSName = "None";
				oEvent.getSource()._getBindingContext("ProdHierarchy4ViewSet").getObject().VSTName = "";
				this.getView().byId("ID_TBL_VIEW_PROV_PROD_HRCH_FOUR").getModel("ProdHierarchy4ViewSet").refresh();
			}
		},
		onLivChngPH5: function (oEvent) {
			if (oEvent.getParameter("newValue") !== "") {
				oEvent.getSource()._getBindingContext("ProdHierarchy5ViewSet").getObject().VS = "None";
				oEvent.getSource()._getBindingContext("ProdHierarchy5ViewSet").getObject().VST = "";
				this.getView().byId("ID_TBL_VIEW_PROV_PROD_HRCH_FIVE").getModel("ProdHierarchy5ViewSet").refresh();
			}
		},
		onLivChngPH5Name: function (oEvent) {
			if (oEvent.getParameter("newValue") !== "") {
				oEvent.getSource()._getBindingContext("ProdHierarchy5ViewSet").getObject().VSName = "None";
				oEvent.getSource()._getBindingContext("ProdHierarchy5ViewSet").getObject().VSTName = "";
				this.getView().byId("ID_TBL_VIEW_PROV_PROD_HRCH_FIVE").getModel("ProdHierarchy5ViewSet").refresh();
			}
		},
		onLivChngPH6: function (oEvent) {
			if (oEvent.getParameter("newValue") !== "") {
				oEvent.getSource()._getBindingContext("ProdHierarchy6ViewSet").getObject().VS = "None";
				oEvent.getSource()._getBindingContext("ProdHierarchy6ViewSet").getObject().VST = "";
				this.getView().byId("ID_TBL_VIEW_PROV_PROD_HRCH_SIX").getModel("ProdHierarchy6ViewSet").refresh();
			}
		},
		onLivChngPH6Name: function (oEvent) {
			if (oEvent.getParameter("newValue") !== "") {
				oEvent.getSource()._getBindingContext("ProdHierarchy6ViewSet").getObject().VSName = "None";
				oEvent.getSource()._getBindingContext("ProdHierarchy6ViewSet").getObject().VSTName = "";
				this.getView().byId("ID_TBL_VIEW_PROV_PROD_HRCH_SIX").getModel("ProdHierarchy6ViewSet").refresh();
			}
		},

		onLivChngPH7: function (oEvent) {
			if (oEvent.getParameter("newValue") !== "") {
				oEvent.getSource()._getBindingContext("ProdHierarchy7ViewSet").getObject().VS = "None";
				oEvent.getSource()._getBindingContext("ProdHierarchy7ViewSet").getObject().VST = "";
				this.getView().byId("ID_TBL_VIEW_PROV_PROD_HRCH_SEVEN").getModel("ProdHierarchy7ViewSet").refresh();
			}
		},
		onLivChngPH7Name: function (oEvent) {
			if (oEvent.getParameter("newValue") !== "") {
				oEvent.getSource()._getBindingContext("ProdHierarchy7ViewSet").getObject().VSName = "None";
				oEvent.getSource()._getBindingContext("ProdHierarchy7ViewSet").getObject().VSTName = "";
				this.getView().byId("ID_TBL_VIEW_PROV_PROD_HRCH_SEVEN").getModel("ProdHierarchy7ViewSet").refresh();
			}
		},
		onLivChngCG: function (oEvent) {
			if (oEvent.getParameter("newValue") !== "") {
				oEvent.getSource()._getBindingContext("CusGrpViewSet").getObject().VS = "None";
				oEvent.getSource()._getBindingContext("CusGrpViewSet").getObject().VST = "";
				this.getView().byId("ID_TBL_VIEW_PROV_CUS_GRP").getModel("CusGrpViewSet").refresh();
			}
		},
		onLivChngCGName: function (oEvent) {
			if (oEvent.getParameter("newValue") !== "") {
				oEvent.getSource()._getBindingContext("CusGrpViewSet").getObject().VSName = "None";
				oEvent.getSource()._getBindingContext("CusGrpViewSet").getObject().VSTName = "";
				this.getView().byId("ID_TBL_VIEW_PROV_CUS_GRP").getModel("CusGrpViewSet").refresh();
			}
		},

		onLivChngCG1: function (oEvent) {
			if (oEvent.getParameter("newValue") !== "") {
				oEvent.getSource()._getBindingContext("CusGrp1ViewSet").getObject().VS = "None";
				oEvent.getSource()._getBindingContext("CusGrp1ViewSet").getObject().VST = "";
				this.getView().byId("ID_TBL_VIEW_PROV_CUS_GRP_ONE").getModel("CusGrp1ViewSet").refresh();
			}
		},
		onLivChngCG1Name: function (oEvent) {
			if (oEvent.getParameter("newValue") !== "") {
				oEvent.getSource()._getBindingContext("CusGrp1ViewSet").getObject().VSName = "None";
				oEvent.getSource()._getBindingContext("CusGrp1ViewSet").getObject().VSTName = "";
				this.getView().byId("ID_TBL_VIEW_PROV_CUS_GRP_ONE").getModel("CusGrp1ViewSet").refresh();
			}
		},
		onLivChngCG2: function (oEvent) {
			if (oEvent.getParameter("newValue") !== "") {
				oEvent.getSource()._getBindingContext("CusGrp2ViewSet").getObject().VS = "None";
				oEvent.getSource()._getBindingContext("CusGrp2ViewSet").getObject().VST = "";
				this.getView().byId("ID_TBL_VIEW_PROV_CUS_GRP_TWO").getModel("CusGrp2ViewSet").refresh();
			}
		},
		onLivChngCG2Name: function (oEvent) {
			if (oEvent.getParameter("newValue") !== "") {
				oEvent.getSource()._getBindingContext("CusGrp2ViewSet").getObject().VSName = "None";
				oEvent.getSource()._getBindingContext("CusGrp2ViewSet").getObject().VSTName = "";
				this.getView().byId("ID_TBL_VIEW_PROV_CUS_GRP_TWO").getModel("CusGrp2ViewSet").refresh();
			}
		},
		onLivChngCG3: function (oEvent) {
			if (oEvent.getParameter("newValue") !== "") {
				oEvent.getSource()._getBindingContext("CusGrp3ViewSet").getObject().VS = "None";
				oEvent.getSource()._getBindingContext("CusGrp3ViewSet").getObject().VST = "";
				this.getView().byId("ID_TBL_VIEW_PROV_CUS_GRP_THREE").getModel("CusGrp3ViewSet").refresh();
			}
		},
		onLivChngCG3Name: function (oEvent) {
			if (oEvent.getParameter("newValue") !== "") {
				oEvent.getSource()._getBindingContext("CusGrp3ViewSet").getObject().VSName = "None";
				oEvent.getSource()._getBindingContext("CusGrp3ViewSet").getObject().VSTName = "";
				this.getView().byId("ID_TBL_VIEW_PROV_CUS_GRP_THREE").getModel("CusGrp3ViewSet").refresh();
			}
		},
		onLivChngCG4: function (oEvent) {
			if (oEvent.getParameter("newValue") !== "") {
				oEvent.getSource()._getBindingContext("CusGrp4ViewSet").getObject().VS = "None";
				oEvent.getSource()._getBindingContext("CusGrp4ViewSet").getObject().VST = "";
				this.getView().byId("ID_TBL_VIEW_PROV_CUS_GRP_FOUR").getModel("CusGrp4ViewSet").refresh();
			}
		},
		onLivChngCG4Name: function (oEvent) {
			if (oEvent.getParameter("newValue") !== "") {
				oEvent.getSource()._getBindingContext("CusGrp4ViewSet").getObject().VSName = "None";
				oEvent.getSource()._getBindingContext("CusGrp4ViewSet").getObject().VSTName = "";
				this.getView().byId("ID_TBL_VIEW_PROV_CUS_GRP_FOUR").getModel("CusGrp4ViewSet").refresh();
			}
		},
		onLivChngCG5: function (oEvent) {
			if (oEvent.getParameter("newValue") !== "") {
				oEvent.getSource()._getBindingContext("CusGrp5ViewSet").getObject().VS = "None";
				oEvent.getSource()._getBindingContext("CusGrp5ViewSet").getObject().VST = "";
				this.getView().byId("ID_TBL_VIEW_PROV_CUS_GRP_FIVE").getModel("CusGrp5ViewSet").refresh();
			}
		},
		onLivChngCG5Name: function (oEvent) {
			if (oEvent.getParameter("newValue") !== "") {
				oEvent.getSource()._getBindingContext("CusGrp5ViewSet").getObject().VSName = "None";
				oEvent.getSource()._getBindingContext("CusGrp5ViewSet").getObject().VSTName = "";
				this.getView().byId("ID_TBL_VIEW_PROV_CUS_GRP_FIVE").getModel("CusGrp5ViewSet").refresh();
			}
		},
		onLivChngMat: function (oEvent) {
			if (oEvent.getParameter("newValue") !== "") {
				oEvent.getSource()._getBindingContext("MaterialViewSet").getObject().VS = "None";
				oEvent.getSource()._getBindingContext("MaterialViewSet").getObject().VST = "";
				this.getView().byId("ID_TBL_VIEW_PROV_MAT").getModel("MaterialViewSet").refresh();
			}
		},
		onLivChngMatName: function (oEvent) {
			if (oEvent.getParameter("newValue") !== "") {
				oEvent.getSource()._getBindingContext("MaterialViewSet").getObject().VSName = "None";
				oEvent.getSource()._getBindingContext("MaterialViewSet").getObject().VSTName = "";
				this.getView().byId("ID_TBL_VIEW_PROV_MAT").getModel("MaterialViewSet").refresh();
			}
		},
		onCancelDialog: function (oEvent) {
			oEvent.getSource().getBinding("items").filter([]);
		}

	});

});