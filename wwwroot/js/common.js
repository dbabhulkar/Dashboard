
//document.querySelector('.community-search').addEventListener('focus', function () {
//    document.querySelector('.line').classList.add('active');
//});

//document.querySelector('.community-search').addEventListener('blur', function () {
//    document.querySelector('.line').classList.remove('active');
//});


$(document).ready(function () {
    //var as = (1000000).toLocaleString("en");

    const dt = new Date();
    const FullmonthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    $("#month").val(FullmonthNames[dt.getMonth()]);
    var todayDate = new Date()
    var currentmonth = todayDate.getMonth() + 1;
    var currentYear = todayDate.getUTCFullYear();

    $("#divUploadedDate").hide();


    $('#month').datepicker({
        format: "MM",
        startView: "months",
        minViewMode: "months",
        todayHighlight: true,
        endDate: currentmonth.toString()
    }).on('changeDate', function (e) {
        var ProposaDate = new Date()
        var currentmonth = ProposaDate.getMonth() + 1;
        GetAquisitionDetails();
    });
    $("#year").val(dt.getUTCFullYear());
    $('#year').datepicker({
        format: "yyyy",
        viewMode: "years",
        minViewMode: "years",
        auto: true,
        todayHighlight: true,
        endDate: currentYear.toString()
    }).on('changeDate', function (e) {
        GetAquisitionDetails();
    });
    GetAquisitionDetails();
    $('input[name=MTD_YTD]').change(function () {
        GetAquisitionDetails();
    })
    if ($("#clientSearch").val() == '') {
        $("#btnClearSearch").css("display", "none");
    }
    else {
        $("#btnClearSearch").css("display", "block");
    }

    $('#txt_proposalNo').on('input propertychange', function () {
        charLimitReversalProposalNo(this, 12);
    });
    $('#txt_ac_proposalNumber').on('input propertychange', function () {
        charLimitACProposalNo(this, 12);
    });
    $('#ReversalApproval_txtProposalNo').on('input propertychange', function () {
        charLimitProposalNo(this, 12);
    });
    $('#txt_subject').on('input propertychange', function () {
        charLimitSubject(this, 500);
    });
    $('#txt_msg').on('input propertychange', function () {
        charLimit(this, 1000);
    });
    function charLimitACProposalNo(input, maxChar) {
        var len = $(input).val().length;
        if (len > maxChar) {
            $(input).val($(input).val().substring(0, maxChar));
            $('#ACProposalNolength').css('display', 'block');
            $('#txt_ac_proposalNumber').addClass('alertBorder');
        }
        else {
            $('#txt_ac_proposalNumber').removeClass('alertBorder')
            $('#ACProposalNolength').css('display', 'none');
        }
    }
    function charLimitReversalProposalNo(input, maxChar) {
        var len = $(input).val().length;
        if (len > maxChar) {
            $(input).val($(input).val().substring(0, maxChar));
            $('#ProposalNolength').css('display', 'block');
            $('#txt_proposalNo').addClass('alertBorder');
        }
        else {
            $('#txt_proposalNo').removeClass('alertBorder')
            $('#ProposalNolength').css('display', 'none');
        }
    }
    function charLimitProposalNo(input, maxChar) {
        var len = $(input).val().length;
        if (len > maxChar) {
            $(input).val($(input).val().substring(0, maxChar));
            $('#ProposalNoMaxLen').css('display', 'block');
            $('#ReversalApproval_txtProposalNo').addClass('alertBorder');
        }
        else {
            $('#ReversalApproval_txtProposalNo').removeClass('alertBorder')
            $('#ProposalNoMaxLen').css('display', 'none');
        }
    }

    function charLimit(input, maxChar) {
        var len = $(input).val().length;
        if (len > maxChar) {
            $(input).val($(input).val().substring(0, maxChar));
            $('#msg_maxLength').text('Maximum 1000 characters allowed');
            $('#msg_maxLength').addClass('alertColor');
            $('#txt_msg').addClass('alertBorder');
        }
        else {
            $('#txt_msg').removeClass('alertBorder');
            $('#msg_maxLength').removeClass('alertColor');
        }
    }
    function charLimitSubject(input, maxChar) {
        var len = $(input).val().length;
        if (len > maxChar) {
            $(input).val($(input).val().substring(0, maxChar));
            $('#subjectMaxLen').text('Maximum 500 characters allowed');
            $('#subjectMaxLen').addClass('alertColor');
            $('#txt_subject').addClass('alertBorder');

        }
        else {
            $('#txt_subject').removeClass('alertBorder');
            $('#subjectMaxLen').removeClass('alertColor');
        }
    }

    //SearchText();
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "July", "Aug", "Sept", "Oct", "Nov", "Dec"
    ];
    const d = new Date();
    var duedate = monthNames[d.getMonth()] + " " + d.getDate().toString();
    $("#urgentbulletine_dueDate").text(duedate);
    $("#btn_fetchclientId").on('click', function (e) {
        CheckSession();
        if ($("#AssetPricing_txtClientId").val() == '') {
            toastr.error("Please enter Client Id");
        }
        else {

            //var CustomerType = $("#ul_customer_type").find("li > a.active").data('name');
            var IsClientExist = CheckClientIdInProgress($("#AssetPricing_txtClientId").val());
            if (IsClientExist == false) {
                getAPRSCount("AssetPricing");
                GetFacilityDetails("AssetPricingExisting", $("#AssetPricing_txtClientId").val());
            }
            else {
                toastr.error('Client Id ' + $("#AssetPricing_txtClientId").val() + ' is already in process');
                $("#AssetPricing_txtClientId").val('');
                return;
            }

        }
    });


    $("#btn_fetchProposalNo").on('click', function (e) {
        CheckSession();
        if ($("#ReversalApproval_txtProposalNo").val() == '') {
            toastr.error("Please enter Proposal Number");
        }
        else {
            getAPRSCount("ReversalApproval");
            GetFacilityDetails("ReversalApproval", $("#ReversalApproval_txtProposalNo").val());
        }
    });

    //$('#NotificationDropdown').on('hidden.bs.dropdown', function (e) {
    //    debugger;
    //    GetNotificationDetails("GetCount");
    //})
    GetNotificationDetails("GetCount");
    GetBulletinCount();
    $("#btnShowNotification").on('click', function (e) {
        CheckSession();
        GetNotificationDetails("GetAllNotifications");
    });
    $('#notification').on('hidden.bs.modal', function () {

        GetNotificationDetails("GetCount");
    })
    $('#ToDoModel').on('hidden.bs.modal', function () {

        $("#tbl_all_todo tbody>tr").remove();
    })
    $("#viewToDo").on('click', function (e) {
        CheckSession();
        //generateBulletinList();
        GenerateToDoList();

    });
    $("#btn_read_bulletin").on('click', function (e) {
        CheckSession();
        generateBulletinList();

    });

    $("#clientSearch").on("keypress click input", function () {

        if ($("#clientSearch").val() == '') {
            $("#btnClearSearch").css("display", "none");
        }
        else {
            $("#btnClearSearch").css("display", "block");
        }
    });


    //$("#AssetPricing_txtClientId")
    //    .focusout(function (e) {
    //        getAPRSCount("AssetPricing");
    //    });

    //$("#ReversalApproval_txtProposalNo").focusout(function (e) {

    //    getAPRSCount("ReversalApproval");
    //    GetFacilityDetails("ReversalApproval", $("#ReversalApproval_txtProposalNo").val());

    //});

    ///////////// Pagination //////////////

    //$("#Tbl_IPLeads").DataTable({
    //    "ordering": false,
    //    "paging": true,
    //    "info": false,
    //    "searching": false,
    //    "fixedHeader": true,
    //    "responsive": true,
    //    "destroy": true,
    //    "processing": true,
    //});

    //$("#TBL_ReversalApproval").DataTable({
    //    "ordering": false,
    //    "paging": true,
    //    "info": false,
    //    "searching": false,
    //    "fixedHeader": true,
    //    "responsive": true,
    //    "destroy": true,
    //    "processing": true,
    //});

    function getPagination(table) {

        var lastPage = 1;

        $('.maxRows')
            .on('change', function (evt) {

                lastPage = 1;
                $('.pagination')
                    .find('li')
                    .slice(1, -1)
                    .remove();
                var trnum = 0; // reset tr counter
                var maxRows = parseInt($(this).val()); // get Max Rows from select option

                if (maxRows == 5000) {
                    $('.pagination').hide();
                } else {
                    $('.pagination').show();
                }

                var totalRows = $(table + ' tbody tr').length; // numbers of rows
                $(table + ' tr:gt(0)').each(function () {
                    trnum++; // Start Counter
                    if (trnum > maxRows) {
                        $(this).hide(); // fade it out
                    }
                    if (trnum <= maxRows) {
                        $(this).show();
                    }
                });
                if (totalRows > maxRows) {
                    var pagenum = Math.ceil(totalRows / maxRows); // ceil total(rows/maxrows) to get ..
                    for (var i = 1; i <= pagenum;) {
                        $('.pagination #prev')
                            .before(
                                '<li data-page="' +
                                i +
                                '">\
                                      <span>' +
                                i++ +
                                '<span class="sr-only">(current)</span></span>\
                                    </li>'
                            )
                            .show();
                    } // end for i
                } // end if row count > max rows
                $('.pagination [data-page="1"]').addClass('active'); // add active class to the first li
                $('.pagination li').on('click', function (evt) {
                    evt.stopImmediatePropagation();
                    evt.preventDefault();
                    var pageNum = $(this).attr('data-page'); // get it's number

                    var maxRows = parseInt($('#maxRows').val()); // get Max Rows from select option

                    if (pageNum == 'prev') {
                        if (lastPage == 1) {
                            return;
                        }
                        pageNum = --lastPage;
                    }
                    if (pageNum == 'next') {
                        if (lastPage == $('.pagination li').length - 2) {
                            return;
                        }
                        pageNum = ++lastPage;
                    }

                    lastPage = pageNum;
                    var trIndex = 0; // reset tr counter
                    $('.pagination li').removeClass('active'); // remove active class from all li
                    $('.pagination [data-page="' + lastPage + '"]').addClass('active'); // add active class to the clicked
                    limitPagging();
                    $(table + ' tr:gt(0)').each(function () {
                        trIndex++; // tr index counter
                        if (
                            trIndex > maxRows * pageNum ||
                            trIndex <= maxRows * pageNum - maxRows
                        ) {
                            $(this).hide();
                        } else {
                            $(this).show();
                        } //else fade in
                    }); // end of for each tr in table
                }); // end of on click pagination list
                limitPagging();
            })
            .val(5)
            .change();

    }

    function limitPagging() {

        if ($('.pagination li').length > 7) {
            if ($('.pagination li.active').attr('data-page') <= 3) {
                $('.pagination li:gt(5)').hide();
                $('.pagination li:lt(5)').show();
                $('.pagination [data-page="next"]').show();
            } if ($('.pagination li.active').attr('data-page') > 3) {
                $('.pagination li:gt(0)').hide();
                $('.pagination [data-page="next"]').show();
                for (let i = (parseInt($('.pagination li.active').attr('data-page')) - 2); i <= (parseInt($('.pagination li.active').attr('data-page')) + 2); i++) {
                    $('.pagination [data-page="' + i + '"]').show();

                }

            }
        }
    }

});

