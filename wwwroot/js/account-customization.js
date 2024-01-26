var table;
$(document).ready(function () {

    if ($("#clientSearch").val() == '') {

        LoadAccountCustomisationGrid(0, 0);
    }
    else {
        var clientNameID = $("#clientSearch").val();
        const result = clientNameID.split('-');
        var ClientsName = result[0].trim();
        var ClientsID = result[1].trim();
        LoadAccountCustomisationGrid(0, ClientsID);
    }

    $("#txt_APRCode").on("focusout", function () {
        getAPRSCount("AccountCustomization");
    });
    $("#btnAddWaiver").on("click", function () {
        AddNewWaiverRow('', '', '', '', '', '');
    });

    $("#tbl_waiverDetails").on('click', 'tbody .btn_delete', function (e) {
        var deleteBtnCount = $("#tbl_waiverDetails tbody .btn_delete").length;
        if (deleteBtnCount == 1) {
            toastr.error("Atleast one record is mandatory");
        }
        else {
            if ($("#AccountCustomization_CustomerId").val() == "") {
                $(this).closest('tr').remove();
            }
            else {
                var result = confirm("Are you sure to delete?");
                if (result) {
                    var id = $(this).closest('tr').find("td:eq(3) input[type='text']").attr("data-id");

                    var success = DeleteWaiver(id);
                    if (success == "true") {
                        $(this).closest('tr').remove();
                        GetWaiverAccordingToAccountNumber($("#createdById").val(), $("#AccountCustomization_CustomerId").val());
                    }

                }
            }
        }
    })
    $('#doc_download').click(function (e) {
        e.preventDefault();  //stop the browser from following
        window.location.href = '../AccountCustomisationFiles/' + $("#txt_document").val();

    });
});
$("#BtnClearText").on('click', function (e) {
    var ProposalNo = $("#txt_ac_proposalNumber").val('');
    $('#txt_ac_proposalNumber').removeClass('alertBorder')
    $('#ACProposalNolength').css('display', 'none');
    LoadAccountCustomisationGrid(0, 0);
});

$("#btn_Accountsearch").on('click', function (e) {

    var ProposalNo = $("#txt_ac_proposalNumber").val();
    if (ProposalNo == '') {
        toastr.error('Enter Proposal Number');
    }
    else {
        LoadAccountCustomisationGrid(ProposalNo, 0);

    }
});

$(document).on('change', '#documentupload', function (e) {

    var filename = readUrlDocument(this);
    $("#txt_document").val(filename);

});

// Read File and return value  
function readUrlDocument(input) {

    var url = input.value;
    var ext = url.substring(url.lastIndexOf('.') + 1).toLowerCase();
    if (input.files && input.files[0] && (
        ext == "xlsx" || ext == "xlsm" || ext == "xls" || ext == "pdf" || ext == "csv"
    )) {
        var path = $(input).val();
        var filename = path.replace(/^.*\\/, "");
        // $('.fileUpload span').html('Uploaded Proof : ' + filename);
        return filename;
    } else {
        $('#documentupload').val("");
        return "Only excel and PDF format is allowed!";
    }
}

