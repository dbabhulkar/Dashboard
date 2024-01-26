var selectedMonth;
var selectedYear;
var facilityDetailData;
var SecurityTypeData;
var facilityInstructionDetailData;
var BusinessTypes;
var chargersTypeData;
var ReversalChargesData;
var WaiverData;
var AccountCustmisation_ChargesType;
var All_Supervisors;
var Level1_Data;
var Level2_Data;
var Level3_Data;
var Level4_Data;
var Level5_Data;
var Level6_Data;
var PromotersName = [];
var NewPromoters = [];
var TblIPLeads = ''; var TblNTBLeads = ''; var TblExistingLeads = '';
const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];
var WaiversType = [{ value: 'FULL WAIVER', key: 'FULL WAIVER' },
{ value: 'PARTIAL WAIVER', key: 'PARTIAL WAIVER' },
{ value: 'LIMIT ENHANCEMENT', key: 'LIMIT ENHANCEMENT' }
]

$(document).ready(function () {

    debugger;
    CheckSession();
    //GetMasterData("Business_Type");
    GetMasterData("WaiverType");
    GetMasterData("Reversal_charges");
    GetMasterData("Facility_Details");
    GetMasterData("Facility_Instruction_Details");
    GetMasterData("Charges_Types");
    GetMasterData("Security_Types");

    GetAllRecepients();
    GetAllSupervisors();
    LoadTradePricingGrid();


    $('input[name=IsFTB]').change(function () {
        if ($(this).val() == '1') {
            $(".FirstTimeBorrower").prop('disabled', true);
            $(".FirstTimeBorrower").css('cursor', 'not-allowed');
            $(".FirstTimeBorrower").val('');
            $('input[name=Multiple_Banking]').attr("disabled", true);
            $("input[name=Multiple_Banking][value='0']").prop('checked', true);
            $(".multiple_Banking").addClass("d-none");
        }
        else {
            $(".FirstTimeBorrower").prop('disabled', false);
            $(".FirstTimeBorrower").css('cursor', 'inherit');
            $('input[name=Multiple_Banking]').attr("disabled", false);
            $(".multiple_Banking").removeClass("d-none");
        }
    });

    const d = new Date();
    var todayDate = new Date()
    var currentmonth = todayDate.getMonth() + 1;
    var currentYear = todayDate.getUTCFullYear();
    //var month = d.getUTCMonth() + 1;
    //month = month.toString().length > 1 ? "" : "0" + month;

    $(".monthYear").val(monthNames[d.getMonth()] + "-" + d.getUTCFullYear());
    $('.monthYear').datepicker({
        format: "MM-yyyy",
        startView: "months",
        minViewMode: "months",
        todayHighlight: true,
        endDate: currentmonth.toString() + '-' + currentYear
    }).on('changeDate', function (e) {

        //  var corpositoryDate = new Date().toISOString().split('T')[0];
        var ProposaDate = new Date()
        var currentmonth = ProposaDate.getMonth() + 1;
        selectedMonth = e.date.getMonth() + 1;
        var currenctYear = parseInt(ProposaDate.getUTCFullYear());
        selectedYear = parseInt(e.date.getFullYear());
        selectedMonth = selectedMonth.toString().length > 1 ? selectedMonth.toString() : "0" + selectedMonth;
        //var FormattedMonth = moment(selectedMonth, 'MM').format('MMMM');

        if ($("#clientSearch").val() == '') {
            LoadAssetPricingGrid('IP', 'Tbl_IPLeads', selectedMonth, selectedYear, 0);
            LoadAssetPricingGrid('NTB', 'Tbl_NTBLeads', selectedMonth, selectedYear, 0);
            LoadAssetPricingGrid('Existing', 'Tbl_ExistingLeads', selectedMonth, selectedYear, 0);
        }
        else {
            var clientNameID = $("#clientSearch").val();
            const result = clientNameID.split('-');
            var ClientsName = result[0].trim();
            var ClientsID = result[1].trim();
            LoadAssetPricingGrid('IP', 'Tbl_IPLeads', selectedMonth, selectedYear, ClientsID);
            LoadAssetPricingGrid('NTB', 'Tbl_NTBLeads', selectedMonth, selectedYear, ClientsID);
            LoadAssetPricingGrid('Existing', 'Tbl_ExistingLeads', selectedMonth, selectedYear, ClientsID);
        }

    });
    $(".monthYear-ico").datepicker({
        format: "MM-yyyy",
        startView: "months",
        minViewMode: "months",
        todayHighlight: true,
    });

    var TodayDate = new Date();

    var tMonth = TodayDate.getMonth() + 1;
    tMonth = tMonth.toString().length > 1 ? tMonth : "0" + tMonth;

    if ($("#clientSearch").val() == '') {
        LoadAssetPricingGrid('IP', 'Tbl_IPLeads', tMonth, parseInt(TodayDate.getFullYear()), 0);
        LoadAssetPricingGrid('NTB', 'Tbl_NTBLeads', tMonth, parseInt(TodayDate.getFullYear()), 0);
        LoadAssetPricingGrid('Existing', 'Tbl_ExistingLeads', tMonth, parseInt(TodayDate.getFullYear()), 0);
    }
    else {
        var clientNameID = $("#clientSearch").val();
        const result = clientNameID.split('-');
        var ClientsName = result[0].trim();
        var ClientsID = result[1].trim();
        LoadAssetPricingGrid('IP', 'Tbl_IPLeads', tMonth, parseInt(TodayDate.getFullYear()), ClientsID);
        LoadAssetPricingGrid('NTB', 'Tbl_NTBLeads', tMonth, parseInt(TodayDate.getFullYear()), ClientsID);
        LoadAssetPricingGrid('Existing', 'Tbl_ExistingLeads', tMonth, parseInt(TodayDate.getFullYear()), ClientsID);
    }

    ////var monthname = moment(tMonth, 'MM').format('MMMM');
    ////LoadAssetPricingGrid('IP', 'Tbl_IPLeads', tMonth, parseInt(TodayDate.getFullYear()));
    //LoadAssetPricingGrid('IP', 'Tbl_IPLeads', tMonth, parseInt(TodayDate.getFullYear()),0);
    //LoadAssetPricingGrid('NTB', 'Tbl_NTBLeads', tMonth, parseInt(TodayDate.getFullYear()),0);
    //LoadAssetPricingGrid('Existing', 'Tbl_ExistingLeads', tMonth, parseInt(TodayDate.getFullYear()),0);

    $(function () {
        $("#DropDown_Level1").chosen({ max_selected_options: 1 });
        $("#DropDown_Level2").chosen({ max_selected_options: 1 });
        $("#DropDown_Level3").chosen({ max_selected_options: 1 });
        $("#DropDown_Level4").chosen({ max_selected_options: 1 });
        $("#DropDown_Level5").chosen({ max_selected_options: 1 });
        $("#DropDown_Level6").chosen({ max_selected_options: 1 });
        $("#DropDown_Level7").chosen({ max_selected_options: 1 });
        $("#DropDown_Level8").chosen({ max_selected_options: 1 });

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

        /////// Trade pricing dropdowns /////////
        $("#TP_DropDown_Level1").chosen({ max_selected_options: 1 });
    });
    //$.each(Level1_Data, function () {
    //    $("#DropDown_Level1").append($("<option     />").val(this.empCode).text(this.empCode));
    //});
    var selectedPrimaryName = '';
    $("#tbl_Promoters").on('click', '.txtPromotersName', function (event) {
        selectedPrimaryName = this.value;
    }).on('focusout', '.txtPromotersName', function (event) {

        if (this.value != '' && this.value != null && this.value != undefined) {
            PromotersName.push(this.value);
            var a = PromotersName;
            //var listPromotersName = $('.txtPromotersName');
            //for (var i = 0; i < listPromotersName.length; i++) {
            //    $('.drp_RelationshipWith')
            //        .append($("<option></option>")
            //            .attr("value", listPromotersName[i].value.toLowerCase())
            //            .text(listPromotersName[i].value.toLowerCase()));            
            //}
            $('.drp_RelationshipWith')
                .append($("<option></option>")
                    .attr("value", this.value.toLowerCase())
                    .text(this.value.toLowerCase()));
            var usedNames = {};
            $(".drp_RelationshipWith option").each(function () {
                if (usedNames[this.text]) {
                    $(this).remove();
                } else {
                    usedNames[this.text] = this.value;
                }
            });
            var list = {};
            var listtxtPromotersName = $(".txtPromotersName");
            for (var i = 0; i < listtxtPromotersName.length; i++) {

                list[listtxtPromotersName[i].value] = listtxtPromotersName[i].value;

                //list +=  listtxtPromotersName.filter(function (obj) {
                //    return (listtxtPromotersName[obj].value != Object.keys(usedNames)[i])

                //    listtxtPromotersName.filter(x => !Object.keys(usedNames).incl)
                //{
                //    list += Object.keys(usedNames)[i];
                //} else {
                //    return false;
                //}
                // })

            }
            if (Object.values(usedNames).length > 0) {


                var arr1 = Object.values(usedNames);
                var arr2 = Object.values(list);
                var res = arr1.filter(item => !arr2.includes(item));
                console.log(res);
                for (var i = 0; i < res.length; i++) {
                    $(".drp_RelationshipWith option[value='" + res[i] + "']").each(function () {

                        $(this).remove();
                        // $(this).siblings('[value="' + res[i] + '"]').remove();


                    });
                }
            }
            //var arr1 = [1, 2, 3, 4],
            //    arr2 = [2, 4],
            //    res = arr1.filter(item => !arr2.includes(item));
            //console.log(res);
            //console.log(list);


            //var selectedobject = selectedPrimaryName;
            //var listRelationshipWith = $('#tbl_customers').find('.drp_RelationshipWith').val();
            //for (var j = 0; j < listRelationshipWith.length; j++) {
            //    var selectobject = $('#tbl_customers').find('.drp_RelationshipWith')[j];
            //    for (var i = 0; i < selectobject.length; i++) {
            //        if (selectobject.options[i].value == selectedobject)
            //            selectobject.remove(i);
            //    }
            //}


            $(".drp_RelationshipWith option").each(function () {
                $(this).siblings('[value="' + this.value + '"]').remove();
            });
        }
    });

    $("#btn_close_sidebar").on("click", function () {
        CheckSession();
        clearAllAssetpricingFields();
        NewPromoters = [];
        $("#btn_fetchIP_proposal").css('display', 'none');
        //ClearAllDropdowns();

    });


    //$(".FacilityFile").on('change', function () {
    //    debugger;
    //    alert("Hello");
    //});


    //$("#btnFacilityDetails").hide();
    //$("#customers_Section").hide();

    //$('input[name=rblFacility]').change(function () {
    //    if ($(this).val() == 'Sole') {
    //        $("#btnFacilityDetails").hide();

    //    } else {
    //        $("#btnFacilityDetails").show();
    //    }
    //});

    $('input[name=PSL]').change(function () {

        if ($(this).val() === '0') {
            $("#psl_details").hide();
        } else {
            $("#psl_details").show();
            $("#psl_accordian_header").addClass("collapsed");
            $("#psl_accordian_header").attr('aria-expanded', 'true');
            $(".psl_show").addClass("show");
        }
    });


    $('input[name=Multiple_Banking]').change(function () {

        if ($(this).val() === '0') {
            $("#multiple_banking_body").hide();

        } else {
            $("#multiple_banking_body").show();
        }
    });


    ////////  Assset Pricing Sidebar ////////

    $("#btn_addnew").on("click", function () {
        CheckSession();
        $("#divAssetPricing").show();
        $("#divAssetPricingView").hide();
        $("#txt_comments").text('');
        $("#divComments").hide();
        $("#multiple_banking_body").show();
        $("#psl_details").show();
        $("#AP_ProposalNo").attr("disabled", false);
        NewPromoters = [];
        PromotersName = [];
        clearAllAssetpricingFields();

        $("#create_AP_Proposal").css('display', 'block');

        $("#update_AP_Proposal").css('display', 'none');

        $("#DropDown_Level1").val(All_Supervisors[0].level1).trigger('chosen:updated');
        $("#DropDown_Level2").val(All_Supervisors[0].level2).trigger('chosen:updated');
        $("#DropDown_Level3").val(All_Supervisors[0].level3).trigger('chosen:updated');
        $("#DropDown_Level4").val(All_Supervisors[0].level4).trigger('chosen:updated');
        $("#DropDown_Level5").val(All_Supervisors[0].level5).trigger('chosen:updated');
        $("#DropDown_Level6").val(All_Supervisors[0].level6).trigger('chosen:updated');
        $("#DropDown_Level7").val(All_Supervisors[0].level7).trigger('chosen:updated');
        $("#DropDown_Level8").val(All_Supervisors[0].level8).trigger('chosen:updated');

        /////----Reset Assetpricing fields-----////
        $("#Asset_Pricing_CustomerId").val('');
        $("#AssetPricing_status").val('');
        $("input[name=PSL][value='0']").prop('checked', true);

        $("input[name=PSL_Type][value='Micro']").prop('checked', true);
        $("input[name=WeakerSection][value='0']").prop('checked', true);
        $("input[name=Multiple_Banking][value='0']").prop('checked', true);
        $("input[name=CPW][value='0']").prop('checked', true);

        $("#btnFacilityDetails").show();
        $("#btnAddCollateral").show();
        $("#BtnAddPromoters").show();
        $("#BtnAddCustomers").show();
        $("#btnAddCharges").show();
        $("#BtnAddBanking").show();
        /////-----------------------------------//////
        AssetPricing_EnableFeilds_Typewise();
        $("#psl_details").hide();
        $("#multiple_banking_body").hide();
        $("#divResponseHistory").hide();

        var CustomerType = $("#ul_customer_type").find("li > a.active").data('name');
        $("input[name=IsFTB][value='0']").prop('checked', true);

        $(".FirstTimeBorrower").prop('disabled', false);
        $(".FirstTimeBorrower").css('cursor', 'inherit');
        $(".FirstTimeBorrower").val('');
        if (CustomerType != 'Existing') {
            AddNewFacilityRow('', '', '', '', '', '', '', '', '');
            $('#accordian_firsttimeborrower').show();
        }
        else {
            $('#accordian_firsttimeborrower').hide();
        }

        AddNewChargesRow('', '', '', '');
        AddNewCollateralRow('', '', '', '', '');
        AddNewBankingRow('', '', '', '', '', '');
        AddNewPromotersRow('', '', '', '', '');
        AddNewCustomerRow('', '', '', '', '', '', '');

        $("#btn_Add_AssetPricing").show();
        $("#sidebar_assetpricing").addClass('opened')
        $(".side-content").addClass('slideIn');
        document.querySelector('body').style.overflow = 'hidden';

    });


    //$("#Mydiv [id*='cboCountry']").change(function () {
    //    // Find the closest row and find your 'cbo' element and get its value
    //    var state = $(this).closest('tr').find("input[id*='cboState']").val();
    //});



    //$('.IsAcoount_drp').on('change', function () {
    //    debugger;
    //    var state = $(this).closest('tr').find('.IsAcoount_drp').val();

    //});

    /* ----------------- Recipient Checkbox Change Event to Enable Disable Dropdown------------- */
    //$('#chk_level1').on('change', function (e) {
    //    enableDisable_Recipient("chk_level1", "DropDown_Level1");
    //});

    //$('#chk_level2').on('change', function (e) {
    //    enableDisable_Recipient("chk_level2", "DropDown_Level2");
    //});

    //$('#chk_level3').on('change', function (e) {
    //    enableDisable_Recipient("chk_level3", "DropDown_Level3");
    //});
    //$('#chk_level4').on('change', function (e) {
    //    enableDisable_Recipient("chk_level4", "DropDown_Level4");
    //});
    //$('#chk_level5').on('change', function (e) {
    //    enableDisable_Recipient("chk_level5", "DropDown_Level5");
    //});
    //$('#chk_level6').on('change', function (e) {
    //    enableDisable_Recipient("chk_level6", "DropDown_Level6");
    //});
    /* ----------------- Recipient Checkbox Change Event to Enable Disable Dropdown------------- */


    $(".fileToUpload").on('change', function () {

        var fileData = new FormData();
        var files = $('#file')[0].files;

        // Check file selected or not
        if (files.length > 0) {
            fileData.append('file', files[0]);

            $.ajax({
                url: '/Comercials/Upload_Facility_File',
                type: 'POST',
                data: fileData,
                contentType: false,
                processData: false,
                success: function (response) {
                    //if (response != 0) {

                    //} else {
                    //    alert('file not uploaded');
                    //}
                },
            });
        } else {
            toastr.warning('Please select a file.');
        }
    });

    $('#btn_DownloadApproved').click(function () {
        CheckSession();
        var CommercialType = ($("#ul_customer_type").find("li > a.active")).data('name');
        var custId = $('#Asset_Pricing_CustomerId').val();
        var element = $('.assetPricingViewForm')[0];
        $('.assetPricingViewForm').css('padding', '20px');
        //$("#tbl_view_facilityDetails th:last-child, #tbl_view_facilityDetails td:last-child").hide();
        html2canvas(element).then(function (canvas) {
            var pdf = new jsPDF
            pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight());
            pdf.save(CommercialType + '- AP-' + custId);
            $("#tbl_view_facilityDetails th:last-child, #tbl_view_facilityDetails td:last-child").show();
        });
    });

    $("#btnFacilityDetails").click(function () {
        AddNewFacilityRow('', '', '', '', '', '', '', '', '');
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


    function DisabledforNTB() {
        $(".rblexisting").hide();
        $("#accordian_customerdetails").hide();
        $("#txt_tradeAprcode").val('');
        $("#lbl_trade_proposalNo").text('');
        $("#lbl_trade_clientId").text('');
        $("#lbl_trade_APRPFY").text('');
        $("#lbl_trade_APRYTD").text('');
        $("#lbl_trade_Vintage").text('');
    }
    $("#Tradepricing_btn_addnew").click(function () {
        CheckSession();
        //disableAccordian();
        $("#txt_Comments_TradePricing").text('');
        $("#divCommentsTrade").hide();
        $('input[name=TradePriceType]').attr("disabled", false);
        $("input[name=TradePriceType][value='0']").prop('checked', true);
        $("#TradePricing_CustomerId").val('');

        $("#TradePricing_status").val('');
        $("#txtCutomerName").prop('disabled', false);
        $("#txtPanNo").prop('disabled', false);
        IsCustomersave = false;
        $("#BtnSaveTradePricingDetails").show();

        $('#txt_Remark_TradePricing').val('');
        $("#TP_DropDown_Level1").val(All_Supervisors[0].level1).trigger('chosen:updated');
        $("#sidebar_tradepricing").addClass("opened");
        loadCustomerDetails(0);
        LoadAllTradeTables(0);
        DisabledforNTB();
        //loadTradeTable('tbl_TradePricing_LetterOfCredit', 'LETTER OF CREDIT', 0);
        //loadTradeTable('tbl_TradePricing_Guarantee', 'GUARANTEE', 0);
        //loadTradeTable('tbl_TradePricing_ImportBillsCollection', 'IMPORT_BILLS_COLLECTION', 0);
        //loadTradeTable('tbl_TradePricing_NonImportRemittances', 'NON_IMPORT_REMITTANCES', 0);
        //loadTradeTable('tbl_TradePricing_ExportBillsForCollection', 'EXPORT_BILLS_FOR_COLLECTION', 0);
        //loadTradeTable('tbl_TradePricing_LocalBills', 'LOCAL_BILLS', 0);
        //loadTradeTable('tbl_TradePricing_InwardRemittance', 'INWARD_REMITTANCE', 0);
        //loadTradeTable('tbl_TradePricing_CapitalAccountTransaction', 'CAPITAL_ACCOUNT_TRANSACTIONS', 0);
        //loadTradeTable('tbl_TradePricing_AllProduct', 'ALL_PRODUCTS', 0);
        //loadTradeTable('tbl_TradePricing_Miscellaneous', 'MISCELLANEOUS', 0);

        $("#sidebar_tradepricing").addClass('opened')
        //$(".side-content").addClass('slideIn');
        //document.querySelector('body').style.overflow = 'hidden';

    });

    $('#AP_ProposalNo').on('input propertychange', function () {
        charLimitNTBProposalNo(this, 12);
    });

    function charLimitNTBProposalNo(input, maxChar) {
        var len = $(input).val().length;
        var len = $(input).val().length;
        if (len > maxChar) {
            $(input).val($(input).val().substring(0, maxChar));
            $('#NTBProposalNolength').css('display', 'block');
            $('#AP_ProposalNo').addClass('alertBorder');
        }
        else {
            $('#AP_ProposalNo').removeClass('alertBorder')
            $('#NTBProposalNolength').css('display', 'none');
        }
    }

    $('#AP_Approval_No').on('input propertychange', function () {
        var len = $('#AP_Approval_No').val().length;
        if (len > 10) {
            $('#AP_Approval_No').val($('#AP_Approval_No').val().substring(0, 10));
            $('#NTBApprovalNolength').css('display', 'block');
            $('#AP_Approval_No').addClass('alertBorder');
        }
        else {
            if (len > 0) {
                $('#btn_fetchIP_proposal').css('display', 'block');
            }
            else {
                $('#btn_fetchIP_proposal').css('display', 'none');
            }
            $('#NTBApprovalNolength').css('display', 'none');
            $('#AP_Approval_No').removeClass('alertBorder');
        }
    });



    $('#btn_fetchIP_proposal').on('click', function () {
        CheckSession();
        var IP_ApprovalNO = $("#AP_Approval_No").val();
        const result = IP_ApprovalNO.split('-');
        var type_IP = result[0];
        var CustomerId = result[1];


        $.ajax({
            type: "GET",
            url: "/Comercials/Get_AssetPricingCustomerDetail?CustomerId=" + CustomerId + "&CustomerType=IP",
            data: null,
            contentType: false,
            async: false,
            processData: false,
            success: function (response) {

                if (response != null) {
                    if (response.tbL_Asset_Pricing_Customer_Info.length > 0) {
                        response.tbL_ResponseHistory.length = 0;
                        LoadAssetPricingForEdit(response, CustomerId, 'IP');
                        var CustomerInfo = response.tbL_Asset_Pricing_Customer_Info;
                        $("#LoginUserRole").val(CustomerInfo[0].empRole);
                        $("#txt_justification").val(CustomerInfo[0].justification);
                        $("#txt_customerName").val(CustomerInfo[0].customer_Name);
                        $("#AP_ProposalNo").val(CustomerInfo[0].proposal_Number);
                    }
                    else {
                        toastr.error("Information not available against this IP Approval Number.");
                    }

                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                event.preventDefault();
            }
        });


    });
    //$("#BtnViewIP_Proposal").on("click", function () {

    //    $("#MyPopup").modal("show");

    //});

    $(".BtnViewIP_Proposal").on("click", function () {

        CheckSession();
        var IP_ApprovalNO;
        var ationType = $("#ActionType").val();
        if (ationType == 'edit') {
            IP_ApprovalNO = $("#AP_Approval_No").val();
        }
        else {
            IP_ApprovalNO = $("#lbl_AP_approvalNo").text();
        }


        const result = IP_ApprovalNO.split('-');
        var type_IP = result[0];
        var CustomerId = result[1];

        $.ajax({
            type: "GET",
            url: "/Comercials/Get_AssetPricingCustomerDetail?CustomerId=" + CustomerId + "&CustomerType=IP",
            data: null,
            contentType: false,
            async: false,
            processData: false,
            success: function (response) {

                if (response != null) {
                    if (response.tbL_Asset_Pricing_Customer_Info.length > 0) {
                        //$("#btn_Add_AssetPricing").hide();
                        //$("#divAssetPricing").hide();
                        //$("#divAssetPricingView").show();
                        response.tbL_ResponseHistory.length = 0;
                        LoadAssetPricingForView_IP(response, CustomerId);
                        var CustomerInfo = response.tbL_Asset_Pricing_Customer_Info;
                        $("#LoginUserRole").val(CustomerInfo[0].empRole);
                        //$("#lbl_AP_custName").text(CustomerInfo[0].customer_Name);
                        $("#lbl_AP_custName_view").text(CustomerInfo[0].customer_Name);
                        $("#lbl_view_Justification_view").text(CustomerInfo[0].justification);
                        $("#Modal_AssetPricingView").modal("show");
                        //$("#txt_justification").val(CustomerInfo[0].justification);
                        //$("#txt_customerName").val(CustomerInfo[0].customer_Name);
                        //$("#AP_ProposalNo").val(CustomerInfo[0].proposal_Number);
                    }
                    else {
                        toastr.error("Information not available against this IP Approval Number.");
                    }

                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                event.preventDefault();
            }
        });

    });



    /*--------------- Common function added to enable Disable Recipient Dropdown 
                        * pass Chechbox Id and Dropdown Id                       ----------------- */

    //enableDisable_Recipient("chk_level1", "DropDown_Level1");
    //enableDisable_Recipient("chk_level2", "DropDown_Level2");
    //enableDisable_Recipient("chk_level3", "DropDown_Level3");
    //enableDisable_Recipient("chk_level4", "DropDown_Level4");
    //enableDisable_Recipient("chk_level5", "DropDown_Level5");
    //enableDisable_Recipient("chk_level6", "DropDown_Level6");
    /*--------------- Common function added to enable Disable Recipient Dropdown----------------- */
});

$("#tbl_FacilityDetails").on('click', 'tbody .btn_delete', function (e) {
    CheckSession();
    var deleteBtnCount = $("#tbl_FacilityDetails tbody .btn_delete").length;
    if (deleteBtnCount == 1) {
        toastr.error("Atleast one record is mandatory");
    }
    else {
        $(this).closest('tr').remove();
    }


})
$("#tbl_OtherCharges").on('click', 'tbody .btn_delete_charges', function (e) {
    CheckSession();
    var deleteBtnCount = $("#tbl_OtherCharges tbody .btn_delete_charges").length;
    if (deleteBtnCount == 1) {
        toastr.error("Atleast one record is mandatory");
    }
    else {
        $(this).closest('tr').remove();
    }


})
$("#tbl_ipCollateral").on('click', 'tbody .btn_delete_row', function (e) {
    CheckSession();
    var deleteBtnCount = $("#tbl_ipCollateral tbody .btn_delete_row").length;
    if (deleteBtnCount == 1) {
        toastr.error("Atleast one record is mandatory");
    }
    else {
        $(this).closest('tr').remove();
    }

})
$("#tbl_MultipleBanking").on('click', 'tbody .btnDeleteRow', function (e) {
    CheckSession();
    var deleteBtnCount = $("#tbl_MultipleBanking tbody .btnDeleteRow").length;
    if (deleteBtnCount == 1) {
        toastr.error("Atleast one record is mandatory");
    }
    else {
        $(this).closest('tr').remove();
    }

})
$("#tbl_Promoters").on('click', 'tbody .btnDeletePromoter', function (e) {
    CheckSession();
    var deleteBtnCount = $("#tbl_Promoters tbody .btnDeletePromoter").length;
    if (deleteBtnCount == 1) {
        toastr.error("Atleast one record is mandatory");
    }
    else {
        var selectedobject = $(this).closest('tr').find('.txtPromotersName').val();
        var listRelationshipWith = $('#tbl_customers').find('.drp_RelationshipWith');
        for (var j = 0; j < listRelationshipWith.length; j++) {
            var selectobject = $('#tbl_customers').find('.drp_RelationshipWith')[j];
            for (var i = 0; i < selectobject.length; i++) {
                if (selectobject.options[i].value == selectedobject)
                    selectobject.remove(i);
            }
        }

        $(this).closest('tr').remove();
    }
})
$("#tbl_customers").on('click', 'tbody .btnDeletePromoter', function (e) {
    CheckSession();
    var deleteBtnCount = $("#tbl_customers tbody .btnDeletePromoter").length;
    if (deleteBtnCount == 1) {
        toastr.error("Atleast one record is mandatory");
    }
    else {
        $(this).closest('tr').remove();
    }
})



function AddNewCustomerRow(promoter_Name, relationshipName, relationshipWith, promoter_Type, isAcccount, accountNumber, promoter_ID) {

    let arrHead = new Array();	// array for header.

    arrHead = ['Name', 'Relationship', 'Relationship With', 'Account', 'Account Number', 'Action'];
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
                { Type: "Parent" },
                { Type: "Spouse" },
                { Type: "Child" },
                { Type: "Son in law" },
                { Type: "Daughter in law" },
                { Type: "Grandchild" },
                { Type: "Uncle" },
                { Type: "Aunt" },
                { Type: "Niece" },
                { Type: "Nephew" },
                { Type: "Cousin" }

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
                if (NewPromoters != '') {
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
            }

            td.appendChild(select);
        }
        else if (c == 3) {
            var select_account = document.createElement("select");
            select_account.name = "drp_IsAccount";
            select_account.id = "Drp_IsAccount"
            select_account.setAttribute('class', 'form-control custom-form-control drp_IsAccount')
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
            select_account.onchange = function (e) {
                var a = $(this).closest('tr').find((".drp_IsAccount")).val();

                if (a == '0') {
                    $(this).closest('tr').find("input[class*='TxtRelativeIsAcc']").val('');
                    $(this).closest('tr').find("input[class*='TxtRelativeIsAcc']").css("cursor", "not-allowed");
                    $(this).closest('tr').find("input[class*='TxtRelativeIsAcc']").attr("disabled", "disabled");
                }
                else {
                    $(this).closest('tr').find("input[class*='TxtRelativeIsAcc']").removeAttr("disabled");
                    $(this).closest('tr').find("input[class*='TxtRelativeIsAcc']").css("cursor", "text");
                }
                //var gh = $(this).closest('tr').find("input[class*='TxtAccount']").val();

            };

            td.appendChild(select_account);
        }
        else if (c == 4) {
            if (isAcccount == 0 || accountNumber == null) {
                accountNumber = '';
            }
            let textbox = document.createElement('div');
            if (isAcccount == 0) {
                textbox.innerHTML = "<input maxlength='16' value='" + accountNumber + "' class='form-control custom-form-control TxtRelativeIsAcc' style='cursor:not-allowed' disabled='disabled' onkeypress='return isNumberOnlyKey(event)' type='text' id='" + arrHead[c] + "'/>";
            }
            else {
                textbox.innerHTML = "<input maxlength='16' value='" + accountNumber + "' class='form-control custom-form-control TxtRelativeIsAcc' onkeypress='return isNumberOnlyKey(event)' type='text' id='" + arrHead[c] + "'/>";
            }

            td.appendChild(textbox);
        }
        else {

            let btn = document.createElement('button');
            btn.setAttribute('type', 'button');
            //btn.id = "btn_delete";
            btn.innerHTML = "<i class='icon-trash'></i>"
            btn.setAttribute('class', 'btn btnDeletePromoter btn_delete');

            td.appendChild(btn);
        }

    }
    $("#tbl_customers>tbody").append(tr);
}

function AddNewPromotersRow(promoter_Name, promoter_Type, isAcccount, accountNumber, promoter_ID) {

    var Is_account = "";
    let arrHead = new Array();	// array for header.

    arrHead = ['Name', 'Type', 'IsAccount', 'Account_No', 'Action'];

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
            select.id = $('#tbl_Promoters tbody tr').length + "_Drp_IsAccount"
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
            select.onchange = function (e) {

                var a = $(this).closest('tr').find((".IsAcoount_drp")).val();
                if (a == '0') {

                    $(this).closest('tr').find("input[class*='TxtAccount']").val('');
                    $(this).closest('tr').find("input[class*='TxtAccount']").css("cursor", "not-allowed");
                    $(this).closest('tr').find("input[class*='TxtAccount']").attr("disabled", "disabled");
                }
                else {
                    $(this).closest('tr').find("input[class*='TxtAccount']").removeAttr("disabled");
                    $(this).closest('tr').find("input[class*='TxtAccount']").css("cursor", "text");
                }
                //var gh = $(this).closest('tr').find("input[class*='TxtAccount']").val();

            };

            td.appendChild(select);
        }
        else if (c == 3) {
            let textbox = document.createElement('div');
            if (isAcccount == 0 || accountNumber == null) {
                accountNumber = '';
            }

            var a = $('#' + $('#tbl_Promoters tbody tr').length + '_Drp_IsAccount').val();
            if (isAcccount == 0) {
                textbox.innerHTML = "<input maxlength='16' value='" + accountNumber + "' style='cursor:not-allowed' class='form-control custom-form-control TxtAccount' disabled='disabled' onkeypress='return isNumberOnlyKey(event)' type='text' id='" + arrHead[c] + "'/>";
            }
            else {
                textbox.innerHTML = "<input maxlength='16' value='" + accountNumber + "' class='form-control custom-form-control TxtAccount' onkeypress='return isNumberOnlyKey(event)' type='text' id='" + arrHead[c] + "'/>";
            }


            if (isAcccount == 1) {
                textbox.setAttribute('value', accountNumber);
            }
            else {
                textbox.setAttribute('value', '');
            }
            td.appendChild(textbox);
        }
        else {
            let btn = document.createElement('button');
            btn.setAttribute('type', 'button');
            //btn.id = "btn_delete";
            btn.innerHTML = "<i class='icon-trash'></i>"
            btn.setAttribute('class', 'btn btnDeletePromoter btn_delete');

            td.appendChild(btn);
        }
    }
    $("#tbl_Promoters>tbody").append(tr);

}

