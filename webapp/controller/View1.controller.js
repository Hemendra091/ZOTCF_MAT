sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";

    return Controller.extend("zotcfscanmat.controller.View1", {
        onInit() {
            var oMatDetail = {
                items: [
                    {
                        rma: "R1",
                        mat: "M1",
                        batch: "B1"
                    }, {
                        rma: "R1",
                        mat: "M2",
                        batch: "B2"
                    }, {
                        rma: "R1",
                        mat: "M3",
                        batch: "B3"
                    }, {
                        rma: "R2",
                        mat: "M1",
                        batch: "B1"
                    }, {
                        rma: "R2",
                        mat: "M2",
                        batch: "B2"
                    }, {
                        rma: "R2",
                        mat: "M3",
                        batch: "B3"
                    }, {
                        rma: "R3",
                        mat: "M1",
                        batch: "B1"
                    }, {
                        rma: "R3",
                        mat: "M2",
                        batch: "B2"
                    }, {
                        rma: "R3",
                        mat: "M3",
                        batch: "B3"
                    }, {
                        rma: "R4",
                        mat: "M1",
                        batch: "B1"
                    }, {
                        rma: "R4",
                        mat: "M2",
                        batch: "B2"
                    }, {
                        rma: "R4",
                        mat: "M3",
                        batch: "B3"
                    }
                ]
            };
            var oJsonModel = new sap.ui.model.json.JSONModel(oMatDetail);
            this.getView().setModel(oJsonModel, "oMaterialModel");
            var oJsonModel2 = new sap.ui.model.json.JSONModel({ items: [] });
            this.getView().setModel(oJsonModel2, "oScanModel");
        },

        onClickScan: function(){
            var oRMAControl = this.getView().byId("idrmano");
            var sRMANo = oRMAControl.getValue();
            if(sRMANo) {
                oRMAControl.setValueState("None");
                this.getView().byId("idComapretext").setValue("");
                setTimeout(function () {
                    this.getView().byId("idMaterialNo").focus();
                }.bind(this), 500);
            } else {
                oRMAControl.setValueState("Error");
            }
            
            // this.getView().byId("idMaterialNo").focus();
        },

        onOpenScanDialog: function (oEvent) {
            var oRMAControl = this.getView().byId("idrmano");
            var sRMANo = oRMAControl.getValue();
            var oMatData = this.getView().getModel("oMaterialModel").getData();
            if (oMatData.items.filter(e => e.rma === sRMANo).length) {
                oRMAControl.setValueState("None");
                if (!this.oMPDialog) {
                    this.oMPDialog = this.loadFragment({
                        name: "zotcfscanmat.view.Scan"
                    });
                }
                this.oMPDialog.then(function (oDialog) {
                    this.oDialog = oDialog;
                    this.oDialog.open();
                    setTimeout(function () {
                        oDialog.getContent()[0].getItems()[0].getAggregation("form").getFormContainers()[0].getFormElements()[0].getFields()[0].setValue("");
                        oDialog.getContent()[0].getItems()[0].getAggregation("form").getFormContainers()[0].getFormElements()[1].getFields()[0].setValue("");
                        oDialog.getContent()[0].getItems()[0].getAggregation("form").getFormContainers()[0].getFormElements()[2].getFields()[0].setValue("");

                        oDialog.getContent()[0].getItems()[0].getAggregation("form").getFormContainers()[0].getFormElements()[0].getFields()[0].focus();

                    }.bind(oDialog), 500);
                }.bind(this));
            } else {
                oRMAControl.setValueState("Error");
            }
            // create dialog lazily

        },

        onCloseScanDialog: function (oEvent) {
            this.oDialog.close();
        },

        onScanMaterial: function (oEvt) {
            var sRmaNo = this.getView().byId("idrmano").getValue();
            var sMaterial = oEvt.getParameter("value");

            // var oMatData = this.getView().getModel("oMaterialModel").getData();
            // var selectedMat = oMatData.items.filter(e => e.rma === sRmaNo && e.mat === sMaterial).length ? oMatData.items.filter(e => e.rma === sRmaNo && e.mat === sMaterial)[0] : undefined;
            // if (selectedMat) {
            //     this.getView().byId("idBatchNo").setValue(selectedMat.batch);
            //     this.getView().byId("idQuantity").setValue(1);
            //     // this.oDialog.getContent()[0].getItems()[0].getAggregation("form").getFormContainers()[0].getFormElements()[1].getFields()[0].setValue(selectedMat.batch);
            //     // this.oDialog.getContent()[0].getItems()[0].getAggregation("form").getFormContainers()[0].getFormElements()[2].getFields()[0].setValue(1);
            // }

        },

        onPushScanMaterial: function (oEvt) {
            var sRmaNo = this.getView().byId("idrmano").getValue();
            var sMaterial = oEvt.getParameter("value");
            if(sRmaNo && sMaterial) {
                var oScanData = this.getView().getModel("oScanModel").getData().items;
                if (oScanData.filter(e => e.rma === sRmaNo && e.mat === sMaterial).length) {
                    oScanData.filter(e => e.rma === sRmaNo && e.mat === sMaterial)[0].quantity += 1;
                } else {
                    oScanData.push({
                        rma: sRmaNo,
                        mat: sMaterial,
                        batch: "",
                        quantity: 1
                    });
                }
                this.getView().byId("idMaterialNo").setValue("");
                // this.getView().byId("idBatchNo").setValue("");
                // this.getView().byId("idQuantity").setValue("");
            }



            var oMatData = this.getView().getModel("oMaterialModel").getData();
            var selectedMat = oMatData.items.filter(e => e.rma === sRmaNo && e.mat === sMaterial).length ? oMatData.items.filter(e => e.rma === sRmaNo && e.mat === sMaterial)[0] : undefined;
            if (selectedMat) {
                var oScanData = this.getView().getModel("oScanModel").getData().items;
                if (oScanData.filter(e => e.rma === sRmaNo && e.mat === sMaterial).length) {
                    oScanData.filter(e => e.rma === sRmaNo && e.mat === sMaterial)[0].quantity += 1;
                } else {
                    selectedMat.quantity = 1;
                    oScanData.push(selectedMat);
                }
                this.getView().byId("idMaterialNo").setValue("");
                this.getView().byId("idBatchNo").setValue("");
                this.getView().byId("idQuantity").setValue("");
                // this.getView().byId("idMaterialNo").focus();
                // this.oDialog.getContent()[0].getItems()[0].getAggregation("form").getFormContainers()[0].getFormElements()[0].getFields()[0].setValue("");
                // this.oDialog.getContent()[0].getItems()[0].getAggregation("form").getFormContainers()[0].getFormElements()[1].getFields()[0].setValue("");
                // this.oDialog.getContent()[0].getItems()[0].getAggregation("form").getFormContainers()[0].getFormElements()[2].getFields()[0].setValue("");
            }

        },

        onShowScanItems: function () {
            if (!this.oShowScanDialog) {
                this.oShowScanDialog = this.loadFragment({
                    name: "zotcfscanmat.view.ShowScanItems"
                });
            }
            this.oShowScanDialog.then(function (oDialog) {
                oDialog.setModel(this.getView().getModel("oScanModel"));
                this.oItemsDialog = oDialog;
                this.getView().getModel("oScanModel").refresh()
                this.oItemsDialog.open();
            }.bind(this));
        },

        handleSearch: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			var oFilter = new sap.ui.model.Filter("Name", sap.ui.model.FilterOperator.Contains, sValue);
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter([oFilter]);
		},

        onDeleteItem: function (oEvt) {
            var oSelectedObj = oEvt.getSource().getBindingContext().getObject();
            var oScanData = this.getView().getModel("oScanModel").getData().items;
            // var aFilteredData = oScanData.filter(e => e.rma !== oSelectedObj.rma && e.mat !== oSelectedObj.mat);
            oScanData.splice(oScanData.findIndex(a => a.rma === oSelectedObj.rma && a.mat === oSelectedObj.mat ) , 1);
            this.getView().getModel("oScanModel").refresh();
        },

        onCompare: function(){
            var aScanData = this.getView().getModel("oScanModel").getData();
            var sScanData = JSON.stringify(aScanData);
            this.getView().byId("idComapretext").setValue(sScanData);
            this.getView().byId("idrmano").setValue("");
        }
    });
});