function AddNewWaiverRow(chargesType, typeOfWaiver, ambCommitment, value, numberofTransactions, account_Customisation_Waiver_Details_ID) {

    let arrHead = new Array();
    if (chargesType == '') {
        arrHead = ['ChargeType', 'WaiverType', 'Values', 'NoOfTransations', 'AMBCommitement', 'Action'];
    }
    else {
        arrHead = ['ChargeType', 'WaiverType', 'Values', 'NoOfTransations', 'AMBCommitement', 'Action'];
    }

    let empTab = document.getElementById('tbl_waiverDetails');
    let rowCnt = empTab.rows.length;   // table row count.

    let tr = empTab.insertRow(rowCnt); // the table row.

    for (let c = 0; c < arrHead.length; c++) {
        let td = document.createElement('td'); // table definition.
        td = tr.insertCell(c);
        if (c == 0) {
            var select = document.createElement("select");
            select.name = "drp_charges_account";
            select.id = "Drp_charges_account"
            select.setAttribute('class', 'form-control custom-form-control')

            for (const val of WaiverData) {
                var option = document.createElement("option");
                option.value = val.key;
                option.text = val.value;
                if (val.key == chargesType) {
                    option.setAttribute("selected", "selected");
                }
                select.appendChild(option);
            }
            td.appendChild(select);
        }
        else if (c == 1) {

            var selectWaiver = document.createElement("select");
            selectWaiver.name = "drp_waiverType";
            selectWaiver.id = "Drp_waiverType"
            selectWaiver.setAttribute('class', 'form-control custom-form-control')

            for (const val of WaiversType) {
                var option = document.createElement("option");
                option.value = val.key;
                option.text = val.value;
                if (val.key == typeOfWaiver) {
                    option.setAttribute("selected", "selected");
                }
                selectWaiver.appendChild(option);
            }
            td.appendChild(selectWaiver);

        }
        else if (c == 2) {
            let txt_values = document.createElement('div');
            txt_values.innerHTML = "<div data-tip='Enter digits only'><input  value='" + value + "' class='form-control custom-form-control' onkeypress='return isNumberOnlyKey(event)' type='text' id='" + arrHead[c] + "'/></div>";

            td.appendChild(txt_values);
        }
        else if (c == 3) {
            let txt_txnNo = document.createElement('div');
            txt_txnNo.innerHTML = "<div data-tip='Enter digits only'><input data-id='" + account_Customisation_Waiver_Details_ID + "' value='" + numberofTransactions + "'  class='form-control custom-form-control' onkeypress='return isNumberOnlyKey(event)' type='text' id='" + arrHead[c] + "'/></div>";

            td.appendChild(txt_txnNo);
        }
        else if (c == 4) {
            let txt_AMBCommitement = document.createElement('div');
            txt_AMBCommitement.innerHTML = "<input  class='form-control custom-form-control' value='NA' disabled type='text' id='" + arrHead[c] + "'/>";

            td.appendChild(txt_AMBCommitement);
        }
        else if (c == 5) {
            //if (rowCnt > 1) {

            //if (chargesType == '') {
            let btn = document.createElement('button');
            btn.setAttribute('type', 'button');
            //btn.id = "btn_delete";
            btn.innerHTML = "<i class='icon-trash'></i>"
            btn.setAttribute('class', 'btn btn_delete');
            td.appendChild(btn);
            //}
            //}

        }
    }
    $("#tbl_waiverDetails>tbody").append(tr);
}


$("#btn_accountsubmit").on("click", function () {

    AccountCustomizationSubmitClick();
});

function AccountCustomizationSubmitClick() {
    var status = $("#AccountPricing_status").val();
    if (status == 'In Progress') {
        toastr.error('You are not allow to edit proposal as it is already in process');
    }
    else if (status == 'Approved') {
        toastr.error('Proposal is already approved');
    }
    else {
        var Isvalidate = true;

        //if ($("#txt_AC_CustomerName").val() == undefined || $("#txt_AC_CustomerName").val() == '') {
        //    Isvalidate = false;
        //    toastr.error('Please enter Customer name');
        //    return;
        //}
        //if ($("#txt_AC_AccountNo").val() == undefined || $("#txt_AC_AccountNo").val() == '') {
        //    Isvalidate = false;
        //    toastr.error('Please enter Account number');
        //    return;
        //}
        //if ($("#txt_ProductCode").val() == undefined || $("#txt_ProductCode").val() == '') {
        //    Isvalidate = false;
        //    toastr.error('Please enter Product Code');
        //    return;
        //}
        if ($("#txt_APRCode").val() == undefined || $("#txt_APRCode").val() == '') {
            Isvalidate = false;
            toastr.error('Please enter APR Code');
            return;
        }
        if ($("#txt_PFY").val() == undefined || $("#txt_PFY").val() == '') {
            Isvalidate = false;
            toastr.error('PFY APR is required');
            return;
        }
        if ($("#txt_YTD").val() == undefined || $("#txt_YTD").val() == '') {
            Isvalidate = false;
            toastr.error('YTD APR is required');
            return;
        }
        //if ($("#txt_ClientId_AC").val() == undefined || $("#txt_ClientId_AC").val() == '') {
        //    Isvalidate = false;
        //    toastr.error('Client ID is required');
        //    return;
        //}
        var waiverDetailsrowCount = $('#tbl_waiverTemp >tbody >tr').length;
        if (waiverDetailsrowCount < 1) {
            Isvalidate = false;
            toastr.error('Atleast one record required in WAIVER Details');
            return;
        }


        if ($("#AC_DropDown_Level1").val() == null || $("#AC_DropDown_Level1").val() == '') {
            Isvalidate = false;
            toastr.error('Level 1 Approver is mandatory');
            return;
        }
        if (Isvalidate == true) {
            SaveAccountCustomizationDetails();
        }
    }
}

