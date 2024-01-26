$(document).ready(function () {

    let onDatChange = 0;

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const d = new Date();
    $(".month").val(monthNames[d.getMonth()] + "-" + d.getUTCFullYear());
    $('.month').datepicker({
        format: "MM-yyyy",
        startView: "months",
        minViewMode: "months",
        todayHighlight: true,
    }).on('changeDate', function (e) {
        $("#tblDelinquency").empty();
        $("#tblAUR").empty();
        $("#tblLUCH").empty();
        $("#tblPortFolio").empty();

        $("#AURTotal").text(0);
        $("#lcuhTotal").text(0);
        $("#delinquencyTotal").text(0);
        $("#piChartValue").text(0);

        GetPortfolioData();
        //GetLUCHData();
        GetLUCHData1();
        //GetDelinquencyData();
        GetDelinquencyData1();
        //GetAURData();
        GetAURData1()
        GetHouskeepingData();
        GetPortfolioHubData();
        GetLCHUHubData();
        GetAURHubData();
        GetDelinquencyHubData();
        onDatChange = 1;
    });

    if (onDatChange != 1) {
        GetPortfolioData();
        //GetLUCHData();
        GetLUCHData1();
        //GetDelinquencyData();
        GetDelinquencyData1();
        GetAURData();
        GetHouskeepingData();
        GetPortfolioHubData();
        GetLCHUHubData();
        GetAURHubData();
        GetDelinquencyHubData();
    }
});

$("#lnkSegment").click(function () {


    $("#portfolio-chart").width(300);
    $("#portfolio-chart").height(150);

    $("#lchu-chart").width(300);
    $("#lchu-chart").height(150);

    $("#delinquency-chart").width(300);
    $("#delinquency-chart").height(150);

    $("#aur-chart").width(300);
    $("#aur-chart").height(150);

});

function distroyChart(name) {
    const Portfolio = document.getElementById(name).getContext('2d');
    new Chart(Portfolio, {
        type: 'doughnut',
        data: {
            defaultFontFamily: 'Poppins',
            datasets: [{

                data: null,
                borderWidth: null,
                backgroundColor: null,
                hoverBackgroundColor: null

            }],
            labels: null,

        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            legend: false,
            cutoutPercentage: 70
        }
    });
}

//Segment

$("#delDrop").change(function () {

    $("#tblDelinquency").empty();
    GetDelinquencyData1();
    GetDelinquencyHubData();
});

function GetDelinquencyData() {
    var dateTime = $("#month").val();
    var filterVal = $("#delDrop").val();

    $.ajax({
        type: "GET",
        url: "/CM/GetDelinquencyData?delFilterVal=" + filterVal + "&dateTime=" + dateTime + "",
        data: null,
        contentType: false,
        async: false,
        processData: false,
        success: function (response) {

            if (response != null) {


                var lstResponse = response;

                if (lstResponse.clsPortfolio != null) {
                    if (lstResponse.clsPortfolio.length > 0) {
                        $("#dvMainDelq").show();
                        $("#delinquency-chart").width(300);
                        $("#delinquency-chart").height(150);
                        $("#pDelq").hide();
                    }
                    else {
                        $("#dvMainDelq").hide();
                        $("#pDelq").show();
                    }
                }
                else {
                    $("#dvMainDelq").hide();
                    $("#pDelq").show();
                }


                if (lstResponse.clsMonthList.length > 0) {

                    var labels = [];
                    var bgColor = [];
                    var hbgColor = [];
                    var dt = [];
                    var lstMon = [];
                    var chartLable = [];

                    var heads = "";
                    var Col1 = "";
                    var Col2 = "";
                    var Col3 = "";
                    var Col4 = "";
                    var Col5 = "";
                    var Col6 = "";
                    var seg = "";

                    let abc1 = 0;
                    let Col1Total1 = 0;
                    let Col3Total1 = 0;
                    let Col4Total1 = 0;
                    let Col5Total1 = 0;
                    let Col6Total1 = 0;

                    var abcd1;
                    var abcd2;
                    var abcd3;
                    var abcd4;
                    var abcd5;
                    var abcd6;

                    let SegTotal = 0;
                    let lcuhTotal = 0;

                    let abc = 0;
                    for (var i = 0; i < lstResponse.clsMonthList.length; i++) {
                        heads += '<th id="' + i + '">' + lstResponse.clsMonthList[i].monthName + '</th>';

                        if (!lstMon.includes(lstResponse.clsMonthList[i].monthName)) {
                            lstMon.push(lstResponse.clsMonthList[i].monthName);
                        }
                    }

                    for (var i = 0; i < lstResponse.clsPortfolio.length; i++) {

                        if (!labels.includes(lstResponse.clsPortfolio[i].segment)) {
                            labels.push(lstResponse.clsPortfolio[i].segment);
                        }
                    }

                    $('#tblDelinquency').append(` <tr >
          <th>Segment</th>
           ${heads}
           </tr> `);

                    for (var k = 0; k < labels.length; k++) {
                        for (var m = 0; m < lstMon.length; m++) {
                            for (var i = 0; i < lstResponse.clsPortfolio.length; i++) {
                                if (k == 0 && m == 0) {

                                    for (var j = 0; j < lstResponse.clsCode.length; j++) {
                                        if (lstResponse.clsPortfolio[i].segment == lstResponse.clsCode[j].segment) {
                                            SegTotal += parseFloat(lstResponse.clsPortfolio[i].apprLmt);
                                        }
                                    }
                                }

                                if (lstMon[m] == lstResponse.clsPortfolio[i].monthName && labels[k] == lstResponse.clsPortfolio[i].segment) {
                                    const nv11 = parseFloat(lstResponse.clsPortfolio[i].no.replace(",", "."));

                                    if (m == 0) {
                                        Col1 = '<td>' + lstResponse.clsPortfolio[i].no + '</td>';
                                        Col1Total1 += nv11;
                                        abcd1 = "Value";
                                        abc += parseFloat(lstResponse.clsPortfolio[i].apprLmt);
                                    }
                                    else if (m == 1) {
                                        Col2 = '<td>' + lstResponse.clsPortfolio[i].no + '</td>';
                                        abc1 += nv11;
                                        abcd2 = "Value";
                                        abc += parseFloat(lstResponse.clsPortfolio[i].apprLmt);
                                    }
                                    else if (m == 2) {
                                        Col3 = '<td>' + lstResponse.clsPortfolio[i].no + '</td>';
                                        Col3Total1 += nv11;
                                        abcd3 = "Value";
                                        abc += parseFloat(lstResponse.clsPortfolio[i].apprLmt);
                                    }
                                    else if (m == 3) {
                                        Col4 = '<td>' + lstResponse.clsPortfolio[i].no + '</td>';
                                        Col4Total1 += nv11;
                                        abcd4 = "Value";
                                        abc += parseFloat(lstResponse.clsPortfolio[i].apprLmt);
                                    }
                                    else if (m == 4) {
                                        Col5 = '<td>' + lstResponse.clsPortfolio[i].no + '</td>';
                                        Col5Total1 += nv11;
                                        abcd5 = "Value";
                                        abc += parseFloat(lstResponse.clsPortfolio[i].apprLmt);
                                    }
                                    else if (m == 5) {
                                        Col6 = '<td>' + lstResponse.clsPortfolio[i].no + '</td>';
                                        Col6Total1 += nv11;
                                        abcd6 = "Value";
                                        abc += parseFloat(lstResponse.clsPortfolio[i].apprLmt);
                                    }
                                }
                                else {
                                    if (m == 0 && abcd1 != "Value") {
                                        Col1 = '<td>0</td>';
                                    }
                                    else if (m == 1 && abcd2 != "Value") {
                                        Col2 = '<td>0</td>';
                                    }
                                    else if (m == 2 && abcd3 != "Value") {
                                        Col3 = '<td>0</td>';
                                    }
                                    else if (m == 3 && abcd4 != "Value") {
                                        Col4 = '<td>0</td>';
                                    }
                                    else if (m == 4 && abcd5 != "Value") {
                                        Col5 = '<td>0</td>';
                                    }
                                    else if (m == 5 && abcd6 != "Value") {

                                        Col6 = '<td>0</td>';
                                    }
                                }
                                seg = labels[k];
                            }
                        }

                        for (var j = 0; j < lstResponse.clsCode.length; j++) {
                            if (labels[k] == lstResponse.clsCode[j].segment) {

                                if (!chartLable.includes(labels[k])) {
                                    chartLable.push(labels[k]);
                                    var div = lstResponse.clsCode[j].div;
                                    bgColor.push([lstResponse.clsCode[j].backgroundColor]);
                                    hbgColor.push([lstResponse.clsCode[j].hoverBackgroundColor]);
                                }
                                if (abc != 0)
                                    dt.push([abc]);
                                abc = 0;
                                lcuhTotal += SegTotal;
                                SegTotal = 0;
                            }
                        }

                        $('#tblDelinquency').append(`<tr >
                                         <td>${div}${seg}</td>
                                        ${Col1}
                                         ${Col2}
                                         ${Col3}
                                        ${Col4}
                                       ${Col5}
                                        ${Col6}
                                         </tr>`);

                        Col1 = "";
                        Col2 = "";
                        Col3 = "";
                        Col4 = "";
                        Col5 = "";
                        Col6 = "";
                        seg = "";

                        abcd1 = "";
                        abcd2 = "";
                        abcd3 = "";
                        abcd4 = "";
                        abcd5 = "";
                        abcd6 = "";

                    }

                    $('#tblDelinquency').append(`<tr >
          <td>Total</td>
           <td id="Col1TotalDel"></td>
           <td id="Col2TotalDel"></td>
           <td id="Col3TotalDel"></td>
           <td id="Col4TotalDel"></td>
           <td id="Col5TotalDel"></td>
           <td id="Col6TotalDel"></td>
           </tr>`);
                    $("#Col1TotalDel").text(Col1Total1);
                    $("#Col2TotalDel").text(abc1);
                    $("#Col3TotalDel").text(Col3Total1);
                    $("#Col4TotalDel").text(Col4Total1);
                    $("#Col5TotalDel").text(Col5Total1);
                    $("#Col6TotalDel").text(Col6Total1);

                    var final_total = lcuhTotal.toFixed(2);

                    $("#delinquencyTotal").text(final_total);

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
                            labels: chartLable,

                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            legend: false,
                            cutoutPercentage: 70
                        }
                    });

                }
            }

        },
        error: function (xhr, ajaxOptions, thrownError) {
            event.preventDefault();
        }
    });

}

