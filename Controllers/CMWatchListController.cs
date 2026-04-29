using Dashboard.Interfaces;
using Dashboard.Models;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using System.Data;
using Dashboard.Repositories;
using OVI.Domain.Interfaces;

namespace Dashboard.Controllers
{
    public class CMWatchListController : Controller
    {
        SqlConnection sqlCon = new SqlConnection(clsConnectionString.GetConnectionString());
        SqlCommand cmd = null;
        SqlDataAdapter sda = null;
        //GetData getData = new GetData();
        clsConnectionString clsConnectionString = new clsConnectionString();
        private readonly IDashboard _dashboard;
        private readonly ICmDataService _cmDataService;

        public CMWatchListController(ICmDataService cmDataService)
        {
            _dashboard = new DashboardRepository();
            _cmDataService = cmDataService;
        }
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost, CustomFilter]
        public IActionResult CMWatchList(clsCMWatchListMain clsCMWatchListMain)
        {
            var SelectedSegment = "";
            var SelectedLocation = "";
            string EmpID = HttpContext.Session.GetString("EmpId");
            if (clsCMWatchListMain.SelectedSegment != null)
            {
                SelectedSegment = String.Join(",", clsCMWatchListMain.SelectedSegment.Select(w => w).ToArray());
            }
            if (clsCMWatchListMain.SelectedLocation != null)
            {
                SelectedLocation = String.Join(",", clsCMWatchListMain.SelectedLocation.Select(w => w).ToArray());
            }

            Common common = new Common();
            //common.clsCMDelinquency11(SelectedSegment, SelectedLocation, clsCMDelinquencyMain.HiddenDatetime, EmpID);
            //common.clsCMWatchListMain1(SelectedSegment, SelectedLocation, clsCMWatchListMain.LSId, clsCMWatchListMain.HiddenDatetime, EmpID)
            return View(common.clsCMWatchListMain1(SelectedSegment, SelectedLocation, clsCMWatchListMain.LSId, clsCMWatchListMain.HiddenDatetime, EmpID));
        }

        [CustomFilter]
        public IActionResult CMWatchList(string datetime = null)
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
            _dashboard.CaptureProductivityDetails(sqlCon, EmpID.ToString().Trim(), "CMWatchList", "OneViewIndicator-CM", 1, "WatchList View", "WatchList View for Emp - " + EmpID.ToString().Trim());
            //common.clsCMWatchListMain1("", "", "", datetime, EmpID)
            return View(common.clsCMWatchListMain1("", "", "", datetime, EmpID));
        }

        [CustomFilter]
        public JsonResult GetCMWatchListPageData(string dateTime)
        {
            DataSet dt = new DataSet();
            clsCMWatchListMain clsCMWatchListMain = new clsCMWatchListMain();
            DateTime dateTime1 = new DateTime();

            dateTime1 = Convert.ToDateTime(dateTime);
            // Delinquency(dateTime);
            List<clsCode> lstclsColorCode = new List<clsCode>();
            List<clsMonthTotalWatchList> lstclsMonthTotalWatchList = new List<clsMonthTotalWatchList>();

            try
            {
                //sqlCon = new SqlConnection(Startup.connectionstring);               
                cmd = new SqlCommand("SP_OVI_CMWatchList", sqlCon);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@IdentFlag", "CMWatchList");
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
                        clsCMWatchListMain.WatchListAccount = row["TotalWatchListAcc"].ToString();
                        clsCMWatchListMain.WatchListAmount = row["TotalWatchListAmount"].ToString();
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
                if (dt.Tables[8].Rows.Count > 0)
                {
                    foreach (DataRow row in dt.Tables[8].Rows)
                    {
                        clsMonthTotalWatchList clsMonthTotalWatchList = new clsMonthTotalWatchList();
                        clsMonthTotalWatchList.NoOFAcc = row["NOOFAccCount"].ToString();
                        clsMonthTotalWatchList.TotalAmount = row["Utilization"].ToString();
                        clsMonthTotalWatchList.Segment = row["Segment"].ToString();
                        lstclsMonthTotalWatchList.Add(clsMonthTotalWatchList);
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

            clsCMWatchListMain.clsColorCode = lstclsColorCode;
            clsCMWatchListMain.clsMonthTotalWatchListExposure = lstclsMonthTotalWatchList;
            return new JsonResult(clsCMWatchListMain);
        }
    }
}