var Table_LetterOfCredit;
/* Date -: 10-06-2022
 * function Implemted to save Trade Pricing LETTER OF CREDIT Data. 
 */
var TradePricing_CustomerId;
var TablesSaveSatus;
var Isvalidate = false;
var IsExists = false;
var IsSave = false;
var IsCustomersave = false;


$(document).ready(function () {

    $("#BtnGetCustomerInfo").on('click', function (e) {
        if ($("#txt_tradeAprcode").val() == '') {
            toastr.error("Please Enter APR Code");
        }
        else {
            getAPRSCount("TradePricing");
        }
    });
    $('input[name=TradePriceType]').change(function () {

        if ($(this).val() === '0') {
            $("#accordian_customerdetails").css('display', 'none');
            $(".rblexisting").hide();
            $("#txtCutomerName").prop('disabled', false);
            $("#txtCutomerName").css('cursor', 'inherit');

        } else {
            //$("#accordian_customerdetails").show();
            $(".rblexisting").show();
            $("#txtCutomerName").prop('disabled', true);
            $("#txtCutomerName").css('cursor', 'not-allowed');
        }
        LoadAllTradeTables(0);
        $("#txt_tradeAprcode").val('');
        $("#txtCutomerName").val('');
        $("#txtPanNo").val('');

    });

    //$("#1_Charges_Proposed_Pricing").bind('blur', function () {        
    //    alert(this.value);
    //});
    //if ($("#TradePricing_CustomerId").val() == '') {
    //    TradePricing_CustomerId = 0;
    //} else {
    //    TradePricing_CustomerId = $("#TradePricing_CustomerId").val();
    //}
    //loadCustomerDetails(TradePricing_CustomerId);
    //loadTradeTable('tbl_TradePricing_LetterOfCredit', 'LETTER OF CREDIT', TradePricing_CustomerId);
    //loadTradeTable('tbl_TradePricing_Guarantee', 'GUARANTEE', TradePricing_CustomerId);
});

//$.fn.digits = function () {
//    return this.each(function () {
//        $(this).text($(this).text().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
//    })
//}

