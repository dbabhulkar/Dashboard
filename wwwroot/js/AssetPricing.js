var PromotersName = [];
var NewPromoters = [];
$(document).ready(function () {
    GetAllRecepients();

    $(function () {
        $("#DropDown_Level1").chosen({ max_selected_options: 1 });
        $("#DropDown_Level2").chosen({ max_selected_options: 1 });
        $("#DropDown_Level3").chosen({ max_selected_options: 1 });
        $("#DropDown_Level4").chosen({ max_selected_options: 1 });
        $("#DropDown_Level5").chosen({ max_selected_options: 1 });
        $("#DropDown_Level6").chosen({ max_selected_options: 1 });
        $("#DropDown_Level7").chosen({ max_selected_options: 1 });

        ////// Reversal Approval dropdowns
        $("#DropDown_Reversal_Level1").chosen({ max_selected_options: 1 });
        $("#DropDown_Reversal_Level2").chosen({ max_selected_options: 1 });
        $("#DropDown_Reversal_Level3").chosen({ max_selected_options: 1 });
        $("#DropDown_Reversal_Level4").chosen({ max_selected_options: 1 });
        $("#DropDown_Reversal_Level5").chosen({ max_selected_options: 1 });
        $("#DropDown_Reversal_Level6").chosen({ max_selected_options: 1 });
        $("#DropDown_Reversal_Level7").chosen({ max_selected_options: 1 });

        ////// Account Customization dropdowns
        $("#AC_DropDown_Level1").chosen({ max_selected_options: 1 });
        $("#AC_DropDown_Level2").chosen({ max_selected_options: 1 });
        $("#AC_DropDown_Level3").chosen({ max_selected_options: 1 });
        $("#AC_DropDown_Level4").chosen({ max_selected_options: 1 });
        $("#AC_DropDown_Level5").chosen({ max_selected_options: 1 });
        $("#AC_DropDown_Level6").chosen({ max_selected_options: 1 });
        $("#AC_DropDown_Level7").chosen({ max_selected_options: 1 });
    });

    $("#btnFacilityDetails").click(function () {
        AddNewFacilityRow('', '', '', '', '', '', '');
    });

    $("#btnAddCharges").click(function () {
        AddNewChargesRow('', '', '', '');
    });
    $("#btnAddCollateral").click(function () {
        AddNewCollateralRow('', '', '', '', '');
    });
    $("#BtnAddBanking").click(function () {
        AddNewBankingRow('', '', '', '', '', '');
    });
    $("#BtnAddPromoters").click(function () {
        AddNewPromotersRow('', '', '', '', '');
    });

    $("#BtnAddCustomers").on('click', function (e) {
        AddNewCustomerRow('', '', '', '', '', '', '');
    })
    $('input[name=PSL]').change(function () {
        if ($(this).val() === '0') {
            $("#psl_details").hide();

        } else {
            $("#psl_details").show();
        }
    });


    $('input[name=Multiple_Banking]').change(function () {

        if ($(this).val() === '0') {
            $("#BtnAddBanking").hide();

        } else {
            $("#BtnAddBanking").show();
        }
    });
})
////////////Row delete of table/////////////////

$("#tbl_FacilityDetails").on('click', 'tbody .btn_delete', function (e) {

    $(this).closest('tr').remove();

})
$("#tbl_OtherCharges").on('click', 'tbody .btn_delete_charges', function (e) {

    $(this).closest('tr').remove();

})
$("#tbl_ipCollateral").on('click', 'tbody .btn_delete_row', function (e) {

    $(this).closest('tr').remove();

})
$("#tbl_MultipleBanking").on('click', 'tbody .btnDeleteRow', function (e) {

    $(this).closest('tr').remove();

})
$("#tbl_Promoters").on('click', 'tbody .btnDeletePromoter', function (e) {

    $(this).closest('tr').remove();

})
$("#tbl_customers").on('click', 'tbody .btnDeletePromoter', function (e) {

    $(this).closest('tr').remove();

})

//////////////////////Row delete close//////////////////////////////////////


/////////////////////Add Row in tables//////////////////////////////////