function SelectedFileTypeIndexChanged(event) {
    $("#UploadedDate").val('');
    $("#divUploadedDate").hide();
    if (event.value == "1" || event.value == "12" || event.value == "13" || event.value == "15") {
        $("#divUploadedDate").show();
    }
}


function GetAquisitionDetails() {

    $("#tbl_asset tbody>tr").remove();
    $("#tbl_liability tbody>tr").remove();

    var ACQ_Month = getMonthFromString($("#month").val());
    var ACQ_Year = $("#year").val();
    var MTD_YTD_Val = $("input[type='radio'][name='MTD_YTD']:checked").val()
    $.ajax({
        type: "GET",
        url: "/Home/GetAquisitionData?Month=" + ACQ_Month + "&Year=" + ACQ_Year + "&MTD_YTD=" + MTD_YTD_Val,
        data: null,
        contentType: false,
        async: false,
        processData: false,
        success: function (response) {

            $("#tbl_asset tbody>tr").remove();
            $("#tbl_liability tbody>tr").remove();

            if (response.tbl_asset.length != null) {
                var Response_col = [];
                for (var i = 0; i < 1; i++) {
                    for (var key in response.tbl_asset[i]) {
                        if (Response_col.indexOf(key) === -1) {
                            var columnArray = {};
                            columnArray.data = key;
                            columnArray.title = key.toUpperCase();
                            Response_col.push(columnArray);
                        }
                    }
                }
                $("#tbl_asset").DataTable({
                    data: response.tbl_asset,
                    columns: Response_col,
                    "columnDefs": [{
                        "targets": [0],
                        "searchable": false,
                        "orderable": false,


                    },
                    { width: 100, targets: 0 },
                    { width: 80, targets: 1 },
                    { width: 80, targets: 2 },
                    { "className": "d-none", targets: 3 }
                    ],
                    "ordering": false,
                    "paging": false,
                    "info": false,
                    "searching": false,
                    fixedHeader: true,
                    responsive: true,
                    destroy: true,
                    "processing": true,
                    "width": '100px'
                });
            }



            if (response.tbl_liability != null) {

                var Response_col = [];
                for (var i = 0; i < 1; i++) {
                    for (var key in response.tbl_liability[i]) {
                        if (Response_col.indexOf(key) === -1) {
                            var columnArray = {};
                            columnArray.data = key;
                            columnArray.title = key.toUpperCase();
                            Response_col.push(columnArray);
                        }
                    }
                }
                $("#tbl_liability").DataTable({
                    data: response.tbl_liability,
                    columns: Response_col,
                    "columnDefs": [{
                        "targets": [0],
                        "searchable": false,
                        "orderable": false,
                    },
                    { width: 100, targets: 0 },
                    { width: 80, targets: 1 },
                    { width: 80, targets: 2 },
                    { "className": "d-none", targets: 3 }
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
            $("#AquisitionUploadedDate").text('');
            if (response.tbl_asset.length > 0) {
                $("#AquisitionUploadedDate").text("Data as of " + response.tbl_asset[0].uploadedDate);
            } else {
                if (response.tbl_liability.length > 0) {
                    $("#AquisitionUploadedDate").text("Data as of " + response.tbl_liability[0].uploadedDate);
                }
            }

            if (response.tbl_SFR_SAL_A.length > 0) {
                $("#lblSFR").show();
                $("#lblSAL").show();
                $("#lblSFRVal").text(response.tbl_SFR_SAL_A[0].sfr);
                $("#lblSALVal").text(response.tbl_SFR_SAL_A[0].saL_A);
            } else {
                $("#lblSFR").hide();
                $("#lblSAL").hide();
            }


            //if (response.tbl_asset!=null) {
            //    var Response_col_1 = [];
            //    for (var i = 0; i < 1; i++) {
            //        for (var key in response.tbl_asset[i]) {
            //            if (Response_col_1.indexOf(key) === -1) {
            //                var columnArray = {};
            //                columnArray.data = key;
            //                columnArray.title = key.toUpperCase();
            //                Response_col_1.push(columnArray);
            //            }
            //        }
            //    }
            //    $("#tbl_asset").DataTable({
            //        data: response.tbl_asset,
            //        columns: Response_col_1,
            //        "columnDefs": [{
            //            "targets": [0],
            //            "searchable": false,
            //            "orderable": false,
            //        }
            //        ],
            //        "ordering": false,
            //        "paging": false,
            //        "info": false,
            //        "searching": false,
            //        fixedHeader: true,
            //        responsive: true,
            //        destroy: true,
            //        "processing": true,
            //    });
            //}

            //if (response.tbl_liability != null) {
            //    var Response_col = [];
            //    for (var i = 0; i < 1; i++) {
            //        for (var key in response.tbl_liability[i]) {
            //            if (Response_col.indexOf(key) === -1) {
            //                var columnArray = {};
            //                columnArray.data = key;
            //                columnArray.title = key.toUpperCase();
            //                Response_col.push(columnArray);
            //            }
            //        }
            //    }
            //    $("#tbl_liability").DataTable({
            //        data: response.tbl_liability,
            //        columns: Response_col,
            //        "columnDefs": [{
            //            "targets": [0],
            //            "searchable": false,
            //            "orderable": false,
            //        }
            //        ],
            //        "ordering": false,
            //        "paging": false,
            //        "info": false,
            //        "searching": false,
            //        fixedHeader: true,
            //        responsive: true,
            //        destroy: true,
            //        "processing": true,
            //    });
            //}
        },
        error: function (xhr, ajaxOptions, thrownError) {
            result = xhr.innerHTML;
        }
    });
}

function getMonthFromString(mon) {

    var d = Date.parse(mon + "1, 2012");
    if (!isNaN(d)) {
        return new Date(d).getMonth() + 1;
    }
    return -1;
}

//$(function () {
//    debugger;
//    var a = $("#clientSearch").val();
//    $("#clientSearch").autocomplete({

//        source: function (request, response) {
//            $.ajax({
//                url: 'Get_Master_Search_Data',
//                data: "{'prefix': '" + request.term + "'}",
//                dataType: "json",
//                type: "POST",
//                contentType: "application/json; charset=utf-8",
//                success: function (data) {
//                    response($.map(data, function (item) {
//                        return item;
//                    }))
//                },
//                error: function (response) {
//                    alert(response.responseText);
//                },
//                failure: function (response) {
//                    alert(response.responseText);
//                }
//            });
//        },
//        select: function (e, i) {
//            $("#hfCustomer").val(i.item.val);
//        },
//        minLength: 1
//    });
//});


//$("#clientSearch").on("keyup click input", function (){

//    $("#clientSearch").autocomplete({
//        source: function (request, response) {

//            var txtVal = $("#clientSearch").val();
//            $.ajax({

//                url: 'AutoComplete?prefix=' + txtVal,
//                    //data: "{'prefix': '" + txtVal + "'}",
//                    dataType: "json",
//                    type: "POST",
//                    contentType: "application/json; charset=utf-8",
//                success: function (data) {
//                    debugger;
//                        response($.map(data, function (item) {
//                            return item;
//                        }))
//                    },
//                    error: function (response) {
//                        alert(response.responseText);
//                    },
//                    failure: function (response) {
//                        alert(response.responseText);
//                    }
//                });
//            },
//            select: function (e, i) {
//                $("#hfCustomer").val(i.item.val);
//            },
//            minLength: 1
//        });
//});

$(function () {

    //if (txtVal.length > 3)
    $("#clientSearch").autocomplete({
        //source:["abc","asgd"]
        source: function (request, response) {
            var txtVal = $("#clientSearch").val();
            if (txtVal.length > 0) {
                $.ajax({
                    url: 'AutoComplete?prefix=' + txtVal,
                    dataType: "json",
                    type: "GET",
                    contentType: "application/json; charset=utf-8",
                    success: function (data) {
                        var s = [];
                        if (data.length > 0) {
                            var responseData = data.split(",");
                            //return responseData;

                            $.each(responseData, function (key, value) {

                                s.push(value)

                            });
                        }
                        else {
                            s = ["No data available"];
                        }

                        response(s);

                    },
                    error: function (response) {
                        alert(response.responseText);
                    },
                    failure: function (response) {
                        alert(response.responseText);
                    }
                });
            }

        },
        select: function (e, i) {
            $("#hfCustomer").val(i.item.val);
        },
        minLength: 1
    });


});


function GetFacilityDetails(Type, ProposalNo) {

    var FacilityTable = '';

    if (ProposalNo != undefined && ProposalNo != '') {
        $.ajax({
            type: "GET",
            url: "/Comercials/Get_FacilityDetails?LsId=" + ProposalNo + "&Type=" + Type,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {

                if (response != null && response.length > 0) {
                    if (Type == 'ReversalApproval') {
                        $.each(response, function (key, value) {
                            AddNewReversalFacility(value.producT_NAME, value.exisT_LIMIT, '');
                        });
                        //var col = [];
                        //for (var i = 0; i < 1; i++) {
                        //    for (var key in response[i]) {
                        //        if (col.indexOf(key) === -1) {
                        //            var columnArray = {};
                        //            columnArray.data = key;
                        //            columnArray.title = key.toUpperCase();
                        //            col.push(columnArray);
                        //        }
                        //    }
                        //}

                        //FacilityTable = $('#TBL_ReversalFacililty').DataTable({
                        //    data: response,
                        //    columns: [{ data: 'producT_NAME', title: 'Facility Details' },
                        //    { data: 'exisT_LIMIT', title: 'Amount in Lacs' },
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
                    }
                    else {

                        $.each(response, function (key, value) {
                            AddNewFacilityRow(value.producT_NAME, value.exisT_LIMIT,
                                value.proposeD_LIMIT, '',
                                '', '', '', '', '');
                        });

                    }

                }
                else {
                    AddNewFacilityRow('', '', '', '', '', '', '', '', '');
                    AddNewReversalFacility('', '', '');
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                result = xhr.innerHTML;
            }
        });
    }
}

function CheckClientIdInProgress(clientId) {

    var IsClientIdExist = false;

    $.ajax({
        type: "GET",
        url: "/Comercials/CheckClientIdInProgress?clientId=" + clientId,
        data: null,
        contentType: false,
        // dataType: "json",
        async: false,
        processData: false,
        success: function (response) {
            if (response != null) {
                if (response.length > 0) {
                    IsClientIdExist = true
                }
                else {
                    IsClientIdExist = false;
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            event.preventDefault();
        }
    });
    return IsClientIdExist;
}

function getAPRSCount(Type) {


    //if (c == false) {
    //    window.location.href = "../Common/SessionExpiry";
    //    return;
    //}
    var LsId = '';
    if (Type == 'AssetPricing') {
        LsId = $("#AssetPricing_txtClientId").val();
    }
    else if (Type == 'ReversalApproval') {
        LsId = $("#ReversalApproval_txtProposalNo").val();
    }
    else if (Type == 'TradePricing') {
        LsId = $("#txt_tradeAprcode").val();
    }
    else {
        LsId = $("#txt_APRCode").val();
    }

    if (LsId != undefined && LsId != '') {
        $.ajax({
            type: "GET",
            url: "/Comercials/Get_APRSCount?LsId=" + LsId + "&Type=" + Type,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {

                if (response != null && response.length > 0) {
                    if (Type == 'AssetPricing') {
                        $("#lbl_clientsIdAP").text(response[0].clientS_NO);
                        $("#lbl_RAROC").text(response[0].raroc);
                        $("#lbl_APR_PFY").text(response[0].apR_PFY);
                        $("#lbl_APR_YTD").text(response[0].apR_YTD);
                        $("#lbl_AP_CTI").text(response[0].cti);
                        $("#lbl_Vintage").text(response[0].vintage);
                        $("#lbl_Customer_Name").text(response[0].clientS_NAME);
                        $("#lbl_ProposalNo").text(response[0].proposaL_NO);
                        $("#txt_justification").prop('disabled', false);
                        $("#AssetPricing_txtClientId").prop('disabled', true);
                        EnableDropdowns();
                        enableexisting();
                    }
                    else if (Type == 'ReversalApproval') {
                        //$(".reversalCustomerDetails").show();
                        EnabledReversalFields();
                        $("#lbl_CustomerName").text(response[0].clientS_NAME);
                        $("#lbl_ClientId").text(response[0].clientS_NO);
                        $("#lblVintage").text(response[0].vintage);
                        $("#lblRAROC").text(response[0].raroc);
                        $("#lbl_APRPFY").text(response[0].apR_PFY);
                        $("#lbl_APRYTD").text(response[0].apR_YTD);
                        $("#lbl_CTI").text(response[0].cti);
                        $("#lbl_Limit").text(response[0].limit);
                        $("#ReversalApproval_txtProposalNo").prop('disabled', true);

                    }
                    else if (Type == 'TradePricing') {

                        $("#accordian_customerdetails").css('display', 'block');
                        $("#txtCutomerName").val(response[0].clientS_NAME);
                        $("#lbl_trade_proposalNo").text(response[0].proposalNumber);
                        $("#lbl_trade_APRPFY").text(response[0].apR_PFY);
                        $("#lbl_trade_APRYTD").text(response[0].apR_YTD);
                        $("#lbl_trade_Vintage").text(response[0].vintage);
                        $("#lbl_trade_clientId").text(response[0].clientid);
                    }
                    else {
                        $("#txt_PFY").val(response[0].apR_PFY);
                        $("#txt_YTD").val(response[0].apR_YTD);
                        $("#txt_ClientId_AC").val(response[0].clientid);
                        $("#txt_AC_CustomerName").val(response[0].clientS_NAME);
                        //$("#txt_APRCode").prop('disabled', true);
                    }

                }
                else {
                    if (Type == 'AssetPricing') {
                        toastr.error("There is no detail available for this Client Id");
                        $('#AssetPricing_txtClientId').val('');
                    }
                    else if (Type == 'ReversalApproval') {
                        toastr.error("There is no detail available for this Proposal Number");
                        $('#ReversalApproval_txtProposalNo').val('');
                    }
                    else {
                        $('#txt_APRCode').val('');
                        $('#txt_PFY').val('');
                        $('#txt_YTD').val('');
                        $('#txt_ClientId_AC').val('');
                        $('#txt_AC_CustomerName').val('');
                        toastr.error("There is no detail available for this APR Code");
                    }
                    //$("#lbl_RAROC").text('');
                    //$("#lbl_APR_PFY").text('');
                    //$("#lbl_APR_YTD").text('');
                    //$("#lbl_Vintage").text('');
                    //$("#lbl_CustomerName").text('');
                    //$("#lbl_ProposalNumber").text('');
                    //$("#lblVintage").text('');
                    //$("#lblRAROC").text('');
                    //$("#lbl_APRPFY").text('');
                    //$("#lbl_APRYTD").text('');
                    //$("#lbl_CTI").text('');
                    //$("#lbl_Limit").text('');
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {

                event.preventDefault();
            }
        });
    }
}


$("#btnClearSearch").on('click', function (e) {
    //location.reload(true);

    $("#clientSearch").val('');
    AddRemoveClientNameToSession($("#clientSearch").val(), 'removeSession');
    ////-----Asset Pricing---------
    var TodayDate = new Date();
    var tMonth = TodayDate.getMonth() + 1;
    tMonth = tMonth.toString().length > 1 ? tMonth : "0" + tMonth;

    LoadAssetPricingGrid('IP', 'Tbl_IPLeads', tMonth, parseInt(TodayDate.getFullYear()), 0);
    LoadAssetPricingGrid('NTB', 'Tbl_NTBLeads', tMonth, parseInt(TodayDate.getFullYear()), 0);
    LoadAssetPricingGrid('Existing', 'Tbl_ExistingLeads', tMonth, parseInt(TodayDate.getFullYear()), 0);

    ////-----Reversal Approval--------
    LoadReversalApprovalGrid(0, 0);
    ////----Account Customisation-------
    LoadAccountCustomisationGrid(0, 0);
    LoadTradePricingGrid();

    $("#btnClearSearch").hide();

});
$(".close-btn").on('click', function (e) {
    $(".modal-backdrop").removeClass("modal-backdrop");
});
$("#BtnMasterSearch").on('click', function (e) {
    CheckSession();
    var clientNameID = $("#clientSearch").val().trim();
    if (clientNameID == "") {
        toastr.error("Please enter client ID or Name");
    }
    else {
        AddRemoveClientNameToSession($("#clientSearch").val().trim(), 'addSession');
        const result = clientNameID.split('-');
        var ClientsName = result[0].trim();
        var ClientsID = result[1].trim();
        ////-----Reversal Approval--------
        LoadReversalApprovalGrid(0, ClientsID);

        ////-----Asset Pricing---------

        var TodayDate = new Date();
        var tMonth = TodayDate.getMonth() + 1;
        tMonth = tMonth.toString().length > 1 ? tMonth : "0" + tMonth;

        LoadAssetPricingGrid('IP', 'Tbl_IPLeads', tMonth, parseInt(TodayDate.getFullYear()), ClientsID);
        LoadAssetPricingGrid('NTB', 'Tbl_NTBLeads', tMonth, parseInt(TodayDate.getFullYear()), ClientsID);
        LoadAssetPricingGrid('Existing', 'Tbl_ExistingLeads', tMonth, parseInt(TodayDate.getFullYear()), ClientsID);
        LoadTradePricingGrid();

        ////----Account Customisation-------

        LoadAccountCustomisationGrid(0, ClientsID);
    }
});


$(function () {
    $("#btnSubmit").on('click', function (e) {
        CheckSession();
        var fileName = "";
        var data = {};
        var id = document.getElementById("FileType").value;


        if (id == 0) {
            toastr.error("Select File Type");
            //swal('Warning', 'Select File Type', 'error');
        }
        if (id == 1) {
            window.location.href = "/Upload/DownloadFile?fileName=Portfolio Upload.csv";

            //window.location = '@Url.Action("DownloadFile", "Upload", new { fileName =  "Portfolio file Template.csv" })';
            toastr.success("File Downloaded successfully");
            //swal('Success', 'File Download!', 'success');
        }
        else if (id == 2) {
            window.location.href = "/Upload/DownloadFile?fileName=APRs Upload.csv";
            // window.location = '@Url.Action("DownloadFile", "Upload", new { fileName =  "APR_File Template.csv" })';
            toastr.success("File Downloaded successfully");
        }
        else if (id == 3) {
            window.location.href = "/Upload/DownloadFile?fileName=RM Hierarchy Mapping Upload.csv";
            //window.location = '@Url.Action("DownloadFile", "Upload", new { fileName =  "RM Hierarchy Mapping Template.csv" })';
            toastr.success("File Downloaded successfully");
        }
        else if (id == 4) {
            window.location.href = "/Upload/DownloadFile?fileName=Client RM Mapping Upload.csv";
            //window.location = '@Url.Action("DownloadFile", "Upload", new { fileName =  "Client RM Mapping Template.csv" })';
            toastr.success("File Downloaded successfully");
        }
        else if (id == 5) {
            window.location.href = "/Upload/DownloadFile?fileName=Fresh Leads Upload.csv";
            toastr.success("File Downloaded successfully");
        }
        else if (id == 6) {
            window.location.href = "/Upload/DownloadFile?fileName=AssetPricing_APR_Upload.csv";
            toastr.success("File Downloaded successfully");
        }
        else if (id == 7) {
            window.location.href = "/Upload/DownloadFile?fileName=Facility Master.csv";
            toastr.success("File Downloaded successfully");
        }
        else if (id == 10) {
            window.location.href = "/Upload/DownloadFile?fileName=Facility Instruction Master.csv";
            toastr.success("File Downloaded successfully");
        }
        else if (id == 11) {
            window.location.href = "/Upload/DownloadFile?fileName=Security Type Master.csv";
            toastr.success("File Downloaded successfully");
        }
        else if (id == 8) {
            window.location.href = "/Upload/DownloadFile?fileName=Charges Master.csv";
            toastr.success("File Downloaded successfully");
        }
        else if (id == 9) {
            window.location.href = "/Upload/DownloadFile?fileName=Account Customization Waiver Master.csv";
            toastr.success("File Downloaded successfully");
        }
        else if (id == 12) {
            window.location.href = "/Upload/DownloadFile?fileName=Delinquency Customer.csv";
            toastr.success("File Downloaded successfully");
        }
        else if (id == 13) {
            window.location.href = "/Upload/DownloadFile?fileName=Delinquency Account.csv";
            toastr.success("File Downloaded successfully");
        }
        else if (id == 14) {
            window.location.href = "/Upload/DownloadFile?fileName=Compliance.csv";
            toastr.success("File Downloaded successfully");
        }
        else if (id == 15) {
            window.location.href = "/Upload/DownloadFile?fileName=Acquisitions.csv";
            toastr.success("File Downloaded successfully");
        }
        else if (id == 16) {
            window.location.href = "/Upload/DownloadFile?fileName=Acquisitions SFR SLA AMB.csv";
            toastr.success("File Downloaded successfully");
        }
        else if (id == 101) {
            window.location.href = "/Upload/DownloadFile?fileName=Portfolio - Template.csv";
            toastr.success("File Downloaded successfully");
        }
        else if (id == 102) {
            window.location.href = "/Upload/DownloadFile?fileName=Housekeeping - Template.csv";
            toastr.success("File Downloaded successfully");
        }
        else if (id == 103) {
            window.location.href = "/Upload/DownloadFile?fileName=AUR-Upload.csv";
            toastr.success("File Downloaded successfully");
        }
        else if (id == 104) {
            window.location.href = "/Upload/DownloadFile?fileName=Dashboard LCHU History.csv";
            toastr.success("File Downloaded successfully");
        }
        else if (id == 105) {
            window.location.href = "/Upload/DownloadFile?fileName=Delinquency Upload.csv";
            toastr.success("File Downloaded successfully");
        }
        else if (id == 106) {
            window.location.href = "/Upload/DownloadFile?fileName=Watch List Upload.csv";
            toastr.success("File Downloaded successfully");
        }

        //swal('success','testing','success')
        //$.ajax(
        //   {
        //       url: '@Url.Action("DownloadFile", "Upload")',
        //       contentType: 'application/json; charset=utf-8',
        //       datatype: 'json',
        //       data: {
        //           fileName: data.fileName
        //       },
        //       type: "GET",
        //       success: function (e) {
        //           window.location = '@Url.Action("DownloadFile", "Upload", new { fileName =  e.fileName })';
        //       }
        //   });
    });
});

function AddRemoveClientNameToSession(SearchData, type) {

    $.ajax({
        type: "POST",
        url: '/Home/AddSearchDataToSession?SearchData=' + SearchData + '&Type=' + type,
        contentType: false,
        processData: false,
        data: null,
        async: false,
        success: function (e) {

        },
        error: function (e) {
            toastr.error(e.msg);
        }
    });
}
//function DownloadFileTemplate(fileName) {
//    $.ajax({
//        type: "",
//        url: '/Upload/DownloadFile?fileName=' + fileName,
//        contentType: false,
//        processData: false,
//        data: null,
//        async: false,
//        success: function (e) {
//            debugger;
//        },
//        error: function (e) {
//            toastr.error(e.msg);
//        }
//    });
//}

$(function () {
    $("#btnUploadFile").on('click', function (e) {
        debugger;
        CheckSession();

        var skillsSelect = document.getElementById("FileType");
        var selectedType = skillsSelect.options[skillsSelect.selectedIndex].text;
        var selectedTypeValue = skillsSelect.options[skillsSelect.selectedIndex].value;

        var files = document.getElementById('fileUpload').files;// $('#file').files[0];// e.target.files;
        var UploadedDate = document.getElementById('UploadedDate').value;
        var IsselectedTypeDate = (selectedTypeValue == "1" || selectedTypeValue == "12" || selectedTypeValue == "13" || selectedTypeValue == "15");
        var IsnullUploadedDate = (UploadedDate == "" || UploadedDate == undefined);
        if (files.length > 0) {
            var filename = files[0].name;
            var file = filename.split('.').slice(0, -1).join('.')
            var Is
            if (IsselectedTypeDate && IsnullUploadedDate) {
                toastr.error('Select Upload Date');

            } else {

                if (selectedType == file) {
                    if (window.FormData !== undefined) {

                        var files = $('#fileUpload').prop("files");
                        // var url = "/Index?handler=MyUploader";
                        formData = new FormData();
                        formData.append("files", files[0]);
                        formData.append("UploadedDate", UploadedDate);

                        $.ajax({
                            type: "POST",
                            url: '/Upload/UploadToFileSystem',
                            contentType: false,
                            processData: false,
                            data: formData,
                            async: false,
                            success: function (e) {

                                if (e.isSuccess == 'true') {
                                    toastr.success(e.msg);
                                    $('#fileUpload').val('');
                                    if (e.fileName != '' && e.fileName != undefined) {
                                        window.location.href = "/Upload/DownloadFile_Error?fileName=" + e.fileName;
                                    }
                                    //window.location.href = "/Upload/DeleteFile?fileName=" + e.msg;
                                }
                                else if (e.isSuccess == 'false') {
                                    toastr.error(e.msg);
                                    $('#fileUpload').val('');
                                    if (e.fileName != '' && e.fileName != undefined) {
                                        window.location.href = "/Upload/DownloadFile_Error?fileName=" + e.fileName;
                                    }
                                }

                            },
                            error: function (e) {
                                toastr.error(e.msg);
                            }
                        });
                    }
                }
                else {
                    toastr.error('Select Correct File Name, Please check that the file name must be the file type');
                }
            }

        }
        else {
            toastr.error('Please select File');
        }
    });


});


function GetNotificationDetails(action) {
    $.ajax({
        type: "GET",
        url: "/Home/GetNotificationDetails?Identflag=" + action,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            chkSession(response);
            if (response != null) {

                if (action == 'GetCount') {

                    if (response[0].notificationCount > 0) {
                        $("#notificationsCount").show();
                        $("#notificationsCount").text(response[0].notificationCount);
                    }
                    else {
                        //$("#notification").modal('hide');
                        $("#notificationsCount").hide();

                        //$('#btnShowNotification').removeAttr('data-toggle');
                    }
                }
                else {
                    var lnkData = response;

                    if (lnkData.length > 0) {

                        var htmlData = ''; var NotificationList = '';
                        for (var i = 0; i < lnkData.length; i++) {
                            var lnkId = "addlinks";
                            var status = lnkData[i].status;
                            if (status == 1) {
                                NotificationList += ' <li data-id=' + lnkData[i].id + ' class="dropdown-item notification-item"><a class="delete_notification"><i class="fa fa-close"></i></a>';
                                NotificationList += '<h3>' + lnkData[i].title + '</h3>';
                                NotificationList += '<h5 style="margin-top:14px;">' + lnkData[i].body + ' </h5>';
                                //NotificationList += '<p>' + lnkData[i].body + '</p>';
                                NotificationList += ' </li>';

                            }
                            else {
                                NotificationList += ' <li data-id=' + lnkData[i].id + ' class="dropdown-item notification-item" style="background:rgba(255, 0, 0, 0.13)"><a class="delete_notification"><i class="fa fa-close"></i></a>';
                                NotificationList += '<h3>' + lnkData[i].title + '</h3>';
                                NotificationList += '<h5 style="margin-top:14px;">' + lnkData[i].body + ' </h5>';
                                //NotificationList += '<p>' + lnkData[i].body + '</p>';
                                NotificationList += ' </li>';
                            }
                        }
                        htmlData += NotificationList;
                        $("#NotificationList").html('');
                        $('#NotificationList').append(htmlData);
                        $("#noData").html('');
                        $("#notification").modal('show');
                    }
                    else {
                        $("#notification").modal('hide');
                    }
                }

            }
        },
        failure: function (response) {
            //alert(response.d);
        }
    });
}


function GetBulletinCount() {
    $.ajax({
        type: "GET",
        url: "/Home/UrgentBulletinCount",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            chkSession(response);
            if (response != null) {
                var bulletinecount = response.tbl_bulletin_count[0].bulletin_count;

                $("#lbl_count").text(bulletinecount);

                if (response.tbl_todo_list.length > 0) {
                    $("#viewToDo").css('visibility', 'visible');
                    for (var i = 0; i < response.tbl_todo_list.length; i++) {

                        $('#tbl_todo tbody').append('<tr><td><div class="idication duesoon"></div></td><td><lable class="due-dt">' + response.tbl_todo_list[i].dueOn + '</lable></td><td><p class="title_limit">' + response.tbl_todo_list[i].title + '</p></td><td><a class="link" href="' + response.tbl_todo_list[i].actionLink + '">' + response.tbl_todo_list[i].commercialType + '-' + response.tbl_todo_list[i].customerId + '</a></td></tr>');
                    }
                }
                else {
                    $("#viewToDo").css('visibility', 'hidden');
                }

                if (bulletinecount < 1) {
                    $("#tr_urgentBulletine").css('display', 'none');
                }
                else {
                    $("#tr_urgentBulletine").css('visibility', 'visible');
                    //document.getElementById('btn_read_bulletin').style.visibility = 'visible';
                }
            }
        },
        failure: function (response) {
            //alert(response.d);
        }
    });
}

$("#btn_close_bulletine").on("click", function () {

    RefreshBulletineBody();
});
function RefreshBulletineBody() {
    $.ajax({
        url: "/Home/GetBulletinePartialView",
        type: "GET",
        data: null,
    })
        .done(function (partialViewResult) {
            $("#bulltine_partial").html(partialViewResult);
        });
}

$('#NotificationList').on('click', '.delete_notification', function (p) {

    var notificationId = $(this).closest('li').attr('data-id');

    $.ajax({
        type: "POST",
        url: "/Home/DeleteNotification?notificationId=" + notificationId,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response != null) {
                if (response == true) {
                    GetNotificationDetails("GetAllNotifications");
                }
            }
        },
        // alert(names);

        failure: function (response) {
            //alert(response.d);
        }
    });


})
//$(function () {
//    $('.delete_notification').click(function () {
//        debugger;
//    });
//});
$("#new_bulletin").on("click", function () {
    CheckSession();
    $('.date').datepicker({
        startDate: new Date(),
        format: 'dd/mm/yyyy',
        autoclose: true,
        todayHighlight: true
    });
    GetMasterData('Business_Type');
    //$("#From_Date").val('');
    //$("#To_Date").val('');
    //$("#txtUpload").val('');
    //$("#txt_msg").val('');
    //$("#txt_subject").val('');
    $("#sidebar_bulletin").addClass('opened')
    $(".side-content").addClass('slideIn');
    document.querySelector('body').style.overflow = 'hidden';
});

function GenerateToDoList() {

    $.ajax({
        type: "GET",
        url: "/Home/GetToDoList_Data",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {

            if (response != null) {

                var lnkData = response;

                if (lnkData.length > 0) {
                    //var htmlData = ''; var TodoList = '';
                    for (var i = 0; i < lnkData.length; i++) {
                        //TodoList += '<tr><td><div class="idication duesoon"></div></td><td><lable class="due-dt">' + lnkData[i].dueOn + '</lable></td><td><p class="title_limit">' + lnkData[i].title + '</p></td><td><a class="link" href="' + lnkData[i].actionLink + '">Action Link</a></td></tr>';
                        $('#tbl_all_todo tbody').append('<tr><td><div class="idication duesoon"></div></td><td><label class="due-dt">' + lnkData[i].dueOn + '</label></td><td><p class="title_limit_inner">' + lnkData[i].title + '</p></td><td><a class="link" href="' + lnkData[i].actionLink + '">' + lnkData[i].commercialType + '-' + lnkData[i].customerId + '</a></td></tr>');
                    }
                    //htmlData += TodoList;
                    //$("#tbl_all_todo").html('');
                    //$('#tbl_all_todo').append(htmlData);
                }
            }
        },
        // alert(names);

        failure: function (response) {
            //alert(response.d);
        }
    });
}

function generateBulletinList() {

    $("#bulletin_list").html('');

    $.ajax({
        type: "GET",
        url: "/Home/GetUrgentBulletinData",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            chkSession(response);
            if (response != null) {

                var lnkData = response;

                if (lnkData.length > 0) {

                    var htmlData = ''; var BulletinList = '';

                    for (var i = 0; i < lnkData.length; i++) {
                        var lnkId = "addlinks";
                        BulletinList += ' <li class="overdue-list">';
                        BulletinList += '<h3>' + lnkData[i].create_date + '</h3>';
                        BulletinList += '<span>' + lnkData[i].empName + ' | ' + lnkData[i].empRole + ' </span>';
                        BulletinList += '<h4 class="bulletinesubject">' + lnkData[i].subject + '</h4>';
                        BulletinList += '<p>' + lnkData[i].body + '</p>';
                        if (lnkData[i].fileName != "") {
                            if (lnkData[i].fileName.endsWith(".pdf") || lnkData[i].fileName.endsWith(".docs") || lnkData[i].fileName.endsWith(".docx") || lnkData[i].fileName.endsWith(".xls") || lnkData[i].fileName.endsWith(".docx") || lnkData[i].fileName.endsWith(".xlsx") || lnkData[i].fileName.endsWith(".xlsm") || lnkData[i].fileName.endsWith(".xlsb") || lnkData[i].fileName.endsWith(".csv")) {
                                BulletinList += '<a href="/UrgentBulletin/' + lnkData[i].fileName + '" download class="download-btn"><button class="btn" style="color:#fff;"><i class="fa fa-download"></i> Download</button></a >';
                            } else {
                                BulletinList += '<img style="width:155px;height:163px;" src="/UrgentBulletin/' + lnkData[i].fileName + '" />';
                            }
                            // BulletinList += '<img style="width:155px;height:163px;" src="/UrgentBulletin/' + lnkData[i].fileName + '" />';
                        }
                        BulletinList += ' </li>';

                    }

                    htmlData += BulletinList;

                    $("#bulletin_list").html('');
                    $('#bulletin_list').append(htmlData);
                    $("#noData").html('');
                }
            }
            // alert(names);

        },
        failure: function (response) {
            //alert(response.d);
        }
    });
}

$("#txtUpload").on('change', function () {

    var file = $('#txtUpload').prop("files");
    var fileName = file[0].name;
    var fileNameExt = fileName.substr(fileName.lastIndexOf('.') + 1);
    var response = {};

    if (fileNameExt.toUpperCase() != "JPG" && fileNameExt.toUpperCase() != "PNG" && fileNameExt.toUpperCase() != "PDF" && fileNameExt.toUpperCase() != "DOC" && fileNameExt.toUpperCase() != "DOCX" && fileNameExt.toUpperCase() != "XLS" && fileNameExt.toUpperCase() != "XLSX" && fileNameExt.toUpperCase() != "CSV") {
        toastr.error("Select correct file format");
        return;
    }

    var MAX_FILE_SIZE = 5 * 1024 * 1024;
    fileSize = this.files[0].size;
    if (fileSize > MAX_FILE_SIZE) {
        response.success = "false";
        toastr.error("File Size should not be more than 5MB");
        return;
    }

});

$("#btnSubmitBulletin").click(function () {
    CheckSession();
    const fileupload = document.getElementById('txtUpload');

    if ($("#txt_subject").val() == '' || $("#txt_subject").val() == undefined) {

        toastr.error("Subject is required");
        return;
    }
    if ($("#txt_msg").val() == '' || $("#txt_msg").val() == undefined) {

        toastr.error("Content is required");
        return;
    }


    //if ($("#From_Date").val() == '' || $("#From_Date").val() == undefined) {
    //    toastr.error("From Date is Required");
    //    return;
    //}
    if ($("#To_Date").val() == '' || $("#To_Date").val() == undefined) {
        toastr.error("Expiry Date is required");
        return;
    }

    //var StartDate = document.getElementById('From_Date').value;
    //var EndDate = document.getElementById('To_Date').value;
    //var eDate = new Date(EndDate.split("/").reverse().join("-"));
    //var sDate = new Date(StartDate.split("/").reverse().join("-"));

    //if (sDate > eDate) {

    //    toastr.error('Please ensure that the Expiry Date is greater than or equal to the Start Date');
    //    return;
    //}



    if (fileupload.files.length > 0) {
        var file = $('#txtUpload').prop("files");
        var fileName = file[0].name;
        var fileNameExt = fileName.substr(fileName.lastIndexOf('.') + 1);
        var response = {};

        if (fileNameExt.toUpperCase() != "JPG" && fileNameExt.toUpperCase() != "PNG" && fileNameExt.toUpperCase() != "JPEG" && fileNameExt.toUpperCase() != "PDF" && fileNameExt.toUpperCase() != "DOC" && fileNameExt.toUpperCase() != "DOCX" && fileNameExt.toUpperCase() != "XLS" && fileNameExt.toUpperCase() != "XLSX" && fileNameExt.toUpperCase() != "CSV") {
            toastr.error("Select correct file format");
            return;
        }

        var MAX_FILE_SIZE = 5 * 1024 * 1024;
        var fileSize = file[0].size;
        if (fileSize > MAX_FILE_SIZE) {
            response.success = "false";
            toastr.error("Maximum file size is 5MB");
            return;
        }
    }

    var files = $('#txtUpload').prop("files");
    formData = new FormData();
    formData.append('Body', $("#txt_msg").val());
    formData.append('Subject', $("#txt_subject").val());
    formData.append('Business', $("#drp_business").val());
    formData.append('expiryDate', $("#To_Date").val());
    formData.append('recipients', $("input[type='radio'][name='rblRecipients']:checked").val());

    //data.subject = $("#txt_msg").val();
    //data.fromDate = $("#From_Date").val();
    //data.expiryDate = $("#To_Date").val();
    //data.recipients = $("input[type='radio'][name='rblRecipients']:checked").val();

    formData.append("MyUploader", files[0]);

    $.ajax({
        type: "POST",
        url: "/UrgentBulletin/Create",
        data: formData,
        contentType: false,
        // dataType: "json",
        async: false,
        processData: false,
        success: function (response) {

            if (response != null && response.isSuccess == 'false') {
                toastr.error(response.msg);
                //swal('Warning', response.msg, 'error');
            }
            else if (response != null && response.isSuccess == 'true') {
                //swal('Success', response.msg, 'success');
                toastr.success(response.msg);
                //$("#From_Date").val('');
                //$("#To_Date").val('');
                //$("#txtUpload").val('');
                //$("#txt_msg").val('');
                //$("#txt_subject").val('');
                generateBulletinList();
                RefreshBulletineBody();
                GetBulletinCount();
                $("#sidebar_bulletin").removeClass('opened');
                //GetBulletinCount();
            }

        },
        error: function (xhr, ajaxOptions, thrownError) {
            event.preventDefault();
        }
    });


    //$.ajax({
    //    type: "POST",
    //    //url: "/Home/CreateBulletin?handler=MyUploader",
    //    url: "/UrgentBulletin/CreateBulletin?message=" + $("#txt_msg").val() + "&fromDate=" + $("#From_Date").val() + "&expiryDate=" + $("#To_Date").val() + "&recipients=" + $("input[type='radio'][name='rblRecipients']:checked").val(),
    //    data: formData,
    //    contentType: "application/json; charset=utf-8",
    //    dataType: "json",
    //    async: false,
    //    processData: false,
    //    success: function (response) {
    //        debugger
    //        if (response != null && response.isSuccess == 'false') {
    //            $("#lbl_message").text(response.msg);
    //        }
    //        else if (response != null && response.isSuccess == 'true') {
    //            window.location.href = response.url;
    //        }

    //    },
    //    error: function (xhr, ajaxOptions, thrownError) {
    //        event.preventDefault();
    //    }
    //});



    //var data = {};
    //data.subject = $("#txt_msg").val();
    //data.fromDate = $("#From_Date").val();
    //data.expiryDate = $("#To_Date").val();
    //data.recipients = $("input[type='radio'][name='rblRecipients']:checked").val();

});
//////////// Custom File Uploader /////////



var input = document.getElementById('txtUpload');
var infoArea = document.getElementById('file-upload-filename');

input.addEventListener('change', showFileName);

function showFileName(event) {

    // the change event gives us the input it occurred in
    var input = event.srcElement;

    // the input has an array of files in the `files` property, each one has a name that you can use. We're just using the name here.
    var fileName = input.files[0].name;

    // use fileName however fits your app best, i.e. add it into a div
    infoArea.textContent = fileName;
}

function chkSession(response) {
    if (typeof (response) == 'string') {
        window.location.href = "../Common/SessionExpiry";
        return false;
    }
}
function CheckSession() {
    var sessionval = false;

    $.ajax({
        type: "GET",
        url: "/Home/checkSession",
        data: null,
        contentType: false,
        dataType: "JSON",
        async: false,
        processData: false,
        success: function (response) {

            sessionval = response.sessionValue;
        },
        error: function (xhr) {
            window.location.href = "../Common/SessionExpiry";
            sessionval = false;
        }
    });

    return sessionval;
}


//function MailSend() {
//    var textBody = "Dear All,</br>";
//    textBody += "Hi this is ovi testing";
//    formData = new FormData();
//    formData.append('From', 'InterimSolutionGroup@hdfcbank.com');
//    formData.append('To', 'varun.barve@hdfcbank.com');
//    formData.append('CCMail', 'A36809');
//    formData.append('Subject', 'Mail Test');
//    formData.append('Body', textBody);

//    $.ajax({
//        type: "POST",
//        url: "SendMails",
//        data: formData,
//        contentType: false,
//        // dataType: "json",
//        async: false,
//        processData: false,
//        success: function (response) {

//        },
//        error: function (xhr, ajaxOptions, thrownError) {
//            result = xhr.innerHTML;
//        }
//    });
//}





