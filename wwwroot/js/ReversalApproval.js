$(document).ready(function () {
    const d = new Date();
    var month = d.getUTCMonth() + 1;
    month = month.toString().length > 1 ? month : "0" + month;
    var currentDate = d.getDate().toString();
    $("#btn_addReversalDetails").click(function () {
        AddNewReversalDetailsRow('', '', '');
    });
    $("#btn_addReversalAmtBreakdown").click(function () {
        AddNewReversalBreakdownRow('', (currentDate + "/" + month + "/" + d.getUTCFullYear()), (currentDate + "/" + month + "/" + d.getUTCFullYear()), '', '', '', '');
    });
    $("#btnAddNewReversalFacility").click(function () {
        AddNewReversalFacility('', '', '');
    });
    $("#Tbl_ReversalDetails").on('click', 'tbody .btn_delete', function (e) {
        $(this).closest('tr').remove();
    });
    $("#Tbl_ReversalAmtBreakdown").on('click', 'tbody .btn_delete', function (e) {
        $(this).closest('tr').remove();
    });
    $("#table_ReversalFacililty").on('click', 'tbody .btn_delete', function (e) {
        $(this).closest('tr').remove();
    });

    $("#BtncloseReversal").click(function () {
        $("#Tbl_ReversalAmtBreakdown tbody>tr").remove();
        $("#Tbl_ReversalDetails tbody>tr").remove();
        $("#table_ReversalFacililty tbody>tr").remove();
        disableAccordian();
    });

    if ($("#clientSearch").val() == '') {
        LoadReversalApprovalGrid(0, 0);
    }
    else {
        var clientNameID = $("#clientSearch").val();
        const result = clientNameID.split('-');
        var ClientsName = result[0].trim();
        var ClientsID = result[1].trim();
        LoadReversalApprovalGrid(0, ClientsID);
    }


});
function LoadReversalApprovalGrid(ProposalNumber, LS_ClientId) {
    var Table_ReversalApproval = '';
    //var clientNameID = $("#clientSearch").val();
    //const result = clientNameID.split('-');
    //var ClientsName = result[0];
    //var ClientsID = result[1];
    $.ajax({
        type: "GET",
        url: "/Comercials/Get_ReversalApprovalGridData?ProposalNumber=" + ProposalNumber,
        data: null,
        contentType: false,
        // dataType: "json",
        async: false,
        processData: false,
        success: function (response) {
            chkSession(response);
            if (response != null) {
                if (LS_ClientId != '' && LS_ClientId != undefined && LS_ClientId != 0) {
                    var data_filter = response.filter(element => element.clientId == LS_ClientId);
                    response = data_filter;
                }
                if (ProposalNumber != '' && ProposalNumber != undefined && ProposalNumber != 0) {
                    var data_filter = response.filter(element => element.proposal_Number == ProposalNumber);
                    response = data_filter;
                }
                var col = [];
                for (var i = 0; i < 1; i++) {
                    for (var key in response[i]) {
                        if (col.indexOf(key) === -1) {
                            var columnArray = {};
                            columnArray.data = key;
                            columnArray.title = key.toUpperCase();
                            col.push(columnArray);
                        }
                    }
                }

                Table_ReversalApproval = $('#TBL_ReversalApproval').DataTable({
                    data: response,
                    columns: col,
                    "columnDefs": [
                        {
                            "targets": [0],
                            "searchable": false,
                            'orderable': false,
                            'width': '30px',
                            "className": "d-none"
                        },
                        {
                            "targets": 4,
                            "className": "d-none"
                        },
                        {
                            "targets": 6,
                            'className': 'lengthLimit',
                        },
                        {
                            "targets": 7,
                            'className': 'lengthLimit',
                        },
                        {
                            "targets": 10,
                            "className": "d-none"
                        }
                    ],
                    "ordering": true,
                    "paging": true,
                    "info": false,
                    "searching": true,
                    fixedHeader: true,
                    responsive: true,
                    destroy: true,

                    "processing": true,
                    rowCallback: function (row, data) {

                    }
                });
            }
            else {
                //$("#TBL_ReversalApproval").empty();
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            result = xhr.innerHTML;
        }
    });



    $('#TBL_ReversalApproval').on('click', 'tbody tr', function (p) {

        $("#NewReversalProposal").css('display', 'none');

        $("#UpdateReversalProposal").css('display', 'block');
        $("#btn_fetchProposalNo").css('display', 'none');
        var data = {};
        var rowdata = Table_ReversalApproval.row(this).data();
        if (rowdata != undefined) {
            $("#Reversal_status").val(rowdata.status);
            $("#ReversalAppoval_CustomerId").val(rowdata.id);
            $("#sidebar_reversalproposal").addClass("opened");
            $("#ReversalApproval_txtProposalNo").val(rowdata.proposal_Number);
            $("#txt_ReversalJustification").val(rowdata.remarks);

            $("#divCommentsReversal").hide();
            if (rowdata.comments != undefined && rowdata.comments != '') {
                $("#divCommentsReversal").show();
                $("#txt_ReversalComments").val(rowdata.comments);
            }

            LoadReversalApprovalCustomerDetails(rowdata.id);
            //GetApprovalStatus(rowdata.id, 'check_Reversal_Approver_Status');
            EnabledReversalFields();
            DisableReversalForUpdate();

        }
    })
}

function LoadReversalApprovalCustomerDetails(CustomerId) {
    $.ajax({
        type: "GET",
        url: "/Comercials/Get_ReversalApprovalCustomerDetails?CustomerId=" + CustomerId,
        data: null,
        contentType: false,
        async: false,
        processData: false,
        success: function (response) {
            chkSession(response);
            if (response != null) {
                if (response.tbL_RA_Aprrover[0].status == 1) {
                    $(".dynamic-control-add").hide();
                } else {
                    $(".dynamic-control-add").show();
                }
                var CustomerInfo = response.tbL_Reversal_Approval_Customer_Info;
                $("#LoginUserRole").val(CustomerInfo[0].empRole);
                lbl_CustomerName.innerText = CustomerInfo[0].customerName;
                lbl_ClientId.innerText = CustomerInfo[0].lS_ClientID;
                lblVintage.innerText = CustomerInfo[0].vintage;
                lblRAROC.innerText = CustomerInfo[0].raroc;
                lbl_APRPFY.innerText = CustomerInfo[0].aprpfy;
                lbl_APRYTD.innerText = CustomerInfo[0].aprytd;
                lbl_CTI.innerText = CustomerInfo[0].cti;
                lbl_Limit.innerText = CustomerInfo[0].limit;

                //------ Facility Details Binding --------

                $("#table_ReversalFacililty tbody>tr").remove();
                $.each(response.tbL_RA_Facility_Details, function (key, value) {
                    AddNewReversalFacility(value.facilityDetails, value.amount, value.reversal_Approval_Facility_Details_ID);
                });

                //var col = [];
                //for (var i = 0; i < 1; i++) {
                //    for (var key in response.tbL_RA_Facility_Details[i]) {
                //        if (col.indexOf(key) === -1) {
                //            var columnArray = {};
                //            columnArray.data = key;
                //            columnArray.title = key.toUpperCase();
                //            col.push(columnArray);
                //        }
                //    }
                //}

                //FacilityTable = $('#TBL_ReversalFacililty').DataTable({
                //    data: response.tbL_RA_Facility_Details,
                //    columns: [{ data: 'facilityDetails', title: 'Facility Details' },
                //    { data: 'amount', title: 'Amount in Lacs' },
                //    ],
                //    "columnDefs": [
                //        {
                //            "targets": [0],
                //            "searchable": false,
                //            'orderable': false,
                //            'width': '30px',
                //        }
                //    ],
                //    "ordering": false,
                //    "paging": false,
                //    "info": false,
                //    "searching": false,
                //    fixedHeader: true,
                //    responsive: true,
                //    destroy: true,

                //    "processing": true,
                //    rowCallback: function (row, data) {

                //    }
                //});

                //------ Approvers Dropdowns Binding--------


                for (var i = 0; i < response.tbL_RA_Aprrover.length; i++) {
                    var LevelNumber = response.tbL_RA_Aprrover[i].levelNumber;
                    var Drp_Value = response.tbL_RA_Aprrover[i].approverADID;
                    if (LevelNumber == 1) {
                        $("#DropDown_Reversal_Level1").val(Drp_Value).trigger('chosen:updated');
                    }
                    else if (LevelNumber == 2) {
                        $("#DropDown_Reversal_Level2").val(Drp_Value).trigger('chosen:updated');
                    }
                    else if (LevelNumber == 3) {
                        $("#DropDown_Reversal_Level3").val(Drp_Value).trigger('chosen:updated');
                    }
                    else if (LevelNumber == 4) {
                        $("#DropDown_Reversal_Level4").val(Drp_Value).trigger('chosen:updated');
                    }
                    else if (LevelNumber == 5) {
                        $("#DropDown_Reversal_Level5").val(Drp_Value).trigger('chosen:updated');
                    }
                    else if (LevelNumber == 6) {
                        $("#DropDown_Reversal_Level6").val(Drp_Value).trigger('chosen:updated');
                    }
                    else if (LevelNumber == 7) {
                        $("#DropDown_Reversal_Level7").val(Drp_Value).trigger('chosen:updated');
                    }

                }
                //$("#btn_addReversalDetails").hide();
                $("#Tbl_ReversalDetails tbody>tr").remove();
                $.each(response.tbL_RA_Reversal_Details, function (key, value) {
                    AddNewReversalDetailsRow(value.natureofReversal, value.amountofReversal,
                        value.reversal_Approval_Reversal_Details_ID);
                });
                //$("#btn_addReversalAmtBreakdown").hide();
                $("#Tbl_ReversalAmtBreakdown tbody>tr").remove();
                $.each(response.tbL_RA_ReversalBreakdown_Details, function (key, value) {
                    AddNewReversalBreakdownRow(value.limit_OS, value.from_Date,
                        value.to_Date, value.noOfDays, value.actual_Int, parseFloat(value.penal_Int_Amount).toFixed(2),
                        value.reversal_Amount_Breakdown_Details_ID);
                });
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            event.preventDefault();
        }
    });
}

function SaveReversalDetails(CustomerDetailsID) {
    $('#Tbl_ReversalDetails tr').each(function (e) {
        var formData = new FormData();

        if (e != 0) {
            if ($(this).find("td:eq(1) input[type='text']").length >= 1) {
                formData.append('CustomerId', CustomerDetailsID);
                formData.append('NatureofReversal', $(this).find("td:eq(0) option:selected").text());
                formData.append('AmountofReversal', $(this).find("td:eq(1) input[type='text']").val());
                formData.append('RowId', $(this).find("td:eq(1) input[type='text']").attr("data-id"));

                var Reversal_Details = fnSaveMaster(formData, 'Add_Reversal_Details');
            }
        }
    });
}

function Save_FacilityDetails(CustomerDetailsID) {

    $('#table_ReversalFacililty tr').each(function (e) {
        var formData = new FormData();
        if (e != 0) {
            if ($(this).find("td:eq(1) input[type='text']").length >= 1) {
                formData.append('CustomerId', CustomerDetailsID);
                formData.append('FacilityType', $(this).find("td:eq(0) option:selected").text());
                formData.append('ExistingAmount', $(this).find("td:eq(1) input[type='text']").val());
                formData.append('RowId', $(this).find("td:eq(1) input[type='text']").attr("data-id"));
            }
            var ReversalFacilityDetails = fnSaveMaster(formData, 'Add_Reversal_Facility_Details');
        }

    });
}

function SaveReversalAmountBreakdown(CustomerDetailsID) {

    $('#Tbl_ReversalAmtBreakdown tr').each(function (e) {
        var formData = new FormData();
        if (e != 0) {

            if ($(this).find("td:eq(0) input[type='text']").length >= 1) {
                formData.append('CustomerId', CustomerDetailsID);
                formData.append('Limit_OS', $(this).find("td:eq(0) input[type='text']").val());
                formData.append('From_Date', $(this).find("td:eq(1) input[type='text']").val());
                formData.append('To_Date', $(this).find("td:eq(2) input[type='text']").val());
                formData.append('NoOfDays', $(this).find("td:eq(3) input[type='text']").val());
                formData.append('Actual_Int', $(this).find("td:eq(4) input[type='text']").val());
                formData.append('Penal_Int_Amount', $(this).find("td:eq(5) input[type='text']").val());
                formData.append('RowId', $(this).find("td:eq(0) input[type='text']").attr("data-id"));
                var ReversalBreakdown_Details = fnSaveMaster(formData, 'Add_Reversal_Amount_Breakdown');
            }
        }
    });
}
function SaveReversalProposalApprovers(CustomerDetailsID) {

    if ($("#DropDown_Reversal_Level1").val().length > 0) {
        fnSaveReversalApprover(CustomerDetailsID, 0, $("#DropDown_Reversal_Level1").val(), 1, 'Add_Reversal_Approver_Details')
    }
    if ($("#DropDown_Reversal_Level2").val().length > 0) {
        fnSaveReversalApprover(CustomerDetailsID, 4, $("#DropDown_Reversal_Level2").val(), 2, 'Add_Reversal_Approver_Details')
    }

    if ($("#DropDown_Reversal_Level3").val().length > 0) {
        fnSaveReversalApprover(CustomerDetailsID, 4, $("#DropDown_Reversal_Level3").val(), 3, 'Add_Reversal_Approver_Details')
    }

    if ($("#DropDown_Reversal_Level4").val().length > 0) {
        fnSaveReversalApprover(CustomerDetailsID, 4, $("#DropDown_Reversal_Level4").val(), 4, 'Add_Reversal_Approver_Details')
    }
    if ($("#DropDown_Reversal_Level5").val().length > 0) {
        fnSaveReversalApprover(CustomerDetailsID, 4, $("#DropDown_Reversal_Level5").val(), 5, 'Add_Reversal_Approver_Details')
    }

    if ($("#DropDown_Reversal_Level6").val().length > 0) {
        fnSaveReversalApprover(CustomerDetailsID, 4, $("#DropDown_Reversal_Level6").val(), 6, 'Add_Reversal_Approver_Details')
    }
    if ($("#DropDown_Reversal_Level7").val().length > 0) {
        fnSaveReversalApprover(CustomerDetailsID, 4, $("#DropDown_Reversal_Level7").val(), 7, 'Add_Reversal_Approver_Details')
    }
}

function SubmitReversalApprovalClick() {
    var status = $("#Reversal_status").val();
    if (status == 'In Progress') {
        toastr.error('You are not allow to edit proposal as it is already in process');
    }
    else if (status == 'Approved') {
        toastr.error('Proposal is already approved');
    }
    else {
        var Isvalidate = true;
        if ($("#ReversalApproval_txtProposalNo").val() == undefined || $("#ReversalApproval_txtProposalNo").val() == '') {
            Isvalidate = false;
            toastr.error('Please enter proposal number');
            return;
        }
        //var ReversalrowCount = $('#Tbl_ReversalDetails >tbody >tr').length;
        //if (ReversalrowCount < 1) {
        //    Isvalidate = false;
        //    toastr.error('Atleast one record required in Reversal Details');
        //    return;
        //}
        $('#Tbl_ReversalDetails tr').each(function (e) {

            if (e != 0) {
                if ($(this).find("td:eq(1) input[type='text']").val() == "") {
                    Isvalidate = false;
                    toastr.error('Amount of reversal is required in Reversal Details');
                    return;
                }
            }
        });
        //var ReversalAmtBreakdownrowCount = $('#Tbl_ReversalAmtBreakdown >tbody >tr').length;
        //if (ReversalAmtBreakdownrowCount < 1) {
        //    Isvalidate = false;
        //    toastr.error('Atleast one record required in Reversal Amount Breakdown');
        //    return;
        //}
        $('#Tbl_ReversalAmtBreakdown tr').each(function (e) {

            if (e != 0) {
                if ($(this).find("td:eq(0) input[type='text']").length >= 1) {
                    if ($(this).find("td:eq(0) input[type='text']").val() == "") {
                        Isvalidate = false;
                        toastr.error('Limits o/s is required in Reversal Amount Breakdown');
                        return;
                    }
                    var from_date = $(this).find("td:eq(1) input[type='text']").val();
                    var to_date = $(this).find("td:eq(2) input[type='text']").val();
                    var sDate = new Date(from_date.split("/").reverse().join("-"));
                    var eDate = new Date(to_date.split("/").reverse().join("-"));

                    if (eDate < sDate) {
                        Isvalidate = false;
                        toastr.error('To Date must be greater than From Date in Reversal Amount Breakdown');
                        return;
                    }
                    if ($(this).find("td:eq(3) input[type='text']").val() == "") {
                        Isvalidate = false;
                        toastr.error('Number of Days required in Reversal Amount Breakdown');
                        return;
                    }
                    if ($(this).find("td:eq(4) input[type='text']").val() == "") {
                        Isvalidate = false;
                        toastr.error('Actual Int is required in Reversal Amount Breakdown');
                        return;
                    }
                }


            }
        });
        if ($("#txt_ReversalJustification").val() == undefined || $("#txt_ReversalJustification").val() == '') {
            Isvalidate = false;
            toastr.error('Justification is required');
            return;
        }

        if ($("#DropDown_Reversal_Level1").val() == null || $("#DropDown_Reversal_Level1").val() == '') {
            Isvalidate = false;
            toastr.error('Level 1 Approver is mandatory');
            return;
        }

        if (Isvalidate == true) {
            SaveReversalApproval();
        }
    }

}

$("#btn_reversal_submit").on('click', function (e) {

    SubmitReversalApprovalClick();
})

function SaveReversalApproval() {
    formData = new FormData();
    formData.append('CustomerId', $("#ReversalAppoval_CustomerId").val() == '' ? 0 : $("#ReversalAppoval_CustomerId").val());
    formData.append('CustomerName', $("#lbl_CustomerName").text());
    formData.append('ProposalNumber', $("#ReversalApproval_txtProposalNo").val());
    formData.append('ClientId', $("#lbl_ClientId").text());
    formData.append('Vintage', $("#lblVintage").text());
    formData.append('RAROC', $("#lblRAROC").text());
    formData.append('APR_PFY', $("#lbl_APRPFY").text());
    formData.append('APR_YTD', $("#lbl_APRYTD").text());
    formData.append('CTI', $("#lbl_CTI").text());
    formData.append('Limit', $("#lbl_Limit").text());
    formData.append('Remark', $("#txt_ReversalJustification").val());
    formData.append('Status', 10);

    $.ajax({
        type: "POST",
        url: "/Comercials/Add_Reversal_Approval",
        data: formData,
        contentType: false,
        dataType: "JSON",
        async: false,
        processData: false,
        success: function (response) {
            chkSession(response);
            if (response != null && response.isSuccess == 'false') {
                toastr.error(response.msg);
            }
            else if (response != null && response.isSuccess == 'true') {
                //if ($("#ReversalAppoval_CustomerId").val() == '') {

                //}
                SaveReversalProposalApprovers(response.id);
                Save_FacilityDetails(response.id);
                SaveReversalDetails(response.id);
                SaveReversalAmountBreakdown(response.id);

                LoadReversalApprovalGrid(0, 0);
                if ($("#ReversalAppoval_CustomerId").val() == '') {
                    $(".side-wrapper").removeClass('opened');
                    $(".side-content").removeClass('slideIn');
                    toastr.success(response.msg);
                    disableAccordian();
                }
                else {
                    var userRole = $("#LoginUserRole").val();
                    if (userRole != 'Cluster Head') {
                        toastr.success('Proposal Updated Successfully!');
                    }
                }
                $("#ReversalAppoval_CustomerId").val(response.id);

            }
            else {
                toastr.error("Something went wrong while submitting");
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

function AddNewReversalFacility(facilityDetails, amount, reversal_Approval_Facility_Details_ID) {

    arrHead = ['Facility Details', 'Amount in lac', 'Action'];
    let empTab = document.getElementById('table_ReversalFacililty');

    let rowCnt = empTab.rows.length;   // table row count.

    let tr = empTab.insertRow(rowCnt); // the table row.


    for (let c = 0; c < arrHead.length; c++) {
        let td = document.createElement('td'); // table definition.
        td = tr.insertCell(c);

        if (c === 0) {      // the first column.
            var select = document.createElement("select");
            select.name = "Drp_Facility_reversal";
            select.id = "Drp_Facility_reversal";
            select.setAttribute('class', 'form-control custom-form-control');

            for (const val of facilityDetailData) {
                var option = document.createElement("option");
                option.value = val.key;
                option.text = val.value;
                if (val.value == facilityDetails) {
                    option.setAttribute("selected", "selected");
                }
                select.appendChild(option);

            }
            td.appendChild(select);
        }
        else if (c === 1) {
            let ExistingAMT = document.createElement('div');
            ExistingAMT.innerHTML = "<div data-tip='Enter digits only'><input data-id='" + reversal_Approval_Facility_Details_ID + "' value='" + amount + "' class='form-control custom-form-control' onkeypress='return isNumberKey(event)' type='text' id='" + arrHead[c] + "'/></div>";
            td.appendChild(ExistingAMT);
        }
        else if (c == 2) {
            if (rowCnt > 1) {
                if (facilityDetails == '') {
                    let btn = document.createElement('button');
                    btn.setAttribute('type', 'button');
                    btn.innerHTML = "<i class='icon-trash'></i>"
                    btn.setAttribute('class', 'btn btn_delete');

                    td.appendChild(btn);
                }
            }

        }

    }
    $("#table_ReversalFacililty>tbody").append(tr);
}

function AddNewReversalBreakdownRow(limit_OS, from_Date,
    to_Date, noOfDays, penal_Int, penal_Int_Amount,
    reversal_Amount_Breakdown_Details_ID) {

    if (limit_OS == '') {
        arrHead = ['Limits_OS', 'From_date', 'To_date', 'NoOfDays', 'PenalInt', 'PenalAmt', ''];
    }
    else {
        arrHead = ['Limits_OS', 'From_date', 'To_date', 'NoOfDays', 'PenalInt', 'PenalAmt',];
    }
    if (noOfDays == '' || noOfDays == undefined) {
        noOfDays = 1;
    }

    let empTab = document.getElementById('Tbl_ReversalAmtBreakdown');

    let rowCnt = empTab.rows.length;   // table row count.

    let tr = empTab.insertRow(rowCnt); // the table row.

    for (let c = 0; c < arrHead.length; c++) {
        let td = document.createElement('td'); // table definition.
        td = tr.insertCell(c);
        if (c == 0) {
            let textLimits = document.createElement('div');
            textLimits.innerHTML = "<div data-tip='Enter digits only'><input  data-id='" + reversal_Amount_Breakdown_Details_ID + "' value='" + limit_OS + "'  class='form-control custom-form-control' onkeypress='return isNumberKey(event)' type='text' id='" + arrHead[c] + "' onchange='penalCal(this)'/></div>";

            td.appendChild(textLimits);
        }
        else if (c == 1) {
            let txt_fromDate = document.createElement('div');
            txt_fromDate.innerHTML = "<div class='input-group'><input type='text' id='fromDate' required readonly class='form-control custom-form-control date' data-provide='datepicker' value='" + from_Date + "' onchange='dateDiffFrom(this)'>" +
                "<div class='input-group-addon'><span class='icon-calendar'></span></div></div>";

            td.appendChild(txt_fromDate);

        }
        else if (c == 2) {
            let txt_ToDate = document.createElement('div');
            txt_ToDate.innerHTML = "<div class='input-group date' data-provide='datepicker'><input type='text' readonly id='To_date' required class='form-control custom-form-control text-center' value='" + to_Date + "' onchange='dateDiffTo(this)'>" +
                "<div class='input-group-addon'><span class='icon-calendar'></span></div></div>";
            td.appendChild(txt_ToDate);
        }
        else if (c == 3) {

            let txt_NoOfDays = document.createElement('div');
            txt_NoOfDays.innerHTML = "<div data-tip='Enter digits only'><input  value='" + noOfDays + "'  class='form-control custom-form-control' onkeypress='return isNumberOnlyKey(event)' readonly type='text' id='" + arrHead[c] + "' onchange='penalCal(this)'/></div>";

            td.appendChild(txt_NoOfDays);
        }
        else if (c == 4) {
            let txt_PenalInt = document.createElement('div');
            txt_PenalInt.innerHTML = "<div data-tip='Enter digits only'><input  value='" + penal_Int + "'  class='form-control custom-form-control' onkeypress='return isNumberKey(event)' type='text' id='" + arrHead[c] + "' onchange='penalCal(this)' /></div>";

            td.appendChild(txt_PenalInt);
        }
        else if (c == 5) {
            let txt_PenalIntAmount = document.createElement('div');
            txt_PenalIntAmount.innerHTML = "<div data-tip='Enter digits only'><input  value='" + penal_Int_Amount + "'  class='form-control custom-form-control text-center' readonly onkeypress='return isNumberKey(event)' type='text' id='" + arrHead[c] + "'/></div>";

            td.appendChild(txt_PenalIntAmount);
        }
        else if (c == 6) {
            if (rowCnt > 1) {
                if (limit_OS == '' || limit_OS == undefined) {
                    let btn = document.createElement('button');
                    btn.setAttribute('type', 'button');
                    //btn.id = "btn_delete";
                    btn.setAttribute('class', 'btn btn_delete');
                    btn.innerHTML = "<i class='icon-trash'></i>"

                    td.appendChild(btn);
                }
            }
        }
    }
    $("#Tbl_ReversalAmtBreakdown>tbody").append(tr);
}

function penalCal(e) {
    debugger
    var parentRow = e.parentElement.parentElement.parentElement.parentElement;
    var start = parentRow.children[1].children[0].children[0].children[0].value;
    var fromDate = start.split("/");
    var limitVal = parentRow.children[0].children[0].children[0].children[0].value;
    var penalInt = parentRow.children[4].children[0].children[0].children[0].value;
    var penalAmt = parentRow.children[5].children[0].children[0].children[0];
    var noOfDays = parentRow.children[3].children[0].children[0].children[0].value;
    var penalCalVal = (fromDate[2] / 4);

    if (Number.isInteger(penalCalVal)) {
        // alert('Interger');
        penalAmt.value = parseFloat((limitVal * noOfDays) * (penalInt / 366)).toFixed(2);
        // eap year = (limit o / s) * (no of days) * (penal interest / 366)
    } else {
        //alert('float');
        penalAmt.value = parseFloat((limitVal * noOfDays) * (penalInt / 365)).toFixed(2);
        //non-leap year = (limit o/s) * (no of days) * (penal interest / 365)
    }
}

function dateDiffFrom(e) {

    var parentRow = e.parentElement.parentElement.parentElement.parentElement;
    var start = parentRow.children[1].children[0].children[0].children[0].value;
    var end = parentRow.children[2].children[0].children[0].children[0].value;

    // end - start returns difference in milliseconds 
    if (start != '' && end != '') {
        var fromDate = start.split("/");
        var sDate = new Date(fromDate[2], fromDate[1] - 1, fromDate[0]);

        var toDate = end.split("/");
        var eDate = new Date(toDate[2], toDate[1] - 1, toDate[0]);
        var diff = new Date(eDate - sDate);
        // get days
        var days = diff / 1000 / 60 / 60 / 24;
        if ((days + 1) > 0) {
            parentRow.children[3].children[0].children[0].children[0].value = days + 1;
            penalCal(e);
        } else {
            toastr.error('From Date Should Be Less Than To Date');
            parentRow.children[1].children[0].children[0].children[0].value = '';
            e.preventDefault();
            return false;
        }

    }

}

function dateDiffTo(e) {

    var parentRow = e.parentElement.parentElement.parentElement.parentElement;
    var start = parentRow.children[1].children[0].children[0].children[0].value;
    var end = parentRow.children[2].children[0].children[0].children[0].value;

    // end - start returns difference in milliseconds 
    if (start != '' && end != '') {
        var fromDate = start.split("/");
        var sDate = new Date(fromDate[2], fromDate[1] - 1, fromDate[0]);

        var toDate = end.split("/");
        var eDate = new Date(toDate[2], toDate[1] - 1, toDate[0]);
        var diff = new Date(eDate - sDate);
        // get days
        var days = diff / 1000 / 60 / 60 / 24;
        if ((days + 1) > 0) {
            parentRow.children[3].children[0].children[0].children[0].value = days + 1;
            penalCal(e);
        } else {
            toastr.error('From Date Should Be Less Than To Date');
            parentRow.children[2].children[0].children[0].children[0].value = '';
            e.preventDefault();
            return false;
        }

    }

}

function AddNewReversalDetailsRow(natureofReversal, amountofReversal,
    reversal_Approval_Reversal_Details_ID) {
    if (natureofReversal == '') {
        arrHead = ['NatureOfReversal', 'AmountOfReversal', 'Action'];
    }
    else {
        arrHead = ['NatureOfReversal', 'AmountOfReversal'];
    }
    let empTab = document.getElementById('Tbl_ReversalDetails');

    let rowCnt = empTab.rows.length;   // table row count.

    let tr = empTab.insertRow(rowCnt); // the table row.

    for (let c = 0; c < arrHead.length; c++) {
        let td = document.createElement('td'); // table definition.
        td = tr.insertCell(c);
        if (c == 0) {
            var select = document.createElement("select");
            select.name = "drp_ReversalNature";
            select.id = "Drp_ReversalNature"
            select.setAttribute('class', 'form-control custom-form-control')

            for (const val of ReversalChargesData) {
                var option = document.createElement("option");
                option.value = val.key;
                option.text = val.value;
                if (val.value == natureofReversal) {
                    option.setAttribute("selected", "selected");
                }
                select.appendChild(option);
            }
            td.appendChild(select);
        }
        else if (c == 1) {

            let textbox = document.createElement('div');
            textbox.innerHTML = "<div data-tip='Enter digits only'><input data-id='" + reversal_Approval_Reversal_Details_ID + "'  value='" + amountofReversal + "' class='form-control custom-form-control' onkeypress='return isNumberKey(event)' type='text' id='" + arrHead[c] + "'/></div>";
            td.appendChild(textbox);
        }

        else if (c == 2) {
            if (rowCnt > 1) {
                if (natureofReversal == '') {
                    let btn = document.createElement('button');
                    btn.setAttribute('type', 'button');
                    //btn.id = "btn_delete";
                    btn.innerHTML = "<i class='icon-trash'></i>"
                    btn.setAttribute('class', 'btn btn_delete');
                    td.appendChild(btn);
                }
            }
        }
    }
    $("#Tbl_ReversalDetails>tbody").append(tr);
}
function fnSaveReversalApprover(CustomerID, Status, ApproverADID, LevelNumber, url) {
    var result = '';
    var formData = new FormData();
    formData.append('CustomerId', CustomerID);
    formData.append('Status', Status);
    formData.append('ApproverADID', ApproverADID);
    formData.append('LevelNumber', LevelNumber);
    $.ajax({
        type: "POST",
        url: "/Comercials/" + url,
        data: formData,
        contentType: false,
        // dataType: "json",
        async: false,
        processData: false,
        success: function (response) {
            chkSession(response);
            if (response != null) {
                result = Response;
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            result = xhr.innerHTML;
        }
    });
}
$("#BtnApproveReversal").on('click', function (e) {
    var remark = $("#txt_approve_remark_reversal").val();
    if (remark == '') {
        toastr.error('Enter Remark');
    }
    else {
        $('#ApproveModalReversal').modal('toggle');
        var userRole = $("#LoginUserRole").val();
        if (userRole == 'Cluster Head') {

            SubmitReversalApprovalClick();
        }
        UpdateReversalApprovalStatus($("#ReversalAppoval_CustomerId").val(), "Approve", remark);

        LoadReversalApprovalGrid(0, 0);
        $(".side-wrapper").removeClass('opened');
        $(".side-content").removeClass('slideIn');
    }
});
$("#BtnSendBackReversal").on('click', function (e) {

    var remark = $("#txt_sendback_remark_reversal").val();
    if (remark == '') {
        toastr.error('Enter Remark');
    }
    else {
        LoadReversalApprovalGrid(0, 0);
        $('#SendBackModalReversal').modal('toggle');
        $(".side-wrapper").removeClass('opened');
        $(".side-content").removeClass('slideIn');
        UpdateReversalApprovalStatus($("#ReversalAppoval_CustomerId").val(), "Send_Back", remark);
    }
});

$("#BtnRejectReversal").on('click', function (e) {
    var remark = $("#txt_reject_remark_reversal").val();
    if (remark == '') {
        toastr.error('Enter Remark');
    }
    else {
        $('#RejectModalReversal').modal('toggle');
        UpdateReversalApprovalStatus($("#ReversalAppoval_CustomerId").val(), "Reject", remark);
        LoadReversalApprovalGrid(0, 0);
        $(".side-wrapper").removeClass('opened');
        $(".side-content").removeClass('slideIn');
    }
});



function UpdateReversalApprovalStatus(Reversal_approval_CustomerId, action, remark) {
    formData = new FormData();
    formData.append('CustomerId', Reversal_approval_CustomerId);
    formData.append('Action', action);
    formData.append('Remark', remark);
    $.ajax({
        type: "POST",
        url: "/Comercials/Update_Reversal_ApprovalStatus",
        data: formData,
        contentType: false,
        // dataType: "json",
        async: false,
        processData: false,
        success: function (response) {
            chkSession(response);
            if (response != null && response.isSuccess == 'true') {
                toastr.success(response.msg);
                $("#txt_reject_remark_reversal").val('');
                $("#txt_sendback_remark_reversal").val('');
                $("#RejectModalReversal").modal("hide");
                $("#SendBackModalReversal").modal("hide");
                LoadReversalApprovalGrid(0, 0);
                if (action == 'Approve') {
                    $("#BtnApproveReversal").hide();
                    $("#btn_sendbackReversal").show();
                    $("#btn_RejectReversal").show();
                } else if (action == 'Send_Back') {
                    $("#BtnApproveReversal").show();
                    $("#btn_sendbackReversal").hide();
                    $("#btn_RejectReversal").show();
                } else {
                    $("#BtnApproveReversal").show();
                    $("#btn_sendbackReversal").show();
                    $("#btn_RejectReversal").hide();
                }

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

$("#BtnSearchByProposalNo").on('click', function (e) {
    var ProposalNo = $("#txt_proposalNo").val();
    if (ProposalNo == '') {
        toastr.error('Enter Proposal Number');
    }
    else {
        LoadReversalApprovalGrid(ProposalNo, 0);

    }
});
$("#BtnClear").on('click', function (e) {
    var ProposalNo = $("#txt_proposalNo").val('');
    $('#txt_proposalNo').removeClass('alertBorder')
    $('#ProposalNolength').css('display', 'none');
    LoadReversalApprovalGrid(0, 0);
});


function DisabledReversalFields() {

    disableAccordian();
    $("#txt_ReversalJustification").attr("disabled", "disabled");
    $('#DropDown_Reversal_Level1').prop('disabled', true).trigger("chosen:updated");
    $('#DropDown_Reversal_Level2').prop('disabled', true).trigger("chosen:updated");
    $('#DropDown_Reversal_Level3').prop('disabled', true).trigger("chosen:updated");
    $('#DropDown_Reversal_Level4').prop('disabled', true).trigger("chosen:updated");
    $('#DropDown_Reversal_Level5').prop('disabled', true).trigger("chosen:updated");
    $('#DropDown_Reversal_Level6').prop('disabled', true).trigger("chosen:updated");
    $('#DropDown_Reversal_Level7').prop('disabled', true).trigger("chosen:updated");
}
function EnabledReversalFields() {
    enableAccordian();
    $("#txt_ReversalJustification").removeAttr("disabled");
    $('#DropDown_Reversal_Level1').prop('disabled', false).trigger("chosen:updated");
    $('#DropDown_Reversal_Level2').prop('disabled', false).trigger("chosen:updated");
    $('#DropDown_Reversal_Level3').prop('disabled', false).trigger("chosen:updated");
    $('#DropDown_Reversal_Level4').prop('disabled', false).trigger("chosen:updated");
    $('#DropDown_Reversal_Level5').prop('disabled', false).trigger("chosen:updated");
    $('#DropDown_Reversal_Level6').prop('disabled', false).trigger("chosen:updated");
    $('#DropDown_Reversal_Level7').prop('disabled', false).trigger("chosen:updated");
}
//function DisableReversalForUpdate() {
//    $("#ReversalApproval_txtProposalNo").attr("disabled", "disabled");
//    $('#DropDown_Reversal_Level1').prop('disabled', true).trigger("chosen:updated");
//    $('#DropDown_Reversal_Level2').prop('disabled', true).trigger("chosen:updated");
//    $('#DropDown_Reversal_Level3').prop('disabled', true).trigger("chosen:updated");
//    $('#DropDown_Reversal_Level4').prop('disabled', true).trigger("chosen:updated");
//    $('#DropDown_Reversal_Level5').prop('disabled', true).trigger("chosen:updated");
//    $('#DropDown_Reversal_Level6').prop('disabled', true).trigger("chosen:updated");
//    $('#DropDown_Reversal_Level7').prop('disabled', true).trigger("chosen:updated");
//}
function EmptyDropdown() {
    $("#DropDown_Reversal_Level1").val(All_Supervisors[0].level1).trigger('chosen:updated');
    $("#DropDown_Reversal_Level2").val(All_Supervisors[0].level2).trigger('chosen:updated');
    $("#DropDown_Reversal_Level3").val(All_Supervisors[0].level3).trigger('chosen:updated');
    $("#DropDown_Reversal_Level4").val(All_Supervisors[0].level4).trigger('chosen:updated');
    $("#DropDown_Reversal_Level5").val(All_Supervisors[0].level5).trigger('chosen:updated');
    $("#DropDown_Reversal_Level6").val(All_Supervisors[0].level6).trigger('chosen:updated');
    $("#DropDown_Reversal_Level7").val(All_Supervisors[0].level7).trigger('chosen:updated');

}