function AddNewFacilityRow(facilityType, existingAmount, proposedAmount, existingPrice, proposedPrice, fileName, Facility_Details_Id) {

    let arrHead = new Array();	// array for header.
    if (facilityType == '') {
        arrHead = ['Facility', 'AmountExisting', 'AmountProposed', 'PricingExisting', 'PricingProposed', 'Instruction', 'File', 'Action'];
    }
    else {
        arrHead = ['Facility', 'AmountExisting', 'AmountProposed', 'PricingExisting', 'PricingProposed', 'Instruction', 'File'];
    }


    let empTab = document.getElementById('tbl_FacilityDetails');

    let rowCnt = empTab.rows.length;   // table row count.

    let tr = empTab.insertRow(rowCnt); // the table row.
    tr = empTab.insertRow(rowCnt);

    var fileUploadId = Math.random().toString(36).substr(2, 9) + "_facilityfile";
    for (let c = 0; c < arrHead.length; c++) {
        let td = document.createElement('td'); // table definition.
        td = tr.insertCell(c);

        if (c === 0) {      // the first column.
            var select = document.createElement("select");
            select.name = "Drp_Facility";
            select.id = "Drp_Facility";
            select.setAttribute('class', 'form-control custom-form-control IsFacility_drp');

            for (const val of facilityDetailData) {
                var option = document.createElement("option");
                option.value = val.key;
                option.text = val.value;
                if (val.key == facilityType) {
                    option.setAttribute("selected", "selected");
                }
                select.appendChild(option);

            }

            select.onchange = function (e) {

                var a = $(this).closest('tr').find((".IsFacility_drp")).val();
                if (a == 'NFB') {
                    $(this).closest('tr').find("select[name='Drp_Instruction']").val('');
                    $(this).closest('tr').find("select[name='Drp_Instruction']").css("cursor", "not-allowed");
                    $(this).closest('tr').find("select[name='Drp_Instruction']").attr("disabled", "disabled");
                    $(this).closest('tr').find("select[name='Drp_Instruction']").css("opacity", "0.6");
                }
                else {
                    $(this).closest('tr').find("select[name='Drp_Instruction']").removeAttr("disabled");
                    $(this).closest('tr').find("select[name='Drp_Instruction']").css("cursor", "default");
                    $(this).closest('tr').find("select[name='Drp_Instruction']").css("opacity", "1");
                }

            };

            td.appendChild(select);
        }
        else if (c === 1) {
            let ExistingAMT = document.createElement('div');
            ExistingAMT.innerHTML = "<div data-tip='Enter digits only'><input data-id='" + Facility_Details_Id + "' value='" + existingAmount + "' class='form-control custom-form-control' onkeypress='return isNumberKey(event)' type='text' id='" + arrHead[c] + "'/></div>";

            //ExistingAMT.setAttribute('type', 'number');
            //ExistingAMT.id = arrHead[c];
            //ExistingAMT.setAttribute('class', 'form-control custom-form-control')
            //if (existingAmount != '') {
            //    ExistingAMT.setAttribute('value', existingAmount);
            //}

            //ExistingAMT.setAttribute('data-id', Facility_Details_Id);
            td.appendChild(ExistingAMT);
        }
        else if (c === 2) {
            let ProposedAMT = document.createElement('div');
            ProposedAMT.innerHTML = "<div data-tip='Enter digits only'><input class='form-control custom-form-control' value='" + proposedAmount + "' onkeypress='return isNumberKey(event)' type='text' id='" + arrHead[c] + "'/></div>";
            //ProposedAMT.setAttribute('type', 'number');
            //ProposedAMT.id = arrHead[c];
            //ProposedAMT.setAttribute('class', 'form-control custom-form-control')
            //ProposedAMT.setAttribute('value', proposedAmount);

            td.appendChild(ProposedAMT);
        }
        else if (c === 3) {
            let ExistingPrice = document.createElement('div');
            ExistingPrice.innerHTML = "<div data-tip='Enter digits only'><input class='form-control custom-form-control' value='" + existingPrice + "' onkeypress='return isNumberKey(event)' type='text' id='" + arrHead[c] + "'/></div>";
            //ExistingPrice.setAttribute('type', 'number');
            //ExistingPrice.id = arrHead[c];
            //ExistingPrice.setAttribute('class', 'form-control custom-form-control')
            //ExistingPrice.setAttribute('value', existingPrice);

            td.appendChild(ExistingPrice);
        }
        else if (c === 4) {
            let ProposedPrice = document.createElement('div');
            ProposedPrice.innerHTML = "<div data-tip='Enter digits only'><input class='form-control custom-form-control' value='" + proposedPrice + "' onkeypress='return isNumberKey(event)' type='text' id='" + arrHead[c] + "'/></div>";
            //ProposedPrice.setAttribute('type', 'number');
            //ProposedPrice.id = arrHead[c];
            //ProposedPrice.setAttribute('class', 'form-control custom-form-control')
            //ProposedPrice.setAttribute('value', proposedPrice);
            td.appendChild(ProposedPrice);
        }
        else if (c === 5) {
            var select = document.createElement("select");
            select.name = "Drp_Instruction";
            select.id = "Drp_Instruction";
            select.setAttribute('class', 'form-control custom-form-control');

            var selected = "";
            var optionDefault = document.createElement("option");
            optionDefault.value = "";
            optionDefault.text = "Selet Instruction";
            select.appendChild(optionDefault);
            for (const val of facilityInstructionDetailData) {
                var option = document.createElement("option");
                option.value = val.key;
                option.text = val.value;
                if (val.key == facilityType) {
                    option.setAttribute("selected", "selected");
                }
                select.appendChild(option);

            }

            if (selected == "") {
                optionDefault.setAttribute("selected", "selected");
            }
            td.appendChild(select);
        }
        else if (c === 6) {
            var fileUpload = document.createElement("div");

            fileUpload.innerHTML = "<div class='fileUpload blue-btn btn width100'><i class='fa fa-upload'></i><div class='file-name' id='" + fileUploadId + "'></div>" +
                "<input id='" + fileUploadId + "_facilityfile' type='file' class='uploadlogo' accept='.csv,.xlsx,.xlsm,.xls'></div>";


            //var fileUpload = document.createElement("input");
            //fileUpload.setAttribute('type', 'file');
            //fileUpload.name = "file";
            //fileUpload.id = Math.random().toString(36).substr(2, 9) + "_facilityfile"
            //fileUpload.setAttribute('class', 'facilityfile');
            td.appendChild(fileUpload);
            if (fileName != '') {
                var fileLable = document.createElement("label");
                fileLable.innerText = fileName;
                td.appendChild(fileLable);
            }

        }
        else if (c == 7) {
            if (facilityType == '') {
                if (rowCnt > 3) {
                    let btn = document.createElement('button');
                    btn.setAttribute('type', 'button');
                    //btn.id = "btn_delete";
                    btn.innerHTML = "<i class='icon-trash'></i>"
                    btn.setAttribute('class', 'btn btn_delete');
                    //btn.setAttribute('style', 'width: none!important');
                    //btn.innerText = "Delete"
                    td.appendChild(btn);
                }
            }
        }

    }


    $(document).on('change', '.uploadlogo', function (e) {

        var filename = readURL(this);
        $(this).parent().children('div').html(filename);
    });

    // Read File and return value  
    function readURL(input) {

        var url = input.value;
        var ext = url.substring(url.lastIndexOf('.') + 1).toLowerCase();
        if (input.files && input.files[0] && (
            ext == "xlsx" || ext == "xlsm" || ext == "xls" || ext == "csv"
        )) {
            var path = $(input).val();
            var filename = path.replace(/^.*\\/, "");
            // $('.fileUpload span').html('Uploaded Proof : ' + filename);
            return filename;
        } else {
            $(input).val("");
            return "Only excel format is allowed!";
        }
    }
    $("#tbl_FacilityDetails>tbody").append(tr);

    // Upload btn end
}

