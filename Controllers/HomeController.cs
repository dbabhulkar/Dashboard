using Dashboard.Interfaces;
using Dashboard.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Data.SqlClient;
using System.Data;
using System.Diagnostics;
using System.Net;
using Dashboard.Repositories;
using OVI.Domain.Interfaces;

namespace Dashboard.Controllers
{
    //public class HomeController : Controller
    //{
    //    private readonly ILogger<HomeController> _logger;

    //    public HomeController(ILogger<HomeController> logger)
    //    {
    //        _logger = logger;
    //    }

    //    public IActionResult Index()
    //    {
    //        return View();
    //    }

    //    public IActionResult Privacy()
    //    {
    //        return View();
    //    }

    //    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    //    public IActionResult Error()
    //    {
    //        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    //    }
    //}
    /* CustomFilter Implemeted to check the session expiry. */

    //[CustomFilter]
    public class HomeController : Controller
    {
        private readonly ISession _session;
        private readonly IDashboard _dashboard;
        DataSet chkstatus = new DataSet();
        readonly ILogger _logger;
        private SqlConnection sqlconn;
        public static string[] sValues = new[] { "App_Web", "ThinkTank" };
        public static int ITGRCCode = 997003;
        public static string loginID;
        public static string NewDbVaultId = "U5EokPqGwwv+FXX3sb0WnA==";
        SqlConnection sqlCon = new SqlConnection(clsConnectionString.GetConnectionString());
        // SqlConnection sqlCon = DataHelper.SqlHelper.openCon();

        // Canary: IDashboardRepository injected via DI alongside legacy _dashboard
        private readonly OVI.Domain.Interfaces.IDashboardRepository _dashboardService;

        public HomeController(ILogger<ErrorController> logger, OVI.Domain.Interfaces.IDashboardRepository dashboardService)
        {
            _logger = logger;
            _dashboard = new DashboardRepository();
            _dashboardService = dashboardService;
        }

        public IActionResult Index()
        {
            try
            {
                return View();
            }
            catch (Exception e)
            {
                throw new MyAppException(e.Message);
            }


        }
        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }

        [CustomFilter]
        public IActionResult Dashboard(string USERID, string IP)
        {

            string CurrentIP = Response.HttpContext.Connection.RemoteIpAddress.ToString();
            if (CurrentIP == "::1")
            {
                CurrentIP = Dns.GetHostEntry(Dns.GetHostName()).AddressList[1].ToString();
            }

            string DescUserId = EncryptDecrypt.Decrypt(USERID);
            HttpContext.Session.SetString("EncryptedId", USERID);
            HttpContext.Session.SetString("EncryptedIP", IP);

            string DecryIP = EncryptDecrypt.Decrypt(IP);

            if (DecryIP == CurrentIP)
            {

                SqlCommand cmdCentral = new SqlCommand("SP_OVI_ValidateUser", sqlCon);
                cmdCentral.CommandType = CommandType.StoredProcedure;
                cmdCentral.Parameters.AddWithValue("@UserId", DescUserId);
                sqlCon.Open();
                DataTable dt_lblCentral = new DataTable();
                dt_lblCentral.Load(cmdCentral.ExecuteReader());
                cmdCentral.Dispose();
                sqlCon.Close();

                if (dt_lblCentral != null)
                {
                    if (dt_lblCentral.Rows.Count > 0)
                    {
                        HttpContext.Session.SetString("CentralTeam", dt_lblCentral.Rows[0]["CentralTeam"].ToString());
                    }
                }


                string user_id = HttpContext.Session.GetString("EmpId").ToString();

                var portData = GetPortfolioData();
                ViewData["Decomplance"] = _dashboard.GetDelinquencyDetails(user_id);
                ViewData["Compliance"] = _dashboard.GetComplianceItem(user_id);
                _dashboard.CaptureProductivityDetails(sqlCon, HttpContext.Session.GetString("EmpName").ToString().Trim(), "Dashboard", "OneViewIndicator-RM", 1, "Dashboard", "Dashboard View for EmpCode - " + HttpContext.Session.GetString("EmpId").ToString().Trim());

                return View(portData);
            }
            else
            {
                string url = Global.LoginUrl;

                HttpContext.Session.Clear();
                HttpContext.Session.Remove("EmpId");
                return Redirect(url);

            }
        }

