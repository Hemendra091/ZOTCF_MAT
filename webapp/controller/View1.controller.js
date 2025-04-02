sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/m/MessageToast'
], (Controller, MessageToast) => {
    "use strict";

    return Controller.extend("zotcfscanmat.controller.View1", {
        onInit() {
            var oJsonModel2 = new sap.ui.model.json.JSONModel({ HdrToItm: [], TotalScanQty: "0" });
            this.getView().setModel(oJsonModel2, "oScanModel");
        },

        onPressScanToggle: function (oEvt) {
            var oRMAControl = this.getView().byId("idrmano");
            var sRMANo = oRMAControl.getValue();
            // oMsgStrip = this.getView().byId("idScanStartMessage");

            if (oEvt.getParameter("pressed")) {
                // oMsgStrip.setVisible(false);
                oEvt.getSource().setText("Scan On")
                oEvt.getSource().setType("Accept")
                this.getView().getModel("oScanModel").setData({ HdrToItm: [], TotalScanQty: "0" });
                this.getView().getModel("oScanModel").refresh();
                oRMAControl.setValueState("None");
                oRMAControl.setValue("");
                this.getView().byId("idComapretext").setValue("");
                this.getView().byId("idLastScanMat").setText("");
                this.getView().byId("idLastScanBatch").setText("");
            } else {

                if (sRMANo) {
                    // oMsgStrip.setVisible(true);
                    oEvt.getSource().setText("Scanning...")
                    oEvt.getSource().setType("Reject")
                    oRMAControl.setValueState("None");
                    this.getView().byId("idComapretext").setValue("");
                    setTimeout(function () {
                        this.getView().byId("idMaterialNo").focus();
                    }.bind(this), 500);
                } else {
                    oRMAControl.setValueState("Error");
                }

            }
        },

        onPushScanMaterial: function (oEvt) {
            var sRmaNo = this.getView().byId("idrmano").getValue();
            var sMaterial = oEvt.getParameter("value");

            if (sRmaNo && sMaterial) {
                var oScanData = this.getView().getModel("oScanModel").getData().HdrToItm;
                if (oScanData.filter(e => e.Rma === sRmaNo && e.Matnr === sMaterial.substring(2, 16)).length) {
                    oScanData.filter(e => e.Rma === sRmaNo && e.Matnr === sMaterial.substring(2, 16))[0].ScanQty = String(Number(oScanData.filter(e => e.Rma === sRmaNo && e.Matnr === sMaterial.substring(2, 16))[0].ScanQty) + 1);
                    this.getView().byId("idLastScanMat").setText(oScanData.filter(e => e.Rma === sRmaNo && e.Matnr === sMaterial.substring(2, 16))[0].Matnr);
                    this.getView().byId("idLastScanBatch").setText(oScanData.filter(e => e.Rma === sRmaNo && e.Matnr === sMaterial.substring(2, 16))[0].Batch);

                } else {
                    oScanData.push({
                        Rma: sRmaNo,
                        Matnr: sMaterial.substring(2, 16),
                        Batch: sMaterial.substring(26, 35),
                        ScanQty: "1.000"
                    });


                    this.getView().byId("idLastScanMat").setText(sMaterial.substring(2, 16));
                    this.getView().byId("idLastScanBatch").setText(sMaterial.substring(26, 35));
                }
                var nTotal = String(Number(this.getView().getModel("oScanModel").getProperty("/TotalScanQty")) + 1);
                this.getView().getModel("oScanModel").setProperty("/TotalScanQty", nTotal);
                this.getView().byId("idMaterialNo").setValue("");
            }
        },

        onShowScanItems: function () {
            if (!this.oShowScanDialog) {
                this.oShowScanDialog = this.loadFragment({
                    name: "zotcfscanmat.view.ShowScanItems"
                });
            }
            this.oShowScanDialog.then(function (oDialog) {
                oDialog.setModel(this.getView().getModel("oScanModel"), "oScanModel");
                this.oItemsDialog = oDialog;
                this.getView().getModel("oScanModel").refresh()
                this.oItemsDialog.open();
            }.bind(this));
        },

        handleSearch: function (oEvent) {
            var sValue = oEvent.getParameter("value");
            var oFilter = new sap.ui.model.Filter("Matnr", sap.ui.model.FilterOperator.Contains, sValue);
            var oBinding = oEvent.getSource().getBinding("items");
            oBinding.filter([oFilter]);
        },

        onDeleteItem: function (oEvt) {
            var oSelectedObj = oEvt.getSource().getBindingContext().getObject();
            var oScanData = this.getView().getModel("oScanModel").getData().HdrToItm;
            oScanData.splice(oScanData.findIndex(a => a.Rma === oSelectedObj.Rma && a.Matnr === oSelectedObj.Matnr), 1);
            this.getView().getModel("oScanModel").refresh();
        },

        onCompare: function () {
            var sRMA = this.getView().byId("idrmano").getValue();
            if(sRMA) {
                var aScanData = this.getView().getModel("oScanModel").getData();
                var sScanData = JSON.stringify(aScanData);
                this.getView().byId("idComapretext").setValue(sScanData);
    
    
                var oModel = this.getView().getModel();
    
                aScanData.Rma = this.getView().byId("idrmano").getValue();
                oModel.create("/ZOTC_RETURN_SCANSet", aScanData, {
                    success: function (oRes) {
                        // debugger;
                        this.getView().byId("idComapretext").setValue(oRes.StatusText);
                        this.getView().byId("toggleScanButtonID").setText("Scan On")
                        this.getView().byId("toggleScanButtonID").setType("Accept")
                        this.getView().getModel("oScanModel").setData({ HdrToItm: [], TotalScanQty: "0" });
                        this.getView().getModel("oScanModel").refresh();
                        this.getView().byId("idrmano").setValueState("None");
                        this.getView().byId("idrmano").setValue("");
                        // this.getView().byId("idComapretext").setValue("");
                        this.getView().byId("idLastScanMat").setText("");
                        this.getView().byId("idLastScanBatch").setText("");
                        // MessageToast.show("Compare Completed - " + oRes.StatusText);
                        
                    }.bind(this),
                    error: function (oErr) {
                        // debugger;
                        this.getView().byId("idComapretext").setValue(oErr.StatusText);
                        this.getView().byId("toggleScanButtonID").setText("Scan On")
                        this.getView().byId("toggleScanButtonID").setType("Accept")
                        this.getView().getModel("oScanModel").setData({ HdrToItm: [], TotalScanQty: "0" });
                        this.getView().getModel("oScanModel").refresh();
                        this.getView().byId("idrmano").setValueState("None");
                        this.getView().byId("idrmano").setValue("");
                        // this.getView().byId("idComapretext").setValue("");
                        this.getView().byId("idLastScanMat").setText("");
                        this.getView().byId("idLastScanBatch").setText("");
                        // MessageToast.show("Error in Compare - " + oErr.StatusText);
                    }.bind(this)
                })
            } else {
                MessageToast.show("Provide RMA No.")
            }
           
        }
    });
});