function AddNewCustomerRow(promoter_Name, relationshipName, relationshipWith, promoter_Type, isAcccount, accountNumber, promoter_ID) {

    let arrHead = new Array();	// array for header.
    if (promoter_Name == '') {
        arrHead = ['Name', 'Relationship', 'Relationship With', 'Type of Customer', 'Account', 'Account Number', ''];
    }
    else {
        arrHead = ['Name', 'Relationship', 'Relationship With', 'Type of Customer', 'Account', 'Account Number'];
    }
    let empTab = document.getElementById('tbl_customers');


    let rowCnt = empTab.rows.length;   // table row count.
    let tr = empTab.insertRow(rowCnt); // the table row.
    for (let c = 0; c < arrHead.length; c++) {
        let td = document.createElement('td'); // table definition.
        td = tr.insertCell(c);
        if (c == 0) {
            let textbox = document.createElement('input');
            textbox.setAttribute('type', 'text');
            textbox.id = arrHead[c];
            textbox.setAttribute('class', 'form-control custom-form-control')
            textbox.setAttribute('value', promoter_Name);
            textbox.setAttribute('data-id', promoter_ID);
            td.appendChild(textbox);

        }
        else if (c == 1) {
            var Relationship_select = document.createElement("select");
            Relationship_select.name = "drp_Relationships";
            Relationship_select.id = "Drp_Relationships"
            Relationship_select.setAttribute('class', 'form-control custom-form-control')
            var RelatioshipName = [
                { Type: "Father" },
                { Type: "Mother" },
                { Type: "Son" },
                { Type: "Daughter" },
                { Type: "Spouse" },
                { Type: "Husband" },
                { Type: "Niece" },
                { Type: "Nephew" },
                { Type: "Grandparents" },
                { Type: "Sister" },
                { Type: "Brother" },
                { Type: "Sibling" },
                { Type: "Grandchild" },
                { Type: "Cousin" },
                { Type: "Aunt" },
                { Type: "Uncle" },
                { Type: "Friend" },
            ]
            for (const val of RelatioshipName) {
                var drp_option = document.createElement("option");
                drp_option.value = val.Type;
                drp_option.text = val.Type;
                if (val.Type == relationshipName) {
                    drp_option.setAttribute("selected", "selected");
                }
                Relationship_select.appendChild(drp_option);
            }
            td.appendChild(Relationship_select);
        }
        else if (c == 2) {
            var select = document.createElement("select");
            select.name = "drp_RelationshipWith";
            select.id = "Drp_RelationshipWith"
            select.setAttribute('class', 'form-control custom-form-control drp_RelationshipWith')
            if (PromotersName != '') {
                for (const val of PromotersName) {
                    var option = document.createElement("option");
                    option.value = val;
                    option.text = val;
                    select.appendChild(option);
                }
            }
            else {
                for (const val of NewPromoters) {
                    var option = document.createElement("option");
                    option.value = val;
                    option.text = val;
                    if (val == relationshipWith) {
                        option.setAttribute("selected", "selected");
                    }
                    select.appendChild(option);
                }
            }

            //for (i = 0; i < PromotersName.length; i++) {
            //    var data = '<option>' + PromotersName[i] + '</option>'
            //    $('select').append(data);
            //}



            td.appendChild(select);
        }
        else if (c == 3) {
            var select_type = document.createElement("select");
            select_type.name = "drp_CustomerType";
            select_type.id = "Drp_CustomerType"
            select_type.setAttribute('class', 'form-control custom-form-control')
            var CustomerType = [
                { Type: "Primary Applicant" },
                { Type: "Proprietor" },
                { Type: "Guarantor" },
                { Type: "Partner" },
                { Type: "Group Concern" },
                { Type: "Director" },
            ]
            for (const val of CustomerType) {
                var type_option = document.createElement("option");
                type_option.value = val.Type;
                type_option.text = val.Type;
                if (val.Type == promoter_Type) {
                    type_option.setAttribute("selected", "selected");
                }
                select_type.appendChild(type_option);
            }
            td.appendChild(select_type);

        }
        else if (c == 4) {
            var select_account = document.createElement("select");
            select_account.name = "drp_IsAccount";
            select_account.id = "Drp_IsAccount"
            select_account.setAttribute('class', 'form-control custom-form-control')
            var IsAccount = [
                { key: 1, value: "Yes" },
                { key: 0, value: "No" }

            ];
            for (const val of IsAccount) {
                var option = document.createElement("option");
                option.value = val.key;
                option.text = val.value;
                if (val.key == isAcccount) {
                    option.setAttribute("selected", "selected");
                }
                select_account.appendChild(option);
            }

            td.appendChild(select_account);
        }
        else if (c == 5) {
            if (isAcccount == 0 || accountNumber == null) {
                accountNumber = '';
            }
            let textbox = document.createElement('div');
            textbox.innerHTML = "<div data-tip='Enter digits only'><input value='" + accountNumber + "' class='form-control custom-form-control' onkeypress='return isNumberKey(event)' type='text' id='" + arrHead[c] + "'/></div>";

            td.appendChild(textbox);
        }
        else {
            if (promoter_Name == '') {
                if (rowCnt >= 2) {
                    let btn = document.createElement('button');
                    btn.setAttribute('type', 'button');
                    //btn.id = "btn_delete";
                    btn.innerHTML = "<i class='icon-trash'></i>"
                    btn.setAttribute('class', 'btn btnDeletePromoter');

                    td.appendChild(btn);

                }
            }

        }

    }
    $("#tbl_customers>tbody").append(tr);
}


function AddNewPromotersRow(promoter_Name, promoter_Type, isAcccount, accountNumber, promoter_ID) {

    var Is_account = "";
    let arrHead = new Array();	// array for header.
    if (promoter_Name == '') {
        arrHead = ['Name', 'Type', 'IsAccount', 'Account_No', ''];
    }
    else {
        arrHead = ['Name', 'Type', 'IsAccount', 'Account_No'];
    }

    NewPromoters.push(promoter_Name);
    let empTab = document.getElementById('tbl_Promoters');

    let rowCnt = empTab.rows.length;   // table row count.
    let tr = empTab.insertRow(rowCnt); // the table row.

    for (let c = 0; c < arrHead.length; c++) {
        let td = document.createElement('td'); // table definition.
        td = tr.insertCell(c);
        if (c == 0) {
            let textbox = document.createElement('input');
            textbox.setAttribute('type', 'text');
            textbox.id = arrHead[c];
            textbox.setAttribute('class', 'form-control custom-form-control txtPromotersName')
            textbox.setAttribute('value', promoter_Name);
            textbox.setAttribute('data-id', promoter_ID);

            td.appendChild(textbox);

        }
        else if (c == 1) {
            var Promoter_select = document.createElement("select");
            Promoter_select.name = "drp_PromoterType";
            Promoter_select.id = "Drp_PromoterType"
            Promoter_select.setAttribute('class', 'form-control custom-form-control')
            var PromoterType = [
                { Type: "Primary Applicant" },
                { Type: "Proprietor" },
                { Type: "Guarantor" },
                { Type: "Partner" },
                { Type: "Group Concern" },
                { Type: "Director" },
            ]

            for (const val of PromoterType) {
                var drp_option = document.createElement("option");
                drp_option.value = val.Type;
                drp_option.text = val.Type;
                if (val.Type == promoter_Type) {
                    drp_option.setAttribute("selected", "selected");
                }
                Promoter_select.appendChild(drp_option);
            }
            td.appendChild(Promoter_select);
        }
        else if (c == 2) {
            var select = document.createElement("select");
            select.name = "drp_IsAccount";
            select.id = "Drp_IsAccount"
            select.setAttribute('class', 'form-control custom-form-control IsAcoount_drp')
            var IsAccount = [
                { key: 1, value: "Yes" },
                { key: 0, value: "No" }

            ];
            for (const val of IsAccount) {
                var option = document.createElement("option");
                option.value = val.key;
                option.text = val.value;
                if (val.key == isAcccount) {
                    option.setAttribute("selected", "selected");
                }
                select.appendChild(option);
            }
            //select.onchange = function (e) {
            //    debugger

            //};

            td.appendChild(select);
        }
        else if (c == 3) {
            let textbox = document.createElement('div');
            if (isAcccount == 0 || accountNumber == null) {
                accountNumber = '';
            }


            textbox.innerHTML = "<div data-tip='Enter digits only'><input value='" + accountNumber + "' class='form-control custom-form-control TxtAccount' onkeypress='return isNumberKey(event)' type='text' id='" + arrHead[c] + "'/></div>";



            if (isAcccount == 1) {
                textbox.setAttribute('value', accountNumber);
            }
            else {
                textbox.setAttribute('value', '');
            }

            td.appendChild(textbox);
        }
        else {
            if (promoter_Name == '') {
                if (rowCnt >= 2) {
                    let btn = document.createElement('button');
                    btn.setAttribute('type', 'button');
                    //btn.id = "btn_delete";
                    btn.innerHTML = "<i class='icon-trash'></i>"
                    btn.setAttribute('class', 'btn btnDeletePromoter');

                    td.appendChild(btn);

                }
            }

        }

    }
    $("#tbl_Promoters>tbody").append(tr);

}



