using Dashboard.Interfaces;
using Dashboard.Models;
using Dashboard.Repositories;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using System.Data;
using System.Data.SqlClient;

namespace Dashboard.Controllers
{
    [CustomFilter]
    public class UploadController : Controller
    {
        private readonly ISession _session;
        readonly ILogger _logger;
        string tableName = "";
        string MonthYear = "";
        private readonly IDashboard _dashboard;
        SqlConnection sqlCon;
        SqlCommand cmd;
        //SqlConnection sqlCon = SqlHelper.openCon();
        public UploadController()
        {
            _dashboard = new DashboardRepository();
        }
        public IActionResult Index()
        {

            // ViewBag.Message = TempData["Message"];
            Portfolio port = new Portfolio();
            List<SelectListItem> rmItem = new List<SelectListItem>()
            {
                 new SelectListItem{Text="Select Type",Value="0"},
                new SelectListItem{Text="Portfolio Upload",Value="1"},
                new SelectListItem{Text="APRs Upload",Value="2"},
                new SelectListItem{Text="RM Hierarchy Mapping Upload",Value="3"},
                new SelectListItem{Text="Client RM Mapping Upload",Value="4"},
                new SelectListItem{Text="Fresh Leads Upload",Value="5"},
                //new SelectListItem{Text="AssetPricing_APR_Upload",Value="6"},
                //new SelectListItem{Text="Facility Master",Value="7"},
                //new SelectListItem{Text="Facility Instruction Master",Value="10"},
                //new SelectListItem{Text="Charges Master",Value="8"},
                //new SelectListItem{Text="Account Customization Waiver Master",Value="9"},
                //new SelectListItem{Text="Security Type Master",Value="11"},
                new SelectListItem{Text="Delinquency Customer",Value="12"},
                new SelectListItem{Text="Delinquency Account",Value="13"},
                new SelectListItem{Text="Compliance",Value="14"},
                new SelectListItem{Text="Acquisitions",Value="15"},
                new SelectListItem{Text="Acquisitions SFR SLA AMB",Value="16"},
            };

            List<SelectListItem> cmItem =
            new List<SelectListItem>()
            {
            #region Ganesh Added for CM View
            new SelectListItem{Text="Portfolio - Template",Value="101"},
            new SelectListItem{Text="Housekeeping - Template",Value="102"},
            new SelectListItem{Text="AUR-Upload",Value="103"},
            new SelectListItem{Text="Dashboard LCHU History",Value="104"},
            new SelectListItem{Text="Delinquency Upload",Value="105"},
            new SelectListItem{Text="Watch List Upload",Value="106"}
            #endregion
            };

            //List<SelectListItem> CM_EW_MGR_Item =
            //    new List<SelectListItem>()
            //{

            //    new SelectListItem{Text="Delinquency Upload",Value="20"},

            //};
            try
            {
                sqlCon = new SqlConnection(clsConnectionString.GetConnectionString());
                if (HttpContext.Session.GetString("sectionType").ToString() == "RMView")
                {
                    port.FileType = rmItem;

                }
                else if (HttpContext.Session.GetString("sectionType").ToString() == "CMView")
                {
                    port.FileType = cmItem;
                    _dashboard.CaptureProductivityDetails(sqlCon, HttpContext.Session.GetString("EmpName").ToString().Trim(), "Upload", "OneViewIndicator-CM", 1, "UploadMaster", "Upload Master View for EmpCode - " + HttpContext.Session.GetString("EmpId").ToString().Trim());
                }
                _dashboard.CaptureProductivityDetails(sqlCon, HttpContext.Session.GetString("EmpName").ToString().Trim(), "Upload", "OneViewIndicator-RM", 1, "UploadMaster", "Upload Master View for EmpCode - " + HttpContext.Session.GetString("EmpId").ToString().Trim());
                sqlCon.Close();
            }
            catch (Exception ex)
            {

            }
            finally
            {
                if ((sqlCon != null) && (sqlCon.State.ToString() != "Closed"))
                {
                    sqlCon.Close();
                }
            }
            return View(port);
        }
        [HttpGet, CustomFilter]
        public FileResult DownloadFile(string fileName)
        {
            byte[] bytes = null;
            //Build the File Path.
            string path = Path.Combine(Directory.GetCurrentDirectory(), @"wwwroot\SampleFiles\") + fileName;

            if (!path.Contains("/admin"))
            {
                //Read the File data into Byte Array.
                bytes = System.IO.File.ReadAllBytes(path);
                _dashboard.CaptureProductivityDetails(sqlCon, HttpContext.Session.GetString("EmpName").ToString().Trim(), "Upload", "OneViewIndicator-RM", 1, "UploadMaster", "Download sample file " + fileName + " for EmpCode - " + HttpContext.Session.GetString("EmpId").ToString().Trim());
            }
            //Send the File to Download.
            return File(bytes, "application/octet-stream", fileName);
            // toastr.success("File Download!");
        }

        [HttpPost, CustomFilter]
        [RequestFormLimits(MultipartBodyLengthLimit = 2147483648)]
        public async Task<JsonResult> UploadToFileSystem(List<IFormFile> files, string UploadedDate = "")
        {
            MessageModel message = new MessageModel();

            try
            {
                foreach (var file in files)
                {
                    var basePath = Path.Combine(Directory.GetCurrentDirectory() + "\\Files\\");
                    bool basePathExists = System.IO.Directory.Exists(basePath);
                    if (!basePathExists) Directory.CreateDirectory(basePath);
                    var fileName = Path.GetFileNameWithoutExtension(file.FileName);
                    var filePath = Path.Combine(basePath, file.FileName);
                    var extension = Path.GetExtension(file.FileName);
                    if (filePath.Contains("/admin"))
                    {
                        message.Msg = "This file path accessing admin path.";
                        message.isSuccess = "false";
                        return new JsonResult(message);
                    }
                    if (fileName == "Portfolio Upload") { tableName = "TBL_OVI_Portfolio"; }

                    if (fileName == "APRs Upload") { tableName = "TBL_OVI_APRs"; }

                    if (fileName == "RM Hierarchy Mapping Upload") { tableName = "TBL_OVI_RM_Hierarchy_Mapping"; }

                    if (fileName == "Client RM Mapping Upload") { tableName = "TBL_OVI_Client_RM_Mapping"; }

                    if (fileName == "Fresh Leads Upload") { tableName = "TBL_OVI_Fresh_Leads"; }

                    if (fileName.Contains("AssetPricing_APR_Upload")) { tableName = "TBL_OVI_AssetPricing_APRs"; }
                    if (fileName.Contains("Facility Master")) { tableName = "TBL_OVI_Facility_Master"; }
                    if (fileName.Contains("Facility Instruction Master")) { tableName = "TBL_OVI_Facility_Instruction_Master"; }
                    if (fileName.Contains("Charges Master")) { tableName = "TBL_OVI_ChargesType_Master"; }
                    if (fileName.Contains("Account Customization Waiver Master")) { tableName = "TBL_OVI_WaiverType_Master"; }
                    if (fileName.Contains("Security Type Master")) { tableName = "TBL_OVI_Security_Type_Master"; }
                    if (fileName.Contains("Delinquency") && HttpContext.Session.GetString("sectionType").ToString() == "RMView") { tableName = "TBL_OVI_Delinquency_new"; }
                    if (fileName.Contains("Compliance")) { tableName = "TBL_OVI_Compliance"; }
                    if (fileName.Contains("Delinquency Customer")) { tableName = "TBL_OVI_Delinquency_Customer"; }
                    if (fileName.Contains("Delinquency Account")) { tableName = "TBL_OVI_Delinquency_Account"; }
                    if (fileName.Contains("Acquisitions")) { tableName = "TBL_OVI_Acquisitions"; }
                    if (fileName.Contains("Acquisitions SFR SLA AMB")) { tableName = "TBL_OVI_Acquisitions_SFR_SAL"; }

                    #region Ganesh Added for CM View

                    if (fileName.Contains("Housekeeping - Template")) { tableName = "tblHouskeeping"; }
                    if (fileName.Contains("Portfolio - Template")) { tableName = "tblPortfolio"; }
                    //if (fileName.Contains("Portfolio - Template")) { tableName = "tblPortfolio_new"; }
                    if (fileName.Contains("AUR-Upload")) { tableName = "tbl_OVI_AUR_Upload"; }
                    if (fileName.Contains("Dashboard LCHU History")) { tableName = "tbl_OVI_LCHUDashboard"; }
                    if (fileName.Contains("Delinquency Upload") && HttpContext.Session.GetString("sectionType").ToString() == "CMView") { tableName = "TBL_OVI_CM_Delinquency_Temp"; }
                    if (fileName.Contains("Watch List Upload")) { tableName = "TBL_OVI_CM_WatchList"; }
                    #endregion

                    if (System.IO.File.Exists(filePath))
                    {
                        System.IO.File.Delete(filePath);
                    }

                    if (!System.IO.File.Exists(filePath))
                    {
                        using (var stream = new FileStream(filePath, FileMode.Create))
                        {
                            await file.CopyToAsync(stream);
                        }

                        //Start Code Added for xlsx upload option
                        DataTable dt = new DataTable();

                        if (extension == ".xlsx" && (tableName == "tblHouskeeping" || tableName == "tblPortfolio" || tableName == "tbl_OVI_AUR_Upload"
                            || tableName == "tbl_OVI_LCHUDashboard" || tableName == "TBL_OVI_CM_Delinquency_Temp" || tableName == "TBL_OVI_CM_WatchList"))
                        {
                            dt = ExcelReader.GetExcelData(filePath);
                        }
                        //End code added for xlsx upload option else old logic
                        else
                        {
                            string[] columns = null;
                            var lines = System.IO.File.ReadAllLines(filePath);
                            if (lines.Count() > 0)
                            {
                                //columns = lines[0].Split(new char[] { ',' }); foreach (var column in columns)
                                columns = lines[0].Split(new char[] { '|' }); foreach (var column in columns)
                                    dt.Columns.Add(column);
                            }
                            for (int i = 1; i < lines.Count(); i++)
                            {
                                DataRow dr = dt.NewRow();
                                //string[] values = lines[i].Split(new char[] { ',' }); for (int j = 0; j < values.Count() && j < columns.Count(); j++)
                                string[] values = lines[i].Split(new char[] { '|' }); for (int j = 0; j < values.Count() && j < columns.Count(); j++)
                                    dr[j] = values[j].Replace("'", "");
                                if (dt.Columns.Count != values.Length)
                                {
                                    message.Msg = "This file has comma(,). Please remove comma(,) and upload again.";
                                    message.isSuccess = "false";
                                    return new JsonResult(message);
                                }
                                else
                                {
                                    dt.Rows.Add(dr);
                                }
                            }

                        }

                        //Start code added for single month data upload validation
                        if (tableName == "tblHouskeeping" || tableName == "tblPortfolio" || tableName == "tbl_OVI_AUR_Upload"
                            || tableName == "tbl_OVI_LCHUDashboard" || tableName == "TBL_OVI_CM_Delinquency_Temp" || tableName == "TBL_OVI_CM_WatchList")
                        {
                            int count = 0;

                            if (tableName == "tblHouskeeping")
                            {
                                if (extension == ".xlsx")
                                {
                                    foreach (DataRow dr in dt.Rows)
                                    {
                                        double d1;
                                        if (double.TryParse(dr["DUE_DATE"].ToString(), out d1))
                                        {
                                            dr["DUE_DATE"] = DateTime.FromOADate(d1).ToString("yyyy-MM-dd");
                                        }
                                        double d2;
                                        if (double.TryParse(dr["EXTN_DATE"].ToString(), out d2))
                                        {
                                            dr["EXTN_DATE"] = DateTime.FromOADate(d2).ToString("yyyy-MM-dd");
                                        }
                                    }
                                }
                                var query = dt.AsEnumerable().Select(X => Convert.ToDateTime(X.Field<String>("DUE_DATE")).ToString("MMMyyyy")).Distinct();
                                foreach (var item in query)
                                {
                                    MonthYear = item;
                                    count++;
                                }
                            }
                            else if (tableName == "tblPortfolio")
                            {
                                if (extension == ".xlsx")
                                {
                                    foreach (DataRow dr in dt.Rows)
                                    {
                                        double d1;
                                        if (double.TryParse(dr["Date"].ToString(), out d1))
                                        {
                                            dr["Date"] = DateTime.FromOADate(d1).ToString("yyyy-MM-dd");
                                        }
                                        double d2;
                                        if (double.TryParse(dr["Initial Sanction Date By OPS"].ToString(), out d2))
                                        {
                                            dr["Initial Sanction Date By OPS"] = DateTime.FromOADate(d2).ToString("yyyy-MM-dd");
                                        }
                                    }
                                }
                                var query = dt.AsEnumerable().Select(X => Convert.ToDateTime(X.Field<String>("Date")).ToString("MMMyyyy")).Distinct();
                                foreach (var item in query)
                                {
                                    MonthYear = item;
                                    count++;
                                }
                            }
                            else if (tableName == "tbl_OVI_AUR_Upload")
                            {
                                if (extension == ".xlsx")
                                {
                                    foreach (DataRow dr in dt.Rows)
                                    {
                                        double d1;
                                        if (double.TryParse(dr["Date"].ToString(), out d1))
                                        {
                                            dr["Date"] = DateTime.FromOADate(d1).ToString("yyyy-MM-dd");
                                        }
                                    }
                                }
                                var query = dt.AsEnumerable().Select(X => Convert.ToDateTime(X.Field<String>("Date")).ToString("MMMyyyy")).Distinct();
                                foreach (var item in query)
                                {
                                    MonthYear = item;
                                    count++;
                                }
                            }
                            else if (tableName == "tbl_OVI_LCHUDashboard")
                            {
                                if (extension == ".xlsx")
                                {
                                    foreach (DataRow dr in dt.Rows)
                                    {
                                        //dr["Month_Churn"] = Convert.ToDateTime(dr["Month_Churn"]).ToString("MMM-yyyy").Substring(0, 4) + Convert.ToDateTime(dr["Month_Churn"]).ToString("MMM-yyyy").Substring(6, 2);
                                        dr["Month_Churn"] = dr["Month_Churn"].ToString();
                                    }
                                }
                                //var query = dt.AsEnumerable().Select(X => Convert.ToDateTime(X.Field<String>("Month_Churn")).ToString("MMMyyyy")).Distinct();
                                var query = dt.AsEnumerable().Select(X => X.Field<String>("Month_Churn")).Distinct();
                                foreach (var item in query)
                                {
                                    MonthYear = item;
                                    count++;
                                }
                            }
                            else if (tableName == "TBL_OVI_CM_Delinquency_Temp")
                            {
                                if (extension == ".xlsx")
                                {
                                    foreach (DataRow dr in dt.Rows)
                                    {
                                        double d2;
                                        if (double.TryParse(dr["Initial Limit Set Date"].ToString(), out d2))
                                        {
                                            dr["Initial Limit Set Date"] = DateTime.FromOADate(d2).ToString("yyyy-MM-dd");
                                        }
                                        double d1;
                                        if (double.TryParse(dr["Date_of_tod"].ToString(), out d1))
                                        {
                                            dr["Date_of_tod"] = DateTime.FromOADate(d1).ToString("yyyy-MM-dd");
                                        }
                                    }
                                }
                                var query = dt.AsEnumerable().Select(X => Convert.ToDateTime(X.Field<String>("Date_of_tod")).ToString("MMMyyyy")).Distinct();
                                foreach (var item in query)
                                {
                                    MonthYear = item;
                                    count++;
                                }
                            }
                            else if (tableName == "TBL_OVI_CM_WatchList")
                            {
                                if (extension == ".xlsx")
                                {
                                    foreach (DataRow dr in dt.Rows)
                                    {
                                        double d1;
                                        if (double.TryParse(dr["Date"].ToString(), out d1))
                                        {
                                            dr["Date"] = DateTime.FromOADate(d1).ToString("yyyy-MM-dd");
                                        }
                                    }
                                }
                                var query = dt.AsEnumerable().Select(X => Convert.ToDateTime(X.Field<String>("Date")).ToString("MMMyyyy")).Distinct();
                                foreach (var item in query)
                                {
                                    MonthYear = item;
                                    count++;
                                }
                            }
                            if (count == 0)
                            {
                                message.Msg = "There seems to be an issue with months data in uploaded file.";
                                message.isSuccess = "false";
                                return new JsonResult(message);
                            }
                            if (count > 1)
                            {
                                message.Msg = "There seems to be a multiple months data in uploaded file.";
                                message.isSuccess = "false";
                                return new JsonResult(message);
                            }
                        }
                        //End code added for single month data upload validation

                        if (tableName == "TBL_OVI_Portfolio" && (dt.Columns.Count < 27 || dt.Columns.Count > 27))
                        {
                            message.Msg = "There seems to be a column missing from the file. Please check and upload again.";
                            message.isSuccess = "false";
                            return new JsonResult(message);
                        }
                        if (tableName == "TBL_OVI_APRs" && (dt.Columns.Count < 6 || dt.Columns.Count > 6))
                        {
                            message.Msg = "There seems to be a column missing from the file. Please check and upload again.";
                            message.isSuccess = "false";
                            return new JsonResult(message);
                        }
                        if (tableName == "TBL_OVI_RM_Hierarchy_Mapping" && (dt.Columns.Count < 9 || dt.Columns.Count > 9))
                        {
                            message.Msg = "There seems to be a column missing from the file. Please check and upload again.";
                            message.isSuccess = "false";
                            return new JsonResult(message);
                        }
                        if (tableName == "TBL_OVI_Client_RM_Mapping" && (dt.Columns.Count < 2 || dt.Columns.Count > 2))
                        {
                            message.Msg = "There seems to be a column missing from the file. Please check and upload again.";
                            message.isSuccess = "false";
                            return new JsonResult(message);
                        }
                        if (tableName == "TBL_OVI_Fresh_Leads" && (dt.Columns.Count < 2 || dt.Columns.Count > 2))
                        {
                            message.Msg = "There seems to be a column missing from the file. Please check and upload again.";
                            message.isSuccess = "false";
                            return new JsonResult(message);
                        }
                        if (tableName == "TBL_OVI_AssetPricing_APRs" && (dt.Columns.Count < 10 || dt.Columns.Count > 10))
                        {
                            message.Msg = "There seems to be a column missing from the file. Please check and upload again.";
                            message.isSuccess = "false";
                            return new JsonResult(message);
                        }
                        if (tableName == "TBL_OVI_Facility_Master" && (dt.Columns.Count < 3 || dt.Columns.Count > 3))
                        {
                            message.Msg = "There seems to be a column missing from the file. Please check and upload again.";
                            message.isSuccess = "false";
                            return new JsonResult(message);
                        }
                        if (tableName == "TBL_OVI_Facility_Instruction_Master" && (dt.Columns.Count < 1 || dt.Columns.Count > 1))
                        {
                            message.Msg = "There seems to be a column missing from the file. Please check and upload again.";
                            message.isSuccess = "false";
                            return new JsonResult(message);
                        }
                        if (tableName == "TBL_OVI_Security_Type_Master" && (dt.Columns.Count < 1 || dt.Columns.Count > 1))
                        {
                            message.Msg = "There seems to be a column missing from the file. Please check and upload again.";
                            message.isSuccess = "false";
                            return new JsonResult(message);
                        }
                        if (tableName == "TBL_OVI_ChargesType_Master" && (dt.Columns.Count < 2 || dt.Columns.Count > 2))
                        {
                            message.Msg = "There seems to be a column missing from the file. Please check and upload again.";
                            message.isSuccess = "false";
                            return new JsonResult(message);
                        }
                        if (tableName == "TBL_OVI_WaiverType_Master" && (dt.Columns.Count < 2 || dt.Columns.Count > 2))
                        {
                            message.Msg = "There seems to be a column missing from the file. Please check and upload again.";
                            message.isSuccess = "false";
                            return new JsonResult(message);
                        }
                        if (tableName == "TBL_OVI_Delinquency" && (dt.Columns.Count < 5 || dt.Columns.Count > 5))
                        {
                            message.Msg = "There seems to be a column missing from the file. Please check and upload again.";
                            message.isSuccess = "false";
                            return new JsonResult(message);
                        }
                        if (tableName == "TBL_OVI_Delinquency_Customer" && (dt.Columns.Count < 17 || dt.Columns.Count > 17))
                        {
                            message.Msg = "There seems to be a column missing from the file. Please check and upload again.";
                            message.isSuccess = "false";
                            return new JsonResult(message);
                        }
                        if (tableName == "TBL_OVI_Delinquency_Account" && (dt.Columns.Count < 14 || dt.Columns.Count > 14))
                        {
                            message.Msg = "There seems to be a column missing from the file. Please check and upload again.";
                            message.isSuccess = "false";
                            return new JsonResult(message);
                        }
                        if (tableName == "TBL_OVI_Acquisitions" && (dt.Columns.Count < 7 || dt.Columns.Count > 7))
                        {
                            message.Msg = "There seems to be a column missing from the file. Please check and upload again.";
                            message.isSuccess = "false";
                            return new JsonResult(message);
                        }
                        if (tableName == "TBL_OVI_Acquisitions_SFR_SAL" && (dt.Columns.Count < 5 || dt.Columns.Count > 5))
                        {
                            message.Msg = "There seems to be a column missing from the file. Please check and upload again.";
                            message.isSuccess = "false";
                            return new JsonResult(message);
                        }
                        if (tableName == "TBL_OVI_Compliance" && (dt.Columns.Count < 4 || dt.Columns.Count > 4))
                        {
                            message.Msg = "There seems to be a column missing from the file. Please check and upload again.";
                            message.isSuccess = "false";
                            return new JsonResult(message);
                        }

                        #region Ganesh Added for CM View

                        if (tableName == "tblHouskeeping" && (dt.Columns.Count < 18 || dt.Columns.Count > 18))
                        {
                            message.Msg = "There seems to be a column missing from the file. Please check and upload again.";
                            message.isSuccess = "false";
                            return new JsonResult(message);
                        }

                        if (tableName == "tblPortfolio" && (dt.Columns.Count < 36 || dt.Columns.Count > 36))
                        //if (tableName == "tblPortfolio_new" && (dt.Columns.Count < 36 || dt.Columns.Count > 36))
                        {
                            message.Msg = "There seems to be a column missing from the file. Please check and upload again.";
                            message.isSuccess = "false";
                            return new JsonResult(message);
                        }

                        if (tableName == "tbl_OVI_AUR_Upload" && (dt.Columns.Count < 36 || dt.Columns.Count > 36))
                        {
                            message.Msg = "There seems to be a column missing from the file. Please check and upload again.";
                            message.isSuccess = "false";
                            return new JsonResult(message);
                        }
                        //if (tableName == "tbl_OVI_LCHUDashboard" && (dt.Columns.Count < 22 || dt.Columns.Count > 22))
                        if (tableName == "tbl_OVI_LCHUDashboard" && (dt.Columns.Count < 24 || dt.Columns.Count > 24))
                        {
                            message.Msg = "There seems to be a column missing from the file. Please check and upload again.";
                            message.isSuccess = "false";
                            return new JsonResult(message);
                        }

                        if (tableName == "TBL_OVI_CM_Delinquency_Temp" && (dt.Columns.Count < 29 || dt.Columns.Count > 29))
                        {
                            message.Msg = "There seems to be a column missing from the file. Please check and upload again.";
                            message.isSuccess = "false";
                            return new JsonResult(message);
                        }
                        if (tableName == "TBL_OVI_CM_WatchList" && (dt.Columns.Count < 27 || dt.Columns.Count > 27))
                        {
                            message.Msg = "There seems to be a column missing from the file. Please check and upload again.";
                            message.isSuccess = "false";
                            return new JsonResult(message);
                        }
                        #endregion

                        if (UploadedDate != "" && UploadedDate != null)
                        {
                            System.Data.DataColumn newColumn = new System.Data.DataColumn("UploadedDate", typeof(System.DateTime));
                            newColumn.DefaultValue = Convert.ToDateTime(UploadedDate);
                            dt.Columns.Add(newColumn);

                        }

                        if (HttpContext.Session.GetString("sectionType").ToString() == "RMView")
                        {
                            DataTable dtIncremented = new DataTable(dt.TableName);
                            DataColumn newColumnUploadId = new DataColumn("UploadId");
                            newColumnUploadId.AutoIncrement = true;
                            newColumnUploadId.AutoIncrementSeed = 1;
                            newColumnUploadId.AutoIncrementStep = 1;
                            newColumnUploadId.DataType = typeof(Int32);
                            dtIncremented.Columns.Add(newColumnUploadId);

                            dtIncremented.BeginLoadData();

                            DataTableReader dtReader = new DataTableReader(dt);
                            dtIncremented.Load(dtReader);

                            dtIncremented.EndLoadData();

                            System.Data.DataColumn newColumnCreatedAt = new System.Data.DataColumn("CreatedAt", typeof(System.DateTime));
                            newColumnCreatedAt.DefaultValue = Convert.ToDateTime(DateTime.Now);
                            dtIncremented.Columns.Add(newColumnCreatedAt);

                            System.Data.DataColumn newColumnIsValid = new System.Data.DataColumn("IsValid", typeof(System.Boolean));
                            newColumnIsValid.DefaultValue = Convert.ToBoolean(false);
                            dtIncremented.Columns.Add(newColumnIsValid);

                            System.Data.DataColumn newColumnUploadedDate = new System.Data.DataColumn("CreatedBy", typeof(System.String));
                            newColumnUploadedDate.DefaultValue = Convert.ToString(HttpContext.Session.GetString("EmpName").ToString().Trim());
                            dtIncremented.Columns.Add(newColumnUploadedDate);

                            System.Data.DataColumn newColumnErroMsg = new System.Data.DataColumn("ErroMsg", typeof(System.String));
                            dtIncremented.Columns.Add(newColumnErroMsg);

                            bool result = true;// Delete_And_Add_Upload_Data(fileName);
                            newColumnUploadId.SetOrdinal(0);
                            newColumnIsValid.SetOrdinal(1);
                            newColumnErroMsg.SetOrdinal(2);
                            newColumnCreatedAt.SetOrdinal(dtIncremented.Columns.Count - 2);
                            newColumnUploadedDate.SetOrdinal(dtIncremented.Columns.Count - 1);

                            //SqlConnection sqlCon = new SqlConnection(Startup.connectionstring);
                            SqlBulkCopy bulkCopy = new SqlBulkCopy(sqlCon);
                            bulkCopy.DestinationTableName = "" + tableName + "_UploadTemp";//"TBL_OVI_Client_RM_Mapping_UploadTemp";// tableName;
                            bulkCopy.BatchSize = 3000000;
                            int a = dtIncremented.Rows.Count;
                            bulkCopy.BulkCopyTimeout = 0;
                            if (sqlCon.State != ConnectionState.Open)
                            { sqlCon.Open(); }
                            bulkCopy.WriteToServer(dtIncremented);
                            bulkCopy.Close();
                            sqlCon.Close();
                            message.Msg = "File uploaded successfully";
                            message.isSuccess = "true";
                            DataTable table = new DataTable();
                            table = _dashboard.GetUploadErrorList(HttpContext.Session.GetString("EmpName").ToString().Trim(), "SP_OVI_" + tableName + "_UploadRejectList");
                            string responce = string.Empty;
                            message.Msg = "File uploaded successfully";
                            message.isSuccess = "true";
                            if (table.Rows.Count > 0)
                            {
                                responce = ExportExcel(table, fileName);
                                message.Msg = "Uploaded file is rejected please find reject report";
                                message.isSuccess = "false";
                            }

                            if (result)
                            {

                                //SqlConnection sqlCon = new SqlConnection(Startup.connectionstring);
                                //SqlBulkCopy bulkCopy = new SqlBulkCopy(sqlCon);
                                //bulkCopy.DestinationTableName = tableName;
                                //bulkCopy.BatchSize = 3000000;
                                //int a = dt.Rows.Count;
                                //bulkCopy.BulkCopyTimeout = 0;
                                //if (sqlCon.State != ConnectionState.Open)
                                //{ sqlCon.Open(); }
                                //bulkCopy.WriteToServer(dt);
                                //bulkCopy.Close();
                                //sqlCon.Close();                            
                                // message.Msg = "File uploaded successfully";
                                message.fileName = responce;
                                //message.isSuccess = "true";
                                _dashboard.CaptureProductivityDetails(sqlCon, HttpContext.Session.GetString("EmpName").ToString().Trim(), "Upload", "OneViewIndicator-RM", 1, "UploadMaster", "Upload file " + Path.GetFileNameWithoutExtension(file.FileName) + " Uploaded for EmpCode - " + HttpContext.Session.GetString("EmpId").ToString().Trim());
                            }
                            else
                            {
                                message.Msg = "Something Went Wrong while uploading file";
                                message.isSuccess = "false";
                            }
                        }
                        else
                        {
                            System.Data.DataColumn newColumnCreatedAt = new System.Data.DataColumn("CreatedAt", typeof(System.DateTime));
                            newColumnCreatedAt.DefaultValue = Convert.ToDateTime(DateTime.Now);
                            dt.Columns.Add(newColumnCreatedAt);

                            System.Data.DataColumn newColumnUploadedDate = new System.Data.DataColumn("CreatedBy", typeof(System.String));
                            newColumnUploadedDate.DefaultValue = Convert.ToString(HttpContext.Session.GetString("EmpName").ToString().Trim());
                            dt.Columns.Add(newColumnUploadedDate);

                            bool result = false;

                            if (tableName == "tblHouskeeping" || tableName == "tblPortfolio" || tableName == "tbl_OVI_AUR_Upload"
                            || tableName == "tbl_OVI_LCHUDashboard" || tableName == "TBL_OVI_CM_Delinquency_Temp" || tableName == "TBL_OVI_CM_WatchList")
                            {
                                result = Delete_And_Add_Upload_Data(fileName, MonthYear);
                            }
                            else
                            {
                                result = Delete_And_Add_Upload_Data(fileName);
                            }

                            if (tableName == "TBL_OVI_CM_Delinquency_Temp")
                            {
                                SqlBulkCopy bulkCopy = new SqlBulkCopy(sqlCon);
                                bulkCopy.DestinationTableName = tableName;
                                bulkCopy.BatchSize = 3000000;
                                int a = dt.Rows.Count;
                                bulkCopy.BulkCopyTimeout = 0;
                                if (sqlCon.State != ConnectionState.Open)
                                { sqlCon.Open(); }
                                bulkCopy.WriteToServer(dt);
                                bulkCopy.Close();
                                sqlCon.Close();

                                bool result1 = Delete_And_Add_Upload_Data(tableName, MonthYear);
                                if (result1)
                                {
                                    message.Msg = "File uploaded successfully";
                                    message.isSuccess = "true";
                                    _dashboard.CaptureProductivityDetails(sqlCon, HttpContext.Session.GetString("EmpName").ToString().Trim(), "Upload", "OneViewIndicator-CM", 1, "UploadMaster", "Upload file " + Path.GetFileNameWithoutExtension(file.FileName) + " Uploaded for EmpCode - " + HttpContext.Session.GetString("EmpId").ToString().Trim() + " - Done");
                                }
                                else
                                {
                                    message.Msg = "Something Went Wrong while uploading file";
                                    message.isSuccess = "false";
                                }

                            }

                            else
                            {
                                if (result)
                                {

                                    SqlBulkCopy bulkCopy = new SqlBulkCopy(sqlCon);
                                    bulkCopy.DestinationTableName = tableName;
                                    bulkCopy.BatchSize = 3000000;
                                    int a = dt.Rows.Count;
                                    bulkCopy.BulkCopyTimeout = 0;
                                    if (sqlCon.State != ConnectionState.Open)
                                    { sqlCon.Open(); }
                                    bulkCopy.WriteToServer(dt);
                                    bulkCopy.Close();
                                    sqlCon.Close();
                                    message.Msg = "File uploaded successfully";
                                    message.isSuccess = "true";
                                    if (HttpContext.Session.GetString("sectionType").ToString() == "CMView")
                                    {
                                        _dashboard.CaptureProductivityDetails(sqlCon, HttpContext.Session.GetString("EmpName").ToString().Trim(), "Upload", "OneViewIndicator-CM", 1, "UploadMaster", "Upload file " + Path.GetFileNameWithoutExtension(file.FileName) + " Uploaded for EmpCode - " + HttpContext.Session.GetString("EmpId").ToString().Trim() + " - Done");
                                    }
                                    else
                                    {
                                        _dashboard.CaptureProductivityDetails(sqlCon, HttpContext.Session.GetString("EmpName").ToString().Trim(), "Upload", "OneViewIndicator-RM", 1, "UploadMaster", "Upload file " + Path.GetFileNameWithoutExtension(file.FileName) + " Uploaded for EmpCode - " + HttpContext.Session.GetString("EmpId").ToString().Trim());
                                    }
                                }
                                else
                                {
                                    message.Msg = "Something Went Wrong while uploading file";
                                    message.isSuccess = "false";
                                }
                            }
                        }

                    }
                }
            }
            catch (Exception ex)
            {
                //ViewBag.Message = ex.Message.ToString();
                message.Msg = ex.Message.ToString();
                message.isSuccess = "false";
            }
            finally
            {
                if ((sqlCon != null) && (sqlCon.State.ToString() != "Closed"))
                {
                    sqlCon.Close();
                }
            }
            return new JsonResult(message);
        }

        //public bool findColumnMismatched(int columnCount, string Table_Name,DataTable dt)
        //{

        //    bool issucess = false;
        //    if (tableName == Table_Name && (dt.Columns.Count < 2 || dt.Columns.Count > 2))
        //    {
        //        message.Msg = "There seems to be a column missing from the file. Please check and upload again.";
        //        message.isSuccess = "false";
        //        return new JsonResult(message);
        //    }

        //    return issucess;
        //}
        public bool Delete_And_Add_Upload_Data(string Identflag, string MonthYear = "")
        {
            bool result = false;
            try
            {
                sqlCon = new SqlConnection(clsConnectionString.GetConnectionString());
                cmd = new SqlCommand("SP_OVI_Delete_Add_Upload_Data", sqlCon);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@Identflag", Identflag);
                cmd.Parameters.AddWithValue("@MonthYear", MonthYear);
                sqlCon.Open();
                int a = (int)cmd.ExecuteScalar();
                if (a > 0)
                {
                    result = true;
                }
                sqlCon.Close();
            }
            catch (Exception ex)
            {
                return false;
            }
            finally
            {
                if (cmd != null)
                {
                    cmd.Dispose();
                }
                if ((sqlCon != null) && (sqlCon.State.ToString() != "Closed"))
                {
                    sqlCon.Close();
                }
            }

            result = true;
            return result;
        }

        public string SelectedIndexChanged()
        {
            return "";
        }

        public string ExportExcel(DataTable ds, string filename, string fileNameAdd = "_Error")
        {
            string randum = DateTime.Now.Day.ToString() + DateTime.Now.Month.ToString() + DateTime.Now.Year.ToString() + DateTime.Now.Hour.ToString() + DateTime.Now.Minute.ToString() + DateTime.Now.Second.ToString();
            var basePath = Path.Combine(Directory.GetCurrentDirectory() + "\\Error\\");
            bool basePathExists = System.IO.Directory.Exists(basePath);
            if (!basePathExists) Directory.CreateDirectory(basePath);
            using (StreamWriter sw = new StreamWriter("" + basePath + "" + filename + fileNameAdd + "~" + randum + ".csv", false))
            {
                //headers    
                for (int i = 0; i < ds.Columns.Count; i++)
                {
                    sw.Write(ds.Columns[i]);
                    if (i < ds.Columns.Count - 1)
                    {
                        sw.Write(",");
                    }
                }
                sw.Write(sw.NewLine);
                foreach (DataRow dr in ds.Rows)
                {
                    for (int i = 0; i < ds.Columns.Count; i++)
                    {
                        if (!Convert.IsDBNull(dr[i]))
                        {
                            string value = dr[i].ToString();
                            if (value.Contains(','))
                            {
                                value = String.Format("\"{0}\"", value);
                                sw.Write(value);
                            }
                            else
                            {
                                sw.Write(dr[i].ToString());
                            }
                        }
                        if (i < ds.Columns.Count - 1)
                        {
                            sw.Write(",");
                        }
                    }
                    sw.Write(sw.NewLine);
                }
                //sw.Close();
            }
            return filename + fileNameAdd + "~" + randum + ".csv";
        }

        public FileResult DownloadFile_Error(string fileName)
        {
            var fileNameSplit = fileName.Split("~")[0];

            //Build the File Path.
            string path = Path.Combine(Directory.GetCurrentDirectory(), @"Error\") + fileName;

            if (!path.Contains("/admin"))
            {
                //Read the File data into Byte Array.
                byte[] bytes = System.IO.File.ReadAllBytes(path);
                // _dashboard.CaptureProductivityDetails(sqlCon, HttpContext.Session.GetString("EmpName").ToString().Trim(), "Upload", "OneViewIndicator-RM", 1, "UploadMaster", "Download sample file " + fileName + " for EmpCode - " + HttpContext.Session.GetString("EmpId").ToString().Trim());
                System.IO.File.Delete(path);
                return File(bytes, "application/octet-stream", fileNameSplit + ".csv");
            }
            return null;
            //Send the File to Download.
        }
    }
}