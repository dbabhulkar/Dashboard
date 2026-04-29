using Dashboard.Interfaces;
using Dashboard.Models;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using System.Data;
using Dashboard.Repositories;
using OVI.Domain.Interfaces;

namespace Dashboard.Controllers
{
    public class CMAURController : Controller
    {
        SqlConnection sqlCon = new SqlConnection(clsConnectionString.GetConnectionString());
        SqlCommand cmd = null;
        SqlDataAdapter sda = null;
        //GetData getData = new GetData();
        clsConnectionString clsConnectionString = new clsConnectionString();
        private readonly IDashboard _dashboard;
        private readonly ICmDataService _cmDataService;

        public CMAURController(ICmDataService cmDataService)
        {
            _dashboard = new DashboardRepository();
            _cmDataService = cmDataService;
        }
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost, CustomFilter]
        public IActionResult CMAUR(clsCMAURMain clsCMAURMain)
        {
            var SelectedSegment = "";
            var SelectedLocation = "";
            string EmpID = HttpContext.Session.GetString("EmpId");
            if (clsCMAURMain.SelectedSegment != null)
            {
                SelectedSegment = String.Join(",", clsCMAURMain.SelectedSegment.Select(w => w).ToArray());
            }
            if (clsCMAURMain.SelectedLocation != null)
            {
                SelectedLocation = String.Join(",", clsCMAURMain.SelectedLocation.Select(w => w).ToArray());
            }

            Common common = new Common();
            //common.clsCMDelinquency11(SelectedSegment, SelectedLocation, clsCMDelinquencyMain.HiddenDatetime, EmpID);
            //common.clsCMAURMain1(SelectedSegment, SelectedLocation, clsCMAURMain.LSId, clsCMAURMain.HiddenDatetime, EmpID)
            return View(common.clsCMAURMain1(SelectedSegment, SelectedLocation, clsCMAURMain.LSId, clsCMAURMain.HiddenDatetime, EmpID));
        }

        [CustomFilter]
        public IActionResult CMAUR(string datetime = null)
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
            _dashboard.CaptureProductivityDetails(sqlCon, EmpID.ToString().Trim(), "CMAUR", "OneViewIndicator-CM", 1, "AUR View", "AUR View for Emp - " + EmpID.ToString().Trim());
            //common.clsCMAURMain1("", "", "", datetime, EmpID)
            return View(common.clsCMAURMain1("", "", "", datetime, EmpID));
        }

        [CustomFilter]
        public JsonResult GetCMAURPageData(string dateTime)
        {
            DataSet dt = new DataSet();
            clsCMAURMain clsCMAURMain = new clsCMAURMain();
            DateTime dateTime1 = new DateTime();

            dateTime1 = Convert.ToDateTime(dateTime);
            // Delinquency(dateTime);
            List<clsCode> lstclsColorCode = new List<clsCode>();
            List<clsMonthTotalAUR> lstclsMonthTotalAUR = new List<clsMonthTotalAUR>();

            try
            {
                //sqlCon = new SqlConnection(Startup.connectionstring);               
                cmd = new SqlCommand("SP_OVI_CMAUR", sqlCon);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@IdentFlag", "CMAUR");
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
                        clsCMAURMain.AURAccount = row["TotalAURAcc"].ToString();
                        clsCMAURMain.AURAmount = row["TotalAURAmount"].ToString();
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
                        clsMonthTotalAUR clsMonthTotalAUR = new clsMonthTotalAUR();
                        clsMonthTotalAUR.NoOFAcc = row["NOOFAccCount"].ToString();
                        clsMonthTotalAUR.TotalAmount = row["Utilization"].ToString();
                        clsMonthTotalAUR.Segment = row["Segment"].ToString();
                        lstclsMonthTotalAUR.Add(clsMonthTotalAUR);
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

            clsCMAURMain.clsColorCode = lstclsColorCode;
            clsCMAURMain.clsMonthTotalAURExposure = lstclsMonthTotalAUR;
            return new JsonResult(clsCMAURMain);
        }
    }
}