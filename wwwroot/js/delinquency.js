$(document).ready(function () {
    let onDatChange = 0;
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const d = new Date();
    var dateTime = getUrlVars()["dateTime"];
    if ($("#HiddenDatetime").val() == "" || $("#HiddenDatetime").val() == undefined) {
        //  alert("test hea" + $("#HiddenDatetime").val());
        $(".delquMonth").val(monthNames[d.getMonth()] + "-" + d.getUTCFullYear());

        // alert("month in " + $(".delquMonth").val() + "hideeen in " + $("#HiddenDatetime").val());
    }

    if (dateTime != "" && dateTime != undefined) {
        $(".delquMonth").val(dateTime);
    }
    else if ($("#HiddenDatetime").val() != "" && $("#HiddenDatetime").val() != undefined) {
        $(".delquMonth").val($("#HiddenDatetime").val());
    }

    $('.delquMonth').datepicker({
        format: "MM-yyyy",
        startView: "months",
        minViewMode: "months",
        todayHighlight: true,
    }).on('changeDate', function (e) {

        var dateTime = $("#delquMonth").val();
        // alert("month " + dateTime + "hideeen " + $("#HiddenDatetime").val());


        //window.location.href = '@Url.Action("Delinquency","Delinquency")' + '?dateTime=' + dateTime;
        document.location.href = '/Delinquency/Delinquency/?dateTime=' + dateTime;
        // $('#month').val(dateTime);

        // GetCMDelinquencyData(dateTime);
        onDatChange = 1;
        $("#HiddenDatetime").val(dateTime);

    });

    if (onDatChange != 1) {

        GetCMDelinquencyData();
    }

    $("#btnSearch").click(function () {

        var hdnDate = $("#HiddenDatetime").val();
        $(".delquMonth").val(hdnDate);
        //  alert("date " + hdnDate);

    });


    $('#tbl_delinquency_trendData_overview').DataTable({
        paging: false,
        searching: false,
        ordering: false,
        info: false,
        //scrollX: true,
    });

    $('#tbl_delinquency_summary_exposuerdpd').DataTable({
        paging: false,
        searching: false,
        ordering: false,
        info: false,
        //scrollX: true,
    });
    $('#tbl_actionitem').DataTable({

        info: false,
        searching: false,
    });


    ////////// Multiselect dropdown ////////


    $('[id*=Location_dropdown]').multiselect({
        includeSelectAllOption: true,
        nonSelectedText: 'All Locations'
    });


    $('[id*=Segment_dropdown]').multiselect({
        includeSelectAllOption: true,
        nonSelectedText: 'All Segments'
    });


})


function GetCMDelinquencyData() {

    //var dateTime = getUrlVars()["dateTime"];
    ////alert(dateTime);

    //if (dateTime == "" || dateTime == undefined) {
    //    dateTime = $("#delquMonth").val();
    //}
    //else {
    //    //alert(dateTime);
    //    // $("#month").val(dateTime)
    //    $(".delquMonth").val(dateTime);
    //    $("#HiddenDatetime").val(dateTime);

    //}

    //var hdnDate = $("#HiddenDatetime").val();
    //if (hdnDate != "" && hdnDate != undefined) {
    //$(".delquMonth").val(hdnDate);
    //}
    var dateTime = "";
    if ($("#HiddenDatetime").val() == "" || $("#HiddenDatetime").val() == undefined) {
        dateTime = $("#delquMonth").val();
        $("#HiddenDatetime").val($("#delquMonth").val());
    }
    else if ($("#HiddenDatetime").val() != "" || $("#HiddenDatetime").val() != undefined) {
        dateTime = $("#HiddenDatetime").val();
        $(".delquMonth").val($("#HiddenDatetime").val());
    }

    //alert($(".delquMonth").val() + $("#HiddenDatetime").val() );


    $.ajax({
        type: "GET",
        url: "/Delinquency/GetCMDelinquencyPageData?dateTime=" + dateTime + "",
        data: null,
        contentType: false,
        // dataType: "json",
        async: false,
        processData: false,
        success: function (response) {

            if (response != null) {

                var lstResponseCMDL = response;

                if (lstResponseCMDL.clsMonthExposure.length > 0) {

                    //$("#dvSegment").show();
                    //$("#pSegment").hide();

                    $("#delinquency-chart").width(300);
                    $("#delinquency-chart").height(150);

                    var labels = [];
                    var bgColor = [];
                    var hbgColor = [];
                    var dt = [];

                    $("#piChartValue").text(lstResponseCMDL.overDueAmount);

                    if (lstResponseCMDL.overDueAmount.length > 6) {
                        $("#piChartValue").css("font-size", "14px");
                    }


                    for (var i = 0; i < lstResponseCMDL.clsMonthExposure.length; i++) {

                        for (var j = 0; j < lstResponseCMDL.clsColorCode.length; j++) {
                            if (lstResponseCMDL.clsMonthExposure[i].segment == lstResponseCMDL.clsColorCode[j].segment) {
                                var div = lstResponseCMDL.clsColorCode[j].div;
                                bgColor.push([lstResponseCMDL.clsColorCode[j].backgroundColor]);
                                hbgColor.push([lstResponseCMDL.clsColorCode[j].hoverBackgroundColor]);
                                dt.push([lstResponseCMDL.clsMonthExposure[i].totalAmount]);
                                labels.push(lstResponseCMDL.clsColorCode[j].segment);
                            }
                        }
                    }


                    const delinquency = document.getElementById("delinquency-chart").getContext('2d');
                    new Chart(delinquency, {
                        type: 'doughnut',
                        data: {
                            defaultFontFamily: 'Poppins',
                            datasets: [{

                                data: dt,
                                borderWidth: 1,
                                backgroundColor: bgColor,
                                hoverBackgroundColor: hbgColor

                            }],
                            labels: labels,

                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            legend: false,
                            cutoutPercentage: 70
                        }
                    });
                }
                else {

                }


            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            event.preventDefault();
        }
    });


}


function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

