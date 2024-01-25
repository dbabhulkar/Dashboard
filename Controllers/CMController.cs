using Dashboard.Models;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using System.Data;
using System.Net;
using System.Threading;

namespace Dashboard.Controllers
{
    public class CMController : Controller
    {
        SqlConnection sqlCon = new SqlConnection(clsConnectionString.GetConnectionString());
        SqlCommand cmd = null;
        SqlDataAdapter sda = null;
        GetData getData = new GetData();
        clsConnectionString clsConnectionString = new clsConnectionString();
        DataSet chkstatus = new DataSet();
        public IActionResult Index()
        {
            return View();
        } 
           
            [CustomFilter]
            public IActionResult CMDashboard(string USERID, string IP)
            {
                try
                {

                    string CurrentIP = Response.HttpContext.Connection.RemoteIpAddress.ToString();
                    if (CurrentIP == "::1")
                    {
                        CurrentIP = Dns.GetHostEntry(Dns.GetHostName()).AddressList[1].ToString();
                    }
                    string DecryIP = EncryptDecrypt.Decrypt(IP);

                    HttpContext.Session.SetString("EncryptedIP", IP);
                    HttpContext.Session.SetString("EncryptedId", USERID);
                    //HttpContext.Session.SetString("sectionType", "CMView");
                    HttpContext.Session.SetString("CentralTeam", "No");
                    if (DecryIP == CurrentIP)
                    {
                        //if (HttpContext.Session.GetString("EmpId") == null)
                        //    {
                        //        string DescUserId = EncryptDecrypt.Decrypt(USERID);
                        //        chkstatus = checkUserMaster(DescUserId.Trim());

                        //        HttpContext.Session.SetString("EmpCode", DescUserId.Trim());
                        //        HttpContext.Session.SetString("EmpId", DescUserId.Trim());
                        //        HttpContext.Session.SetString("EmpName", DescUserId.Trim());
                        //    }

                        //string userid = EncryptDecrypt.Decrypt(USERID);
                        string user_id = HttpContext.Session.GetString("EmpId").ToString();
                        //string sqlComm = clsConnectionString.GetConnectionString();
                        //sqlCon = new SqlConnection(Startup.connectionstring);
                        //string role = HttpContext.Session.GetString("CheckUser");
                        DataSet dataSet = new DataSet();
                        cmd = new SqlCommand("USP_Insert_Data_In_Activity_Log_Tracker", sqlCon);
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@Form_Name", "CMView");
                        cmd.Parameters.AddWithValue("@Emp_Code", HttpContext.Session.GetString("EmpId"));
                        cmd.Parameters.AddWithValue("@Module_Name", "CM Module");
                        cmd.Parameters.AddWithValue("@Total_Count", "-");
                        cmd.Parameters.AddWithValue("@Activity", "Dashboard View");
                        cmd.Parameters.AddWithValue("@Activity_Details", "View Data Graphically");
                        if (sqlCon.State == ConnectionState.Closed)
                        {
                            sqlCon.Open();
                        }
                        sda = new SqlDataAdapter(cmd);
                        sda.Fill(dataSet);
                        sqlCon.Close();

                    }
                    else
                    {
                        string url = Global.LoginUrl;
                        HttpContext.Session.Clear();
                        HttpContext.Session.Remove("EmpId");

                        return Redirect(url);
                    }

                }
                catch (Exception ex)
                {
                    if (sqlCon != null)
                        sqlCon.Close();

                    if (cmd != null)
                        cmd.Dispose();

                    if (sda != null)
                        sda.Dispose();
                }
                finally
                {
                    if (sqlCon != null)
                        sqlCon.Close();

                    if (cmd != null)
                        cmd.Dispose();

                    if (sda != null)
                        sda.Dispose();
                }
                return View();
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

            [HttpGet]
            public IActionResult Portfolio()
            {
                try
                {
                    //sqlCon = new SqlConnection(Startup.connectionstring);

                    //string role = HttpContext.Session.GetString("CheckUser");
                    DataSet dataSet = new DataSet();
                    cmd = new SqlCommand("USP_Insert_Data_In_Activity_Log_Tracker", sqlCon);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@Form_Name", "Portfolio");
                    cmd.Parameters.AddWithValue("@Emp_Code", HttpContext.Session.GetString("EmpId"));
                    cmd.Parameters.AddWithValue("@Module_Name", "Portfolio Module");
                    cmd.Parameters.AddWithValue("@Total_Count", "-");
                    cmd.Parameters.AddWithValue("@Activity", "Portfolio View");
                    cmd.Parameters.AddWithValue("@Activity_Details", "View Data Graphically");
                    if (sqlCon.State == ConnectionState.Closed)
                    {
                        sqlCon.Open();
                    }
                    sda = new SqlDataAdapter(cmd);
                    sda.Fill(dataSet);
                    sqlCon.Close();
                }
                catch (Exception)
                {
                    if (sqlCon != null)
                        sqlCon.Close();

                    if (cmd != null)
                        cmd.Dispose();

                    if (sda != null)
                        sda.Dispose();
                }
                finally
                {
                    if (sqlCon != null)
                        sqlCon.Close();

                    if (cmd != null)
                        cmd.Dispose();

                    if (sda != null)
                        sda.Dispose();
                }
                return View();
            }

            #region Dashboard

            [HttpGet]
            public JsonResult GetPortfolioData(string dateTime)
            {
                clsDashboardVariable clsDashboardVariable = new clsDashboardVariable();
                clsDashboardVariable.Date = dateTime;
                clsDashboardVariable.Type = "Portfolio";
                clsDashboardVariable.EmployeeCode = HttpContext.Session.GetString("EmpId");
                PortfolioMain portfolioMain = getData.GetPortfolioMain(clsDashboardVariable);
                //PortfolioMain portfolioMain = new PortfolioMain();
                //DateTime dateTime1=new DateTime();
                //dateTime1= Convert.ToDateTime(dateTime);
                //List<clsPortfolio> lstClsPortfolio = new List<clsPortfolio>();
                //List<clsCode> lstclsCode = new List<clsCode>();
                //try
                //{
                //    SqlConnection sqlCon = new SqlConnection(Startup.connectionstring);
                //    string role = HttpContext.Session.GetString("CheckUser");
                //    DataSet dt = new DataSet();
                //    SqlCommand cmd = new SqlCommand("SP_OVI_CMViewDashboardData", sqlCon);
                //    cmd.CommandType = CommandType.StoredProcedure;
                //    cmd.Parameters.AddWithValue("@IdentFlag", "Portfolio");
                //    cmd.Parameters.AddWithValue("@CM_Code", HttpContext.Session.GetString("EmpId"));
                //    cmd.Parameters.AddWithValue("@SelectedDate", dateTime1);

                //    if (sqlCon.State == ConnectionState.Closed)
                //    {
                //        sqlCon.Open();
                //    }
                //    SqlDataAdapter sda = new SqlDataAdapter(cmd);
                //    sda.Fill(dt);
                //    sqlCon.Close();

                //    if (dt.Tables[1].Rows.Count > 0)
                //    {
                //        foreach (DataRow row in dt.Tables[1].Rows)
                //        {
                //            clsPortfolio clsPortfolio = new clsPortfolio();

                //            clsPortfolio.Segment = row["Segment"].ToString();
                //            clsPortfolio.NO = row["No"].ToString();
                //            clsPortfolio.ApprLmt = row["ApprLmt"].ToString();
                //            clsPortfolio.Disbursed = row["Disbursed"].ToString();
                //            lstClsPortfolio.Add(clsPortfolio);
                //        }
                //    }

                //    if (dt.Tables[2].Rows.Count > 0)
                //    {
                //        foreach (DataRow row in dt.Tables[2].Rows)
                //        {
                //            clsCode clsCode = new clsCode();

                //            clsCode.Segment = row["Segment"].ToString();
                //            clsCode.Div = row["Div"].ToString();
                //            clsCode.BackgroundColor = row["BackgroundColor"].ToString();
                //            clsCode.HoverBackgroundColor = row["HoverBackgroundColor"].ToString();
                //            lstclsCode.Add(clsCode);
                //        }
                //    }


                //    portfolioMain.clsPortfolio = lstClsPortfolio;
                //    portfolioMain.clsCode = lstclsCode;
                //    sqlCon.Close();
                //}
                //catch (Exception ex)
                //{

                //}
                return new JsonResult(portfolioMain);
            }

            [HttpGet]
            public JsonResult GetLCHUData1(string dateTime)
            {
                clsDashboardVariable clsDashboardVariable = new clsDashboardVariable();
                clsDashboardVariable.Date = dateTime;
                clsDashboardVariable.Type = "LCUHData";
                clsDashboardVariable.EmployeeCode = HttpContext.Session.GetString("EmpId");
                PortfolioMain portfolioMain = getData.GetPortfolioMain(clsDashboardVariable);
                return new JsonResult(portfolioMain);
            }

            [HttpGet]
            public JsonResult GetAURData1(string dateTime)
            {
                clsDashboardVariable clsDashboardVariable = new clsDashboardVariable();
                clsDashboardVariable.Date = dateTime;
                clsDashboardVariable.Type = "AURData";
                clsDashboardVariable.EmployeeCode = HttpContext.Session.GetString("EmpId");
                PortfolioMain portfolioMain = getData.GetPortfolioMain(clsDashboardVariable);
                return new JsonResult(portfolioMain);
            }

            [HttpGet]
            public JsonResult GetDelinquencyData1(string delFilterVal, string dateTime)
            {
                clsDashboardVariable clsDashboardVariable = new clsDashboardVariable();
                clsDashboardVariable.Date = dateTime;
                clsDashboardVariable.Type = "DelinquencyData";
                clsDashboardVariable.FilterId = delFilterVal;
                clsDashboardVariable.EmployeeCode = HttpContext.Session.GetString("EmpId");
                PortfolioMain portfolioMain = getData.GetPortfolioMain(clsDashboardVariable);
                return new JsonResult(portfolioMain);
            }

            [HttpGet]
            public JsonResult GetLCHUData(string dateTime)
            {
                DateTime dateTime1 = new DateTime();
                dateTime1 = Convert.ToDateTime(dateTime);
                clsLCHU clsLCHU = new clsLCHU();
                List<clsCode> lstclsCode = new List<clsCode>();
                try
                {
                    //sqlCon = new SqlConnection(Startup.connectionstring);
                    //string role = HttpContext.Session.GetString("CheckUser");
                    DataSet dataSet = new DataSet();
                    cmd = new SqlCommand("SP_OVI_CMViewDashboardData", sqlCon);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@IdentFlag", "LCUHData");
                    cmd.Parameters.AddWithValue("@CM_Code", HttpContext.Session.GetString("EmpId"));
                    cmd.Parameters.AddWithValue("@SelectedDate", dateTime1);
                    if (sqlCon.State == ConnectionState.Closed)
                    {
                        sqlCon.Open();
                    }
                    sda = new SqlDataAdapter(cmd);
                    sda.Fill(dataSet);
                    sqlCon.Close();
                    List<clsLCHU> lstClsLCHUs = new List<clsLCHU>();

                    List<clsMonthList> lstClsMonthList = new List<clsMonthList>();
                    List<clsPortfolio> lstclsPortfolioList = new List<clsPortfolio>();
                    List<clsPortfolio> lstclsPortfolioListTotal = new List<clsPortfolio>();

                    if (dataSet.Tables[0].Rows.Count > 0)
                    {
                        foreach (DataRow row in dataSet.Tables[0].Rows)
                        {
                            clsMonthList clsMonthList = new clsMonthList();
                            clsMonthList.monthName = row["MonthName"].ToString();
                            lstClsMonthList.Add(clsMonthList);
                        }
                    }

                    if (dataSet.Tables[1].Rows.Count > 0)
                    {
                        foreach (DataRow row in dataSet.Tables[1].Rows)
                        {
                            clsPortfolio clsPortfolio = new clsPortfolio();
                            clsPortfolio = new clsPortfolio();
                            clsPortfolio.Segment = row["Segment"].ToString();
                            clsPortfolio.MonthName = row["MonthName"].ToString();
                            clsPortfolio.ApprLmt = row["Appr"].ToString();
                            clsPortfolio.NO = row["sCount"].ToString();
                            lstclsPortfolioList.Add(clsPortfolio);
                        }
                    }

                    if (dataSet.Tables[2].Rows.Count > 0)
                    {
                        foreach (DataRow row in dataSet.Tables[2].Rows)
                        {
                            clsCode clsCode = new clsCode();

                            clsCode.Segment = row["Segment"].ToString();
                            clsCode.Div = row["Div"].ToString();
                            clsCode.BackgroundColor = row["BackgroundColor"].ToString();
                            clsCode.HoverBackgroundColor = row["HoverBackgroundColor"].ToString();
                            lstclsCode.Add(clsCode);
                        }
                    }

                    if (dataSet.Tables[3].Rows.Count > 0)
                    {
                        foreach (DataRow row in dataSet.Tables[3].Rows)
                        {
                            clsPortfolio clsPortfolio = new clsPortfolio();
                            clsPortfolio.ApprLmt = row["ApprInCr"].ToString();
                            lstclsPortfolioListTotal.Add(clsPortfolio);
                        }
                    }

                    sqlCon.Close();

                    clsLCHU.clsMonthList = lstClsMonthList;
                    clsLCHU.clsPortfolio = lstclsPortfolioList;
                    clsLCHU.clsCode = lstclsCode;
                    clsLCHU.clsPortfolioTotal = lstclsPortfolioListTotal;
                }
                catch (Exception ex)
                {
                    if (sqlCon != null)
                        sqlCon.Close();

                    if (cmd != null)
                        cmd.Dispose();

                    if (sda != null)
                        sda.Dispose();
                }
                finally
                {
                    if (sqlCon != null)
                        sqlCon.Close();

                    if (cmd != null)
                        cmd.Dispose();

                    if (sda != null)
                        sda.Dispose();
                }
                return new JsonResult(clsLCHU);
            }

            [HttpGet]
            public JsonResult GetDelinquencyData(string delFilterVal, string dateTime)
            {
                DateTime dateTime1 = new DateTime();
                dateTime1 = Convert.ToDateTime(dateTime);
                clsLCHU clsLCHU = new clsLCHU();
                List<clsCode> lstclsCode = new List<clsCode>();
                try
                {
                    //sqlCon = new SqlConnection(Startup.connectionstring);
                    //string role = HttpContext.Session.GetString("CheckUser");
                    DataSet dataSet = new DataSet();
                    cmd = new SqlCommand("SP_OVI_CMViewDashboardData", sqlCon);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@IdentFlag", "DelinquencyData");
                    cmd.Parameters.AddWithValue("@CM_Code", HttpContext.Session.GetString("EmpId"));
                    cmd.Parameters.AddWithValue("@DelqFlag", delFilterVal);
                    cmd.Parameters.AddWithValue("@SelectedDate", dateTime1);
                    if (sqlCon.State == ConnectionState.Closed)
                    {
                        sqlCon.Open();
                    }
                    sda = new SqlDataAdapter(cmd);
                    sda.Fill(dataSet);
                    sqlCon.Close();
                    List<clsLCHU> lstClsLCHUs = new List<clsLCHU>();

                    List<clsMonthList> lstClsMonthList = new List<clsMonthList>();
                    List<clsPortfolio> lstclsPortfolioList = new List<clsPortfolio>();

                    if (dataSet.Tables[0].Rows.Count > 0)
                    {
                        foreach (DataRow row in dataSet.Tables[0].Rows)
                        {
                            clsMonthList clsMonthList = new clsMonthList();
                            clsMonthList.monthName = row["MonthName"].ToString();
                            lstClsMonthList.Add(clsMonthList);
                        }
                    }

                    if (dataSet.Tables[1].Rows.Count > 0)
                    {
                        foreach (DataRow row in dataSet.Tables[1].Rows)
                        {
                            clsPortfolio clsPortfolio = new clsPortfolio();
                            clsPortfolio = new clsPortfolio();
                            clsPortfolio.Segment = row["Segment"].ToString();
                            clsPortfolio.MonthName = row["MonthName"].ToString();
                            clsPortfolio.ApprLmt = row["Appr"].ToString();
                            clsPortfolio.NO = row["sCount"].ToString();
                            lstclsPortfolioList.Add(clsPortfolio);
                        }
                    }

                    if (dataSet.Tables[2].Rows.Count > 0)
                    {
                        foreach (DataRow row in dataSet.Tables[2].Rows)
                        {
                            clsCode clsCode = new clsCode();

                            clsCode.Segment = row["Segment"].ToString();
                            clsCode.Div = row["Div"].ToString();
                            clsCode.BackgroundColor = row["BackgroundColor"].ToString();
                            clsCode.HoverBackgroundColor = row["HoverBackgroundColor"].ToString();
                            lstclsCode.Add(clsCode);
                        }
                    }

                    sqlCon.Close();

                    var ls = lstclsPortfolioList.AsEnumerable().OrderBy(a => a.MonthName);

                    clsLCHU.clsMonthList = lstClsMonthList;
                    clsLCHU.clsPortfolio = lstclsPortfolioList;
                    clsLCHU.clsCode = lstclsCode;
                }
                catch (Exception ex)
                {
                    if (sqlCon != null)
                        sqlCon.Close();

                    if (cmd != null)
                        cmd.Dispose();

                    if (sda != null)
                        sda.Dispose();
                }
                finally
                {
                    if (sqlCon != null)
                        sqlCon.Close();

                    if (cmd != null)
                        cmd.Dispose();

                    if (sda != null)
                        sda.Dispose();
                }
                return new JsonResult(clsLCHU);
            }

            [HttpGet]
            public JsonResult GetAURData(string dateTime)
            {
                DateTime dateTime1 = new DateTime();
                dateTime1 = Convert.ToDateTime(dateTime);
                clsLCHU clsLCHU = new clsLCHU();
                List<clsCode> lstclsCode = new List<clsCode>();
                try
                {
                    //sqlCon = new SqlConnection(Startup.connectionstring);
                    //string role = HttpContext.Session.GetString("CheckUser");
                    DataSet dataSet = new DataSet();
                    cmd = new SqlCommand("SP_OVI_CMViewDashboardData", sqlCon);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@IdentFlag", "AURData");
                    cmd.Parameters.AddWithValue("@CM_Code", HttpContext.Session.GetString("EmpId"));
                    cmd.Parameters.AddWithValue("@SelectedDate", dateTime1);
                    if (sqlCon.State == ConnectionState.Closed)
                    {
                        sqlCon.Open();
                    }
                    sda = new SqlDataAdapter(cmd);
                    sda.Fill(dataSet);
                    sqlCon.Close();
                    List<clsLCHU> lstClsLCHUs = new List<clsLCHU>();

                    List<clsMonthList> lstClsMonthList = new List<clsMonthList>();
                    List<clsPortfolio> lstclsPortfolioList = new List<clsPortfolio>();

                    if (dataSet.Tables[0].Rows.Count > 0)
                    {
                        foreach (DataRow row in dataSet.Tables[0].Rows)
                        {
                            clsMonthList clsMonthList = new clsMonthList();
                            clsMonthList.monthName = row["MonthName"].ToString();
                            lstClsMonthList.Add(clsMonthList);
                        }
                    }

                    if (dataSet.Tables[1].Rows.Count > 0)
                    {
                        foreach (DataRow row in dataSet.Tables[1].Rows)
                        {
                            clsPortfolio clsPortfolio = new clsPortfolio();
                            clsPortfolio = new clsPortfolio();
                            clsPortfolio.Segment = row["Segment"].ToString();
                            clsPortfolio.MonthName = row["MonthName"].ToString();
                            clsPortfolio.ApprLmt = row["Appr"].ToString();
                            clsPortfolio.NO = row["sCount"].ToString();
                            lstclsPortfolioList.Add(clsPortfolio);
                        }
                    }


                    if (dataSet.Tables[2].Rows.Count > 0)
                    {
                        foreach (DataRow row in dataSet.Tables[2].Rows)
                        {
                            clsCode clsCode = new clsCode();

                            clsCode.Segment = row["Segment"].ToString();
                            clsCode.Div = row["Div"].ToString();
                            clsCode.BackgroundColor = row["BackgroundColor"].ToString();
                            clsCode.HoverBackgroundColor = row["HoverBackgroundColor"].ToString();
                            lstclsCode.Add(clsCode);
                        }
                    }

                    sqlCon.Close();

                    var ls = lstclsPortfolioList.AsEnumerable().OrderBy(a => a.MonthName);

                    clsLCHU.clsMonthList = lstClsMonthList;
                    clsLCHU.clsPortfolio = lstclsPortfolioList;
                    clsLCHU.clsCode = lstclsCode;
                }
                catch (Exception ex)
                {
                    if (sqlCon != null)
                        sqlCon.Close();

                    if (cmd != null)
                        cmd.Dispose();

                    if (sda != null)
                        sda.Dispose();
                }
                finally
                {
                    if (sqlCon != null)
                        sqlCon.Close();

                    if (cmd != null)
                        cmd.Dispose();

                    if (sda != null)
                        sda.Dispose();
                }
                return new JsonResult(clsLCHU);
            }

            [HttpGet]
            public JsonResult GetHouskeepingData(string dateTime)
            {
                DateTime dateTime1 = new DateTime();
                dateTime1 = Convert.ToDateTime(dateTime);
                List<clsHouskeeping> lstClsHouskeeping = new List<clsHouskeeping>();
                List<clsCode> lstclsCode = new List<clsCode>();
                clsHouskeepingMain clsHouskeepingMain = new clsHouskeepingMain();

                try
                {
                    //sqlCon = new SqlConnection(Startup.connectionstring);
                    // string role = HttpContext.Session.GetString("CheckUser");
                    DataSet dataSet = new DataSet();
                    cmd = new SqlCommand("SP_OVI_CMViewDashboardData", sqlCon);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@IdentFlag", "HousekeepingData");
                    cmd.Parameters.AddWithValue("@CM_Code", HttpContext.Session.GetString("EmpId"));
                    cmd.Parameters.AddWithValue("@SelectedDate", dateTime1);
                    if (sqlCon.State == ConnectionState.Closed)
                    {
                        sqlCon.Open();
                    }
                    sda = new SqlDataAdapter(cmd);
                    sda.Fill(dataSet);
                    sqlCon.Close();

                    if (dataSet.Tables[1].Rows.Count > 0)
                    {
                        foreach (DataRow row in dataSet.Tables[1].Rows)
                        {
                            clsHouskeeping clsHouskeeping = new clsHouskeeping();
                            clsHouskeeping.Segment = row["Segment"].ToString();
                            clsHouskeeping.sCount = row["sCount"].ToString();
                            clsHouskeeping.FileName1 = row["FileName1"].ToString();
                            clsHouskeeping.BackgroundColor = row["BackgroundColor"].ToString();
                            clsHouskeeping.HoverBackgroundColor = row["HoverBackgroundColor"].ToString();
                            lstClsHouskeeping.Add(clsHouskeeping);
                        }
                    }

                    if (dataSet.Tables[2].Rows.Count > 0)
                    {
                        foreach (DataRow row in dataSet.Tables[2].Rows)
                        {
                            clsCode clsCode = new clsCode();

                            clsCode.Segment = row["Segment"].ToString();
                            clsCode.Div = row["Div"].ToString();
                            clsCode.BackgroundColor = row["BackgroundColor"].ToString();
                            clsCode.HoverBackgroundColor = row["HoverBackgroundColor"].ToString();
                            clsCode.FileName = row["fName"].ToString();
                            lstclsCode.Add(clsCode);
                        }
                    }
                    sqlCon.Close();
                }
                catch (Exception ex)
                {
                    if (sqlCon != null)
                        sqlCon.Close();

                    if (cmd != null)
                        cmd.Dispose();

                    if (sda != null)
                        sda.Dispose();
                }
                finally
                {
                    if (sqlCon != null)
                        sqlCon.Close();

                    if (cmd != null)
                        cmd.Dispose();

                    if (sda != null)
                        sda.Dispose();
                }

                clsHouskeepingMain.clsHouskeeping = lstClsHouskeeping;
                clsHouskeepingMain.clsCode = lstclsCode;

                return new JsonResult(clsHouskeepingMain);
            }

            [HttpGet]
            public JsonResult GetPortfolioHubData(string dateTime)
            {
                DateTime dateTime1 = new DateTime();
                dateTime1 = Convert.ToDateTime(dateTime);
                List<clsPortfolio> lstClsPortfolio = new List<clsPortfolio>();
                try
                {
                    //sqlCon = new SqlConnection(Startup.connectionstring);
                    //string role = HttpContext.Session.GetString("CheckUser");
                    DataSet dataSet = new DataSet();
                    cmd = new SqlCommand("SP_OVI_CMViewDashboardData", sqlCon);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@IdentFlag", "GetPortfolioHubData");
                    cmd.Parameters.AddWithValue("@CM_Code", HttpContext.Session.GetString("EmpId"));
                    cmd.Parameters.AddWithValue("@SelectedDate", dateTime1);
                    if (sqlCon.State == ConnectionState.Closed)
                    {
                        sqlCon.Open();
                    }
                    sda = new SqlDataAdapter(cmd);
                    sda.Fill(dataSet);
                    sqlCon.Close();

                    if (dataSet.Tables[1].Rows.Count > 0)
                    {
                        foreach (DataRow row in dataSet.Tables[1].Rows)
                        {
                            clsPortfolio clsPortfolio = new clsPortfolio();
                            clsPortfolio.CityName = row["City"].ToString();
                            clsPortfolio.NO = row["sCount"].ToString();
                            clsPortfolio.AgriType = row["AgriType"].ToString();
                            lstClsPortfolio.Add(clsPortfolio);
                        }
                    }
                    sqlCon.Close();
                }
                catch (Exception ex)
                {
                    if (sqlCon != null)
                        sqlCon.Close();

                    if (cmd != null)
                        cmd.Dispose();

                    if (sda != null)
                        sda.Dispose();
                }
                finally
                {
                    if (sqlCon != null)
                        sqlCon.Close();

                    if (cmd != null)
                        cmd.Dispose();

                    if (sda != null)
                        sda.Dispose();
                }
                return new JsonResult(lstClsPortfolio);
            }

            [HttpGet]
            public JsonResult GetLCHUHubData(string dateTime)
            {
                DateTime dateTime1 = new DateTime();
                dateTime1 = Convert.ToDateTime(dateTime);
                List<clsPortfolio> lstClsPortfolio = new List<clsPortfolio>();
                try
                {
                    //sqlCon = new SqlConnection(Startup.connectionstring);
                    string role = HttpContext.Session.GetString("CheckUser");
                    DataSet dataSet = new DataSet();
                    cmd = new SqlCommand("SP_OVI_CMViewDashboardData", sqlCon);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@IdentFlag", "GetLCHUHubData");
                    cmd.Parameters.AddWithValue("@CM_Code", HttpContext.Session.GetString("EmpId"));
                    cmd.Parameters.AddWithValue("@SelectedDate", dateTime1);
                    if (sqlCon.State == ConnectionState.Closed)
                    {
                        sqlCon.Open();
                    }
                    sda = new SqlDataAdapter(cmd);
                    sda.Fill(dataSet);
                    sqlCon.Close();

                    if (dataSet.Tables[1].Rows.Count > 0)
                    {
                        foreach (DataRow row in dataSet.Tables[1].Rows)
                        {
                            clsPortfolio clsPortfolio = new clsPortfolio();
                            clsPortfolio.CityName = row["City"].ToString();
                            clsPortfolio.NO = row["sCount"].ToString();
                            clsPortfolio.AgriType = row["AgriType"].ToString();
                            lstClsPortfolio.Add(clsPortfolio);
                        }
                    }
                    sqlCon.Close();
                }
                catch (Exception ex)
                {
                    if (sqlCon != null)
                        sqlCon.Close();

                    if (cmd != null)
                        cmd.Dispose();

                    if (sda != null)
                        sda.Dispose();
                }
                finally
                {
                    if (sqlCon != null)
                        sqlCon.Close();

                    if (cmd != null)
                        cmd.Dispose();

                    if (sda != null)
                        sda.Dispose();
                }
                return new JsonResult(lstClsPortfolio);
            }

            [HttpGet]
            public JsonResult GetAURHubData(string dateTime)
            {
                DateTime dateTime1 = new DateTime();
                dateTime1 = Convert.ToDateTime(dateTime);
                List<clsPortfolio> lstClsPortfolio = new List<clsPortfolio>();
                try
                {
                    //sqlCon = new SqlConnection(Startup.connectionstring);
                    string role = HttpContext.Session.GetString("CheckUser");
                    DataSet dataSet = new DataSet();
                    cmd = new SqlCommand("SP_OVI_CMViewDashboardData", sqlCon);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@IdentFlag", "GetAURHubData");
                    cmd.Parameters.AddWithValue("@CM_Code", HttpContext.Session.GetString("EmpId"));
                    cmd.Parameters.AddWithValue("@SelectedDate", dateTime1);
                    if (sqlCon.State == ConnectionState.Closed)
                    {
                        sqlCon.Open();
                    }
                    sda = new SqlDataAdapter(cmd);
                    sda.Fill(dataSet);
                    sqlCon.Close();

                    if (dataSet.Tables[1].Rows.Count > 0)
                    {
                        foreach (DataRow row in dataSet.Tables[1].Rows)
                        {
                            clsPortfolio clsPortfolio = new clsPortfolio();
                            clsPortfolio.CityName = row["City"].ToString();
                            clsPortfolio.NO = row["sCount"].ToString();
                            clsPortfolio.AgriType = row["AgriType"].ToString();
                            lstClsPortfolio.Add(clsPortfolio);
                        }
                    }
                    sqlCon.Close();
                }
                catch (Exception ex)
                {
                    if (sqlCon != null)
                        sqlCon.Close();

                    if (cmd != null)
                        cmd.Dispose();

                    if (sda != null)
                        sda.Dispose();
                }
                finally
                {
                    if (sqlCon != null)
                        sqlCon.Close();

                    if (cmd != null)
                        cmd.Dispose();

                    if (sda != null)
                        sda.Dispose();
                }
                return new JsonResult(lstClsPortfolio);
            }

            [HttpGet]
            public JsonResult GetDelinquencyHubData(string delFilterVal, string dateTime)
            {
                DateTime dateTime1 = new DateTime();
                dateTime1 = Convert.ToDateTime(dateTime);
                List<clsPortfolio> lstClsPortfolio = new List<clsPortfolio>();
                try
                {
                    //sqlCon = new SqlConnection(Startup.connectionstring);
                    string role = HttpContext.Session.GetString("CheckUser");
                    DataSet dataSet = new DataSet();
                    cmd = new SqlCommand("SP_OVI_CMViewDashboardData", sqlCon);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@IdentFlag", "GetDelinquencyHubData");
                    cmd.Parameters.AddWithValue("@CM_Code", HttpContext.Session.GetString("EmpId"));
                    cmd.Parameters.AddWithValue("@SelectedDate", dateTime1);
                    cmd.Parameters.AddWithValue("@DelqFlag", delFilterVal);
                    if (sqlCon.State == ConnectionState.Closed)
                    {
                        sqlCon.Open();
                    }
                    sda = new SqlDataAdapter(cmd);
                    sda.Fill(dataSet);
                    sqlCon.Close();

                    if (dataSet.Tables[1].Rows.Count > 0)
                    {
                        foreach (DataRow row in dataSet.Tables[1].Rows)
                        {
                            clsPortfolio clsPortfolio = new clsPortfolio();
                            clsPortfolio.CityName = row["City"].ToString();
                            clsPortfolio.NO = row["sCount"].ToString();
                            clsPortfolio.AgriType = row["AgriType"].ToString();
                            lstClsPortfolio.Add(clsPortfolio);
                        }
                    }
                    sqlCon.Close();
                }
                catch (Exception ex)
                {
                    if (sqlCon != null)
                        sqlCon.Close();

                    if (cmd != null)
                        cmd.Dispose();

                    if (sda != null)
                        sda.Dispose();
                }
                finally
                {
                    if (sqlCon != null)
                        sqlCon.Close();

                    if (cmd != null)
                        cmd.Dispose();

                    if (sda != null)
                        sda.Dispose();
                }
                return new JsonResult(lstClsPortfolio);
            }

            #endregion

            #region Portfolio

            [HttpGet]
            public JsonResult GetPortfolioPageData(string dateTime)
            {
                DataSet dt = new DataSet();
                PortfolioMain portfolioMain = new PortfolioMain();
                DateTime dateTime1 = new DateTime();

                dateTime1 = Convert.ToDateTime(dateTime);

                List<clsPortfolio> lstclsPortfolio = new List<clsPortfolio>();
                List<PortfolioSummary> lstPortfolioSummary = new List<PortfolioSummary>();
                List<Trend> lstTrend = new List<Trend>();
                List<ABCCategores> lstABCCategores = new List<ABCCategores>();
                List<RiskCategories> lstRiskCategories = new List<RiskCategories>();
                List<IndustryWise> lstIndustryWise = new List<IndustryWise>();
                List<clsCode> lstclsCode = new List<clsCode>();
                List<clsCode> lstclsCodeIndustryColor = new List<clsCode>();
                try
                {
                    //sqlCon = new SqlConnection(Startup.connectionstring);
                    //string role = HttpContext.Session.GetString("CheckUser");

                    cmd = new SqlCommand("SP_OVI_PortFolioData", sqlCon);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@IdentFlag", "PortfolioPageData");
                    cmd.Parameters.AddWithValue("@CM_Code", HttpContext.Session.GetString("EmpId"));
                    cmd.Parameters.AddWithValue("@SelectedDate", dateTime1);

                    if (sqlCon.State == ConnectionState.Closed)
                    {
                        sqlCon.Open();
                    }
                    sda = new SqlDataAdapter(cmd);
                    sda.Fill(dt);
                    sqlCon.Close();

                    if (dt.Tables[1].Rows.Count > 0)
                    {
                        foreach (DataRow row in dt.Tables[1].Rows)
                        {
                            clsPortfolio clsPortfolio = new clsPortfolio();

                            clsPortfolio.Segment = row["Segment"].ToString();
                            clsPortfolio.NO = row["No"].ToString();
                            clsPortfolio.ApprLmt = row["ApprLmt"].ToString();
                            clsPortfolio.Disbursed = row["Disbursed"].ToString();
                            lstclsPortfolio.Add(clsPortfolio);
                        }
                    }

                    //if (dt.Tables[2].Rows.Count > 0)
                    //{
                    //    foreach (DataRow row in dt.Tables[2].Rows)
                    //    {
                    //        PortfolioSummary portfolioSummary = new PortfolioSummary();

                    //        portfolioSummary.LSID = row["LSID"].ToString();
                    //        portfolioSummary.Name = row["Name"].ToString();
                    //        portfolioSummary.Segment = row["Segment"].ToString();
                    //        portfolioSummary.City = row["City"].ToString();
                    //        portfolioSummary.State = row["State"].ToString();
                    //        portfolioSummary.Exposure = row["Exposure (In L)"].ToString();
                    //        //portfolioSummary.ACM = row["ACM"].ToString();
                    //        portfolioSummary.RM = row["RM"].ToString();
                    //        portfolioSummary.CAM = row["CAM"].ToString();
                    //        lstPortfolioSummary.Add(portfolioSummary);
                    //    }
                    //}

                    if (dt.Tables[3].Rows.Count > 0)
                    {
                        foreach (DataRow row in dt.Tables[3].Rows)
                        {
                            Trend trend = new Trend();

                            trend.MonthName = row["MonthName"].ToString();
                            trend.Exposure = row["Exposure"].ToString();
                            trend.sCount = row["sCount"].ToString();
                            lstTrend.Add(trend);
                        }
                    }

                    if (dt.Tables[4].Rows.Count > 0)
                    {
                        foreach (DataRow row in dt.Tables[4].Rows)
                        {
                            ABCCategores aBCCategores = new ABCCategores();

                            aBCCategores.Categories = row["Categories"].ToString();
                            aBCCategores.No = row["No"].ToString();
                            aBCCategores.Exposure = row["Exposure"].ToString();
                            aBCCategores.Utilization = row["Utilization"].ToString();
                            lstABCCategores.Add(aBCCategores);
                        }
                    }

                    if (dt.Tables[5].Rows.Count > 0)
                    {
                        foreach (DataRow row in dt.Tables[5].Rows)
                        {
                            RiskCategories riskCategories = new RiskCategories();

                            riskCategories.RiskType = row["RiskType"].ToString();
                            riskCategories.No = row["No"].ToString();
                            riskCategories.Exposure = row["Exposure"].ToString();
                            riskCategories.Utilization = row["Utilization"].ToString();
                            lstRiskCategories.Add(riskCategories);
                        }
                    }

                    if (dt.Tables[6].Rows.Count > 0)
                    {
                        foreach (DataRow row in dt.Tables[6].Rows)
                        {
                            IndustryWise industryWise = new IndustryWise();

                            industryWise.Industy = row["BroadIndustry"].ToString();
                            industryWise.Count = row["No"].ToString();
                            industryWise.Value = row["Value"].ToString();
                            lstIndustryWise.Add(industryWise);
                        }
                    }

                    if (dt.Tables[7].Rows.Count > 0)
                    {
                        foreach (DataRow row in dt.Tables[7].Rows)
                        {
                            clsCode clsCode = new clsCode();

                            clsCode.Segment = row["Segment"].ToString();
                            clsCode.Div = row["Div"].ToString();
                            clsCode.BackgroundColor = row["BackgroundColor"].ToString();
                            clsCode.HoverBackgroundColor = row["HoverBackgroundColor"].ToString();
                            lstclsCode.Add(clsCode);
                        }
                    }

                    if (dt.Tables[8].Rows.Count > 0)
                    {
                        foreach (DataRow row in dt.Tables[8].Rows)
                        {
                            clsCode clsCode = new clsCode();

                            clsCode.Segment = row["Segment"].ToString();
                            clsCode.Div = row["Div"].ToString();
                            clsCode.BackgroundColor = row["BackgroundColor"].ToString();
                            clsCode.HoverBackgroundColor = row["HoverBackgroundColor"].ToString();
                            lstclsCodeIndustryColor.Add(clsCode);
                        }
                    }

                    sqlCon.Close();
                }
                catch (Exception ex)
                {
                    if (sqlCon != null)
                        sqlCon.Close();

                    if (cmd != null)
                        cmd.Dispose();

                    if (sda != null)
                        sda.Dispose();
                }
                finally
                {
                    if (sqlCon != null)
                        sqlCon.Close();

                    if (cmd != null)
                        cmd.Dispose();

                    if (sda != null)
                        sda.Dispose();
                }
                portfolioMain.clsPortfolio = lstclsPortfolio;
                //portfolioMain.PortfolioSummary = lstPortfolioSummary;
                portfolioMain.Trend = lstTrend;
                portfolioMain.ABCCategores = lstABCCategores;
                portfolioMain.RiskCategories = lstRiskCategories;
                portfolioMain.IndustryWise = lstIndustryWise;
                portfolioMain.clsCode = lstclsCode;
                portfolioMain.clsCodeIndustryColor = lstclsCodeIndustryColor;
                portfolioMain.dataTable = dt.Tables[2];
                return new JsonResult(portfolioMain);
            }


            #endregion

        }
    }