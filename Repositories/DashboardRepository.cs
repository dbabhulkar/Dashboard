using Dashboard.Interfaces;
using Dashboard.Models;
using System.Data.SqlClient;
using System.Data;

namespace Dashboard.Repositories
{
    public class DashboardRepository : IDashboard
    {
        SqlConnection sqlCon = new SqlConnection(clsConnectionString.GetConnectionString());
        public DelinquencyDaysCount GetDelinquencyDaysCount(string UserId)
        {
            DelinquencyDaysCount Days_count = new DelinquencyDaysCount();
            DataSet ds = new DataSet();
            DataTable dt_count = new DataTable();
            SqlCommand cmd = new SqlCommand("SP_OVI_GetDelinquencyDaysCount", sqlCon);
            cmd.Parameters.AddWithValue("@UserID", UserId);
            cmd.CommandType = CommandType.StoredProcedure;
            SqlDataAdapter da = new SqlDataAdapter(cmd);
            if (sqlCon.State == ConnectionState.Closed)
            {
                sqlCon.Open();
            }
            da.Fill(ds);

            if (ds.Tables[0].Rows.Count > 0)
            {
                for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                {
                    Days_count.Days_15 = ds.Tables[0].Rows[i]["Days_15"].ToString() == "" ? "-" : ds.Tables[0].Rows[i]["Days_15"].ToString();
                    Days_count.Days_30 = ds.Tables[0].Rows[i]["Days_30"].ToString() == "" ? "-" : ds.Tables[0].Rows[i]["Days_30"].ToString();
                    Days_count.Days_60 = ds.Tables[0].Rows[i]["Days_60"].ToString() == "" ? "-" : ds.Tables[0].Rows[i]["Days_60"].ToString();
                    Days_count.UploadedDate = Convert.ToString(ds.Tables[0].Rows[i]["UploadedDate"]);
                }
            }
            else
            {
                Days_count.Days_15 = "-";
                Days_count.Days_30 = "-";
                Days_count.Days_60 = "-";
            }
            sqlCon.Close();
            return Days_count;
        }
        public List<DelinquencyDaysCount> GetDelinquencyDetails(string UserId)
        {
            List<DelinquencyDaysCount> DeliquencyList = new List<DelinquencyDaysCount>();
            //DelinquencyDaysCount Days_count = new DelinquencyDaysCount();
            DataSet ds = new DataSet();
            DataTable dt_count = new DataTable();
            SqlCommand cmd = new SqlCommand("SP_OVI_GetDelinquencyDashboardCount", sqlCon);
            cmd.Parameters.AddWithValue("@UserID", UserId);
            cmd.CommandType = CommandType.StoredProcedure;
            SqlDataAdapter da = new SqlDataAdapter(cmd);
            if (sqlCon.State == ConnectionState.Closed)
            {
                sqlCon.Open();
            }
            da.Fill(ds);
            if (ds.Tables[0].Rows.Count > 0)
            {
                for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                {
                    DelinquencyDaysCount objdeliquency = new DelinquencyDaysCount();
                    objdeliquency.Items = Convert.ToString(ds.Tables[0].Rows[i]["Items"]);
                    objdeliquency.No = Convert.ToInt32(ds.Tables[0].Rows[i]["No"]);
                    objdeliquency.Percent = Convert.ToDouble(ds.Tables[0].Rows[i]["Percent"]);
                    objdeliquency.Value = Convert.ToDouble(ds.Tables[0].Rows[i]["Value"]);
                    objdeliquency.UploadedDate = Convert.ToString(ds.Tables[0].Rows[i]["UploadedDate"]);

                    DeliquencyList.Add(objdeliquency);
                }
            }
            sqlCon.Close();
            return DeliquencyList;
        }
        public List<Compliance> GetComplianceItem(string UserId)
        {

            List<Compliance> compliances = new List<Compliance>();
            DataSet ds = new DataSet();
            DataTable dt_count = new DataTable();
            SqlCommand cmd = new SqlCommand("SP_OVI_GetComplianceList", sqlCon);
            cmd.Parameters.AddWithValue("@UserID", UserId);
            cmd.CommandType = CommandType.StoredProcedure;
            SqlDataAdapter da = new SqlDataAdapter(cmd);
            if (sqlCon.State == ConnectionState.Closed)
            {
                sqlCon.Open();
            }
            da.Fill(ds);

            if (ds.Tables[0].Rows.Count > 0)
            {
                for (int i = 0; i < ds.Tables[0].Rows.Count; i++)
                {
                    Compliance objCompliance = new Compliance();
                    objCompliance.ComplianceItem = Convert.ToString(ds.Tables[0].Rows[i]["Compliance_Item"]);
                    objCompliance.ItemCount = Convert.ToInt32(ds.Tables[0].Rows[i]["Cnt"]);
                    objCompliance.ItemDate = Convert.ToString(ds.Tables[0].Rows[i]["ItemDate"]);

                    compliances.Add(objCompliance);
                }

            }
            sqlCon.Close();
            return compliances;
        }