function AddNewChargesRow(chargeType, existingPrice, proposedPrice, other_Charges_ID) {

    if (existingPrice == 0 || existingPrice == null) {
        existingPrice = '';
    }
    var IsFTB = $("input[type='radio'][name='IsFTB']:checked").val();
    let arrHead = new Array();	// array for header.

    arrHead = ['ChargesType', 'ExistingPrice', 'ProposedPrice', 'Action'];

    let empTab = document.getElementById('tbl_OtherCharges');

    let rowCnt = empTab.rows.length;   // table row count.

    let tr = empTab.insertRow(rowCnt); // the table row.
    //tr = empTab.insertRow(rowCnt);
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
                if (val.value == chargeType) {
                    option.setAttribute("selected", "selected");
                }
                select.appendChild(option);
            }
            td.appendChild(select);
        }
        else if (c == 1) {

            let textbox = document.createElement('div');
            //textbox.setAttribute('type', 'number');
            if (IsFTB == 0) {
                textbox.innerHTML = "<input value='" + existingPrice + "' class='form-control custom-form-control FirstTimeBorrower'  type='text' id='" + arrHead[c] + "'/>";
            }
            else {
                textbox.innerHTML = "<input disabled='disabled' style='cursor:not-allowed' value='" + existingPrice + "' class='form-control custom-form-control FirstTimeBorrower' onkeypress='return isNumberKey(event)' type='text' id='" + arrHead[c] + "'/>";
            }

            td.appendChild(textbox);

        }
        else if (c == 2) {
            let txt_proposed = document.createElement('div');
            txt_proposed.innerHTML = "<input data-id='" + other_Charges_ID + "' value='" + proposedPrice + "' class='form-control custom-form-control' type='text' id='" + arrHead[c] + "'/>";

            td.appendChild(txt_proposed);

        }
        else if (c == 3) {

            let btn = document.createElement('button');
            btn.setAttribute('type', 'button');
            //btn.id = "btn_delete";
            btn.innerHTML = "<i class='icon-trash'></i>"
            btn.setAttribute('class', 'btn btn_delete_charges');

            td.appendChild(btn);
        }
    }
    $("#tbl_OtherCharges>tbody").append(tr);

}

