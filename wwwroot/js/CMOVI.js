$(document).ready(function () {

    $("[id$=txt_custname]").on('change', function () {
        debugger;
        var result = document.getElementById('txt_custname').value;
        document.location.href = '/CMOnewView/CMOneViewIndicator/?SearchText=' + result;
    });
    $(".btn_remove_txtSearch").on("click", function () {
        document.location.href = '/CMOnewView/CMOneViewIndicator';
    });







})