function GetAURData() {
    var dateTime = $("#month").val();
    $.ajax({
        type: "GET",
        url: "/CM/GetAURData?dateTime=" + dateTime + "",
        data: null,
        contentType: false,
        async: false,
        processData: false,
        success: function (response) {

            if (response != null) {

                var lstResponse = response;

                if (lstResponse.clsPortfolio.length > 0) {
                    $("#dvMainAUR").show();
                    $("#aur-chart").width(300);
                    $("#aur-chart").height(150);

                    $("#pAUR").hide();
                }
                else {
                    $("#dvMainAUR").hide();
                    $("#pAUR").show();
                }

                if (lstResponse.clsMonthList.length > 0) {

                    var labels = [];
                    var bgColor = [];
                    var hbgColor = [];
                    var dt = [];
                    var lstMon = [];
                    var chartLable = [];

                    var heads = "";
                    var Col1 = "";
                    var Col2 = "";
                    var Col3 = "";
                    var Col4 = "";
                    var Col5 = "";
                    var Col6 = "";
                    var seg = "";

                    let abc1 = 0;
                    let Col1Total1 = 0;
                    let Col3Total1 = 0;
                    let Col4Total1 = 0;
                    let Col5Total1 = 0;
                    let Col6Total1 = 0;

                    var abcd1;
                    var abcd2;
                    var abcd3;
                    var abcd4;
                    var abcd5;
                    var abcd6;

                    let SegTotal = 0;
                    let lcuhTotal = 0;

                    for (var i = 0; i < lstResponse.clsMonthList.length; i++) {
                        heads += '<th id="' + i + '">' + lstResponse.clsMonthList[i].monthName + '</th>';

                        if (!lstMon.includes(lstResponse.clsMonthList[i].monthName)) {
                            lstMon.push(lstResponse.clsMonthList[i].monthName);
                        }
                    }

                    for (var i = 0; i < lstResponse.clsPortfolio.length; i++) {

                        if (!labels.includes(lstResponse.clsPortfolio[i].segment)) {
                            labels.push(lstResponse.clsPortfolio[i].segment);
                        }
                    }

                    $('#tblAUR').append(` <tr >
          <th>Segment</th>
                
           ${heads}
            
           </tr> `);
                    for (var k = 0; k < labels.length; k++) {
                        for (var m = 0; m < lstMon.length; m++) {
                            for (var i = 0; i < lstResponse.clsPortfolio.length; i++) {

                                if (k == 0 && m == 0) {
                                    for (var j = 0; j < lstResponse.clsCode.length; j++) {
                                        if (lstResponse.clsPortfolio[i].segment == lstResponse.clsCode[j].segment) {
                                            var div = lstResponse.clsCode[j].div;
                                            bgColor.push([lstResponse.clsCode[j].backgroundColor]);
                                            hbgColor.push([lstResponse.clsCode[j].hoverBackgroundColor]);
                                            SegTotal += parseFloat(lstResponse.clsPortfolio[i].apprLmt);
                                        }
                                    }
                                }

                                for (var j = 0; j < lstResponse.clsCode.length; j++) {
                                    if (labels[k] == lstResponse.clsCode[j].segment) {
                                        if (!chartLable.includes(labels[k])) {
                                            chartLable.push(labels[k]);

                                            if (SegTotal != 0)
                                                dt.push([SegTotal]);

                                            lcuhTotal += SegTotal;

                                            SegTotal = 0;
                                        }
                                    }
                                }

                                if (lstMon[m] == lstResponse.clsPortfolio[i].monthName && labels[k] == lstResponse.clsPortfolio[i].segment) {
                                    const nv11 = parseFloat(lstResponse.clsPortfolio[i].no.replace(",", "."));

                                    if (m == 0) {
                                        Col1 = '<td>' + lstResponse.clsPortfolio[i].no + '</td>';
                                        Col1Total1 += nv11;
                                        abcd1 = "Value";
                                    }
                                    else if (m == 1) {
                                        Col2 = '<td>' + lstResponse.clsPortfolio[i].no + '</td>';
                                        abc1 += nv11;
                                        abcd2 = "Value";
                                    }
                                    else if (m == 2) {
                                        Col3 = '<td>' + lstResponse.clsPortfolio[i].no + '</td>';
                                        Col3Total1 += nv11;
                                        abcd3 = "Value";
                                    }
                                    else if (m == 3) {
                                        Col4 = '<td>' + lstResponse.clsPortfolio[i].no + '</td>';
                                        Col4Total1 += nv11;
                                        abcd4 = "Value";
                                    }
                                    else if (m == 4) {
                                        Col5 = '<td>' + lstResponse.clsPortfolio[i].no + '</td>';
                                        Col5Total1 += nv11;
                                        abcd5 = "Value";
                                    }
                                    else if (m == 5) {
                                        Col6 = '<td>' + lstResponse.clsPortfolio[i].no + '</td>';
                                        Col6Total1 += nv11;
                                        abcd6 = "Value";
                                    }
                                }
                                else {
                                    if (m == 0 && abcd1 != "Value") {
                                        Col1 = '<td>0</td>';
                                    }
                                    else if (m == 1 && abcd2 != "Value") {
                                        Col2 = '<td>0</td>';
                                    }
                                    else if (m == 2 && abcd3 != "Value") {
                                        Col3 = '<td>0</td>';
                                    }
                                    else if (m == 3 && abcd4 != "Value") {
                                        Col4 = '<td>0</td>';
                                    }
                                    else if (m == 4 && abcd5 != "Value") {
                                        Col5 = '<td>0</td>';
                                    }
                                    else if (m == 5 && abcd6 != "Value") {

                                        Col6 = '<td>0</td>';
                                    }
                                }
                                seg = labels[k];
                            }
                        }

                        for (var j = 0; j < lstResponse.clsCode.length; j++) {
                            if (labels[k] == lstResponse.clsCode[j].segment) {

                                var div = lstResponse.clsCode[j].div;
                                bgColor.push([lstResponse.clsCode[j].backgroundColor]);
                                hbgColor.push([lstResponse.clsCode[j].hoverBackgroundColor]);
                            }
                        }

                        $('#tblAUR').append(`<tr >
                                         <td>${div}${seg}</td>
                                        ${Col1}
                                         ${Col2}
                                         ${Col3}
                                        ${Col4}
                                       ${Col5}
                                        ${Col6}
                                         </tr>`);

                        Col1 = "";
                        Col2 = "";
                        Col3 = "";
                        Col4 = "";
                        Col5 = "";
                        Col6 = "";
                        seg = "";

                        abcd1 = "";
                        abcd2 = "";
                        abcd3 = "";
                        abcd4 = "";
                        abcd5 = "";
                        abcd6 = "";
                    }
                    $('#tblAUR').append(`<tr >
          <td>Total</td>
                
           <td id="Col1TotalAUR"></td>
           <td id="Col2TotalAUR"></td>
           <td id="Col3TotalAUR"></td>
           <td id="Col4TotalAUR"></td>
           <td id="Col5TotalAUR"></td>
           <td id="Col6TotalAUR"></td>
           </tr>`);

                    $("#Col1TotalAUR").text(Col1Total1);
                    $("#Col2TotalAUR").text(abc1);
                    $("#Col3TotalAUR").text(Col3Total1);
                    $("#Col4TotalAUR").text(Col4Total1);
                    $("#Col5TotalAUR").text(Col5Total1);
                    $("#Col6TotalAUR").text(Col6Total1);
                    var final_total = lcuhTotal.toFixed(2);

                    $("#AURTotal").text(final_total);

                    const lchu = document.getElementById("aur-chart").getContext('2d');
                    new Chart(lchu, {
                        type: 'doughnut',
                        data: {
                            defaultFontFamily: 'Poppins',
                            datasets: [{

                                data: dt,
                                borderWidth: 1,
                                backgroundColor: bgColor,
                                hoverBackgroundColor: hbgColor

                            }],
                            labels: chartLable,

                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            legend: false,
                            cutoutPercentage: 70
                        }
                    });
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            event.preventDefault();
        }
    });

}

function GetLUCHData() {
    var dateTime = $("#month").val();
    $.ajax({
        type: "GET",
        url: "/CM/GetLCHUData?dateTime=" + dateTime + "",
        data: null,
        contentType: false,
        async: false,
        processData: false,
        success: function (response) {

            if (response != null) {

                var lstResponse = response;
                if (lstResponse.clsPortfolio.length > 0) {
                    $("#pLCHU").hide();
                    $("#dvMainLCHU").show();
                    $("#lchu-chart").width(300);
                    $("#lchu-chart").height(150);
                }
                else {
                    $("#dvMainLCHU").hide();
                    $("#pLCHU").show();
                }

                if (lstResponse.clsMonthList.length > 0) {

                    var labels = [];
                    var bgColor = [];
                    var hbgColor = [];
                    var dt = [];
                    var lstMon = [];
                    var chartLable = [];

                    var heads = "";
                    var Col1 = "";
                    var Col2 = "";
                    var Col3 = "";
                    var Col4 = "";
                    var Col5 = "";
                    var Col6 = "";
                    var seg = "";

                    let abc1 = 0;
                    let Col1Total1 = 0;
                    let Col3Total1 = 0;
                    let Col4Total1 = 0;
                    let Col5Total1 = 0;
                    let Col6Total1 = 0;

                    var abcd1;
                    var abcd2;
                    var abcd3;
                    var abcd4;
                    var abcd5;
                    var abcd6;

                    let SegTotal = 0;
                    let lcuhTotal = 0;
                    for (var i = 0; i < lstResponse.clsMonthList.length; i++) {
                        heads += '<th id="' + i + '">' + lstResponse.clsMonthList[i].monthName + '</th>';

                        if (!lstMon.includes(lstResponse.clsMonthList[i].monthName)) {
                            lstMon.push(lstResponse.clsMonthList[i].monthName);
                        }
                    }

                    for (var i = 0; i < lstResponse.clsPortfolio.length; i++) {

                        if (!labels.includes(lstResponse.clsPortfolio[i].segment)) {
                            labels.push(lstResponse.clsPortfolio[i].segment);
                        }
                    }

                    $('#tblLUCH').append(` <tr >
          <th>Segment</th>
                
           ${heads}
            

           </tr> `);

                    for (var k = 0; k < labels.length; k++) {
                        for (var m = 0; m < lstMon.length; m++) {
                            for (var i = 0; i < lstResponse.clsPortfolio.length; i++) {

                                if (k == 0 && m == 0) {

                                    for (var j = 0; j < lstResponse.clsCode.length; j++) {
                                        if (lstResponse.clsPortfolio[i].segment == lstResponse.clsCode[j].segment) {
                                            //var div = lstResponse.clsCode[j].div;
                                            //bgColor.push([lstResponse.clsCode[j].backgroundColor]);
                                            //hbgColor.push([lstResponse.clsCode[j].hoverBackgroundColor]);

                                            SegTotal += parseFloat(lstResponse.clsPortfolio[i].apprLmt);
                                        }
                                    }
                                }

                                for (var j = 0; j < lstResponse.clsCode.length; j++) {
                                    if (labels[k] == lstResponse.clsCode[j].segment) {

                                        if (!chartLable.includes(labels[k])) {
                                            chartLable.push(labels[k]);

                                            if (SegTotal != 0)
                                                dt.push([SegTotal]);

                                            lcuhTotal += SegTotal;

                                            SegTotal = 0;
                                        }

                                    }
                                }

                                if (lstMon[m] == lstResponse.clsPortfolio[i].monthName && labels[k] == lstResponse.clsPortfolio[i].segment) {
                                    const nv11 = parseFloat(lstResponse.clsPortfolio[i].no.replace(",", "."));

                                    if (m == 0) {
                                        Col1 = '<td>' + lstResponse.clsPortfolio[i].no + '</td>';
                                        Col1Total1 += nv11;
                                        abcd1 = "Value";
                                    }
                                    else if (m == 1) {
                                        Col2 = '<td>' + lstResponse.clsPortfolio[i].no + '</td>';
                                        abc1 += nv11;
                                        abcd2 = "Value";
                                    }
                                    else if (m == 2) {
                                        Col3 = '<td>' + lstResponse.clsPortfolio[i].no + '</td>';
                                        Col3Total1 += nv11;
                                        abcd3 = "Value";
                                    }
                                    else if (m == 3) {
                                        Col4 = '<td>' + lstResponse.clsPortfolio[i].no + '</td>';
                                        Col4Total1 += nv11;
                                        abcd4 = "Value";
                                    }
                                    else if (m == 4) {
                                        Col5 = '<td>' + lstResponse.clsPortfolio[i].no + '</td>';
                                        Col5Total1 += nv11;
                                        abcd5 = "Value";
                                    }
                                    else if (m == 5) {
                                        Col6 = '<td>' + lstResponse.clsPortfolio[i].no + '</td>';
                                        Col6Total1 += nv11;
                                        abcd6 = "Value";
                                    }
                                }
                                else {
                                    if (m == 0 && abcd1 != "Value") {
                                        Col1 = '<td>0</td>';
                                    }
                                    else if (m == 1 && abcd2 != "Value") {
                                        Col2 = '<td>0</td>';
                                    }
                                    else if (m == 2 && abcd3 != "Value") {
                                        Col3 = '<td>0</td>';
                                    }
                                    else if (m == 3 && abcd4 != "Value") {
                                        Col4 = '<td>0</td>';
                                    }
                                    else if (m == 4 && abcd5 != "Value") {
                                        Col5 = '<td>0</td>';
                                    }
                                    else if (m == 5 && abcd6 != "Value") {

                                        Col6 = '<td>0</td>';
                                    }
                                }
                                seg = labels[k];
                            }

                        }

                        for (var j = 0; j < lstResponse.clsCode.length; j++) {
                            if (labels[k] == lstResponse.clsCode[j].segment) {
                                var div = lstResponse.clsCode[j].div;
                                bgColor.push([lstResponse.clsCode[j].backgroundColor]);
                                hbgColor.push([lstResponse.clsCode[j].hoverBackgroundColor]);

                            }
                        }

                        $('#tblLUCH').append(`<tr >
 
                                         <td>${div}${seg}</td>
                                        ${Col1}
                                         ${Col2}
                                         ${Col3}
                                        ${Col4}
                                       ${Col5}
                                        ${Col6}
                                         </tr>`);

                        Col1 = "";
                        Col2 = "";
                        Col3 = "";
                        Col4 = "";
                        Col5 = "";
                        Col6 = "";
                        seg = "";

                        abcd1 = "";
                        abcd2 = "";
                        abcd3 = "";
                        abcd4 = "";
                        abcd5 = "";
                        abcd6 = "";
                    }

                    $('#tblLUCH').append(`<tr >
          <td>Total</td>
           <td id="Col1Total"></td>
           <td id="Col2Total"></td>
           <td id="Col3Total"></td>
           <td id="Col4Total"></td>
           <td id="Col5Total"></td>
           <td id="Col6Total"></td>
           </tr>`);

                    $("#Col1Total").text(Col1Total1);
                    $("#Col2Total").text(abc1);
                    $("#Col3Total").text(Col3Total1);
                    $("#Col4Total").text(Col4Total1);
                    $("#Col5Total").text(Col5Total1);
                    $("#Col6Total").text(Col6Total1);

                    lcuhTotal = parseFloat(lstResponse.clsPortfolioTotal[0].apprLmt.replace(",", "."));

                    lcuhTotal = lcuhTotal.toFixed(2);

                    $("#lcuhTotal").text(lcuhTotal);

                    const lchu = document.getElementById("lchu-chart").getContext('2d');
                    new Chart(lchu, {
                        type: 'doughnut',
                        data: {
                            defaultFontFamily: 'Poppins',
                            datasets: [{

                                data: dt,
                                borderWidth: 1,
                                backgroundColor: bgColor,
                                hoverBackgroundColor: hbgColor

                            }],
                            labels: chartLable,

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

                    $("#dvMainLCHU").hide();
                }
            }

        },
        error: function (xhr, ajaxOptions, thrownError) {
            event.preventDefault();
        }
    });
}

function GetPortfolioData() {

    var dateTime = $("#month").val();
    $.ajax({
        type: "GET",
        url: "/CM/GetPortfolioData?dateTime=" + dateTime + "",
        data: null,
        contentType: false,
        // dataType: "json",
        async: false,
        processData: false,
        success: function (response) {

            if (response != null) {

                var lstResponse = response;
                if (lstResponse.clsPortfolio.length > 0) {
                    $("#dvMainPortfolio").show();
                    $("#pPortfolio").hide();
                    $("#portfolio-chart").width(300);
                    $("#portfolio-chart").height(150);

                    var labels = [];
                    var bgColor = [];
                    var hbgColor = [];
                    var dt = [];
                    $('#tblPortFolio').append(`<tr >
                         <tr>
                                                            <th>Segment</th>
                                                            <th>NO.</th>
                                                            <th>Appr. LMT</th>
                                                            <th>Disbursed</th>
                                                        </tr>
                        </tr>`);
                    for (var i = 0; i < lstResponse.clsPortfolio.length; i++) {

                        for (var j = 0; j < lstResponse.clsCode.length; j++) {
                            if (lstResponse.clsPortfolio[i].segment == lstResponse.clsCode[j].segment) {
                                var div = lstResponse.clsCode[j].div;
                                bgColor.push([lstResponse.clsCode[j].backgroundColor]);
                                hbgColor.push([lstResponse.clsCode[j].hoverBackgroundColor]);
                            }
                        }

                        $('#tblPortFolio').append(`<tr >
                        <td>${div}${lstResponse.clsPortfolio[i].segment}</td>
                        <td>${lstResponse.clsPortfolio[i].no}</td>
                        <td>${lstResponse.clsPortfolio[i].apprLmt}</td>
                        <td>${lstResponse.clsPortfolio[i].disbursed}</td>
                        </tr>`);

                        labels.push(lstResponse.clsPortfolio[i].segment);
                        dt.push([lstResponse.clsPortfolio[i].apprLmt]);
                    }

                    $('#tblPortFolio').append(` <tr >
          <td>Total</td>
           <td id="noValueI"></td>
           <td id="apprLmtValueI"></td>
   <td id="disbursedI"></td>
           </tr>`);

                    let data = "";
                    let noValue = 0;
                    let apprLmtValue = 0;
                    let disbursed = 0

                    for (var i = 0; i < lstResponse.clsPortfolio.length; i++) {
                        const nv = parseFloat(lstResponse.clsPortfolio[i].no.replace(",", "."));
                        const nv1 = parseFloat(lstResponse.clsPortfolio[i].apprLmt.replace(",", "."));
                        const nv2 = parseFloat(lstResponse.clsPortfolio[i].disbursed.replace(",", "."));

                        data += '<tr>' +
                            '<td>' + lstResponse.clsPortfolio[i].segment + '</td>' +
                            '<td>' + nv + '</td>' +
                            '<td>' + nv1 + '</td>' +
                            '<td>' + nv2 + '</td>' +
                            '</tr>';

                        noValue += nv;
                        apprLmtValue += nv1;
                        disbursed += nv2;
                    }

                    noValue = noValue.toFixed(2);
                    apprLmtValue = apprLmtValue.toFixed(2);
                    disbursed = disbursed.toFixed(2);

                    $("#noValueI").text(noValue);
                    $("#apprLmtValueI").text(apprLmtValue);
                    $("#disbursedI").text(disbursed);
                    $("#piChartValue").text(apprLmtValue);

                    const Portfolio = document.getElementById("portfolio-chart").getContext('2d');
                    new Chart(Portfolio, {
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
                    $("#dvMainPortfolio").hide();
                    $("#pPortfolio").show();
                }
            }

        },
        error: function (xhr, ajaxOptions, thrownError) {
            event.preventDefault();
        }
    });
}

//New Development

function GetLUCHData1() {

    var dateTime = $("#month").val();
    $.ajax({
        type: "GET",
        url: "/CM/GetLCHUData1?dateTime=" + dateTime + "",
        data: null,
        contentType: false,
        // dataType: "json",
        async: false,
        processData: false,
        success: function (response) {

            if (response != null) {

                var lstResponse = response;
                if (lstResponse.clsPortfolio.length > 0) {
                    $("#pLCHU").hide();
                    $("#dvMainLCHU").show();
                    $("#lchu-chart").width(300);
                    $("#lchu-chart").height(150);

                    var labels = [];
                    var bgColor = [];
                    var hbgColor = [];
                    var dt = [];
                    $('#tblLUCH').append(`<tr >
                         <tr>
                                                            <th>Segment</th>
                                                            <th>NO.</th>
                                                            <th>Appr. LMT</th>
                                                            <th>Disbursed</th>
                                                        </tr>
                        </tr>`);
                    for (var i = 0; i < lstResponse.clsPortfolio.length; i++) {

                        for (var j = 0; j < lstResponse.clsCode.length; j++) {
                            if (lstResponse.clsPortfolio[i].segment == lstResponse.clsCode[j].segment) {
                                var div = lstResponse.clsCode[j].div;
                                bgColor.push([lstResponse.clsCode[j].backgroundColor]);
                                hbgColor.push([lstResponse.clsCode[j].hoverBackgroundColor]);
                            }
                        }

                        $('#tblLUCH').append(`<tr >
                        <td>${div}${lstResponse.clsPortfolio[i].segment}</td>
                        <td>${lstResponse.clsPortfolio[i].no}</td>
                        <td>${lstResponse.clsPortfolio[i].apprLmt}</td>
                        <td>${lstResponse.clsPortfolio[i].disbursed}</td>
                        </tr>`);

                        labels.push(lstResponse.clsPortfolio[i].segment);
                        dt.push([lstResponse.clsPortfolio[i].apprLmt]);
                    }

                    $('#tblLUCH').append(` <tr >
          <td>Total</td>
           <td id="noValueLCHU"></td>
           <td id="apprLmtValueILCHU"></td>
   <td id="disbursedILCHU"></td>
           </tr>`);

                    let data = "";
                    let noValue = 0;
                    let apprLmtValue = 0;
                    let disbursed = 0

                    for (var i = 0; i < lstResponse.clsPortfolio.length; i++) {
                        const nv = parseFloat(lstResponse.clsPortfolio[i].no.replace(",", "."));
                        const nv1 = parseFloat(lstResponse.clsPortfolio[i].apprLmt.replace(",", "."));
                        const nv2 = parseFloat(lstResponse.clsPortfolio[i].disbursed.replace(",", "."));

                        data += '<tr>' +
                            '<td>' + lstResponse.clsPortfolio[i].segment + '</td>' +
                            '<td>' + nv + '</td>' +
                            '<td>' + nv1 + '</td>' +
                            '<td>' + nv2 + '</td>' +
                            '</tr>';

                        noValue += nv;
                        apprLmtValue += nv1;
                        disbursed += nv2;
                    }

                    noValue = noValue.toFixed(2);
                    apprLmtValue = apprLmtValue.toFixed(2);
                    disbursed = disbursed.toFixed(2);

                    $("#noValueLCHU").text(noValue);
                    $("#apprLmtValueILCHU").text(apprLmtValue);
                    $("#disbursedILCHU").text(disbursed);
                    $("#lcuhTotal").text(apprLmtValue);

                    const lchu = document.getElementById("lchu-chart").getContext('2d');
                    new Chart(lchu, {
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
                    $("#dvMainLCHU").hide();
                    $("#pLCHU").show();
                }
            }

        },
        error: function (xhr, ajaxOptions, thrownError) {
            event.preventDefault();
        }
    });
}

function GetAURData1() {

    var dateTime = $("#month").val();
    $.ajax({
        type: "GET",
        url: "/CM/GetAURData1?dateTime=" + dateTime + "",
        data: null,
        contentType: false,
        // dataType: "json",
        async: false,
        processData: false,
        success: function (response) {

            if (response != null) {

                var lstResponse = response;
                if (lstResponse.clsPortfolio.length > 0) {
                    $("#dvMainAUR").show();
                    $("#aur-chart").width(300);
                    $("#aur-chart").height(150);
                    $("#pAUR").hide();

                    var labels = [];
                    var bgColor = [];
                    var hbgColor = [];
                    var dt = [];
                    $('#tblAUR').append(`<tr >
                         <tr>
                                                            <th>Segment</th>
                                                            <th>NO.</th>
                                                            <th>Appr. LMT</th>
                                                            <th>Disbursed</th>
                                                        </tr>
                        </tr>`);
                    for (var i = 0; i < lstResponse.clsPortfolio.length; i++) {

                        for (var j = 0; j < lstResponse.clsCode.length; j++) {
                            if (lstResponse.clsPortfolio[i].segment == lstResponse.clsCode[j].segment) {
                                var div = lstResponse.clsCode[j].div;
                                bgColor.push([lstResponse.clsCode[j].backgroundColor]);
                                hbgColor.push([lstResponse.clsCode[j].hoverBackgroundColor]);
                            }
                        }

                        $('#tblAUR').append(`<tr >
                        <td>${div}${lstResponse.clsPortfolio[i].segment}</td>
                        <td>${lstResponse.clsPortfolio[i].no}</td>
                        <td>${lstResponse.clsPortfolio[i].apprLmt}</td>
                        <td>${lstResponse.clsPortfolio[i].disbursed}</td>
                        </tr>`);

                        labels.push(lstResponse.clsPortfolio[i].segment);
                        dt.push([lstResponse.clsPortfolio[i].apprLmt]);
                    }

                    $('#tblAUR').append(` <tr >
           <td>Total</td>
           <td id="noValueAUR"></td>
           <td id="apprLmtValueAUR"></td>
           <td id="disbursedAUR"></td>
           </tr>`);

                    let data = "";
                    let noValue = 0;
                    let apprLmtValue = 0;
                    let disbursed = 0

                    for (var i = 0; i < lstResponse.clsPortfolio.length; i++) {
                        const nv = parseFloat(lstResponse.clsPortfolio[i].no.replace(",", "."));
                        const nv1 = parseFloat(lstResponse.clsPortfolio[i].apprLmt.replace(",", "."));
                        const nv2 = parseFloat(lstResponse.clsPortfolio[i].disbursed.replace(",", "."));

                        data += '<tr>' +
                            '<td>' + lstResponse.clsPortfolio[i].segment + '</td>' +
                            '<td>' + nv + '</td>' +
                            '<td>' + nv1 + '</td>' +
                            '<td>' + nv2 + '</td>' +
                            '</tr>';

                        noValue += nv;
                        apprLmtValue += nv1;
                        disbursed += nv2;
                    }

                    noValue = noValue.toFixed(2);
                    apprLmtValue = apprLmtValue.toFixed(2);
                    disbursed = disbursed.toFixed(2);

                    $("#noValueAUR").text(noValue);
                    $("#apprLmtValueAUR").text(apprLmtValue);
                    $("#disbursedAUR").text(disbursed);
                    $("#AURTotal").text(apprLmtValue);

                    const lchu = document.getElementById("aur-chart").getContext('2d');
                    new Chart(lchu, {
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
                    $("#dvMainAUR").hide();
                    $("#pAUR").show();
                }
            }

        },
        error: function (xhr, ajaxOptions, thrownError) {
            event.preventDefault();
        }
    });
}

function GetDelinquencyData1() {
    var filterVal = $("#delDrop").val();
    var dateTime = $("#month").val();
    $.ajax({
        type: "GET",
        url: "/CM/GetDelinquencyData1?delFilterVal=" + filterVal + "&dateTime=" + dateTime + "",
        data: null,
        contentType: false,
        // dataType: "json",
        async: false,
        processData: false,
        success: function (response) {

            if (response != null) {

                var lstResponse = response;
                if (lstResponse.clsPortfolio.length > 0) {
                    $("#dvMainDelq").show();
                    $("#delinquency-chart").width(300);
                    $("#delinquency-chart").height(150);
                    $("#pDelq").hide();

                    var labels = [];
                    var bgColor = [];
                    var hbgColor = [];
                    var dt = [];
                    $('#tblDelinquency').append(`<tr >
                         <tr>
                                                            <th>Segment</th>
                                                            <th>NO.</th>
                                                            <th>Appr. LMT</th>
                                                            <th>Disbursed</th>
                                                        </tr>
                        </tr>`);
                    for (var i = 0; i < lstResponse.clsPortfolio.length; i++) {

                        for (var j = 0; j < lstResponse.clsCode.length; j++) {
                            if (lstResponse.clsPortfolio[i].segment == lstResponse.clsCode[j].segment) {
                                var div = lstResponse.clsCode[j].div;
                                bgColor.push([lstResponse.clsCode[j].backgroundColor]);
                                hbgColor.push([lstResponse.clsCode[j].hoverBackgroundColor]);
                            }
                        }

                        $('#tblDelinquency').append(`<tr >
                        <td>${div}${lstResponse.clsPortfolio[i].segment}</td>
                        <td>${lstResponse.clsPortfolio[i].no}</td>
                        <td>${lstResponse.clsPortfolio[i].apprLmt}</td>
                        <td>${lstResponse.clsPortfolio[i].disbursed}</td>
                        </tr>`);

                        labels.push(lstResponse.clsPortfolio[i].segment);
                        dt.push([lstResponse.clsPortfolio[i].apprLmt]);
                    }

                    $('#tblDelinquency').append(` <tr >
           <td>Total</td>
           <td id="noValueDel"></td>
           <td id="apprLmtValueDel"></td>
           <td id="disbursedDel"></td>
           </tr>`);

                    let data = "";
                    let noValue = 0;
                    let apprLmtValue = 0;
                    let disbursed = 0

                    for (var i = 0; i < lstResponse.clsPortfolio.length; i++) {
                        const nv = parseFloat(lstResponse.clsPortfolio[i].no.replace(",", "."));
                        const nv1 = parseFloat(lstResponse.clsPortfolio[i].apprLmt.replace(",", "."));
                        const nv2 = parseFloat(lstResponse.clsPortfolio[i].disbursed.replace(",", "."));

                        data += '<tr>' +
                            '<td>' + lstResponse.clsPortfolio[i].segment + '</td>' +
                            '<td>' + nv + '</td>' +
                            '<td>' + nv1 + '</td>' +
                            '<td>' + nv2 + '</td>' +
                            '</tr>';

                        noValue += nv;
                        apprLmtValue += nv1;
                        disbursed += nv2;
                    }

                    noValue = noValue.toFixed(2);
                    apprLmtValue = apprLmtValue.toFixed(2);
                    disbursed = disbursed.toFixed(2);

                    $("#noValueDel").text(noValue);
                    $("#apprLmtValueDel").text(apprLmtValue);
                    $("#disbursedDel").text(disbursed);
                    $("#delinquencyTotal").text(apprLmtValue);

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
                    $("#dvMainDelq").hide();
                    $("#pDelq").show();
                }
            }

        },
        error: function (xhr, ajaxOptions, thrownError) {
            event.preventDefault();
        }
    });
}


//HouseKeeping

function GetHouskeepingData() {

    var dateTime = $("#month").val();

    $.ajax({
        type: "GET",
        url: "/CM/GetHouskeepingData?dateTime=" + dateTime + "",
        data: null,
        contentType: false,
        // dataType: "json",
        async: false,
        processData: false,
        success: function (response) {

            if (response != null) {

                var lstResponse = response;

                if (lstResponse.clsHouskeeping.length > 0) {
                    $("#dvHKChart").show();
                    $("#pHubHK").hide();
                    var dSetFinal = [];
                    var lableFinal = [];
                    var eEGData = [];

                    var arrSegment = [];
                    for (var i = 0; i < lstResponse.clsHouskeeping.length; i++) {

                        if (!arrSegment.includes(lstResponse.clsHouskeeping[i].segment)) {
                            arrSegment.push(lstResponse.clsHouskeeping[i].segment);
                        }
                    }

                    for (var d = 0; d < arrSegment.length; d++) {
                        eEGData = [];
                        var filterLst = lstResponse.clsHouskeeping.filter(x => x.segment == arrSegment[d]);

                        if (filterLst.length > 0) {
                            for (var i = 0; i < filterLst.length; i++) {
                                const value2 = filterLst[0].fileName1;

                                if (!lableFinal.includes(value2)) {
                                    lableFinal.push(value2);
                                }
                                const eeGDValue = filterLst[i].sCount;
                                if (lableFinal.includes(filterLst[0].fileName1)) {
                                    eEGData.push(eeGDValue);

                                }
                                else {
                                    eEGData.push(0);
                                }

                                dSetFinal[d] = {
                                    label: arrSegment[d],
                                    data: eEGData,
                                    backgroundColor: filterLst[0].backgroundColor,
                                    borderColor: filterLst[0].hoverBackgroundColor,
                                };
                            }
                        }
                    }

                    DynamicHKBarChart(dSetFinal, lableFinal, 'housekeeping_chart');

                }
                else {
                    $("#dvHKChart").hide();
                    $("#pHubHK").show();
                }
            }

        },
        error: function (xhr, ajaxOptions, thrownError) {
            event.preventDefault();
        }
    });
}

//HUB

function GetPortfolioHubData() {
    var dateTime = $("#month").val();
    $.ajax({
        type: "GET",
        url: "/CM/GetPortfolioHubData?dateTime=" + dateTime + "",
        data: null,
        contentType: false,
        // dataType: "json",
        async: false,
        processData: false,
        success: function (response) {

            if (response != null) {

                var lstResponse = response;

                if (lstResponse.length > 0) {
                    $("#dvHubMainPort").show();
                    $("#pHubPort").hide();
                    var dSetFinal = [];
                    var lableFinal = [];
                    var AgriData = [];
                    var NonAgriData = [];

                    for (var i = 0; i < lstResponse.length; i++) {
                        const cityName = lstResponse[i].cityName;
                        if (!lableFinal.includes(cityName)) {
                            lableFinal.push(cityName);
                        }
                    }

                    for (var j = 0; j < lableFinal.length; j++) {

                        for (var i = 0; i < lstResponse.length; i++) {

                            const value1 = lstResponse[i].agriType;
                            const cityName = lstResponse[i].cityName;
                            if (!dSetFinal.includes(value1)) {
                                dSetFinal.push(value1);
                            }
                            if (lableFinal[j] == cityName) {

                                if (lstResponse[i].agriType == "Agri") {
                                    const cityName = lstResponse[i].cityName;
                                    if (!lableFinal.includes(cityName)) {
                                        lableFinal.push(cityName);
                                    }
                                    const AgriDValue = lstResponse[i].no;
                                    if (lableFinal.includes(cityName)) {
                                        AgriData.push(AgriDValue);
                                    }
                                    else {
                                        AgriData.push(0);
                                    }
                                }
                                else if (lstResponse[i].agriType == "Non Agri") {
                                    const cityName = lstResponse[i].cityName;
                                    if (!lableFinal.includes(cityName)) {
                                        lableFinal.push(cityName);
                                    }
                                    const NonAgriDValue = lstResponse[i].no;
                                    if (lableFinal.includes(cityName)) {
                                        NonAgriData.push(NonAgriDValue);
                                    }
                                    else {
                                        NonAgriData.push(0);
                                    }
                                }
                            }
                        }

                        let t = j + 1;

                        if (AgriData.length != t) {
                            AgriData.push(0);
                        }
                        if (NonAgriData.length != t) {
                            NonAgriData.push(0);
                        }
                    }

                    DynamicPortfolioBarChart(AgriData, NonAgriData, lableFinal, 'portfolio_hub_chart');
                }
                else {
                    $("#dvHubMainPort").hide();
                    $("#pHubPort").show();
                }
            }

        },
        error: function (xhr, ajaxOptions, thrownError) {
            event.preventDefault();
        }
    });
}

function GetLCHUHubData() {
    var dateTime = $("#month").val();
    $.ajax({
        type: "GET",
        url: "/CM/GetLCHUHubData?dateTime=" + dateTime + "",
        data: null,
        contentType: false,
        // dataType: "json",
        async: false,
        processData: false,
        success: function (response) {

            if (response != null) {

                var lstResponse = response;

                if (lstResponse.length > 0) {
                    $("#dvHubMainLCHU").show();
                    $("#pHubLCHU").hide();
                    var dSetFinal = [];
                    var lableFinal = [];
                    var AgriData = [];
                    var NonAgriData = [];

                    for (var i = 0; i < lstResponse.length; i++) {
                        const cityName = lstResponse[i].cityName;
                        if (!lableFinal.includes(cityName)) {
                            lableFinal.push(cityName);
                        }
                    }

                    for (var j = 0; j < lableFinal.length; j++) {

                        for (var i = 0; i < lstResponse.length; i++) {

                            const value1 = lstResponse[i].agriType;
                            const cityName = lstResponse[i].cityName;
                            if (!dSetFinal.includes(value1)) {
                                dSetFinal.push(value1);
                            }
                            if (lableFinal[j] == cityName) {

                                if (lstResponse[i].agriType == "Agri") {
                                    const cityName = lstResponse[i].cityName;
                                    if (!lableFinal.includes(cityName)) {
                                        lableFinal.push(cityName);
                                    }
                                    const AgriDValue = lstResponse[i].no;
                                    if (lableFinal.includes(cityName)) {
                                        AgriData.push(AgriDValue);
                                    }
                                    else {
                                        AgriData.push(0);
                                    }
                                }
                                else if (lstResponse[i].agriType == "Non Agri") {
                                    const cityName = lstResponse[i].cityName;
                                    if (!lableFinal.includes(cityName)) {
                                        lableFinal.push(cityName);
                                    }
                                    const NonAgriDValue = lstResponse[i].no;
                                    if (lableFinal.includes(cityName)) {
                                        NonAgriData.push(NonAgriDValue);
                                    }
                                    else {
                                        NonAgriData.push(0);
                                    }
                                }
                            }
                        }

                        let t = j + 1;

                        if (AgriData.length != t) {
                            AgriData.push(0);
                        }
                        if (NonAgriData.length != t) {
                            NonAgriData.push(0);
                        }
                    }

                    DynamicLCHUBarChart(AgriData, NonAgriData, lableFinal, 'lchu_hub_chart');

                }
                else {
                    $("#dvHubMainLCHU").hide();
                    $("#pHubLCHU").show();
                }
            }

        },
        error: function (xhr, ajaxOptions, thrownError) {
            event.preventDefault();
        }
    });
}

function GetAURHubData() {
    var dateTime = $("#month").val();
    $.ajax({
        type: "GET",
        url: "/CM/GetAURHubData?dateTime=" + dateTime + "",
        data: null,
        contentType: false,
        // dataType: "json",
        async: false,
        processData: false,
        success: function (response) {

            if (response != null) {

                var lstResponse = response;

                if (lstResponse.length > 0) {
                    $("#dvHubMainAUR").show();
                    $("#pHubAUR").hide();
                    var dSetFinal = [];
                    var lableFinal = [];
                    var AgriData = [];
                    var NonAgriData = [];

                    for (var i = 0; i < lstResponse.length; i++) {
                        const cityName = lstResponse[i].cityName;
                        if (!lableFinal.includes(cityName)) {
                            lableFinal.push(cityName);
                        }
                    }

                    for (var j = 0; j < lableFinal.length; j++) {

                        for (var i = 0; i < lstResponse.length; i++) {

                            const value1 = lstResponse[i].agriType;
                            const cityName = lstResponse[i].cityName;
                            if (!dSetFinal.includes(value1)) {
                                dSetFinal.push(value1);
                            }
                            if (lableFinal[j] == cityName) {

                                if (lstResponse[i].agriType == "Agri") {
                                    const cityName = lstResponse[i].cityName;
                                    if (!lableFinal.includes(cityName)) {
                                        lableFinal.push(cityName);
                                    }
                                    const AgriDValue = lstResponse[i].no;
                                    if (lableFinal.includes(cityName)) {
                                        AgriData.push(AgriDValue);
                                    }
                                    else {
                                        AgriData.push(0);
                                    }
                                }
                                else if (lstResponse[i].agriType == "Non Agri") {
                                    const cityName = lstResponse[i].cityName;
                                    if (!lableFinal.includes(cityName)) {
                                        lableFinal.push(cityName);
                                    }
                                    const NonAgriDValue = lstResponse[i].no;
                                    if (lableFinal.includes(cityName)) {
                                        NonAgriData.push(NonAgriDValue);
                                    }
                                    else {
                                        NonAgriData.push(0);
                                    }
                                }
                            }
                        }

                        let t = j + 1;

                        if (AgriData.length != t) {
                            AgriData.push(0);
                        }
                        if (NonAgriData.length != t) {
                            NonAgriData.push(0);
                        }
                    }

                    DynamicAURBarChart(AgriData, NonAgriData, lableFinal, 'aur_hub_chart');

                }
                else {
                    $("#dvHubMainAUR").hide();
                    $("#pHubAUR").show();
                }
            }

        },
        error: function (xhr, ajaxOptions, thrownError) {
            event.preventDefault();
        }
    });
}

function GetDelinquencyHubData() {
    debugger;
    var dateTime = $("#month").val();
    var filterVal = $("#delDrop").val();
    $.ajax({
        type: "GET",
        url: "/CM/GetDelinquencyHubData?delFilterVal=" + filterVal + "&dateTime=" + dateTime + "",
        data: null,
        contentType: false,
        // dataType: "json",
        async: false,
        processData: false,
        success: function (response) {

            if (response != null) {

                var lstResponse = response;
                debugger;
                if (lstResponse.length > 0) {
                    $("#dvHubMainDelq").show();
                    $("#pHubDelq").hide();
                    var dSetFinal = [];
                    var lableFinal = [];
                    var AgriData = [];
                    var NonAgriData = [];

                    for (var i = 0; i < lstResponse.length; i++) {
                        const cityName = lstResponse[i].cityName;
                        if (!lableFinal.includes(cityName)) {
                            lableFinal.push(cityName);
                        }
                    }

                    for (var j = 0; j < lableFinal.length; j++) {

                        for (var i = 0; i < lstResponse.length; i++) {

                            const value1 = lstResponse[i].agriType;
                            const cityName = lstResponse[i].cityName;
                            if (!dSetFinal.includes(value1)) {
                                dSetFinal.push(value1);
                            }
                            if (lableFinal[j] == cityName) {

                                if (lstResponse[i].agriType == "Agri") {
                                    const cityName = lstResponse[i].cityName;
                                    if (!lableFinal.includes(cityName)) {
                                        lableFinal.push(cityName);
                                    }
                                    const AgriDValue = lstResponse[i].no;
                                    if (lableFinal.includes(cityName)) {
                                        AgriData.push(AgriDValue);
                                    }
                                    else {
                                        AgriData.push(0);
                                    }
                                }
                                else if (lstResponse[i].agriType == "Non Agri") {
                                    const cityName = lstResponse[i].cityName;
                                    if (!lableFinal.includes(cityName)) {
                                        lableFinal.push(cityName);
                                    }
                                    const NonAgriDValue = lstResponse[i].no;
                                    if (lableFinal.includes(cityName)) {
                                        NonAgriData.push(NonAgriDValue);
                                    }
                                    else {
                                        NonAgriData.push(0);
                                    }
                                }
                            }
                        }

                        let t = j + 1;

                        if (AgriData.length != t) {
                            AgriData.push(0);
                        }
                        if (NonAgriData.length != t) {
                            NonAgriData.push(0);
                        }
                    }

                    DynamicDelqBarChart(AgriData, NonAgriData, lableFinal, 'delinquency_hub_chart');

                }
                else {
                    $("#dvHubMainDelq").hide();
                    $("#pHubDelq").show();
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            event.preventDefault();
        }
    });
}

var myLCHUBarChart = null
var config = { options: {}, type: 'bar' }

function DynamicLCHUBarChart(Agridata, NonAgri, lableFinal, chartName) {

    var ctx = document.getElementById(chartName).getContext('2d');
    config.data = {
        labels: lableFinal,
        datasets:
            [{
                label: 'Agri',
                data: Agridata,
                backgroundColor: "#2B9863"
            },
            {
                label: 'Non Agri',
                data: NonAgri,
                backgroundColor: "#F06338"
            }
            ]
    };
    if (myLCHUBarChart == null) {
        myLCHUBarChart = new Chart(ctx, config);
    } else {
        myLCHUBarChart.update()
    }
}

var myAURBarChart = null
var configAUR = { options: {}, type: 'bar' }

function DynamicAURBarChart(Agridata, NonAgri, lableFinal, chartName) {

    var ctxAUR = document.getElementById(chartName).getContext('2d');
    configAUR.data = {
        labels: lableFinal,
        datasets:
            [{
                label: 'Agri',
                data: Agridata,
                backgroundColor: "#2B9863"
            },
            {
                label: 'Non Agri',
                data: NonAgri,
                backgroundColor: "#F06338"
            }
            ]
    };
    if (myAURBarChart == null) {
        myAURBarChart = new Chart(ctxAUR, configAUR);
    } else {
        myAURBarChart.update()
    }
}

var myPortfolioBarChart = null
var configPortfolio = { options: {}, type: 'bar' }

function DynamicPortfolioBarChart(Agridata, NonAgri, lableFinal, chartName) {


    var ctxPortfolio = document.getElementById(chartName).getContext('2d');
    configPortfolio.data = {
        labels: lableFinal,
        datasets:
            [{
                label: 'Agri',
                data: Agridata,
                backgroundColor: "#2B9863"
            },
            {
                label: 'Non Agri',
                data: NonAgri,
                backgroundColor: "#F06338"
            }
            ]
    };
    if (myPortfolioBarChart == null) {
        myPortfolioBarChart = new Chart(ctxPortfolio, configPortfolio);
    } else {
        myPortfolioBarChart.update()
    }
}

var myDelqBarChart = null
var configDelq = { options: {}, type: 'bar' }

function DynamicDelqBarChart(Agridata, NonAgri, lableFinal, chartName) {


    var ctxDelq = document.getElementById(chartName).getContext('2d');
    configDelq.data = {
        labels: lableFinal,
        datasets:
            [{
                label: 'Agri',
                data: Agridata,
                backgroundColor: "#2B9863"
            },
            {
                label: 'Non Agri',
                data: NonAgri,
                backgroundColor: "#F06338"
            }
            ]
    };
    if (myDelqBarChart == null) {
        myDelqBarChart = new Chart(ctxDelq, configDelq);
    } else {
        myDelqBarChart.update()
    }
}

var myHousekeepingBarChart = null
var configHK = { options: {}, type: 'bar' }

function DynamicHKBarChart(dataset, lableFinal, chartName) {


    var ctxHK = document.getElementById(chartName).getContext('2d');
    configHK.data = {
        labels: lableFinal,
        datasets: dataset

    };
    if (myHousekeepingBarChart == null) {
        myHousekeepingBarChart = new Chart(ctxHK, configHK);
    } else {
        myHousekeepingBarChart.update()
    }
}