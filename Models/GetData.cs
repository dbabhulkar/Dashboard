using System.Data.SqlClient;
using System.Data;

namespace Dashboard.Models
{
    public class GetData
    {
        SqlConnection sqlCon = null;
        SqlCommand cmd = null;
        SqlDataAdapter sda = null;
        public PortfolioMain GetPortfolioMain(clsDashboardVariable clsDashboardVariable)
        {
            if (!clsDashboardVariable.Date.Contains("-") && clsDashboardVariable.Date != null)
            {
                clsDashboardVariable.Date = clsDashboardVariable.Date + "-" + DateTime.Now.Year.ToString();
            }
            PortfolioMain portfolioMain = new PortfolioMain();
            DateTime dateTime1 = new DateTime();
            dateTime1 = Convert.ToDateTime(clsDashboardVariable.Date);
            List<clsPortfolio> lstClsPortfolio = new List<clsPortfolio>();
            List<clsCode> lstclsCode = new List<clsCode>();
            try
            {
                //sqlCon = new SqlConnection(Startup.connectionstring);
                sqlCon = new SqlConnection(clsConnectionString.GetConnectionString());
                DataSet dt = new DataSet();
                cmd = new SqlCommand("SP_OVI_CMViewDashboardData", sqlCon);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@IdentFlag", clsDashboardVariable.Type);
                cmd.Parameters.AddWithValue("@CM_Code", clsDashboardVariable.EmployeeCode);
                cmd.Parameters.AddWithValue("@SelectedDate", dateTime1);
                if (clsDashboardVariable.Type == "DelinquencyData")
                {
                    cmd.Parameters.AddWithValue("@DelqFlag", clsDashboardVariable.FilterId);
                }
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
                        lstClsPortfolio.Add(clsPortfolio);
                    }
                }

                if (dt.Tables[2].Rows.Count > 0)
                {
                    foreach (DataRow row in dt.Tables[2].Rows)
                    {
                        clsCode clsCode = new clsCode();

                        clsCode.Segment = row["Segment"].ToString();
                        clsCode.Div = row["Div"].ToString();
                        clsCode.BackgroundColor = row["BackgroundColor"].ToString();
                        clsCode.HoverBackgroundColor = row["HoverBackgroundColor"].ToString();
                        lstclsCode.Add(clsCode);
                    }
                }

                portfolioMain.clsPortfolio = lstClsPortfolio;
                portfolioMain.clsCode = lstclsCode;
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

            return portfolioMain;
        }
    }
}