        private DataSet checkUserMaster(string userName)
        {

            Login log = new Login();
            DataSet ds = new DataSet();
            SqlCommand sqlcmd = new SqlCommand("sp_Login_New", sqlCon);
            sqlcmd.CommandTimeout = 0;
            sqlcmd.CommandType = CommandType.StoredProcedure;
            sqlcmd.Parameters.Add("@Type", SqlDbType.VarChar).Value = 5;
            sqlcmd.Parameters.Add("@Empcode", SqlDbType.VarChar).Value = userName;
            SqlDataAdapter da = new SqlDataAdapter(sqlcmd);
            da.Fill(ds);
            da.Dispose();
            sqlcmd.Dispose();
            if (ds.Tables[0].Rows.Count > 0)
            {
                log.BranchCode = ds.Tables[0].Rows[0]["BranchCode"].ToString();
                log.GlobalOrgIdRole = ds.Tables[0].Rows[0]["ProfileDescription"].ToString();
                log.RefID = Convert.ToInt32(ds.Tables[0].Rows[0]["ID"]);
                log.UserName = ds.Tables[0].Rows[0]["EmpName"].ToString();
                HttpContext.Session.SetString("LUserName", ds.Tables[0].Rows[0]["EmpName"].ToString());
                //Session["LUserName"] = ds.Tables[0].Rows[0]["EmpName"].ToString();
                log.Role = ds.Tables[0].Rows[0]["User_Role"].ToString();
                HttpContext.Session.SetString("UserRole", ds.Tables[0].Rows[0]["User_Role"].ToString());
                HttpContext.Session.SetString("CMUserRole", ds.Tables[0].Rows[0]["ProfileDescription"].ToString());
            }
            sqlCon.Close();
            return ds;
        }
        ///[CustomFilter]
        public IActionResult Commercials()
        {
            try
            {
                List<Clients> clients = new List<Clients>() {
            new Clients { CustomerName = "NAME", IPNumber = 12345678, InitiatedBy="A123455 - ANIL KUMAR", SentTo = "B124568 - BILAL KHAN", Remarks="Lorem Ipsum", Status="In Progress", Date="1/01/21"},
            new Clients { CustomerName = "NAME", IPNumber = 12345628, InitiatedBy="B124568 - BILAL KHAN", SentTo = "C124525 - CAROL THOMAS", Remarks="Lorem Ipsum", Status="In Progress", Date="1/01/21"},
            new Clients { CustomerName = "NAME", IPNumber = 12342678, InitiatedBy="C124525 - CAROL THOMAS", SentTo = "D329401 - DILIP ANAND", Remarks="Lorem Ipsum", Status="In Progress", Date="1/01/21"},
            new Clients { CustomerName = "NAME", IPNumber = 12345622, InitiatedBy="D329401 - DILIP ANAND", SentTo = "E394992 - EBIN KURIAN", Remarks="Lorem Ipsum", Status="Approved", Date="1/01/20"},
            new Clients { CustomerName = "NAME", IPNumber = 123456118, InitiatedBy="E394992 - EBIN KURIAN", SentTo = "F493294 - FRANCIS JOSE", Remarks="Lorem Ipsum", Status="Approved", Date="1/01/20"},
            new Clients { CustomerName = "NAME", IPNumber = 123456118, InitiatedBy="A123455 - ANIL KUMAR", SentTo = "B124568 - BILAL KHAN", Remarks="Lorem Ipsum", Status="Approved", Date="1/01/20"},
            new Clients { CustomerName = "NAME", IPNumber = 123456118, InitiatedBy="B124568 - BILAL KHAN", SentTo = "C124525 - CAROL THOMAS", Remarks="Lorem Ipsum", Status="Approved", Date="1/01/20"}
            };
                List<FacilityDetails> grd_FacilityDetails = new List<FacilityDetails>()
                {

                };
                dynamic model = new System.Dynamic.ExpandoObject();
                model.Clients = clients;
                model.FacilityDetails = grd_FacilityDetails;
                //int pageSize = 3;
                //int pageNumber = (page ?? 1);
                //return View(Clients.ToPagedList(pageNumber, pageSize));
                return View(model);
            }
            catch (Exception e)
            {
                throw new MyAppException(e.Message);
            }


        }
        [HttpGet, CustomFilter]
        public Portfolio GetPortfolioData()
        {
            try
            {
                PortfolioCount obj_count = new PortfolioCount();
                DataSet ds = new DataSet();
                DataTable dt_count = new DataTable();
                SqlCommand cmd = new SqlCommand("SP_OVI_Get_Dashboard_Records", sqlCon);
                cmd.Parameters.AddWithValue("@UserId", HttpContext.Session.GetString("EmpId").ToString());
                cmd.Parameters.AddWithValue("@IdentFlag", "Portfolio_Count");
                cmd.CommandType = CommandType.StoredProcedure;
                SqlDataAdapter da = new SqlDataAdapter(cmd);
                if (sqlCon.State == ConnectionState.Closed)
                {
                    sqlCon.Open();
                }
                da.Fill(ds);
                Portfolio port = new Portfolio();

                if (ds != null && ds.Tables.Count > 0)
                {
                    if (ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
                    {
                        port.APRs_count = ds.Tables[0].Rows[0]["APRs_Count"].ToString();
                        port.Clients_count = ds.Tables[0].Rows[0]["LeadCount"].ToString();
                        port.NFB_Limits = ds.Tables[0].Rows[0]["Non_Fund_Limit"].ToString();
                        port.FB_Limits = ds.Tables[0].Rows[0]["Fund_Limit"].ToString();
                        port.FB_Os = ds.Tables[0].Rows[0]["Fund_Os"].ToString();
                        port.NFB_Os = ds.Tables[0].Rows[0]["Non_Fund_Os"].ToString();
                        port.Total_Limits = ds.Tables[0].Rows[0]["Total_Limits"].ToString();
                        port.Total_Os = ds.Tables[0].Rows[0]["Total_Os"].ToString();
                        port.FB_Percentage = ds.Tables[0].Rows[0]["FB_Percentage"].ToString();
                        port.NFB_percentage = ds.Tables[0].Rows[0]["NFB_percentage"].ToString();
                        port.Total_percentage = ds.Tables[0].Rows[0]["Total_percentage"].ToString();
                        port.UploadedDate = ds.Tables[0].Rows[0]["UploadedDate"].ToString();

                    }
                    else
                    {
                        port.APRs_count = "0";
                        port.Clients_count = "0";
                        port.NFB_Limits = "0";
                        port.FB_Limits = "0";
                        port.FB_Os = "0";
                        port.NFB_Os = "0";
                        port.Total_Limits = "0";
                        port.Total_Os = "0";
                        port.FB_Percentage = "0";
                        port.NFB_percentage = "0";
                        port.Total_percentage = "0";
                        port.UploadedDate = "";
                    }
                    if (ds.Tables[1] != null && ds.Tables[1].Rows.Count > 0)
                    {
                        port.Fresh_Leads = ds.Tables[1].Rows[0]["Fresh_Leads"].ToString();
                    }
                    else
                    {
                        port.Fresh_Leads = "0";
                    }
                }
                else
                {
                    port.APRs_count = "0";
                    port.Clients_count = "0";
                    port.NFB_Limits = "0";
                    port.FB_Limits = "0";
                    port.FB_Os = "0";
                    port.NFB_Os = "0";
                    port.Total_Limits = "0";
                    port.Total_Os = "0";
                    port.FB_Percentage = "0";
                    port.NFB_percentage = "0";
                    port.Total_percentage = "0";
                    port.Fresh_Leads = "0";
                    port.UploadedDate = "";
                }

                return port;
            }
            catch (Exception e)
            {
                throw new MyAppException(e.Message);
            }
            finally
            {
                sqlCon.Close();
            }

        }


        public IActionResult Logout()
        {
            return View("~/Views/Login/Index.cshtml");
            //  return Redirect("~/Views/Login/Index");
        }

        [HttpPost, CustomFilter]
        public string ValidateUrl(int recordId, string urlLink)
        {

            SqlCommand cmdcounter = null;
            string Msg = string.Empty;
            try
            {

                cmdcounter = new SqlCommand("SP_OVI_LinkMaster_Credit", sqlCon);
                cmdcounter.CommandType = CommandType.StoredProcedure;
                cmdcounter.Parameters.AddWithValue("@Action", "isUrlExists");
                cmdcounter.Parameters.AddWithValue("@RecordId", recordId);
                cmdcounter.Parameters.AddWithValue("@Link", urlLink);
                if (sqlCon.State == ConnectionState.Closed)
                {
                    sqlCon.Open();
                }
                Msg = (string)cmdcounter.ExecuteScalar();
                return Msg.ToString();
            }
            catch (Exception ex)
            {
                throw new MyAppException(ex.Message);
            }
            finally
            {
                sqlCon.Close();
            }

        }

        /*  Method added to save Quick Link  */
        [HttpPost, CustomFilter]
        public Int32 saveRecord(Int32 recordId, string urlName, string urlLink, string description, int IsFrequenltyUsed)
        {

            SqlCommand cmd = null;
            Int32 Msg = 0;
            try
            {
                cmd = new SqlCommand("SP_OVI_LinkMaster_Credit", sqlCon);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@Action", "AddEdit");
                cmd.Parameters.AddWithValue("@Name", urlName);
                cmd.Parameters.AddWithValue("@Link", urlLink);
                cmd.Parameters.AddWithValue("@Link_Description", description);
                cmd.Parameters.AddWithValue("@IsFrequentlyUsed", IsFrequenltyUsed);
                cmd.Parameters.AddWithValue("@RecordId", recordId);
                cmd.Parameters.AddWithValue("@CreatedBy", HttpContext.Session.GetString("EmpId"));
                if (sqlCon.State == ConnectionState.Closed)
                {
                    sqlCon.Open();
                }
                Msg = (Int32)cmd.ExecuteScalar();
                return Msg;
            }
            catch (Exception ex)
            {
                throw new MyAppException(ex.Message);
                //Msg = ex.Message.ToString();
            }
            finally
            {
                sqlCon.Close();
            }

        }

        public DataSet GetLinkData(string Identflag, string Name)
        {

            try
            {
                SqlCommand cmd = null;
                DataSet ds = new DataSet();

                cmd = new SqlCommand("SP_OVI_LinkMaster_Credit", sqlCon);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@Action", Identflag);
                cmd.Parameters.AddWithValue("@Name", Name);
                if (sqlCon.State == ConnectionState.Closed)
                {
                    sqlCon.Open();
                }
                SqlDataAdapter sda = new SqlDataAdapter(cmd);
                sda.Fill(ds);
                //DataSet.Load(cmd.ExecuteReader());
                cmd.Dispose();
                //List<QuickLink> MyList = new List<QuickLink>();

                //if (dt.Rows.Count > 0)
                //{
                //    foreach (DataRow row in dt.Rows)
                //    {
                //        QuickLink lnk = new QuickLink();
                //        lnk.urlName = row["Name"].ToString();
                //        lnk.urlLink = row["Link"].ToString();
                //        lnk.description = row["Link_Description"].ToString();
                //        lnk.recordId = Convert.ToInt32(row["RecordId"]);
                //        MyList.Add(lnk);
                //    }
                //}

                ds.Tables[0].TableName = "TBL_All_links";
                ds.Tables[1].TableName = "TBL_FrequentlyUsedLinks";

                _dashboard.CaptureProductivityDetails(sqlCon, HttpContext.Session.GetString("EmpName").ToString().Trim(), "Dashboard", "OneViewIndicator-RM", 1, "QuickLink", "QuickLink for EmpCode - " + HttpContext.Session.GetString("EmpId").ToString().Trim());
                return ds;
            }
            catch (Exception e)
            {
                throw new MyAppException(e.Message);
            }
            finally
            {
                sqlCon.Close();
            }

        }

        public string deleteRecord(Int32 recordId)
        {

            SqlCommand cmd = null;
            string Msg = string.Empty;
            try
            {
                cmd = new SqlCommand("SP_OVI_LinkMaster_Credit", sqlCon);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@Action", "Delete");
                cmd.Parameters.AddWithValue("@RecordId", recordId);
                if (sqlCon.State == ConnectionState.Closed)
                {
                    sqlCon.Open();
                }
                Msg = (string)cmd.ExecuteScalar();
                cmd.Dispose();
                return Msg.ToString();
            }
            catch (Exception ex)
            {
                throw new MyAppException(ex.Message);
            }
            finally
            {
                sqlCon.Close();
            }

        }

        public JsonResult GetUrgentBulletinData()
        {

            try
            {
                string role = HttpContext.Session.GetString("CheckUser");
                DataTable dt = new DataTable();
                SqlCommand cmd = new SqlCommand("SP_OVI_Urgent_Bulletin", sqlCon);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@Identflag", "fetch_Urgent_bulletin_data");
                cmd.Parameters.AddWithValue("@Emp_Id", HttpContext.Session.GetString("EmpId"));
                if (sqlCon.State == ConnectionState.Closed)
                {
                    sqlCon.Open();
                }
                SqlDataAdapter sda = new SqlDataAdapter(cmd);
                sda.Fill(dt);

                List<UrgentBulletin> MyList = new List<UrgentBulletin>();

                if (dt.Rows.Count > 0)
                {
                    foreach (DataRow row in dt.Rows)
                    {
                        UrgentBulletin lnk = new UrgentBulletin();
                        lnk.Body = row["Body"].ToString();
                        lnk.Subject = row["Subject"].ToString();
                        lnk.Create_date = row["create_date"].ToString();
                        lnk.FileName = row["FileName"].ToString();
                        lnk.BulltinId = Convert.ToInt32(row["Urgent_Bulletin_Id"]);
                        lnk.EmpName = row["EmpName"].ToString();
                        lnk.EmpRole = row["EmpRole"].ToString();
                        MyList.Add(lnk);
                    }
                }

                return new JsonResult(MyList);
            }
            catch (Exception e)
            {
                throw new MyAppException(e.Message);
            }
            finally
            {
                sqlCon.Close();
            }


        }
        [HttpPost, CustomFilter]
        public JsonResult AddSearchDataToSession(string SearchData, string Type)
        {
            if (Type == "addSession")
            {
                HttpContext.Session.SetString("searchData", SearchData);
            }
            else if (Type == "removeSession")
            {
                HttpContext.Session.Remove("searchData");
            }

            MessageModel message = new MessageModel();
            message.isSuccess = "true";
            return new JsonResult(message);

        }
        public DataSet UrgentBulletinCount()
        {

            try
            {
                DataSet ds = new DataSet();
                SqlCommand cmd = new SqlCommand("SP_OVI_Urgent_Bulletin", sqlCon);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@Identflag", "Take_UrgentBulletinCount");
                cmd.Parameters.AddWithValue("@Emp_Id", HttpContext.Session.GetString("EmpId"));
                cmd.Parameters.AddWithValue("@UserRole", HttpContext.Session.GetString("UserRole"));
                if (sqlCon.State == ConnectionState.Closed)
                {
                    sqlCon.Open();
                }
                SqlDataAdapter sda = new SqlDataAdapter(cmd);
                sda.Fill(ds);

                if (ds.Tables.Count > 0)
                {
                    ds.Tables[0].TableName = "tbl_todo_list";
                    ds.Tables[1].TableName = "tbl_bulletin_count";
                }
                //List<UrgentBulletin> MyList = new List<UrgentBulletin>();
                //if (ds.Tables[1].Rows.Count > 0)
                //{
                //    foreach (DataRow row in ds.Tables[1].Rows)
                //    {
                //        UrgentBulletin lnk = new UrgentBulletin();
                //        lnk.Bulletine_Count = Convert.ToInt32(row["Bulletin_count"]);
                //        MyList.Add(lnk);
                //    }
                //}
                return ds;
            }
            catch (Exception e)
            {
                throw new MyAppException(e.Message);
            }
            finally
            {
                sqlCon.Close();
            }
        }
        [HttpGet, CustomFilter]
        public DataTable GetNotificationDetails(string Identflag)
        {

            try
            {
                DataTable dt = new DataTable();
                SqlCommand cmd = new SqlCommand("SP_OVI_Get_NotificationDetails", sqlCon);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@Identflag", Identflag);
                cmd.Parameters.AddWithValue("@Emp_Id", HttpContext.Session.GetString("EmpId"));
                if (sqlCon.State == ConnectionState.Closed)
                {
                    sqlCon.Open();
                }
                SqlDataAdapter sda = new SqlDataAdapter(cmd);
                sda.Fill(dt);

                return dt;
            }
            catch (Exception e)
            {
                throw new MyAppException(e.Message);
            }
            finally
            {
                sqlCon.Close();
            }

        }

        [HttpPost, CustomFilter]
        public JsonResult Get_Master_Search_Data(string prefix)
        {

            try
            {

                SqlCommand cmd = new SqlCommand("SP_OVI_Fetch_Master_Data", sqlCon);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@IdenFlag", "SearchClients");
                cmd.Parameters.AddWithValue("@SearchText", prefix);
                if (sqlCon.State == System.Data.ConnectionState.Closed)
                {
                    sqlCon.Open();
                }
                SqlDataAdapter sda = new SqlDataAdapter(cmd);
                DataTable dt = new DataTable();
                sda.Fill(dt);

                List<AssetPricing> CustomerList = new List<AssetPricing>();

                if (dt.Rows.Count > 0)
                {
                    foreach (DataRow row in dt.Rows)
                    {
                        AssetPricing lnk = new AssetPricing();
                        lnk.CustomerName = row["CLIENTS_NAME"].ToString();
                        CustomerList.Add(lnk);
                    }
                }
                return new JsonResult(CustomerList);
            }
            catch (Exception e)
            {
                throw new MyAppException(e.Message);
            }
            finally
            {
                sqlCon.Close();
            }

        }


        [HttpGet, CustomFilter]
        public JsonResult AutoComplete(string prefix)
        {


            try
            {
                SqlCommand cmd = new SqlCommand("SP_OVI_Fetch_Master_Data", sqlCon);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@IdenFlag", "SearchClients");
                cmd.Parameters.AddWithValue("@SearchText", prefix);
                if (sqlCon.State == System.Data.ConnectionState.Closed)
                {
                    sqlCon.Open();
                }
                SqlDataAdapter sda = new SqlDataAdapter(cmd);
                DataTable dt = new DataTable();
                sda.Fill(dt);

                string custname = "";
                List<clsTopSearch> lstClsTopSearches = new List<clsTopSearch>();

                if (dt.Rows.Count > 0)
                {
                    foreach (DataRow row in dt.Rows)
                    {
                        clsTopSearch lnk = new clsTopSearch();
                        //lnk.ClientID = row["CLIENTS_NO"].ToString();
                        //lnk.CustName = row["CLIENTS_NAME"].ToString();
                        custname += row["CLIENTS_NAME"].ToString() + ",";

                        lstClsTopSearches.Add(lnk);
                    }
                }
                custname = custname.TrimEnd(',');
                return Json(custname);
            }
            catch (Exception e)
            {
                throw new MyAppException(e.Message);
            }
            finally
            {
                sqlCon.Close();
            }


            //return Json(lstClsTopSearches);
        }

        //[HttpGet]
        //public ActionResult AutoComplete()
        //{

        //    return View();
        //}
        [HttpGet, CustomFilter]
        public DataTable GetToDoList_Data()
        {

            try
            {

                DataTable dt = new DataTable();
                SqlCommand cmd = new SqlCommand("SP_OVI_Urgent_Bulletin", sqlCon);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@Identflag", "ToDoListData");
                cmd.Parameters.AddWithValue("@Emp_Id", HttpContext.Session.GetString("EmpId"));
                if (sqlCon.State == ConnectionState.Closed)
                {
                    sqlCon.Open();
                }
                SqlDataAdapter sda = new SqlDataAdapter(cmd);
                sda.Fill(dt);

                return dt;
            }
            catch (Exception e)
            {
                throw new MyAppException(e.Message);
            }
            finally
            {
                sqlCon.Close();
            }

        }
        [HttpGet, CustomFilter]
        public PartialViewResult GetBulletinePartialView()
        {
            return PartialView("../UrgentBulletin/_NewBulletin");
        }

        [HttpGet, CustomFilter]
        public DataSet GetAquisitionData(int Month, int Year, string MTD_YTD)
        {

            try
            {

                DataSet ds = new DataSet();
                SqlCommand cmd = new SqlCommand("SP_OVI_Get_Aquisition_Data", sqlCon);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@UserId", HttpContext.Session.GetString("EmpId"));
                cmd.Parameters.AddWithValue("@month", Month);
                cmd.Parameters.AddWithValue("@year", Year);
                cmd.Parameters.AddWithValue("@MTD_YTD", MTD_YTD);
                if (sqlCon.State == ConnectionState.Closed)
                {
                    sqlCon.Open();
                }
                SqlDataAdapter sda = new SqlDataAdapter(cmd);
                cmd.CommandTimeout = 3000;
                sda.Fill(ds);


                ds.Tables[0].TableName = "tbl_liability";
                ds.Tables[1].TableName = "tbl_asset";
                ds.Tables[2].TableName = "tbl_SFR_SAL_A";
                return ds;
            }
            catch (Exception e)
            {
                throw new MyAppException(e.Message);
            }
            finally
            {
                sqlCon.Close();
            }

        }

        public IActionResult Feedback()
        {

            try
            {
                DataTable dt = new DataTable();
                SqlCommand sqlcmd = new SqlCommand("SP_Feedback_GetDropdownValues", sqlCon);
                sqlCon.Open();
                sqlcmd.CommandTimeout = 0;
                sqlcmd.CommandType = CommandType.StoredProcedure;
                sqlcmd.Parameters.AddWithValue("@flag", "RM");
                SqlDataAdapter da = new SqlDataAdapter(sqlcmd);
                da.Fill(dt);

                List<feedbackPageList> listFeedbackPage = new List<feedbackPageList>();
                if (dt.Rows.Count > 0)
                {
                    for (int i = 0; i < dt.Rows.Count; i++)
                    {
                        feedbackPageList feedbackPage = new feedbackPageList();
                        feedbackPage.ModuleID = Convert.ToInt64(dt.Rows[i]["ModuleID"]);
                        feedbackPage.ModuleName = Convert.ToString(dt.Rows[i]["ModuleName"]);
                        listFeedbackPage.Add(feedbackPage);
                    }
                }

                ViewData["feedbackPageList"] = listFeedbackPage;

                _dashboard.CaptureProductivityDetails(sqlCon, HttpContext.Session.GetString("EmpName").ToString().Trim(), "Feedback", "OneViewIndicator-RM", 1, "Feedback", "Feedback View for EmpCode - " + HttpContext.Session.GetString("EmpId").ToString().Trim());

                return View();
            }
            catch (Exception e)
            {
                throw new MyAppException(e.Message);
            }
            finally
            {
                sqlCon.Close();
            }

        }

        [HttpPost, CustomFilter]
        public string SaveFeedBack(feedback myJSON)
        {
            try
            {
                DataTable dt = new DataTable();

                SqlCommand sqlcmd = new SqlCommand("Sp_SaveFeedback", sqlCon);
                sqlCon.Open();
                sqlcmd.CommandTimeout = 0;
                sqlcmd.CommandType = CommandType.StoredProcedure;
                sqlcmd.Parameters.Add("@LUSR", SqlDbType.VarChar).Value = HttpContext.Session.GetString("EmpId");
                sqlcmd.Parameters.Add("@Remarks", SqlDbType.VarChar).Value = myJSON.Remarks;
                sqlcmd.Parameters.Add("@ModuleID", SqlDbType.Int).Value = myJSON.Modules;
                sqlcmd.Parameters.Add("@Application", SqlDbType.VarChar).Value = "OVI-RM";
                sqlcmd.Parameters.Add("@UI", SqlDbType.Int).Value = myJSON.UI;
                sqlcmd.Parameters.Add("@Perfomance", SqlDbType.Int).Value = myJSON.Performance;
                sqlcmd.Parameters.Add("@Userfreindly", SqlDbType.Int).Value = myJSON.Userfreindly;
                sqlcmd.Parameters.Add("@Experience", SqlDbType.Int).Value = myJSON.Experience;
                sqlcmd.Parameters.Add("@Revelvance", SqlDbType.Int).Value = myJSON.Revelvance;
                sqlcmd.Parameters.Add("@ApplicationVersion", SqlDbType.VarChar).Value = "0.1.1";
                SqlDataAdapter da = new SqlDataAdapter(sqlcmd);
                da.Fill(dt);

                _dashboard.CaptureProductivityDetails(sqlCon, HttpContext.Session.GetString("EmpName").ToString().Trim(), "Feedback", "OneViewIndicator-RM", 1, "Feedback", "Feedback Submited for EmpCode - " + HttpContext.Session.GetString("EmpId").ToString().Trim());



                return JsonConvert.SerializeObject(dt);
            }
            catch (Exception e)
            {
                throw new MyAppException(e.Message);
            }
            finally
            {
                sqlCon.Close();
            }
        }
        [HttpGet]
        public JsonResult checkSession()
        {
            sessionClass s = new sessionClass();

            if (HttpContext.Session.GetString("EmpId").ToString() != null)
            {
                s.sessionValue = true;
            }
            else
            {
                s.sessionValue = false;
            }
            return new JsonResult(s);
        }

        [CustomFilter]
        public ActionResult DownloadFile(string flagName)
        {
            DataTable dt = new DataTable();
            //DelinquencyDaysCount Days_count = new DelinquencyDaysCount();
            DataSet ds = new DataSet();
            DataTable dt_count = new DataTable();
            SqlCommand cmd = new SqlCommand("SP_OVI_Dashboard_Download", sqlCon);
            cmd.Parameters.AddWithValue("@UserId", HttpContext.Session.GetString("EmpId").ToString());
            cmd.Parameters.AddWithValue("@Flag", flagName);
            cmd.CommandType = CommandType.StoredProcedure;
            SqlDataAdapter da = new SqlDataAdapter(cmd);
            if (sqlCon.State == ConnectionState.Closed)
            {
                sqlCon.Open();
            }
            da.Fill(ds);
            if (ds.Tables[0].Rows.Count > 0)
            {
                dt = ds.Tables[0];

                _dashboard.CaptureProductivityDetails(sqlCon, HttpContext.Session.GetString("EmpName").ToString().Trim(), "Dashboard", "OneViewIndicator-RM", 1, "Dashboard", "Dashboard " + flagName + " for EmpCode - " + HttpContext.Session.GetString("EmpId").ToString().Trim());

            }
            else
            {
                //var msg = "alert('Are you sure want to Continue?');";
                //return new JavaScriptResult() { Script = msg };
                //return JavaScript("<script>alert(\"some message\")</script>");
                TempData["ErrorMessage"] = "No Data Record Found !!!";
                return RedirectToAction("Dashboard");
            }
            sqlCon.Close();
            string responce = string.Empty;
            if (dt.Rows.Count > 0)
            {
                UploadController uploadController = new UploadController();
                string fileName = flagName == "Portfolio" ? flagName : "Delinquency_" + flagName;
                responce = uploadController.ExportExcel(dt, fileName, "_Detail");
            }

            var fileNameSplit = responce.Split("~")[0];

            //Build the File Path.
            string path = Path.Combine(Directory.GetCurrentDirectory(), @"Error\") + responce;


            //Read the File data into Byte Array.
            byte[] bytes = System.IO.File.ReadAllBytes(path);
            // _dashboard.CaptureProductivityDetails(sqlCon, HttpContext.Session.GetString("EmpName").ToString().Trim(), "Upload", "OneViewIndicator-RM", 1, "UploadMaster", "Download sample file " + fileName + " for EmpCode - " + HttpContext.Session.GetString("EmpId").ToString().Trim());
            System.IO.File.Delete(path);
            //Send the File to Download.
            return File(bytes, "application/octet-stream", fileNameSplit + ".csv");
        }

    }
}