function AddNewBankingRow(facilityType, bankName, sanctioned, outstanding, roi, multipleBanks_Id) {

    let arrHead = new Array();	// array for header.


    arrHead = ['Facility Type', 'BankName', 'Sanctioned', 'Outstanding', 'ROI', 'Action'];


    let empTab = document.getElementById('tbl_MultipleBanking');

    let rowCnt = empTab.rows.length;   // table row count.

    let tr = empTab.insertRow(rowCnt); // the table row.
    //tr = empTab.insertRow(rowCnt);
    for (let c = 0; c < arrHead.length; c++) {
        let td = document.createElement('td'); // table definition.
        td = tr.insertCell(c);
        if (c == 0) {      // the first column.
            var select = document.createElement("select");
            select.name = "drp_facility_type";
            select.id = "drp_facility_type";
            select.setAttribute('class', 'form-control custom-form-control');

            for (const val of facilityDetailData) {
                var option = document.createElement("option");
                option.value = val.key;
                option.text = val.value;
                if (val.value == facilityType) {
                    option.setAttribute("selected", "selected");
                }
                select.appendChild(option);

            }
            td.appendChild(select);
        }
        if (c == 1) {

            if (bankName == "null" || bankName == undefined || bankName == "") {
                bankName = '';
            }
            let textbox = document.createElement('input');
            textbox.setAttribute('type', 'text');
            textbox.id = arrHead[c];
            textbox.setAttribute('class', 'form-control custom-form-control')
            textbox.setAttribute('value', bankName);
            textbox.setAttribute('data-id', multipleBanks_Id);

            td.appendChild(textbox);

        }
        else if (c == 2) {
            if (sanctioned == 0) {
                sanctioned = '';
            }
            let txtSanctioned = document.createElement('div');
            txtSanctioned.innerHTML = "<div data-tip='Enter digits only'><input value='" + sanctioned + "' class='form-control custom-form-control' onkeypress='return isNumberKey(event)' type='text' id='" + arrHead[c] + "'/></div>";

            td.appendChild(txtSanctioned);

        }
        else if (c == 3) {
            if (outstanding == 0) {
                outstanding = '';
            }
            let txtOutstanding = document.createElement('div');
            txtOutstanding.innerHTML = "<div data-tip='Enter digits only'><input value='" + outstanding + "' class='form-control custom-form-control' onkeypress='return isNumberKey(event)' type='text' id='" + arrHead[c] + "'/></div>";

            td.appendChild(txtOutstanding);

        }
        else if (c == 4) {
            if (roi == "null" || roi == undefined || roi == "") {
                roi = '';
            }
            let txtROI = document.createElement('div');
            txtROI.innerHTML = "<input value='" + roi + "' class='form-control custom-form-control' type='text' id='" + arrHead[c] + "'/>";

            td.appendChild(txtROI);

        }
        else if (c == 5) {
            let btn = document.createElement('button');
            btn.setAttribute('type', 'button');
            //btn.id = "btn_delete";
            btn.innerHTML = "<i class='icon-trash'></i>"
            btn.setAttribute('class', 'btn btnDeleteRow btn_delete');
            td.appendChild(btn);
        }

    }
    $("#tbl_MultipleBanking>tbody").append(tr);

}

function AddNewCollateralRow(securityOwner, securityDescription, securityType, securityValue, Collateral_details_ID) {

    let arrHead = new Array();	// array for header.
    //if (securityType == '') {
    //    arrHead = ['SecurityType', 'SecurityDescription', 'SecurityOwner', 'SecurityValue', ''];
    //}
    //else {
    //    arrHead = ['SecurityType', 'SecurityDescription', 'SecurityOwner', 'SecurityValue',''];
    //}
    arrHead = ['SecurityType', 'SecurityDescription', 'SecurityOwner', 'SecurityValue', 'Action'];
    let empTab = document.getElementById('tbl_ipCollateral');

    let rowCnt = empTab.rows.length;   // table row count.

    let tr = empTab.insertRow(rowCnt); // the table row.
    //tr = empTab.insertRow(rowCnt);
    for (let c = 0; c < arrHead.length; c++) {
        let td = document.createElement('td'); // table definition.
        td = tr.insertCell(c);
        if (c == 4) {
            let btn = document.createElement('button');
            btn.setAttribute('type', 'button');
            //btn.id = "btn_delete";
            btn.innerHTML = "<i class='icon-trash'></i>"
            btn.setAttribute('class', 'btn btn_delete_row');
            td.appendChild(btn);
        }
        else if (c == 0) {
            var select = document.createElement("select");
            select.name = "drp_security_type";
            select.id = "drp_security_type";
            select.setAttribute('class', 'form-control custom-form-control');

            for (const val of SecurityTypeData) {
                var option = document.createElement("option");
                option.value = val.key;
                option.text = val.value;
                if (val.key == securityType) {
                    option.setAttribute("selected", "selected");
                }
                select.appendChild(option);

            }
            td.appendChild(select);


            //let textType = document.createElement('input');
            //textType.setAttribute('type', 'text');
            //textType.id = arrHead[c];
            //textType.setAttribute('class', 'form-control custom-form-control')
            //textType.setAttribute('value', securityType);
            //textType.setAttribute('data-id', Collateral_details_ID);
            //td.appendChild(textType);
        }
        else if (c == 1) {
            let textDesc = document.createElement('input');
            textDesc.setAttribute('type', 'text');
            textDesc.id = arrHead[c];
            textDesc.setAttribute('class', 'form-control custom-form-control')
            textDesc.setAttribute('value', securityDescription);
            textDesc.setAttribute('data-id', Collateral_details_ID);
            td.appendChild(textDesc);
        }
        else if (c == 2) {
            let textAddress = document.createElement('input');
            textAddress.setAttribute('type', 'text');
            textAddress.id = arrHead[c];
            textAddress.setAttribute('class', 'form-control custom-form-control')
            textAddress.setAttribute('value', securityOwner);
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
function AddNewFacilityRow(facilityType, existingAmount, proposedAmount, existingPrice, proposedPrice, fb_Nfb, instruction, fileName, Facility_Details_Id) {

    if (existingAmount == 0 || existingAmount == null) {
        existingAmount = '';
    }
    if (existingPrice == 0 || existingPrice == null) {
        existingPrice = '';
    }
    let arrHead = new Array();	// array for header.

    arrHead = ['Facility', 'AmountExisting', 'AmountProposed', 'PricingExisting', 'PricingProposed', 'Instruction', 'File', 'Action'];

    var IsFTB = $("input[type='radio'][name='IsFTB']:checked").val();

    let empTab = document.getElementById('tbl_FacilityDetails');

    let rowCnt = empTab.rows.length;   // table row count.

    let tr = empTab.insertRow(rowCnt); // the table row.
    //tr = empTab.insertRow(rowCnt);

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
                if (val.value == facilityType) {
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
                    $(this).closest('tr').find("select[name='Drp_Instruction']").css("opacity", "0.6 !important");
                    $(this).closest('tr').find($('.nfbdisable')).hide();
                    $(this).closest('tr').find($('.priceOne')).removeAttr("style");

                }
                else {
                    $(this).closest('tr').find("select[name='Drp_Instruction']").removeAttr("disabled");
                    $(this).closest('tr').find("select[name='Drp_Instruction']").css("cursor", "default");
                    $(this).closest('tr').find("select[name='Drp_Instruction']").css("opacity", "1 !important");
                    $(this).closest('tr').find($('.nfbdisable')).show();
                    $(this).closest('tr').find($('.priceOne')).css("width", '48px');
                    $(this).closest('tr').find($('.nfbdisable')).css('display', 'inline-block');
                }

            };

            td.appendChild(select);
        }
        else if (c === 1) {
            let ExistingAMT = document.createElement('div');

            if (IsFTB == 1) {
                ExistingAMT.innerHTML = "<input disabled='disabled' style='cursor:not-allowed' data-id='" + Facility_Details_Id + "' value='" + existingAmount + "' class='form-control custom-form-control FirstTimeBorrower'  type='text' id='" + arrHead[c] + "'/>";
            }
            else {
                ExistingAMT.innerHTML = "<input data-id='" + Facility_Details_Id + "' value='" + existingAmount + "' class='form-control custom-form-control FirstTimeBorrower'  type='text' id='" + arrHead[c] + "'/>";
            }

            td.appendChild(ExistingAMT);
        }
        else if (c === 2) {
            let ProposedAMT = document.createElement('div');
            ProposedAMT.innerHTML = "<input class='form-control custom-form-control' value='" + proposedAmount + "'  type='text' id='" + arrHead[c] + "'/>";

            td.appendChild(ProposedAMT);
        }
        else if (c === 3) {
            let ExistingPrice = document.createElement('div');
            if (IsFTB == 1) {
                ExistingPrice.innerHTML = "<input disabled='disabled' style='cursor:not-allowed' class='form-control custom-form-control FirstTimeBorrower' value='" + existingPrice + "'  type='text' id='" + arrHead[c] + "'/>";
            }
            else {
                ExistingPrice.innerHTML = "<input class='form-control custom-form-control FirstTimeBorrower' value='" + existingPrice + "'  type='text' id='" + arrHead[c] + "'/>";
            }

            //ExistingPrice.setAttribute('type', 'number');
            //ExistingPrice.id = arrHead[c];
            //ExistingPrice.setAttribute('class', 'form-control custom-form-control')
            //ExistingPrice.setAttribute('value', existingPrice);

            td.appendChild(ExistingPrice);
        }
        else if (c === 4) {

            const result = proposedPrice.split('-');
            var price1 = result[0];
            var price2 = result[1];
            if (price1 == '' || price1 == undefined) {
                price1 = ''
            }
            if (price2 == '' || price2 == undefined) {
                price2 = ''
            }
            let ProposedPrice = document.createElement('div');

            //ProposedPrice.innerHTML = "<div style='display:inline-block' data-tip='Enter digits only'><input class='form-control custom-form-control priceOne' style='width:48px;text-align:center;' onkeypress='return isNumberKey(event)' value='" + price1 + "'  type='text' /></div> % <label class='nfbdisable' style='font-size:12px'> i.e spread of  </label> <div class='nfbdisable' style='display:inline-block' data-tip='Enter digits only'><input class='form-control custom-form-control priceTwo' onkeypress='return isNumberKey(event)' style='width:48px;text-align:center;' value='" + price2 + "'  type='text' /></div><span class='nfbdisable'>%</span>";
            if (fb_Nfb == 'NFB') {
                ProposedPrice.innerHTML = "<div style='display:inline-block' data-tip='Enter digits only'><input class='form-control custom-form-control priceOne' style='text-align:center;' onkeypress='return isNumberKey(event)' value='" + price1 + "'  type='text' /></div> % <label class='nfbdisable' style='font-size:12px;display:none'> i.e spread of  </label> <div class='nfbdisable' style='display:none' data-tip='Enter digits only'><input class='form-control custom-form-control priceTwo' onkeypress='return isNumberKey(event)' style='width:48px;text-align:center;' value='" + price2 + "'  type='text' /></div><span class='nfbdisable' style='display:none'>%</span>";
            }
            else {
                ProposedPrice.innerHTML = "<div style='display:inline-block' data-tip='Enter digits only'><input class='form-control custom-form-control priceOne' style='width:48px;text-align:center;' onkeypress='return isNumberKey(event)' value='" + price1 + "'  type='text' /></div> % <label class='nfbdisable' style='font-size:12px'> i.e spread of  </label> <div class='nfbdisable' style='display:inline-block' data-tip='Enter digits only'><input class='form-control custom-form-control priceTwo' onkeypress='return isNumberKey(event)' style='width:48px;text-align:center;' value='" + price2 + "'  type='text' /></div><span class='nfbdisable'>%</span>";

            }
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
            if (fb_Nfb == 'NFB') {
                select.setAttribute("disabled", "disabled");
                select.setAttribute("class", "form-control custom-form-control disableDrp");
            }
            var selected = "";
            var optionDefault = document.createElement("option");
            optionDefault.value = "";
            optionDefault.text = "Selet Instruction";
            select.appendChild(optionDefault);
            for (const val of facilityInstructionDetailData) {
                var option = document.createElement("option");
                option.value = val.key;
                option.text = val.value;
                if (val.key == instruction) {
                    option.setAttribute("selected", "selected");
                    selected = "Selected";
                }
                //else {
                //    $(this).closest('tr').find("select[name='Drp_Instruction']").attr("disabled", "disabled");
                //}
                select.appendChild(option);

            }
            if (selected == "") {
                optionDefault.setAttribute("selected", "selected");
            }
            td.appendChild(select);

            //if (fb_Nfb == 'NFB') {
            //    $(this).closest('tr').find("select[name='Drp_Instruction']").val('');
            //    $(this).closest('tr').find("select[name='Drp_Instruction']").css("cursor", "not-allowed");
            //    $(this).closest('tr').find("select[name='Drp_Instruction']").attr("disabled", "disabled");
            //    $(this).closest('tr').find("select[name='Drp_Instruction']").css("opacity", "0.6");
            //    $(this).closest('tr').find($('.nfbdisable')).hide();
            //    $(this).closest('tr').find($('.priceOne')).removeAttr("style");

            //}
            //else {
            //    $(this).closest('tr').find("select[name='Drp_Instruction']").removeAttr("disabled");
            //    $(this).closest('tr').find("select[name='Drp_Instruction']").css("cursor", "default");
            //    $(this).closest('tr').find("select[name='Drp_Instruction']").css("opacity", "1");
            //    $(this).closest('tr').find($(".nfbdisable")).show();
            //    $(this).closest('tr').find($('.priceOne')).css({ "width": "48px", "text-align": "center" });
            //}
        }
        else if (c === 6) {
            var fileUpload = document.createElement("div");

            fileUpload.innerHTML = "<div class='fileUpload blue-btn btn width100'><i class='fa fa-upload'></i><div class='file-name' id='" + fileUploadId + "'></div>" +
                "<input id='" + fileUploadId + "_facilityfile' type='file' class='uploadlogo' accept='.png,.jpeg,.jpg'></div>";


            td.appendChild(fileUpload);

            if (fileName != '' && fileName != null) {
                var fileLable = document.createElement("label");
                fileLable.innerText = fileName;
                fileLable.setAttribute('class', 'fileLable');
                td.appendChild(fileLable);
            }

        }
        else if (c == 7) {
            let btn = document.createElement('button');
            btn.setAttribute('type', 'button');
            //btn.id = "btn_delete";
            btn.innerHTML = "<i class='icon-trash'></i>"
            btn.setAttribute('class', 'btn btn_delete');
            //btn.setAttribute('style', 'width: none!important');
            //btn.innerText = "Delete"
            td.appendChild(btn);
            if (fileName != '' && fileName != null) {
                let editButton = document.createElement('div');
                editButton.innerHTML = '<a class="View_WS_Cal_Image link"><i class="fa fa-eye"></i></a>';
                td.append(editButton);
            }

        }

    }
    var IsFormatInvalid;

    $(document).on('change', '.uploadlogo', function (e) {

        var filename = readURL(this);
        if (IsFormatInvalid == true) {
            toastr.error(filename);
        }
        else {
            $(this).parent().children('div').html(filename);
        }

    });

    // Read File and return value  
    function readURL(input) {
        IsFormatInvalid = false;
        var url = input.value;
        var ext = url.substring(url.lastIndexOf('.') + 1).toLowerCase();
        if (input.files && input.files[0] && (
            ext == "png" || ext == "jpeg" || ext == "jpg"
        )) {
            var path = $(input).val();
            var filename = path.replace(/^.*\\/, "");
            // $('.fileUpload span').html('Uploaded Proof : ' + filename);
            return filename;
        } else {
            IsFormatInvalid = true;
            $(input).val("");
            return "Only PNG,JPEG,JPG formats are allowed!";
        }
    }
    $("#tbl_FacilityDetails>tbody").append(tr);

    // Upload btn end
}
//$(document).on('change', '.FacilityFile', function () {
//    //alert("new");