function AddNewChargesRow(chargeType, existingPrice, proposedPrice, other_Charges_ID) {

    let arrHead = new Array();	// array for header.
    if (chargeType == '') {
        arrHead = ['ChargesType', 'ExistingPrice', 'ProposedPrice', ''];
    }
    else {
        arrHead = ['ChargesType', 'ExistingPrice', 'ProposedPrice'];
    }

    let empTab = document.getElementById('tbl_OtherCharges');

    let rowCnt = empTab.rows.length;   // table row count.

    let tr = empTab.insertRow(rowCnt); // the table row.
    tr = empTab.insertRow(rowCnt);
    for (let c = 0; c < arrHead.length; c++) {
        let td = document.createElement('td'); // table definition.
        td = tr.insertCell(c);
        if (c == 0) {
            var select = document.createElement("select");
            select.name = "drp_charges";
            select.id = "Drp_charges"
            select.setAttribute('class', 'form-control custom-form-control')

            for (const val of chargersTypeData) {
                var option = document.createElement("option");
                option.value = val.key;
                option.text = val.value;
                if (val.key == chargeType) {
                    option.setAttribute("selected", "selected");
                }
                select.appendChild(option);
            }
            td.appendChild(select);
        }
        else if (c == 1) {
            let textbox = document.createElement('div');
            //textbox.setAttribute('type', 'number');
            textbox.innerHTML = "<div data-tip='Enter digits only'><input value='" + existingPrice + "' class='form-control custom-form-control' onkeypress='return isNumberKey(event)' type='text' id='" + arrHead[c] + "'/></div>";
            //textbox.id = arrHead[c];
            //textbox.setAttribute('class', 'form-control custom-form-control');
            //textbox.setAttribute('value', existingPrice);

            td.appendChild(textbox);

        }
        else if (c == 2) {
            let txt_proposed = document.createElement('div');
            txt_proposed.innerHTML = "<div data-tip='Enter digits only'><input data-id='" + other_Charges_ID + "' value='" + proposedPrice + "' class='form-control custom-form-control' onkeypress='return isNumberKey(event)' type='text' id='" + arrHead[c] + "'/></div>";
            //txt_proposed.setAttribute('type', 'number');
            //txt_proposed.id = arrHead[c];
            //txt_proposed.setAttribute('class', 'form-control custom-form-control')
            //txt_proposed.setAttribute('value', proposedPrice);
            //txt_proposed.setAttribute('data-id', other_Charges_ID)

            td.appendChild(txt_proposed);

        }
        else if (c == 3) {
            if (chargeType == '') {
                if (rowCnt >= 3) {
                    let btn = document.createElement('button');
                    btn.setAttribute('type', 'button');
                    //btn.id = "btn_delete";
                    btn.innerHTML = "<i class='icon-trash'></i>"
                    btn.setAttribute('class', 'btn btn_delete_charges');

                    td.appendChild(btn);

                }
            }
        }
    }
    $("#tbl_OtherCharges>tbody").append(tr);

}

function AddNewBankingRow(facilityType, bankName, sanctioned, outstanding, roi, multipleBanks_Id) {

    let arrHead = new Array();	// array for header.

    if (bankName == '') {
        arrHead = ['BankName', 'Sanctioned', 'Outstanding', 'ROI', ''];
    }
    else {
        arrHead = ['BankName', 'Sanctioned', 'Outstanding', 'ROI'];
    }


    let empTab = document.getElementById('tbl_MultipleBanking');

    let rowCnt = empTab.rows.length;   // table row count.

    let tr = empTab.insertRow(rowCnt); // the table row.
    tr = empTab.insertRow(rowCnt);
    for (let c = 0; c < arrHead.length; c++) {
        let td = document.createElement('td'); // table definition.
        td = tr.insertCell(c);

        if (c == 0) {
            let textbox = document.createElement('input');
            textbox.setAttribute('type', 'text');
            textbox.id = arrHead[c];
            textbox.setAttribute('class', 'form-control custom-form-control')
            textbox.setAttribute('value', bankName);
            textbox.setAttribute('data-id', multipleBanks_Id);

            td.appendChild(textbox);

        }
        else if (c == 1) {
            let txtSanctioned = document.createElement('div');
            txtSanctioned.innerHTML = "<div data-tip='Enter digits only'><input value='" + sanctioned + "' class='form-control custom-form-control' onkeypress='return isNumberKey(event)' type='text' id='" + arrHead[c] + "'/></div>";
            //txtSanctioned.setAttribute('type', 'number');
            //txtSanctioned.id = arrHead[c];
            //txtSanctioned.setAttribute('class', 'form-control custom-form-control')
            //txtSanctioned.setAttribute('value', sanctioned);

            td.appendChild(txtSanctioned);

        }
        else if (c == 2) {
            let txtOutstanding = document.createElement('div');
            txtOutstanding.innerHTML = "<div data-tip='Enter digits only'><input value='" + outstanding + "' class='form-control custom-form-control' onkeypress='return isNumberKey(event)' type='text' id='" + arrHead[c] + "'/></div>";
            //txtOutstanding.setAttribute('type', 'number');
            //txtOutstanding.id = arrHead[c];
            //txtOutstanding.setAttribute('class', 'form-control custom-form-control')
            //txtOutstanding.setAttribute('value', outstanding);

            td.appendChild(txtOutstanding);

        }
        else if (c == 3) {
            let txtROI = document.createElement('div');
            txtROI.innerHTML = "<div data-tip='Enter digits only'><input value='" + roi + "' class='form-control custom-form-control' onkeypress='return isNumberKey(event)' type='text' id='" + arrHead[c] + "'/></div>";
            //txtROI.setAttribute('type', 'number');
            //txtROI.id = arrHead[c];
            //txtROI.setAttribute('class', 'form-control custom-form-control')
            //txtROI.setAttribute('value', roi);

            td.appendChild(txtROI);

        }
        else {
            if (bankName == '') {
                if (rowCnt >= 3) {
                    let btn = document.createElement('button');
                    btn.setAttribute('type', 'button');
                    //btn.id = "btn_delete";
                    btn.innerHTML = "<i class='icon-trash'></i>"
                    btn.setAttribute('class', 'btn btnDeleteRow');
                    td.appendChild(btn);

                }
            }


        }

    }
    $("#tbl_MultipleBanking>tbody").append(tr);

}

