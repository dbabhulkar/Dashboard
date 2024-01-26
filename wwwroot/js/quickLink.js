
// added code to filter data from accordion.



$(document).ready(function () {
    //$('#quicklink').on('hidden.bs.modal', function () {

    //    generateAccordion('getAll', '');
    //})
    $("#txt_QuickLinkSearch").val('');
    //$("#accordion").accordion();
    $("#divScroll").show();

    $("#btnAppLink").click(function () {
        generateAccordion('getAll', '');
        $("#txt_QuickLinkSearch").val('');
        $("#addquicklinks").hide();
    });

    //$("#btnSaveLink").click(function () {
    //    SubmitClick();
    //});
    $("#btnSaveLinkNew").click(function () {
        SubmitClick();
    });

    //$("#btnAddLink").click(function () {
    //    $("#addlinks").css('visibility', 'visible');
    //    $("#divScroll").hide();
    //});
    $("#btnAddLinkNew").click(function () {
        $("#IsFrequentlyUsed").prop("checked", false);
        $("#txtDescriptionNew").val('');
        $("#txtRecordIdnew").text('');
        $("#txtRecordIdnew").val('');

        $("#addquicklinks").show();
        $("#txtNameNew").val('');
        $("#txturlLinkNew").val('');
        //$("#addquicklinks").hide();
    });
    //$("#btnCloseLink").click(function () {
    //    $("#addlinks").css('visibility', 'hidden');
    //    $("#divScroll").hide();
    //    generateAccordion();
    //});

    $("#txturlLink").focusout(function () {
        CheckExists();
    });

    $("#txtName").focusout(function () {
        var urlName = $("#txt_name").val();
        if (urlName == '') {
            toastr.error('Please enter name.')
        }
    });

    //$("#btnDeleteLink").click(function () {
    //    confirmAction();
    //});
    $("#btnDeleteLinkNew").click(function () {
        confirmAction();
    });

    $("#txt_QuickLinkSearch").on("keyup click input", function () {
        debugger;
        if ($("#txt_QuickLinkSearch").val() != '') {
            generateAccordion('getBySearch', $("#txt_QuickLinkSearch").val());
            $('#linkRow').html('');
        }
        else {
            generateAccordion('getAll', '');
            $("#noData").html('');
        }
        //var val = $(this).val();
        //if (val.length) {
        //    val = val.trim();

        //    $("#accordion .accordion-section").hide().filter(function () {
        //        if ($('.header-default', this).text().toLowerCase().indexOf(val.toLowerCase()) > -1 == true) {
        //            $("#noData").html('')
        //            return $('.header-default', this).text().toLowerCase().indexOf(val.toLowerCase()) > -1;
        //        }
        //    }).show();
        //}
        //else {
        //    $("#accordion .accordion-section").show();
        //    $("#noData").html('')
        //}

        //if ($('.header-default').is(':visible') == false) {
        //    $("#noData").html('<h4>No Links found</h4>');
        //} else {
        //    $("#noData").html('')
        //}
    });
});

// used to Validate UrlLink.
function isValidHttpUrl(string) {
    var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
    return regexp.test(string);
}