//});

$('#tbl_FacilityDetails').on('click', 'tbody .View_WS_Cal_Image', function (p) {

    //var data_row = table.row($(this).closest('tr')).data();
    var ImageName = $(this).closest("tr").find(".fileLable").text();
    //var customerId = $("#Asset_Pricing_CustomerId").val();
    $('.facilityImageView').attr('src', '../FacilityFiles/' + ImageName);
    $('.facilityImageName').text(ImageName);
    $("#FacilityImgModal").modal("show");
});
$('#tbl_view_facilityDetails').on('click', 'tbody .View_WS_Cal_Image', function (p) {

    //var data_row = table.row($(this).closest('tr')).data();
    var ImageName = $(this).closest("tr").find(".facilityViewImg").val();
    //var customerId = $("#Asset_Pricing_CustomerId").val();
    $('.facilityImageView').attr('src', '../FacilityFiles/' + ImageName);
    $('.facilityImageName').text(ImageName);
    $("#FacilityImgModal").modal("show");
});

$('#tbl_view_facilityDetails_view').on('click', 'tbody .View_WS_Cal_Image', function (p) {

    //var data_row = table.row($(this).closest('tr')).data();
    var ImageName = $(this).closest("tr").find(".facilityViewImg").val();
    //var customerId = $("#Asset_Pricing_CustomerId").val();
    $('.facilityImageView').attr('src', '../FacilityFiles/' + ImageName);
    $('.facilityImageName').text(ImageName);
    $("#FacilityImgModal").modal("show");
});