function AddNewCollateralRow(securityAddress, securityDescription, securityType, securityValue, Collateral_details_ID) {
    let arrHead = new Array();	// array for header.
    if (securityType == '') {
        arrHead = ['SecurityType', 'SecurityDescription', 'SecurityAddress', 'SecurityValue', ''];
    }
    else {
        arrHead = ['SecurityType', 'SecurityDescription', 'SecurityAddress', 'SecurityValue'];
    }

    let empTab = document.getElementById('tbl_ipCollateral');

    let rowCnt = empTab.rows.length;   // table row count.

    let tr = empTab.insertRow(rowCnt); // the table row.
    tr = empTab.insertRow(rowCnt);
    for (let c = 0; c < arrHead.length; c++) {
        let td = document.createElement('td'); // table definition.
        td = tr.insertCell(c);

        if (c == 4) {

            if (rowCnt >= 3) {
                let btn = document.createElement('button');
                btn.setAttribute('type', 'button');
                //btn.id = "btn_delete";
                btn.innerHTML = "<i class='icon-trash'></i>"
                btn.setAttribute('class', 'btn btn_delete_row');
                td.appendChild(btn);
            }
        }
        else if (c == 0) {
            let textType = document.createElement('input');
            textType.setAttribute('type', 'text');
            textType.id = arrHead[c];
            textType.setAttribute('class', 'form-control custom-form-control')
            textType.setAttribute('value', securityType);
            textType.setAttribute('data-id', Collateral_details_ID);
            td.appendChild(textType);
        }
        else if (c == 1) {
            let textDesc = document.createElement('input');
            textDesc.setAttribute('type', 'text');
            textDesc.id = arrHead[c];
            textDesc.setAttribute('class', 'form-control custom-form-control')
            textDesc.setAttribute('value', securityDescription);
            td.appendChild(textDesc);
        }
        else if (c == 2) {
            let textAddress = document.createElement('input');
            textAddress.setAttribute('type', 'text');
            textAddress.id = arrHead[c];
            textAddress.setAttribute('class', 'form-control custom-form-control')
            textAddress.setAttribute('value', securityAddress);
            td.appendChild(textAddress);
        }
        else if (c == 3) {
            let txt_value = document.createElement('div');
            txt_value.innerHTML = "<div data-tip='Enter digits only'><input  value='" + securityValue + "' class='form-control custom-form-control' onkeypress='return isNumberKey(event)' type='text' id='" + arrHead[c] + "'/></div>";
            //txt_value.setAttribute('type', 'number');
            //txt_value.id = arrHead[c];
            //txt_value.setAttribute('class', 'form-control custom-form-control')
            //txt_value.setAttribute('value', securityValue);
            td.appendChild(txt_value);

        }

    }

    $("#tbl_ipCollateral>tbody").append(tr);

}

$("#tbl_Promoters").on('focusout', '.txtPromotersName', function (event) {

    PromotersName.push(this.value);
    //NewPromoters.push(this.value);
    $('.drp_RelationshipWith')
        .append($("<option></option>")
            .attr("value", this.value)
            .text(this.value));

});

/////////////////////add rows in table close////////////////////////////////



////////////saving table wise data////////////////////////////////
function SaveMultipleBanking(CustomerID) {

    $('#tbl_MultipleBanking tr').each(function (e) {
        var formData = new FormData();
        if (e != 0) {
            if ($(this).find("td:eq(0) input[type='text']").length >= 1) {
                formData.append('CustomerId', CustomerID);
                formData.append('FacilityType', $('#drp_facility_type').val());
                formData.append('BankName', $(this).find("td:eq(0) input[type='text']").val());
                formData.append('Sanctioned_Amt', $(this).find("td:eq(1) input[type='text']").val());
                formData.append('Outstanding_Amt', $(this).find("td:eq(2) input[type='text']").val());
                formData.append('ROI', $(this).find("td:eq(3) input[type='text']").val());
                formData.append('RowId', $(this).find("td:eq(0) input[type='text']").attr("data-id"));
                var multipleBanking_output = fnSaveMaster(formData, 'Add_MultipleBanking_Details');
            }
        }
    });
}


function SaveCollateralDetails(CustomerID) {

    $('#tbl_ipCollateral tr').each(function (e) {
        var formData = new FormData();
        if (e != 0) {
            if ($(this).find("td:eq(0) input[type='text']").length >= 1) {
                formData.append('CustomerId', CustomerID);
                formData.append('SecurityType', $(this).find("td:eq(0) input[type='text']").val());
                formData.append('SecurityDescription', $(this).find("td:eq(1) input[type='text']").val());
                formData.append('SecurityAddress', $(this).find("td:eq(2) input[type='text']").val());
                formData.append('SecurityValue', $(this).find("td:eq(3) input[type='text']").val());
                formData.append('RowId', $(this).find("td:eq(0) input[type='text']").attr("data-id"));
                var charges_output = fnSaveMaster(formData, 'Add_Collateral_Details');
            }
        }
    });
}