function LoadAllTradeTables(id) {
    loadTradeTable('tbl_TradePricing_LetterOfCredit', 'LETTER OF CREDIT', id);
    loadTradeTable('tbl_TradePricing_Guarantee', 'GUARANTEE', id);
    loadTradeTable('tbl_TradePricing_ImportBillsCollection', 'IMPORT_BILLS_COLLECTION', id);
    loadTradeTable('tbl_TradePricing_NonImportRemittances', 'NON_IMPORT_REMITTANCES', id);
    loadTradeTable('tbl_TradePricing_ExportBillsForCollection', 'EXPORT_BILLS_FOR_COLLECTION', id);
    loadTradeTable('tbl_TradePricing_LocalBills', 'LOCAL_BILLS', id);
    loadTradeTable('tbl_TradePricing_InwardRemittance', 'INWARD_REMITTANCE', id);
    loadTradeTable('tbl_TradePricing_CapitalAccountTransaction', 'CAPITAL_ACCOUNT_TRANSACTIONS', id);
    loadTradeTable('tbl_TradePricing_AllProduct', 'ALL_PRODUCTS', id);
    loadTradeTable('tbl_TradePricing_Miscellaneous', 'MISCELLANEOUS', id);
}
function GetTableStatus(CustomerId) {

    $.ajax({
        type: "GET",
        url: "/Comercials/GetTradePricingTableStatus?CustomerId=" + CustomerId,
        data: null,
        contentType: false,
        async: false,
        processData: false,
        success: function (response) {
            chkSession(response);
            if (response != null) {
                TablesSaveSatus = response;
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            event.preventDefault();
        }
    });
}

function loadTradeTable(tableId, TradeType, CustomerId) {

    $.ajax({
        type: "GET",
        url: "/Comercials/Get_TradePricingData?TradeType=" + TradeType + "&CustomerId=" + CustomerId,
        data: null,
        contentType: false,
        async: false,
        processData: false,
        success: function (response) {
            chkSession(response);
            if (response != null) {
                loadDataTable(tableId, response);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            event.preventDefault();
        }
    });
}



function loadCustomerDetails(CustomerId) {

    $.ajax({
        type: "GET",
        url: "/Comercials/Get_TradePricingData?TradeType=GetCustomerDetails&CustomerId=" + CustomerId,
        data: null,
        contentType: false,
        async: false,
        processData: false,
        success: function (response) {
            chkSession(response);
            if (response != null && response.length > 0) {

                $("#txtCutomerName").val(response[0].customerName);
                $("#txtPanNo").val(response[0].panNumber);
                $("#txt_Remark_TradePricing").val(response[0].remark);

                $("#divCommentsTrade").hide();
                if (response[0].comments != undefined && response[0].comments != '') {
                    $("#divCommentsTrade").show();
                    $("#txt_Comments_TradePricing").val(response[0].comments);
                }

                var Drp_Value = response[0].approverADID;
                $("#TP_DropDown_Level1").val(Drp_Value).trigger('chosen:updated');
                $("#LoginUserRole").val(response[0].empRole)
                TradePricing_CustomerId = response[0].id;
                var TradeType = response[0].customerType;
                $("input[name=TradePriceType][value=" + TradeType + "]").prop('checked', true);
                if (TradeType == '1') {
                    $("#accordian_customerdetails").css('display', 'block');
                    $(".rblexisting").show();
                    $("#BtnGetCustomerInfo_dv").hide();
                    $("#txt_tradeAprcode").val(response[0].apR_Code);
                    lbl_trade_proposalNo.innerText = response[0].proposalNumber;
                    lbl_trade_clientId.innerText = response[0].clientId;
                    lbl_trade_APRPFY.innerText = response[0].apR_PFY;
                    lbl_trade_APRYTD.innerText = response[0].apR_YTD;
                    lbl_trade_Vintage.innerText = response[0].vintage;

                }
                else {
                    $(".rblexisting").hide();
                    $("#accordian_customerdetails").css('display', 'none');
                    $(".rblexisting").hide();
                }

            } else {
                $("#txtCutomerName").val('');
                $("#txtPanNo").val('');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            event.preventDefault();
        }
    });
}

/*---------------Commong function added to load all DataTable.----------------- */

function loadDataTable(tableId, data) {

    /*--------------- Used to generate Columns array dynamically.----------------- */

    var col = [];
    for (var i = 0; i < 1; i++) {
        for (var key in data[i]) {
            if (col.indexOf(key) === -1) {
                var columnArray = {};
                columnArray.data = key;
                columnArray.title = key.toUpperCase();
                col.push(columnArray);
            }
        }
    }
    /* ------------ Used to generate Columns array dynamically.---------------- */


    /* ------------for all Grid Load common functaion added.---------------- */
    var isGroup = false;
    var isMatch = false;
    var pricing_Category = '';
    var datalist = data;
    $('#' + tableId).DataTable({
        data: data,
        columns: col,
        createdRow: function (row, data, dataIndex) {
            // $('td', row).eq(0).css('display', 'none');
            if (!isMatch || pricing_Category != data.pricing_Category) {
                pricing_Category = data.pricing_Category;
                isMatch = true;
                isGroup = false;
            }
            if (data.pricing_Category == pricing_Category && isMatch) {
                if (!isGroup) {
                    $('td', row).eq(1).attr('rowspan', datalist.filter(x => x.pricing_Category == pricing_Category).length);
                    isGroup = true;
                } else {
                    if (row.children[1].innerHTML == pricing_Category) {
                        row.children[1].remove();
                    }
                }

            } else {
                isMatch = false;
                isGroup = false;
            }
        },
        "columnDefs": [
            {
                "targets": [0],
                "searchable": false,
                'orderable': false,
                'width': '50px',
                "className": "d-none"
            },
            {
                "targets": 4,
                //"data": "description",
                "render": function (data, type, row, meta) {
                    var tradeType = $("input[type='radio'][name='TradePriceType']:checked").val();
                    if (tradeType == '0') {
                        return '<input disabled="disabled" style="cursor:not-allowed"  type="text" onblur="AddCommaSeperator(this)" onkeypress="return percentAllow(event)" id="' + row.id + '_ExistingPricing" value="' + (row.existing_Pricing == null ? '' : row.existing_Pricing) + '" class="existing-pricing">';

                    }
                    else {
                        return '<div data-tip="Example 56,000 or 5.6%"><input type="text" onblur="AddCommaSeperator(this)" onkeypress="return percentAllow(event)" id="' + row.id + '__Existing_Pricing"  value="' + (row.existing_Pricing == null ? '' : row.existing_Pricing) + '" class="existing-pricing"></div>';
                    }
                }
            }
            ,
            {
                "targets": 5,
                //"data": "description",
                "render": function (data, type, row, meta) {

                    return '<div data-tip="Example 56,000 or 5.6%"><input type="text" id="' + row.id + '_Proposed_Pricing" value="' + (row.proposed_Pricing == null ? '' : row.proposed_Pricing) + '" class="proposed_pricing" onblur="AddCommaSeperator(this)" onkeypress="return percentAllow(event)"></div>';

                }
            }
        ],
        "ordering": false,
        "paging": false,
        "info": false,
        "searching": false,
        fixedHeader: true,
        responsive: true,
        destroy: true,
        "processing": true,
        rowCallback: function (row, data) {

        }
    });
    /* ------------ Table Load .---------------- */
}

function AddCommaSeperator(Id) {
    var currentId = Id.id;
    if ($("#" + currentId).val() != '') {
        if ($("#" + currentId).val().length > 5) {
            var CurrentIdVal = $("#" + currentId).val().replaceAll(',', '');
            $("#" + currentId).val(parseFloat(CurrentIdVal, 10).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,").toString());
        }

    }
}

function TradePricingSubmitClick() {

    if (IsCustomersave == true) {

        var status = $("#TradePricing_status").val();
        if (status == 'Appoved') {
            toastr.error('Proposal is already Approved');
        }
        //else if (status == 'In Progress') {
        //    toastr.error('You are not allow to edit proposal as it is already in process');
        //}
        else {
            GetTableStatus($("#TradePricing_CustomerId").val());
            if (TablesSaveSatus[0].letterOfCredit == 0 || TablesSaveSatus[0].guarantee == 0 || TablesSaveSatus[0].imporT_BILLS_COLLECTION == 0 ||
                TablesSaveSatus[0].noN_IMPORT_REMITTANCES == 0 || TablesSaveSatus[0].exporT_BILLS_FOR_COLLECTION == 0 ||
                TablesSaveSatus[0].locaL_BILLS == 0 || TablesSaveSatus[0].inwarD_REMITTANCE == 0 || TablesSaveSatus[0].capitaL_ACCOUNT_TRANSACTIONS == 0 ||
                TablesSaveSatus[0].alL_PRODUCTS == 0 || TablesSaveSatus[0].miscellaneous == 0) {
                toastr.error('Please make sure all details are saved saved');
            }
            else {
                if ($("#txt_Remark_TradePricing").val() == '') {
                    toastr.error('Please enter remark');
                    return;
                }
                if ($("#TP_DropDown_Level1").val() == null || $("#TP_DropDown_Level1").val() == '') {
                    toastr.error('Please select approver');
                    return;
                }
                saveCutomerInfo();

                if (Isvalidate == true) {
                    var userRole = $("#LoginUserRole").val();
                    if (userRole != 'Cluster Head') {
                        toastr.success('Proposal Saved Successfully');
                    }

                    $("#sidebar_tradepricing").removeClass('opened');
                }
                else {
                    toastr.error('Something went wrong..Please try again later')
                }

            }

            //if (TablesSaveSatus[0].letterOfCredit == 0) {
            //    toastr.error('Please make sure Letter Of Credit is saved');
            //    return;
            //}
            //if (TablesSaveSatus[0].guarantee == 0) {
            //    toastr.error('Please make sure Guarantee is saved');
            //    return;
            //}
            //if (TablesSaveSatus[0].imporT_BILLS_COLLECTION == 0) {
            //    toastr.error('Please make sure Import Bills Collection/Under LC/Buyers Credit / DO is saved');
            //    return;
            //}
            //if (TablesSaveSatus[0].noN_IMPORT_REMITTANCES == 0) {
            //    toastr.error('Please make sure Non Import Remittances is saved');
            //    return;
            //}
            //if (TablesSaveSatus[0].exporT_BILLS_FOR_COLLECTION == 0) {
            //    toastr.error('Please make sure Export Bills For Collection/Discount/GR Waiver is saved');
            //    return;
            //}
            //if (TablesSaveSatus[0].locaL_BILLS == 0) {
            //    toastr.error('Please make sure Local Bills is saved');
            //    return;
            //}
            //if (TablesSaveSatus[0].inwarD_REMITTANCE == 0) {
            //    toastr.error('Please make sure Inward Remittance is saved');
            //    return;
            //}
            //if (TablesSaveSatus[0].capitaL_ACCOUNT_TRANSACTIONS == 0) {
            //    toastr.error('Please make sure Capital Account Transactions is saved');
            //    return;
            //}
            //if (TablesSaveSatus[0].alL_PRODUCTS == 0) {
            //    toastr.error('Please make sure All Products is saved');
            //    return;
            //}
            //if (TablesSaveSatus[0].miscellaneous == 0) {
            //    toastr.error('Please make sure Miscellaneous is saved');
            //    return;
            //}



        }

    }
    else {
        toastr.error('Please save Customer Name and PAN Number first');
    }

}
/*--------------------- LetterOfCredit Trade Save Implementaiton  ----------- */
$("#btn_Add_TradePricing").on('click', function (e) {
    TradePricingSubmitClick();
});


$("#BtnSaveTradePricingDetails").on('click', function (e) {

    var tradeType = $("input[type='radio'][name='TradePriceType']:checked").val();
    if (tradeType == '1') {
        if ($("#txt_tradeAprcode").val() == '') {
            toastr.error('Please Enter APR Code');
            return;
        }
        if ($("#txtCutomerName").val() == '') {
            toastr.error('Please Enter APR code and fetch the customer details');
            return;
        }
    }
    else {
        if ($("#txtCutomerName").val() == '') {
            toastr.error('Please Enter Customer Name');
            return;
        }
    }

    if ($("#txtPanNo").val() == undefined || $("#txtPanNo").val() == '') {
        toastr.error('Please Enter PAN Number');
        return;
    }
    var regex = /([A-Z]){5}([0-9]){4}([A-Z]){1}$/;
    if (regex.test($("#txtPanNo").val().toUpperCase())) {

    } else {
        toastr.error('Please Enter Valid PAN Number');
        return false;
    }


    saveCutomerInfo();
    if (Isvalidate == true) {
        IsCustomersave = true;
        toastr.success('Proposal Saved as Draft');
        enableAccordian();
        $('#TP_DropDown_Level1').prop('disabled', false);
        $('#txt_Remark_TradePricing').prop('disabled', false);

        //$("#sidebar_tradepricing").removeClass('opened');
    }
    //else if (IsExists == true) {
    //    toastr.error("Customer with this PAN Number is already exists");
    //}
    else {
        toastr.error('Something went wrong..Please try again later')
    }
});

$("#btnSave_TradePricing_LetterOfCredit").click(function () {
    debugger;
    var pricing_category = '';
    var IsFill = true;
    var tradeType = $("input[type='radio'][name='TradePriceType']:checked").val();
    if (IsCustomersave == true) {
        $('#tbl_TradePricing_LetterOfCredit tr').each(function (e) {

            if (tradeType == '0') {
                var colCount = this.childElementCount
                if (colCount == 6) {
                    if ($(this).find("td:eq(5) input[type='text']").val() == '') {
                        IsFill = false;
                    }
                }
                else {
                    if ($(this).find("td:eq(4) input[type='text']").val() == '') {
                        IsFill = false;
                    }
                }
            }
            else {
                if ($(this).find("td:eq(4) input[type='text']").val() == '' || $(this).find("td:eq(5) input[type='text']").val() == '') {
                    IsFill = false;
                }
            }

        });
        if (IsFill == true) {
            $('#tbl_TradePricing_LetterOfCredit tr').each(function (e) {
                //if (!this.rowIndex) return; // skip first row
                if (e != 0) {

                    if ($(this).find("td:eq(4) input[type='text']").length >= 1) {
                        if (this.childElementCount == 6) {
                            saveGridData('LetterOfCredit', $(this).find("td:eq(0)").text(), $(this).find("td:eq(1)").text(), $(this).find("td:eq(2)").text()
                                , $(this).find("td:eq(3)").text(), $(this).find("td:eq(4) input[type='text']").val()
                                , $(this).find("td:eq(5) input[type='text']").val()
                            );
                            pricing_category = $(this).find("td:eq(1)").text();
                        }
                        else {
                            saveGridData('LetterOfCredit', $(this).find("td:eq(0)").text(), pricing_category, $(this).find("td:eq(1)").text(), $(this).find("td:eq(2)").text()
                                , $(this).find("td:eq(3) input[type='text']").val(), $(this).find("td:eq(4) input[type='text']").val()
                            );
                        }


                    }
                }
            });
            if (IsSave == true) {
                toastr.success('Record Save Successfully')
                IsSave == false;
            }
        }
        else {
            toastr.error('Please make sure all fields are filled');
        }
    }
    else {
        toastr.error('Please save Customer Name and PAN Number first');
    }



});
/*--------------------- LetterOfCredit Trade Save Implementaiton  ----------- */

/*--------------------- Guarantee Trade Save Implementaiton  ----------- */
$("#btnSave_TradePricing_Guarantee").click(function () {

    var pricing_category = '';
    var IsFill = true;
    var tradeType = $("input[type='radio'][name='TradePriceType']:checked").val();
    if (IsCustomersave == true) {
        $('#tbl_TradePricing_Guarantee tr').each(function (e) {
            if (tradeType == '0') {
                var colCount = this.childElementCount
                if (colCount == 6) {
                    if ($(this).find("td:eq(5) input[type='text']").val() == '') {
                        IsFill = false;
                    }
                }
                else {
                    if ($(this).find("td:eq(4) input[type='text']").val() == '') {
                        IsFill = false;
                    }
                }

            }
            else {
                if ($(this).find("td:eq(4) input[type='text']").val() == '' || $(this).find("td:eq(5) input[type='text']").val() == '') {
                    IsFill = false;
                }
            }
        });
        if (IsFill == true) {
            $('#tbl_TradePricing_Guarantee tr').each(function (e) {
                //if (!this.rowIndex) return; // skip first row
                if (e != 0) {

                    if ($(this).find("td:eq(4) input[type='text']").length >= 1) {
                        if (this.childElementCount == 6) {
                            saveGridData('GUARANTEE', $(this).find("td:eq(0)").text(), $(this).find("td:eq(1)").text(), $(this).find("td:eq(2)").text()
                                , $(this).find("td:eq(3)").text(), $(this).find("td:eq(4) input[type='text']").val()
                                , $(this).find("td:eq(5) input[type='text']").val()
                            );
                            pricing_category = $(this).find("td:eq(1)").text();
                        }
                        else {
                            saveGridData('GUARANTEE', $(this).find("td:eq(0)").text(), pricing_category, $(this).find("td:eq(1)").text(), $(this).find("td:eq(2)").text()
                                , $(this).find("td:eq(3) input[type='text']").val(), $(this).find("td:eq(4) input[type='text']").val()
                            );
                        }
                    }
                }
            });

            if (IsSave == true) {
                toastr.success('Record Save Successfully');
                IsSave == false;
            }
        }
        else {
            toastr.error('Please make sure all fields are filled');
        }
    }
    else {
        toastr.error('Please save Customer Name and PAN Number first');
    }




});
/*--------------------- Guarantee Trade Save Implementaiton  ----------- */

/*--------------------- IMPORT_BILLS_COLLECTION Save Implementaiton  ----------- */
$("#btn_TradePricing_ImportBillsCollection").click(function () {
    var pricing_category = '';
    var IsFill = true;
    var FillCount = 0;
    var tradeType = $("input[type='radio'][name='TradePriceType']:checked").val();
    if (IsCustomersave == true) {
        $('#tbl_TradePricing_ImportBillsCollection tr').each(function (e) {
            if (tradeType == '0') {
                var colCount = this.childElementCount
                if (colCount == 6) {
                    if ($(this).find("td:eq(5) input[type='text']").val() == '') {
                        IsFill = false;
                    }
                }
                else {
                    if ($(this).find("td:eq(4) input[type='text']").val() == '') {
                        IsFill = false;
                    }
                }
            }
            else {
                if ($(this).find("td:eq(4) input[type='text']").val() == '' || $(this).find("td:eq(5) input[type='text']").val() == '') {
                    IsFill = false;
                }
            }
        });
        if (IsFill == true) {
            $('#tbl_TradePricing_ImportBillsCollection tr').each(function (e) {
                //if (!this.rowIndex) return; // skip first row
                if (e != 0) {

                    if ($(this).find("td:eq(4) input[type='text']").length >= 1) {
                        if (this.childElementCount == 6) {
                            saveGridData('IMPORT_BILLS_COLLECTION', $(this).find("td:eq(0)").text(), $(this).find("td:eq(1)").text(), $(this).find("td:eq(2)").text()
                                , $(this).find("td:eq(3)").text(), $(this).find("td:eq(4) input[type='text']").val()
                                , $(this).find("td:eq(5) input[type='text']").val()
                            );
                            pricing_category = $(this).find("td:eq(1)").text();
                        }
                        else {
                            saveGridData('IMPORT_BILLS_COLLECTION', $(this).find("td:eq(0)").text(), pricing_category, $(this).find("td:eq(1)").text(), $(this).find("td:eq(2)").text()
                                , $(this).find("td:eq(3) input[type='text']").val(), $(this).find("td:eq(4) input[type='text']").val()
                            );
                        }
                    }
                }
            });

            if (IsSave == true) {
                toastr.success('Record Save Successfully');
                IsSave == false;
            }
        }
        else {
            toastr.error('Please make sure all fields are filled');
        }
    }
    else {
        toastr.error('Please save Customer Name and PAN Number first');
    }




});
/*--------------------- IMPORT_BILLS_COLLECTION Save Implementaiton  ----------- */

/*--------------------- NON_IMPORT_REMITTANCES Save Implementaiton  ----------- */
$("#btn_TradePricing_NonImportRemittances").click(function () {
    var pricing_category = '';
    var IsFill = true;
    var tradeType = $("input[type='radio'][name='TradePriceType']:checked").val();
    if (IsCustomersave == true) {
        $('#tbl_TradePricing_NonImportRemittances tr').each(function (e) {
            if (tradeType == '0') {
                var colCount = this.childElementCount
                if (colCount == 6) {
                    if ($(this).find("td:eq(5) input[type='text']").val() == '') {
                        IsFill = false;
                    }
                }
                else {
                    if ($(this).find("td:eq(4) input[type='text']").val() == '') {
                        IsFill = false;
                    }
                }
            }
            else {
                if ($(this).find("td:eq(4) input[type='text']").val() == '' || $(this).find("td:eq(5) input[type='text']").val() == '') {
                    IsFill = false;
                }
            }
        });
        if (IsFill == true) {
            $('#tbl_TradePricing_NonImportRemittances tr').each(function (e) {
                //if (!this.rowIndex) return; // skip first row
                if (e != 0) {
                    if ($(this).find("td:eq(4) input[type='text']").length >= 1) {
                        if (this.childElementCount == 6) {
                            saveGridData('NON_IMPORT_REMITTANCES', $(this).find("td:eq(0)").text(), $(this).find("td:eq(1)").text(), $(this).find("td:eq(2)").text()
                                , $(this).find("td:eq(3)").text(), $(this).find("td:eq(4) input[type='text']").val()
                                , $(this).find("td:eq(5) input[type='text']").val()
                            );
                            pricing_category = $(this).find("td:eq(1)").text();
                        }
                        else {
                            saveGridData('NON_IMPORT_REMITTANCES', $(this).find("td:eq(0)").text(), pricing_category, $(this).find("td:eq(1)").text(), $(this).find("td:eq(2)").text()
                                , $(this).find("td:eq(3) input[type='text']").val(), $(this).find("td:eq(4) input[type='text']").val()
                            );
                        }
                    }
                }
            });

            if (IsSave == true) {
                toastr.success('Record Save Successfully');
                IsSave == false;
            }
        }
        else {
            toastr.error('Please make sure all fields are filled');
        }
    }
    else {
        toastr.error('Please save Customer Name and PAN Number first');
    }



});
/*--------------------- NON_IMPORT_REMITTANCES Save Implementaiton  ----------- */


/*--------------------- EXPORT_BILLS_FOR_COLLECTION Save Implementaiton  ----------- */
$("#btn_TradePricing_ExportBillsForCollection").click(function () {
    var pricing_category = '';
    var IsFill = true;
    var tradeType = $("input[type='radio'][name='TradePriceType']:checked").val();
    if (IsCustomersave == true) {
        $('#tbl_TradePricing_ExportBillsForCollection tr').each(function (e) {
            if (tradeType == '0') {
                var colCount = this.childElementCount
                if (colCount == 6) {
                    if ($(this).find("td:eq(5) input[type='text']").val() == '') {
                        IsFill = false;
                    }
                }
                else {
                    if ($(this).find("td:eq(4) input[type='text']").val() == '') {
                        IsFill = false;
                    }
                }
            }
            else {
                if ($(this).find("td:eq(4) input[type='text']").val() == '' || $(this).find("td:eq(5) input[type='text']").val() == '') {
                    IsFill = false;
                }
            }
        });
        if (IsFill == true) {
            $('#tbl_TradePricing_ExportBillsForCollection tr').each(function (e) {
                //if (!this.rowIndex) return; // skip first row
                if (e != 0) {

                    if ($(this).find("td:eq(4) input[type='text']").length >= 1) {
                        if (this.childElementCount == 6) {
                            saveGridData('EXPORT_BILLS_FOR_COLLECTION', $(this).find("td:eq(0)").text(), $(this).find("td:eq(1)").text(), $(this).find("td:eq(2)").text()
                                , $(this).find("td:eq(3)").text(), $(this).find("td:eq(4) input[type='text']").val()
                                , $(this).find("td:eq(5) input[type='text']").val()
                            );
                            pricing_category = $(this).find("td:eq(1)").text();
                        }
                        else {
                            saveGridData('EXPORT_BILLS_FOR_COLLECTION', $(this).find("td:eq(0)").text(), pricing_category, $(this).find("td:eq(1)").text(), $(this).find("td:eq(2)").text()
                                , $(this).find("td:eq(3) input[type='text']").val(), $(this).find("td:eq(4) input[type='text']").val()
                            );
                        }
                    }
                }
            });

            if (IsSave == true) {
                toastr.success('Record Save Successfully');
                IsSave == false;
            }

        }
        else {
            toastr.error('Please make sure all fields are filled');
        }
    }
    else {
        toastr.error('Please save Customer Name and PAN Number first');
    }



});
/*--------------------- EXPORT_BILLS_FOR_COLLECTION Save Implementaiton  ----------- */



/*--------------------- LOCAL_BILLS Save Implementaiton  ----------- */
$("#btn_TradePricing_LocalBills").click(function () {
    var pricing_category = '';
    var IsFill = true;
    var tradeType = $("input[type='radio'][name='TradePriceType']:checked").val();
    if (IsCustomersave == true) {
        $('#tbl_TradePricing_LocalBills tr').each(function (e) {
            if (tradeType == '0') {
                var colCount = this.childElementCount
                if (colCount == 6) {
                    if ($(this).find("td:eq(5) input[type='text']").val() == '') {
                        IsFill = false;
                    }
                }
                else {
                    if ($(this).find("td:eq(4) input[type='text']").val() == '') {
                        IsFill = false;
                    }
                }
            }
            else {
                if ($(this).find("td:eq(4) input[type='text']").val() == '' || $(this).find("td:eq(5) input[type='text']").val() == '') {
                    IsFill = false;
                }
            }
        });
        if (IsFill == true) {
            $('#tbl_TradePricing_LocalBills tr').each(function (e) {
                //if (!this.rowIndex) return; // skip first row
                if (e != 0) {
                    if ($(this).find("td:eq(4) input[type='text']").length >= 1) {
                        if (this.childElementCount == 6) {
                            saveGridData('LOCAL_BILLS', $(this).find("td:eq(0)").text(), $(this).find("td:eq(1)").text(), $(this).find("td:eq(2)").text()
                                , $(this).find("td:eq(3)").text(), $(this).find("td:eq(4) input[type='text']").val()
                                , $(this).find("td:eq(5) input[type='text']").val()
                            );
                            pricing_category = $(this).find("td:eq(1)").text();
                        }
                        else {
                            saveGridData('LOCAL_BILLS', $(this).find("td:eq(0)").text(), pricing_category, $(this).find("td:eq(1)").text(), $(this).find("td:eq(2)").text()
                                , $(this).find("td:eq(3) input[type='text']").val(), $(this).find("td:eq(4) input[type='text']").val()
                            );
                        }
                    }
                }
            });

            if (IsSave == true) {
                toastr.success('Record Save Successfully');
                IsSave == false;
            }
        }
        else {
            toastr.error('Please make sure all fields are filled');
        }
    }
    else {
        toastr.error('Please save Customer Name and PAN Number first');
    }


});
/*--------------------- LOCAL_BILLS Save Implementaiton  ----------- */


/*--------------------- INWARD_REMITTANCE Save Implementaiton  ----------- */
$("#btn_TradePricing_InwardRemittance").click(function () {
    var pricing_category = '';
    var IsFill = true;
    var tradeType = $("input[type='radio'][name='TradePriceType']:checked").val();
    if (IsCustomersave == true) {
        $('#tbl_TradePricing_InwardRemittance tr').each(function (e) {
            if (tradeType == '0') {
                var colCount = this.childElementCount
                if (colCount == 6) {
                    if ($(this).find("td:eq(5) input[type='text']").val() == '') {
                        IsFill = false;
                    }
                }
                else {
                    if ($(this).find("td:eq(4) input[type='text']").val() == '') {
                        IsFill = false;
                    }
                }
            }
            else {
                if ($(this).find("td:eq(4) input[type='text']").val() == '' || $(this).find("td:eq(5) input[type='text']").val() == '') {
                    IsFill = false;
                }
            }
        });
        if (IsFill == true) {
            $('#tbl_TradePricing_InwardRemittance tr').each(function (e) {
                //if (!this.rowIndex) return; // skip first row
                if (e != 0) {
                    if ($(this).find("td:eq(4) input[type='text']").length >= 1) {
                        if (this.childElementCount == 6) {
                            saveGridData('INWARD_REMITTANCE', $(this).find("td:eq(0)").text(), $(this).find("td:eq(1)").text(), $(this).find("td:eq(2)").text()
                                , $(this).find("td:eq(3)").text(), $(this).find("td:eq(4) input[type='text']").val()
                                , $(this).find("td:eq(5) input[type='text']").val()
                            );
                            pricing_category = $(this).find("td:eq(1)").text();
                        }
                        else {
                            saveGridData('INWARD_REMITTANCE', $(this).find("td:eq(0)").text(), pricing_category, $(this).find("td:eq(1)").text(), $(this).find("td:eq(2)").text()
                                , $(this).find("td:eq(3) input[type='text']").val(), $(this).find("td:eq(4) input[type='text']").val()
                            );
                        }
                    }
                }
            });

            if (IsSave == true) {
                toastr.success('Record Save Successfully');
                IsSave == false;
            }
        }
        else {
            toastr.error('Please make sure all fields are filled');
        }
    }
    else {
        toastr.error('Please save Customer Name and PAN Number first');
    }



});
/*--------------------- INWARD_REMITTANCE Save Implementaiton  ----------- */


/*--------------------- CAPITAL_ACCOUNT_TRANSACTIONS Save Implementaiton  ----------- */
$("#btn_TradePricing_CapitalAccountTransaction").click(function () {
    var pricing_category = '';
    var IsFill = true;
    var tradeType = $("input[type='radio'][name='TradePriceType']:checked").val();
    if (IsCustomersave == true) {
        $('#tbl_TradePricing_CapitalAccountTransaction tr').each(function (e) {
            if (tradeType == '0') {
                var colCount = this.childElementCount
                if (colCount == 6) {
                    if ($(this).find("td:eq(5) input[type='text']").val() == '') {
                        IsFill = false;
                    }
                }
                else {
                    if ($(this).find("td:eq(4) input[type='text']").val() == '') {
                        IsFill = false;
                    }
                }
            }
            else {
                if ($(this).find("td:eq(4) input[type='text']").val() == '' || $(this).find("td:eq(5) input[type='text']").val() == '') {
                    IsFill = false;
                }
            }
        });
        if (IsFill == true) {
            $('#tbl_TradePricing_CapitalAccountTransaction tr').each(function (e) {
                //if (!this.rowIndex) return; // skip first row
                if (e != 0) {
                    if ($(this).find("td:eq(4) input[type='text']").length >= 1) {
                        if (this.childElementCount == 6) {
                            saveGridData('CAPITAL_ACCOUNT_TRANSACTIONS', $(this).find("td:eq(0)").text(), $(this).find("td:eq(1)").text(), $(this).find("td:eq(2)").text()
                                , $(this).find("td:eq(3)").text(), $(this).find("td:eq(4) input[type='text']").val()
                                , $(this).find("td:eq(5) input[type='text']").val()
                            );
                            pricing_category = $(this).find("td:eq(1)").text();
                        }
                        else {
                            saveGridData('CAPITAL_ACCOUNT_TRANSACTIONS', $(this).find("td:eq(0)").text(), pricing_category, $(this).find("td:eq(1)").text(), $(this).find("td:eq(2)").text()
                                , $(this).find("td:eq(3) input[type='text']").val(), $(this).find("td:eq(4) input[type='text']").val()
                            );
                        }
                    }
                }
            });

            if (IsSave == true) {
                toastr.success('Record Save Successfully');
                IsSave == false;
            }
        }
        else {
            toastr.error('Please make sure all fields are filled');
        }
    }
    else {
        toastr.error('Please save Customer Name and PAN Number first');
    }

});
/*--------------------- CAPITAL_ACCOUNT_TRANSACTIONS Save Implementaiton  ----------- */


/*--------------------- ALL_PRODUCTS Save Implementaiton  ----------- */
$("#btn_TradePricing_AllProduct").click(function () {
    var pricing_category = '';
    var IsFill = true;
    var tradeType = $("input[type='radio'][name='TradePriceType']:checked").val();
    if (IsCustomersave == true) {
        $('#tbl_TradePricing_AllProduct tr').each(function (e) {
            if (tradeType == '0') {
                var colCount = this.childElementCount
                if (colCount == 6) {
                    if ($(this).find("td:eq(5) input[type='text']").val() == '') {
                        IsFill = false;
                    }
                }
                else {
                    if ($(this).find("td:eq(4) input[type='text']").val() == '') {
                        IsFill = false;
                    }
                }
            }
            else {
                if ($(this).find("td:eq(4) input[type='text']").val() == '' || $(this).find("td:eq(5) input[type='text']").val() == '') {
                    IsFill = false;
                }
            }
        });
        if (IsFill == true) {
            $('#tbl_TradePricing_AllProduct tr').each(function (e) {
                //if (!this.rowIndex) return; // skip first row
                if (e != 0) {

                    if ($(this).find("td:eq(4) input[type='text']").length >= 1) {

                        if (this.childElementCount == 6) {
                            saveGridData('ALL_PRODUCTS', $(this).find("td:eq(0)").text(), $(this).find("td:eq(1)").text(), $(this).find("td:eq(2)").text()
                                , $(this).find("td:eq(3)").text(), $(this).find("td:eq(4) input[type='text']").val()
                                , $(this).find("td:eq(5) input[type='text']").val()
                            );
                            pricing_category = $(this).find("td:eq(1)").text();
                        }
                        else {
                            saveGridData('ALL_PRODUCTS', $(this).find("td:eq(0)").text(), pricing_category, $(this).find("td:eq(1)").text(), $(this).find("td:eq(2)").text()
                                , $(this).find("td:eq(3) input[type='text']").val(), $(this).find("td:eq(4) input[type='text']").val()
                            );
                        }

                    }
                }
            });

            if (IsSave == true) {
                toastr.success('Record Save Successfully');
                IsSave == false;
            }
        }
        else {
            toastr.error('Please make sure all fields are filled');
        }
    }
    else {
        toastr.error('Please save Customer Name and PAN Number first');
    }


});
/*--------------------- ALL_PRODUCTS Save Implementaiton  ----------- */


/*--------------------- MISCELLANEOUS Save Implementaiton  ----------- */
$("#btn_TradePricing_Miscellaneous").click(function () {
    var pricing_category = '';
    var IsFill = true;
    var tradeType = $("input[type='radio'][name='TradePriceType']:checked").val();
    if (IsCustomersave == true) {
        $('#tbl_TradePricing_Miscellaneous tr').each(function (e) {
            if (tradeType == '0') {
                var colCount = this.childElementCount
                if (colCount == 6) {
                    if ($(this).find("td:eq(5) input[type='text']").val() == '') {
                        IsFill = false;
                    }
                }
                else {
                    if ($(this).find("td:eq(4) input[type='text']").val() == '') {
                        IsFill = false;
                    }
                }
            }
            else {
                if ($(this).find("td:eq(4) input[type='text']").val() == '' || $(this).find("td:eq(5) input[type='text']").val() == '') {
                    IsFill = false;
                }
            }
        });
        if (IsFill == true) {
            $('#tbl_TradePricing_Miscellaneous tr').each(function (e) {
                //if (!this.rowIndex) return; // skip first row
                if (e != 0) {
                    if ($(this).find("td:eq(4) input[type='text']").length >= 1) {

                        if (this.childElementCount == 6) {
                            saveGridData('MISCELLANEOUS', $(this).find("td:eq(0)").text(), $(this).find("td:eq(1)").text(), $(this).find("td:eq(2)").text()
                                , $(this).find("td:eq(3)").text(), $(this).find("td:eq(4) input[type='text']").val()
                                , $(this).find("td:eq(5) input[type='text']").val()
                            );
                            pricing_category = $(this).find("td:eq(1)").text();
                        }
                        else {
                            saveGridData('MISCELLANEOUS', $(this).find("td:eq(0)").text(), pricing_category, $(this).find("td:eq(1)").text(), $(this).find("td:eq(2)").text()
                                , $(this).find("td:eq(3) input[type='text']").val(), $(this).find("td:eq(4) input[type='text']").val()
                            );
                        }

                    }
                }
            });

            if (IsSave == true) {
                toastr.success('Record Save Successfully');
                IsSave == false;
            }
        }
        else {
            toastr.error('Please make sure all fields are filled');
        }
    }
    else {
        toastr.error('Please save Customer Name and PAN Number first');
    }


});
/*--------------------- MISCELLANEOUS Save Implementaiton  ----------- */

function UpdateTableSaveStatus(IdentFlag,) {
    var formData = new FormData();
    formData.append('CustomerId', $("#TradePricing_CustomerId").val());
    formData.append('Action', IdentFlag);
    $.ajax({
        type: "POST",
        url: "/Comercials/Update_TableSaveStatus",
        data: formData,
        contentType: false,
        // dataType: "json",
        async: false,
        processData: false,
        success: function (response) {
            chkSession(response);
            if (response != null && response.isSuccess == 'true') {

            }
            else {
                toastr.error(response.msg);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            result = xhr.innerHTML;
        }
    });
}


function saveCutomerInfo() {

    var formData = new FormData();

    formData.append('TradeType', 'SaveCustomer');
    formData.append('APR_PFY', $("#lbl_trade_APRPFY").text());
    formData.append('APR_YTD', $("#lbl_trade_APRYTD").text());
    formData.append('Vintage', $("#lbl_trade_Vintage").text());
    formData.append('ProposalNumber', $("#lbl_trade_proposalNo").text());
    formData.append('ClientId', $("#lbl_trade_clientId").text());
    formData.append('CustomerType', $("input[type='radio'][name='TradePriceType']:checked").val());
    formData.append('APRCode', $("#txt_tradeAprcode").val());
    formData.append('CustomerId', $("#TradePricing_CustomerId").val());
    formData.append('CustomerName', $("#txtCutomerName").val());
    formData.append('PanNo', $("#txtPanNo").val());
    formData.append('Remark', $("#txt_Remark_TradePricing").val());
    formData.append('ApproverADID', $("#TP_DropDown_Level1").val());
    //formData.append('SubmitType', 'gcfdg');

    $.ajax({
        type: "POST",
        url: "/Comercials/Save_TradePricingCustomerInfo",
        data: formData,
        contentType: false,
        async: false,
        dataType: "JSON",
        processData: false,
        success: function (response) {
            chkSession(response);
            if (response != null && response.isSuccess == 'true') {
                Isvalidate = true;
                LoadTradePricingGrid();
                $("#txtCutomerName").prop('disabled', true);
                //$('#TP_DropDown_Level1').prop('disabled', true).trigger("chosen:updated");
                $("#TradePricing_CustomerId").val(response.id);
                //if (response.id != 0) {
                //    $("#TradePricing_CustomerId").val(response.id);
                //    TradePricing_CustomerId = response.id;

                //}
                //else {

                //}


            }
            else {
                IsExists = true;
                Isvalidate = false;
                return;
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            event.preventDefault();
            if (ajaxOptions == "parsererror") {
                window.location.href = "../Common/SessionExpiry";
            }
        }
    });


}

/* Common function to save all Grid Data */
function saveGridData(TradeType, Pricing_Item_Master_ID, PricingCategory, Charges_Commission, StandardPricing, ExistingPrice, ProposedPrice) {
    var formData = new FormData();


    TradePricing_CustomerId = $("#TradePricing_CustomerId").val();

    formData.append('CustomerId', TradePricing_CustomerId);
    formData.append('TradeType', TradeType);
    formData.append('Pricing_Item_Master_ID', Pricing_Item_Master_ID);
    formData.append('PricingCategory', PricingCategory);
    formData.append('Charges_Commission', Charges_Commission);
    formData.append('StandardPricing', StandardPricing);
    formData.append('ExistingPrice', ExistingPrice);
    formData.append('ProposedPrice', ProposedPrice);

    $.ajax({
        type: "POST",
        url: "/Comercials/Save_LetterOfCreditData",
        data: formData,
        contentType: false,
        async: false,
        processData: false,
        success: function (response) {
            chkSession(response);
            if (response != null) {
                IsSave = true;
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            IsSave = false;
            event.preventDefault();
        }
    });

}

//$("#txtPanNo").blur(function () {
//    $("#txtPanNo").val(parseInt($("#txtPanNo").val(), 10).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,").toString());
//});


/////////Approval status///////////////

$("#BtnApproveTradePricing").click(function () {
    if ($("#txt_approve_remark_trade").val() == "") {
        toastr.error("Please entet remark")
    }
    else {
        TradePricingSubmitClick();

        UpdateTradePricing_ApprovalStatus($("#TradePricing_CustomerId").val(), "Approve", $("#txt_approve_remark_trade").val());

        LoadTradePricingGrid();
        $("#sidebar_tradepricing").removeClass('opened');
    }
})
$("#BtnRejectTradePricing").click(function () {
    if ($("#TradePricing_CustomerId").val() == "") {
        toastr.error("Please entet remark")
    }
    else {
        UpdateTradePricing_ApprovalStatus($("#TradePricing_CustomerId").val(), "Reject", $("#txt_reject_remark_trade").val());
        LoadTradePricingGrid();
        $("#sidebar_tradepricing").removeClass('opened');
    }

})

function UpdateTradePricing_ApprovalStatus(CustomerId, action, remark) {

    formData = new FormData();
    formData.append('CustomerId', CustomerId);
    formData.append('Action', action);
    formData.append('Remark', remark);
    $.ajax({
        type: "POST",
        url: "/Comercials/Update_TradePricing_ApprovalStatus",
        data: formData,
        contentType: false,
        // dataType: "json",
        async: false,
        processData: false,
        success: function (response) {
            chkSession(response);
            if (response != null && response.isSuccess == 'true') {
                toastr.success(response.msg);
                $("#txt_reject_remark_trade").val('');
                $("#RejectModalTradePricing").modal("hide");
                $("#ApproveModalTradePricing").modal("hide");
            }
            else {
                toastr.error(response.msg);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            result = xhr.innerHTML;
        }
    });
}