function GetAllSupervisors() {
    $.ajax({
        type: "GET",
        url: "/Comercials/Get_AllSupervisors",
        data: null,
        contentType: false,
        // dataType: "json",
        async: false,
        processData: false,
        success: function (response) {

            if (response != null) {
                All_Supervisors = response;
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            event.preventDefault();
        }
    });
}

function GetAllRecepients() {
    $.ajax({
        type: "GET",
        url: "/Comercials/Get_All_Recepients",
        data: null,
        contentType: false,
        // dataType: "json",
        async: false,
        processData: false,
        success: function (response) {

            if (response != null) {
                $.each(response.cH_TBL, function (key, value) {
                    $("#DropDown_Level1").append($("<option     />").val(value.empCode).text(value.empCode + ' - ' + value.empName));
                    $("#DropDown_Reversal_Level1").append($("<option     />").val(value.empCode).text(value.empCode + ' - ' + value.empName));
                    $("#AC_DropDown_Level1").append($("<option     />").val(value.empCode).text(value.empCode + ' - ' + value.empName));
                    $("#TP_DropDown_Level1").append($("<option     />").val(value.empCode).text(value.empCode + ' - ' + value.empName));

                    $("#DropDown_Level1").val('S0369').trigger('chosen:updated');

                });
                $.each(response.uH_TBL, function (key, value) {
                    $("#DropDown_Level2").append($("<option     />").val(value.empCode).text(value.empCode + ' - ' + value.empName));
                    $("#DropDown_Reversal_Level2").append($("<option     />").val(value.empCode).text(value.empCode + ' - ' + value.empName));
                    $("#AC_DropDown_Level2").append($("<option     />").val(value.empCode).text(value.empCode + ' - ' + value.empName));
                });
                $.each(response.sH_TBL, function (key, value) {
                    $("#DropDown_Level3").append($("<option     />").val(value.empCode).text(value.empCode + ' - ' + value.empName));
                    $("#DropDown_Reversal_Level3").append($("<option     />").val(value.empCode).text(value.empCode + ' - ' + value.empName));
                    $("#AC_DropDown_Level3").append($("<option     />").val(value.empCode).text(value.empCode + ' - ' + value.empName));
                });
                $.each(response.rH_TBL, function (key, value) {
                    $("#DropDown_Level4").append($("<option     />").val(value.empCode).text(value.empCode + ' - ' + value.empName));
                    $("#DropDown_Reversal_Level4").append($("<option     />").val(value.empCode).text(value.empCode + ' - ' + value.empName));
                    $("#AC_DropDown_Level4").append($("<option     />").val(value.empCode).text(value.empCode + ' - ' + value.empName));
                });
                $.each(response.zH_TBL, function (key, value) {
                    $("#DropDown_Level5").append($("<option     />").val(value.empCode).text(value.empCode + ' - ' + value.empName));
                    $("#DropDown_Reversal_Level5").append($("<option     />").val(value.empCode).text(value.empCode + ' - ' + value.empName));
                    $("#AC_DropDown_Level5").append($("<option     />").val(value.empCode).text(value.empCode + ' - ' + value.empName));
                });
                $.each(response.nH_TBL, function (key, value) {
                    $("#DropDown_Level6").append($("<option     />").val(value.empCode).text(value.empCode + ' - ' + value.empName));

                });
                $.each(response.bH_TBL, function (key, value) {
                    $("#DropDown_Level7").append($("<option     />").val(value.empCode).text(value.empCode + ' - ' + value.empName));
                    $("#DropDown_Reversal_Level6").append($("<option     />").val(value.empCode).text(value.empCode + ' - ' + value.empName));
                    $("#AC_DropDown_Level6").append($("<option     />").val(value.empCode).text(value.empCode + ' - ' + value.empName));
                });
                $.each(response.gH_TBL, function (key, value) {
                    $("#DropDown_Level8").append($("<option     />").val(value.empCode).text(value.empCode + ' - ' + value.empName));
                    $("#DropDown_Reversal_Level7").append($("<option     />").val(value.empCode).text(value.empCode + ' - ' + value.empName));
                    $("#AC_DropDown_Level7").append($("<option     />").val(value.empCode).text(value.empCode + ' - ' + value.empName));
                });


                /* --------------- Code added to set default select value---------------- */
                ClearAll_AssetPricing_Dropdowns();
                /* --------------- Code added to set default select value---------------- */
            }

        },
        error: function (xhr, ajaxOptions, thrownError) {
            event.preventDefault();
        }
    });
}

function GetMasterData(drp_type) {

    $.ajax({
        type: "GET",
        url: "/Comercials/Get_Master_Dropdown_Data?drp_type=" + drp_type,
        data: null,
        contentType: false,
        // dataType: "json",
        async: false,
        processData: false,
        success: function (response) {

            if (response != null) {
                if (drp_type == 'Facility_Details') {
                    facilityDetailData = response;
                    //$.each(facilityDetailData, function () {
                    //    $("#drp_facility_type").append($("<option     />").val(this.key).text(this.value));
                    //});
                }
                if (drp_type == 'Facility_Instruction_Details') {
                    facilityInstructionDetailData = response;
                }
                if (drp_type == 'Charges_Types') {
                    chargersTypeData = response;
                    AccountCustmisation_ChargesType = response;
                }
                if (drp_type == 'Reversal_charges') {
                    ReversalChargesData = response;
                }
                if (drp_type == 'WaiverType') {
                    WaiverData = response;
                }
                if (drp_type == 'Business_Type') {
                    BusinessTypes = response;
                    $.each(BusinessTypes, function () {
                        $("#drp_business").append($("<option   />").val(this.value).text(this.value));
                    });
                }
                if (drp_type == 'Security_Types') {
                    SecurityTypeData = response;
                }

            }

        },
        error: function (response) {
            event.preventDefault();
        }
    });
}
function SaveMultipleBanking(CustomerID) {

    $('#tbl_MultipleBanking tr').each(function (e) {

        var formData = new FormData();
        if (e != 0) {
            if ($(this).find("td:eq(1) input[type='text']").length >= 1) {
                formData.append('CustomerId', CustomerID);
                formData.append('FacilityType', $(this).find("td:eq(0) option:selected").text());
                formData.append('BankName', $(this).find("td:eq(1) input[type='text']").val());
                formData.append('Sanctioned_Amt', $(this).find("td:eq(2) input[type='text']").val());
                formData.append('Outstanding_Amt', $(this).find("td:eq(3) input[type='text']").val());
                formData.append('ROI', $(this).find("td:eq(4) input[type='text']").val());
                formData.append('RowId', $(this).find("td:eq(1) input[type='text']").attr("data-id"));
                var multipleBanking_output = fnSaveMaster(formData, 'Add_MultipleBanking_Details');
            }
        }
    });
}


function SaveCollateralDetails(CustomerID) {

    $('#tbl_ipCollateral tr').each(function (e) {
        var formData = new FormData();
        if (e != 0) {
            if ($(this).find("td:eq(1) input[type='text']").length >= 1) {
                formData.append('CustomerId', CustomerID);
                formData.append('SecurityType', $(this).find("td:eq(0) option:selected").val());
                formData.append('SecurityDescription', $(this).find("td:eq(1) input[type='text']").val());
                formData.append('SecurityOwner', $(this).find("td:eq(2) input[type='text']").val());
                formData.append('SecurityValue', $(this).find("td:eq(3) input[type='text']").val());
                formData.append('RowId', $(this).find("td:eq(1) input[type='text']").attr("data-id"));
                var charges_output = fnSaveMaster(formData, 'Add_Collateral_Details');
            }
        }
    });
}

function SaveOtherChargesDetails(CustomerID) {

    $('#tbl_OtherCharges tr').each(function (e) {
        var formData = new FormData();
        if (e != 0) {
            if ($(this).find("td:eq(2) input[type='text']").length >= 1) {
                formData.append('CustomerId', CustomerID);
                formData.append('ChargesType', $(this).find("td:eq(0) option:selected").text());
                formData.append('ExistingPrice', $(this).find("td:eq(1) input[type='text']").val());
                formData.append('ProposedPrice', $(this).find("td:eq(2) input[type='text']").val());
                formData.append('RowId', $(this).find("td:eq(2) input[type='text']").attr("data-id"));
                var charges_output = fnSaveMaster(formData, 'Add_Other_Charges');
            }
        }
    });
}


function saveFacilityDetails(CustomerID) {

    $('#tbl_FacilityDetails tr').each(function (e) {

        var formData = new FormData();
        //if (!this.rowIndex) return; // skip first row
        if (e != 0) {
            if ($(this).find("td:eq(2) input[type='text']").length >= 1) {
                var fileId = $(this).find("input[type='file']")[0].id;
                var fileData = $('#' + fileId)[0].files[0];
                $(this).find("input[type='file']")[0].id;
                var price_one = $(this).find("td:eq(4) .priceOne").val();
                var price_two = $(this).find("td:eq(4) .priceTwo").val();
                if (price_one == '') {
                    price_one = ''
                }
                if (price_two == '') {
                    price_two = ''
                }
                formData.append('CustomerId', CustomerID);
                formData.append('FacilityType', $(this).find("td:eq(0) option:selected").text());
                formData.append('ExistingAmount', $(this).find("td:eq(1) input[type='text']").val());
                formData.append('RowId', $(this).find("td:eq(1) input[type='text']").attr("data-id"));
                formData.append('ProposedAmount', $(this).find("td:eq(2) input[type='text']").val());
                formData.append('ExistingPrice', $(this).find("td:eq(3) input[type='text']").val());
                formData.append('ProposedPrice', price_one + '-' + price_two);
                formData.append('Fb_Nfb', $(this).find("td:eq(0) option:selected").val());
                formData.append('Instruction', $(this).find("td:eq(5) option:selected").val());
                formData.append('file', fileData);
                formData.append('FileName', $(this).find("td:eq(6) .fileLable").text());

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
                formData.append('Promoter_Type', '');
                formData.append('IsAcccount', $(this).find("td:eq(3) option:selected").val());
                formData.append('AccountNumber', $(this).find("td:eq(4) input[type='text']").val());
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
        fnSaveApprover(CustomerID, CommercialType.data('name'), 0, $("#DropDown_Level1").val(), 1, 'Add_Approver_Details');
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
        fnSaveApprover(CustomerID, CommercialType.data('name'), 4, $("#DropDown_Level7").val(), 7, 'Add_Approver_Details')
    }
    if ($("#DropDown_Level8").val().length > 0) {
        fnSaveApprover(CustomerID, CommercialType.data('name'), 4, $("#DropDown_Level8").val(), 8, 'Add_Approver_Details')
    }
}
$("#BtnApprove").on('click', function (e) {
    CheckSession();
    var user_role = $("#LoginUserRole").val();
    var remark = $("#txt_approve_remark").val();
    if (remark == '') {
        toastr.error('Enter Remark');
    }
    if ($("#rbl_cpw_yes:checked").val() == '1' && $('#DropDown_Level4').find(":selected").text() == '' && (user_role == 'Relationship Manager' || user_role == 'Cluster Head')) {

        toastr.error('Credit Protect Waived needs approval upto Regional Head and above.');

    }
    else {
        $('#ApproveModal').modal('toggle');
        var userRole = $("#LoginUserRole").val();
        if (userRole == 'Cluster Head') {
            AssetPricingSubmitClick();
        }
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
        LoadAssetPricingGrid(CustomerType.data('name'), TableId, selectedMonth, selectedYear, 0);
        $(".side-wrapper").removeClass('opened');
        $(".side-content").removeClass('slideIn');
    }
});
$("#BtnSendBack").on('click', function (e) {
    CheckSession();
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
        LoadAssetPricingGrid(CustomerType.data('name'), TableId, selectedMonth, selectedYear, 0);
        $(".side-wrapper").removeClass('opened');
        $(".side-content").removeClass('slideIn');
    }
});
$("#BtnReject").on('click', function (e) {
    CheckSession();
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
        LoadAssetPricingGrid(CustomerType.data('name'), TableId, selectedMonth, selectedYear, 0);
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

function AssetPricingSubmitClick() {

    $("#divResponseHistory").hide();
    var IsFTB = $("input[type='radio'][name='IsFTB']:checked").val();
    var status = $("#AssetPricing_status").val();
    if (status == 'In Progress') {
        toastr.error('You are not allow to edit proposal as it is already in process');
    }
    else if (status == 'Approved') {
        toastr.error('Proposal is already approved');
    } else if ($("#rbl_cpw_yes:checked").val() && $('#DropDown_Level4').find(":selected").text() == '') {
        toastr.error('Credit Protect Waived needs approval upto Regional Head and above.');
    }
    else {
        var Isvalidate = true;
        var CommercialType = $("#ul_commercial_type").find("li > a.active");
        var CustomerType = $("#ul_customer_type").find("li > a.active");

        if (CustomerType.data('name') != 'Existing') {
            if ($("#txt_customerName").val() == undefined || $("#txt_customerName").val() == '') {
                Isvalidate = false;
                toastr.error('Please enter customer name!');
                return;
            }
        }
        if (CustomerType.data('name') == 'Existing' && $("#Asset_Pricing_CustomerId").val() == '') {
            if ($("#AssetPricing_txtClientId").val() == undefined || $("#AssetPricing_txtClientId").val() == '') {
                Isvalidate = false;
                toastr.error('Please enter Client ID!');
                return;
            }
        }
        if (CustomerType.data('name') == 'NTB') {
            if ($("#AP_ProposalNo").val() == undefined || $("#AP_ProposalNo").val() == '') {
                Isvalidate = false;
                toastr.error('Please enter Proposal Number!');
                return;
            }
        }
        //var facility_required = "";
        //var faciltyrowCount = $('#tbl_FacilityDetails >tbody >tr').length;
        //if (faciltyrowCount < 1) {
        //    Isvalidate = false;
        //    toastr.error('Atleast one record required in Facility Details');
        //    return;
        //}

        $('#tbl_FacilityDetails tr').each(function (e) {

            if (e != 0) {
                if (IsFTB == 0) {
                    if ($(this).find("td:eq(1) input[type='text']").val() == "") {
                        Isvalidate = false;
                        toastr.error('Existing Amount is required in Facility details');
                        return;
                    }
                    if ($(this).find("td:eq(3) input[type='text']").val() == "") {
                        Isvalidate = false;
                        toastr.error('Existing Price is required in Facility details');
                        return;
                    }
                }

                if ($(this).find("td:eq(2) input[type='text']").val() == "") {
                    Isvalidate = false;
                    toastr.error('Amount Proposed is required in Facility details');
                    return;
                }

                //if ($(this).find("td:eq(4) input[type='text']").val() == "") {
                //    Isvalidate = false;
                //    toastr.error('Price Proposed is required in Facility details');
                //    return;
                //}

                if ($(this).find('td:eq(0)').find('select option:selected').val() == "FB") {
                    if ($(this).find("td:eq(4) .priceOne").val() == "") {
                        Isvalidate = false;
                        toastr.error('Proposed price1 is required in Facility details');
                        return;
                    }

                    if ($(this).find("td:eq(4) .priceTwo").val() == "") {
                        Isvalidate = false;
                        toastr.error('Proposed price2 is required in Facility details');
                        return;
                    }

                    if ($(this).find('td:eq(5)').find('select option:selected').val() == "") {
                        Isvalidate = false;
                        toastr.error('Instruction is required in Facility details');
                        return;
                    }

                }
                else {
                    if ($(this).find("td:eq(4) .priceOne").val() == "") {
                        Isvalidate = false;
                        toastr.error('Proposed price1 is required in Facility details');
                        return;
                    }
                }
            }
        });

        $('#tbl_OtherCharges tr').each(function (e) {

            if (e != 0) {
                if (IsFTB == 0) {
                    if ($(this).find("td:eq(1) input[type='text']").val() == "") {
                        Isvalidate = false;
                        toastr.error('Existing Price is required in Other Charges');
                        return;
                    }
                }

                if ($(this).find("td:eq(2) input[type='text']").val() == "") {
                    Isvalidate = false;
                    toastr.error('Proposed Price is required in Other Charges');
                    return;
                }
            }
        });

        $('#tbl_ipCollateral tr').each(function (e) {
            if (e != 0) {

                if ($(this).find("td:eq(1) input[type='text']").val() == "") {
                    Isvalidate = false;
                    toastr.error('Security Description/Address is required in Collateral Details');
                    return;
                }
                if ($(this).find("td:eq(2) input[type='text']").val() == "") {
                    Isvalidate = false;
                    toastr.error('Security Owner is required in Collateral Details');
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
                    toastr.error('In Promoter details account number is required if you have Account with us');
                    return;
                }
            }
        });

        $('#tbl_customers tr').each(function (e) {
            if (e != 0) {
                if ($(this).find("td:eq(0) input[type='text']").val() == "") {
                    Isvalidate = false;
                    toastr.error('Relative Promoter Name is required in Promoter Details');
                    return;
                }
                if ($(this).find("td:eq(2) option:selected").val() == '') {
                    Isvalidate = false;
                    toastr.error('Relationship With is required in Promoter Details');
                    return;
                }
                if (($(this).find("td:eq(4) input[type='text']").val() == '') && ($(this).find("td:eq(3) option:selected").val() == '1')) {
                    Isvalidate = false;
                    toastr.error('In Relative promoter details account number is required if you have Account with us');
                    return;
                }

            }
        });

        var multiple_bank_val = $("input[type='radio'][name='Multiple_Banking']:checked").val();
        if (multiple_bank_val == 1 && IsFTB == 0) {

            $('#tbl_MultipleBanking tr').each(function (e) {
                var formData = new FormData();
                if (e != 0) {
                    if ($(this).find("td:eq(1) input[type='text']").length >= 1) {
                        if ($(this).find("td:eq(1) input[type='text']").val() == "") {
                            Isvalidate = false;
                            toastr.error('BankName is required in Multiple Banking');
                            return;
                        }
                        if ($(this).find("td:eq(2) input[type='text']").val() == "") {
                            Isvalidate = false;
                            toastr.error('Sanctioned Amount is required in Multiple Banking');
                            return;
                        }
                        if ($(this).find("td:eq(3) input[type='text']").val() == "") {
                            Isvalidate = false;
                            toastr.error('Outstanding Amount is required in Multiple Banking');
                            return;
                        }
                        if ($(this).find("td:eq(4) input[type='text']").val() == "") {
                            Isvalidate = false;
                            toastr.error('ROI is required in Multiple Banking');
                            return;
                        }

                    }
                }
            });

        }

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
}

$("#btn_Add_AssetPricing").on('click', function (e) {
    CheckSession();
    AssetPricingSubmitClick();

});

function SaveAssetPricingDetails(CommercialType, CustomerType) {

    formData = new FormData();

    formData.append('CustomerId', $("#Asset_Pricing_CustomerId").val() == '' ? 0 : $("#Asset_Pricing_CustomerId").val());
    formData.append('CustomerName', $("#txt_customerName").val().trim());
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
    formData.append('ClientId', $("#lbl_clientsIdAP").text());
    formData.append('ApprovalNo', $("#AP_Approval_No").val());
    formData.append('CommercialType', CommercialType.data('name'));
    formData.append('CustomerType', CustomerType.data('name'));
    formData.append('IsFTB', $("input[type='radio'][name='IsFTB']:checked").val());
    formData.append('CreditProtectWaived', $("input[type='radio'][name='CPW']:checked").val());
    var customerType = CustomerType.data('name');
    if (customerType == 'NTB') {
        formData.append('ProposalNumber', $("#AP_ProposalNo").val());
    }
    else {
        formData.append('ProposalNumber', $("#lbl_ProposalNo").text());
    }

    $.ajax({
        type: "POST",
        url: "/Comercials/Add_AssetPricing",
        data: formData,
        contentType: false,
        dataType: "JSON",
        async: false,
        processData: false,
        success: function (response) {

            if (response != null && response.isSuccess == 'false') {
                toastr.error(response.msg);
            }
            else if (response != null && response.isSuccess == 'true') {
                if ($("#Asset_Pricing_CustomerId").val() != '') {
                    debugger;
                    var status = $("#AssetPricing_status").val()
                    // fnDelete_AllRowsDetails($("#Asset_Pricing_CustomerId").val(), 'AssetPricing', 'SP_OVI_Delete_ApproverDetails');
                    fnDelete_AllRowsDetails($("#Asset_Pricing_CustomerId").val(), 'AssetPricing', 'SP_OVI_DeleteAllAssetPricing', status);
                }
                //swal('Success', response.msg, 'success');
                saveFacilityDetails(response.id);
                SaveOtherChargesDetails(response.id)
                SaveCollateralDetails(response.id);
                SavePromoterDetails(response.id);
                SaveCustomersDetails(response.id);
                if (status != '') {
                    if (status != 'Sent Back' && status != 'Rejected') {
                        SaveApproverDetails(response.id);
                    }
                }
                else {
                    SaveApproverDetails(response.id);
                }

                SaveMultipleBanking(response.id);
                //if (CustomerType.data('name') == "IP") {
                //    saveFacilityDetails(response.id);
                //    SaveOtherChargesDetails(response.id)
                //    SaveCollateralDetails(response.id);
                //    SavePromoterDetails(response.id);
                //    SaveCustomersDetails(response.id);
                //    SaveApproverDetails(response.id);
                //}
                //else {
                //    saveFacilityDetails(response.id);
                //    SaveOtherChargesDetails(response.id)
                //    SaveCollateralDetails(response.id);
                //    SavePromoterDetails(response.id);
                //    SaveCustomersDetails(response.id);
                //    SaveApproverDetails(response.id);
                //    SaveMultipleBanking(response.id);
                //}

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
                LoadAssetPricingGrid(CustomerType.data('name'), TableId, selectedMonth, selectedYear, 0);

                if ($("#Asset_Pricing_CustomerId").val() == '') {
                    $(".side-wrapper").removeClass('opened');
                    $(".side-content").removeClass('slideIn');
                    //$('body').css('overflow-x', 'hidden');

                    toastr.success(response.msg);
                }
                else {
                    var userRole = $("#LoginUserRole").val();
                    if (userRole != 'Cluster Head') {
                        toastr.success('Proposal Updated Successfully!');
                    }
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
function LoadAssetPricingGrid(CustomerType, TableId, month, year, ClientId) {

    var TableInfo = '';
    var month = month;
    var year = year;
    var user_role = $("#LoginUserRole").val();
    $.ajax({
        type: "GET",
        url: "/Comercials/GetAssetPricingGridData?CustomerType=" + CustomerType + "&Month=" + month + "&Year=" + year + "&ClientId=" + ClientId,
        data: null,
        contentType: false,
        // dataType: "json",
        async: false,
        processData: false,
        success: function (response) {

            var isProposal = "";
            if (CustomerType == 'IP') {
                $("#lbl_IPCount").text(response.tbL_AssetPricingCount[0].assetPricing_Count);

            }
            else if (CustomerType == 'NTB') {

                $("#lbl_NTBCount").text(response.tbL_AssetPricingCount[0].assetPricing_Count);
            }
            else {
                $("#lbl_ExistingCount").text(response.tbL_AssetPricingCount[0].assetPricing_Count);
            }
            if (response.tbL_AssetPricingGridData != null) {
                //if (ClientId != '' && ClientId != undefined && ClientId != 0) {
                //    var data_filter = response.tbL_AssetPricingGridData.filter(element => element.clientId == ClientId);
                //    response.tbL_AssetPricingGridData = data_filter;
                //}
                if (CustomerType == 'IP') {
                    isProposal = "d-none";
                }
                //else if (CustomerType == 'NTB') {
                //    debugger
                //    $("#lbl_NTBCount").text(response.tbL_AssetPricingGridData.length);
                //}
                //else {
                //    $("#lbl_ExistingCount").text(response.tbL_AssetPricingGridData.length);
                //}
                var col = [];
                for (var i = 0; i < 1; i++) {
                    for (var key in response.tbL_AssetPricingGridData[i]) {
                        if (col.indexOf(key) === -1) {
                            var columnArray = {};
                            columnArray.data = key;
                            columnArray.title = key.toUpperCase();
                            col.push(columnArray);
                        }
                    }
                }
                TableInfo = $("#" + TableId).DataTable({

                    data: response.tbL_AssetPricingGridData,
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
                            "targets": 2,
                            "className": isProposal
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
                        },

                    ],
                    //"language":[ {
                    //    "emptyTable": "My Custom Message On Empty Table"
                    //}],
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
                if (CustomerType == 'IP') {
                    TblIPLeads = TableInfo;
                }
                else if (CustomerType == 'NTB') {
                    TblNTBLeads = TableInfo;
                }
                else {
                    TblExistingLeads = TableInfo;
                }
            }
            else {
                //$("#" + TableId).empty();
                //if (CustomerType == 'IP') {
                //    $("#lbl_IPCount").text('0');
                //    isProposal = "d-none";
                //}
                //else if (CustomerType == 'NTB') {
                //    $("#lbl_NTBCount").text('0');
                //}
                //else {
                //    $("#lbl_ExistingCount").text('0');
                //}
                //$("" + TableId).innerHTML("No Data found");
                //$("#" + TableId +".table-td-border-outer").html("No data found");
            }


        },
        error: function (xhr, ajaxOptions, thrownError) {
            result = xhr.innerHTML;
        }
    });


    if (TableId == 'Tbl_IPLeads') {
        $('#Tbl_IPLeads').on('click', 'tbody tr', function (p) {

            CheckSession();
            AssetPricing_EnableFeilds_Typewise();
            $("#txt_customerName").attr("disabled", "disabled");

            //DisableDropdowns();
            var data = {};
            var data_row = TblIPLeads.row(this).data();


            $("#create_AP_Proposal").css('display', 'none');

            $("#update_AP_Proposal").css('display', 'block')

            if (data_row != undefined) {
                $("#AssetPricing_status").val(data_row.status);
                $("#Asset_Pricing_CustomerId").val(data_row.id);
                $("#txt_customerName").val(data_row.customer_Name);
                $("#txt_justification").val(data_row.remarks)

                $("#divComments").hide();
                if (data_row.comments != undefined && data_row.comments != '') {
                    $("#divComments").show();
                    $("#txt_comments").val(data_row.comments);
                }

                //GetApprovalStatus(data_row.id,'check_Approver_Status');

                $("#dv_accordian_customerDetails").hide();
                //$("#accordian_multiplebanking").hide();

                if (data_row.status == 'Approved') {
                    var a = GetProposalApprovedDaysDiffence(data_row.id);
                    $("#btn_DownloadApproved").show();
                    if ((a[0].daysDiff) > 15) {
                        $("#AlertMessage").show();
                        $('#btn_DownloadApproved').prop('disabled', true);
                        $('#btn_DownloadApproved i').css('color', 'rgb(179 176 176)');
                    }
                    else {
                        $("#AlertMessage").hide();
                        $('#btn_DownloadApproved').prop('disabled', false);
                        $('#btn_DownloadApproved i').css('color', '#1C3FCA');
                    }



                }
                else {
                    $("#btn_DownloadApproved").hide();

                }

                if (data_row.status == 'Sent Back' || data_row.status == 'Rejected') {
                    DisableDropdowns()
                }
                else {
                    EnableDropdowns();
                }

                if ((user_role == 'Relationship Manager' && data_row.status != 'Approved') || (user_role == 'Cluster Head' && data_row.status != 'Approved')) {
                    $("#btn_Add_AssetPricing").show();
                    $("#divAssetPricing").show();
                    $("#divAssetPricingView").hide();
                    loadAssetPricingCustomerDetail(data_row.id, 'IP', 'update');

                }
                else {

                    $("#btn_Add_AssetPricing").hide();
                    $(".lbl_AP_custName").text(data_row.customer_Name);
                    $(".lbl_view_Justification").text(data_row.remarks)
                    $("#divAssetPricing").hide();
                    $("#divAssetPricingView").show();
                    loadAssetPricingCustomerDetail(data_row.id, 'IP', 'view');
                }



                $("#sidebar_assetpricing").addClass('opened')
                $(".side-content").addClass('slideIn');
                document.querySelector('body').style.overflow = 'hidden';

            }
        })
    }

    if (TableId == 'Tbl_NTBLeads') {
        $('#Tbl_NTBLeads').on('click', 'tbody tr', function (p) {
            CheckSession();
            AssetPricing_EnableFeilds_Typewise();
            $("#txt_customerName").attr("disabled", "disabled");
            $("#AP_ProposalNo").attr("disabled", "disabled");
            //$("#txt_customerName").attr("disabled", "disabled");

            //DisableDropdowns();
            var data = {};
            var data_row = TblNTBLeads.row(this).data();
            $("#create_AP_Proposal").css('display', 'none');
            $("#update_AP_Proposal").css('display', 'block')
            if (data_row != undefined) {
                $("#AssetPricing_status").val(data_row.status);
                $("#Asset_Pricing_CustomerId").val(data_row.id);
                $("#txt_customerName").val(data_row.customer_Name);
                $("#txt_justification").val(data_row.remarks);

                $("#divComments").hide();
                if (data_row.comments != undefined && data_row.comments != '') {
                    $("#divComments").show();
                    $("#txt_comments").val(data_row.comments);
                }

                $("#dv_accordian_customerDetails").hide();
                //GetApprovalStatus(data_row.id, 'check_Approver_Status');

                if (data_row.status == 'Approved') {
                    var a = GetProposalApprovedDaysDiffence(data_row.id);
                    $("#btn_DownloadApproved").show();
                    if ((a[0].daysDiff) > 15) {
                        $("#AlertMessage").show();
                        $('#btn_DownloadApproved').prop('disabled', true);
                        $('#btn_DownloadApproved i').css('color', 'rgb(179 176 176)');
                    }
                    else {
                        $("#AlertMessage").hide();
                        $('#btn_DownloadApproved').prop('disabled', false);
                        $('#btn_DownloadApproved i').css('color', '#1C3FCA');
                    }

                }
                else {
                    $("#btn_DownloadApproved").hide();

                }

                if ((user_role == 'Relationship Manager' && data_row.status != 'Approved') || (user_role == 'Cluster Head' && data_row.status != 'Approved')) {
                    $("#btn_Add_AssetPricing").show();
                    $("#divAssetPricing").show();
                    $("#divAssetPricingView").hide();
                    loadAssetPricingCustomerDetail(data_row.id, 'NTB', 'update');
                }
                else {
                    $("#btn_Add_AssetPricing").hide();
                    $(".lbl_AP_custName").text(data_row.customer_Name);
                    $(".lbl_view_Justification").text(data_row.remarks)
                    $("#divAssetPricing").hide();
                    $("#divAssetPricingView").show();
                    loadAssetPricingCustomerDetail(data_row.id, 'NTB', 'view');
                }


                $("#sidebar_assetpricing").addClass('opened')
                $(".side-content").addClass('slideIn');
                document.querySelector('body').style.overflow = 'hidden';
            }
        })
    }

    if (TableId == 'Tbl_ExistingLeads') {
        $('#Tbl_ExistingLeads').on('click', 'tbody tr', function (p) {
            CheckSession();
            //$("#dv_clientid").hide();
            //$("#dv_customer_name").show();
            AssetPricing_EnableFeilds_Typewise();

            var data = {};
            var data_row = TblExistingLeads.row(this).data();
            $("#create_AP_Proposal").css('display', 'none');
            $("#update_AP_Proposal").css('display', 'block')
            if (data_row != undefined) {
                $("#AssetPricing_status").val(data_row.status);
                $("#Asset_Pricing_CustomerId").val(data_row.id);
                $("#txt_customerName").val(data_row.customer_Name);
                $("#txt_justification").val(data_row.remarks);

                $("#divComments").hide();
                if (data_row.comments != undefined && data_row.comments != '') {
                    $("#divComments").show();
                    $("#txt_comments").val(data_row.comments);
                }

                $("#dv_accordian_customerDetails").show();
                $("#dv_clientid").css('display', 'none')
                $("#dv_customer_name").css('display', 'block')
                //EnableAssetPricingFields();
                enableexisting();

                $("#txt_customerName").attr("disabled", "disabled");
                //DisableDropdowns();
                //GetApprovalStatus(data_row.id, 'check_Approver_Status');
                if (data_row.status == 'Approved') {
                    $("#btn_DownloadApproved").show();
                }
                else {
                    $("#btn_DownloadApproved").hide();
                }


                if (data_row.status == 'Approved') {
                    var a = GetProposalApprovedDaysDiffence(data_row.id);
                    $("#btn_DownloadApproved").show();
                    if ((a[0].daysDiff) > 15) {
                        $("#AlertMessage").show();
                        $('#btn_DownloadApproved').prop('disabled', true);
                        $('#btn_DownloadApproved i').css('color', 'rgb(179 176 176)');
                    }
                    else {
                        $("#AlertMessage").hide();
                        $('#btn_DownloadApproved').prop('disabled', false);
                        $('#btn_DownloadApproved i').css('color', '#1C3FCA');
                    }



                }
                else {
                    $("#btn_DownloadApproved").hide();

                }

                if ((user_role == 'Relationship Manager' && data_row.status != 'Approved') || (user_role == 'Cluster Head' && data_row.status != 'Approved')) {
                    $("#btn_Add_AssetPricing").show();
                    $("#divAssetPricing").show();
                    $("#divAssetPricingView").hide();
                    loadAssetPricingCustomerDetail(data_row.id, 'Existing', 'update');
                }
                else {
                    $("#btn_Add_AssetPricing").hide();
                    $(".lbl_AP_custName").text(data_row.customer_Name);
                    $(".lbl_view_Justification").text(data_row.remarks)
                    $("#divAssetPricing").hide();
                    $("#divAssetPricingView").show();
                    loadAssetPricingCustomerDetail(data_row.id, 'Existing', 'view');
                }

                $("#sidebar_assetpricing").addClass('opened')
                $(".side-content").addClass('slideIn');
                document.querySelector('body').style.overflow = 'hidden';
            }
        })
    }
}

function GetProposalApprovedDaysDiffence(CustomerId) {

    var result;
    $.ajax({
        type: "GET",
        url: "/Comercials/GetProposalApprovedDaysDiffence?CustomerId=" + CustomerId,
        data: null,
        contentType: false,
        async: false,
        processData: false,
        success: function (response) {

            if (response != null) {
                result = response;
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            event.preventDefault();
        }
    });

    return result;
}

function GetApprovalStatus(CustomerInfo_Id, action_name) {

    $.ajax({
        type: "GET",
        url: "/Comercials/Get_Approvers_ApprovalStatus?CustomerInfo_Id=" + CustomerInfo_Id + "&actionName=" + action_name,
        data: null,
        contentType: false,
        // dataType: "json",
        async: false,
        processData: false,
        success: function (response) {

            if (response != null && response.status != 0) {
                if (response.status == 1) {
                    $("#BtnApprove").hide();
                    $("#btn_sendback").show();
                    $("#btn_reject").show();

                    $("#BtnApproveReversal").hide();
                    $("#btn_sendbackReversal").show();
                    $("#btn_RejectReversal").show();

                    $("#BtnApproveAccountCustomisation").hide();
                    $("#btn_sendbackAccountCustomisation").show();
                    $("#btn_RejectAccountCustomisation").show();


                }
                else if (response.status == 2) {
                    $("#btn_sendback").hide();
                    $("#btn_reject").show();
                    $("#BtnApprove").show();

                    $("#BtnApproveReversal").show();
                    $("#btn_sendbackReversal").hide();
                    $("#btn_RejectReversal").show();

                    $("#btn_sendbackAccountCustomisation").hide();
                    $("#btn_RejectAccountCustomisation").show();
                    $("#BtnApproveAccountCustomisation").show();
                }
                else {
                    $("#btn_reject").hide();
                    $("#btn_sendback").show();
                    $("#BtnApprove").show();


                    $("#BtnApproveReversal").show();
                    $("#btn_sendbackReversal").show();
                    $("#btn_RejectReversal").hide();

                    $("#btn_RejectAccountCustomisation").hide();
                    $("#btn_sendbackAccountCustomisation").show();
                    $("#BtnApproveAccountCustomisation").show();
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            result = xhr.innerHTML;
        }
    });
}

function loadAssetPricingCustomerDetail(CustomerId, CustomerType, viewType) {
    //$('#view_IPPropsl').hide();
    $.ajax({
        type: "GET",
        url: "/Comercials/Get_AssetPricingCustomerDetail?CustomerId=" + CustomerId + "&CustomerType=" + CustomerType,
        data: null,
        contentType: false,
        async: false,
        processData: false,
        success: function (response) {

            if (response != null) {
                var CustomerInfo = response.tbL_Asset_Pricing_Customer_Info;
                $("#LoginUserRole").val(CustomerInfo[0].empRole);
                if (viewType == 'update') {
                    LoadAssetPricingForEdit(response, CustomerId, CustomerType);
                }
                else {
                    LoadAssetPricingForView(response, CustomerId, CustomerType, '');
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            event.preventDefault();
        }
    });
}

function LoadAssetPricingForEdit(response, CustomerId, CustomerType) {
    $("#ActionType").val("edit");
    var CustomerInfo = response.tbL_Asset_Pricing_Customer_Info;
    var IsPSL = CustomerInfo[0].psl;
    var PSLType = CustomerInfo[0].pslType;

    if (CustomerType != 'Existing') {
        $("#accordian_firsttimeborrower").show();
    }
    else {
        $("#accordian_firsttimeborrower").hide();
    }

    var IsFTB = CustomerInfo[0].isFTB;

    $("input[name=IsFTB][value=" + IsFTB + "]").prop('checked', true);

    var IsCPW = CustomerInfo[0].creditProtectWaived;

    $("input[name=CPW][value=" + IsCPW + "]").prop('checked', true);

    if (IsFTB == 1) {
        $(".FirstTimeBorrower").prop('disabled', true);
        $(".FirstTimeBorrower").css('cursor', 'not-allowed');
    }
    else {
        $(".FirstTimeBorrower").prop('disabled', false);
        $(".FirstTimeBorrower").css('cursor', 'inherit');
    }

    $("input[name=PSL][value=" + IsPSL + "]").prop('checked', true);
    if (IsPSL == 0) {
        $("#psl_details").hide();
    }
    else if (IsPSL == 1) {
        $("input[name=PSL_Type][value=" + PSLType + "]").prop('checked', true);
        $("input[name=WeakerSection][value=" + CustomerInfo[0].isWeakerSection + "]").prop('checked', true);
        $("#psl_details").show();
    }

    var IsMultipleBanking = CustomerInfo[0].isMultipleBanking;


    $("input[name=Multiple_Banking][value=" + IsMultipleBanking + "]").prop('checked', true);
    if (IsMultipleBanking == 0) {
        $("#multiple_banking_body").hide();
    }
    else if (IsMultipleBanking == 1) {

        $("#multiple_banking_body").show();
    }

    if (CustomerType == 'Existing') {
        lbl_RAROC.innerText = response.tbL_Asset_Pricing_Customer_Info[0].raroc;
        lbl_APR_PFY.innerText = response.tbL_Asset_Pricing_Customer_Info[0].aprpfy;
        lbl_APR_YTD.innerText = response.tbL_Asset_Pricing_Customer_Info[0].aprytd;
        lbl_AP_CTI.innerText = response.tbL_Asset_Pricing_Customer_Info[0].cti;
        lbl_Vintage.innerText = response.tbL_Asset_Pricing_Customer_Info[0].vintage;
        lbl_Customer_Name.innerText = response.tbL_Asset_Pricing_Customer_Info[0].customer_Name;
        lbl_ProposalNo.innerText = response.tbL_Asset_Pricing_Customer_Info[0].proposal_Number;
        lbl_clientsIdAP.innerText = response.tbL_Asset_Pricing_Customer_Info[0].clients_No;
    }
    if (CustomerType == 'NTB') {

        $("#AP_ProposalNo").val(response.tbL_Asset_Pricing_Customer_Info[0].proposal_Number);
        $("#AP_Approval_No").val(response.tbL_Asset_Pricing_Customer_Info[0].iP_Approval_No);
        if (response.tbL_Asset_Pricing_Customer_Info[0].iP_Approval_No == '' || response.tbL_Asset_Pricing_Customer_Info[0].iP_Approval_No == '0') {
            $("#view_IPPropsl").hide();
        }
        else {
            $("#view_IPPropsl").show();
        }
    }

    for (var i = 0; i < response.tbL_Aprrover.length; i++) {
        var LevelNumber = response.tbL_Aprrover[i].levelNumber;
        var Drp_Value = response.tbL_Aprrover[i].approverADID;
        if (LevelNumber == 1) {
            //$("#chk_level1").prop("checked", true);
            $("#DropDown_Level1").val(Drp_Value).trigger('chosen:updated');
            //enableDisable_Recipient("chk_level1", "DropDown_Level1");

        }
        else if (LevelNumber == 2) {

            $("#DropDown_Level2").val(Drp_Value).trigger('chosen:updated');
        }
        else if (LevelNumber == 3) {
            $("#DropDown_Level3").val(Drp_Value).trigger('chosen:updated');
        }
        else if (LevelNumber == 4) {
            $("#DropDown_Level4").val(Drp_Value).trigger('chosen:updated');
        }
        else if (LevelNumber == 5) {
            $("#DropDown_Level5").val(Drp_Value).trigger('chosen:updated');
        }
        else if (LevelNumber == 6) {
            $("#DropDown_Level6").val(Drp_Value).trigger('chosen:updated');
        }
        else if (LevelNumber == 7) {
            $("#DropDown_Level7").val(Drp_Value).trigger('chosen:updated');
        }
        else if (LevelNumber == 8) {
            $("#DropDown_Level8").val(Drp_Value).trigger('chosen:updated');
        }
    }
    //$("#btnFacilityDetails").hide();

    $("#tbl_FacilityDetails tbody>tr").remove();
    $.each(response.tbL_Facility_Details, function (key, value) {
        AddNewFacilityRow(value.facilityType, value.existingAmount,
            value.proposedAmount, value.existingPrice,
            value.proposedPrice, value.fb_Nfb, value.instruction, value.fileName, value.facility_Details_Id);
    });

    //$("#btnAddCharges").hide();
    $("#tbl_OtherCharges tbody>tr").remove();
    $.each(response.tbL_Other_Charges, function (key, value) {
        AddNewChargesRow(value.chargeType, value.existingPrice,
            value.proposedPrice, value.other_Charges_ID);
    });

    //$("#btnAddCollateral").hide();
    $("#tbl_ipCollateral tbody>tr").remove();
    $.each(response.tbL_Collateral_Details, function (key, value) {
        AddNewCollateralRow(value.securityOwner, value.securityDescription,
            value.securityType, value.securityValue, value.collateral_details_ID);
    });

    //$("#BtnAddPromoters").hide();
    //$("#BtnAddCustomers").hide();
    $("#tbl_Promoters tbody>tr").remove();
    $("#tbl_customers tbody>tr").remove();
    $.each(response.tbL_Promoter, function (key, value) {
        if (value.isPromoter == 1) {
            AddNewPromotersRow(value.promoter_Name, value.promoter_Type,
                value.isAcccount, value.accountNumber, value.promoter_ID);
        }
        else {
            $("#customers_Section").show();
            //$("#BtnAddCustomers").hide();
            AddNewCustomerRow(value.promoter_Name, value.relationshipName, value.relationshipWith,
                value.promoter_Type, value.isAcccount, value.accountNumber, value.promoter_ID);
        }

    });

    $("#tbl_MultipleBanking tbody>tr").remove();

    //$("#BtnAddBanking").hide();

    //$('#drp_facility_type option[value=' + response.tbL_MultipleBanks[0].facilityType + ']').attr("selected", "selected")
    $.each(response.tbL_MultipleBanks, function (key, value) {
        AddNewBankingRow(value.facilityType, value.bankName, value.sanctioned, value.outstanding, value.roi, value.multipleBanks_Id);

    });
    //}
    //else {
    //    AddNewBankingRow('', '', '', '', '', '');
    //}

    //if (CustomerType == 'NTB' && CustomerType == 'Existing') {
    //    $.each(response.tbL_Collateral_Details, function (key, value) {
    //        AddNewCollateralRow(value.securityAddress, value.securityDescription,
    //            value.securityType, value.securityValue);
    //    });
    //}

    //$("#tbl_ResponseHistory thead>tr").remove();
    //$("#tbl_ResponseHistory tbody>tr").remove();
    $("#divResponseHistory").hide();
    if (response.tbL_ResponseHistory.length > 0) {

        var Response_col = [];
        for (var i = 0; i < 1; i++) {
            for (var key in response.tbL_ResponseHistory[i]) {
                if (Response_col.indexOf(key) === -1) {
                    var columnArray = {};
                    columnArray.data = key;
                    columnArray.title = key.toUpperCase();
                    Response_col.push(columnArray);
                }
            }
        }
        $("#divResponseHistory").show();
        $("#tbl_ResponseHistory").DataTable({
            data: response.tbL_ResponseHistory,
            columns: Response_col,
            "columnDefs": [{
                "targets": [0],
                "searchable": false,
                "orderable": false,
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
        });
    }
}

function LoadAssetPricingForView(response, CustomerId, CustomerType, viewType) {

    $("#ActionType").val("view");
    var CustomerInfo = response.tbL_Asset_Pricing_Customer_Info;
    var IsPSL = CustomerInfo[0].psl;
    var PSLType = CustomerInfo[0].pslType;
    if (IsPSL == 1) {
        $("#lbl_IsPSL").text("Yes")
        //$(".lbl_AP_pslClassification").text(PSLType);
        $(".lbl_AP_pslClassification").text("small");
    }
    else {
        $("#lbl_IsPSL").text("No")
        $(".lbl_AP_pslClassification").text(PSLType);
    }

    var Weakersection = CustomerInfo[0].isWeakerSection;
    if (Weakersection == 1) {
        $(".lbl_AP_weakerSection").text("Yes")

    }
    else {
        $(".lbl_AP_weakerSection").text("No")
    }

    var IsFTB = CustomerInfo[0].isFTB;
    if (IsFTB == 1) {
        $(".lbl_AP_FTB").text("Yes")
    }
    else {
        $(".lbl_AP_FTB").text("No")
    }


    if (CustomerType == 'Existing') {

        $(".dv_customersDetails").show();
        $(".lbl_AP_View_RAROC").text(CustomerInfo[0].raroc);
        $(".lbl_AP_View_APR_PFY").text(CustomerInfo[0].aprpfy);
        $(".lbl_AP_View_APR_YTD").text(CustomerInfo[0].aprytd);
        $(".lbl_AP_View_CTI").text(CustomerInfo[0].cti);
        $(".lbl_AP_View_Vintage").text(CustomerInfo[0].vintage);
        $(".lbl_AP_View_ProposalNo").text(CustomerInfo[0].proposal_Number);
        $(".lbl_AP_View_ClientId").text(CustomerInfo[0].clients_No);


        //lbl_AP_View_RAROC.innerText = CustomerInfo[0].raroc;
        //lbl_AP_View_APR_PFY.innerText = CustomerInfo[0].aprpfy;
        //lbl_AP_View_APR_YTD.innerText = CustomerInfo[0].aprytd;
        //lbl_AP_View_CTI.innerText = CustomerInfo[0].cti;
        //lbl_AP_View_Vintage.innerText = CustomerInfo[0].vintage;
        //lbl_AP_View_ProposalNo.innerText = CustomerInfo[0].proposal_Number;
        //lbl_AP_View_ClientId.innerText = CustomerInfo[0].clients_No;
    }
    else {
        $(".dv_customersDetails").hide();
    }


    if (CustomerType == 'NTB') {
        $(".dv_ApprNo").show();
        //if (CustomerInfo[0].iP_Approval_No == '' || CustomerInfo[0].iP_Approval_No == '0') {
        //    $("#view_IPPropsl").hide();
        //}
        //else {
        //    $("#view_IPPropsl").show();
        //}


        $(".lbl_AP_proposalNo").text(CustomerInfo[0].proposal_Number);
        if (viewType == 'IPView') {
            $(".dv_propNo").show();
            $(".lbl_AP_approvalNo").text(CustomerInfo[0].request_Number);
        }
        else {
            $(".lbl_AP_approvalNo").text(CustomerInfo[0].iP_Approval_No);
            $(".dv_propNo").show();
        }

    }
    else {
        $(".dv_propNo").hide();
        $(".dv_ApprNo").hide();
    }

    $(".tbl_view_facilityDetails tbody>tr").remove();


    $.each(response.tbL_Facility_Details, function (key, value) {
        if (value.existingAmount == null || value.existingAmount == '' || value.existingAmount == undefined) {
            value.existingAmount = '-';
        }
        const result = value.proposedPrice.split('-');
        var priceOne = result[0];
        var priceTwo = result[1];
        if (priceOne == '' || priceOne == undefined) {
            priceOne = ''
        }
        if (priceTwo == '' || priceTwo == undefined) {
            priceTwo = ''
        }
        //else {
        //    a += '<td>' + priceOne + '% i.e spread of ' + priceTwo + '%';
        //}
        var a = '<tr><td>' + value.facilityType + '</td><td>' + value.existingAmount + '</td><td>' + value.proposedAmount + '</td><td>' + value.existingPrice + '</td>';

        if (value.fb_Nfb == 'FB') {
            a += '<td>' + priceOne + '% i.e spread of ' + priceTwo + '% linked to ' + value.instruction + '</td>';
        }
        else {
            a += '<td>' + priceOne + '% '
        }

        if (value.fileName != '' && value.fileName != null && value.fileName != undefined) {
            a += '<td><input type="text" value="' + value.fileName + '" hidden class="facilityViewImg" /><a class="View_WS_Cal_Image link"><i class="fa fa-eye"></i></a></td></tr>';

        }
        else {
            a += '<td> - </td></tr>';

        }

        $('.tbl_view_facilityDetails tbody').append(a);

    });
    //if (response.tbl_facilityimage.length > 0) {
    //    $(".facilityImage").show();
    //    $(".facilityImage").attr("src", "../FacilityFiles/" + response.tbl_facilityimage[0].fileName);
    //}
    //else {
    //    $(".facilityImage").hide();
    //}


    $(".tbl_view_otherCharges tbody>tr").remove();
    $.each(response.tbL_Other_Charges, function (key, value) {
        if (value.existingPrice == null || value.existingPrice == '' || value.existingPrice == undefined) {
            value.existingPrice = '-';
        }
        $('.tbl_view_otherCharges tbody').append('<tr><td>' + value.chargeType + '</td><td>' + value.existingPrice + '</td><td>' + value.proposedPrice + '</td></tr>');

    });

    $(".tbl_view_collateralDetails tbody>tr").remove();
    $.each(response.tbL_Collateral_Details, function (key, value) {
        $('.tbl_view_collateralDetails tbody').append('<tr><td>' + value.securityType + '</td><td>' + value.securityDescription + '</td><td>' + value.securityOwner + '</td><td>' + value.securityValue + '</td></tr>');

    });

    $(".tbl_view_multipleBanking tbody>tr").remove();
    var IsMultipleBanking = CustomerInfo[0].isMultipleBanking;
    if (IsMultipleBanking == 1) {
        $(".lbl_multipleBank").text("Yes");
        //lbl_multipleBank.innerText = "Yes";
        $(".tbl_view_multipleBanking").show();
        $.each(response.tbL_MultipleBanks, function (key, value) {

            $('.tbl_view_multipleBanking tbody').append('<tr><td>' + value.facilityType + '</td><td>' + value.bankName + '</td><td>' + value.sanctioned + '</td><td>' + value.roi + '</td></tr>');

        });
    }
    else {
        $(".lbl_multipleBank").text("No");
        //lbl_multipleBank.innerText = "No";
        $(".tbl_view_multipleBanking").hide();
    }





    $(".tbl_view_promoters tbody>tr").remove();
    $(".tbl_view_customer tbody>tr").remove();
    $.each(response.tbL_Promoter, function (key, value) {
        if (value.isAcccount == 1) {
            value.isAcccount = "Yes";
        }
        else {
            value.isAcccount = "No";
        }

        if (value.accountNumber == null || value.accountNumber == '') {
            value.accountNumber = '-';
        }
        if (value.isPromoter == 1) {

            $('.tbl_view_promoters tbody').append('<tr><td>' + value.promoter_Name + '</td><td>' + value.promoter_Type + '</td><td>' + value.isAcccount + '</td><td>' + value.accountNumber + '</td></tr>');

        }
        else {
            $('.tbl_view_customer tbody').append('<tr><td>' + value.promoter_Name + '</td><td>' + value.relationshipName + '</td><td>' + value.relationshipWith + '</td><td>' + value.isAcccount + '</td><td>' + value.accountNumber + '</td></tr>');
            //AddNewCustomerRow(value.promoter_Name, value.relationshipName, value.relationshipWith,
            //    value.promoter_Type, value.isAcccount, value.accountNumber, value.promoter_ID);
        }

    });


    if (response.tbl_auditlog.length > 0) {
        $(".tbl_view_auditTrail").show();
        $(".tbl_view_auditTrail tbody>tr").remove();
        $.each(response.tbl_auditlog, function (key, value) {

            $('.tbl_view_auditTrail tbody').append('<tr><td>' + value.username + '</td><td>' + value.user_role + '</td><td>' + value.actiontaken + '</td><td>' + value.remark + '</td><td>' + value.date + '</td></tr>');

        });
    }
    else {
        $(".tbl_view_auditTrail").hide();
    }



}



function LoadAssetPricingForView_IP(response, CustomerId) {


    var CustomerInfo = response.tbL_Asset_Pricing_Customer_Info;
    var IsPSL = CustomerInfo[0].psl;
    var PSLType = CustomerInfo[0].pslType;
    if (IsPSL == 1) {
        $("#lbl_IsPSL_view").text("Yes")
        //$(".lbl_AP_pslClassification").text(PSLType);
        $("#lbl_AP_pslClassification_view").text("small");
    }
    else {
        $("#lbl_IsPSL_view").text("No")
        $("#lbl_AP_pslClassification").text(PSLType);
    }

    var Weakersection = CustomerInfo[0].isWeakerSection;
    if (Weakersection == 1) {
        $("#lbl_AP_weakerSection_view").text("Yes")

    }
    else {
        $("#lbl_AP_weakerSection_view").text("No")
    }

    var IsFTB = CustomerInfo[0].isFTB;
    if (IsFTB == 1) {
        $("#lbl_AP_FTB_view").text("Yes")
    }
    else {
        $("#lbl_AP_FTB_view").text("No")
    }


    $("#lbl_AP_approvalNo_view").text(CustomerInfo[0].request_Number);





    $("#tbl_view_facilityDetails_view tbody>tr").remove();

    $.each(response.tbL_Facility_Details, function (key, value) {
        if (value.existingAmount == null || value.existingAmount == '' || value.existingAmount == undefined) {
            value.existingAmount = '-';
        }
        const result = value.proposedPrice.split('-');
        var priceOne = result[0];
        var priceTwo = result[1];
        if (priceOne == '' || priceOne == undefined) {
            priceOne = ''
        }
        if (priceTwo == '' || priceTwo == undefined) {
            priceTwo = ''
        }

        if (value.existingPrice == null || value.existingPrice == '' || value.existingPrice == undefined) {
            value.existingPrice = '-';
        }
        if (value.fileName != '' || value.fileName != null || value.fileName != undefined) {
            $('#tbl_view_facilityDetails_view tbody').append('<tr><td>' + value.facilityType + '</td><td>' + value.existingAmount + '</td><td>' + value.proposedAmount + '</td><td>' + value.existingPrice + '</td><td>' + priceOne + '% i.e spread of ' + priceTwo + '% linked to ' + value.instruction + '</td><td><input type="text" value="' + value.fileName + '" hidden class="facilityViewImg" /><a class="View_WS_Cal_Image link"><i class="fa fa-eye"></i></a></td></tr>');
        }
        else {
            $('#tbl_view_facilityDetails_view tbody').append('<tr><td>' + value.facilityType + '</td><td>' + value.existingAmount + '</td><td>' + value.proposedAmount + '</td><td>' + value.existingPrice + '</td><td>' + priceOne + '% i.e spread of ' + priceTwo + '% linked to ' + value.instruction + '</td><td> - </td></tr>');
        }



    });
    //if (response.tbl_facilityimage.length > 0) {
    //    $(".facilityImage").show();
    //    $(".facilityImage").attr("src", "../FacilityFiles/" + response.tbl_facilityimage[0].fileName);
    //}
    //else {
    //    $(".facilityImage").hide();
    //}


    $("#tbl_view_otherCharges_view tbody>tr").remove();
    $.each(response.tbL_Other_Charges, function (key, value) {
        if (value.existingPrice == null || value.existingPrice == '' || value.existingPrice == undefined) {
            value.existingPrice = '-';
        }
        $('#tbl_view_otherCharges_view tbody').append('<tr><td>' + value.chargeType + '</td><td>' + value.existingPrice + '</td><td>' + value.proposedPrice + '</td></tr>');

    });

    $("#tbl_view_collateralDetails_view tbody>tr").remove();
    $.each(response.tbL_Collateral_Details, function (key, value) {
        $('#tbl_view_collateralDetails_view tbody').append('<tr><td>' + value.securityType + '</td><td>' + value.securityDescription + '</td><td>' + value.securityOwner + '</td><td>' + value.securityValue + '</td></tr>');

    });

    $("#tbl_view_multipleBanking_view tbody>tr").remove();
    var IsMultipleBanking = CustomerInfo[0].isMultipleBanking;
    if (IsMultipleBanking == 1) {
        $("#lbl_multipleBank_view").text("Yes");
        //lbl_multipleBank.innerText = "Yes";
        $("#tbl_view_multipleBanking_view").show();
        $.each(response.tbL_MultipleBanks, function (key, value) {

            $('#tbl_view_multipleBanking_view tbody').append('<tr><td>' + value.facilityType + '</td><td>' + value.bankName + '</td><td>' + value.sanctioned + '</td><td>' + value.roi + '</td></tr>');

        });
    }
    else {
        $("#lbl_multipleBank_view").text("No");
        //lbl_multipleBank.innerText = "No";
        $("#tbl_view_multipleBanking_view").hide();
    }





    $("#tbl_view_promoters_view tbody>tr").remove();
    $("#tbl_view_customer_view tbody>tr").remove();
    $.each(response.tbL_Promoter, function (key, value) {
        if (value.isAcccount == 1) {
            value.isAcccount = "Yes";
        }
        else {
            value.isAcccount = "No";
        }

        if (value.accountNumber == null || value.accountNumber == '') {
            value.accountNumber = '-';
        }
        if (value.isPromoter == 1) {

            $('#tbl_view_promoters_view tbody').append('<tr><td>' + value.promoter_Name + '</td><td>' + value.promoter_Type + '</td><td>' + value.isAcccount + '</td><td>' + value.accountNumber + '</td></tr>');

        }
        else {
            $('#tbl_view_customer_view tbody').append('<tr><td>' + value.promoter_Name + '</td><td>' + value.relationshipName + '</td><td>' + value.relationshipWith + '</td><td>' + value.isAcccount + '</td><td>' + value.accountNumber + '</td></tr>');
            //AddNewCustomerRow(value.promoter_Name, value.relationshipName, value.relationshipWith,
            //    value.promoter_Type, value.isAcccount, value.accountNumber, value.promoter_ID);
        }

    });


    if (response.tbl_auditlog.length > 0) {
        $("#tbl_view_auditTrail_view").show();
        $("#tbl_view_auditTrail_view tbody>tr").remove();
        $.each(response.tbl_auditlog, function (key, value) {

            $('#tbl_view_auditTrail_view tbody').append('<tr><td>' + value.username + '</td><td>' + value.user_role + '</td><td>' + value.actiontaken + '</td><td>' + value.remark + '</td><td>' + value.date + '</td></tr>');

        });
    }
    else {
        $("#tbl_view_auditTrail_view").hide();
    }



}

function LoadTradePricingGrid() {

    var Table_TradePricing = '';
    var clientNameID = $("#clientSearch").val();
    const result = clientNameID.split('-');
    var ClientsName = result[0];
    var ClientsID = result[1];
    $.ajax({
        type: "GET",
        url: "/Comercials/GetTradePricingGridData",
        data: null,
        contentType: false,
        // dataType: "json",
        async: false,
        processData: false,
        success: function (response) {

            if (response != null) {
                if (ClientsID != '' && ClientsID != undefined) {
                    var data_filter = response.filter(element => element.clientId == ClientsID.toUpperCase());
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
                Table_TradePricing = $('#Tbl_TradePricing').DataTable({
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
        },
        error: function (xhr, ajaxOptions, thrownError) {
            result = xhr.innerHTML;
        }
    });



    $('#Tbl_TradePricing').on('click', 'tbody tr', function (p) {
        CheckSession();
        var data = {};
        var rowData = Table_TradePricing.row(this).data();
        if (rowData != undefined) {
            enableAccordian();
            //if (rowData.status == 'In Progress') {
            //    $('#TP_DropDown_Level1').prop('disabled', true);
            //    $('#txt_Remark_TradePricing').prop('disabled', true);
            //}
            //else {
            //    $('#TP_DropDown_Level1').prop('disabled', false);
            //    $('#txt_Remark_TradePricing').prop('disabled', false);
            //}
            if (rowData.status == 'Appoved') {
                $(".isEnable").hide();
            } else {
                $(".isEnable").show();
            }
            $('#TP_DropDown_Level1').prop('disabled', false);
            $('#txt_Remark_TradePricing').prop('disabled', false);

            IsCustomersave = true;
            $("#BtnSaveTradePricingDetails").hide();
            $("#txtCutomerName").prop('disabled', true);
            $("#txtPanNo").prop('disabled', true);
            //$('#TP_DropDown_Level1').prop('disabled', true);
            $("#TradePricing_CustomerId").val(rowData.id);
            $("#TradePricing_status").val(rowData.status);

            loadCustomerDetails(rowData.id);
            $('input[name=TradePriceType]').attr("disabled", true);
            LoadAllTradeTables(rowData.id);

            $("#sidebar_tradepricing").addClass('opened')
            $(".side-content").addClass('slideIn');
            document.querySelector('body').style.overflow = 'hidden';
        }
    })
}

function enableDisable_Recipient(checkBoxId, drpId) {
    if ($("#" + checkBoxId).is(':checked')) {
        $('#' + drpId).prop('disabled', false).trigger("chosen:updated");
    } else {
        $('#' + drpId).prop('disabled', true).trigger("chosen:updated");
    }
}

//$(".delete_notification").on("click", function () {
//    debugger;
//});


function fnDelete_AllRowsDetails(Customer_Info_ID, action, sp_name, status) {
    var result = '';
    //var data = { Customer_Info_ID: Customer_Info_ID};
    $.ajax({
        type: "POST",
        url: "/Comercials/DeleteAllTableRows?Customer_Info_ID=" + Customer_Info_ID + "&Identflag=" + action + "&SP_Name=" + sp_name + "&status=" + status,
        dataType: 'json',
        data: null,
        contentType: 'application/json; charset=utf-8',
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

////////  Reversal Approval Sidebar ////////
$("#ReversalApproval_btn_addnew").click(function () {
    CheckSession();
    $("#txt_ReversalComments").text('');
    $("#divCommentsReversal").hide();
    $("#Reversal_status").val('');
    $("#btn_fetchProposalNo").css('display', 'block');
    const d = new Date();
    var month = d.getUTCMonth() + 1;
    month = month.toString().length > 1 ? month : "0" + month;
    var currentDate = d.getDate().toString();


    $("#NewReversalProposal").css('display', 'block');
    $("#UpdateReversalProposal").css('display', 'none')

    EmptyDropdown();
    $("#ReversalApproval_txtProposalNo").prop('disabled', false);
    $("#ReversalApproval_txtProposalNo").val('');
    $("#txt_ReversalJustification").val('');

    $("#ReversalAppoval_CustomerId").val('');

    //AddNewReversalFacility('','','');
    AddNewReversalDetailsRow('', '', '');
    AddNewReversalBreakdownRow('', (currentDate + "/" + month + "/" + d.getUTCFullYear()), (currentDate + "/" + month + "/" + d.getUTCFullYear()), '', '', '', '');
    DisabledReversalFields();
    ClearAllReversalFields();
    //EnabledReversalFields();
    $("#btnAddNewReversalFacility").show();
    $("#btn_addReversalDetails").show();
    $("#btn_addReversalAmtBreakdown").show();
    $("#sidebar_reversalproposal").addClass("opened");
});



function ClearAllReversalFields() {
    $("#lbl_CustomerName").text('');
    $("#lbl_ClientId").text('');
    $("#lblVintage").text('');
    $("#lblRAROC").text('');
    $("#lbl_APRPFY").text('');
    $("#lbl_APRYTD").text('');
    $("#lbl_CTI").text('');
    $("#lbl_Limit").text('');
    $("#TBL_ReversalFacililty").empty();
}
function ClearAllExistingFields() {
    $("#lbl_clientsIdAP").text('');
    $("#lbl_Customer_Name").text('');
    $("#lbl_ProposalNo").text('');
    $("#lbl_RAROC").text('');
    $("#lbl_APR_PFY").text('');
    $("#lbl_APR_YTD").text('');
    $("#lbl_AP_CTI").text('');
    $("#lbl_Vintage").text('');
}


$("#Accountcustomisation_btn_addnew").on("click", function () {
    CheckSession();
    $("#doc_download").hide();
    $("#txt_AccountComments").text('');
    $("#tbl_waiverTemp").hide();
    $("#divCommentsAccount").hide();
    $("#AssetPricing_status").val('');
    $("#createdById").val('');
    $("#AccountPricing_status").val('');
    $("#sidebar_accountcustomization").addClass("opened");
    $("#txt_APRCode").prop('disabled', false);
    $("#AccountCustomization_CustomerId").val('');
    $("#tbl_waiverTemp tbody>tr").remove();
    $("#btnAddWaiver").show();
    $("#btn_save_waiverDetails").show();
    $("#btnAddWaiver").show();
    $("#btn_APR_Details").show();
    enableAccordian();
    EnableAllDropdowns();
    EmptyAllFields();
    AddNewWaiverRow('', '', '', '', '', '');
    ClearWaiverTempRecords();

})


function clearAllAssetpricingFields() {
    $("#tbl_FacilityDetails tbody>tr").remove();
    $("#tbl_FacilityDetails tbody>tr").remove();
    $("#tbl_OtherCharges tbody>tr").remove();
    $("#tbl_ipCollateral tbody>tr").remove();
    $("#tbl_Promoters tbody>tr").remove();
    $("#tbl_customers tbody>tr").remove();
    $("#tbl_MultipleBanking tbody>tr").remove();
    $("#txt_customerName").val('');
    $("#txt_justification").val('');
    ClearAll_AssetPricing_Dropdowns();

}
function AssetPricing_EnableFeilds_Typewise() {
    var CommercialType = $("#ul_commercial_type").find("li > a.active").data('name');
    var CustomerType = $("#ul_customer_type").find("li > a.active").data('name');

    if (CustomerType == "IP" && CommercialType == "Assets Pricing") {
        $("#txt_customerName").prop('disabled', false);
        $("#dv_accordian_customerDetails").hide();
        //$("#accordian_multiplebanking").hide();
        $("#dv_clientid").css('display', 'none')
        $("#dv_customer_name").css('display', 'block');
        $("#dv_ipApprovalNo").css('display', 'none');
        //$("#btn_fetchIP_proposal").css('display', 'none');
        $("#dv_proposalno").css('display', 'none');
        $("#txt_justification").prop('disabled', false);
        enableexisting();
        EnableDropdowns();
    }
    if (CustomerType == "NTB" && CommercialType == "Assets Pricing") {
        $("#AP_ProposalNo").val('');
        $("#AP_Approval_No").val('');
        $("#txt_customerName").prop('disabled', false);
        $("#dv_accordian_customerDetails").hide();
        $("#accordian_multiplebanking").show();
        $("#dv_clientid").css('display', 'none')
        $("#dv_customer_name").css('display', 'block');
        $("#dv_ipApprovalNo").css('display', 'block');
        //$("#btn_fetchIP_proposal").css('display', 'block');
        $("#dv_proposalno").css('display', 'block');
        $("#txt_justification").prop('disabled', false);
        enableexisting();
        EnableDropdowns();
    }
    if (CustomerType == "Existing" && CommercialType == "Assets Pricing") {
        $("#AssetPricing_txtClientId").val('');
        $("#dv_accordian_customerDetails").show();
        $("#accordian_multiplebanking").show();
        $("#dv_clientid").css('display', 'block')
        $("#dv_customer_name").css('display', 'none');
        //$("#btn_fetchIP_proposal").css('display', 'none');
        $("#AssetPricing_txtClientId").prop('disabled', false);
        $("#txt_justification").prop('disabled', false);
        $("#dv_ipApprovalNo").css('display', 'none');
        $("#dv_proposalno").css('display', 'none');
        disableexisting();
        //enableexisting();
        ClearAllExistingFields();
        //DisableDropdowns();


    }
}
function disableexisting() {
    $(".accordion__body").addClass("disable__accordian");
}
function enableexisting() {
    $(".accordion__body").removeClass("disable__accordian");
}



function DisableDropdowns() {
    $('#DropDown_Level1').prop('disabled', true).trigger("chosen:updated");
    $('#DropDown_Level2').prop('disabled', true).trigger("chosen:updated");
    $('#DropDown_Level3').prop('disabled', true).trigger("chosen:updated");
    $('#DropDown_Level4').prop('disabled', true).trigger("chosen:updated");
    $('#DropDown_Level5').prop('disabled', true).trigger("chosen:updated");
    $('#DropDown_Level6').prop('disabled', true).trigger("chosen:updated");
    $('#DropDown_Level7').prop('disabled', true).trigger("chosen:updated");
    $('#DropDown_Level8').prop('disabled', true).trigger("chosen:updated");
}
function EnableDropdowns() {
    $('#DropDown_Level1').prop('disabled', false).trigger("chosen:updated");
    $('#DropDown_Level2').prop('disabled', false).trigger("chosen:updated");
    $('#DropDown_Level3').prop('disabled', false).trigger("chosen:updated");
    $('#DropDown_Level4').prop('disabled', false).trigger("chosen:updated");
    $('#DropDown_Level5').prop('disabled', false).trigger("chosen:updated");
    $('#DropDown_Level6').prop('disabled', false).trigger("chosen:updated");
    $('#DropDown_Level7').prop('disabled', false).trigger("chosen:updated");
    $('#DropDown_Level8').prop('disabled', false).trigger("chosen:updated");
}

function ClearAll_AssetPricing_Dropdowns() {
    $("#DropDown_Level1").val('').trigger('chosen:updated');
    $("#DropDown_Level2").val('').trigger('chosen:updated');
    $("#DropDown_Level3").val('').trigger('chosen:updated');
    $("#DropDown_Level4").val('').trigger('chosen:updated');
    $("#DropDown_Level5").val('').trigger('chosen:updated');
    $("#DropDown_Level6").val('').trigger('chosen:updated');
    $("#DropDown_Level7").val('').trigger('chosen:updated');
    $("#DropDown_Level8").val('').trigger('chosen:updated');
}
/////////////////////////////
function isNumberKey(event) {

    //if ((evt.which != 46 || $(this).val().indexOf('.') != -1) && (evt.which < 48 || evt.which > 57)) {
    //    evt.preventDefault();
    //}

    //var charCode = (evt.which) ? evt.which : evt.keyCode
    //if (charCode > 31 && (charCode < 48 || charCode > 57))
    //    return false;
    //return true;

    //--------------

    //if ((event.which != 46 || $(this).val().indexOf('.') != -1) &&
    //    ((event.which < 48 || event.which > 57) &&
    //    (event.which != 0 && event.which != 8))) {
    //    event.preventDefault();
    //}

    //var text = $(this).val();

    //if ((text.indexOf('.') != -1) &&
    //    (text.substring(text.indexOf('.')).length > 2) &&
    //    (event.which != 0 && event.which != 8) &&
    //    ($(this)[0].selectionStart >= text.length - 2)) {
    //    event.preventDefault();
    //}

    ///------------
    if ((event.which != 46 || $(this).val().indexOf('.') != -1) && (event.which < 48 || event.which > 57)) {
        event.preventDefault();
    }
}
function percentAllow(event) {
    //$("#txtPanNo").val(parseFloat($("#txtPanNo").val(), 10).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,").toString());
    var regex = new RegExp("^[0-9-%.]");
    var key = String.fromCharCode(event.charCode ? event.which : event.charCode);
    //var currentVal = event.currentTarget.value; 
    //event.currentTarget.value = parseFloat(currentVal, 10).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,").toString(); 
    //$("#txtPanNo").val(parseFloat($("#txtPanNo").val(), 10).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,").toString());
    if (!regex.test(key)) {
        event.preventDefault();
    }
}

function blockSpecialChar(e) {
    var k;
    document.all ? k = e.keycode : k = e.which;
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));

}
function isNumberLetterHyphenOnly(evt) {
    var charCode = (evt.which) ? evt.which : evt.keyCode
    if (charCode > 31 && (charCode < 48 || charCode > 57))
        return false;
    return true;
}

function isNumberOnlyKey(evt) {
    var charCode = (evt.which) ? evt.which : evt.keyCode
    if (charCode > 31 && (charCode < 48 || charCode > 57))
        return false;
    return true;
}


$(function TradeAPRCodeValidate() {
    $("#txt_tradeAprcode").keypress(function (e) {
        var keyCode = e.keyCode || e.which;
        var regex = /^[0-9A-Za-z\s\-]+$/;
        var isValid = regex.test(String.fromCharCode(keyCode));
        if (!isValid) {
            return false;
        }
        return true;
    });
});

//$(function PanValidation(e) {
////$("#txtPanNo").change(function (e) {
//    debugger;
//        var keyCode = e.keyCode || e.which;
//        var regex = /^[A-Z]{5}\d{4}[A-Z]$/;
//        var isValid = regex.test(String.fromCharCode(keyCode));
//        if (!isValid) {
//            return false;
//        }
//        return true;
//    //});
//});

function isNumberOnlyKey(evt) {
    var charCode = (evt.which) ? evt.which : evt.keyCode
    if (charCode > 31 && (charCode < 48 || charCode > 57))
        return false;
    return true;
}

function isCharOnlyKey(evt) {
    var key = evt.keyCode;
    if ((key >= 48 && key <= 57)) {
        evt.preventDefault();
    }
}


function enableAccordian() {
    $(".accordion__body").removeClass("disable__accordian");
}
function disableAccordian() {
    $(".accordion__body").addClass("disable__accordian");
}