// use To check url Aready exists or not in the db.
function CheckExists() {

    var urlLink = $("#txturlLinkNew").val();
    var recordId = $("#txtRecordIdnew").val();

    if (recordId == null && recordId == "") {
        recordId = 0;
    }

    var data = {};
    data.urlLink = urlLink;
    data.recordId = recordId;
    var urlUrlLinkExists = false;

    $.ajax({
        type: "POST",
        url: "/Home/ValidateUrl?recordId=" + data.recordId + "&urlLink=" + data.urlLink,
        data: null,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        processData: false,
        success: function (data) {
            if (data != null) {
                if (data.d == "Exists") {
                    toastr.error('Url already exists');
                    urlUrlLinkExists = true;
                } else {
                    if (isUrl == false) {
                        toastr.error('Please enter valid link.');
                        urlUrlLinkExists = true;
                    } else {
                        urlUrlLinkExists = false;
                    }
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {

        }, complete: function (e) {
            debugger;
            var isUrl = isValidHttpUrl(urlLink);
            // Handle the complete event
            if (e.responseText == "Exists") {
                toastr.error('Url already exists');
                return false;
            } else {
                if (isUrl == false) {
                    toastr.error('Please enter valid link.');
                    return false;
                }
            }
        }
    });
    return urlUrlLinkExists;
}

// Save Link
function SubmitClick() {
    debugger;
    var isUrlExists = CheckExists();

    var urlName = $("#txtNameNew").val();
    if (urlName == '') {
        toastr.error('Please enter url name!')
        return false;
    }

    var urlstring = $("#txturlLinkNew").val();

    if (isUrlExists == false) {

        var isUrl = isValidHttpUrl(urlstring);

        if (isUrl == false) {
            toastr.error('Please enter valid url!')
            return false;
        }
        var description = $("#txtDescriptionNew").val();
        var IsFrequenltyUsed;
        if ($("#IsFrequentlyUsed").prop('checked') == true) {
            IsFrequenltyUsed = 1;
        }
        else {
            IsFrequenltyUsed = 0;
        }
        var recordId = $("#txtRecordIdnew").val();

        if (recordId == null) {
            recordId = 0; btnDeleteLinkNew
        }

        var data = {};
        data.recordId = recordId;
        data.urlName = urlName;
        data.urlLink = urlstring;
        data.description = description;

        $.ajax({
            type: "POST",
            url: "/Home/saveRecord?recordId=" + data.recordId + "&urlName=" + data.urlName
                + "&urlLink=" + data.urlLink + "&description=" + data.description + "&IsFrequenltyUsed=" + IsFrequenltyUsed,
            //url: "saveRecord",
            data: null,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            processData: false,
            success: function (data) {
                debugger;

            },
            error: function (xhr, ajaxOptions, thrownError) {
                // toastr.error(xhr.);
            },
            complete: function (e) {
                debugger;
                if (recordId == "") {
                    toastr.success('Record save successfully.');
                    $("#btnDeleteLinkNew").css('visibility', 'visible');
                    generateAccordion('getAll', '');
                    //$("#addlinks").css('visibility', 'hidden');
                    $("#addquicklinks").hide();
                } else {
                    toastr.success('Record updated successfully.');
                    $("#addquicklinks").hide();
                    generateAccordion('getAll', '');
                }
                if (data != null) {
                    $("#txtRecordIdnew").text(e.responseText);
                    $("#txtRecordIdnew").val(e.responseText);
                }
            }
        });

    }
}

// added to Generate Accordion Content Dynamically.
function generateAccordion(action, name) {
    debugger;
    $("#accordion").html('');
    $('#linkRow').html('');
    $('#frequentlyUsedRow').html('');
    $.ajax({
        type: "POST",
        url: "/Home/GetLinkData?Identflag=" + action + "&Name=" + name,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response != null) {
                if (action == 'getAll') {
                    $("#frequentlyBlock").show();
                    var FrequentlyUsedLinks = response.tbL_FrequentlyUsedLinks;
                    if (FrequentlyUsedLinks.length > 0) {
                        var FrequentHtml = ''; var HtmlNewData = '';
                        for (var i = 0; i < FrequentlyUsedLinks.length; i++) {
                            FrequentHtml += '<div class="col-md-2 form-group"><div class="card"><div class="card-body">';
                            FrequentHtml += '<i class="icon-link"></i><a ID="a_' + FrequentlyUsedLinks[i].recordId + '" href="' + FrequentlyUsedLinks[i].link + '" target="_blank" rel="noopener noreferrer"><p>' + FrequentlyUsedLinks[i].name + '</P></a>';
                            FrequentHtml += '</div></div>';
                            FrequentHtml += '<a class="btn btn-primary btn-fetch btn btn-edit linkremove" onclick="editLink(\'' + FrequentlyUsedLinks[i].recordId + '\',\'' + FrequentlyUsedLinks[i].name + '\',\'' + FrequentlyUsedLinks[i].link + '\',\'' + FrequentlyUsedLinks[i].isFrequentlyUsed + '\',\'' + FrequentlyUsedLinks[i].link_Description + '\')" id="lnkedit_' + FrequentlyUsedLinks[i].recordId + '"><i class="fa fa-pencil"></i></a></div>';
                        }
                        HtmlNewData += FrequentHtml;
                        $('#frequentlyUsedRow').append(HtmlNewData);

                    }
                }
                else {
                    $("#frequentlyBlock").hide();
                    $('#frequentlyUsedRow').html('');
                    $('#linkRow').html('');
                }


                var lnkData = response.tbL_All_links;
                if (lnkData.length > 0) {
                    var DataHtml = ''; var QuickLinksHtml = '';
                    for (var i = 0; i < lnkData.length; i++) {
                        QuickLinksHtml += '<div class="col-md-2 form-group"><div class="card"><div class="card-body">';
                        QuickLinksHtml += '<i class="icon-link"></i><a ID="a_' + lnkData[i].recordId + '" href="' + lnkData[i].link + '" target="_blank" rel="noopener noreferrer"><p>' + lnkData[i].name + '</P></a>';
                        QuickLinksHtml += '</div></div>';
                        QuickLinksHtml += '<a class="btn btn-primary btn-fetch btn btn-edit linkremove" onclick="editLink(\'' + lnkData[i].recordId + '\',\'' + lnkData[i].name + '\',\'' + lnkData[i].link + '\',\'' + lnkData[i].isFrequentlyUsed + '\',\'' + lnkData[i].link_Description + '\')" id="lnkedit_' + lnkData[i].recordId + '"><i class="fa fa-pencil"></i></a></div>';
                    }
                    DataHtml += QuickLinksHtml;
                    $('#linkRow').append(DataHtml);
                    $("#noDataFound").html('');
                    //var htmldata = ''; var accordianhtml = '';
                    //var lnkdata = response.tbL_All_links;
                    //for (var i = 0; i < lnkdata.length; i++) {
                    //    var lnkid = "addlinks";

                    //    accordianhtml += ' <div id="quicklinks" class="accordion accordion-no-gutter accordion-bordered">';
                    //    accordianhtml += ' <div class="accordion__item quick-link-accordian">';
                    //    accordianhtml += '<div class="accordion__header" data-toggle="collapse" data-target="#bordered_no-gutter_' + lnkdata[i].recordid + '">';
                    //    accordianhtml += '  <span class="accordion__header--text">' + lnkdata[i].urlname;
                    //    accordianhtml += '</span>';
                    //    accordianhtml += ' <span class="accordion__header--indicator style_two"></span>';

                    //    accordianhtml += '</div>';

                    //    accordianhtml += '<div id="bordered_no-gutter_' + lnkdata[i].recordid + '" class="collapse accordion__body" data-parent="#quicklinks">';
                    //    accordianhtml += '<div class="accordion__body--text">';
                    //    accordianhtml += '<div> <label class="accordian-lable" id="lnk_link_' + lnkdata[i].recordid + '" >link : </label>'
                    //    accordianhtml += ' <a class="accordian-link" id="a_' + lnkdata[i].recordid + '" href="' + lnkdata[i].urllink + '" target="_blank" >' + lnkdata[i].urllink + ' </a>';
                    //    accordianhtml += '<a class="btn btn-primary btn-fetch" style="float:right" onclick="editlink(\'' + lnkdata[i].recordid + '\',\'' + lnkdata[i].urlname + '\',\'' + lnkdata[i].urllink + '\',\'' + lnkdata[i].description + '\')" id="lnkedit_' + lnkdata[i].recordid + '"  class="btn btn-edit linkremove"  ><i class="fa fa-pencil"></i></a></div>';
                    //    accordianhtml += '<div> <label class="accordian-lable" id="lnk_description_' + lnkdata[i].recordid + '"  >description : </label>'
                    //    accordianhtml += ' <label class="accordian-description" id = "lnk_link_' + lnkdata[i].recordid + '" style="font-weight:normal" > ' + lnkdata[i].description + ' </label > </div>';
                    //    accordianhtml += '</div>';
                    //    accordianhtml += '</div>';
                    //    accordianhtml += '</div></div>';

                    //}

                    //htmldata += accordianhtml;

                    ////$("#accordion").html('');
                    //$('#accordion').append(htmldata);
                    //$("#nodata").html('');
                    var Roles = $("#UserRoleHidden").val();
                    //if (Roles == 'Business Head') {
                    if (Roles == 'EW - Manager') {
                        $(".btn-edit").css("display", "block");
                    }
                    else {
                        $(".btn-edit").css("display", "none");
                    }

                }
                else {
                    $("#noDataFound").html('<h4>No Links found</h4>');
                }
            }
            // alert(names);
        },
        failure: function (response) {
            //alert(response.d);
        }
    });
}


function editLink(id, Name, link, isFrequentlyUsed, Description) {

    if (isFrequentlyUsed == 1) {
        $('#IsFrequentlyUsed').prop('checked', true);
    }
    else {
        $('#IsFrequentlyUsed').prop('checked', false);
    }
    $("#txtNameNew").val(Name);
    $("#txturlLinkNew").val(link);
    $("#txtDescriptionNew").val(Description);
    $("#txtRecordIdnew").text(id);
    $("#txtRecordIdnew").val(id);
    //$("#divScroll").hide();
    $("#addquicklinks").show();
    //$("#addlinks").css('visibility', 'visible');
    $("#btnDeleteLinkNew").css('visibility', 'visible');

}

function confirmAction() {
    let confirmAction = confirm("Are you sure you want to Delete this record?");
    if (confirmAction) {
        event.preventDefault();
        event.stopPropagation();
        deleteRecord();
        //generateAccordion('getAll','');
    } else {
        event.preventDefault();
        event.stopPropagation();
        return false;
    }
}

// added to delete Records from accordion.
function deleteRecord() {
    debugger;
    var _Recordid = $("#txtRecordIdnew").val();

    $.ajax({
        type: "POST",
        url: "/Home/deleteRecord?recordId=" + _Recordid,
        data: null,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        processData: false,
        success: function (data) {

            $("#txtRecordIdnew").text('');
            $("#txtRecordIdnew").val('');

            generateAccordion('getAll', '');
            //$("#addlinks").css('visibility', 'hidden');
            //$("#divScroll").show();
            toastr.success('Record deleted successfully.');
        },
        error: function (xhr, ajaxOptions, thrownError) {
            event.preventDefault();
        },
        complete: function (e) {

            $("#txtRecordIdnew").text('');
            $("#txtRecordIdnew").val('');
            generateAccordion('getAll', '');
            //$("#addlinks").css('visibility', 'hidden');
            $("#addquicklinks").hide();
            toastr.success('Record deleted successfully.');
            $("#btnDeleteLinkNew").css('visibility', 'hidden');
        }
    });
}