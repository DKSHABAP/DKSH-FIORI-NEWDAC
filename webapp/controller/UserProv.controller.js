sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"../model/formatter",
	"sap/m/MessageBox",
	"sap/ui/model/json/JSONModel"
], function (Controller, formatter, MessageBox, JSONModel) {
	"use strict";
	return Controller.extend("com.incture.cherrywork.newdac.controller.UserProv", {
		formatter: formatter,
		onInit: function () {
			this.getView().byId("ID_TABLE_USR").setSticky([
				"ColumnHeaders",
				"HeaderToolbar"
			]);
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
					this.getAllUsers("sync");
					var oModelRef = new sap.ui.model.json.JSONModel({
						refreshUser: false
					});
					sap.ui.getCore().setModel(oModelRef, "refreshUserModel");
				}
			}
		},
		//read all user IAS
		getAllUsers: function (value) {
			var oBusyDialog = new sap.m.BusyDialog();
			oBusyDialog.open();
			var that = this;
			var fData = [];
			var sURL = "/UserManagement/scim/Groups?filter=displayName co \"DKSH_CC\"";
			this.getOwnerComponent().getApiModel("CCGroups", sURL, false).then(function (oGroup) {
				var aPromise = [];
				(oGroup.Resources || []).forEach(function (oResource, iIndex) {
					// (oResource.members || []).forEach(function (oMember, jIndex) {
					aPromise.push(new Promise(function (fnResolve, fnReject) {
						// var sURI = '/UserManagement/scim/Users?filter=groups.display co "DKSH_CC"';
						// var sURI = "/UserManagement/scim/Users/" + oMember.value;
						var sURI = "/UserManagement/scim/Users?filter=groups.display eq \"" + oResource.displayName + "\"";
						that.getOwnerComponent().getApiModelById("CCUsers/" + oResource.displayName, sURI, value === "sync").then(function (aData) {
							var resultData = {
								resources: []
							};
							aData.forEach(function (oResponse) {
								resultData.resources = resultData.resources.concat(oResponse.Resources);
							});
							if (resultData.resources) {
								var finalData = [];
								for (var i = 0; i < resultData.resources.length; i++) {
									var phoneNo = "";
									var country = "";
									if (resultData.resources[i].phoneNumbers) {
										if (resultData.resources[i].phoneNumbers.length > 0) {
											phoneNo = resultData.resources[i].phoneNumbers[0].value;
										}
									}
									// country
									if (resultData.resources[i].addresses) {
										if (resultData.resources[i].addresses.length > 0) {
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
									if (resultData.resources[i].userCustomAttributes) {
										var attributesArr = resultData.resources[i].userCustomAttributes.attributes;
										for (var a = 0; a < attributesArr.length; a++) {
											if (attributesArr[a].name === "customAttribute1") {
												salesOrgArr = attributesArr[a].value.split("@");
											}
										}
										for (var b = 0; b < attributesArr.length; b++) {
											if (attributesArr[b].name === "customAttribute2") {
												distributionChannel = attributesArr[b].value.split("@");
											}
										}
										for (var c = 0; c < attributesArr.length; c++) {
											if (attributesArr[c].name === "customAttribute3") {
												district = attributesArr[c].value.split("@");
											}
										}
										for (var d = 0; d < attributesArr.length; d++) {
											if (attributesArr[d].name === "customAttribute4") {
												materialGrp = attributesArr[d].value.split("@");
											}
										}
										for (var e = 0; e < attributesArr.length; e++) {
											if (attributesArr[e].name === "customAttribute5") {
												materialGrp4 = attributesArr[e].value.split("@");
											}
										}
										for (var f = 0; f < attributesArr.length; f++) {
											if (attributesArr[f].name === "customAttribute6") {
												custNoArr = attributesArr[f].value.split("@");
											}
										}
									}
									finalData.push({
										uuId: resultData.resources[i].id,
										schemas: resultData.resources[i].schemas,
										groups: resultData.resources[i].groups,
										id: resultData.resources[i]["urn:ietf:params:scim:schemas:extension:sap:2.0:User"].userId,
										familyName: resultData.resources[i].name.familyName,
										givenName: resultData.resources[i].name.givenName,
										emails: resultData.resources[i].emails[0].value,
										FullName: resultData.resources[i].name.givenName + " " + resultData.resources[i].name.familyName,
										active: resultData.resources[i].active,
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
								// oBusyDialog.close();
								fnResolve(finalData);
							} else {
								// sap.m.MessageToast.show(that.i18nModel.getResourceBundle().getText("syncNok"));
								// oBusyDialog.close();
								fnReject();
							}
						}, function (oError) {
							// sap.m.MessageToast.show(that.i18nModel.getResourceBundle().getText("syncNok"));
							// oBusyDialog.close();
							fnReject();
						});
					})); // });
				});
				if (aPromise.length > 0) {
					Promise.allSettled(aPromise).then(function (aResult) {
						if (value)
							sap.m.MessageToast.show(that.i18nModel.getResourceBundle().getText("syncOk"));
						aResult.forEach(function (oResult, iI) {
							if (oResult.status === "fulfilled") {
								fData.push(oResult.value);
							}
						});
						// fData.push(finalData);
						var mergedArr = [];
						fData.forEach(function (aData) {
							mergedArr = mergedArr.concat(aData);
						});
						var flags = {};
						var merged = mergedArr.filter(function (entry) {
							if (flags[entry.id]) {
								return false;
							}
							flags[entry.id] = true;
							return true;
						});
						merged.sort(function (j, k) {
							return j.id > k.id ? 1 : k.id > j.id ? -1 : 0;
						});
						var msgTotal = that.i18nModel.getProperty("userDetails");
						that.getView().byId("ID_TXT_HDR").setText(msgTotal + " (" + merged.length + ")");
						var oModelData = new sap.ui.model.json.JSONModel({
							results: merged
						});
						// oModelData.setSizeLimit(merged.length);
						that.getView().byId("ID_TABLE_USR").setModel(oModelData, "UsetTableSet");
						if (value === "sync") {
							jQuery.ajax({
								type: "POST",
								data: JSON.stringify({
									Resources: merged
								}),
								contentType: "application/json",
								url: "/DKSHJavaService/userDetails/syncWithHana",
								dataType: "json",
								async: true,
								success: function (jqXHR, textStatus, res) {
									sap.m.MessageToast.show(that.i18nModel.getResourceBundle().getText("syncOk"));
									oBusyDialog.close();
								},
								error: function (error) {
									sap.m.MessageToast.show(that.i18nModel.getResourceBundle().getText("syncNok"));
									oBusyDialog.close();
								}
							});
						} else {
							oBusyDialog.close();
						}
					});
				} else {
					sap.m.MessageToast.show(that.i18nModel.getResourceBundle().getText("syncNok"));
					oBusyDialog.close();
				}
			});
		},
		refreshBtnUser: function () {
			this.getAllUsers();
		},
		syncBtnUser: function () {
			this.getAllUsers("sync");
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
					groupArr.push(selectObj.groups[i].display);
				}
			}
			var oModel = new sap.ui.model.json.JSONModel({
				uuId: selectObj.uuId,
				schemas: selectObj.schemas,
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
			if (oEvent.getSource().getProperty("src") === "sap-icon://display") {
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
			this.getView().byId("ID_PAGE_USER_PR").setVisible(true); // var sURL = '/UserManagement/scim/Groups?filter=displayName co "DKSH_CC"';
			// this.getOwnerComponent().getApiModel("CCGroups", sURL, false);
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
				actions: [
					sap.m.MessageBox.Action.YES,
					sap.m.MessageBox.Action.NO
				],
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
			var oFilter = new sap.ui.model.Filter([
				new sap.ui.model.Filter("id", sap.ui.model.FilterOperator.Contains, value),
				new sap.ui.model.Filter("FullName", sap.ui.model.FilterOperator.Contains, value),
				new sap.ui.model.Filter("emails", sap.ui.model.FilterOperator.Contains, value),
				new sap.ui.model.Filter("phoneNumbers", sap.ui.model.FilterOperator.Contains, value)
			]);
			filters.push(oFilter);
			var oBinding = this.getView().byId("ID_TABLE_USR").getBinding("items");
			oBinding.filter(filters);
			var msgTotal = that.i18nModel.getProperty("userDetails");
			that.getView().byId("ID_TXT_HDR").setText(msgTotal + " (" + oBinding.getLength() + ")"); //	this.getView().byId("").setText()
		},
		//function to pop up delete confirmation box
		onDeleteUser: function (oEvent) {
			var that = this;
			var oContextObj = oEvent.getSource().getBindingContext("UsetTableSet").getObject();
			var oUserId = oContextObj.id;
			var oName = oContextObj.givenName + " " + oContextObj.familyName;
			sap.m.MessageBox.confirm("Are you sure you want to delete - " + oName + " (" + oUserId + ")", {
				styleClass: "sapUiSizeCompact",
				actions: [
					sap.m.MessageBox.Action.YES,
					sap.m.MessageBox.Action.NO
				],
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
					that.getAllUsers();
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
						actions: [
							sap.m.MessageBox.Action.YES,
							sap.m.MessageBox.Action.NO
						],
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
									title: "Confirm",
									type: "Message",
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
										text: "Cancel",
										press: function () {
											oDialog.close(); // busyDialog.close();
										}
									}),
									afterClose: function () {
										oDialog.destroy();
									}
								});
								oDialog.open();
							}
						}
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
					// if (res.status === 200) {
					// 	sap.m.MessageToast.show(jqXHR.responseText);
					// } else {
					// 	sap.m.MessageToast.show(jqXHR.responseText);
					// }
					sap.m.MessageToast.show(that.i18nModel.getResourceBundle().getText("removePO", [
						postData.permissionObjectGuid.length,
						postData.userId
					]));
					that.assignUNPODialog.close();
				},
				error: function (jqXHR, textStatus, errorThrown) {
					//	sap.m.MessageToast.show("Error in checking");
					// sap.m.MessageToast.show(jqXHR.responseText);
					that.assignUNPODialog.close();
					// if (jqXHR.status.includes("40")) {
					var resp = jqXHR.responseText;
					var oMsg = resp;
					sap.m.MessageToast.show(oMsg); // }
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
								title: "Confirm",
								type: "Message",
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
									text: "Cancel",
									press: function () {
										oDialog.close(); // busyDialog.close();
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
					}
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
					sap.m.MessageToast.show(oMsg); // }
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
			}); // this.getRouter().navTo("CreatePermissionObject");
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
					selectedText;
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
			this.downloadUser.close(); // 	}
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
			var oFilter = new sap.ui.model.Filter([
				new sap.ui.model.Filter("domainCode", sap.ui.model.FilterOperator.Contains, value),
				new sap.ui.model.Filter("permissionObjectText", sap.ui.model.FilterOperator.Contains, value)
			]);
			filters.push(oFilter);
			if (oEvent.getSource().getParent().getId() == "idDlgaddPo") {
				var oBinding = sap.ui.getCore().byId("assignTable").getBinding("items");
			} else {
				var oBinding = sap.ui.getCore().byId("unassignTable").getBinding("items");
			}
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
			,
		/**
		 *@memberOf com.incture.cherrywork.newdac.controller.UserProv
		 */
		onChangeStatus: function (oEvent) {
			//This code was generated by the layout editor.
			var that = this;
			var oContextObj = oEvent.getSource().getBindingContext("UsetTableSet").getObject();
			var oUserId = oContextObj.id;
			var oName = oContextObj.givenName + " " + oContextObj.familyName;
			var oPayload = {
				id: oContextObj.uuId,
				status: oContextObj.active ? false : true
			};
			var sMessage = oContextObj.active ? this.i18nModel.getResourceBundle().getText("deactivatePopup", [oName, oUserId]) : this.i18nModel
				.getResourceBundle().getText("activatePopup", [oName, oUserId]);
			var sToast = oContextObj.active ? this.i18nModel.getResourceBundle().getText("deactivateToast") : this.i18nModel.getResourceBundle()
				.getText("activateToast");
			sap.m.MessageBox.confirm(sMessage, {
				styleClass: "sapUiSizeCompact",
				actions: [
					sap.m.MessageBox.Action.YES,
					sap.m.MessageBox.Action.NO
				],
				initialFocus: MessageBox.Action.NO,
				onClose: function (oAction) {
					if (oAction === "YES") {
						jQuery.ajax({
							type: "PUT",
							data: JSON.stringify(oPayload),
							contentType: "application/json",
							url: "/DKSHJavaService/CCUser",
							dataType: "json",
							async: false,
							success: function (jqXHR, textStatus, res) {
								oContextObj.active = oPayload.status;
								that.getView().byId("ID_TABLE_USR").getModel("UsetTableSet").refresh();
								sap.m.MessageToast.show(sToast);
							},
							error: function (jqXHR, textStatus, errorThrown) {
								//	sap.m.MessageToast.show("Error in checking");
								// if (jqXHR.responseText.includes("already assigned")) {
								var resp = jqXHR.responseText;
								var oMsg = resp;
								sap.m.MessageToast.show(oMsg); // }
							}
						});
					}
				}
			});
		}
	});
});