sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"../model/formatter",
	"sap/m/MessageBox",
	"sap/ui/model/json/JSONModel"
], function (Controller, formatter, MessageBox, JSONModel) {
	"use strict";
	return Controller.extend("com.incture.cherrywork.newdac.controller.UserProv", {
		formatter: formatter,
		
		// TEMP-TEST 18082022 (begin)
		garrUsersOri: [],
		gvarItemAll: "",
		gvarItemCounts: "",
		gvTestNum: 0,
		// TEMP-TEST 18082022 (begin)
		
		onInit: function () {
			this.getView().byId("ID_TABLE_USR").setSticky(["ColumnHeaders", "HeaderToolbar"]);
			var oModelRef = new sap.ui.model.json.JSONModel({
				refreshUser: true
			});
			sap.ui.getCore().setModel(oModelRef, "refreshUserModel");
			var router = sap.ui.core.UIComponent.getRouterFor(this);
			router.attachRoutePatternMatched(this._handleRouteMatched, this);
		},

		_handleRouteMatched: function (oEvent) {
			var userModel = new sap.ui.model.json.JSONModel("/services/userapi/currentUser", "", false);
			sap.ui.getCore().setModel(userModel, "userapi");
			var refrs = sap.ui.getCore().getModel("refreshUserModel").getData();
			this.i18nModel = this.getView().getModel("i18n");
			if (oEvent.getParameter("name") === "RouteUserProv") {
				if (refrs.refreshUser) {
					this.getView().byId("ID_PROV_USER_DET_M").setValue("");
					
					// TEMP-TEST 18082022 (begin)
					// this.getAllUsers();
					// Below to temporary get 300+ users
					this.gvTestNum = 0;
					var oStartIndex = 0; 
					this.onHandleGetUsers(oStartIndex);
					// TEMP-TEST 18082022 (end)
					
					var oModelRef = new sap.ui.model.json.JSONModel({
						refreshUser: false
					});
					sap.ui.getCore().setModel(oModelRef, "refreshUserModel");
				}
			}
		},
		
		// TEMP-TEST 18082022 (begin)
		onHandleGetUsers: function(oStartIndex,oSync)
		{
			var that = this;
			this.onFetchUserByGroup(oStartIndex, function(oResponse){
				if( oResponse.callfunction === "success" )
				{
					var oStartIndexNext;
					var aData = oResponse.datareturn;
					var totalItem = aData.totalResults;
					var resource = aData.Resources;
					var lastIndexResrc = resource.length;
					
					if( that.garrUsersOri.length === 0 )
					{
						that.gvarItemAll = totalItem;
						that.garrUsersOri = resource;
						that.gvarItemCounts = lastIndexResrc +1;
						that.onHandleGetUsers(that.gvarItemCounts);
					}
					
					else
					{
						that.gvarItemCounts = that.gvarItemCounts + lastIndexResrc;
						if( that.garrUsersOri.length < parseInt(that.gvarItemAll,10) && that.garrUsersOri.length !== parseInt(that.gvarItemAll,10) )
						{
							for( var i=0; i<resource.length; i++ )
							{
								that.garrUsersOri.push(resource[i]);
								if( resource.length === i+1 )
								{ 
									oStartIndexNext = that.gvarItemCounts;
									if( that.garrUsersOri.length === parseInt(that.gvarItemAll,10) )
									{
										var oArrayUsers = JSON.parse(JSON.stringify( that.garrUsersOri )); 
										// Here modify check array users call function 
										// that.onCheckUsers(oArray);
										// if(oSync === "sync"){ sap.m.MessageToast.show("Sync of HANA and IAS users are done successfully"); } 
									}
									else
									{
										// 15082022 Original codes commented
										// that.onHandleGetUsers(oStartIndexNext);
										
										// 15082022 Test
										if( that.gvTestNum === 0 ){
											oStartIndexNext = 201;
											that.gvTestNum = that.gvTestNum+1;
											that.onHandleGetUsers(oStartIndexNext);
										}
										else if( that.gvTestNum === 1 ){
											oStartIndexNext = 301;
											that.gvTestNum = that.gvTestNum+1;
											that.onHandleGetUsers(oStartIndexNext);
										}
										else if( that.gvTestNum === 2 ){
											var oArray = JSON.parse(JSON.stringify( that.garrUsersOri )); 
											that.onCheckUsers(oArray);
											if(oSync === "sync"){ sap.m.MessageToast.show("Sync of HANA and IAS users are done successfully"); } 
										}
									}
								}
							}
						}
					}
				}
				else if( oResponse.callfunction === "error" )
				{
					sap.m.MessageToast.show("Test Error in Retrieving All Users");
				}
			});
		},
		// TEMP-TEST 18082022 (end)
		
		// TEMP-TEST 18082022 (begin)
		onFetchUserByGroup: function(oStartIndex, oCallback)
		{
			// Refer URL : 1."/IDPService/service/scim/Users" | 2."/IDPService/scim/Users" & parameters ?count=120&startIndex=50
			var oBusyDialog = new sap.m.BusyDialog();
			oBusyDialog.open();
			var oResponse = [];
			jQuery.ajax({
				type: "GET",
				url: "/IDPService/service/scim/Users",
				data: { startIndex: oStartIndex },
				// contentType: "application/json",
				// dataType: "json",
				async: false,
				success: function (data, textStatus, jqXHR) 
				{
					oBusyDialog.close();
					oResponse = { callfunction:"success" , datareturn:data };
					oCallback(oResponse);
				},
				error: function (jqXHR, textStatus, errorThrown) 
				{
					oBusyDialog.close();
					oResponse = { callfunction:"error" , datareturn:[] };
					oCallback(oResponse);
				}
			});
		},
		// TEMP-TEST 18082022 (end)
		
		// TEMP-TEST 18082022 (begin)
		onCheckUsers: function(oArrayUsers)
		{
			var that = this;
			var fData = [];
			if(oArrayUsers) 
			{
				var finalData = [];
				for (var i = 0; i < oArrayUsers.length; i++) 
				{
					var phoneNo = "";
					var country = "";
					if (oArrayUsers[i].phoneNumbers !== null || oArrayUsers[i].phoneNumbers !== undefined ) 
					{
						if (oArrayUsers[i].phoneNumbers !== undefined) {
							phoneNo = oArrayUsers[i].phoneNumbers[0].value;
						}
					}
					// country
					if (oArrayUsers[i].addresses !== null || oArrayUsers[i].phoneNumbers !== undefined ) 
					{
						if (oArrayUsers[i].addresses !== undefined) {
							country = oArrayUsers[i].addresses[0].country;
						}
					}
					
					var salesOrgArr = [];
					var distributionChannel = [];
					var district = [];
					var materialGrp = [];
					var materialGrp4 = [];
					var custNoArr = [];
					var materialGrpOne = [];
					
					if (oArrayUsers[i]["userCustomAttributes"] !== undefined) 
					{
						var attributesArr = oArrayUsers[i]["userCustomAttributes"].attributes;
						
						for (var k = 0; k < attributesArr.length; k++) {
							if (attributesArr[k].name === "customAttribute1") {
								salesOrgArr = attributesArr[k].value.split("@");
							}
						}

						for (var k = 0; k < attributesArr.length; k++) {
							if (attributesArr[k].name === "customAttribute2") {
								distributionChannel = attributesArr[k].value.split("@");
							}
						}

						for (var k = 0; k < attributesArr.length; k++) {
							if (attributesArr[k].name === "customAttribute3") {
								district = attributesArr[k].value.split("@");
							}
						}

						for (var k = 0; k < attributesArr.length; k++) {
							if (attributesArr[k].name === "customAttribute4") {
								materialGrp = attributesArr[k].value.split("@");
							}
						}

						for (var k = 0; k < attributesArr.length; k++) {
							if (attributesArr[k].name === "customAttribute5") {
								materialGrp4 = attributesArr[k].value.split("@");
							}
						}

						for (var k = 0; k < attributesArr.length; k++) {
							if (attributesArr[k].name === "customAttribute6") {
								custNoArr = attributesArr[k].value.split("@");
							}
						}
					}
					
					finalData.push({
						groups: oArrayUsers[i].groups,
						id: oArrayUsers[i].id,
						familyName: oArrayUsers[i].name.familyName,
						givenName: oArrayUsers[i].name.givenName,
						emails: oArrayUsers[i].emails[0].value,
						FullName: oArrayUsers[i].name.givenName + " " + oArrayUsers[i].name.familyName,
						phoneNumbers: phoneNo,
						country: country,
						SalesOrganization: salesOrgArr,
						CustomerNumber: custNoArr,
						DistributionChannel: distributionChannel,
						District: district,
						MaterialGroup: materialGrp,
						MaterialGroupOne: materialGrpOne,
						MaterialGroup4: materialGrp4
					});
					
					fData.push(finalData);
					var mergedArr = [].concat.apply([], fData);

					var flags = {};
					var merged = mergedArr.filter(function (entry) {
						if (flags[entry.id]) {
							return false;
						}
						flags[entry.id] = true;
						return true;
					});

					merged.sort(function (a, b) {
						return (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0);
					});
					
					var msgTotal = that.i18nModel.getProperty("userDetails");
					that.getView().byId("ID_TXT_HDR").setText(msgTotal + " (" + merged.length + ")");
					var oModelData = new sap.ui.model.json.JSONModel({
						results: merged
					});
					oModelData.setSizeLimit(merged.length);
					that.getView().byId("ID_TABLE_USR").setModel(oModelData, "UsetTableSet");
				}
			}
		},
		// TEMP-TEST 18082022 (end)
		
		//read all user IAS
		getAllUsers: function (value) {
			var oBusyDialog = new sap.m.BusyDialog();
			oBusyDialog.open();
			var that = this;
			var itemsPerPage, totalResult;

			var fData = [];
			// var aData = jQuery.ajax({
			// 	type: "GET",
			// 	contentType: "application/json",
			// 	url: "/DKSHJavaService/dac/getUsers/1&100",
			// 	dataType: "json",
			// 	async: false,
			// 	success: function (data, textStatus, jqXHR) {
			// 		var resultData = data;
			// 		itemsPerPage = 100;
			// 		totalResult = resultData.totalResults;
			// 	},
			// 	error: function (textStatus, jqXHR) {
			// 		sap.m.MessageToast.show("Error in Retrieving All Users");
			// 		oBusyDialog.close();
			// 	}

			// });

			// for (var startInd = 0; startInd * itemsPerPage < totalResult; startInd++) {

			var aData = jQuery.ajax({
				type: "GET",
				contentType: "application/json",
				url: "/DKSHJavaService/userDetails/getUsers",
				// url: "/DKSHJavaService/dac/getUsers/" + startInd * itemsPerPage + "&100",
				/*	url: "/DKSHJavaService/dac/getUsers/101&100",*/
				dataType: "json",
				async: false,
				success: function (data, textStatus, jqXHR) {
					var resultData = data;

					if (resultData.resources) {
						if (value)
							sap.m.MessageToast.show("Sync of HANA and IAS users are done successfully");
						var finalData = [];
						for (var i = 0; i < resultData.resources.length; i++) {
							var phoneNo = "";
							var country = "";
							if (resultData.resources[i].phoneNumbers !== null) {
								if (resultData.resources[i].phoneNumbers[0] !== undefined) {
									phoneNo = resultData.resources[i].phoneNumbers[0].value;
								}
							}
							// country
							if (resultData.resources[i].addresses !== null) {
								if (resultData.resources[i].addresses[0] !== undefined) {
									country = resultData.resources[i].addresses[0].country;
								}
							}

							var salesOrgArr = [];
							var distributionChannel = [];
							var district = [];
							var materialGrp = [];
							var materialGrp4 = [];
							var custNoArr = [];
							var materialGrpOne = [];
							if (resultData.resources[i]["userCustomAttributes"] !== null) {
								var attributesArr = resultData.resources[i]["userCustomAttributes"].attributes;

								for (var k = 0; k < attributesArr.length; k++) {
									if (attributesArr[k].name === "customAttribute1") {
										salesOrgArr = attributesArr[k].value.split("@");
									}
								}

								for (var k = 0; k < attributesArr.length; k++) {
									if (attributesArr[k].name === "customAttribute2") {
										distributionChannel = attributesArr[k].value.split("@");
									}
								}

								for (var k = 0; k < attributesArr.length; k++) {
									if (attributesArr[k].name === "customAttribute3") {
										district = attributesArr[k].value.split("@");
									}
								}

								for (var k = 0; k < attributesArr.length; k++) {
									if (attributesArr[k].name === "customAttribute4") {
										materialGrp = attributesArr[k].value.split("@");
									}
								}

								for (var k = 0; k < attributesArr.length; k++) {
									if (attributesArr[k].name === "customAttribute5") {
										materialGrp4 = attributesArr[k].value.split("@");
									}
								}

								for (var k = 0; k < attributesArr.length; k++) {
									if (attributesArr[k].name === "customAttribute6") {
										custNoArr = attributesArr[k].value.split("@");
									}
								}

							}
							finalData.push({
								groups: resultData.resources[i].groups,
								id: resultData.resources[i].id,
								familyName: resultData.resources[i].name.familyName,
								givenName: resultData.resources[i].name.givenName,
								emails: resultData.resources[i].emails[0].value,
								FullName: resultData.resources[i].name.givenName + " " + resultData.resources[i].name.familyName,
								phoneNumbers: phoneNo,
								country: country,
								SalesOrganization: salesOrgArr,
								CustomerNumber: custNoArr,
								DistributionChannel: distributionChannel,
								District: district,
								MaterialGroup: materialGrp,
								MaterialGroupOne: materialGrpOne,
								MaterialGroup4: materialGrp4
							});
						}
						fData.push(finalData);
						var mergedArr = [].concat.apply([], fData);

						var flags = {};
						var merged = mergedArr.filter(function (entry) {
							if (flags[entry.id]) {
								return false;
							}
							flags[entry.id] = true;
							return true;
						});

						merged.sort(function (a, b) {
							return (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0);
						});
						var msgTotal = that.i18nModel.getProperty("userDetails");
						that.getView().byId("ID_TXT_HDR").setText(msgTotal + " (" + merged.length + ")");
						var oModelData = new sap.ui.model.json.JSONModel({
							results: merged
						});
						oModelData.setSizeLimit(merged.length);
						that.getView().byId("ID_TABLE_USR").setModel(oModelData, "UsetTableSet");
						oBusyDialog.close();

						/*	that.getView().byId("ID_TXT_HDR").setText(msgTotal + " (" + finalData.length + ")");
							var oModelData = new sap.ui.model.json.JSONModel({
								results: finalData
							});
							oModelData.setSizeLimit(finalData.length);
							that.getView().byId("ID_TABLE_USR").setModel(oModelData, "UsetTableSet");
							oBusyDialog.close();*/
					} else {
						sap.m.MessageToast.show("Error in Retrieving All Users");
						oBusyDialog.close();
					}
				},
				error: function (jqXHR, textStatus, errorThrown) {
					sap.m.MessageToast.show("Error in Retrieving All Users");
					oBusyDialog.close();
				}
			});

			// }

		},

		refreshBtnUser: function () 
		{
			// TEMP-TEST 18082022 (begin)
			// this.getAllUsers();
			this.gvTestNum = 0;
			var oStartIndex = 0; 
			this.onHandleGetUsers(oStartIndex);
			// TEMP-TEST 18082022 (end)
		},
		syncBtnUser: function () 
		{
			// TEMP-TEST 18082022 (begin)
			// this.getAllUsers("sync");
			this.gvTestNum = 0;
			var oStartIndex = 0; 
			this.onHandleGetUsers(oStartIndex,"sync");
			// TEMP-TEST 18082022 (end)
		},

		//on update cancel
		onPressCancelUpdateUserFrag: function () {
			this.oUpdateIOPUserDialog.close();
		},

		//on user update
		onUserUpdate: function (oEvent) {
			//for 
			var that = this;
			var oBusyDialog = new sap.m.BusyDialog();
			oBusyDialog.open();
			var selectObj = oEvent.getSource().getBindingContext("UsetTableSet").getObject();
			var groupArr = [];
			if (selectObj.groups !== null) {
				for (var i = 0; i < selectObj.groups.length; i++) {
					groupArr.push(selectObj.groups[i].value);
				}
			}
			var oModel = new sap.ui.model.json.JSONModel({
				id: selectObj.id ? selectObj.id : "",
				groupSelected: groupArr,
				groupValueState: "None",
				firstNameValueState: "None",
				firstName: selectObj.givenName ? selectObj.givenName : "",
				lastName: selectObj.familyName ? selectObj.familyName : "",
				lastNameValueState: "None",
				email: selectObj.emails ? selectObj.emails : "",
				emailValueState: "None",
				selectedCountry: selectObj.country ? selectObj.country : "",
				countryValueState: "None",
				phoneNo: selectObj.phoneNumbers ? selectObj.phoneNumbers : "",
				SalesOrganization: selectObj.SalesOrganization,
				CustomerNumber: selectObj.CustomerNumber,
				DistributionChannel: selectObj.DistributionChannel,
				District: selectObj.District,
				MaterialGroup: selectObj.MaterialGroup,
				MaterialGroupOne: selectObj.MaterialGroupOne,
				MaterialGroup4: selectObj.MaterialGroup4
			});
			sap.ui.getCore().setModel(oModel, "UpdateCreateUserModelSet");

			if (oEvent.getSource().mProperties.src === "sap-icon://display") {
				var oModelCrUpd = new sap.ui.model.json.JSONModel({
					UpdateCreateInd: "Display",
					Create: false,
					Update: false,
					Display: true,
					EditableField: false,
					showPO: true
				});
				sap.ui.getCore().setModel(oModelCrUpd, "UpdateCreateIndModel");
			} else {

				var oModelCrUpd1 = new sap.ui.model.json.JSONModel({
					UpdateCreateInd: "Update",
					Create: false,
					Update: true,
					Display: false,
					EditableField: true,
					showPO: true
				});
				sap.ui.getCore().setModel(oModelCrUpd1, "UpdateCreateIndModel");
			}

			var router = sap.ui.core.UIComponent.getRouterFor(that);
			router.navTo("Create", {
				contextPath: selectObj.id
			});
			oBusyDialog.close();
		},

		//on User Create Button
		onUserCreate: function () {

			var oModel = new sap.ui.model.json.JSONModel({
				id: "",
				group: "",
				groupValueState: "None",
				firstNameValueState: "None",
				firstName: "",
				lastName: "",
				lastNameValueState: "None",
				email: "",
				emailValueState: "None",
				selectedCountry: "",
				countryValueState: "None",
				phoneNo: "",
				SalesOrganization: []
			});
			sap.ui.getCore().setModel(oModel, "UpdateCreateUserModelSet");

			var oModelCrUpd = new sap.ui.model.json.JSONModel({
				UpdateCreateInd: "Create",
				Create: true,
				Update: false,
				Display: false,
				EditableField: true,
				showPO: false
			});
			sap.ui.getCore().setModel(oModelCrUpd, "UpdateCreateIndModel");

			var router = sap.ui.core.UIComponent.getRouterFor(this);
			router.navTo("Create", {
				contextPath: "New"
			});

		},

		onPressCancelUserFrag: function () {
			this.oCreateIOPUserDialog.close();
		},
		onBeforeRendering: function () {
			this.i18nModel = this.getView().getModel("i18n");
		},
		//on after Rendering
		onAfterRendering: function () {
			this.i18nModel = this.getView().getModel("i18n");
			this.oModel = this.getView().getModel("SalesOrganization");
			this.oModelMaterial = this.getView().getModel("MaterialModel");
			this.getView().byId("ID_PAGE_USER_PR").setVisible(false);
			this.getView().byId("ID_PAGE_USER_PR").setVisible(true);
		},

		//function to open Reset password confirmation box
		onResetPwd: function (oEvent) {
			var that = this;
			var oContextObj = oEvent.getSource().getBindingContext("UsetTableSet").getObject();
			var oName = oContextObj.givenName + " " + oContextObj.familyName;
			var oUserId = oContextObj.id;
			var oEmailId = oContextObj.emails;
			var oMsg = "Are you sure you want to reset password for : " + oName + " (" + oUserId + ") ?";
			sap.m.MessageBox.confirm(oMsg, {
				styleClass: "sapUiSizeCompact",
				actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
				initialFocus: MessageBox.Action.NO,
				onClose: function (oAction) {
					if (oAction === "YES") {
						that.triggerResetPwdServ(oName, oUserId, oEmailId);
					}
				}
			});
		},

		//function to send reset password link to the Email ID
		triggerResetPwdServ: function (oName, oUserId, oEmailId) {
			var sUrl = "/IDPService/service/users/forgotPassword";
			var oPayload = {
				"identifier": oEmailId
			};
			var oHeader = {
				"Content-Type": "application/json; charset=utf-8"
			};
			var oModel = new sap.ui.model.json.JSONModel();
			var oBusyDialog = new sap.m.BusyDialog();
			oBusyDialog.open();
			oModel.loadData(sUrl, JSON.stringify(oPayload), true, "POST", false, false, oHeader);
			oModel.attachRequestCompleted(function (oEvent) {
				oBusyDialog.close();
				sap.m.MessageBox.success("Reset Password link has been sent to the Email ID -  " + oEmailId);
			});
			oModel.attachRequestFailed(function (oEvent) {
				oBusyDialog.close();
				sap.m.MessageBox.error(oEvent.getParameters().errorobject.responseText);
			});
		},

		//on search user Details
		onSearchUserList: function (oEvent) {
			var that = this;
			var value = oEvent.getParameters().newValue;
			var filters = [];
			var oFilter = new sap.ui.model.Filter([new sap.ui.model.Filter("id", sap.ui.model.FilterOperator.Contains, value),
				new sap.ui.model.Filter("FullName", sap.ui.model.FilterOperator.Contains, value),
				new sap.ui.model.Filter("emails", sap.ui.model.FilterOperator.Contains, value),
				new sap.ui.model.Filter("phoneNumbers", sap.ui.model.FilterOperator.Contains, value)

			]);
			filters.push(oFilter);
			var oBinding = this.getView().byId("ID_TABLE_USR").getBinding("items");
			oBinding.filter(filters);
			var msgTotal = that.i18nModel.getProperty("userDetails");
			that.getView().byId("ID_TXT_HDR").setText(msgTotal + " (" + oBinding.getLength() + ")");

			//	this.getView().byId("").setText()

		},

		//function to pop up delete confirmation box
		onDeleteUser: function (oEvent) {
			var that = this;
			var oContextObj = oEvent.getSource().getBindingContext("UsetTableSet").getObject();
			var oUserId = oContextObj.id;
			var oName = oContextObj.givenName + " " + oContextObj.familyName;
			sap.m.MessageBox.confirm("Are you sure you want to delete - " + oName + " (" + oUserId + ")", {
				styleClass: "sapUiSizeCompact",
				actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
				initialFocus: MessageBox.Action.NO,
				onClose: function (oAction) {
					if (oAction === "YES") {
						that.triggerDeleteUserServ(oName, oUserId, oContextObj);
					}
				}
			});
		},

		//function to delete User
		triggerDeleteUserServ: function (oName, oUserId, oUserData) {
			var that = this;
			var oUrl = "/IDPService/service/scim/Users/" + oUserId;
			var oBusyDialog = new sap.m.BusyDialog();
			oBusyDialog.open();
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.loadData(oUrl, null, true, "DELETE", false, false);
			oModel.attachRequestCompleted(function (oEvent) {
				oBusyDialog.close();
				if (oEvent.getParameter("success")) {
					jQuery.ajax({
						type: "DELETE",
						contentType: "application/json",
						url: "/DKSHJavaService/userDetails/deleteByUserPid/" + oUserId,
						async: false,
						success: function (data, textStatus, jqXHR) {},
						error: function (data, textStatus, jqXHR) {}
					});
					
					// TEMP-TEST 18082022 (begin)
					// that.getAllUsers();
					that.gvTestNum = 0;
					var oStartIndex = 0; 
					that.onHandleGetUsers(oStartIndex);
					// TEMP-TEST 18082022 (end)
					
					sap.m.MessageToast.show(oName + " (" + oUserId + ")" + " is deleted successfully");
				} else {
					var oMsg = oEvent.getParameters().errorobject.responseText;
					sap.m.MessageBox.error(oMsg);
				}
			});
			oModel.attachRequestFailed(function (oEvent) {
				var sStatus = oEvent.getParameters();
				var oMsg = sStatus.errorobject.responseText;
				oBusyDialog.close();
				sap.m.MessageBox.error(oMsg);
			});
		},

		//on press assigned groups
		onPressAssignedGroup: function (oEvent) {
			if (!this.groupsForAssingFrag) {
				this.groupsForAssingFrag = sap.ui.xmlfragment("com.incture.cherrywork.newdac.fragments.GroupsList", this);
				this.getView().addDependent(this.groupsForAssingFrag);
			}

			var selectedObj = oEvent.getSource().getBindingContext("UsetTableSet").getObject();
			if (selectedObj.groups !== undefined) {
				var oModel = new sap.ui.model.json.JSONModel({
					"results": selectedObj.groups
				});
				this.groupsForAssingFrag.setModel(oModel, "groupsModelSet");
				this.groupsForAssingFrag.openBy(oEvent.getSource());
			} else {
				var msg = this.i18nModel.getProperty("groupsAreNotAssignedForthisUser");
				sap.m.MessageToast.show(msg);
			}
		},

		//back to launchpad
		handleBack: function () {
			var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
			oCrossAppNavigator.toExternal({
				target: {
					semanticObject: "",
					action: ""
				}
			});
		},

		onViewPO: function () {
			// sap.m.MessageBox.information("Please select a domain to maintain permission object from the list");
			sap.ui.core.UIComponent.getRouterFor(this).navTo("masterView");
		},
		onAssignPo: function (oEvent) {
			var that = this;
			var selectObj = oEvent.getSource().getBindingContext("UsetTableSet").getObject();
			this.sSelectObj = selectObj;
			var aPOModel = new JSONModel();
			var aData = jQuery.ajax({
				type: "GET",
				contentType: "application/json",
				url: "/DKSHJavaService/userDetails/findAllAvailablePermObjects/" + selectObj.id,
				// url: "/DKSHJavaService/dac/getAllPermissionObjects",
				dataType: "json",
				async: false,
				success: function (data, textStatus, jqXHR) {
					// aPOModel.setData({
					// 	cData: data,
					// 	userId: selectObj.id ? selectObj.id : "",
					// 	email: selectObj.emails ? selectObj.emails : "",
					// 	project: "pp",
					// 	permissionId: []
					// });
					aPOModel.setSizeLimit(1000);
					aPOModel.setData(data);

				}

			});
			if (!that.assignPODialog) {

				that.assignPODialog = sap.ui.xmlfragment("com.incture.cherrywork.newdac.fragments.AddPOtoUsers", that);
				/*	that.assignPODialog.setModel(aPOModel, "aPOModel");*/
				that.getView().addDependent(that.assignPODialog);
			}
			that.assignPODialog.setModel(aPOModel, "aPOModel");
			var msgTitle = that.i18nModel.getProperty("AddPOFragTitle");
			sap.ui.getCore().byId("idDlgaddPo").setTitle(msgTitle + " " + selectObj.id);
			that.assignPODialog.open();
		},
		onUnAssignPo: function (oEvent) {

			var that = this;
			var selectObj = oEvent.getSource().getBindingContext("UsetTableSet").getObject();
			this.sSelectObj = selectObj;
			var aUPOModel = new JSONModel();
			var aData = jQuery.ajax({
				type: "GET",
				contentType: "application/json",
				url: "/DKSHJavaService/userDetails/findAllPermissionObjects/" + selectObj.id,
				// url: "/DKSHJavaService/dac/getAllPermissionObjects",
				dataType: "json",
				async: false,
				success: function (data, textStatus, jqXHR) {
					aUPOModel.setSizeLimit(1000);
					aUPOModel.setData(data);
				}
			});
			if (!that.assignUNPODialog) {
				that.assignUNPODialog = sap.ui.xmlfragment("com.incture.cherrywork.newdac.fragments.UnAssignPO", that);
				that.getView().addDependent(that.assignUNPODialog);
			}
			that.assignUNPODialog.setModel(aUPOModel, "aUPOModel");
			var msgTitle = that.i18nModel.getProperty("RemovePOFragTitle");
			that.assignUNPODialog.setTitle(msgTitle + " " + selectObj.id);
			that.assignUNPODialog.open();
		},
		onPressUNCancelFrg: function () {
			this.assignUNPODialog.close();
			sap.ui.getCore().byId("unassignSearchId").setValue("");
		},
		onConfirmUNAddPos: function () {
			var that = this,
				finalPOModelData = this.assignUNPODialog.getModel("aUPOModel"),
				data = this.assignUNPODialog.getContent()[1]._aSelectedPaths,
				oUserId = this.sSelectObj.id,
				permArray = [];
			if (data.length === 0) {
				sap.m.MessageBox.information("Please select a permission object from the list to UnAssign");
			} else {
				for (var i = 0; i < data.length; i++) {
					permArray.push(finalPOModelData.getProperty(data[i] + "/permissionObjectGuid"));
				}
				var postData = {
					"userId": oUserId,
					"domainId": "cc",
					"permissionObjectGuid": permArray
				};
				if (data.length == this.assignUNPODialog.getModel("aUPOModel").getData().length) {
					sap.m.MessageBox.information("All permission objects will be removed", {
						styleClass: "sapUiSizeCompact",
						actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
						initialFocus: MessageBox.Action.NO,
						onClose: function (oAction) {
							if (oAction === "YES") {
								that.removePO(postData);
							}
						}
					});
				} else {
					var newarray = $.extend(true, [], finalPOModelData.getData());
					for (var i = 0; i < data.length; i++) {
						var index = data[i].split("/").pop();
						newarray[index] = "";
					}
					for (var i = 0; i < newarray.length; i++) {
						if (newarray[i] == "")
							newarray.splice(i, 1);
					}
					var postArray = [];
					for (var i = 0; i < newarray.length; i++) {
						postArray.push(newarray[i].permissionObjectGuid);
					}

					jQuery.ajax({
						type: "POST",
						data: JSON.stringify(postArray),
						contentType: "application/json",
						url: "/DKSHJavaService/permissionObject/findEmptyAttributeForPermObjects",
						dataType: "json",
						async: false,
						success: function (jqXHR, textStatus, res) {
							that.removePO(postData);
						},
						error: function (error) {
							if (error.status == 200 && error.responseText.includes("Valid")) {
								that.removePO(postData);
							} else {
								var oDialog = new sap.m.Dialog({
									title: 'Confirm',
									type: 'Message',
									content: [new sap.m.Text({
										text: error.responseText
									})],
									beginButton: new sap.m.Button({
										type: sap.m.ButtonType.Default,
										text: "Confirm",
										press: function () {
											// busyDialog.open();
											that.removePO(postData);
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
							}
						},

						// var userName = sap.ui.getCore().getModel("userapi").getData().name;
					});

				}
			}
		},
		removePO: function (postData) {
			var that = this;
			jQuery.ajax({
				type: "POST",
				data: JSON.stringify(postData),
				contentType: "application/json",
				url: "/DKSHJavaService/userPrivilages/unassignPermissionObjects",
				dataType: "json",
				async: false,
				success: function (jqXHR, textStatus, res) {
					if (res.status === 200) {
						sap.m.MessageToast.show(jqXHR.responseText);
					} else {
						sap.m.MessageToast.show(jqXHR.responseText);
					}
					that.assignUNPODialog.close();
				},
				error: function (jqXHR, textStatus, errorThrown) {
					//	sap.m.MessageToast.show("Error in checking");
					// sap.m.MessageToast.show(jqXHR.responseText);
					that.assignUNPODialog.close();
					// if (jqXHR.status.includes("40")) {
					var resp = jqXHR.responseText;
					var oMsg = resp;
					sap.m.MessageToast.show(oMsg);
					// }
				}
			});
		},
		handleSelectionFinish: function (oEvent) {
			var y = 0;
		},
		onConfirmAddPos: function (oEvent) {
			var that = this,
				finalPOModelData = this.assignPODialog.getModel("aPOModel"),
				data = this.assignPODialog.getContent()[1]._aSelectedPaths,
				oUserId = this.sSelectObj.id,
				permArray = [];
			if (data.length === 0) {
				sap.m.MessageBox.information("Please select a permission object from the list to assign");
			} else {
				for (var i = 0; i < data.length; i++) {
					permArray.push(finalPOModelData.getProperty(data[i] + "/permissionObjectGuid"));
				}
				var postData = {
					"userId": oUserId,
					"permissionObjectGuid": permArray
				};
				jQuery.ajax({
					type: "POST",
					data: JSON.stringify(permArray),
					contentType: "application/json",
					url: "/DKSHJavaService/permissionObject/findEmptyAttributeForPermObjects",
					dataType: "json",
					async: false,
					success: function (jqXHR, textStatus, res) {
						that.addPO(postData);
					},
					error: function (error) {
						if (error.responseText.includes("assigned")) {
							var oDialog = new sap.m.Dialog({
								title: 'Confirm',
								type: 'Message',
								content: [new sap.m.Text({
									text: error.responseText
								})],
								beginButton: new sap.m.Button({
									type: sap.m.ButtonType.Default,
									text: "Confirm",
									press: function () {
										// busyDialog.open();
										that.addPO(postData);
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
						} else if (error.status == 200) {
							that.addPO(postData);
						}
					},

					// var userName = sap.ui.getCore().getModel("userapi").getData().name;
				});
			}
		},
		addPO: function (postData) {
			var that = this;
			jQuery.ajax({
				type: "POST",
				data: JSON.stringify(postData),
				contentType: "application/json",
				url: "/DKSHJavaService/userPrivilages/assignPermissionObjects",
				dataType: "json",
				async: false,
				success: function (jqXHR, textStatus, res) {
					if (res.status === 200) {
						sap.m.MessageToast.show("P");
					} else {
						sap.m.MessageToast.show("Permission Object added to user");
					}
					that.assignPODialog.close();
				},
				error: function (jqXHR, textStatus, errorThrown) {
					//	sap.m.MessageToast.show("Error in checking");
					// if (jqXHR.responseText.includes("already assigned")) {
					var resp = jqXHR.responseText;
					var oMsg = resp;
					sap.m.MessageToast.show(oMsg);
					// }
				}

			});
		},
		onPressCancelFrg: function () {
			this.assignPODialog.close();
			sap.ui.getCore().byId("assignSearchId").setValue("");
		},
		downloadUserRights: function (oEvent) {
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
					that.downloadUser = sap.ui.xmlfragment("com.incture.cherrywork.newdac.fragments.downloadUser", that);
					that.downloadUser.open();
					that.downloadUser.setModel(that.getView().getModel("domainModel"), "domainModel");
				}
			});
			// this.getRouter().navTo("CreatePermissionObject");

		},
		onDownloadFrag: function (oEvent) {
			var selectedText = oEvent.getSource().getProperty("title");
			var a = window.location.host;
			a = a.split(".")[0].split("-").pop();
			if (a != "cdd660bcb")
				var url = "https://dkshsoservices" + a + ".ap1.hana.ondemand.com/connect_client_phase-II/userDetails/downloadExcelForRights/" +
					selectedText;
			else
				var url = "https://connectclientcdd660bcb.ap1.hana.ondemand.com/connect_client_phase-II/userDetails/downloadExcelForRights/" +
					selectedText
			window.open(url, "_self");
			// var that = this;
			// jQuery.ajax({
			// 	type: "GET",
			// 	contentType: "application/json",
			// 	url: "/DKSHJavaService/userDetails/downloadExcelForRights/" + selectedText,
			// 	dataType: "json",
			// 	async: false,
			// 	success: function (data, textStatus, jqXHR) {
			// 		that.downloadUser.close();
			// 	},
			// 	error: function (textStatus, jqXHR) {
			this.downloadUser.close();
			// 	}
			// });
		},
		onCancelFrag: function () {
			this.downloadUser.close();
		},
		assignFreeSearch: function (oEvent) {
			var value;
			if (oEvent.getParameters().newValue === undefined) {
				value = oEvent.getParameters().query;
			} else {
				value = oEvent.getParameters().newValue;
			}
			var filters = [];
			var oFilter = new sap.ui.model.Filter([new sap.ui.model.Filter("domainCode", sap.ui.model.FilterOperator.Contains, value),
				new sap.ui.model.Filter("permissionObjectText", sap.ui.model.FilterOperator.Contains, value)
			]);
			filters.push(oFilter);
			if (oEvent.getSource().getParent().getId() == "idDlgaddPo")
				var oBinding = sap.ui.getCore().byId("assignTable").getBinding("items");
			else
				var oBinding = sap.ui.getCore().byId("unassignTable").getBinding("items");
			oBinding.filter(filters);

		},
		onCopyUsers: function () {
				var that = this;

				var aPOModel = new JSONModel();
				aPOModel.loadData("model/userid.json");
				if (!that.copyUsers) {
					that.copyUsers = sap.ui.xmlfragment("com.incture.cherrywork.newdac.fragments.CopyPOToUsers", that);
					that.copyUsers.setModel(aPOModel);
					that.getView().addDependent(that.copyUsers);
				}
				that.copyUsers.open();
			}
			/*,
				onExit: function () {
					this.assignPODialog.destroy();

				}*/
	});
});