using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Net;
using System.Web;
using Dashboard.Models;
using System.Data.SqlClient;
using Dashboard.Interfaces;
using Dashboard.Repositories;
using System.DirectoryServices;

namespace Dashboard.Controllers
{
    public class LoginController : Controller
    {
        // SqlConnection sqlCon = DataHelper.SqlHelper.openCon();
        DataSet chkstatus = new DataSet();
        ResponseContent message = new ResponseContent();
        SqlConnection sqlCon = new SqlConnection(clsConnectionString.GetConnectionString());
        DBClass dBClass = new DBClass();
        private readonly IDashboard _dashboard;
        private readonly OviSettings _oviSettings;
        SqlCommand cmdcount = null;

        Common cs = new Common();
        public LoginController()
        {
            _dashboard = new DashboardRepository();
            _oviSettings = AppConfiguration.GetOviSettings();
        }
        [HttpGet]
        public IActionResult Index()
        {
            string url = "";
            string listBusiness = "";
            string UserId = "";
            string IP = HttpContext.Request.Query["IP"];
            string PMS_Link = string.Empty;
            if (HttpContext.Request.Query["USERID"].ToString() != "")
            {
                PMS_Link = cs.Get_PMS_Link("PMS", "Live");
                Global.LoginUrl = PMS_Link;

                //UserId = EncryptDecrypt.Decrypt(HttpContext.Request.Query["USERID"].ToString());
                UserId = HttpContext.Request.Query["USERID"].ToString();
                HttpContext.Session.SetString("EmpCode", UserId);
                HttpContext.Session.SetString("EmpId", UserId);
                HttpContext.Session.SetString("EmpName", UserId);

                cmdcount = new SqlCommand("SP_OVI_ValidateUser", sqlCon);
                cmdcount.CommandType = CommandType.StoredProcedure;
                cmdcount.Parameters.AddWithValue("@UserId", HttpContext.Session.GetString("EmpCode"));
                sqlCon.Open();
                DataTable dt_lblBusiness = new DataTable();
                dt_lblBusiness.Load(cmdcount.ExecuteReader());
                cmdcount.Dispose();
                if (dt_lblBusiness != null)
                {
                    if (dt_lblBusiness.Rows.Count > 0)
                    {
                        //Msg = dt_lbl.Rows[0]["EmpCode"].ToString();

                        List<string> list = new List<string>();
                        for (int i = 0; i < dt_lblBusiness.Rows.Count; i++)
                        {
                            list.Add(dt_lblBusiness.Rows[i]["Business"].ToString());
                        }
                        listBusiness = string.Join(",", list);
                        HttpContext.Session.SetString("BusinessRole", listBusiness);

                    }
                }
                chkstatus = checkUserMaster(UserId);
                if (chkstatus.Tables[0].Rows.Count > 0 && listBusiness.Contains("RM"))
                {
                    HttpContext.Session.SetString("sectionType", "RMView");
                    url = "/Home/Dashboard?USERID=" + HttpUtility.UrlEncode(EncryptDecrypt.Encrypt(UserId)) + "&IP=" + HttpUtility.UrlEncode(HttpContext.Request.Query["IP"]);
                }
                else if (chkstatus.Tables[0].Rows.Count > 0 && listBusiness.Contains("CM"))
                {
                    HttpContext.Session.SetString("sectionType", "CMView");
                    url = "/CM/CMDashboard?USERID=" + HttpUtility.UrlEncode(HttpContext.Request.Query["USERID"]) + "&IP=" + HttpUtility.UrlEncode(HttpContext.Request.Query["IP"]);
                }
                return Redirect(url);
            }
            else
            {
                return View();

            }
        }
         