function SaveAccountCustomizationDetails() {

    formData = new FormData();
    var fileData = $('#documentupload')[0].files[0];
    formData.append('CustomerId', $("#AccountCustomization_CustomerId").val() == '' ? 0 : $("#AccountCustomization_CustomerId").val());
    formData.append('CustomerName', $("#txt_AC_CustomerName").val());
    formData.append('ProductCode', $("#txt_ProductCode").val());
    formData.append('AccountNumber', $("#txt_AC_AccountNo").val());
    formData.append('APRCode', $("#txt_APRCode").val());
    formData.append('APR_PFY', $("#txt_PFY").val());
    formData.append('APR_YTD', $("#txt_YTD").val());
    formData.append('ClientId', $("#txt_ClientId_AC").val());
    formData.append('Justification', $("#txt_justificationAccountCustom").val());
    formData.append('Status', 10);
    formData.append('file', fileData);

    $.ajax({
        type: "POST",
        url: "/Comercials/Add_Account_Customization",
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
                //SaveWaiverDetails(response.id);
                //if ($("#AccountCustomization_CustomerId").val() == '') {

                //}
                SaveAccountCustmisation_ApproverDetails(response.id);
                LoadAccountCustomisationGrid(0, 0);
                if ($("#AccountCustomization_CustomerId").val() == '') {
                    $(".side-wrapper").removeClass('opened');
                    $(".side-content").removeClass('slideIn');
                    toastr.success(response.msg);
                }
                else {
                    var userRole = $("#LoginUserRole").val();
                    if (userRole != 'Cluster Head') {
                        toastr.success('Proposal Updated Successfully!');
                    }

                }
                $("#AccountCustomization_CustomerId").val(response.id);

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

function LoadAccountCustomisationGrid(ProposalNumber, ClientId) {

    var TableAccountCustomisation = '';
    $.ajax({
        type: "GET",
        url: "/Comercials/GetAccountCustomisationGridData?ProposalNumber=" + ProposalNumber + "&ClientId=" + ClientId,
        data: null,
        contentType: false,
        // dataType: "json",
        async: false,
        processData: false,
        success: function (response) {

            chkSession(response);
            if (response != null) {

                if (ClientId != '' && ClientId != undefined && ClientId != 0) {
                    var data_filter = response.filter(element => element.clientId == ClientId.toUpperCase());
                    response = data_filter;
                }
                if (ProposalNumber != '' && ProposalNumber != undefined && ProposalNumber != 0) {
                    var AccountNo = [ProposalNumber];

                    var data_filter = response.filter(element => AccountNo.every(f => element.accountNumber.includes(f)));;
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
                TableAccountCustomisation = $('#tbl_AccountCustomisation').DataTable({
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
                            "targets": 3,
                            "className": "d-none"
                        },
                        {
                            "targets": 5,
                            'className': 'lengthLimit',
                        },
                        {
                            "targets": 8,
                            'className': 'd-none',
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

        },
        error: function (xhr, ajaxOptions, thrownError) {
            result = xhr.innerHTML;
        }
    });
    $('#tbl_AccountCustomisation').on('click', 'tbody tr', function (p) {

        var data = {};
        var rowdata = TableAccountCustomisation.row(this).data();
        debugger;
        var userRole = $("#LoginUserRole").val();
        //if ((userRole == 'Relationship Manager' || userRole == 'Cluster Head') && ((rowdata.status != 'In Progress') || rowdata.status != '')) {
        //    $("#tbl_waiverDetails tbody .btn_delete").show();
        //}
        //else {
        //    $("#tbl_waiverDetails tbody .btn_delete").hide();
        //}

        //&& (rowdata.status != 'In Progress' || rowdata.status != '')

        if (rowdata != undefined) {
            $("#AccountPricing_status").val(rowdata.status);
            $("#AccountCustomization_CustomerId").val(rowdata.id);
            $("#sidebar_accountcustomization").addClass("opened");
            $("#txt_AC_CustomerName").val(rowdata.customer_Name);
            $("#createdById").val(rowdata.createdBy);
            LoadAccountCustomisationCustomerDetails(rowdata.id);

            //GetApprovalStatus(rowdata.id, 'check_AccountCustomisation_Approver_Status');
            enableAccordian();
            DisableAllDropdowns();
            //$("#txt_AC_CustomerName").prop('disabled', true).trigger("chosen:updated");
            GetWaiverAccordingToAccountNumber(rowdata.createdBy, rowdata.id);

            if ((userRole == 'Relationship Manager' && rowdata.status != 'Approved' && rowdata.status != 'In Progress') || (userRole == 'Cluster Head' && rowdata.status != 'Approved' && rowdata.status != 'In Progress')) {
                $("#btnAddWaiver").show();
                $("#tbl_waiverTemp tbody .btn_delete").show();
                $("#tbl_waiverDetails tbody .btn_delete").show();
                $("#btn_APR_Details").show();
                $("#btn_save_waiverDetails").show();
            }
            else {
                $("#btnAddWaiver").hide();
                $("#tbl_waiverTemp tbody .btn_delete").addClass("d-none");
                $("#tbl_waiverDetails tbody .btn_delete").addClass("d-none");
                $("#btn_APR_Details").hide();
                $("#btn_save_waiverDetails").hide();
            }
            //if ((userRole == 'Relationship Manager' || userRole == 'Cluster Head')) {
            //    $("#tbl_waiverDetails tbody .btn_delete").show();
            //}
            //else {
            //    $("#tbl_waiverDetails tbody .btn_delete").hide();
            //}
        }

    });

}
$('#txt_ClientId_AC').keypress(function (e) {

    var k;
    document.all ? k = e.keyCode : k = e.which;

    if (e.which !== 32) {

        return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
    }
    else {
        //toastr.error("Space not allowed");
        return false;
    }


});

function LoadAccountCustomisationCustomerDetails(CustomerId) {

    $.ajax({
        type: "GET",
        url: "/Comercials/Get_AccountCustomisationCustomerDetails?CustomerId=" + CustomerId,
        data: null,
        contentType: false,
        async: false,
        processData: false,
        success: function (response) {
            chkSession(response);
            if (response != null) {
                if (response.tbL_OVI_AC_Customer_Details[0].status == 1) {
                    $(".dynamic-control-add").hide();
                    $("#btn_save_waiverDetails").hide();
                } else {
                    $(".dynamic-control-add").show();
                    $("#btn_save_waiverDetails").show();
                }
                var CustomerInfo = response.tbL_OVI_AC_Customer_Details;
                $("#txt_ClientId_AC").val(CustomerInfo[0].ls_ClientId);
                //var documnetSource = "~/AccountCustomisationFiles/" + CustomerInfo[0].documentName;
                //$("#txt_document").attr("href", documnetSource )
                $("#txt_document").val(CustomerInfo[0].documentName);
                if (CustomerInfo[0].documentName != '') {
                    $("#doc_download").show();
                }
                else {
                    $("#doc_download").hide();
                }
                $("#txt_AC_CustomerName").val(CustomerInfo[0].customerName)
                $("#txt_AC_AccountNo").val(CustomerInfo[0].accountNumber)
                $("#txt_ProductCode").val(CustomerInfo[0].productCode)
                $("#txt_APRCode").val(CustomerInfo[0].apR_Code)
                $("#txt_PFY").val(CustomerInfo[0].apR_PFY)
                $("#txt_YTD").val(CustomerInfo[0].apR_YTD)
                $("#LoginUserRole").val(CustomerInfo[0].empRole)
                $("#txt_justificationAccountCustom").val(CustomerInfo[0].justification);
                $("#divCommentsAccount").hide();
                if (CustomerInfo[0].comments != undefined && CustomerInfo[0].comments != '') {
                    $("#divCommentsAccount").show();
                    $("#txt_AccountComments").val(CustomerInfo[0].comments);
                }

                //------ Approvers Dropdowns Binding--------


                for (var i = 0; i < response.tbL_OVI_AC_Approver.length; i++) {
                    var LevelNumber = response.tbL_OVI_AC_Approver[i].levelNumber;
                    var Drp_Value = response.tbL_OVI_AC_Approver[i].approverADID;
                    if (LevelNumber == 1) {
                        $("#AC_DropDown_Level1").val(Drp_Value).trigger('chosen:updated');
                    }
                    else if (LevelNumber == 2) {
                        $("#AC_DropDown_Level2").val(Drp_Value).trigger('chosen:updated');
                    }
                    else if (LevelNumber == 3) {
                        $("#AC_DropDown_Level3").val(Drp_Value).trigger('chosen:updated');
                    }
                    else if (LevelNumber == 4) {
                        $("#AC_DropDown_Level4").val(Drp_Value).trigger('chosen:updated');
                    }
                    else if (LevelNumber == 5) {
                        $("#AC_DropDown_Level5").val(Drp_Value).trigger('chosen:updated');
                    }
                    else if (LevelNumber == 6) {
                        $("#AC_DropDown_Level6").val(Drp_Value).trigger('chosen:updated');
                    } else if (LevelNumber == 7) {
                        $("#AC_DropDown_Level7").val(Drp_Value).trigger('chosen:updated');
                    }

                }


                //$("#btnAddWaiver").hide();
                $("#tbl_waiverDetails tbody>tr").remove();
                $.each(response.tbL_OVI_AC_Waiver_Details, function (key, value) {
                    AddNewWaiverRow(value.chargesType, value.typeOfWaiver, value.ambCommitment, value.value, value.numberofTransactions,
                        value.account_Customisation_Waiver_Details_ID);
                });

            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            event.preventDefault();
        }
    });
}

function SaveAccountCustmisation_ApproverDetails(CustomerID) {

    if ($("#AC_DropDown_Level1").val().length > 0) {
        fnSaveAccountCustomisationApprover(CustomerID, 0, $("#AC_DropDown_Level1").val(), 1, 'Add_AccountCustomization_Approver_Details')
    }
    //}

    if ($("#AC_DropDown_Level2").val().length > 0) {
        fnSaveAccountCustomisationApprover(CustomerID, 4, $("#AC_DropDown_Level2").val(), 2, 'Add_AccountCustomization_Approver_Details')
    }

    if ($("#AC_DropDown_Level3").val().length > 0) {
        fnSaveAccountCustomisationApprover(CustomerID, 4, $("#AC_DropDown_Level3").val(), 3, 'Add_AccountCustomization_Approver_Details')
    }

    if ($("#AC_DropDown_Level4").val().length > 0) {
        fnSaveAccountCustomisationApprover(CustomerID, 4, $("#AC_DropDown_Level4").val(), 4, 'Add_AccountCustomization_Approver_Details')
    }
    if ($("#AC_DropDown_Level5").val().length > 0) {
        fnSaveAccountCustomisationApprover(CustomerID, 4, $("#AC_DropDown_Level5").val(), 5, 'Add_AccountCustomization_Approver_Details')
    }

    if ($("#AC_DropDown_Level6").val().length > 0) {
        fnSaveAccountCustomisationApprover(CustomerID, 4, $("#AC_DropDown_Level6").val(), 6, 'Add_AccountCustomization_Approver_Details')
    }
    if ($("#AC_DropDown_Level7").val().length > 0) {
        fnSaveAccountCustomisationApprover(CustomerID, 4, $("#AC_DropDown_Level7").val(), 7, 'Add_AccountCustomization_Approver_Details')
    }
}

function SaveWaiverDetails() {
    var rowid = "";
    $('#tbl_waiverDetails tr').each(function (e) {
        var formData = new FormData();
        if (e != 0) {
            if ($(this).find("td:eq(2) input[type='text']").length >= 1) {
                formData.append('ChargesType', $(this).find("td:eq(0) option:selected").val());
                formData.append('WaiverType', $(this).find("td:eq(1) option:selected").val());
                formData.append('WaiverValues', $(this).find("td:eq(2) input[type='text']").val());
                formData.append('TxnNumber', $(this).find("td:eq(3) input[type='text']").val());
                formData.append('AMBCommitment', $(this).find("td:eq(4) input[type='text']").val());
                formData.append('AccountNumber', $("#txt_AC_AccountNo").val());
                formData.append('CustomerName', $("#txt_AC_CustomerName").val());
                formData.append('ProductCode', $("#txt_ProductCode").val());
                formData.append('RowId', $(this).find("td:eq(3) input[type='text']").attr("data-id"));
                formData.append('CustomerId', $("#AccountCustomization_CustomerId").val());
                formData.append('ProductCode', $("#txt_ProductCode").val());
                rowid = $(this).find("td:eq(3) input[type='text']").attr("data-id");
                var charges_output = fnSaveMaster(formData, 'Add_Waiver_Details');
            }
        }
    });




}

function fnSaveAccountCustomisationApprover(CustomerID, Status, ApproverADID, LevelNumber, url) {
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
function EmptyAllFields() {
    $("#documentupload").val('');
    $("#txt_ClientId_AC").val('');
    $("#txt_justificationAccountCustom").val('');
    $("#txt_document").val('');
    $("#txt_AC_CustomerName").val('');
    $("#txt_AC_AccountNo").val('');
    $("#txt_ProductCode").val('');
    $("#txt_APRCode").val('');
    $("#txt_PFY").val('');
    $("#txt_YTD").val('');
    $("#tbl_waiverDetails tbody>tr").remove();
    $("#AC_DropDown_Level1").val(All_Supervisors[0].level1).trigger('chosen:updated');
    $("#AC_DropDown_Level2").val(All_Supervisors[0].level2).trigger('chosen:updated');
    $("#AC_DropDown_Level3").val(All_Supervisors[0].level3).trigger('chosen:updated');
    $("#AC_DropDown_Level4").val(All_Supervisors[0].level4).trigger('chosen:updated');
    $("#AC_DropDown_Level5").val(All_Supervisors[0].level5).trigger('chosen:updated');
    $("#AC_DropDown_Level6").val(All_Supervisors[0].level6).trigger('chosen:updated');
    $("#AC_DropDown_Level7").val(All_Supervisors[0].level7).trigger('chosen:updated');
}
function DisableAllDropdowns() {
    //$('#AC_DropDown_Level1').prop('disabled', true).trigger("chosen:updated");
    //$('#AC_DropDown_Level2').prop('disabled', true).trigger("chosen:updated");
    //$('#AC_DropDown_Level3').prop('disabled', true).trigger("chosen:updated");
    //$('#AC_DropDown_Level4').prop('disabled', true).trigger("chosen:updated");
    //$('#AC_DropDown_Level5').prop('disabled', true).trigger("chosen:updated");
    //$('#AC_DropDown_Level6').prop('disabled', true).trigger("chosen:updated");
    //$('#AC_DropDown_Level7').prop('disabled', true).trigger("chosen:updated");
}
function EnableAllDropdowns() {
    $('#AC_DropDown_Level1').prop('disabled', false).trigger("chosen:updated");
    $('#AC_DropDown_Level2').prop('disabled', false).trigger("chosen:updated");
    $('#AC_DropDown_Level3').prop('disabled', false).trigger("chosen:updated");
    $('#AC_DropDown_Level4').prop('disabled', false).trigger("chosen:updated");
    $('#AC_DropDown_Level5').prop('disabled', false).trigger("chosen:updated");
    $('#AC_DropDown_Level6').prop('disabled', false).trigger("chosen:updated");
    $('#AC_DropDown_Level7').prop('disabled', false).trigger("chosen:updated");
}

$("#btn_save_waiverDetails").on('click', function (e) {
    var WaiverrowCount = $('#tbl_waiverDetails >tbody >tr').length;
    if (WaiverrowCount < 1) {
        Isvalidate = false;
        toastr.error('Atleast one record required in Waiver Details');
        return;
    }
    var Isvalidate = true;
    if ($("#txt_AC_CustomerName").val() == '' || $("#txt_AC_CustomerName").val() == undefined) {
        Isvalidate = false;
        toastr.error('Please enter customer name');
        return;
    }
    if ($("#txt_AC_AccountNo").val() == '' || $("#txt_AC_AccountNo").val() == undefined) {
        Isvalidate = false;
        toastr.error('Please enter account number');
        return;
    }
    if ($("#txt_ProductCode").val() == '' || $("#txt_ProductCode").val() == undefined) {
        Isvalidate = false;
        toastr.error('Please enter product code');
        return;
    }

    $('#tbl_waiverDetails tr').each(function (e) {
        if (e != 0) {
            if ($(this).find("td:eq(2) input[type='text']").val() == "") {
                Isvalidate = false;
                toastr.error('Values required in WAIVER Details');
                return;
            }
            if ($(this).find("td:eq(3) input[type='text']").val() == "") {
                Isvalidate = false;
                toastr.error('No. of txn is required in WAIVER Details');
                return;
            }
            if ($(this).find("td:eq(4) input[type='text']").val() == "") {
                Isvalidate = false;
                toastr.error('AMB Commitment is required in WAIVER Details');
                return;
            }
        }
    });
    if (Isvalidate == true) {
        SaveWaiverDetails();
        GetWaiverAccordingToAccountNumber($("#createdById").val(), $("#AccountCustomization_CustomerId").val());
        //LoadAccountCustomisationGrid(0,0);

    }


});

$("#btn_close_accountCustomisation").on("click", function () {
    ClearWaiverTempRecords();
});

function ClearWaiverTempRecords() {
    $.ajax({
        type: "GET",
        url: "/Comercials/ClearWaiverTempRecords",
        data: null,
        contentType: false,
        // dataType: "json",
        async: false,
        processData: false,
        success: function (response) {
            success = response.isSuccess;
        },
        error: function (xhr, ajaxOptions, thrownError) {
            result = xhr.innerHTML;
        }
    });
}

function GetWaiverAccordingToAccountNumber(createdBy, customerId) {

    var accountNo = $("#txt_AC_AccountNo").val();
    var CustomerName = $("#txt_AC_CustomerName").val();
    $.ajax({
        type: "GET",
        url: "/Comercials/GetWaiverAccordingToAccountNumber?AccNo=" + accountNo + "&createdBy=" + createdBy + "&customerId=" + customerId,
        data: null,
        contentType: false,
        // dataType: "json",
        async: false,
        processData: false,
        success: function (response) {
            chkSession(response);
            if (response.length > 0) {

                //$("#tbl_waiverTemp tbody>tr").remove();
                // $('#tbl_waiverTemp tbody').append('<tr><td>' + response[0].customerName + '</td><td>' + response[0].accountNumber + '</td><td>' + response[0].totalCharges + '</td><td>' + response[0].totalValue + '</td><td><a class="link" id="Edit_Waiver" onclick="editWaiver(\'' + response[0].accountNumber + '\',\'Geteditbeforesave\',\'' + response[0].createdBy + '\')" ><i class="fa fa-pencil"></i></a>\n<button type="button" onclick="editWaiver(\'' + response[0].accountNumber + '\',\'Deletebeforesave\',\'' + response[0].createdBy + '\')" class="btn btn_delete"><i class="icon-trash"></i></button></td></tr>');
                //$("#tbl_waiverDetails tbody>tr").remove();

                table = $("#tbl_waiverTemp").DataTable({
                    data: response,
                    columns: [
                        { title: "Customer Name", data: "customerName" },
                        { title: "Account No.", data: "accountNumber" },
                        { title: "No. Of Charges", data: "totalCharges" },
                        { title: "Value(in lac(s))", data: "totalValue" },
                        { title: "CreatedBy", data: "createdBy" },
                        {
                            "defaultContent": '<a class="Edit_Waiver link"><i class="fa fa-pencil"></i></a>\n<button type="button" class="btn btn_delete"><i class="icon-trash"></i></button>',
                            title: 'Action'
                        }

                    ],
                    "columnDefs": [{
                        "targets": [0],
                        "searchable": false,
                        "orderable": false,
                    },
                    {
                        "targets": 4,
                        "className": "d-none"
                    },
                    ],
                    "ordering": false,
                    "paging": false,
                    "info": false,
                    "searching": false,
                    fixedHeader: true,
                    responsive: true,
                    destroy: true,
                    "processing": true,
                });
                $("#tbl_waiverDetails tbody>tr").remove();
                AddNewWaiverRow('', '', '', '', '', '');
                $("#txt_AC_CustomerName").val('');
                $("#txt_AC_AccountNo").val('');
                $("#txt_ProductCode").val('');
                $("#tbl_waiverTemp").show();




            }

        },
        error: function (xhr, ajaxOptions, thrownError) {
            result = xhr.innerHTML;
        }
    });

}

$('#tbl_waiverTemp').on('click', 'tbody .Edit_Waiver', function (p) {

    var data_row = table.row($(this).closest('tr')).data();
    var customerId = $("#AccountCustomization_CustomerId").val();
    if (customerId == '') {
        editWaiver(data_row.accountNumber, 'Geteditbeforesave', data_row.createdBy);
    }
    else {
        editWaiver(data_row.accountNumber, 'GeteditAftersave', data_row.createdBy);
    }
    var status = $("#AccountPricing_status").val();
    var userRole = $("#LoginUserRole").val();
    if ((userRole == 'Relationship Manager' && status != 'Approved' && status != 'In Progress') || (userRole == 'Cluster Head' && status != 'Approved' && status != 'In Progress')) {
        $("#tbl_waiverDetails tbody .btn_delete").show();

    }
    else {
        $("#tbl_waiverDetails tbody .btn_delete").addClass("d-none");
    }


});
$('#tbl_waiverTemp').on('click', 'tbody .btn_delete', function (p) {
    var deleteBtnCount = $("#tbl_waiverTemp tbody .btn_delete").length;
    if (deleteBtnCount == 1) {
        toastr.error("Atleast one record is mandatory");
    }
    else {
        var result = confirm("Are you sure to delete?");
        if (result) {
            var data_row = table.row($(this).closest('tr')).data();
            $("#tbl_waiverDetails tbody>tr").remove();
            var customerId = $("#AccountCustomization_CustomerId").val();
            if (customerId == '') {
                editWaiver(data_row.accountNumber, 'Deletebeforesave', data_row.createdBy);
            }
            else {
                editWaiver(data_row.accountNumber, 'DeleteAftersave', data_row.createdBy);
            }
            GetWaiverAccordingToAccountNumber(data_row.createdBy, $("#AccountCustomization_CustomerId").val());
        }

    }

});

$("#BtnApproveAccountCustomisation").on('click', function (e) {

    var remark = $("#txt_approve_remark_AccountCustomisation").val();
    if (remark == '') {
        toastr.error('Enter Remark');
    }
    else {
        $('#ApproveModalAccountCustomisation').modal('toggle');
        $(".side-wrapper").removeClass('opened');
        $(".side-content").removeClass('slideIn');
        var userRole = $("#LoginUserRole").val();
        if (userRole == 'Cluster Head') {
            AccountCustomizationSubmitClick();
        }
        UpdateApprovalStatusAccountCustomisation($("#AccountCustomization_CustomerId").val(), "Approve", remark);

    }
});
$("#BtnSendBackAccountCustomisation").on('click', function (e) {

    var remark = $("#txt_sendback_remark_AccountCustomisation").val();
    if (remark == '') {
        toastr.error('Enter Remark');
    }
    else {
        $('#SendBackModalAccountCustomisation').modal('toggle');
        UpdateApprovalStatusAccountCustomisation($("#AccountCustomization_CustomerId").val(), "Send_Back", remark);

        $(".side-wrapper").removeClass('opened');
        $(".side-content").removeClass('slideIn');
    }
});
$("#BtnRejectAccountCustomisation").on('click', function (e) {

    var remark = $("#txt_reject_remark_AccountCustomisation").val();
    if (remark == '') {
        toastr.error('Enter Remark');
    }
    else {
        $('#RejectModalAccountCustomisation').modal('toggle');
        UpdateApprovalStatusAccountCustomisation($("#AccountCustomization_CustomerId").val(), "Reject", remark);

        $(".side-wrapper").removeClass('opened');
        $(".side-content").removeClass('slideIn');
    }
});

function UpdateApprovalStatusAccountCustomisation(Account_Customisation_CustomerId, action, remark) {

    formData = new FormData();
    formData.append('CustomerId', Account_Customisation_CustomerId);
    formData.append('Action', action);
    formData.append('Remark', remark);
    $.ajax({
        type: "POST",
        url: "/Comercials/Update_AccountCustomisation_ApprovalStatus",
        data: formData,
        contentType: false,
        // dataType: "json",
        async: false,
        processData: false,
        success: function (response) {
            chkSession(response);
            debugger;
            if (response != null && response.isSuccess == 'true') {
                toastr.success(response.msg);
                $("#txt_reject_remark_AccountCustomisation").val('');
                $("#txt_sendback_remark_AccountCustomisation").val('');
                $("#SendBackModalAccountCustomisation").modal("hide");
                $("#RejectModalAccountCustomisation").modal("hide");
                LoadAccountCustomisationGrid(0, 0);
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
function DeleteWaiver(WaiverId) {
    var success;
    $.ajax({
        type: "GET",
        url: "/Comercials/DeleteWaiverById?WaiverId=" + WaiverId,
        data: null,
        contentType: false,
        // dataType: "json",
        async: false,
        processData: false,
        success: function (response) {
            debugger;
            success = response.isSuccess;

        },
        error: function (xhr, ajaxOptions, thrownError) {
            result = xhr.innerHTML;
        }
    });
    return success;
}
function editWaiver(accountNumber, action, createdBy) {

    $.ajax({
        type: "GET",
        url: "/Comercials/GetWaiversForEdit?AccNo=" + accountNumber + "&Identflag=" + action + "&createdBy=" + createdBy,
        data: null,
        contentType: false,
        // dataType: "json",
        async: false,
        processData: false,
        success: function (response) {
            chkSession(response);
            if (response.length > 0) {

                if (action == 'Geteditbeforesave') {
                    $("#tbl_waiverDetails tbody>tr").remove();
                    $.each(response, function (key, value) {
                        AddNewWaiverRow(value.chargesType, value.typeOfWaiver, value.ambCommitment, value.value, value.numberofTransactions,
                            value.account_Customisation_Waiver_Details_Temp_ID);
                    });
                    $("#txt_AC_CustomerName").val(response[0].customerName);
                    $("#txt_AC_AccountNo").val(response[0].accountNumber);
                    $("#txt_ProductCode").val(response[0].productCode);

                }
                if (action == 'GeteditAftersave') {
                    debugger;
                    $("#tbl_waiverDetails tbody>tr").remove();
                    $.each(response, function (key, value) {
                        AddNewWaiverRow(value.chargesType, value.typeOfWaiver, value.ambCommitment, value.value, value.numberofTransactions,
                            value.account_Customisation_Waiver_Details_ID);
                    });
                    $("#txt_AC_CustomerName").val(response[0].customerName);
                    $("#txt_AC_AccountNo").val(response[0].accountNumber);
                    $("#txt_ProductCode").val(response[0].productCode);
                }


            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            result = xhr.innerHTML;
        }
    });

}