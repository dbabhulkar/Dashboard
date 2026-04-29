using Dashboard.Models;
using Microsoft.AspNetCore.Mvc;
using OVI.Domain.Interfaces;
using System.Data;
using System.Data.SqlClient;

namespace Dashboard.Controllers
{
    public class CMOnewViewController : Controller
    {
        private readonly IDashboardRepository _dashboardRepository;
        private readonly ICmDataService _cmDataService;

        public CMOnewViewController(ICmDataService cmDataService, IDashboardRepository dashboardRepository)
        {
            _cmDataService = cmDataService;
            _dashboardRepository = dashboardRepository;
        }

        [HttpGet, CustomFilter]
        public IActionResult CMOneViewIndicator(string id = null, string SearchText = null)
        {
            string EmpID = HttpContext.Session.GetString("EmpId");
            _dashboardRepository.CaptureProductivityDetails(
                EmpID.Trim(), "OVI Screen", "OneViewIndicator-CM", 1,
                "OVI View", "OVI View for Emp - " + EmpID.Trim());

            DataSet dataSet = new DataSet();
            OVIView oVIView = new OVIView();
            if (SearchText == null)
            {
                oVIView.txt_custname = id;
                SearchText = string.Empty;
            }
            else
            {
                oVIView.txt_custname = SearchText;
            }

            // SP_OVI_View is specific to this controller — uses local SqlConnection
            // until a dedicated IOviViewService is introduced in a future phase.
            SqlConnection sqlCon = null;
            SqlCommand cmd = null;
            SqlDataAdapter sda = null;
            try
            {
                sqlCon = new SqlConnection(clsConnectionString.GetConnectionString());

                if (id == null)
                {
                    cmd = new SqlCommand("SP_OVI_View", sqlCon);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@IdentFlag", "GetCustomerTable");
                    cmd.Parameters.AddWithValue("@EmpCode", HttpContext.Session.GetString("EmpId"));
                    cmd.Parameters.AddWithValue("@SearchText", SearchText);

                    sqlCon.Open();
                    sda = new SqlDataAdapter(cmd);
                    sda.Fill(dataSet);
                    sqlCon.Close();
                    oVIView.customerDetails = new List<CustomerDetails>();
                    if (dataSet.Tables[0].Rows.Count > 0)
                    {
                        foreach (DataRow row in dataSet.Tables[0].Rows)
                        {
                            CustomerDetails customerDetails = new CustomerDetails();
                            customerDetails.CustomerName = row["CustomerName"].ToString();
                            customerDetails.LSID = row["LSID"].ToString();
                            oVIView.customerDetails.Add(customerDetails);
                        }
                    }
                }
                else
                {
                    cmd = new SqlCommand("SP_OVI_View", sqlCon);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@IdentFlag", "AllDataByLSID");
                    cmd.Parameters.AddWithValue("@EmpCode", HttpContext.Session.GetString("EmpId"));
                    cmd.Parameters.AddWithValue("@LSID", id);
                    cmd.Parameters.AddWithValue("@SearchText", SearchText);

                    sqlCon.Open();
                    sda = new SqlDataAdapter(cmd);
                    sda.Fill(dataSet);
                    sqlCon.Close();
                    oVIView.demographicReports = new List<DemographicReport>();
                    if (dataSet.Tables[0].Rows.Count > 0)
                    {
                        foreach (DataRow row in dataSet.Tables[0].Rows)
                        {
                            DemographicReport demographicReport = new DemographicReport();
                            demographicReport.City = row["City"].ToString();
                            demographicReport.Region = row["Region"].ToString();
                            demographicReport.Lasersoft_Id = row["Lasersoft_Id"].ToString();
                            oVIView.demographicReports.Add(demographicReport);
                        }
                    }

                    oVIView.faciltyDtlReports = new List<FaciltyDtlReport>();
                    if (dataSet.Tables[1].Rows.Count > 0)
                    {
                        foreach (DataRow row in dataSet.Tables[1].Rows)
                        {
                            FaciltyDtlReport faciltyDtlReport = new FaciltyDtlReport();
                            faciltyDtlReport.Facility = row["Facility"].ToString();
                            faciltyDtlReport.Limit = row["Limit"].ToString();
                            faciltyDtlReport.OS = row["OS"].ToString();
                            faciltyDtlReport.AC_Limit_Set_Date = row["AC_Limit_Set_Date"].ToString();
                            faciltyDtlReport.Initial_Limit_Set_Date = row["Initial_Limit_Set_Date"].ToString();
                            oVIView.faciltyDtlReports.Add(faciltyDtlReport);
                        }
                    }

                    oVIView.housekeepingReports = new List<HousekeepingReport>();
                    if (dataSet.Tables[2].Rows.Count > 0)
                    {
                        foreach (DataRow row in dataSet.Tables[2].Rows)
                        {
                            HousekeepingReport housekeepingReport = new HousekeepingReport();
                            housekeepingReport.Doc_Name = row["HouseKeeping Items ( Doc_Name )"].ToString();
                            housekeepingReport.Due_Date = row["Due_Date"].ToString();
                            oVIView.housekeepingReports.Add(housekeepingReport);
                        }
                    }

                    oVIView.oneViewIndicatorReports = new List<OneViewIndicatorReport>();
                    if (dataSet.Tables[3].Rows.Count > 0)
                    {
                        foreach (DataRow row in dataSet.Tables[3].Rows)
                        {
                            OneViewIndicatorReport oneViewIndicatorReport = new OneViewIndicatorReport();
                            oneViewIndicatorReport.First_time_7_dpd_date = row["First_time_7_dpd_date"].ToString();
                            oneViewIndicatorReport.First_time_30_dpd_date = row["First_time_30_dpd_date"].ToString();
                            oneViewIndicatorReport.First_time_Pot_NPA = row["First_time_Pot_NPA"].ToString();
                            oneViewIndicatorReport.Current_Watchlist = row["Current_Watchlist"].ToString();
                            oneViewIndicatorReport.No_of_times_last_6_Watchlist = row["No_of_times_last_6_Watchlist"].ToString();
                            oneViewIndicatorReport.Watchlist_Months = row["Watchlist_Months"].ToString();
                            oneViewIndicatorReport.Current_Low_Churning = row["Current_Low_Churning"].ToString();
                            oneViewIndicatorReport.No_times_Last_6_Churn = row["No_times_Last_6_Churn"].ToString();
                            oneViewIndicatorReport.Low_Churn_Months = row["Low_Churn_Months"].ToString();
                            oneViewIndicatorReport.Exit1 = row["Exit1"].ToString();
                            oneViewIndicatorReport.Plan_Avb = row["Plan_Avb"].ToString();
                            oneViewIndicatorReport.Plan1 = row["Plan1"].ToString();
                            oneViewIndicatorReport.Current_Pot_NPA = row["Current_Pot_NPA"].ToString();
                            oneViewIndicatorReport.No_times_last_6_NPA = row["No_times_last_6_NPA"].ToString();
                            oneViewIndicatorReport.Pot_NPA_Months = row["Pot_NPA_Months"].ToString();
                            oneViewIndicatorReport.Field1 = row["Field1"].ToString();
                            oVIView.oneViewIndicatorReports.Add(oneViewIndicatorReport);
                        }
                    }

                    oVIView.delinquencies = new List<Delinquency>();
                    if (dataSet.Tables[4].Rows.Count > 0)
                    {
                        foreach (DataRow row in dataSet.Tables[4].Rows)
                        {
                            Delinquency delinquency = new Delinquency();
                            delinquency.AC_Contract_No = row["Account Number"].ToString();
                            delinquency.Customer_Name = row["Customer Name"].ToString();
                            delinquency.SME_Client_ID = row["SME Client ID"].ToString();
                            delinquency.DateOfTOD = row["DATE OF TOD"].ToString();
                            delinquency.Curr_Overdue_AMT = row["Curr Overdue AMT"].ToString();
                            delinquency.DPD = row["DPD"].ToString();
                            delinquency.Nature_of_Delq = row["Nature of Delq"].ToString();
                            delinquency.Currency_App_PDO_Loans_Bills = row["Currency App PDO Loans Bills"].ToString();
                            oVIView.delinquencies.Add(delinquency);
                        }
                    }

                    oVIView.bGUploads = new List<BGUpload>();
                    if (dataSet.Tables[5].Rows.Count > 0)
                    {
                        foreach (DataRow row in dataSet.Tables[5].Rows)
                        {
                            BGUpload bGUpload = new BGUpload();
                            bGUpload.LS_ID = row["LS_ID"].ToString();
                            bGUpload.CONTRACT_REF_NO = row["CONTRACT_REF_NO"].ToString();
                            bGUpload.APP = row["APP"].ToString();
                            bGUpload.BEN = row["BEN"].ToString();
                            bGUpload.AVAILMENT_AMT = row["AVAILMENT_AMT"].ToString();
                            bGUpload.Segment = row["Segment"].ToString();
                            bGUpload.AVAILMENT_DATE = row["AVAILMENT_DATE"].ToString();
                            oVIView.bGUploads.Add(bGUpload);
                        }
                    }

                    oVIView.sANTransactions = new List<SANTransaction>();
                    if (dataSet.Tables[6].Rows.Count > 0)
                    {
                        foreach (DataRow row in dataSet.Tables[6].Rows)
                        {
                            SANTransaction sANTransaction = new SANTransaction();
                            sANTransaction.LSID = row["LSID"].ToString();
                            sANTransaction.Cust_Name = row["Cust_Name"].ToString();
                            sANTransaction.PAN = row["PAN"].ToString();
                            sANTransaction.BANK_NAME = row["BANK_NAME"].ToString();
                            sANTransaction.Month = row["Month"].ToString();
                            sANTransaction.DATE_inserted = row["DATE_inserted"].ToString();
                            oVIView.sANTransactions.Add(sANTransaction);
                        }
                    }

                    oVIView.gSTTransactions = new List<GSTTransaction>();
                    if (dataSet.Tables[7].Rows.Count > 0)
                    {
                        foreach (DataRow row in dataSet.Tables[7].Rows)
                        {
                            GSTTransaction gSTTransaction = new GSTTransaction();
                            gSTTransaction.Month = row["Month"].ToString();
                            gSTTransaction.Name = row["Name"].ToString();
                            gSTTransaction.Accmo = row["Accmo"].ToString();
                            gSTTransaction.LSID = row["LSID"].ToString();
                            gSTTransaction.Gst_AMOUNT = row["Gst_AMOUNT"].ToString();
                            gSTTransaction.DATE_inserted = row["DATE_inserted"].ToString();
                            oVIView.gSTTransactions.Add(gSTTransaction);
                        }
                    }

                    oVIView.customerDetails = new List<CustomerDetails>();
                    if (dataSet.Tables[8].Rows.Count > 0)
                    {
                        foreach (DataRow row in dataSet.Tables[8].Rows)
                        {
                            CustomerDetails customerDetails = new CustomerDetails();
                            customerDetails.CustomerName = row["CustomerName"].ToString();
                            customerDetails.LSID = row["LSID"].ToString();
                            oVIView.customerDetails.Add(customerDetails);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw;
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

            return View(oVIView);
        }
    }
}