        public JsonResult LoginUser([FromBody] Login login)
        {
            message.isSuccess = "true";
            bool Isvalid = false;


            //login.Password = AESEncrytDecry.DecryptStringAES(login.Password);
            //login.Password = EncryptDecrypt.Encrypt(login.Password);
            login.Password = login.Password;

            chkstatus = checkUserMaster(login.UserName);
            Isvalid = _oviSettings.BypassLdap
                ? true
                : ValidateActiveDirectoryLogin("ldap.hbctxdom.com", EncryptDecrypt.Encrypt(login.UserName), login.Password);

            HttpContext.Session.SetString("EmpCode", login.UserName);

            if ((Isvalid))
            {
                if (chkstatus.Tables[0].Rows.Count > 0)
                {
                    if (_oviSettings.BypassActiveStatusCheck || chkstatus.Tables[0].Rows[0]["Active"].ToString() == "True")
                    {
                        if ((chkstatus.Tables[0].Rows[0]["LastLogoutDate"].ToString()) != null && (chkstatus.Tables[0].Rows[0]["LastLogOutDate"].ToString()) != "")
                        {
                            DateTime? datetimeLastLogout = Convert.ToDateTime(chkstatus.Tables[0].Rows[0]["LastLogoutDate"].ToString());
                            DateTime? datetimeLogin = Convert.ToDateTime(chkstatus.Tables[0].Rows[0]["LastLoginDate"].ToString());
                            if (datetimeLastLogout < datetimeLogin)
                            {
                                DateTime currenttime = System.DateTime.Now;
                                if (!(datetimeLogin < currenttime.AddMinutes(5)))
                                {

                                    message.Msg = "User is already Logged-in! Kindly Logout and try again.";
                                    message.isSuccess = "false";
                                    return new JsonResult(message);

                                }
                            }
                        }
                        HttpContext.Session.SetString("EmpId", login.UserName);
                        HttpContext.Session.SetString("EmpName", login.UserName);
                        HttpContext.Session.SetString("AdId", login.UserName);
                        HttpContext.Session.SetString("LoginTime", DateTime.Now.ToString());
                        dBClass = new DBClass();
                        dBClass.APIMethod = "UpdateSuccessfulLoginUsingModel";
                        dBClass.userid = login.UserName;
                        string LoginId = login.UserName;
                        //string LoginId = ConnectionDB.LoginUpdate(dBClass);
                        HttpContext.Session.SetString("LoginId", LoginId);

                        DataTable dtlandingpage = new DataTable();
                        dtlandingpage = chkmappmaster(0, login.UserName);
                        SqlCommand cmdcount = null;

                        cmdcount = new SqlCommand("SP_OVI_ValidateUser", sqlCon);
                        cmdcount.CommandType = CommandType.StoredProcedure;
                        cmdcount.Parameters.AddWithValue("@UserId", HttpContext.Session.GetString("EmpCode"));
                        sqlCon.Open();
                        DataTable dt_lblBusiness = new DataTable();
                        dt_lblBusiness.Load(cmdcount.ExecuteReader());
                        cmdcount.Dispose();
                        if (dt_lblBusiness != null)
                        {
                            if (dt_lblBusiness.Rows.Count > 0)
                            {


                                List<string> list = new List<string>();
                                for (int i = 0; i < dt_lblBusiness.Rows.Count; i++)
                                {
                                    list.Add(dt_lblBusiness.Rows[i]["Business"].ToString());
                                }
                                string listBusiness = string.Join(",", list);
                                HttpContext.Session.SetString("BusinessRole", listBusiness);

                            }
                        }

                        if (dtlandingpage.Rows.Count > 0)
                        {
                            HttpContext.Session.SetString("CheckUser", EncryptDecrypt.Decrypt("ZOm+pH74HgZ/lO4by0LPGQ=="));
                            HttpContext.Session.SetString("Dept", dtlandingpage.Rows[0]["Dept"].ToString());


                            message.Url = "/Login/SelectionPage";//"/Home/Dashboard?USERID=" + EncryptDecrypt.Encrypt(login.UserName);

                            sqlCon.Close();
                        }
                        else
                        {
                            int b = 2;
                            SqlCommand checkadminlanding = new SqlCommand("Check_Report_Login", sqlCon);
                            checkadminlanding.CommandType = CommandType.StoredProcedure;
                            checkadminlanding.Parameters.AddWithValue("@emp_code", login.UserName);

                            if (checkadminlanding.Connection.State == ConnectionState.Closed)
                            {
                                checkadminlanding.Connection.Open();
                            }

                            int a = Convert.ToInt32(checkadminlanding.ExecuteScalar());
                            if (a > 0)
                            {
                                //HttpContext.Session.SetString("CheckUser", EncryptDecrypt.Decrypt("6Ux+Qdao+R6EIR8hHxueXw=="));
                                HttpContext.Session.SetString("CheckUser", "6Ux+Qdao+R6EIR8hHxueXw==");
                                HttpContext.Session.SetString("ReportUser", login.UserName);

                                message.Url = "/Login/SelectionPage";//"/Home/Dashboard?USERID=" + EncryptDecrypt.Encrypt(login.UserName);

                            }
                            else
                            {
                                DataTable dtlandingpageacm = new DataTable();
                                dtlandingpage = chkmappmaster(1, login.UserName);
                                if (dtlandingpage.Rows.Count > 0)
                                {
                                    HttpContext.Session.SetString("Dept", dtlandingpage.Rows[0]["Dept"].ToString());
                                    //HttpContext.Session.SetString("CheckUser", EncryptDecrypt.Decrypt("troaxMOhoRAkJrv2Lsj6/w=="));
                                    HttpContext.Session.SetString("CheckUser", "troaxMOhoRAkJrv2Lsj6/w==");

                                    if (dtlandingpage.Rows[0]["Dept"].ToString() == "Credit")
                                    {

                                        message.Url = "/Login/SelectionPage"; //"/Home/Dashboard?USERID=" + EncryptDecrypt.Encrypt(login.UserName);

                                    }
                                    else

                                        message.Url = "/Login/SelectionPage"; //"/Home/Dashboard?USERID=" + EncryptDecrypt.Encrypt(login.UserName);

                                }
                                else
                                {

                                    SqlConnection connection1 = sqlCon;
                                    SqlCommand cmdcounter = null;
                                    string Msg = string.Empty;
                                    try
                                    {
                                        cmdcounter = new SqlCommand("SP_OVI_ValidateUser", connection1);
                                        cmdcounter.CommandType = CommandType.StoredProcedure;
                                        cmdcounter.Parameters.AddWithValue("@UserId", HttpContext.Session.GetString("EmpCode"));
                                        connection1.Open();
                                        DataTable dt_lbl = new DataTable();
                                        dt_lbl.Load(cmdcounter.ExecuteReader());
                                        cmdcounter.Dispose();
                                        if (dt_lbl != null)
                                        {
                                            if (dt_lbl.Rows.Count > 0)
                                            {
                                                Msg = dt_lbl.Rows[0]["EmpCode"].ToString();
                                            }
                                        }
                                    }
                                    catch (Exception ex)
                                    {
                                        Msg = ex.Message.ToString();
                                    }
                                    if (!string.IsNullOrEmpty(Msg))
                                    {

                                        message.Url = "/Login/SelectionPage"; //"/Home/Dashboard?Val=" + b;
                                        message.isSuccess = "true";


                                    }
                                    else
                                    {
                                        message.Msg = "Your LoginID Is not Mapped with any LS ID. Kindly raised the call With Product Team. Ex. EEG, BBG, Credit";
                                        message.isSuccess = "false";

                                    }

                                }
                            }
                            sqlCon.Close();
                        }
                        sqlCon.Close();
                        //ds.Dispose();
                        string CurrentIP = Response.HttpContext.Connection.RemoteIpAddress.ToString();
                        if (CurrentIP == "::1")
                        {
                            CurrentIP = Dns.GetHostEntry(Dns.GetHostName()).AddressList[1].ToString();
                        }
                        HttpContext.Session.SetString("EncryptedId", login.UserName);
                        HttpContext.Session.SetString("EncryptedIP", CurrentIP);

                        Global.LoginUrl = "/Login/Index";
                    }
                    else
                    {
                        message.Msg = "Your LoginID Is " + chkstatus.Tables[0].Rows[0]["Status"].ToString() + ". Kindly raised the request in ISAC. Application Name: One View Indicator and Application ID : ISG0000434";
                        message.isSuccess = "false";

                    }
                }
                else
                {
                    message.Msg = "Your ID is not mapped ,Kindly raised the request in ISAC. Application Name: One View Indicator and Application ID : ISG0000434";
                    message.isSuccess = "false";

                }
            }
            else
            {
                dBClass = new DBClass();
                dBClass.APIMethod = "UpdateUnsuccessfulAttempt";
                dBClass.userid = login.UserName;
                string k = string.Empty;

                k = ConnectionDB.LoginUpdate(dBClass);

                if ((k == "3"))
                {
                    dBClass.APIMethod = "LockUserId";
                    dBClass.userid = login.UserName;
                    ConnectionDB.LoginUpdate(dBClass);
                }
                message.Msg = "Invalid Domain User Name or Password.";
                message.isSuccess = "false";

            }
            if (message.isSuccess == "true")
            {
                _dashboard.CaptureProductivityDetails(sqlCon, login.UserName.ToString().Trim(), "Login", "OneViewIndicator-CM and RM", 1, "Login successfully", "Login successfully for EmpCode - " + login.UserName.ToString().Trim());

            }
            else
            {
                _dashboard.CaptureProductivityDetails(sqlCon, login.UserName.ToString().Trim(), "Login", "OneViewIndicator-CM and RM", 1, "Login unsuccessfully", "Login unsuccessfully for EmpCode - " + login.UserName.ToString().Trim());

            }
            return new JsonResult(message);
        }