function SaveOtherChargesDetails(CustomerID) {

    $('#tbl_OtherCharges tr').each(function (e) {
        var formData = new FormData();
        if (e != 0) {
            if ($(this).find("td:eq(1) input[type='text']").length >= 1) {
                formData.append('CustomerId', CustomerID);
                formData.append('ChargesType', $(this).find("td:eq(0) option:selected").val());
                formData.append('ExistingPrice', $(this).find("td:eq(1) input[type='text']").val());
                formData.append('ProposedPrice', $(this).find("td:eq(2) input[type='text']").val());
                formData.append('RowId', $(this).find("td:eq(2) input[type='text']").attr("data-id"));
                var charges_output = fnSaveMaster(formData, 'Add_Other_Charges');
            }
        }
    });
}


function saveFacilityDetails(CustomerID) {

    /* each loop used to read the data from Facility Details and save to DB. */

    $('#tbl_FacilityDetails tr').each(function (e) {

        var formData = new FormData();
        //if (!this.rowIndex) return; // skip first row
        if (e != 0) {
            if ($(this).find("td:eq(1) input[type='text']").length >= 1) {
                var fileId = $(this).find("input[type='file']")[0].id;
                var fileData = $('#' + fileId)[0].files[0];
                $(this).find("input[type='file']")[0].id
                formData.append('CustomerId', CustomerID);
                formData.append('FacilityType', $(this).find("td:eq(0) option:selected").val());
                formData.append('ExistingAmount', $(this).find("td:eq(1) input[type='text']").val());
                formData.append('RowId', $(this).find("td:eq(1) input[type='text']").attr("data-id"));
                formData.append('ProposedAmount', $(this).find("td:eq(2) input[type='text']").val());
                formData.append('ExistingPrice', $(this).find("td:eq(3) input[type='text']").val());
                formData.append('ProposedPrice', $(this).find("td:eq(4) input[type='text']").val());
                formData.append('Fb_Nfb', $(this).find("td:eq(0) option:selected").val());
                formData.append('Instruction', $(this).find("td:eq(5) option:selected").val());
                formData.append('file', fileData);

                var facility_output = fnSaveMaster(formData, 'Add_Facility_Details');
            }
        }
    });
}
function SavePromoterDetails(CustomerID) {

    $('#tbl_Promoters tr').each(function (e) {

        var formData = new FormData();
        //if (!this.rowIndex) return; // skip first row
        if (e != 0) {
            if ($(this).find("td:eq(0) input[type='text']").length >= 1) {
                formData.append('CustomerId', CustomerID);
                formData.append('IsPromoter', 1);
                formData.append('Promoter_Name', $(this).find("td:eq(0) input[type='text']").val());
                formData.append('Promoter_Type', $(this).find("td:eq(1) option:selected").val());
                formData.append('IsAcccount', $(this).find("td:eq(2) option:selected").val());
                formData.append('AccountNumber', $(this).find("td:eq(3) input[type='text']").val());
                formData.append('RelationshipWith', 'Self');
                formData.append('RelationshipName', 'Self');
                formData.append('RowId', $(this).find("td:eq(0) input[type='text']").attr("data-id"));
                var Promoters_Details = fnSaveMaster(formData, 'Add_Promoters_Details');
            }
        }
    });
}
function SaveCustomersDetails(CustomerID) {

    $('#tbl_customers tr').each(function (e) {

        var formData = new FormData();
        //if (!this.rowIndex) return; // skip first row
        if (e != 0) {
            if ($(this).find("td:eq(0) input[type='text']").length >= 1) {
                formData.append('CustomerId', CustomerID);
                formData.append('IsPromoter', 0);
                formData.append('Promoter_Name', $(this).find("td:eq(0) input[type='text']").val());
                formData.append('RelationshipName', $(this).find("td:eq(1) option:selected").val());
                formData.append('RelationshipWith', $(this).find("td:eq(2) option:selected").val());
                formData.append('Promoter_Type', $(this).find("td:eq(3) option:selected").val());
                formData.append('IsAcccount', $(this).find("td:eq(4) option:selected").val());
                formData.append('AccountNumber', $(this).find("td:eq(5) input[type='text']").val());
                formData.append('RowId', $(this).find("td:eq(0) input[type='text']").attr("data-id"));

                var Customer_Details = fnSaveMaster(formData, 'Add_Promoters_Details');
            }
        }
    });
}

function SaveApproverDetails(CustomerID) {

    var CommercialType = $("#ul_customer_type").find("li > a.active");
    //if ($("#chk_level1").is(':checked')) {
    if ($("#DropDown_Level1").val().length > 0) {
        fnSaveApprover(CustomerID, CommercialType.data('name'), 0, $("#DropDown_Level1").val(), 1, 'Add_Approver_Details')
    }
    //}

    if ($("#DropDown_Level2").val().length > 0) {
        fnSaveApprover(CustomerID, CommercialType.data('name'), 4, $("#DropDown_Level2").val(), 2, 'Add_Approver_Details')
    }

    if ($("#DropDown_Level3").val().length > 0) {
        fnSaveApprover(CustomerID, CommercialType.data('name'), 4, $("#DropDown_Level3").val(), 3, 'Add_Approver_Details')
    }

    if ($("#DropDown_Level4").val().length > 0) {
        fnSaveApprover(CustomerID, CommercialType.data('name'), 4, $("#DropDown_Level4").val(), 4, 'Add_Approver_Details')
    }
    if ($("#DropDown_Level5").val().length > 0) {
        fnSaveApprover(CustomerID, CommercialType.data('name'), 4, $("#DropDown_Level5").val(), 5, 'Add_Approver_Details')
    }

    if ($("#DropDown_Level6").val().length > 0) {
        fnSaveApprover(CustomerID, CommercialType.data('name'), 4, $("#DropDown_Level6").val(), 6, 'Add_Approver_Details')
    }
    if ($("#DropDown_Level7").val().length > 0) {
        fnSaveApprover(CustomerID, CommercialType.data('name'), 4, $("#DropDown_Level7").val(), 6, 'Add_Approver_Details')
    }
}

var fnSaveMaster = function (request, url) {
    var result = '';
    $.ajax({
        type: "POST",
        url: "/Comercials/" + url,
        data: request,
        contentType: false,
        // dataType: "json",
        async: false,
        processData: false,
        success: function (response) {

            if (response != null) {
                result = Response;
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            result = xhr.innerHTML;
        }
    });

    return result;
}

function fnSaveApprover(CustomerID, CommercialType, Status, ApproverADID, LevelNumber, url) {

    var result = '';
    var formData = new FormData();
    formData.append('CustomerId', CustomerID);
    formData.append('CommercialType', CommercialType);
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

            if (response != null) {
                result = Response;
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            result = xhr.innerHTML;
        }
    });


}

