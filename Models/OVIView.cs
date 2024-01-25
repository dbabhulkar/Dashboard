namespace Dashboard.Models
{
    public class OVIView
    {
        public List<CustomerDetails> customerDetails { get; set; }
        public List<DemographicReport> demographicReports { get; set; }
        public List<HousekeepingReport> housekeepingReports { get; set; }
        public List<FaciltyDtlReport> faciltyDtlReports { get; set; }
        public List<OneViewIndicatorReport> oneViewIndicatorReports { get; set; }
        public List<BGUpload> bGUploads { get; set; }
        public List<SANTransaction> sANTransactions { get; set; }
        public List<GSTTransaction> gSTTransactions { get; set; }
        public List<Delinquency> delinquencies { get; set; }
        public string txt_custname { get; set; }
    }

    public class CustomerDetails
    {
        public string CustomerName { get; set; }
        public string LSID { get; set; }
    }

    public class DemographicReport
    {
        public string City { get; set; }
        public string Region { get; set; }
        public string Lasersoft_Id { get; set; }
    }

    public class FaciltyDtlReport
    {
        public string Facility { get; set; }
        public string Limit { get; set; }
        public string OS { get; set; }
        public string AC_Limit_Set_Date { get; set; }
        public string Initial_Limit_Set_Date { get; set; }
    }

    public class HousekeepingReport
    {
        public string Doc_Name { get; set; }
        public string Due_Date { get; set; }
    }

    public class OneViewIndicatorReport
    {
        public string First_time_7_dpd_date { get; set; }
        public string First_time_30_dpd_date { get; set; }
        public string First_time_Pot_NPA { get; set; }
        public string Current_Watchlist { get; set; }
        public string No_of_times_last_6_Watchlist { get; set; }
        public string Watchlist_Months { get; set; }
        public string Current_Low_Churning { get; set; }
        public string No_times_Last_6_Churn { get; set; }
        public string Low_Churn_Months { get; set; }
        public string Exit1 { get; set; }
        public string Plan_Avb { get; set; }
        public string Plan1 { get; set; }
        public string Current_Pot_NPA { get; set; }
        public string No_times_last_6_NPA { get; set; }
        public string Pot_NPA_Months { get; set; }
        public string Field1 { get; set; }
    }

    public class BGUpload
    {
        public string LS_ID { get; set; }
        public string CONTRACT_REF_NO { get; set; }
        public string APP { get; set; }
        public string BEN { get; set; }
        public string AVAILMENT_AMT { get; set; }
        public string Segment { get; set; }
        public string AVAILMENT_DATE { get; set; }
    }

    public class SANTransaction
    {
        public string LSID { get; set; }
        public string Cust_Name { get; set; }
        public string PAN { get; set; }
        public string BANK_NAME { get; set; }
        public string Month { get; set; }
        public string DATE_inserted { get; set; }
    }

    public class GSTTransaction
    {
        public string Month { get; set; }
        public string Name { get; set; }
        public string Accmo { get; set; }
        public string LSID { get; set; }
        public string Gst_AMOUNT { get; set; }
        public string DATE_inserted { get; set; }
    }

    public class Delinquency
    {
        public string AC_Contract_No { get; set; }
        public string Customer_Name { get; set; }
        public string SME_Client_ID { get; set; }
        public string DateOfTOD { get; set; }
        public string Curr_Overdue_AMT { get; set; }
        public string DPD { get; set; }
        public string Nature_of_Delq { get; set; }
        public string Currency_App_PDO_Loans_Bills { get; set; }
    }
}