        [HttpPost, CustomFilter]
        public ActionResult LogoutUser()
        {


            string Url = Global.LoginUrl;
            HttpContext.Session.Clear();
            HttpContext.Session.Remove("EmpId");

            Global.LoginUrl = null;

            //Url = "/Login/Index";

            return Redirect(Url + "?LogOut=1");
        }
        [HttpPost]
        public ActionResult RedirectToLogin()
        {


            //string sess = Global.UserID;
            string link = Global.LoginUrl;
            //string abc = HttpContext.Session.GetString("LoginType").ToString();
            Global.LoginUrl = null;
            return Redirect(link);

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

                log.Role = ds.Tables[0].Rows[0]["User_Role"].ToString();
                HttpContext.Session.SetString("UserRole", ds.Tables[0].Rows[0]["User_Role"].ToString());
                HttpContext.Session.SetString("CMUserRole", ds.Tables[0].Rows[0]["ProfileDescription"].ToString());
            }
            sqlCon.Close();
            return ds;
        }

        public bool ValidateActiveDirectoryLogin(string Domain, string UserName, string Password)
        {
            bool success = false;
            if (_oviSettings.BypassLdap)
                return true;
            try
            {
                //    string DN;
                //DN = "ldap.hbctxdom.com";
                DirectoryEntry Entry = new DirectoryEntry("LDAP://ldap.hbctxdom.com", EncryptDecrypt.Decrypt(UserName), EncryptDecrypt.Decrypt(Password));
                DirectorySearcher searcher = new DirectorySearcher(Entry);
                searcher.SearchScope = SearchScope.OneLevel;

                SearchResult results = searcher.FindOne();
                success = (results != null);
            }
            catch (Exception ex)
            {
                success = false;
            }
            return success;
        }
        private DataTable chkmappmaster(int intdataid, string Username)
        {
            DataSet ds = new DataSet();
            SqlCommand sqlcmd = new SqlCommand("check_user", sqlCon);
            sqlcmd.CommandTimeout = 0;
            sqlcmd.CommandType = CommandType.StoredProcedure;
            sqlcmd.Parameters.Add("@userid", SqlDbType.VarChar).Value = Username;
            sqlcmd.Parameters.Add("@intdataid", SqlDbType.VarChar).Value = intdataid;
            SqlDataAdapter da = new SqlDataAdapter(sqlcmd);
            da.Fill(ds);
            da.Dispose();
            sqlcmd.Dispose();
            sqlCon.Close();
            return ds.Tables[0];
        }