//////////////////close/////////////////////////


///////Approval status change//////////////


$("#BtnApprove").on('click', function (e) {

    var remark = "";
    UpdateApprovalStatus($("#Asset_Pricing_CustomerId").val(), "Approve", remark);
    const d = new Date();
    selectedMonth = d.getMonth() + 1;
    selectedYear = parseInt(d.getFullYear());
    selectedMonth = selectedMonth.toString().length > 1 ? selectedMonth.toString() : "0" + selectedMonth;

    var CustomerType = $("#ul_customer_type").find("li > a.active");
    var TableId = '';
    if (CustomerType.data('name') == "IP") {
        TableId = 'Tbl_IPLeads';
    }
    else if (CustomerType.data('name') == "NTB") {
        TableId = 'Tbl_NTBLeads';
    }
    else {
        TableId = 'Tbl_ExistingLeads';
    }
    LoadAssetPricingGrid(CustomerType.data('name'), TableId, selectedMonth, selectedYear);
    $(".side-wrapper").removeClass('opened');
    $(".side-content").removeClass('slideIn');

});
$("#BtnSendBack").on('click', function (e) {

    var remark = $("#txt_sendback_remark").val();
    if (remark == '') {
        toastr.error('Enter Remark');
    }
    else {
        $('#SendBackModal').modal('toggle');
        UpdateApprovalStatus($("#Asset_Pricing_CustomerId").val(), "Send_Back", remark);
        const d = new Date();
        selectedMonth = d.getMonth() + 1;
        selectedYear = parseInt(d.getFullYear());
        selectedMonth = selectedMonth.toString().length > 1 ? selectedMonth.toString() : "0" + selectedMonth;

        var CustomerType = $("#ul_customer_type").find("li > a.active");
        var TableId = '';
        if (CustomerType.data('name') == "IP") {
            TableId = 'Tbl_IPLeads';
        }
        else if (CustomerType.data('name') == "NTB") {
            TableId = 'Tbl_NTBLeads';
        }
        else {
            TableId = 'Tbl_ExistingLeads';
        }
        LoadAssetPricingGrid(CustomerType.data('name'), TableId, selectedMonth, selectedYear);
        $(".side-wrapper").removeClass('opened');
        $(".side-content").removeClass('slideIn');
    }
});
$("#BtnReject").on('click', function (e) {
    var remark = $("#txt_reject_remark").val();
    if (remark == '') {
        toastr.error('Enter Remark');
    }
    else {
        $('#RejectModal').modal('toggle');
        UpdateApprovalStatus($("#Asset_Pricing_CustomerId").val(), "Reject", remark);
        const d = new Date();
        selectedMonth = d.getMonth() + 1;
        selectedYear = parseInt(d.getFullYear());
        selectedMonth = selectedMonth.toString().length > 1 ? selectedMonth.toString() : "0" + selectedMonth;

        var CustomerType = $("#ul_customer_type").find("li > a.active");
        var TableId = '';
        if (CustomerType.data('name') == "IP") {
            TableId = 'Tbl_IPLeads';
        }
        else if (CustomerType.data('name') == "NTB") {
            TableId = 'Tbl_NTBLeads';
        }
        else {
            TableId = 'Tbl_ExistingLeads';
        }
        LoadAssetPricingGrid(CustomerType.data('name'), TableId, selectedMonth, selectedYear);
        $(".side-wrapper").removeClass('opened');
        $(".side-content").removeClass('slideIn');
    }
});