        public void CaptureProductivityDetails(SqlConnection Con, string Empcode, string Form_Name, string Module_Name, int Total_Count, string Activity, string Activity_Details)
        {
            try
            {
                if (Con.State == ConnectionState.Closed) { Con.Open(); }



                SqlCommand cmd = new SqlCommand("USP_Insert_Data_In_Activity_Log_Tracker", Con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add("@Emp_Code", SqlDbType.Text).Value = Empcode;
                cmd.Parameters.Add("@Form_Name", SqlDbType.Text).Value = Form_Name;
                cmd.Parameters.Add("@Module_Name", SqlDbType.Text).Value = Module_Name;
                cmd.Parameters.Add("@Total_Count", SqlDbType.Int).Value = Total_Count;
                cmd.Parameters.Add("@Activity", SqlDbType.Text).Value = Activity;
                cmd.Parameters.Add("@Activity_Details", SqlDbType.Text).Value = Activity_Details;



                cmd.CommandTimeout = 0;
                cmd.ExecuteNonQuery();
                cmd.Dispose();



                if (Con.State == ConnectionState.Open) { Con.Close(); }
            }
            catch (Exception ex)
            { }
        }

        public string ValidExcelRows(DataRow row, string tableName)
        {
            string errMsg = string.Empty;
            if (tableName == "TBL_OVI_Portfolio")
            {
                //1:"LSID",
                //2:"Fund_Limit",
                //3:"Non_Fund_Limit",
                //4:"Fund_Os",
                //5:"Non_Fund_Os",
                IDictionary<int, string> columnHeaderName = new Dictionary<int, string>();
                columnHeaderName.Add(new KeyValuePair<int, string>(1, "LSID"));
                columnHeaderName.Add(new KeyValuePair<int, string>(2, "Fund_Limit"));
                columnHeaderName.Add(new KeyValuePair<int, string>(3, "Non_Fund_Limit"));
                columnHeaderName.Add(new KeyValuePair<int, string>(4, "Fund_Os"));
                columnHeaderName.Add(new KeyValuePair<int, string>(5, "Non_Fund_Os"));

                for (int i = 0; i < row.ItemArray.Length; i++)
                {
                    if (row.ItemArray[i] == "" || row.ItemArray[i] == null)
                    {
                        errMsg += columnHeaderName[i + 1] + " should be not blank, ";
                    }
                    else
                    {
                        if (i != 0)
                        {
                            try
                            {
                                var valueColumn = Convert.ToDouble(row.ItemArray[i]);
                            }
                            catch (Exception)
                            {

                                errMsg += columnHeaderName[i + 1] + " should be only Number, ";
                            }

                        }

                    }

                }
            }
            return errMsg;
        }


        public DataTable GetUploadErrorList(string UserId, string procName)
        {
            DataTable dt = new DataTable();
            //DelinquencyDaysCount Days_count = new DelinquencyDaysCount();
            DataSet ds = new DataSet();
            DataTable dt_count = new DataTable();
            SqlCommand cmd = new SqlCommand(procName, sqlCon);
            cmd.Parameters.AddWithValue("@EmpCode", UserId);
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
            }
            sqlCon.Close();
            return dt;
        }
    }

}