        public ActionResult SelectionPage()
        {

            cmdcount = new SqlCommand("SP_OVI_ValidateUser", sqlCon);
            cmdcount.CommandType = CommandType.StoredProcedure;
            cmdcount.Parameters.AddWithValue("@UserId", HttpContext.Session.GetString("EmpCode"));
            sqlCon.Open();
            DataTable dt_lblBusiness = new DataTable();
            dt_lblBusiness.Load(cmdcount.ExecuteReader());
            cmdcount.Dispose();
            if (dt_lblBusiness != null)
            {
                if (dt_lblBusiness.Rows.Count > 0)
                {
                    //Msg = dt_lbl.Rows[0]["EmpCode"].ToString();

                    List<string> list = new List<string>();
                    for (int i = 0; i < dt_lblBusiness.Rows.Count; i++)
                    {
                        list.Add(dt_lblBusiness.Rows[i]["Business"].ToString());
                    }
                    string listBusiness = string.Join(",", list);
                    HttpContext.Session.SetString("BusinessRole", listBusiness);

                }
            }
            return View();


        }

        [HttpPost]
        public JsonResult SelectedPage(string sectionType)
        {

            string CurrentIP = Response.HttpContext.Connection.RemoteIpAddress.ToString();
            if (CurrentIP == "::1")
            {
                CurrentIP = Dns.GetHostEntry(Dns.GetHostName()).AddressList[1].ToString();
            }
            string urlRediect = "";

            HttpContext.Session.SetString("sectionType", sectionType);

            if (HttpContext.Session.GetString("EmpCode") == null)
            {
                urlRediect = "/Login/Index";
                //urlRediect = "/Shared/_SessionExpiry.cshtml";
                message.Url = urlRediect;
                message.isSuccess = "true";
            }
            else
            {
                string userName = HttpContext.Session.GetString("EmpCode").ToString();
                string businessRole = HttpContext.Session.GetString("BusinessRole").ToString();

                if (sectionType == "RMView")
                {
                    urlRediect = "/Home/Dashboard?USERID=" + HttpUtility.UrlEncode(EncryptDecrypt.Encrypt(userName)) + "&IP=" + HttpUtility.UrlEncode(EncryptDecrypt.Encrypt(CurrentIP));
                }
                else if (sectionType == "CMView")
                {
                    urlRediect = "/CM/CMDashboard?USERID=" + HttpUtility.UrlEncode(EncryptDecrypt.Encrypt(userName)) + "&IP=" + HttpUtility.UrlEncode(EncryptDecrypt.Encrypt(CurrentIP));
                }


                message.isSuccess = "true";
                chkstatus = checkRMUserMaster(userName);
                if (chkstatus.Tables[0].Rows.Count > 0 && sectionType == "RMView" && businessRole.Contains("RM"))
                {
                    if (_oviSettings.BypassActiveStatusCheck || chkstatus.Tables[0].Rows[0]["Active"].ToString() == "True")
                    {

                        DataTable dtlandingpage = new DataTable();
                        dtlandingpage = chkmappmaster(0, userName);
                        if (dtlandingpage.Rows.Count > 0)
                        {
                            HttpContext.Session.SetString("CheckUser", EncryptDecrypt.Decrypt("ZOm+pH74HgZ/lO4by0LPGQ=="));
                            HttpContext.Session.SetString("Dept", dtlandingpage.Rows[0]["Dept"].ToString());

                            //Response.Redirect("Index.aspx?USERID=" + EncryptDecrypt.Encrypt(login.UserName), false);
                            //return (message);
                            message.Url = urlRediect;

                            sqlCon.Close();
                        }
                        else
                        {
                            int b = 2;
                            SqlCommand checkadminlanding = new SqlCommand("Check_Report_Login", sqlCon);
                            checkadminlanding.CommandType = CommandType.StoredProcedure;
                            checkadminlanding.Parameters.AddWithValue("@emp_code", userName);

                            if (checkadminlanding.Connection.State == ConnectionState.Closed)
                            {
                                checkadminlanding.Connection.Open();
                            }

                            int a = Convert.ToInt32(checkadminlanding.ExecuteScalar());
                            if (a > 0)
                            {
                                HttpContext.Session.SetString("CheckUser", EncryptDecrypt.Decrypt("6Ux+Qdao+R6EIR8hHxueXw=="));
                                HttpContext.Session.SetString("ReportUser", userName);
                                //Response.Redirect("SchedulerReports.aspx?USERID=" + txtUsername.Text + "&Val=" + b);
                                message.Url = urlRediect;

                            }
                            else
                            {
                                DataTable dtlandingpageacm = new DataTable();
                                dtlandingpage = chkmappmaster(1, userName);
                                if (dtlandingpage.Rows.Count > 0)
                                {
                                    HttpContext.Session.SetString("Dept", dtlandingpage.Rows[0]["Dept"].ToString());
                                    HttpContext.Session.SetString("CheckUser", EncryptDecrypt.Decrypt("troaxMOhoRAkJrv2Lsj6/w=="));

                                    if (dtlandingpage.Rows[0]["Dept"].ToString() == "Credit")
                                    {
                                        //Response.Redirect("SupervisorCM.aspx?USERID=" + EncryptDecrypt.Encrypt(login.UserName), false);
                                        message.Url = urlRediect;

                                    }
                                    else
                                        //Response.Redirect("SupervisorDefault.aspx?USERID=" + EncryptDecrypt.Encrypt(login.UserName), false);
                                        message.Url = urlRediect;

                                }
                                else
                                {
                                    //Session["CheckUser"] = EncryptDecrypt.Decrypt("troaxMOhoRAkJrv2Lsj6/w==");
                                    //sqlconn = new SqlConnection(DalConnection.clsSqlConnectionstring("PMS"));
                                    SqlConnection connection1 = sqlCon;
                                    SqlCommand cmdcounter = null;
                                    string Msg = string.Empty;
                                    try
                                    {
                                        cmdcounter = new SqlCommand("SP_OVI_ValidateUser", connection1);
                                        cmdcounter.CommandType = CommandType.StoredProcedure;
                                        cmdcounter.Parameters.AddWithValue("@UserId", HttpContext.Session.GetString("EmpCode"));
                                        connection1.Open();
                                        DataTable dt_lbl = new DataTable();
                                        dt_lbl.Load(cmdcounter.ExecuteReader());
                                        cmdcounter.Dispose();
                                        if (dt_lbl != null)
                                        {
                                            if (dt_lbl.Rows.Count > 0)
                                            {
                                                Msg = dt_lbl.Rows[0]["EmpCode"].ToString();
                                                // HttpContext.Session.SetString("UserRole", dt_lbl.Rows[0]["EMPRole"].ToString());

                                            }
                                        }
                                    }
                                    catch (Exception ex)
                                    {
                                        Msg = ex.Message.ToString();
                                    }
                                    if (!string.IsNullOrEmpty(Msg))
                                    {
                                        //Response.Redirect("PMS/drilldown.aspx", false);
                                        //Response.Redirect("SchedulerReports.aspx?USERID=" + txtUsername.Text + "&Val=" + b);
                                        //  message.Url = urlRediect + "?Val=" + b;
                                        message.Url = urlRediect;
                                        message.isSuccess = "true";


                                    }
                                    else
                                    {
                                        message.Msg = "Your LoginID Is not Mapped with any LS ID. Kindly raised the call With Product Team. Ex. EEG, BBG, Credit";
                                        message.isSuccess = "false";
                                        //lblErrorMsg.Text = "Your LoginID Is not Mapped with any LS ID. Kindly raised the call With Product Team. Ex. EEG, BBG, Credit";
                                    }

                                }
                            }
                            sqlCon.Close();
                        }
                        sqlCon.Close();
                        //ds.Dispose();
                    }
                    else
                    {
                        message.Msg = "Your LoginID Is " + chkstatus.Tables[0].Rows[0]["Status"].ToString() + ". Kindly raised the request in ISAC. Application Name: One View Indicator and Application ID : ISG0000434";
                        message.isSuccess = "false";

                    }
                }
                else
                {
                    if (sectionType == "CMView" && businessRole.Contains("CM"))
                    {

                        string DecryIP = EncryptDecrypt.Encrypt(CurrentIP);
                        message.Url = urlRediect;
                    }
                    else
                    {
                        message.Msg = "Your ID is not mapped ,Kindly raised the request in ISAC. Application Name: One View Indicator and Application ID : ISG0000434";
                        message.isSuccess = "false";
                    }


                }
            }

            return new JsonResult(message);
        }

        private DataSet checkRMUserMaster(string userName)
        {

            Login log = new Login();
            DataSet ds = new DataSet();
            SqlCommand sqlcmd = new SqlCommand("sp_Login_New_RMView", sqlCon);
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

            }
            sqlCon.Close();
            return ds;
        }

    }
}