function UpdateApprovalStatus(Asset_Pricing_CustomerId, action, remark) {
    formData = new FormData();
    formData.append('Asset_Pricing_CustomerId', Asset_Pricing_CustomerId);
    formData.append('Action', action);
    formData.append('Remark', remark);
    $.ajax({
        type: "POST",
        url: "/Comercials/Update_AssetPricing_ApprovalStatus",
        data: formData,
        contentType: false,
        // dataType: "json",
        async: false,
        processData: false,
        success: function (response) {
            if (response != null && response.isSuccess == 'true') {
                toastr.success(response.msg);
                $("#txt_reject_remark").val('');
                $("#txt_sendback_remark").val('');
                $("#RejectModal").modal("hide");
                $("#SendBackModal").modal("hide");
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

//////////////   close    ///////////////////////////

///////////////////Add asset pricing data/////////////////
$("#btn_Add_AssetPricing").on('click', function (e) {
    debugger;
    var status = $("#AssetPricing_status").val();
    if (status == 'In Progress') {
        toastr.error('Proposal is in process');
    }
    else {
        var Isvalidate = true;
        var CommercialType = $("#ul_commercial_type").find("li > a.active");
        var CustomerType = $("#ul_customer_type").find("li > a.active");

        if (CustomerType.data('name') != 'Existing') {
            if ($("#txt_customerName").val() == undefined || $("#txt_customerName").val() == '') {
                Isvalidate = false;
                toastr.error('please enter customer name!');
                return;
            }
        }

        var facility_required = "";
        $('#tbl_FacilityDetails tr').each(function (e) {
            if (e != 0) {
                if ($(this).find("td:eq(1) input[type='text']").val() == "") {
                    Isvalidate = false;
                    toastr.error('Amount Existing is required in Facility details');
                    return;
                }
                if ($(this).find("td:eq(2) input[type='text']").val() == "") {
                    Isvalidate = false;
                    toastr.error('Amount Proposed is required in Facility details');
                    return;
                }
                if ($(this).find("td:eq(3) input[type='text']").val() == "") {
                    Isvalidate = false;
                    toastr.error('Price Existing is required in Facility details');
                    return;
                }
                if ($(this).find("td:eq(4) input[type='text']").val() == "") {
                    Isvalidate = false;
                    toastr.error('Price Proposed is required in Facility details');
                    return;
                }
            }
        });

        $('#tbl_OtherCharges tr').each(function (e) {

            if (e != 0) {
                if ($(this).find("td:eq(1) input[type='text']").val() == "") {
                    Isvalidate = false;
                    toastr.error('Price Existing is required in Other Charges');
                    return;
                }
                if ($(this).find("td:eq(2) input[type='text']").val() == "") {
                    Isvalidate = false;
                    toastr.error('Price Proposed  is required in Other Charges');
                    return;
                }
            }
        });

        $('#tbl_ipCollateral tr').each(function (e) {
            if (e != 0) {
                if ($(this).find("td:eq(0) input[type='text']").val() == "") {
                    Isvalidate = false;
                    toastr.error('SecurityType is required in Collateral Details');
                    return;
                }
                if ($(this).find("td:eq(1) input[type='text']").val() == "") {
                    Isvalidate = false;
                    toastr.error('Security Description is required in Collateral Details');
                    return;
                }
                if ($(this).find("td:eq(2) input[type='text']").val() == "") {
                    Isvalidate = false;
                    toastr.error('Security Address is required in Collateral Details');
                    return;
                }
                if ($(this).find("td:eq(3) input[type='text']").val() == "") {
                    Isvalidate = false;
                    toastr.error('Security Value is required in Collateral Details');
                    return;
                }
            }
        });

        $('#tbl_Promoters tr').each(function (e) {
            if (e != 0) {
                if ($(this).find("td:eq(0) input[type='text']").val() == "") {
                    Isvalidate = false;
                    toastr.error('Promoter Name is required in Promoter Details');
                    return;
                }
                if (($(this).find("td:eq(3) input[type='text']").val() == '') && ($(this).find("td:eq(2) option:selected").val() == '1')) {
                    Isvalidate = false;
                    toastr.error('In Promoter Details Account Number is required if you have Account with us');
                    return;
                }
            }
        });
        $('#tbl_customers tr').each(function (e) {
            if (e != 0) {
                if ($(this).find("td:eq(0) input[type='text']").val() == "") {
                    Isvalidate = false;
                    toastr.error('Customer Name is required in Promoter Details');
                    return;
                }
                if ($(this).find("td:eq(2) option:selected").val() == '') {
                    Isvalidate = false;
                    toastr.error('Relationship With is required in Promoter Details');
                    return;
                }
                if (($(this).find("td:eq(5) input[type='text']").val() == '') && ($(this).find("td:eq(4) option:selected").val() == '1')) {
                    Isvalidate = false;
                    toastr.error('In Promoter Details Account Number is required if you have Account with us');
                    return;
                }

            }
        });
        if ($("#txt_justification").val() == '' || $("#txt_justification").val() == undefined) {
            Isvalidate = false;
            toastr.error('Please enter justification');
            return;
        }

        if ($("#DropDown_Level1").val() == null || $("#DropDown_Level1").val() == '') {
            Isvalidate = false;
            toastr.error('Level 1 Approver is mandatory');
            return;
        }
        if (Isvalidate == true) {
            SaveAssetPricingDetails(CommercialType, CustomerType);
        }
    }

});

function SaveAssetPricingDetails(CommercialType, CustomerType) {
    debugger;
    formData = new FormData();

    formData.append('CustomerId', $("#Asset_Pricing_CustomerId").val() == '' ? 0 : $("#Asset_Pricing_CustomerId").val());
    formData.append('CustomerName', $("#txt_customerName").val());
    formData.append('IsPSL', $("input[type='radio'][name='PSL']:checked").val());
    formData.append('PSLType', $("input[type='radio'][name='PSL_Type']:checked").val());
    formData.append('IsWeakerSection', $("input[type='radio'][name='WeakerSection']:checked").val());
    formData.append('Is_Importer_Exporter', $("input[type='radio'][name='IsExporter']:checked").val());
    formData.append('Importer_Exporter_Type', $("input[type='radio'][name='rblExporter']:checked").val());
    formData.append('Multiple_Banking', $("input[type='radio'][name='Multiple_Banking']:checked").val());
    formData.append('Justification', $("#txt_justification").val());
    formData.append('RAROC', $("#lbl_RAROC").text());
    formData.append('APR_PFY', $("#lbl_APR_PFY").text());
    formData.append('APR_YTD', $("#lbl_APR_YTD").text());
    formData.append('CTI', $("#lbl_AP_CTI").text());
    formData.append('Vintage', $("#lbl_Vintage").text());
    formData.append('ExistingCustomerName', $("#lbl_Customer_Name").text());
    formData.append('ProposalNumber', $("#lbl_ProposalNo").text());
    formData.append('CommercialType', CommercialType.data('name'));
    formData.append('CustomerType', CustomerType.data('name'));


    $.ajax({
        type: "POST",
        url: "/Comercials/Add_AssetPricing",
        data: formData,
        contentType: false,
        // dataType: "json",
        async: false,
        processData: false,
        success: function (response) {

            if (response != null && response.isSuccess == 'false') {
                toastr.error(response.msg);
            }
            else if (response != null && response.isSuccess == 'true') {

                //swal('Success', response.msg, 'success');

                if (CustomerType.data('name') == "IP") {
                    saveFacilityDetails(response.id);
                    SaveOtherChargesDetails(response.id)
                    SaveCollateralDetails(response.id);
                    SavePromoterDetails(response.id);
                    SaveCustomersDetails(response.id);
                    SaveApproverDetails(response.id);
                }
                else {
                    saveFacilityDetails(response.id);
                    SaveOtherChargesDetails(response.id)
                    SaveCollateralDetails(response.id);
                    SavePromoterDetails(response.id);
                    SaveCustomersDetails(response.id);
                    SaveApproverDetails(response.id);
                    SaveMultipleBanking(response.id);
                }

                var TableId = '';
                if (CustomerType.data('name') == "IP") {
                    TableId = 'Tbl_IPLeads';
                }
                else if (CustomerType.data('name') == "NTB") {
                    TableId = 'Tbl_NTBLeads';
                }
                else {
                    TableId = 'Tbl_ExistingLeads';
                }

                const d = new Date();
                selectedMonth = d.getMonth() + 1;
                selectedYear = parseInt(d.getFullYear());
                selectedMonth = selectedMonth.toString().length > 1 ? selectedMonth.toString() : "0" + selectedMonth;
                LoadAssetPricingGrid(CustomerType.data('name'), TableId, selectedMonth, selectedYear);

                if ($("#Asset_Pricing_CustomerId").val() == '') {
                    $(".side-wrapper").removeClass('opened');
                    $(".side-content").removeClass('slideIn');

                    toastr.success(response.msg);

                }
                else {
                    toastr.success('Proposal Updated Successfully!');
                }
                $("#Asset_Pricing_CustomerId").val(response.id);


                //$("#tbl_MultipleBanking tbody>tr").remove();
                //$("#tbl_Promoters tbody>tr").remove();
                //$("#tbl_ipCollateral tbody>tr").remove();
                //$("#tbl_OtherCharges tbody>tr").remove();
                //$("#tbl_FacilityDetails tbody>tr").remove();
                //$("#txt_customerName").val('');
                //$("#txt_justification").val('');
            }
            else {
                toastr.success("Something went wrong while submitting");
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            event.preventDefault();
        }
    });
}

////////////////////   close   ////////////////////////


