using Dashboard.Interfaces;
using Dashboard.Models;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using System.Data;
using Dashboard.Repositories;
using OVI.Domain.Interfaces;

namespace Dashboard.Controllers
{
        public class CMLCHUController : Controller
        {
            SqlConnection sqlCon = new SqlConnection(clsConnectionString.GetConnectionString());
            SqlCommand cmd = null;
            SqlDataAdapter sda = null;
            //GetData getData = new GetData();
            clsConnectionString clsConnectionString = new clsConnectionString();
            private readonly IDashboard _dashboard;
            private readonly ICmDataService _cmDataService;

            public CMLCHUController(ICmDataService cmDataService)
            {
                _dashboard = new DashboardRepository();
                _cmDataService = cmDataService;
            }
            public IActionResult Index()
            {
                return View();
            }

            [HttpPost, CustomFilter]
            public IActionResult CMLCHU(clsCMLCHUMain clsCMLCHUMain)
            {
                var SelectedSegment = "";
                var SelectedLocation = "";
                string EmpID = HttpContext.Session.GetString("EmpId");
                if (clsCMLCHUMain.SelectedSegment != null)
                {
                    SelectedSegment = String.Join(",", clsCMLCHUMain.SelectedSegment.Select(w => w).ToArray());
                }
                if (clsCMLCHUMain.SelectedLocation != null)
                {
                    SelectedLocation = String.Join(",", clsCMLCHUMain.SelectedLocation.Select(w => w).ToArray());
                }

                Common common = new Common();
                //common.clsCMDelinquency11(SelectedSegment, SelectedLocation, clsCMDelinquencyMain.HiddenDatetime, EmpID);

                return View(common.clsCMLCHUMain1(SelectedSegment, SelectedLocation, clsCMLCHUMain.LSId, clsCMLCHUMain.HiddenDatetime, EmpID));
            }

            [CustomFilter]
            public IActionResult CMLCHU(string datetime = null)
            {
                // string dateTime = "2022-11-24";
                // 0 frm = new FormCollection();

                string EmpID = HttpContext.Session.GetString("EmpId");

                if (datetime is null)
                {
                    datetime = DateTime.Now.ToString("yyyy-MM-dd");
                }

                Common common = new Common();
                // common.clsCMDelinquency11("","",datetime, EmpID);
                _dashboard.CaptureProductivityDetails(sqlCon, EmpID.ToString().Trim(), "CMLCHU", "OneViewIndicator-CM", 1, "LCHU View", "LCHU View for Emp - " + EmpID.ToString().Trim());
                return View(common.clsCMLCHUMain1("", "", "", datetime, EmpID));
            }

            [CustomFilter]
            public JsonResult GetCMLCHUPageData(string dateTime)
            {
                DataSet dt = new DataSet();
                clsCMLCHUMain clsCMLCHUMain = new clsCMLCHUMain();
                DateTime dateTime1 = new DateTime();

                dateTime1 = Convert.ToDateTime(dateTime);
                // Delinquency(dateTime);
                List<clsCode> lstclsColorCode = new List<clsCode>();
                List<clsMonthTotalLCHU> lstclsMonthTotalLCHU = new List<clsMonthTotalLCHU>();

                try
                {
                    //sqlCon = new SqlConnection(Startup.connectionstring);               
                    cmd = new SqlCommand("SP_OVI_CMLCHU", sqlCon);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@IdentFlag", "CMLCHU");
                    cmd.Parameters.AddWithValue("@CM_Emp_Code", HttpContext.Session.GetString("EmpId"));
                    cmd.Parameters.AddWithValue("@SelectedDate", dateTime1);

                    if (sqlCon.State == ConnectionState.Closed)
                    {
                        sqlCon.Open();
                    }
                    sda = new SqlDataAdapter(cmd);
                    sda.Fill(dt);
                    sqlCon.Close();

                    if (dt.Tables[3].Rows.Count > 0)
                    {
                        foreach (DataRow row in dt.Tables[3].Rows)
                        {
                            clsCMLCHUMain.LCHUAccount = row["TotalLCHUAcc"].ToString();
                            clsCMLCHUMain.LCHUAmount = row["TotalLCHUAmount"].ToString();
                        }
                    }

                    if (dt.Tables[5].Rows.Count > 0)
                    {
                        foreach (DataRow row in dt.Tables[5].Rows)
                        {
                            clsCode clsColorCode = new clsCode();

                            clsColorCode.Segment = row["Segment"].ToString();
                            clsColorCode.Div = row["Div"].ToString();
                            clsColorCode.BackgroundColor = row["BackgroundColor"].ToString();
                            clsColorCode.HoverBackgroundColor = row["HoverBackgroundColor"].ToString();

                            lstclsColorCode.Add(clsColorCode);
                        }
                    }
                    //if (dt.Tables[10].Rows.Count > 0)
                    //{
                    //    foreach (DataRow row in dt.Tables[10].Rows)
                    //    {
                    //        clsMonthTotalLCHU clsMonthTotalLCHU = new clsMonthTotalLCHU();
                    //        clsMonthTotalLCHU.NoOFAcc = row["NOOFAccCount"].ToString();
                    //        clsMonthTotalLCHU.TotalAmount = row["LCHU_Amount"].ToString();
                    //        clsMonthTotalLCHU.TotalExpoAmount = row["LCHU_Exposure"].ToString();
                    //        clsMonthTotalLCHU.Segment = row["Segment"].ToString();
                    //        lstclsMonthTotalLCHU.Add(clsMonthTotalLCHU);
                    //    }
                    //}
                    if (dt.Tables[11].Rows.Count > 0)
                    {
                        foreach (DataRow row in dt.Tables[11].Rows)
                        {
                            clsMonthTotalLCHU clsMonthTotalLCHU = new clsMonthTotalLCHU();
                            clsMonthTotalLCHU.NoOFAcc = row["NOOFAccCount"].ToString();
                            clsMonthTotalLCHU.TotalAmount = row["Utilization"].ToString();
                            clsMonthTotalLCHU.Segment = row["Segment"].ToString();
                            lstclsMonthTotalLCHU.Add(clsMonthTotalLCHU);
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

                clsCMLCHUMain.clsColorCode = lstclsColorCode;
                clsCMLCHUMain.clsMonthTotalLCHUExposure = lstclsMonthTotalLCHU;
                return new JsonResult(clsCMLCHUMain);
            }
        }
    }