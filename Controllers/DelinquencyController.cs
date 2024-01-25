using Dashboard.Interfaces;
using Dashboard.Models;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using System.Data;
using Dashboard.Repositories;

namespace Dashboard.Controllers
{
    public class DelinquencyController : Controller
    {
        SqlConnection sqlCon = new SqlConnection(clsConnectionString.GetConnectionString());
        SqlCommand cmd = null;
        SqlDataAdapter sda = null;
        //GetData getData = new GetData();
        clsConnectionString clsConnectionString = new clsConnectionString();
        private readonly IDashboard _dashboard;
        public DelinquencyController()
        {
            _dashboard = new DashboardRepository();
        }
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost, CustomFilter]
        public IActionResult Delinquency(clsCMDelinquencyMain clsCMDelinquencyMain)
        {
            var SelectedSegment = "";
            var SelectedLocation = "";
            string EmpID = HttpContext.Session.GetString("EmpId");
            if (clsCMDelinquencyMain.SelectedSegment != null)
            {
                SelectedSegment = String.Join(",", clsCMDelinquencyMain.SelectedSegment.Select(w => w).ToArray());
            }
            if (clsCMDelinquencyMain.SelectedLocation != null)
            {
                SelectedLocation = String.Join(",", clsCMDelinquencyMain.SelectedLocation.Select(w => w).ToArray());
            }

            Common common = new Common();
            //common.clsCMDelinquency11(SelectedSegment, SelectedLocation, clsCMDelinquencyMain.HiddenDatetime, EmpID);

            return View(common.clsCMDelinquency11(SelectedSegment, SelectedLocation, clsCMDelinquencyMain.LSId, clsCMDelinquencyMain.HiddenDatetime, EmpID));
        }

        [CustomFilter]
        public IActionResult Delinquency(string datetime = null)
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
            _dashboard.CaptureProductivityDetails(sqlCon, EmpID.ToString().Trim(), "Delinquecy", "OneViewIndicator-CM", 1, "Delinquecy View", "Delinquency View for Emp - " + EmpID.ToString().Trim());
            return View(common.clsCMDelinquency11("", "", "", datetime, EmpID));
        }

        [CustomFilter]
        public JsonResult GetCMDelinquencyPageData(string dateTime)
        {
            DataSet dt = new DataSet();
            clsCMDelinquencyMain clsCMDelinquencyMain = new clsCMDelinquencyMain();
            DateTime dateTime1 = new DateTime();

            dateTime1 = Convert.ToDateTime(dateTime);
            // Delinquency(dateTime);
            List<clsCode> lstclsColorCode = new List<clsCode>();
            List<clsMonthTotal> lstclsMonthTotal = new List<clsMonthTotal>();

            try
            {
                //sqlCon = new SqlConnection(Startup.connectionstring);               
                cmd = new SqlCommand("SP_OVI_CMDelinquency", sqlCon);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@IdentFlag", "CMDelinquency");
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
                        clsCMDelinquencyMain.OverDueAccount = row["OverDueAccount"].ToString();
                        clsCMDelinquencyMain.OverDueAmount = row["OverDueAmount"].ToString();
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
                //        clsMonthTotal clsMonthTotalDDP = new clsMonthTotal();
                //        clsMonthTotalDDP.NoOFAcc = row["NOOFAccCount"].ToString();
                //        clsMonthTotalDDP.TotalAmount = row["Overdue_Amount"].ToString();
                //        clsMonthTotalDDP.TotalExpoAmount = row["Overdue_Exposure"].ToString();
                //        clsMonthTotalDDP.Segment = row["Segment"].ToString();
                //        lstclsMonthTotal.Add(clsMonthTotalDDP);
                //    }
                //}
                if (dt.Tables[11].Rows.Count > 0)
                {
                    foreach (DataRow row in dt.Tables[11].Rows)
                    {
                        clsMonthTotal clsMonthTotalDDP = new clsMonthTotal();
                        clsMonthTotalDDP.NoOFAcc = row["NOOFAccCount"].ToString();
                        clsMonthTotalDDP.TotalAmount = row["Utilization"].ToString();
                        clsMonthTotalDDP.Segment = row["Segment"].ToString();
                        lstclsMonthTotal.Add(clsMonthTotalDDP);
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

            clsCMDelinquencyMain.clsColorCode = lstclsColorCode;
            clsCMDelinquencyMain.clsMonthExposure = lstclsMonthTotal;
            return new JsonResult(clsCMDelinquencyMain);
        }
    }
}