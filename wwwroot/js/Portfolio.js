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
        $("#tblPortFolio").empty();
        $("#tblPortfolioSummary").empty();
        $('#tblABCCat').empty();
        $('#legend').empty();
        $('#tblIndustry').empty();
        $('#tblRiskCategories').empty();
        GetPortfolioData();

    });
    if (onDatChange != 1) {
        GetPortfolioData();
    }
});

function GetPortfolioData() {
    var dateTime = $("#month").val();

    $.ajax({
        type: "GET",
        url: "/CM/GetPortfolioPageData?dateTime=" + dateTime + "",
        data: null,
        contentType: false,
        // dataType: "json",
        async: false,
        processData: false,
        success: function (response) {

            if (response != null) {

                var lstResponse = response;

                if (lstResponse.clsPortfolio.length > 0) {

                    $("#dvSegment").show();
                    $("#pSegment").hide();

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
                                                            <th>Utilization</th>
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
                        <td>${lstResponse.clsPortfolio[i].apprLmt}</td>
                        </tr>`);

                        labels.push(lstResponse.clsPortfolio[i].segment);
                        dt.push([lstResponse.clsPortfolio[i].apprLmt]);
                    }

                    $('#tblPortFolio').append(` <tr >
          <td>Total</td>
           <td id="noValueI"></td>
           <td id="apprLmtValueI"></td>
   <td id="disbursedI"></td>
<td id="utilizationId"></td>
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
                            '<td>' + nv1 + '</td>' +
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
                    $("#utilizationId").text(apprLmtValue);

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
                    $("#dvSegment").hide();
                    $("#pSegment").show();
                }

                if (lstResponse.dataTable.length > 0) {

                    $("#dvSummary").show();
                    $("#pSummary").hide();

                    var col = [];
                    for (var i = 0; i < 1; i++) {
                        for (var key in lstResponse.dataTable[i]) {
                            if (col.indexOf(key) === -1) {
                                var columnArray = {};
                                columnArray.data = key;
                                columnArray.title = key.toUpperCase();
                                col.push(columnArray);
                            }
                        }
                    }
                    $('#tblPortfolioSummary').DataTable({
                        data: lstResponse.dataTable,
                        columns: col,
                        "columnDefs": [
                            {
                                "targets": [0],
                                'width': '30px',
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
                    $("#dvSummary").hide();
                    $("#pSummary").show();
                }

                ///////////// Trend Chart ////////////

                var TrendChart = document.getElementById("TrendChart").getContext('2d');
                if (lstResponse.trend.length > 0) {
                    $("#dvTrend").show();
                    $("#pTrend").hide();
                    var labels = [];
                    var expData = [];
                    var accData = [];
                    const monthNames1 = ["January", "February", "March", "April", "May", "June",
                        "July", "August", "September", "October", "November", "December"
                    ];
                    for (var l = 0; l < monthNames1.length; l++) {
                        for (var i = 0; i < lstResponse.trend.length; i++) {

                            if (monthNames1[l] == lstResponse.trend[i].monthName) {
                                labels.push(lstResponse.trend[i].monthName);
                                expData.push(lstResponse.trend[i].exposure);
                                accData.push(lstResponse.trend[i].sCount);
                            }

                        }
                        if (!labels.includes(monthNames1[l])) {
                            expData.push(0);
                            accData.push(0);
                        }
                    }

                    var barChart = new Chart(TrendChart, {
                        type: 'bar',
                        data: {
                            labels: monthNames1,
                            datasets: [{
                                label: 'Exposure (Rs. in Crores)',
                                data: expData,
                                backgroundColor: "#F06338"
                            },
                            {
                                label: 'No. of Accounts',
                                data: accData,
                                backgroundColor: "#4BB3F6"
                            },

                            ]
                        },
                        options: {
                            legend: {
                                display: false,
                                position: 'bottom',

                            }
                        },
                        legendCallback: function (chart) {
                            var text = [];
                            text.push('<ul class="' + chart.id + '-legend">');
                            for (var i = 0; i < chart.data.datasets.length; i++) {
                                text.push('<li><div class="legendValue"><span style="background-color:' + chart.data.datasets[i].backgroundColor + '">&nbsp;&nbsp;&nbsp;&nbsp;</span>');

                                if (chart.data.datasets[i].label) {
                                    text.push('<span class="label"><p>' + chart.data.datasets[i].label + '</p></span>');
                                }

                                text.push('</div></li><div class="clear"></div>');
                            }

                            text.push('</ul>');

                            return text.join('');
                        },
                    });

                    $('#legend').prepend(barChart.generateLegend());
                }
                else {
                    $("#dvTrend").hide();
                    $("#pTrend").show();
                }

                $('#tblABCCat').append(` <tr >
          
                            <th></th>
                            <th>NO.</th>
                            <th>Exposure CR</th>
                            <th>Utilisation</th>
            
           </tr> `);

                if (lstResponse.abcCategores.length > 0) {
                    $("#dvABCCategories").show();
                    $("#pABCCategories").hide();
                    for (var t = 0; t < lstResponse.abcCategores.length; t++) {
                        $('#tblABCCat').append(` <tr >
                                        <td>${lstResponse.abcCategores[t].categories}</td>
                                        <td>${lstResponse.abcCategores[t].no}</td>
                                        <td>${lstResponse.abcCategores[t].exposure}</td>
                                        <td>${lstResponse.abcCategores[t].utilization}</td>
           </tr> `);
                    }
                }
                else {
                    $("#dvABCCategories").hide();
                    $("#pABCCategories").show();
                }

                $('#tblRiskCategories').append(` <tr >
                            <th></th>
                            <th>No of A/C</th>
                            <th>Exposure CR</th>
                            <th>Utilisation</th>
            
           </tr> `);

                if (lstResponse.riskCategories.length > 0) {
                    $("#dvRiskCat").show();
                    $("#pRiskCat").hide();

                    for (var v = 0; v < lstResponse.riskCategories.length; v++) {
                        $('#tblRiskCategories').append(` <tr >
                                        <td>${lstResponse.riskCategories[v].riskType}</td>
                                        <td>${lstResponse.riskCategories[v].no}</td>
                                        <td>${lstResponse.riskCategories[v].exposure}</td>
                                        <td>${lstResponse.riskCategories[v].utilization}</td>
           </tr> `);
                    }
                }
                else {
                    $("#dvRiskCat").hide();
                    $("#pRiskCat").show();
                }

                $('#tblIndustry').append(` <tr >
                            <th>Industry</th>
                                    <th>NO.</th>
                                    <th>Appr. LMT</th>
           </tr> `);
                debugger;
                let total = 0;
                var indlabels = [];
                var indbgColor = [];
                var indhbgColor = [];
                var inddt = [];
                if (lstResponse.industryWise.length > 0) {

                    $("#dvIndustrywise").show();
                    // $("#dvIndustryTable").show();
                    $("#pIndustrywise").hide();
                    $("#industry-chart").width(300);
                    $("#industry-chart").height(150);

                    for (var w = 0; w < lstResponse.industryWise.length; w++) {
                        total += parseInt(lstResponse.industryWise[w].count);

                        for (var g = 0; g < lstResponse.clsCodeIndustryColor.length; g++) {
                            if (lstResponse.industryWise[w].industy == lstResponse.clsCodeIndustryColor[g].segment) {
                                indbgColor.push([lstResponse.clsCodeIndustryColor[g].backgroundColor]);
                                indhbgColor.push([lstResponse.clsCodeIndustryColor[g].hoverBackgroundColor]);
                                inddt.push(lstResponse.industryWise[w].value);
                                indlabels.push(lstResponse.industryWise[w].industy)
                                var div1 = lstResponse.clsCodeIndustryColor[g].div;
                            }
                        }

                        $('#tblIndustry').append(` <tr >
                                        <td>${div1}${lstResponse.industryWise[w].industy}</td>
                                        <td>${lstResponse.industryWise[w].count}</td>
                                        <td>${lstResponse.industryWise[w].value}</td>
           </tr> `);

                    }
                }
                else {
                    total = 0;
                    $("#dvIndustrywise").hide();
                    //$("#dvIndustryTable").hide();
                    $("#pIndustrywise").show();
                }
                $("#totalOfIndusryCount").text(total);

                const Portfolio = document.getElementById("industry-chart").getContext('2d');
                new Chart(Portfolio, {
                    type: 'doughnut',
                    data: {
                        defaultFontFamily: 'Poppins',
                        datasets: [{
                            data: inddt,
                            borderWidth: 1,
                            backgroundColor: indbgColor,
                            hoverBackgroundColor: indhbgColor
                        }],
                        labels: indlabels,
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        legend: false,
                        cutoutPercentage: 70
                    }
                });
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            event.preventDefault();
        }
    });
}